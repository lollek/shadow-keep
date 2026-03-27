import { ctx } from '../canvas';
import { WEAPONS } from '../constants';
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

function drawSheathedDualTanto(x: number, y: number, ang: number): void {
  for (const off of [-1.8, 1.8]) {
    ctx.save();
    ctx.translate(x + off, y + Math.abs(off) * 0.25);
    ctx.rotate(ang + off * 0.04);
    ctx.fillStyle = '#141414'; ctx.fillRect(-3.2, -1, 4.1, 2);
    ctx.fillStyle = '#b59a6a'; ctx.fillRect(-2.6, -1, 0.7, 2);
    ctx.fillStyle = '#2b2238';
    ctx.beginPath();
    ctx.moveTo(1.3, -0.95);
    ctx.quadraticCurveTo(5.2, -1.8, 9, -0.6);
    ctx.lineTo(9, 0.55);
    ctx.quadraticCurveTo(5.4, 0.9, 1.3, 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawDrawnDualTanto(guarding: boolean): void {
  for (const off of [-2.2, 2.2]) {
    ctx.save();
    ctx.translate(0, off * 0.25);
    ctx.rotate(off * 0.07 + (guarding ? 0.08 * Math.sign(off) : 0));
    ctx.fillStyle = '#141414'; ctx.fillRect(-2.8, -1, 4.2, 2);
    ctx.fillStyle = '#b59a6a'; ctx.fillRect(-2.1, -1, 0.75, 2);
    ctx.fillStyle = '#d8dde8';
    ctx.beginPath();
    ctx.moveTo(1.4, -0.85);
    ctx.quadraticCurveTo(5.2, guarding ? -1.8 : -1.35, 9.6, -0.25);
    ctx.lineTo(10.5, 0.05);
    ctx.quadraticCurveTo(5.8, 0.7, 1.4, 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawSheathedNaginata(x: number, y: number, ang: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = '#6b4a28'; ctx.fillRect(-2, -1.1, 18, 2.2);
  ctx.fillStyle = '#d9dee7';
  ctx.beginPath();
  ctx.moveTo(15.2, -1.2);
  ctx.lineTo(20.4, -0.4);
  ctx.lineTo(15.8, 1.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDrawnNaginata(guarding: boolean): void {
  ctx.fillStyle = '#6b4a28'; ctx.fillRect(-3, -0.9, 20, 1.8);
  ctx.fillStyle = '#d9dee7';
  ctx.beginPath();
  ctx.moveTo(16.5, -1.8);
  ctx.quadraticCurveTo(22.8, -4.8, 28.8, -1.1);
  ctx.lineTo(26.1, 0.05);
  ctx.quadraticCurveTo(21.7, 1.8, 16.8, 1.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f4f7fb'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(17.4, -0.45); ctx.quadraticCurveTo(22.6, -2.1, 27.4, -0.7); ctx.stroke();
  if (guarding) {
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(11, -3); ctx.lineTo(18, 0); ctx.lineTo(11, 3); ctx.stroke();
  }
}

function drawSheathedNodachi(x: number, y: number, ang: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = '#141414'; ctx.fillRect(-4.6, -1.3, 6, 2.6);
  ctx.fillStyle = '#b59a6a';
  for (let i = 0; i < 3; i++) ctx.fillRect(-3.7 + i * 1.7, -1.3, 0.75, 2.6);
  ctx.fillStyle = '#2a1d3d';
  ctx.beginPath();
  ctx.moveTo(2.1, -1.3);
  ctx.quadraticCurveTo(12.5, -4.8, 27.8, -2.1);
  ctx.lineTo(27.8, 1.15);
  ctx.quadraticCurveTo(13.2, 2.3, 2.1, 1.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDrawnNodachi(parryWindow: number, guarding: boolean): void {
  ctx.fillStyle = '#151515'; ctx.fillRect(-3.3, -1.6, 6.3, 3.2);
  ctx.fillStyle = '#c2a56b';
  for (let i = 0; i < 3; i++) ctx.fillRect(-2.6 + i * 1.7, -1.6, 0.75, 3.2);
  ctx.fillStyle = '#d8dde8';
  ctx.beginPath();
  ctx.moveTo(4, -1.15);
  ctx.quadraticCurveTo(13.5, guarding ? -4.9 : -4.1, 28.8, guarding ? -1.9 : -1.2);
  ctx.lineTo(33, -0.1);
  ctx.lineTo(28.9, 0.82);
  ctx.quadraticCurveTo(14.6, guarding ? 1.95 : 2.25, 4, 1.05);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f7fbff'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(5.1, -0.45); ctx.quadraticCurveTo(14.5, -2.25, 28.8, -0.82); ctx.stroke();
  if (parryWindow > 0) {
    ctx.globalAlpha = 0.45 + Math.sin(Date.now() / 50) * 0.25;
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(5.4, -2.9); ctx.quadraticCurveTo(16.5, -7.1, 31.2, -2.1); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawGuardWeapon(p: Player): void {
  switch (p.weapon) {
    case 'dual_tanto': drawDrawnDualTanto(true); return;
    case 'naginata': drawDrawnNaginata(true); return;
    case 'nodachi': drawDrawnNodachi(p.parryWindow, true); return;
    default: drawDrawnKatana(p.parryWindow, true);
  }
}

function drawSwingWeapon(p: Player): void {
  switch (p.weapon) {
    case 'dual_tanto': drawDrawnDualTanto(false); return;
    case 'naginata': drawDrawnNaginata(false); return;
    case 'nodachi': drawDrawnNodachi(0, false); return;
    default: drawDrawnKatana(0, false);
  }
}

function drawWindupWeapon(p: Player): void {
  switch (p.weapon) {
    case 'naginata': drawDrawnNaginata(false); return;
    case 'nodachi': drawDrawnNodachi(0, false); return;
    default: drawSwingWeapon(p);
  }
}

function drawSheathedWeapon(p: Player, x: number, y: number, faceRight: boolean): void {
  switch (p.weapon) {
    case 'dual_tanto':
      drawSheathedDualTanto(x, y, faceRight ? 2.02 : 1.15);
      return;
    case 'naginata':
      drawSheathedNaginata(x - (faceRight ? 2 : -2), y - 2.3, faceRight ? 2.22 : 0.95);
      return;
    case 'nodachi':
      drawSheathedNodachi(x - (faceRight ? 1 : -1), y - 0.2, faceRight ? 2.05 : 1.08);
      return;
    default:
      drawSheathedKatana(x, y, faceRight ? 1.95 : 1.2);
  }
}

export function drawPlayer(p: Player, wAng: number, flash: boolean, swingT: number, faceRight: boolean): void {
  if (flash) return;
  const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
  const faceDir = faceRight ? 1 : -1;
  const weapon = WEAPONS[p.weapon];

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
    if (p.weapon === 'naginata') {
      ctx.translate(cx + faceDir * 5, cy - 0.2);
      ctx.rotate(faceRight ? -0.38 : Math.PI + 0.38);
    } else if (p.weapon === 'dual_tanto') {
      ctx.translate(cx + faceDir * 6.2, cy + 0.8);
      ctx.rotate(faceRight ? -0.42 : Math.PI + 0.42);
    } else if (p.weapon === 'nodachi') {
      ctx.translate(cx + faceDir * 8.2, cy + 0.3);
      ctx.rotate(faceRight ? -1.28 : 1.28);
    } else {
      ctx.translate(cx + faceDir * 7, cy + 0.5);
      ctx.rotate(faceRight ? -1.6 : 1.6);
    }
    drawGuardWeapon(p);
    ctx.restore();
  } else if (swingT > 0) {
    const swing = 1 - swingT;
    const sweepSide = faceRight ? -1 : 1;
    const sweepMul = p.weapon === 'nodachi' ? 1.45 : p.weapon === 'dual_tanto' ? 0.75 : p.weapon === 'naginata' ? 0.42 : 1;
    const startAng = wAng + sweepSide * weapon.meleeArc * sweepMul;
    const endAng = wAng - sweepSide * (p.weapon === 'dual_tanto' ? 0.12 : p.weapon === 'naginata' ? 0.04 : weapon.meleeArc * 0.25);
    const ang = startAng + (endAng - startAng) * swing;
    const reach = p.weapon === 'naginata' ? 8.5 + swing * 3.2 : p.weapon === 'nodachi' ? 4 + swing * 2.3 : p.weapon === 'dual_tanto' ? 1.8 + swing * 0.7 : 2.4 + swing * 1.2;
    const vx = Math.cos(ang) * reach;
    const vy = Math.sin(ang) * reach;
    ctx.save();
    ctx.translate(cx + vx, cy + vy);
    ctx.rotate(ang);
    drawSwingWeapon(p);
    ctx.restore();
  } else if (p.meleeWindup > 0 && p.meleeWindupMax > 0) {
    const windup = 1 - p.meleeWindup / p.meleeWindupMax;
    const aim = p.meleeAim;
    const backPull = p.weapon === 'nodachi' ? 1.15 - windup * 0.55 : 0.42 - windup * 0.18;
    const ang = aim - faceDir * backPull;
    const reach = p.weapon === 'nodachi' ? 1.8 + windup * 1.4 : 4.8 + windup * 1.2;
    ctx.save();
    ctx.translate(cx + Math.cos(aim) * reach, cy + Math.sin(aim) * reach - (p.weapon === 'nodachi' ? 1.5 : 0));
    ctx.rotate(ang);
    drawWindupWeapon(p);
    ctx.restore();
  } else {
    if (p.weapon === 'naginata') {
      ctx.save();
      ctx.translate(cx + Math.cos(wAng) * 3.5, cy + Math.sin(wAng) * 3.5);
      ctx.rotate(wAng);
      drawDrawnNaginata(false);
      ctx.restore();
    } else {
      drawSheathedWeapon(p, cx - faceDir * 4.5, p.y + p.h - 6.2, faceRight);
    }
  }
}

export function drawTownPlayer(p: Player, wAng: number, faceRight: boolean): void {
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
  if (p.weapon === 'naginata') {
    const cy = p.y + p.h / 2;
    ctx.save();
    ctx.translate(cx + Math.cos(wAng) * 3.5, cy + Math.sin(wAng) * 3.5);
    ctx.rotate(wAng);
    drawDrawnNaginata(false);
    ctx.restore();
  } else {
    drawSheathedWeapon(p, cx - faceDir * 4.5, p.y + p.h - 6.2, faceRight);
  }
}
