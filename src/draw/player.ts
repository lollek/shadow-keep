import { ctx } from '../canvas';
import type { Player } from '../types';
import { roundRect } from './helpers';

function drawSheathedKatana(x: number, y: number, ang: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = '#141414'; ctx.fillRect(-8, -2.3, 11, 4.6);
  ctx.fillStyle = '#b59a6a';
  for (let i = 0; i < 4; i++) ctx.fillRect(-7 + i * 3, -2.3, 1, 4.6);
  ctx.fillStyle = '#c8b07c';
  ctx.beginPath(); ctx.arc(4, 0, 2.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#231a34';
  ctx.beginPath();
  ctx.moveTo(5, -2.4);
  ctx.quadraticCurveTo(18, -5, 35, -1.8);
  ctx.lineTo(35, 1.8);
  ctx.quadraticCurveTo(18, 4.8, 5, 2.4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6e5b88'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(7, 0); ctx.quadraticCurveTo(18, -1.9, 32, 0); ctx.stroke();
  ctx.restore();
}

function drawDrawnKatana(parryWindow: number, guarding: boolean): void {
  ctx.fillStyle = '#151515'; ctx.fillRect(-5, -3, 11, 6);
  ctx.fillStyle = '#b59a6a';
  for (let i = 0; i < 4; i++) ctx.fillRect(-4 + i * 3, -3, 1, 6);
  ctx.fillStyle = '#ccb684';
  ctx.beginPath(); ctx.arc(7, 0, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d8dde8';
  ctx.beginPath();
  ctx.moveTo(8, -2.4);
  ctx.quadraticCurveTo(22, guarding ? -7 : -5.4, 42, guarding ? -2.8 : -0.8);
  ctx.lineTo(42, guarding ? 1.6 : 1.2);
  ctx.quadraticCurveTo(22, guarding ? 3 : 4.4, 8, 2.1);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f7fbff'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(10, -0.5); ctx.quadraticCurveTo(23, guarding ? -3.1 : -2.4, 39, -0.6); ctx.stroke();
  ctx.strokeStyle = '#9ca5b5'; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(40, -0.8); ctx.lineTo(43, 0.1); ctx.lineTo(40, 1.1); ctx.stroke();
  if (parryWindow > 0) {
    ctx.globalAlpha = 0.45 + Math.sin(Date.now() / 50) * 0.25;
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(8, -4.2); ctx.quadraticCurveTo(24, -10, 42, -2.2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

export function drawPlayer(p: Player, wAng: number, flash: boolean, drawn: boolean, faceRight: boolean): void {
  if (flash) return;
  const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
  const faceDir = faceRight ? 1 : -1;

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

  ctx.fillStyle = '#1b1528';
  if (faceRight) ctx.fillRect(p.x + p.w - 5, p.y + 8, 4, 10);
  else ctx.fillRect(p.x + 1, p.y + 8, 4, 10);
  ctx.fillStyle = '#0a0a0a'; roundRect(p.x + 1, p.y + 5, p.w - 2, p.h - 6, 4); ctx.fill();
  ctx.fillStyle = '#111130'; roundRect(p.x + 3, p.y + 6, p.w - 6, 8, 2); ctx.fill();
  ctx.fillStyle = '#330033'; ctx.fillRect(p.x + 2, p.y + p.h - 9, p.w - 4, 4);
  ctx.fillStyle = '#880088'; ctx.fillRect(cx - 3 + faceDir, p.y + p.h - 9, 6, 4);

  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx + faceDir * 1.2, p.y + 6, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ddeeff';
  ctx.beginPath(); ctx.ellipse(cx + faceDir * 0.8, p.y + 5.5, 2.2, 1.25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + faceDir * 4.2, p.y + 5.5, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();

  if (p.blocking) {
    ctx.save();
    ctx.translate(cx + faceDir * 2, cy + 1);
    ctx.rotate(wAng - 0.55);
    drawDrawnKatana(p.parryWindow, true);
    ctx.restore();
  } else if (drawn) {
    ctx.save();
    ctx.translate(cx + faceDir * 2, cy + 1);
    ctx.rotate(wAng - 0.1);
    drawDrawnKatana(0, false);
    ctx.restore();
  } else {
    drawSheathedKatana(cx - faceDir * 2, p.y + p.h - 7, faceRight ? 0.7 : 2.45);
  }
}

export function drawTownPlayer(p: Player, faceRight: boolean): void {
  const cx = p.x + p.w / 2;
  const faceDir = faceRight ? 1 : -1;
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  ctx.beginPath(); ctx.ellipse(cx + 1, p.y + p.h + 1, p.w / 2, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1b1528';
  if (faceRight) ctx.fillRect(p.x + p.w - 5, p.y + 8, 4, 10);
  else ctx.fillRect(p.x + 1, p.y + 8, 4, 10);
  ctx.fillStyle = '#0a0a0a'; roundRect(p.x + 1, p.y + 5, p.w - 2, p.h - 6, 4); ctx.fill();
  ctx.fillStyle = '#111130'; roundRect(p.x + 3, p.y + 6, p.w - 6, 8, 2); ctx.fill();
  ctx.fillStyle = '#330033'; ctx.fillRect(p.x + 2, p.y + p.h - 9, p.w - 4, 4);
  ctx.fillStyle = '#880088'; ctx.fillRect(cx - 3 + faceDir, p.y + p.h - 9, 6, 4);
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx + faceDir * 1.2, p.y + 6, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ddeeff';
  ctx.beginPath(); ctx.ellipse(cx + faceDir * 0.8, p.y + 5.5, 2.2, 1.25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + faceDir * 4.2, p.y + 5.5, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();
  drawSheathedKatana(cx - faceDir * 2, p.y + p.h - 7, faceRight ? 0.7 : 2.45);
}
