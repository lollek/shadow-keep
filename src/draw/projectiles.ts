import { ctx } from '../canvas';
import type { Projectile } from '../types';

export function drawProjectile(pr: Projectile): void {
  ctx.save(); ctx.translate(pr.x, pr.y); ctx.rotate(pr.angle || 0);
  if (pr.reflected) {
    ctx.globalAlpha = 0.35; ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = '#ffee44';
    ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-1, -1, 2, 0, Math.PI * 2); ctx.fill();
  } else if (pr.owner === 'player') {
    if (pr.explosive) {
      ctx.fillStyle = 'rgba(255,140,0,.3)';
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff8800';
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#996633'; ctx.fillRect(-6, -1, 12, 2);
      ctx.fillStyle = '#aaaaaa';
      ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(10, 0); ctx.lineTo(6, 2); ctx.closePath(); ctx.fill();
    }
  } else {
    if (pr.boss) {
      ctx.fillStyle = 'rgba(255,0,0,.3)';
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#cc0000';
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#cc3300'; ctx.fillRect(-5, -1.5, 10, 3);
      ctx.fillStyle = '#ff5533';
      ctx.beginPath(); ctx.moveTo(5, -2); ctx.lineTo(8, 0); ctx.lineTo(5, 2); ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();
}
