import { ctx } from '../canvas';
import type { Player } from '../types';
import { roundRect } from './helpers';

function drawSheathedKatana(x: number, y: number, ang: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = '#141414'; ctx.fillRect(-4, -1.2, 5, 2.4);
  ctx.fillStyle = '#b59a6a';
  for (let i = 0; i < 2; i++) ctx.fillRect(-3.2 + i * 2, -1.2, 0.8, 2.4);
  ctx.fillStyle = '#c8b07c';
  ctx.beginPath(); ctx.arc(1.5, 0, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#231a34';
  ctx.beginPath();
  ctx.moveTo(2.2, -1.15);
  ctx.quadraticCurveTo(8, -3.1, 14.5, -1.4);
  ctx.lineTo(14.5, 0.85);
  ctx.quadraticCurveTo(8, 1.4, 2.2, 1.15);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6e5b88'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(3.2, -0.1); ctx.quadraticCurveTo(7.8, -1.5, 12.8, -0.2); ctx.stroke();
  ctx.restore();
}

function drawDrawnKatana(parryWindow: number, guarding: boolean): void {
  ctx.fillStyle = '#151515'; ctx.fillRect(-3, -1.5, 5.5, 3);
  ctx.fillStyle = '#b59a6a';
  for (let i = 0; i < 2; i++) ctx.fillRect(-2.2 + i * 1.8, -1.5, 0.8, 3);
  ctx.fillStyle = '#ccb684';
  ctx.beginPath(); ctx.arc(3.1, 0, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d8dde8';
  ctx.beginPath();
  ctx.moveTo(3.9, -0.9);
  ctx.quadraticCurveTo(8.8, guarding ? -3.1 : -2.7, 15.5, guarding ? -1.35 : -0.75);
  ctx.lineTo(17.2, guarding ? -0.05 : 0.02);
  ctx.lineTo(15.5, guarding ? 0.62 : 0.54);
  ctx.quadraticCurveTo(8.8, guarding ? 0.9 : 1.05, 3.9, 0.78);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f7fbff'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(5, -0.2); ctx.quadraticCurveTo(9.6, guarding ? -1.45 : -1.2, 15, -0.45); ctx.stroke();
  ctx.strokeStyle = '#9ca5b5'; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(15.4, -0.26); ctx.lineTo(17.2, -0.04); ctx.lineTo(15.4, 0.3); ctx.stroke();
  if (parryWindow > 0) {
    ctx.globalAlpha = 0.45 + Math.sin(Date.now() / 50) * 0.25;
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(4, -2.1); ctx.quadraticCurveTo(10.2, -5.1, 16.8, -1.3); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

export function drawPlayer(p: Player, wAng: number, flash: boolean, swingT: number, faceRight: boolean): void {
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
    ctx.translate(cx + faceDir * 7, cy + 0.5);
    ctx.rotate(faceRight ? -1.6 : 1.6);
    drawDrawnKatana(p.parryWindow, true);
    ctx.restore();
  } else if (swingT > 0) {
    const swing = 1 - swingT / 10;
    const sweepSide = faceRight ? -1 : 1;
    const startAng = wAng + sweepSide * 0.55;
    const endAng = wAng - sweepSide * 0.18;
    const ang = startAng + (endAng - startAng) * swing;
    const reach = 2.4 + swing * 1.2;
    const vx = Math.cos(ang) * reach;
    const vy = Math.sin(ang) * reach;
    ctx.save();
    ctx.translate(cx + vx, cy + vy);
    ctx.rotate(ang);
    drawDrawnKatana(0, false);
    ctx.restore();
  } else {
    drawSheathedKatana(cx - faceDir * 4.5, p.y + p.h - 6.2, faceRight ? 1.95 : 1.2);
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
  drawSheathedKatana(cx - faceDir * 4.5, p.y + p.h - 6.2, faceRight ? 1.95 : 1.2);
}
