import { ctx } from '../canvas';
import type { Enemy } from '../types';
import { roundRect } from './helpers';

function drawAttackGlow(cx: number, cy: number, r: number, e: Enemy): void {
  if (e.atkState === 'windup') {
    const pulse = 0.3 + 0.4 * (1 - e.atkT / (e.windup || 20));
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#ff2200';
    ctx.beginPath(); ctx.arc(cx, cy, r + 7, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  } else if (e.atkState === 'strike') {
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#ff6600';
    ctx.beginPath(); ctx.arc(cx, cy, r + 5, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  } else if (e.atkState === 'recovery') {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#aaaaff';
    ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawBlockGlow(cx: number, cy: number, r: number, e: Enemy): void {
  if (!e.canBlock || !e.blocking) return;
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#4488ff';
  ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#88aaff';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2); ctx.stroke();
}

function drawFeet(scale: number, col: string): void {
  ctx.fillStyle = col;
  ctx.fillRect(-4 * scale, 6 * scale, 3 * scale, 7 * scale);
  ctx.fillRect(1 * scale, 6 * scale, 3 * scale, 7 * scale);
}

function drawForwardFace(scale: number, headCol: string, eyeCol: string): void {
  ctx.fillStyle = headCol;
  ctx.beginPath(); ctx.arc(0, -6 * scale, 5 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = eyeCol;
  ctx.beginPath(); ctx.arc(0.8 * scale, -6.8 * scale, 1 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(2.9 * scale, -6.1 * scale, 0.9 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.28)';
  ctx.beginPath();
  ctx.moveTo(2.2 * scale, -6.8 * scale);
  ctx.lineTo(4.4 * scale, -5.7 * scale);
  ctx.lineTo(2.2 * scale, -4.8 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawHumanBase(scale: number, bodyCol: string, clothCol: string, headCol: string, faceCol: string): void {
  drawFeet(scale, clothCol);
  ctx.fillStyle = bodyCol;
  roundRect(-6 * scale, -1 * scale, 12 * scale, 12 * scale, 3 * scale); ctx.fill();
  ctx.fillStyle = clothCol;
  roundRect(-5 * scale, 1 * scale, 10 * scale, 7 * scale, 2 * scale); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.14)';
  roundRect(-1 * scale, 0.5 * scale, 4.8 * scale, 6.6 * scale, 1.8 * scale); ctx.fill();
  ctx.fillStyle = bodyCol;
  ctx.fillRect(-8 * scale, 1 * scale, 2 * scale, 7 * scale);
  ctx.fillRect(6 * scale, 1 * scale, 2 * scale, 7 * scale);
  ctx.fillStyle = clothCol;
  ctx.beginPath();
  ctx.moveTo(-4.5 * scale, 0.5 * scale);
  ctx.lineTo(-1.2 * scale, 2.3 * scale);
  ctx.lineTo(-4.1 * scale, 5.7 * scale);
  ctx.closePath();
  ctx.fill();
  drawForwardFace(scale, headCol, faceCol);
}

function drawStrawHat(scale: number, brimCol: string, topCol: string): void {
  ctx.fillStyle = brimCol;
  ctx.beginPath();
  ctx.moveTo(-7 * scale, -5 * scale);
  ctx.quadraticCurveTo(0, -10 * scale, 7 * scale, -5 * scale);
  ctx.lineTo(5.2 * scale, -3.8 * scale);
  ctx.quadraticCurveTo(0, -7.3 * scale, -5.2 * scale, -3.8 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = topCol;
  ctx.beginPath();
  ctx.moveTo(-3.5 * scale, -5.3 * scale);
  ctx.quadraticCurveTo(0, -9 * scale, 3.5 * scale, -5.3 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawHeadband(scale: number, bandCol: string): void {
  ctx.fillStyle = bandCol;
  roundRect(-4.6 * scale, -7.8 * scale, 8.8 * scale, 1.8 * scale, 0.8 * scale); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-4.1 * scale, -7.1 * scale);
  ctx.lineTo(-8 * scale, -8.7 * scale);
  ctx.lineTo(-6.1 * scale, -5.8 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawMask(scale: number, col: string): void {
  ctx.fillStyle = col;
  roundRect(-3.7 * scale, -7.5 * scale, 7.4 * scale, 4 * scale, 1.5 * scale); ctx.fill();
}

function drawPolearm(scale: number, shaftCol: string, bladeCol: string): void {
  ctx.fillStyle = shaftCol;
  ctx.fillRect(6 * scale, -7 * scale, 1.3 * scale, 18 * scale);
  ctx.fillStyle = bladeCol;
  ctx.beginPath();
  ctx.moveTo(5.2 * scale, -8.5 * scale);
  ctx.lineTo(7.9 * scale, -12 * scale);
  ctx.lineTo(8.4 * scale, -7.1 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawClub(scale: number, shaftCol: string, headCol: string): void {
  ctx.fillStyle = shaftCol;
  ctx.fillRect(5.5 * scale, -1 * scale, 1.6 * scale, 11 * scale);
  ctx.fillStyle = headCol;
  roundRect(4.2 * scale, -6 * scale, 4 * scale, 7 * scale, 1.4 * scale); ctx.fill();
}

function drawBow(scale: number, bowCol: string, stringCol: string): void {
  ctx.strokeStyle = bowCol;
  ctx.lineWidth = 1.3 * scale;
  ctx.beginPath(); ctx.arc(6.5 * scale, 0, 6 * scale, -1.05, 1.05); ctx.stroke();
  ctx.strokeStyle = stringCol;
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath(); ctx.moveTo(9.6 * scale, -4.9 * scale); ctx.lineTo(9.6 * scale, 4.9 * scale); ctx.stroke();
}

function drawShortBlade(scale: number, handleCol: string, bladeCol: string): void {
  ctx.fillStyle = handleCol;
  ctx.fillRect(5 * scale, -1.3 * scale, 2.6 * scale, 2.6 * scale);
  ctx.fillStyle = bladeCol;
  ctx.beginPath();
  ctx.moveTo(7.5 * scale, -1.2 * scale);
  ctx.quadraticCurveTo(11.2 * scale, -2.1 * scale, 14 * scale, -0.3 * scale);
  ctx.lineTo(14.5 * scale, 0.1 * scale);
  ctx.quadraticCurveTo(11.1 * scale, 1.2 * scale, 7.5 * scale, 1.1 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawShoulderPads(scale: number, col: string): void {
  ctx.fillStyle = col;
  roundRect(-8 * scale, -0.8 * scale, 3.6 * scale, 4.6 * scale, 1.2 * scale); ctx.fill();
  roundRect(3.8 * scale, -1.3 * scale, 4.6 * scale, 5.2 * scale, 1.3 * scale); ctx.fill();
}

function drawSash(scale: number, col: string): void {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-2.2 * scale, -0.3 * scale);
  ctx.lineTo(1.6 * scale, 0.3 * scale);
  ctx.lineTo(0.1 * scale, 8.3 * scale);
  ctx.lineTo(-3.7 * scale, 7.6 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawBackBanner(scale: number, poleCol: string, clothCol: string): void {
  ctx.fillStyle = poleCol;
  ctx.fillRect(-8 * scale, -10 * scale, 1.2 * scale, 18 * scale);
  ctx.fillStyle = clothCol;
  ctx.beginPath();
  ctx.moveTo(-6.8 * scale, -9 * scale);
  ctx.lineTo(-1.5 * scale, -8.2 * scale);
  ctx.lineTo(-4.2 * scale, -4.5 * scale);
  ctx.lineTo(-1.5 * scale, -1.5 * scale);
  ctx.lineTo(-6.8 * scale, -2.2 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawBossArmor(scale: number): void {
  ctx.fillStyle = '#111';
  roundRect(-11 * scale, -2 * scale, 22 * scale, 17 * scale, 4 * scale); ctx.fill();
  ctx.fillStyle = '#7a0f0f';
  roundRect(-9 * scale, 0, 18 * scale, 10 * scale, 3 * scale); ctx.fill();
  ctx.fillStyle = '#450000';
  ctx.fillRect(-14 * scale, -1 * scale, 5 * scale, 8 * scale);
  ctx.fillRect(9 * scale, -1 * scale, 5 * scale, 8 * scale);
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(0, -10 * scale, 7 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8d1010';
  ctx.beginPath();
  ctx.moveTo(-6 * scale, -10 * scale);
  ctx.quadraticCurveTo(0, -16 * scale, 6 * scale, -10 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff5a2a';
  ctx.fillRect(-4 * scale, -11 * scale, 2.5 * scale, 1.8 * scale);
  ctx.fillRect(1.5 * scale, -11 * scale, 2.5 * scale, 1.8 * scale);
}

function drawTierSprite(e: Enemy): void {
  const baseScale = e.tier === 'boss' ? 1.35 : e.tier === 'splitter' ? 1.15 : e.tier === 'charger' ? 1.05 : e.tier === 'minion' ? 0.82 : 0.95;

  if (e.tier === 'boss') {
    drawFeet(baseScale, '#2a0b0b');
    drawBossArmor(baseScale);
    drawShoulderPads(baseScale * 1.12, '#300606');
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(-6 * baseScale, 15 * baseScale, 4 * baseScale, 6 * baseScale);
    ctx.fillRect(2 * baseScale, 15 * baseScale, 4 * baseScale, 6 * baseScale);
    drawShortBlade(baseScale * 1.15, '#1f1f1f', '#d6dde8');
    drawBackBanner(baseScale, '#111', '#5a0f0f');
    if (e.phase2) {
      ctx.strokeStyle = 'rgba(255,50,0,0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, e.w / 2 + 8 + Math.sin(Date.now() / 100) * 3, 0, Math.PI * 2); ctx.stroke();
    }
    return;
  }

  if (e.tier === 'charger') {
    drawHumanBase(baseScale, '#250707', '#7a1212', '#111', '#ff5f3a');
    drawStrawHat(baseScale * 0.95, '#3a1008', '#6a1d10');
    drawShoulderPads(baseScale, '#4a0a0a');
    drawSash(baseScale, '#240707');
    ctx.fillStyle = '#4a0a0a';
    ctx.fillRect(-8 * baseScale, -1 * baseScale, 3 * baseScale, 5 * baseScale);
    ctx.fillRect(5 * baseScale, -1 * baseScale, 3 * baseScale, 5 * baseScale);
    drawClub(baseScale, '#5b3520', '#8f6a4c');
    if (e.chargeT > 0) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath(); ctx.arc(0, 0, e.w / 2 + 5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    return;
  }

  if (e.tier === 'sniper') {
    drawHumanBase(baseScale, '#132100', '#2f4a09', '#0d1307', '#d1f07a');
    drawSash(baseScale, '#172907');
    ctx.fillStyle = '#101808';
    ctx.beginPath();
    ctx.moveTo(-6 * baseScale, -7 * baseScale);
    ctx.lineTo(0, -12 * baseScale);
    ctx.lineTo(6 * baseScale, -7 * baseScale);
    ctx.lineTo(4 * baseScale, -2 * baseScale);
    ctx.lineTo(-4 * baseScale, -2 * baseScale);
    ctx.closePath();
    ctx.fill();
    drawBow(baseScale, '#6e4d1c', '#cfc79f');
    return;
  }

  if (e.tier === 'splitter') {
    drawHumanBase(baseScale, '#2e1805', '#8f4f14', '#16100a', '#ffd96a');
    drawShoulderPads(baseScale, '#5b2a08');
    ctx.fillStyle = '#d8c8b0';
    roundRect(-4.8 * baseScale, -8.8 * baseScale, 9.6 * baseScale, 5.5 * baseScale, 2 * baseScale); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, -8.6 * baseScale); ctx.lineTo(0, -3.2 * baseScale); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-3 * baseScale, -6 * baseScale); ctx.lineTo(3 * baseScale, -6 * baseScale); ctx.stroke();
    ctx.fillStyle = '#3b1b06';
    ctx.beginPath(); ctx.moveTo(-6 * baseScale, -10 * baseScale); ctx.lineTo(-2 * baseScale, -7 * baseScale); ctx.lineTo(-5 * baseScale, -4 * baseScale); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6 * baseScale, -10 * baseScale); ctx.lineTo(2 * baseScale, -7 * baseScale); ctx.lineTo(5 * baseScale, -4 * baseScale); ctx.closePath(); ctx.fill();
    return;
  }

  if (e.tier === 'elite') {
    drawHumanBase(baseScale, '#0a0a0f', '#1e1e28', '#07070b', '#c85eff');
    drawHeadband(baseScale, '#50236f');
    drawShoulderPads(baseScale, '#14141d');
    ctx.fillStyle = '#1e1029';
    ctx.fillRect(-8 * baseScale, -2 * baseScale, 3 * baseScale, 7 * baseScale);
    ctx.fillRect(5 * baseScale, -2 * baseScale, 3 * baseScale, 7 * baseScale);
    ctx.fillStyle = '#2a1438';
    ctx.beginPath();
    ctx.moveTo(-5 * baseScale, -8 * baseScale);
    ctx.lineTo(0, -12 * baseScale);
    ctx.lineTo(5 * baseScale, -8 * baseScale);
    ctx.lineTo(4 * baseScale, -4 * baseScale);
    ctx.lineTo(-4 * baseScale, -4 * baseScale);
    ctx.closePath();
    ctx.fill();
    drawShortBlade(baseScale * 0.9, '#161616', '#d9e0f0');
    drawBackBanner(baseScale * 0.8, '#222', '#4a1667');
    ctx.strokeStyle = 'rgba(140,0,255,.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, e.w / 2 + 4 + Math.sin(Date.now() / 150) * 2, 0, Math.PI * 2); ctx.stroke();
    return;
  }

  if (e.tier === 'minion') {
    drawHumanBase(baseScale, '#0f1018', '#23243a', '#080910', '#ff71c0');
    drawMask(baseScale, '#161622');
    drawHeadband(baseScale * 0.8, '#34354f');
    ctx.fillStyle = '#2c2d46';
    ctx.beginPath();
    ctx.moveTo(-4 * baseScale, -8 * baseScale);
    ctx.lineTo(0, -10.5 * baseScale);
    ctx.lineTo(4 * baseScale, -8 * baseScale);
    ctx.lineTo(0, -5.5 * baseScale);
    ctx.closePath();
    ctx.fill();
    return;
  }

  drawHumanBase(baseScale, '#210707', '#5a1111', '#110708', '#ff4444');
  drawStrawHat(baseScale * 0.9, '#33150a', '#5f2615');
  drawSash(baseScale, '#2c0c0c');
  drawPolearm(baseScale * 0.82, '#764b28', '#d8dce3');
}

export function drawEnemy(e: Enemy): void {
  const cx = e.x + e.w / 2;
  const cy = e.y + e.h / 2;
  const r = e.w / 2;
  const pct = Math.max(0, e.hp / e.maxHp);
  const faceRight = Math.cos(e.facing) >= 0;

  drawAttackGlow(cx, cy, r, e);
  drawBlockGlow(cx, cy, r, e);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(faceRight ? 1 : -1, 1);
  drawTierSprite(e);
  ctx.restore();

  if (e.tier !== 'boss') {
    const faceDotX = cx + Math.cos(e.facing) * r * 0.82;
    const faceDotY = cy + Math.sin(e.facing) * r * 0.82;
    const faceDotCol = e.aiState === 'chase' ? '#ff4400' : e.aiState === 'suspect' ? '#ffcc00' : 'rgba(255,255,255,0.55)';
    ctx.fillStyle = faceDotCol;
    ctx.beginPath(); ctx.arc(faceDotX, faceDotY, 2.2, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = 'rgba(0,0,0,.7)';
  roundRect(e.x, e.y - 9, e.w, 5, 2); ctx.fill();
  ctx.fillStyle = pct > 0.5 ? '#22cc44' : pct > 0.25 ? '#ffaa00' : '#ff2200';
  roundRect(e.x, e.y - 9, e.w * pct, 5, 2); ctx.fill();
}
