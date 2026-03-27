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
    // Katana-forward guard pose (replaces shield visual)
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(6, -2, 8, 4); // tsuka
    ctx.fillStyle = '#b08d57';
    ctx.beginPath(); ctx.arc(15, 0, 3, 0, Math.PI * 2); ctx.fill(); // tsuba
    ctx.fillStyle = '#d8dde8';
    ctx.beginPath();
    ctx.moveTo(16, -2);
    ctx.quadraticCurveTo(27, -5, 40, -1);
    ctx.lineTo(40, 1.5);
    ctx.quadraticCurveTo(27, 4, 16, 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f1f5ff'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(18, -0.2); ctx.quadraticCurveTo(28, -2.2, 38, -0.2); ctx.stroke();
    if (p.parryWindow > 0) {
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 50) * 0.4;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(16, -3);
      ctx.quadraticCurveTo(28, -7, 41, -1.5);
      ctx.lineTo(41, 2.5);
      ctx.quadraticCurveTo(28, 6, 16, 2);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  } else {
    // Sheathed katana at hip when not actively guarding
    ctx.fillStyle = '#171717'; ctx.fillRect(4, -2, 9, 4); // tsuka
    ctx.fillStyle = '#9b7b4a';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(5 + i * 3, -2, 1, 4); // tsuka wrap accents
    }
    ctx.fillStyle = '#b08d57';
    ctx.beginPath(); ctx.arc(14, 0, 2.5, 0, Math.PI * 2); ctx.fill(); // tsuba
    ctx.fillStyle = '#2a2240';
    ctx.beginPath();
    ctx.moveTo(15, -2);
    ctx.quadraticCurveTo(25, -4, 34, -1.2);
    ctx.lineTo(34, 1.2);
    ctx.quadraticCurveTo(25, 3.5, 15, 2);
    ctx.closePath();
    ctx.fill(); // saya
    ctx.strokeStyle = '#5d4b7a'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(16, 0); ctx.quadraticCurveTo(24, -1.5, 32, 0); ctx.stroke();
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
