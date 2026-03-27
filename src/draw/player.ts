import { ctx } from '../canvas';
import type { Player } from '../types';
import { roundRect } from './helpers';

function drawSheathedKatana(x: number, y: number, ang: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = '#171717'; ctx.fillRect(-5, -2, 9, 4);
  ctx.fillStyle = '#9b7b4a';
  for (let i = 0; i < 3; i++) ctx.fillRect(-4 + i * 3, -2, 1, 4);
  ctx.fillStyle = '#b08d57';
  ctx.beginPath(); ctx.arc(5, 0, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#241d38';
  ctx.beginPath();
  ctx.moveTo(6, -2);
  ctx.quadraticCurveTo(16, -4, 28, -1.5);
  ctx.lineTo(28, 1.5);
  ctx.quadraticCurveTo(16, 3.8, 6, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#655580'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(7, 0); ctx.quadraticCurveTo(16, -1.5, 26, 0); ctx.stroke();
  ctx.restore();
}

function drawDrawnKatana(parryWindow: number, guarding: boolean): void {
  ctx.fillStyle = '#171717'; ctx.fillRect(-2, -3, 10, 6);
  ctx.fillStyle = '#9b7b4a';
  for (let i = 0; i < 3; i++) ctx.fillRect(-1 + i * 3, -3, 1, 6);
  ctx.fillStyle = '#b08d57';
  ctx.beginPath(); ctx.arc(9, 0, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d8dde8';
  ctx.beginPath();
  ctx.moveTo(10, -2.2);
  ctx.quadraticCurveTo(22, guarding ? -6 : -4.5, 37, guarding ? -2 : -0.5);
  ctx.lineTo(37, guarding ? 1.7 : 1.3);
  ctx.quadraticCurveTo(22, guarding ? 3.4 : 3.8, 10, 1.8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f7fbff'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(12, -0.2); ctx.quadraticCurveTo(23, guarding ? -2.6 : -2, 35, -0.3); ctx.stroke();
  if (parryWindow > 0) {
    ctx.globalAlpha = 0.45 + Math.sin(Date.now() / 50) * 0.25;
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, -4); ctx.quadraticCurveTo(24, -9, 39, -2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

export function drawPlayer(p: Player, wAng: number, flash: boolean, drawn: boolean): void {
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

  if (p.blocking) {
    ctx.save();
    ctx.translate(cx + 1, cy + 1);
    ctx.rotate(wAng - 0.55);
    drawDrawnKatana(p.parryWindow, true);
    ctx.restore();
  } else if (drawn) {
    ctx.save();
    ctx.translate(cx + 1, cy + 1);
    ctx.rotate(wAng - 0.1);
    drawDrawnKatana(0, false);
    ctx.restore();
  } else {
    drawSheathedKatana(cx + 4, p.y + p.h - 7, 0.8);
  }
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
  drawSheathedKatana(cx + 4, p.y + p.h - 7, 0.8);
}
