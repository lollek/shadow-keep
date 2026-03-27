import type { Particle } from './types';
import { store } from './state';
import { T, UI_HEIGHT, TILE_BREAKABLE, TILE_FLOOR } from './constants';
import { snd } from './audio';
import { setMsg, updateHUD } from './ui';

export function burst(x: number, y: number, col: string, n: number, sp = 3): void {
  const G = store.G!;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 0.4 + Math.random() * sp;
    G.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color: col });
  }
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

export function doMelee(): void {
  const G = store.G!;
  const p = G.player;
  if (p.meleeCd > 0 || p.dodgeT > 0) return;
  p.meleeCd = 28; snd('melee');
  const px = p.x + p.w / 2, py = p.y + p.h / 2;
  const wx = G.mouse.x + G.cam.x, wy = G.mouse.y + G.cam.y - UI_HEIGHT;
  const ang = Math.atan2(wy - py, wx - px);
  let hit = false;

  G.enemies.forEach(e => {
    const ecx = e.x + e.w / 2, ecy = e.y + e.h / 2;
    const dist = Math.hypot(ecx - px, ecy - py);
    if (dist > T * 3) return;
    const ea = Math.atan2(ecy - py, ecx - px);
    if (Math.abs(((ea - ang) + Math.PI * 3) % (Math.PI * 2) - Math.PI) > 1.2) return;

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

    let dmg = p.atk;
    if (isBackstab) { dmg = Math.floor(p.atk * 2.5); burst(ecx, ecy, '#ffaa00', 10, 4); setMsg('Backstab!', 1200); }
    else if (inRecovery) { dmg = Math.floor(p.atk * 1.5); burst(ecx, ecy, '#ff8800', 7, 3); setMsg('Counter!', 1000); }

    e.hp -= dmg;
    e.vx = Math.cos(ang) * 4; e.vy = Math.sin(ang) * 4;
    e.aiState = 'chase'; e.searchX = px; e.searchY = py; e._noiseCue = false;
    e.atkState = 'idle'; e.atkT = 30;
    burst(ecx, ecy, '#ff4444', 5); hit = true;
    if (p.items.includes('vampire')) p.hp = Math.min(p.hp + 3, p.maxHp);

    G.enemies.forEach(n => {
      if (n !== e && Math.hypot((n.x + n.w / 2) - ecx, (n.y + n.h / 2) - ecy) < T * 6) {
        if (n.aiState !== 'chase') { n.aiState = 'suspect'; n.suspectT = 30; n.searchX = px; n.searchY = py; }
      }
    });
  });

  if (hit) snd('hit');
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
  if (p.arrows <= 0) { setMsg('No arrows!', 900); return; }
  p.arrows--; p.arrowCd = 16; snd('shoot');
  const wx = G.mouse.x + G.cam.x, wy = G.mouse.y + G.cam.y - UI_HEIGHT;
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
  const wx = G.mouse.x + G.cam.x, wy = G.mouse.y + G.cam.y - UI_HEIGHT;
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
