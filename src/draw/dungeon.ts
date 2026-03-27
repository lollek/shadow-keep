import { store } from '../state';
import { ctx, canvas, viewW, viewH, RENDER_SCALE } from '../canvas';
import { T, UI_HEIGHT, TILE_WATER, TILE_SPIKES, TILE_CHEST, TILE_BREAKABLE, WEAPONS } from '../constants';
import { drawEnemy } from './enemies';
import { drawProjectile } from './projectiles';
import { drawPlayer } from './player';
import type { Particle } from '../types';

function drawWeaponTelegraph(wAng: number, alpha: number): void {
  const G = store.G!;
  const p = G.player;
  const weapon = WEAPONS[p.weapon];
  const reach = T * weapon.meleeRange;
  const arc = weapon.meleeArc;
  const innerReach = Math.max(T * 0.75, reach * (weapon.meleeArc < 0.7 ? 0.58 : 0.33));

  ctx.save();
  ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

  ctx.globalAlpha = 0.04 * alpha;
  ctx.fillStyle = '#c9a446';
  ctx.beginPath();
  ctx.moveTo(Math.cos(wAng - arc) * innerReach, Math.sin(wAng - arc) * innerReach);
  ctx.arc(0, 0, reach, wAng - arc, wAng + arc);
  ctx.lineTo(Math.cos(wAng + arc) * innerReach, Math.sin(wAng + arc) * innerReach);
  ctx.arc(0, 0, innerReach, wAng + arc, wAng - arc, true);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.25 * alpha;
  ctx.strokeStyle = '#c9a446';
  ctx.lineWidth = weapon.meleeArc < 0.7 ? 2 : 2.4;
  ctx.beginPath();
  ctx.arc(0, 0, reach, wAng - arc, wAng + arc);
  ctx.stroke();

  ctx.globalAlpha = 0.16 * alpha;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, innerReach, wAng - arc, wAng + arc);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(Math.cos(wAng - arc) * innerReach, Math.sin(wAng - arc) * innerReach);
  ctx.lineTo(Math.cos(wAng - arc) * reach, Math.sin(wAng - arc) * reach);
  ctx.moveTo(Math.cos(wAng + arc) * innerReach, Math.sin(wAng + arc) * innerReach);
  ctx.lineTo(Math.cos(wAng + arc) * reach, Math.sin(wAng + arc) * reach);
  ctx.stroke();

  ctx.globalAlpha = 0.28 * alpha;
  ctx.fillStyle = '#e6cf8a';
  ctx.beginPath();
  ctx.arc(Math.cos(wAng) * reach, Math.sin(wAng) * reach, weapon.meleeArc < 0.7 ? 3.2 : 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawDungeon(): void {
  const G = store.G;
  if (!G) return;
  const vw = viewW(), vh = viewH();
  let sx = 0, sy = 0;
  if (store.shakeT > 0) {
    store.shakeT--;
    sx = store.shakeX * (store.shakeT / 8);
    sy = store.shakeY * (store.shakeT / 8);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(0, UI_HEIGHT);
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  ctx.translate(Math.round(-G.cam.x + sx), Math.round(-G.cam.y + sy));

  const map = G.map, fog = G.fog;
  const mapH = map.length, mapW = map[0].length;

  const tx0 = Math.max(0, Math.floor(G.cam.x / T) - 1);
  const ty0 = Math.max(0, Math.floor(G.cam.y / T) - 1);
  const tx1 = Math.min(mapW - 1, Math.ceil((G.cam.x + vw) / T) + 1);
  const ty1 = Math.min(mapH - 1, Math.ceil((G.cam.y + vh) / T) + 1);

  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const f = fog[ty]?.[tx] ?? 0;
      if (f === 0) continue;
      const tile = map[ty][tx];
      const px = tx * T, py = ty * T;
      const dim = f === 1 ? 0.35 : 1;

      ctx.globalAlpha = dim;
      const theme = G.theme;
      if (tile === 0 || tile === TILE_BREAKABLE) {
        const ci = ((tx * 3 + ty * 7) % 5 + 5) % 5;
        ctx.fillStyle = theme.wallCols[ci];
        ctx.fillRect(px, py, T, T);
        if (tile === TILE_BREAKABLE) {
          ctx.globalAlpha = dim * 0.6;
          ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px + 4, py + 2); ctx.lineTo(px + T / 2, py + T / 2);
          ctx.lineTo(px + T - 3, py + 5); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(px + T / 2, py + T / 2); ctx.lineTo(px + 6, py + T - 4); ctx.stroke();
        } else if (ty + 1 < mapH && map[ty + 1][tx] !== 0) {
          ctx.fillStyle = 'rgba(160,100,40,0.35)';
          ctx.fillRect(px, py, T, 3);
        }
      } else {
        const ci = ((tx * 5 + ty * 11) % 5 + 5) % 5;
        ctx.fillStyle = theme.floorCols[ci];
        ctx.fillRect(px, py, T, T);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(px, py, T, 1); ctx.fillRect(px, py, 1, T);
        if (tile === 2) {
          ctx.globalAlpha = dim;
          const sealed = G.mode === 'boss' && !G.bossDefeated;
          ctx.fillStyle = sealed ? '#3a1616' : '#1a3a20';
          ctx.fillRect(px + 1, py + 1, T - 2, T - 2);
          const pulse = 0.7 + Math.sin(Date.now() * 0.004) * 0.3;
          ctx.globalAlpha = dim * pulse;
          ctx.fillStyle = sealed ? '#ff6655' : '#33ff88';
          ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
          ctx.fillText(sealed ? '✕' : '▼', px + T / 2, py + T / 2 + 4);
          ctx.globalAlpha = dim * 0.5;
          ctx.strokeStyle = sealed ? '#ff7766' : '#44ffaa'; ctx.lineWidth = 1.5;
          ctx.strokeRect(px + 2, py + 2, T - 4, T - 4);
          if (sealed) {
            ctx.globalAlpha = dim * 0.75;
            ctx.strokeStyle = '#ff5544'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px + 5, py + 4); ctx.lineTo(px + 5, py + T - 4);
            ctx.moveTo(px + T - 5, py + 4); ctx.lineTo(px + T - 5, py + T - 4);
            ctx.moveTo(px + T / 2, py + 4); ctx.lineTo(px + T / 2, py + T - 4);
            ctx.stroke();
          }
        } else if (tile === TILE_WATER) {
          ctx.globalAlpha = dim * 0.45;
          ctx.fillStyle = theme.waterCol;
          ctx.fillRect(px, py, T, T);
          const ripple = Math.sin(Date.now() * 0.003 + tx * 2 + ty * 3) * 0.15;
          ctx.globalAlpha = dim * (0.2 + ripple);
          ctx.fillStyle = '#fff';
          ctx.fillRect(px + 6, py + 4 + Math.sin(Date.now() * 0.002 + tx) * 2, 4, 2);
        } else if (tile === TILE_SPIKES) {
          ctx.globalAlpha = dim;
          ctx.fillStyle = theme.spikeCol;
          const glint = 0.6 + Math.sin(Date.now() * 0.005 + tx + ty) * 0.4;
          ctx.globalAlpha = dim * glint;
          for (let i = 0; i < 4; i++) {
            const spx = px + 3 + (i % 2) * (T / 2), spy = py + 3 + Math.floor(i / 2) * (T / 2);
            ctx.beginPath();
            ctx.moveTo(spx, spy + 8); ctx.lineTo(spx + 4, spy); ctx.lineTo(spx + 8, spy + 8);
            ctx.fill();
          }
        } else if (tile === TILE_CHEST) {
          ctx.globalAlpha = dim;
          ctx.fillStyle = '#8B6914';
          ctx.fillRect(px + 4, py + 6, T - 8, T - 10);
          ctx.fillStyle = '#DAA520';
          ctx.fillRect(px + 5, py + 7, T - 10, T - 12);
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(px + T / 2 - 2, py + T / 2 - 1, 4, 4);
          ctx.fillStyle = '#8B6914';
          ctx.fillRect(px + 4, py + T / 2 - 1, T - 8, 2);
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  // Particles
  G.particles.forEach((pt: Particle) => {
    if (pt.type === 'dmg') {
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(pt.text, pt.x + 1, pt.y + 1);
      ctx.fillStyle = pt.color;
      ctx.fillText(pt.text, pt.x, pt.y);
      ctx.globalAlpha = 1;
      return;
    }
    ctx.globalAlpha = Math.max(0, pt.life);
    ctx.fillStyle = pt.color;
    const s = 1.5 + pt.life * 2;
    ctx.fillRect(pt.x - s / 2, pt.y - s / 2, s, s);
  });
  ctx.globalAlpha = 1;

  // Enemies
  G.enemies.forEach(e => {
    const etx = Math.floor((e.x + e.w / 2) / T), ety = Math.floor((e.y + e.h / 2) / T);
    const ef = fog[ety]?.[etx] ?? 0;
    if (ef < 2 && e.tier !== 'boss') return;
    drawEnemy(e);
  });

  // Caltrops
  G.caltrops.forEach(c => {
    ctx.globalAlpha = Math.min(1, c.life / 60);
    ctx.fillStyle = '#777';
    const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      const r = 5;
      ctx.fillRect(cx + Math.cos(a) * r - 1, cy + Math.sin(a) * r - 1, 3, 3);
    }
    ctx.globalAlpha = 1;
  });

  // Projectiles
  G.projectiles.forEach(drawProjectile);

  // Player
  const p = G.player;
  const wx = G.mouse.x / RENDER_SCALE + G.cam.x, wy = (G.mouse.y - UI_HEIGHT) / RENDER_SCALE + G.cam.y;
  const wAng = Math.atan2(wy - (p.y + p.h / 2), wx - (p.x + p.w / 2));
  const weaponAng = p.meleeWindup > 0
    ? p.meleeAim
    : G.meleeFlash && G.meleeFlash.timer > 0
      ? G.meleeFlash.angle
      : wAng;
  const flash = p.invincible > 0 && Math.floor(p.invincible / 3) % 2 === 0;
  const swingT = G.meleeFlash && G.meleeFlash.timer > 0 ? G.meleeFlash.timer / G.meleeFlash.maxTimer : 0;
  if (G.isSneaking) ctx.globalAlpha = 0.65;
  if (p.dodgeT > 0) ctx.globalAlpha = 0.5 + p.dodgeT / 14 * 0.5;
  drawPlayer(p, weaponAng, flash, swingT, Math.cos(wAng) >= 0);
  ctx.globalAlpha = 1;
  if (G.isSneaking) {
    ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(150,220,255,0.7)';
    ctx.fillText('SNEAKING', p.x + p.w / 2, p.y - 10);
  }
  if (p.blocking && p.stamina <= 0) {
    ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,100,100,0.9)';
    ctx.fillText('GUARD BROKEN', p.x + p.w / 2, p.y - 10);
  }

  if (p.meleeWindup > 0 && p.meleeWindupMax > 0) {
    const windupAlpha = 1 - p.meleeWindup / p.meleeWindupMax;
    drawWeaponTelegraph(p.meleeAim, windupAlpha * 0.4);
  }

  if (G.meleeFlash && G.meleeFlash.timer > 0) {
    const weapon = WEAPONS[p.weapon];
    const reach = T * weapon.meleeRange;
    const arc = weapon.meleeArc;
    const mt = G.meleeFlash.timer / G.meleeFlash.maxTimer;
    drawWeaponTelegraph(G.meleeFlash.angle, mt);
    ctx.save(); ctx.translate(p.x + p.w / 2, p.y + p.h / 2); ctx.rotate(G.meleeFlash.angle);
    ctx.globalAlpha = mt * 0.22; ctx.strokeStyle = '#c9a446'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(0, 0, reach, -arc, arc); ctx.stroke();
    ctx.restore(); ctx.globalAlpha = 1;
  }

  ctx.restore();

  if (G.showMap) drawMinimap();
}

function drawMinimap(): void {
  const G = store.G!;
  const map = G.map, fog = G.fog;
  const mw = map[0].length, mh = map.length;
  const scale = 3;
  const mw2 = mw * scale, mh2 = mh * scale;
  const mx = canvas.width / 2 - mw2 / 2, my = UI_HEIGHT + (canvas.height - UI_HEIGHT) / 2 - mh2 / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(mx - 4, my - 4, mw2 + 8, mh2 + 8);
  for (let ty = 0; ty < mh; ty++) {
    for (let tx = 0; tx < mw; tx++) {
      const f = fog[ty][tx]; if (f === 0) continue;
      const tile = map[ty][tx];
      const dim = f === 1 ? 0.3 : 1;
      ctx.globalAlpha = dim;
      const sealedExit = tile === 2 && G.mode === 'boss' && !G.bossDefeated;
      ctx.fillStyle = tile === 0 ? '#33335a' : sealedExit ? '#ff6655' : tile === 2 ? '#44ff88' : tile === TILE_WATER ? '#2266aa' : tile === TILE_CHEST ? '#ffcc00' : tile === TILE_SPIKES ? '#aa3333' : tile === TILE_BREAKABLE ? '#55446a' : '#888899';
      ctx.fillRect(mx + tx * scale, my + ty * scale, scale, scale);
    }
  }
  ctx.globalAlpha = 1;
  const p = G.player;
  const pdx = Math.floor((p.x + p.w / 2) / T), pdy = Math.floor((p.y + p.h / 2) / T);
  ctx.fillStyle = '#4af'; ctx.fillRect(mx + pdx * scale - 1, my + pdy * scale - 1, scale + 2, scale + 2);
  ctx.font = '10px monospace'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
  ctx.fillText('M to close', mx + mw2 / 2, my + mh2 + 16);
}
