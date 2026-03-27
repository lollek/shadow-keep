import type { Particle, DmgParticle } from './types';
import { store } from './state';
import { T, UI_HEIGHT, TILE_BREAKABLE, TILE_FLOOR, ACTIVE_ITEMS, WEAPONS, TILE_WALL } from './constants';
import { RENDER_SCALE } from './canvas';
import { snd } from './audio';
import { setMsg, updateHUD } from './ui';
import { moveEntity, ov } from './collision';
import { vampireHeal } from './player';

export function burst(x: number, y: number, col: string, n: number, sp = 3): void {
  const G = store.G!;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 0.4 + Math.random() * sp;
    G.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color: col });
  }
}

export function spawnDmg(x: number, y: number, dmg: number, color = '#fff'): void {
  const G = store.G!;
  G.particles.push({
    type: 'dmg', x: x + (Math.random() - 0.5) * 8, y,
    vy: -0.8 - Math.random() * 0.4,
    life: 1, text: String(Math.round(dmg)), color,
  } as DmgParticle as Particle);
}

export function emitNoise(nx: number, ny: number, noiseR: number, investigateSource: boolean): void {
  const G = store.G!;
  G.particles.push({ type: 'ripple', x: nx, y: ny, r: 0, maxR: noiseR * T, life: 1 } as Particle);

  G.enemies.forEach(e => {
    if (e.aiState === 'chase') return;
    const dist = Math.hypot((e.x + e.w / 2) - nx, (e.y + e.h / 2) - ny);
    if (dist > noiseR * T) return;
    if (e.aiState === 'patrol' || e.aiState === 'search') {
      e.aiState = 'suspect';
      e.suspectT = 50;
    }
    if (investigateSource) {
      e.searchX = nx; e.searchY = ny;
    } else {
      const p = G.player;
      e.searchX = p.x + p.w / 2; e.searchY = p.y + p.h / 2;
    }
    e._noiseCue = true;
  });
}

function meleePathBlocked(x0: number, y0: number, x1: number, y1: number): boolean {
  const G = store.G!;
  const map = G.map;
  const dist = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.max(1, Math.ceil(dist / 6));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const sx = x0 + (x1 - x0) * t;
    const sy = y0 + (y1 - y0) * t;
    const tx = Math.floor(sx / T);
    const ty = Math.floor(sy / T);
    if (ty < 0 || ty >= map.length || tx < 0 || tx >= map[0].length) return true;
    const tile = map[ty][tx];
    if (tile === TILE_WALL || tile === TILE_BREAKABLE) return true;
  }
  return false;
}

export function doMelee(): void {
  const G = store.G!;
  const p = G.player;
  if (p.meleeCd > 0 || p.dodgeT > 0) return;
  const weapon = WEAPONS[p.weapon];
  p.meleeCd = weapon.meleeCd; snd('melee');
  const px = p.x + p.w / 2, py = p.y + p.h / 2;
  const wx = G.mouse.x / RENDER_SCALE + G.cam.x, wy = (G.mouse.y - UI_HEIGHT) / RENDER_SCALE + G.cam.y;
  const ang = Math.atan2(wy - py, wx - px);
  const baseDmg = Math.max(1, Math.round(p.atk * weapon.damageMul));
  let hit = false;
  let resetChain = false;

  G.enemies.forEach(e => {
    const ecx = e.x + e.w / 2, ecy = e.y + e.h / 2;
    const dist = Math.hypot(ecx - px, ecy - py);
    if (dist > T * weapon.meleeRange) return;
    if (meleePathBlocked(px, py, ecx, ecy)) return;
    const ea = Math.atan2(ecy - py, ecx - px);
    if (Math.abs(((ea - ang) + Math.PI * 3) % (Math.PI * 2) - Math.PI) > weapon.meleeArc) return;

    const behindAngle = Math.abs(((ang - e.facing) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
    const isBackstab = behindAngle < 0.9 && e.aiState !== 'chase';
    const inRecovery = e.atkState === 'recovery';

    if (e.canBlock && e.blocking && !isBackstab) {
      e.guardHP--;
      burst(ecx, ecy, '#88aaff', 4, 2);
      snd('hit');
      if (e.guardHP <= 0) {
        e.blocking = false; e.guardHP = 0;
        e.atkState = 'recovery'; e.atkT = 60;
        setMsg('Guard broken!', 1500);
        burst(ecx, ecy, '#ffffff', 8, 4);
      }
      hit = true;
      return;
    }

    let dmg = baseDmg;
    if (isBackstab) { dmg = Math.floor(baseDmg * weapon.backstabMul); burst(ecx, ecy, '#ffaa00', 10, 4); setMsg('Backstab!', 1200); }
    else if (inRecovery) { dmg = Math.floor(baseDmg * 1.5); burst(ecx, ecy, '#ff8800', 7, 3); setMsg('Counter!', 1000); }

    e.hp -= dmg;
    const dmgCol = isBackstab ? '#ffdd00' : inRecovery ? '#ff8800' : '#fff';
    spawnDmg(ecx, ecy - e.h / 2, dmg, dmgCol);
    e.vx = Math.cos(ang) * weapon.knockback; e.vy = Math.sin(ang) * weapon.knockback;
    e.aiState = 'chase'; e.searchX = px; e.searchY = py; e._noiseCue = false;
    e.atkState = 'idle'; e.atkT = 30;
    burst(ecx, ecy, '#ff4444', 5); hit = true;
    if (weapon.killResetOnMeleeKill && e.hp <= 0) resetChain = true;
    const vheal = vampireHeal(p);
    if (vheal > 0) p.hp = Math.min(p.hp + vheal, p.maxHp);

    G.enemies.forEach(n => {
      if (n !== e && Math.hypot((n.x + n.w / 2) - ecx, (n.y + n.h / 2) - ecy) < T * 6) {
        if (n.aiState !== 'chase') { n.aiState = 'suspect'; n.suspectT = 30; n.searchX = px; n.searchY = py; }
      }
    });
  });

  if (hit) snd('hit');
  if (resetChain) p.meleeCd = 0;
  G.meleeFlash = { angle: ang, timer: 10 };
  emitNoise(px, py, store.isSneaking ? 3 : 5, false);

  let reflected = false;
  G.projectiles.forEach(pr => {
    if (pr.owner === 'player' || pr.reflected) return;
    const pdist = Math.hypot(pr.x - px, pr.y - py);
    if (pdist > T * 3.5) return;
    const pa = Math.atan2(pr.y - py, pr.x - px);
    if (Math.abs(((pa - ang) + Math.PI * 3) % (Math.PI * 2) - Math.PI) > 1.3) return;
    pr.vx = -pr.vx * 1.1; pr.vy = -pr.vy * 1.1;
    pr.angle = Math.atan2(pr.vy, pr.vx);
    pr.owner = 'player';
    pr.reflected = true;
    pr.dmg *= 1.2;
    burst(pr.x, pr.y, '#ffffff', 6, 2);
    burst(pr.x, pr.y, '#ffd700', 4, 3);
    reflected = true;
  });
  if (reflected) setMsg('Reflected!', 1000);

  // Break breakable walls in melee direction
  for (let d = 1; d <= 3; d++) {
    const btx = Math.floor((px + Math.cos(ang) * T * d) / T);
    const bty = Math.floor((py + Math.sin(ang) * T * d) / T);
    if (bty >= 0 && bty < G.map.length && btx >= 0 && btx < G.map[0].length && G.map[bty][btx] === TILE_BREAKABLE) {
      G.map[bty][btx] = TILE_FLOOR;
      burst(btx * T + T / 2, bty * T + T / 2, '#886644', 10, 4);
      snd('hit');
      break;
    }
  }
}

export function doShoot(): void {
  const G = store.G!;
  const p = G.player;
  if (p.arrowCd > 0 || p.dodgeT > 0) return;
  if (p.arrows <= 0) { setMsg('No shuriken!', 900); return; }
  p.arrows--; p.arrowCd = 16; snd('shoot');
  const wx = G.mouse.x / RENDER_SCALE + G.cam.x, wy = (G.mouse.y - UI_HEIGHT) / RENDER_SCALE + G.cam.y;
  const ang = Math.atan2(wy - (p.y + p.h / 2), wx - (p.x + p.w / 2));
  const spd = p.items.includes('fastarrows') ? 3.5 : 2.5;
  const expl = p.items.includes('explosive');
  G.projectiles.push({
    x: p.x + p.w / 2, y: p.y + p.h / 2,
    vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
    w: 6, h: 4, owner: 'player', dmg: p.atk * 0.85, angle: ang,
    explosive: expl, boss: false, reflected: false, shooterX: 0, shooterY: 0, ownerId: null,
  });
  updateHUD();
}

export function doDodge(): void {
  const G = store.G!;
  const p = G.player;
  if (p.dodgeCd > 0 || p.dodgeT > 0 || p.stamina < 20) return;
  const dx = ((G.keys['KeyD'] || G.keys['ArrowRight']) ? 1 : 0) - ((G.keys['KeyA'] || G.keys['ArrowLeft']) ? 1 : 0);
  const dy = ((G.keys['KeyS'] || G.keys['ArrowDown']) ? 1 : 0) - ((G.keys['KeyW'] || G.keys['ArrowUp']) ? 1 : 0);
  const wx = G.mouse.x / RENDER_SCALE + G.cam.x, wy = (G.mouse.y - UI_HEIGHT) / RENDER_SCALE + G.cam.y;
  const ppx = p.x + p.w / 2, ppy = p.y + p.h / 2;
  let ddx = dx, ddy = dy;
  if (!dx && !dy) { const a = Math.atan2(wy - ppy, wx - ppx) + Math.PI; ddx = Math.cos(a); ddy = Math.sin(a); }
  const l = Math.hypot(ddx, ddy) || 1;
  p.dodgeDx = ddx / l; p.dodgeDy = ddy / l;
  p.dodgeT = 14;
  p.dodgeCd = 45;
  p.stamina = Math.max(0, p.stamina - 20);
  p.invincible = 14;
  snd('melee');
}

export function useActiveItem(): void {
  const G = store.G!;
  const p = G.player;
  if (!p.activeItem || p.activeCd > 0 || p.dodgeT > 0) return;

  const def = ACTIVE_ITEMS[p.activeItem];
  p.activeCd = def.cd;

  const px = p.x + p.w / 2, py = p.y + p.h / 2;
  const wx = G.mouse.x / RENDER_SCALE + G.cam.x, wy = (G.mouse.y - UI_HEIGHT) / RENDER_SCALE + G.cam.y;
  const ang = Math.atan2(wy - py, wx - px);

  if (p.activeItem === 'smoke') {
    // Smoke bomb: reset all enemies in radius to patrol, spawn visual
    const radius = T * 6;
    burst(px, py, '#888888', 20, 5);
    burst(px, py, '#aaaaaa', 15, 4);
    G.particles.push({ type: 'ripple', x: px, y: py, r: 0, maxR: radius, life: 1 } as Particle);
    G.enemies.forEach(e => {
      const dist = Math.hypot((e.x + e.w / 2) - px, (e.y + e.h / 2) - py);
      if (dist < radius) {
        e.aiState = 'patrol'; e.suspectT = 0; e.searchT = 0;
        e._noiseCue = false;
      }
    });
    snd('explode');
    setMsg('Smoke bomb!', 1200);
  } else if (p.activeItem === 'dash') {
    // Dash strike: lunge toward mouse, deal 2x damage to first enemy hit
    const dashDist = T * 4;
    const steps = 16;
    const stepX = Math.cos(ang) * dashDist / steps;
    const stepY = Math.sin(ang) * dashDist / steps;
    let hitEnemy = false;
    for (let i = 0; i < steps; i++) {
      moveEntity(p, stepX, stepY, G.map);
      if (!hitEnemy) {
        for (const e of G.enemies) {
          if (ov(p, e)) {
            const dmg = Math.floor(p.atk * 2);
            e.hp -= dmg;
            spawnDmg(e.x + e.w / 2, e.y, dmg, '#ffdd00');
            burst(e.x + e.w / 2, e.y + e.h / 2, '#ffdd00', 10, 4);
            e.aiState = 'chase'; e._noiseCue = false;
            e.vx = Math.cos(ang) * 6; e.vy = Math.sin(ang) * 6;
            hitEnemy = true;
            break;
          }
        }
      }
    }
    p.invincible = 10;
    burst(px, py, '#4488ff', 8, 3);
    snd('melee');
    setMsg(hitEnemy ? 'Dash strike!' : 'Dash!', 1000);
  } else if (p.activeItem === 'caltrops') {
    // Drop caltrops behind player
    G.caltrops.push({ x: px - 8, y: py - 8, w: 16, h: 16, life: 600 });
    burst(px, py, '#888', 6, 2);
    snd('hit');
    setMsg('Caltrops deployed!', 1000);
  }
  updateHUD();
}
