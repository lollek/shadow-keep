import { S, store } from '../state';
import { ctx, canvas } from '../canvas';
import { UI_HEIGHT } from '../constants';
import { tvArea, bldgRects } from '../town';
import { drawTownPlayer } from './player';

export function drawTown(): void {
  const { W, H } = tvArea();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save(); ctx.translate(0, UI_HEIGHT);

  // Sky
  ctx.fillStyle = '#0d1a2a'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  for (let i = 0; i < 60; i++) ctx.fillRect((i * 137.5 % W), (i * 97.3 % (H * 0.45)), 1, 1);
  ctx.fillStyle = '#ffffcc'; ctx.beginPath(); ctx.arc(W * 0.88, H * 0.12, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0d1a2a'; ctx.beginPath(); ctx.arc(W * 0.88 + 7, H * 0.12 - 3, 12, 0, Math.PI * 2); ctx.fill();

  // Ground
  ctx.fillStyle = '#1a2a14'; ctx.fillRect(0, H * 0.65, W, H * 0.35);
  ctx.fillStyle = '#223318'; ctx.fillRect(0, H * 0.65, W, 7);
  ctx.fillStyle = '#2a2218';
  ctx.beginPath(); ctx.moveTo(W * 0.42, H * 0.65); ctx.lineTo(W * 0.58, H * 0.65); ctx.lineTo(W * 0.54, H); ctx.lineTo(W * 0.46, H); ctx.fill();
  ctx.fillStyle = '#352c22';
  for (let py = H * 0.67; py < H; py += 20) ctx.fillRect(W * 0.48, py, W * 0.04, 12);

  // Buildings
  bldgRects().forEach(b => {
    const { bx, by, bw, bh, label, color, roof, icon, desc } = b;
    const isDng = b.id === 'dungeon';
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(bx + 5, by + bh - 3, bw, 8);
    ctx.fillStyle = color; ctx.fillRect(bx, by + 18, bw, bh - 18);
    ctx.fillStyle = roof;
    ctx.beginPath(); ctx.moveTo(bx - 5, by + 20); ctx.lineTo(bx + bw / 2, by); ctx.lineTo(bx + bw + 5, by + 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = isDng ? '#220000' : '#1a0e00';
    const dw = 18, dh = 26, dx2 = bx + bw / 2 - dw / 2, dy2 = by + bh - dh;
    ctx.beginPath(); ctx.moveTo(dx2, dy2 + dh); ctx.lineTo(dx2, dy2 + 7);
    ctx.arcTo(dx2, dy2, dx2 + dw / 2, dy2, dw / 2);
    ctx.arcTo(dx2 + dw, dy2, dx2 + dw, dy2 + 7, dw / 2);
    ctx.lineTo(dx2 + dw, dy2 + dh); ctx.closePath(); ctx.fill();
    if (!isDng) { ctx.fillStyle = '#ffeeaa33'; ctx.fillRect(bx + 7, by + 26, 14, 12); }
    ctx.font = (isDng ? '18' : '14') + 'px serif'; ctx.textAlign = 'center';
    ctx.fillText(icon, bx + bw / 2, by + (isDng ? 14 : 12));
    ctx.font = '500 8px monospace'; ctx.fillStyle = isDng ? '#ff4444' : '#ccbbaa';
    ctx.fillText(label, bx + bw / 2, by + bh + 12);
    ctx.font = '8px monospace'; ctx.fillStyle = '#555';
    ctx.fillText(desc, bx + bw / 2, by + bh + 21);
  });

  // Player
  const p = S.player;
  if (p) drawTownPlayer(p);

  // Proximity hints
  if (p) {
    bldgRects().forEach(b => {
      const { bx, by, bw, bh } = b;
      if (p.x + p.w > bx + 10 && p.x < bx + bw - 10 && p.y + p.h > by + bh * 0.6 && p.y < by + bh) {
        ctx.strokeStyle = 'rgba(255,215,0,.5)'; ctx.lineWidth = 2;
        ctx.strokeRect(bx - 2, by - 2, bw + 4, bh + 4);
        ctx.font = '9px monospace'; ctx.fillStyle = '#ffd700'; ctx.textAlign = 'center';
        ctx.fillText('[F] Enter', bx + bw / 2, by - 7);
      }
    });
  }
  ctx.restore();
}
