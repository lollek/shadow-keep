import { store } from '../state';
import { ctx, canvas, viewW, viewH } from '../canvas';
import { T, FLOOR_COLS, WALL_COLS } from '../constants';
import { drawEnemy } from './enemies';
import { drawProjectile } from './projectiles';
import { drawPlayer } from './player';
import type { Particle } from '../types';

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
  ctx.translate(Math.round(-G.cam.x + sx), Math.round(62 - G.cam.y + sy));

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
      if (tile === 0) {
        const ci = ((tx * 3 + ty * 7) % 5 + 5) % 5;
        ctx.fillStyle = WALL_COLS[ci];
        ctx.fillRect(px, py, T, T);
        if (ty + 1 < mapH && map[ty + 1][tx] !== 0) {
          ctx.fillStyle = 'rgba(160,100,40,0.35)';
          ctx.fillRect(px, py, T, 3);
        }
      } else {
        const ci = ((tx * 5 + ty * 11) % 5 + 5) % 5;
        ctx.fillStyle = FLOOR_COLS[ci];
        ctx.fillRect(px, py, T, T);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(px, py, T, 1); ctx.fillRect(px, py, 1, T);
        if (tile === 2) {
          ctx.globalAlpha = dim;
          ctx.fillStyle = '#1a3a20'; ctx.fillRect(px + 1, py + 1, T - 2, T - 2);
          const pulse = 0.7 + Math.sin(Date.now() * 0.004) * 0.3;
          ctx.globalAlpha = dim * pulse;
          ctx.fillStyle = '#33ff88';
          ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
          ctx.fillText('▼', px + T / 2, py + T / 2 + 4);
          ctx.globalAlpha = dim * 0.5;
          ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 1.5;
          ctx.strokeRect(px + 2, py + 2, T - 4, T - 4);
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  // Particles
  G.particles.forEach((pt: Particle) => {
    if (pt.type === 'ripple') {
      ctx.globalAlpha = Math.max(0, pt.life) * 0.5;
      ctx.strokeStyle = '#ffee88'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.stroke();
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

  // Projectiles
  G.projectiles.forEach(drawProjectile);

  // Player
  const p = G.player;
  const wx = G.mouse.x + G.cam.x, wy = G.mouse.y + G.cam.y - 62;
  const wAng = Math.atan2(wy - (p.y + p.h / 2), wx - (p.x + p.w / 2));
  const flash = p.invincible > 0 && Math.floor(p.invincible / 3) % 2 === 0;
  if (G.isSneaking) ctx.globalAlpha = 0.65;
  if (p.dodgeT > 0) ctx.globalAlpha = 0.5 + p.dodgeT / 14 * 0.5;
  drawPlayer(p, wAng, flash);
  ctx.globalAlpha = 1;
  if (G.isSneaking) {
    ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(150,220,255,0.7)';
    ctx.fillText('SNEAKING', p.x + p.w / 2, p.y - 10);
  }
  if (p.blocking && p.stamina <= 0) {
    ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,100,100,0.9)';
    ctx.fillText('GUARD BROKEN', p.x + p.w / 2, p.y - 10);
  }

  if (G.meleeFlash && G.meleeFlash.timer > 0) {
    ctx.save(); ctx.translate(p.x + p.w / 2, p.y + p.h / 2); ctx.rotate(G.meleeFlash.angle);
    const mt = G.meleeFlash.timer / 10;
    ctx.globalAlpha = mt * 0.7; ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, T * 2, -1.2, 1.2); ctx.stroke();
    ctx.globalAlpha = mt * 0.25; ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.arc(T * 2, 0, T * 0.8, -1, 1); ctx.fill();
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
  const mx = canvas.width / 2 - mw2 / 2, my = 62 + viewH() / 2 - mh2 / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(mx - 4, my - 4, mw2 + 8, mh2 + 8);
  for (let ty = 0; ty < mh; ty++) {
    for (let tx = 0; tx < mw; tx++) {
      const f = fog[ty][tx]; if (f === 0) continue;
      const tile = map[ty][tx];
      const dim = f === 1 ? 0.3 : 1;
      ctx.globalAlpha = dim;
      ctx.fillStyle = tile === 0 ? '#33335a' : tile === 2 ? '#44ff88' : '#888899';
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
