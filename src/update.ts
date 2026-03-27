import { S, sv, store, shake } from './state';
import { T, TILE_EXIT, TILE_CHEST, TILE_WATER, TILE_SPIKES, TILE_FLOOR, TILE_BREAKABLE } from './constants';
import { moveEntity, tileCollide, ov, separateEntities } from './collision';
import { updateFog, hasLOS } from './fog';
import { updateCamera } from './camera';
import { snd } from './audio';
import { tickMsg, updateHUD, setMsg, showPanel } from './ui';
import { writeSv } from './save';
import { mkEnemy } from './enemies';
import { burst, emitNoise, spawnDmg } from './combat';
import { onFloorExit } from './game-flow';
import { vampireHeal, toughMul } from './player';
import type { Particle, TileMap } from './types';

function breakWallsInRadius(cx: number, cy: number, radius: number, map: TileMap): void {
  const tx0 = Math.floor((cx - radius * T) / T);
  const ty0 = Math.floor((cy - radius * T) / T);
  const tx1 = Math.floor((cx + radius * T) / T);
  const ty1 = Math.floor((cy + radius * T) / T);
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      if (ty < 0 || ty >= map.length || tx < 0 || tx >= map[0].length) continue;
      if (map[ty][tx] === TILE_BREAKABLE) map[ty][tx] = TILE_FLOOR;
    }
  }
}

export function updateDungeon(): void {
  const G = store.G;
  if (!G || S.mode !== 'dungeon') return;
  const p = G.player, map = G.map;

  store.isSneaking = !!G.sneaking;
  const isSneaking = store.isSneaking;
  const dx = ((G.keys['KeyD'] || G.keys['ArrowRight']) ? 1 : 0) - ((G.keys['KeyA'] || G.keys['ArrowLeft']) ? 1 : 0);
  const dy = ((G.keys['KeyS'] || G.keys['ArrowDown']) ? 1 : 0) - ((G.keys['KeyW'] || G.keys['ArrowUp']) ? 1 : 0);

  p.blocking = !!G.rmb && p.stamina > 0 && p.dodgeT <= 0;
  if (p.blocking) {
    p.stamina = Math.max(0, p.stamina - 0.6);
    const enemyAttacking = G.enemies.some(e => e.atkState === 'windup');
    p.parryWindow = enemyAttacking && p.blocking ? 12 : Math.max(0, p.parryWindow - 1);
  } else {
    p.parryWindow = Math.max(0, p.parryWindow - 1);
    p.stamina = Math.min(p.maxStamina, p.stamina + 0.35);
  }

  if (p.dodgeT > 0) {
    p.dodgeT--;
    moveEntity(p, p.dodgeDx * p.spd * 2.2, p.dodgeDy * p.spd * 2.2, map);
  } else {
    // Water tile slows movement to 50%
    const onWater = map[Math.floor((p.y + p.h / 2) / T)]?.[Math.floor((p.x + p.w / 2) / T)] === TILE_WATER;
    const waterMul = onWater ? 0.5 : 1;
    const moveSpd = (p.blocking ? p.spd * 0.3 : isSneaking ? p.spd * 0.45 : p.spd) * waterMul;
    if (dx || dy) { const l = Math.hypot(dx, dy); moveEntity(p, dx / l * moveSpd, dy / l * moveSpd, map); }
  }
  if (p.dodgeCd > 0) p.dodgeCd--;
  G.isSneaking = isSneaking && !p.blocking && p.dodgeT <= 0;

  if (p.invincible > 0) p.invincible--;
  if (p.meleeCd > 0) p.meleeCd--;
  if (p.arrowCd > 0) p.arrowCd--;
  if (p.activeCd > 0) p.activeCd--;
  if (G.meleeFlash && G.meleeFlash.timer > 0) G.meleeFlash.timer--;

  updateCamera();
  updateFog();

  const ptx = Math.floor((p.x + p.w / 2) / T), pty = Math.floor((p.y + p.h / 2) / T);
  if (ptx >= 0 && ptx < map[0].length && pty >= 0 && pty < map.length) {
    const currentTile = map[pty][ptx];
    if (currentTile === TILE_EXIT) { onFloorExit(); return; }

    // Chest pickup
    if (currentTile === TILE_CHEST) {
      map[pty][ptx] = TILE_FLOOR;
      snd('loot');
      const roll = Math.random();
      if (roll < 0.5) {
        const g = 5 + Math.floor(Math.random() * 10) + G.floor;
        S.gold += g; sv.gold = S.gold;
        setMsg('Chest: +' + g + ' gold!', 1500);
      } else if (roll < 0.8) {
        const a = 5 + Math.floor(Math.random() * 10);
        p.arrows += a;
        setMsg('Chest: +' + a + ' arrows!', 1500);
      } else {
        const h = 10 + Math.floor(Math.random() * 15);
        p.hp = Math.min(p.hp + h, p.maxHp);
        setMsg('Chest: +' + h + ' HP!', 1500);
      }
      updateHUD();
    }

    // Spike damage (once per ~60 frames via spikeCd)
    if (currentTile === TILE_SPIKES && G.spikeCd <= 0 && p.invincible <= 0) {
      const dmg = 5 + G.floor;
      p.hp -= dmg;
      spawnDmg(p.x + p.w / 2, p.y, dmg, '#ff4444');
      p.invincible = 10;
      G.spikeCd = 50;
      snd('hurt'); shake(3);
      burst(p.x + p.w / 2, p.y + p.h / 2, '#ff4444', 4, 2);
      setMsg('Spike trap! -' + dmg + ' HP', 1000);
    }
  }
  if (G.spikeCd > 0) G.spikeCd--;

  const px = p.x + p.w / 2, py = p.y + p.h / 2;
  const playerDetectRange = isSneaking ? T * 4 : T * 7;

  G.enemies.forEach(e => {
    const ecx = e.x + e.w / 2, ecy = e.y + e.h / 2;
    const toPlayerDist = Math.hypot(px - ecx, py - ecy);
    const toPlayerAng = Math.atan2(py - ecy, px - ecx);
    const etx = Math.floor(ecx / T), ety = Math.floor(ecy / T);

    const inRange = toPlayerDist < playerDetectRange;
    const inLOS = inRange && hasLOS(etx, ety, ptx, pty, map);
    const coneHalf = e.tier === 'sniper' ? 0.55 : e.tier === 'boss' ? Math.PI : 1.22;
    const sniperRange = e.tier === 'sniper' ? T * 14 : playerDetectRange;
    const actualRange = e.tier === 'sniper' ? Math.min(toPlayerDist, sniperRange) : toPlayerDist;
    const angleDiff = Math.abs(((toPlayerAng - e.facing) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
    const inCone = angleDiff < coneHalf;
    const canSeePlayer = inLOS && (actualRange < (e.tier === 'sniper' ? sniperRange : playerDetectRange)) && (inCone || e.aiState === 'chase');

    if (canSeePlayer) {
      if (e.aiState === 'patrol') {
        e.aiState = 'suspect';
        e.suspectT = e.tier === 'charger' ? 20 : 40;
      } else if (e.aiState === 'suspect') {
        e.suspectT--;
        if (e.suspectT <= 0) {
          e.aiState = e._noiseCue ? 'search' : 'chase';
          e._noiseCue = false;
        }
      } else {
        e.aiState = 'chase';
      }
      e.searchX = px; e.searchY = py;
    } else {
      if (e.aiState === 'chase') {
        e.aiState = 'search';
        e.searchT = 180;
      } else if (e.aiState === 'search') {
        e.searchT--;
        if (e.searchT <= 0) e.aiState = 'patrol';
      } else if (e.aiState === 'suspect') {
        e.suspectT -= 3;
        if (e.suspectT <= 0) e.aiState = 'patrol';
      }
    }

    const ang = Math.atan2(py - ecy, px - ecx);
    const searchAng = Math.atan2(e.searchY - ecy, e.searchX - ecx);

    function turnToward(targetAng: number, turnRate: number) {
      const diff = ((targetAng - e.facing) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      const step = Math.min(Math.abs(diff), turnRate) * Math.sign(diff);
      e.facing += step;
    }

    // Movement per state
    if (e.tier === 'boss') {
      const sp = e.hp / e.maxHp < 0.5 ? 1.5 : 0.9;
      e.vx = (e.vx + Math.cos(ang) * 0.35) * 0.84;
      e.vy = (e.vy + Math.sin(ang) * 0.35) * 0.84;
      const cs = Math.hypot(e.vx, e.vy);
      if (cs > sp) { e.vx = e.vx / cs * sp; e.vy = e.vy / cs * sp; }
      if (!e.phase2 && e.hp / e.maxHp < 0.5) { e.phase2 = true; setMsg('The boss enrages!', 2000); }
      e.minionT--;
      if (e.minionT <= 0) {
        e.minionT = e.phase2 ? 100 : 200;
        if (G.enemies.length < 14) G.enemies.push(mkEnemy('minion', ecx + 20, ecy + 20, G.floor));
      }
      turnToward(ang, 0.12);
    } else if (e.aiState === 'chase') {
      if (e.tier === 'charger') {
        e.stateT--;
        if (e.chargeT > 0) { e.chargeT--; e.vx = e.chargeVx * 3; e.vy = e.chargeVy * 3; }
        else if (e.stateT <= 0) { e.chargeVx = Math.cos(ang); e.chargeVy = Math.sin(ang); e.chargeT = 14; e.stateT = 60 + Math.random() * 40; }
        else { e.vx = (e.vx + Math.cos(ang) * 0.2) * 0.87; e.vy = (e.vy + Math.sin(ang) * 0.2) * 0.87; }
      } else if (e.tier === 'sniper') {
        if (toPlayerDist < T * 5) { e.vx = (e.vx - Math.cos(ang) * 0.3) * 0.85; e.vy = (e.vy - Math.sin(ang) * 0.3) * 0.85; }
        else { e.vx *= 0.92; e.vy *= 0.92; }
      } else {
        e.vx = (e.vx + Math.cos(ang) * 0.25) * 0.88; e.vy = (e.vy + Math.sin(ang) * 0.25) * 0.88;
      }
      turnToward(ang, 0.15);
    } else if (e.aiState === 'suspect') {
      e.vx *= 0.7; e.vy *= 0.7;
      turnToward(toPlayerAng, 0.04);
    } else if (e.aiState === 'search') {
      const distToSearch = Math.hypot(e.searchX - ecx, e.searchY - ecy);
      if (distToSearch > T) {
        e.vx = (e.vx + Math.cos(searchAng) * 0.2) * 0.85;
        e.vy = (e.vy + Math.sin(searchAng) * 0.2) * 0.85;
        turnToward(searchAng, 0.08);
      } else {
        e.vx *= 0.5; e.vy *= 0.5;
        e.facing += 0.018;
      }
    } else {
      // Patrol
      if (!e.patrolTargetAngle) e.patrolTargetAngle = e.facing;
      const angleDiffToTarget = Math.abs(((e.patrolTargetAngle - e.facing) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      const reachedTarget = angleDiffToTarget < 0.05;
      if (reachedTarget) {
        e.patrolT--;
        if (e.patrolT <= 0) {
          const turn = (Math.random() < 0.5 ? 1 : -1) * (Math.PI * 0.33 + Math.random() * Math.PI * 0.5);
          e.patrolTargetAngle = e.facing + turn;
          e.patrolT = 80 + Math.floor(Math.random() * 120);
        }
        const fwd = e.patrolT > 60 ? 0 : 0.3;
        e.vx = Math.cos(e.patrolTargetAngle) * e.spd * fwd;
        e.vy = Math.sin(e.patrolTargetAngle) * e.spd * fwd;
      } else {
        turnToward(e.patrolTargetAngle, 0.025);
        const progress = 1 - angleDiffToTarget / Math.PI;
        e.vx = Math.cos(e.facing) * e.spd * 0.35 * progress;
        e.vy = Math.sin(e.facing) * e.spd * 0.35 * progress;
      }
      const wouldHitX = tileCollide({ x: e.x + e.vx * 4, y: e.y, w: e.w, h: e.h }, map);
      const wouldHitY = tileCollide({ x: e.x, y: e.y + e.vy * 4, w: e.w, h: e.h }, map);
      if (wouldHitX || wouldHitY) {
        if (wouldHitX) e.patrolTargetAngle = Math.PI - e.patrolTargetAngle + (Math.random() - 0.5) * 0.5;
        if (wouldHitY) e.patrolTargetAngle = -e.patrolTargetAngle + (Math.random() - 0.5) * 0.5;
        e.patrolT = 30;
      }
    }

    moveEntity(e, e.vx, e.vy, map);

    // Enemy attack FSM
    if (e.tier !== 'sniper' && e.aiState === 'chase') {
      const distP = Math.hypot(px - ecx, py - ecy);
      const meleeRange = e.tier === 'boss' ? T * 2.2 : T * 1.8;

      if (e.atkState === 'idle') {
        if (e.atkCd > 0) { e.atkCd--; }
        else if (distP < meleeRange && e.canBlock) {
          e.blocking = Math.random() < 0.4 && e.guardHP > 0;
        }
        if (!e.blocking && e.atkCd <= 0 && distP < meleeRange) {
          e.atkState = 'windup';
          e.atkT = e.windup || 20;
          e.strikeX = px; e.strikeY = py;
          e.blocking = false;
          e.vx *= 0.3; e.vy *= 0.3;
        }
      } else if (e.atkState === 'windup') {
        e.atkT--;
        e.vx *= 0.5; e.vy *= 0.5;
        if (e.atkT <= 0) {
          e.atkState = 'strike';
          e.atkT = e.strikeDur || 8;
          const sa = Math.atan2(e.strikeY - ecy, e.strikeX - ecx);
          e.vx = Math.cos(sa) * 2.5; e.vy = Math.sin(sa) * 2.5;
        }
      } else if (e.atkState === 'strike') {
        e.atkT--;
        const distPStrike = Math.hypot(px - ecx, py - ecy);
        if (distPStrike < meleeRange + T) {
          if (p.dodgeT > 0) {
            // dodge — miss
          } else if (p.parryWindow > 0) {
            e.atkState = 'recovery'; e.atkT = 70;
            e.vx = -e.vx * 3; e.vy = -e.vy * 3;
            burst(ecx, ecy, '#ffffff', 10, 4);
            snd('hit'); setMsg('Perfect parry!', 1500);
            p.parryWindow = 0;
          } else if (p.blocking && p.stamina > 0) {
            const cost = e.atk * 0.4;
            p.stamina = Math.max(0, p.stamina - cost);
            burst(px, py, '#4488ff', 4, 2); snd('hit');
            e.atkState = 'recovery'; e.atkT = 20;
            shake(2);
            if (p.stamina <= 0) { setMsg('Guard broken!', 1500); p.invincible = 30; }
          } else {
            const dmgMul2 = toughMul(p);
            const meleeDmg = e.atk * dmgMul2;
            p.hp -= meleeDmg;
            spawnDmg(px, p.y, meleeDmg, '#ff3300');
            p.invincible = 20; snd('hurt'); shake(e.tier === 'boss' ? 10 : 5);
            burst(px, py, '#ff3300', 6, 3);
            e.atkState = 'recovery'; e.atkT = e.strikeDur || 8;
          }
        }
        if (e.atkT <= 0) { e.atkState = 'recovery'; e.atkT = e.tier === 'boss' ? 30 : 20; }
      } else if (e.atkState === 'recovery') {
        e.atkT--; e.vx *= 0.8; e.vy *= 0.8;
        if (e.atkT <= 0) { e.atkState = 'idle'; e.atkCd = e.atkCdMax + Math.floor(Math.random() * 40); e.blocking = false; }
      }
    }

    // Snipers keep shooting in chase
    if (e.canShoot && e.aiState === 'chase') {
      e.shootT--;
      if (e.shootT <= 0) {
        e.shootT = (e.shootInt || 100) + Math.random() * 40;
        const ss = e.tier === 'boss' ? 3 : 2;
        G.projectiles.push({
          x: ecx, y: ecy, vx: Math.cos(ang) * ss, vy: Math.sin(ang) * ss,
          w: 6, h: 6, owner: 'enemy', dmg: e.atk, angle: ang,
          boss: e.tier === 'boss', explosive: false, reflected: false,
          shooterX: ecx, shooterY: ecy, ownerId: e,
        });
      }
    }
  });

  // Body collision
  for (let i = 0; i < G.enemies.length; i++)
    for (let j = i + 1; j < G.enemies.length; j++)
      separateEntities(G.enemies[i], G.enemies[j]);

  if (p.dodgeT <= 0) {
    G.enemies.forEach(e => {
      const acx = p.x + p.w / 2, acy = p.y + p.h / 2, bcx = e.x + e.w / 2, bcy = e.y + e.h / 2;
      const ddx = acx - bcx, ddy = acy - bcy, dist = Math.hypot(ddx, ddy) || 1;
      const minD = (p.w + e.w) / 2;
      if (dist >= minD) return;
      const push = minD - dist, nx2 = ddx / dist, ny2 = ddy / dist;
      const newX = p.x + nx2 * push, newY = p.y + ny2 * push;
      if (!tileCollide({ x: newX, y: p.y, w: p.w, h: p.h }, G.map)) p.x = newX;
      if (!tileCollide({ x: p.x, y: newY, w: p.w, h: p.h }, G.map)) p.y = newY;
    });
  }

  // Friendly fire avoidance push
  G.projectiles.forEach(pr => {
    if (pr.owner === 'player') return;
    const pspd = Math.hypot(pr.vx, pr.vy); if (pspd < 0.1) return;
    const pnx = pr.vx / pspd, pny = pr.vy / pspd;
    G.enemies.forEach(e => {
      if (e === pr.ownerId) return;
      const ecx2 = e.x + e.w / 2, ecy2 = e.y + e.h / 2;
      const toEx = ecx2 - pr.x, toEy = ecy2 - pr.y;
      const dot = toEx * pnx + toEy * pny;
      if (dot < 0 || dot > T * 8) return;
      const perpX = toEx - dot * pnx, perpY = toEy - dot * pny;
      const perpDist = Math.hypot(perpX, perpY);
      if (perpDist > T * 1.5) return;
      const pushStrength = 0.4 * (1 - perpDist / (T * 1.5));
      const pl2 = Math.hypot(perpX, perpY) || 1;
      e.vx += (perpX / pl2) * pushStrength;
      e.vy += (perpY / pl2) * pushStrength;
    });
  });

  // Projectiles
  G.projectiles = G.projectiles.filter(pr => {
    pr.x += pr.vx; pr.y += pr.vy;
    if (tileCollide({ x: pr.x - 2, y: pr.y - 2, w: 4, h: 4 }, map)) {
      burst(pr.x, pr.y, '#666', 3, 1.5);
      if (pr.owner === 'player' && !pr.reflected) {
        const wallNoiseR = pr.explosive ? 8 : 5;
        emitNoise(pr.x, pr.y, wallNoiseR, true);
        if (pr.explosive) {
          snd('explode'); burst(pr.x, pr.y, '#ff8800', 14, 5);
          G.enemies.forEach(e2 => { if (Math.hypot((e2.x + e2.w / 2) - pr.x, (e2.y + e2.h / 2) - pr.y) < T * 3) { e2.hp -= pr.dmg * 0.5; spawnDmg(e2.x + e2.w / 2, e2.y, pr.dmg * 0.5, '#ff8800'); } });
          breakWallsInRadius(pr.x, pr.y, 3, map);
        }
      } else if (pr.owner === 'enemy' || pr.reflected) {
        emitNoise(pr.x, pr.y, 3, true);
      }
      return false;
    }

    if (pr.owner === 'player' || pr.reflected) {
      for (let i = G.enemies.length - 1; i >= 0; i--) {
        if (ov(pr, G.enemies[i])) {
          const e2 = G.enemies[i];
          e2.hp -= pr.dmg; spawnDmg(e2.x + e2.w / 2, e2.y, pr.dmg, '#fff');
          e2.aiState = 'chase'; e2.searchX = px; e2.searchY = py; e2._noiseCue = false;
          if (pr.explosive) {
            snd('explode'); burst(pr.x, pr.y, '#ff8800', 12, 4);
            G.enemies.forEach(e3 => { if (Math.hypot((e3.x + e3.w / 2) - pr.x, (e3.y + e3.h / 2) - pr.y) < T * 3) { e3.hp -= pr.dmg * 0.5; spawnDmg(e3.x + e3.w / 2, e3.y, pr.dmg * 0.5, '#ff8800'); } });
            breakWallsInRadius(pr.x, pr.y, 3, map);
          } else {
            burst(pr.x, pr.y, pr.reflected ? '#ffd700' : '#ffcc00', 5, 2);
          }
          snd('hit'); return false;
        }
      }
    } else {
      if (ov(pr, p) && p.invincible <= 0) {
        if (p.dodgeT > 0) return false;
        const dmgMul = toughMul(p);
        if (p.blocking && p.stamina > 0) {
          p.stamina = Math.max(0, p.stamina - pr.dmg * 0.5);
          burst(pr.x, pr.y, '#4488ff', 4, 2); snd('hit'); shake(3);
          return false;
        }
        const prDmg = pr.dmg * (pr.boss ? 1.3 : 1) * dmgMul;
        p.hp -= prDmg;
        spawnDmg(px, p.y, prDmg, '#ff3300');
        p.invincible = 20; snd('hurt'); shake(pr.boss ? 8 : 4);
        burst(pr.x, pr.y, '#ff3300', 5, 3); return false;
      }
      for (let i = G.enemies.length - 1; i >= 0; i--) {
        const ef = G.enemies[i];
        if (ef === pr.ownerId) continue;
        if (ov(pr, ef)) {
          ef.hp -= pr.dmg * 0.8;
          spawnDmg(ef.x + ef.w / 2, ef.y, pr.dmg * 0.8, '#ff8844');
          burst(pr.x, pr.y, '#ff8844', 4, 2);
          snd('hit');
          ef.aiState = 'suspect'; ef.suspectT = 40;
          return false;
        }
      }
    }

    if (Math.hypot(pr.x - px, pr.y - py) > T * 25) return false;
    return true;
  });

  // Deaths
  G.enemies.filter(e => e.hp <= 0).forEach(e => {
    const ecx = e.x + e.w / 2, ecy = e.y + e.h / 2;
    const g = (e.tier === 'boss' ? 40 : e.tier === 'elite' ? 12 : e.tier === 'splitter' ? 7 : 3) + G.goldBonus;
    S.gold += g; sv.gold = S.gold;
    S.run.kills++; S.run.goldEarned += g;
    const vheal = vampireHeal(p);
    if (vheal > 0) p.hp = Math.min(p.hp + vheal, p.maxHp);
    burst(ecx, ecy, e.tier === 'boss' ? '#ff2200' : e.tier === 'elite' ? '#aa44ff' : '#ffd700', e.tier === 'boss' ? 18 : 8, 3);
    snd('die');
    if (e.tier === 'boss') shake(12);
    if (e.tier === 'splitter' && !e._split) {
      e._split = true;
      G.enemies.push(mkEnemy('minion', ecx - 10, ecy, G.floor));
      G.enemies.push(mkEnemy('minion', ecx + 10, ecy, G.floor));
    }
  });
  G.enemies = G.enemies.filter(e => e.hp > 0);

  // Caltrops: damage + slow enemies
  G.caltrops = G.caltrops.filter(c => {
    c.life--;
    G.enemies.forEach(e => {
      if (ov(c, e)) {
        e.vx *= 0.4; e.vy *= 0.4;
        if (c.life % 30 === 0) {
          const cdmg = 3 + G.floor;
          e.hp -= cdmg;
          spawnDmg(e.x + e.w / 2, e.y, cdmg, '#aaaaaa');
          burst(e.x + e.w / 2, e.y + e.h / 2, '#888', 3, 1.5);
        }
      }
    });
    return c.life > 0;
  });

  G.particles = G.particles.filter((pt: Particle) => {
    if (pt.type === 'ripple') {
      pt.r += pt.maxR * 0.06;
      pt.life -= 0.045;
      return pt.life > 0;
    }
    if (pt.type === 'dmg') {
      pt.y += pt.vy; pt.life -= 0.025;
      return pt.life > 0;
    }
    pt.x += pt.vx; pt.y += pt.vy; pt.vx *= 0.9; pt.vy *= 0.9; pt.life -= 0.04;
    return pt.life > 0;
  });

  if (p.hp <= 0) {
    p.hp = 0; S.mode = 'dead'; sv.gold = S.gold; writeSv();
    const elapsed = Date.now() - S.run.startTime;
    const mins = Math.floor(elapsed / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);
    const isNewBest = G.floor > sv.bestFloor;
    if (G.floor > sv.bestFloor) sv.bestFloor = G.floor;
    if (S.run.kills > sv.bestKills) sv.bestKills = S.run.kills;
    if (S.run.goldEarned > sv.bestGold) sv.bestGold = S.run.goldEarned;
    writeSv();
    document.getElementById('deathMsg')!.innerHTML =
      `<div style="text-align:left;display:inline-block;line-height:1.8">` +
      `⚔ Floor reached: <b style="color:#fff">${G.floor}</b>${isNewBest ? ' <span style="color:#ffd700">★ NEW BEST</span>' : ''}<br>` +
      `💀 Enemies slain: <b style="color:#fff">${S.run.kills}</b><br>` +
      `💰 Gold earned: <b style="color:#ffd700">${S.run.goldEarned}</b><br>` +
      `⏱ Time: <b style="color:#fff">${mins}m ${secs}s</b>` +
      `</div><br><br>Gold is kept. Return to town.`;
    showPanel('deathPanel'); updateHUD();
  }

  tickMsg(); updateHUD();
}
