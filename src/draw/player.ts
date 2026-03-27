import { ctx } from '../canvas';
import type { Player } from '../types';
import { roundRect } from './helpers';

export function drawPlayer(p: Player, wAng: number, flash: boolean): void {
  if (flash) return;
  const cx = p.x + p.w / 2, cy = p.y + p.h / 2;

  if (p.dodgeT > 0) {
    ctx.globalAlpha = p.dodgeT / 14 * 0.35;
    ctx.fillStyle = '#8844ff';
    ctx.fillRect(p.x - p.dodgeDx * 12, p.y - p.dodgeDy * 12, p.w, p.h);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.beginPath(); ctx.ellipse(cx + 2, p.y + p.h + 2, p.w / 2, 4, 0, 0, Math.PI * 2); ctx.fill();

  if (p.parryWindow > 0) {
    ctx.globalAlpha = p.parryWindow / 12 * 0.85;
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, p.w + 2, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = '#0a0a0a'; roundRect(p.x + 1, p.y + 5, p.w - 2, p.h - 6, 4); ctx.fill();
  ctx.fillStyle = '#111130'; roundRect(p.x + 3, p.y + 6, p.w - 6, 8, 2); ctx.fill();
  ctx.fillStyle = '#330033'; ctx.fillRect(p.x + 2, p.y + p.h - 9, p.w - 4, 4);
  ctx.fillStyle = '#880088'; ctx.fillRect(cx - 3, p.y + p.h - 9, 6, 4);

  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, p.y + 6, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ddeeff';
  ctx.beginPath(); ctx.ellipse(cx - 2.5, p.y + 5.5, 2, 1.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 2.5, p.y + 5.5, 2, 1.2, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save(); ctx.translate(cx, cy); ctx.rotate(wAng);
  if (p.blocking) {
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(5, -9, 12, 18);
    ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(5 + i * 2, -9); ctx.lineTo(5 + i * 2, 9); ctx.stroke(); }
    ctx.fillStyle = '#cc0000'; ctx.fillRect(5, -9, 2, 18);
    if (p.parryWindow > 0) {
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 50) * 0.4;
      ctx.fillStyle = '#ffd700'; ctx.fillRect(5, -9, 12, 18);
      ctx.globalAlpha = 1;
    }
  } else {
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(5, -2, 9, 4);
    ctx.fillStyle = '#cc8800'; ctx.fillRect(13, -4, 2, 8);
    ctx.fillStyle = '#ddddee'; ctx.fillRect(15, -1.5, 20, 3);
    ctx.fillStyle = '#eeeeff'; ctx.fillRect(15, -0.8, 20, 1.5);
    ctx.fillStyle = '#888877'; ctx.fillRect(5, -1, 8, 2);
  }
  ctx.restore();
}

export function drawTownPlayer(p: Player): void {
  const cx = p.x + p.w / 2;
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  ctx.beginPath(); ctx.ellipse(cx + 1, p.y + p.h + 1, p.w / 2, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0a0a0a'; roundRect(p.x + 1, p.y + 5, p.w - 2, p.h - 6, 4); ctx.fill();
  ctx.fillStyle = '#111130'; roundRect(p.x + 3, p.y + 6, p.w - 6, 8, 2); ctx.fill();
  ctx.fillStyle = '#330033'; ctx.fillRect(p.x + 2, p.y + p.h - 9, p.w - 4, 4);
  ctx.fillStyle = '#880088'; ctx.fillRect(cx - 3, p.y + p.h - 9, 6, 4);
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, p.y + 6, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ddeeff';
  ctx.beginPath(); ctx.ellipse(cx - 2.5, p.y + 5.5, 2, 1.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 2.5, p.y + 5.5, 2, 1.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ddddee'; ctx.fillRect(p.x + p.w + 1, p.y + 5, 18, 2);
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(p.x + p.w - 2, p.y + 4, 5, 10);
  ctx.fillStyle = '#cc8800'; ctx.fillRect(p.x + p.w + 2, p.y + 3, 2, 7);
}
