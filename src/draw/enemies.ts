import { ctx } from '../canvas';
import { T } from '../constants';
import type { Enemy } from '../types';
import { roundRect } from './helpers';

export function drawEnemy(e: Enemy): void {
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2, r = e.w / 2;
  const pct = Math.max(0, e.hp / e.maxHp);

  // Attack state glow
  if (e.atkState === 'windup') {
    const pulse = 0.3 + 0.4 * (1 - e.atkT / (e.windup || 20));
    ctx.globalAlpha = pulse; ctx.fillStyle = '#ff2200';
    ctx.beginPath(); ctx.arc(cx, cy, r + 7, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  } else if (e.atkState === 'strike') {
    ctx.globalAlpha = 0.55; ctx.fillStyle = '#ff6600';
    ctx.beginPath(); ctx.arc(cx, cy, r + 5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  } else if (e.atkState === 'recovery') {
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#aaaaff';
    ctx.beginPath(); ctx.arc(cx, cy, r + 4, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }

  // Block glow
  if (e.canBlock && e.blocking) {
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#4488ff';
    ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = '#88aaff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2); ctx.stroke();
  }

  const faceDotX = cx + Math.cos(e.facing) * r * 0.82;
  const faceDotY = cy + Math.sin(e.facing) * r * 0.82;
  const faceDotCol = e.aiState === 'chase' ? '#ff4400' : e.aiState === 'suspect' ? '#ffcc00' : 'rgba(255,255,255,0.55)';

  ctx.save(); ctx.translate(cx, cy); ctx.rotate(e.facing);

  if (e.tier === 'boss') {
    ctx.restore(); ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = '#1a0000'; roundRect(-r, -r, e.w, e.h, 4); ctx.fill();
    ctx.fillStyle = '#8B0000'; roundRect(-r + 3, -r + 3, e.w - 6, e.h * 0.55, 3); ctx.fill();
    ctx.fillStyle = '#cc0000'; ctx.fillRect(-r - 6, -r + 4, 8, 10); ctx.fillRect(r - 2, -r + 4, 8, 10);
    ctx.fillStyle = '#111'; roundRect(-r + 2, -r - 6, e.w - 4, 14, 3); ctx.fill();
    ctx.fillStyle = '#880000'; ctx.fillRect(-r + 2, -r - 6, e.w - 4, 4);
    ctx.fillStyle = '#cc0000';
    ctx.beginPath(); ctx.moveTo(0, -r - 6); ctx.lineTo(-5, -r - 14); ctx.lineTo(5, -r - 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(-r + 6, -r + 3, 6, 4); ctx.fillRect(r - 12, -r + 3, 6, 4);
    ctx.fillStyle = '#888'; ctx.fillRect(-r - 2, 2, e.w + 4, 3);
    ctx.fillStyle = '#cc9900'; ctx.fillRect(-r - 2, 2, 8, 3);
    if (e.phase2) {
      ctx.strokeStyle = 'rgba(255,50,0,0.45)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, r + 8 + Math.sin(Date.now() / 100) * 3, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  } else if (e.tier === 'charger') {
    ctx.fillStyle = '#5a0000'; roundRect(-r, -r * 0.7, e.w, e.h * 0.8, 3); ctx.fill();
    ctx.fillStyle = '#8B0000'; roundRect(-r + 2, -r * 0.7 + 2, e.w - 4, e.h * 0.4, 2); ctx.fill();
    ctx.fillStyle = '#2a0000'; ctx.beginPath(); ctx.arc(0, -r * 0.5, r * 0.65, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#770000'; ctx.fillRect(-r * 0.65, -r * 0.5, r * 1.3, 4);
    ctx.fillStyle = '#999'; ctx.fillRect(r * 0.3, -r * 0.9, 3, r * 1.2);
    ctx.fillStyle = '#cc8800'; ctx.fillRect(r * 0.1, -r * 0.2, r * 0.8, 3);
    if (e.chargeT > 0) {
      ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffcc00';
      ctx.beginPath(); ctx.arc(0, 0, r + 5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    }
    ctx.restore();
  } else if (e.tier === 'sniper') {
    ctx.fillStyle = '#1a2a00'; roundRect(-r, -r * 0.8, e.w, e.h * 0.85, 3); ctx.fill();
    ctx.fillStyle = '#2a4400'; roundRect(-r + 2, -r * 0.8 + 2, e.w - 4, e.h * 0.4, 2); ctx.fill();
    ctx.fillStyle = '#3a2a00';
    ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.lineTo(-r * 0.9, -r * 0.1); ctx.lineTo(r * 0.9, -r * 0.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a3a00'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(r * 0.6, 0, r * 0.7, -1.1, 1.1); ctx.stroke();
    ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-r * 0.3, 0); ctx.lineTo(r * 0.5, 0); ctx.stroke();
    ctx.fillStyle = '#aaa'; ctx.beginPath(); ctx.moveTo(r * 0.5, -2); ctx.lineTo(r * 0.8, 0); ctx.lineTo(r * 0.5, 2); ctx.closePath(); ctx.fill();
    if (e.aiState === 'chase' || e.aiState === 'suspect') {
      ctx.strokeStyle = 'rgba(200,255,100,.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(r * 0.8, 0); ctx.lineTo(T * 11, 0); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  } else if (e.tier === 'splitter') {
    ctx.restore(); ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = '#5a2800'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8B4000'; ctx.beginPath(); ctx.arc(-2, -2, r - 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.moveTo(-r * 0.4, -r * 0.7); ctx.lineTo(-r * 0.55, -r * 1.2); ctx.lineTo(-r * 0.2, -r * 0.7); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(r * 0.4, -r * 0.7); ctx.lineTo(r * 0.55, -r * 1.2); ctx.lineTo(r * 0.2, -r * 0.7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffdd00'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, -r * 0.1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, -r * 0.1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, -r + 2); ctx.lineTo(0, r - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r + 2, 0); ctx.lineTo(r - 2, 0); ctx.stroke();
    ctx.restore();
  } else if (e.tier === 'elite') {
    ctx.fillStyle = '#0a0a0a'; roundRect(-r, -r * 0.85, e.w, e.h * 0.9, 4); ctx.fill();
    ctx.fillStyle = '#151515'; roundRect(-r * 0.6, -r * 0.7, r * 1.2, r * 0.8, 2); ctx.fill();
    ctx.fillStyle = '#aa00ff';
    ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.35, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.25, -r * 0.35, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#444';
    for (let s = 0; s < 4; s++) {
      const sa = s * Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sa) * 2, Math.sin(sa) * 2);
      ctx.lineTo(Math.cos(sa) * 6 - r * 0.5, Math.sin(sa) * 6 + r * 0.3);
      ctx.lineTo(Math.cos(sa + Math.PI / 2) * 2, Math.sin(sa + Math.PI / 2) * 2);
      ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(140,0,255,.35)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r + 4 + Math.sin(Date.now() / 150) * 2, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  } else if (e.tier === 'minion') {
    ctx.fillStyle = '#111118'; roundRect(-r, -r, e.w, e.h, 3); ctx.fill();
    ctx.fillStyle = '#1a1a2a'; roundRect(-r + 2, -r + 2, e.w - 4, e.h * 0.5, 2); ctx.fill();
    ctx.fillStyle = '#ff44aa';
    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, -r * 0.2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else {
    // basic ashigaru
    ctx.fillStyle = '#2a0000'; roundRect(-r, -r * 0.85, e.w, e.h * 0.9, 3); ctx.fill();
    ctx.fillStyle = '#440000'; roundRect(-r + 2, -r * 0.85 + 2, e.w - 4, e.h * 0.4, 2); ctx.fill();
    ctx.fillStyle = '#1a0000'; ctx.beginPath(); ctx.arc(0, -r * 0.5, r * 0.55, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#330000'; ctx.fillRect(-r * 0.55, -r * 0.5, r * 1.1, 3);
    ctx.fillStyle = '#6B4226'; ctx.fillRect(r * 0.2, -r * 0.9, 2, r * 1.3);
    ctx.fillStyle = '#bbb';
    ctx.beginPath(); ctx.moveTo(r * 0.2 - 2, -r * 0.9); ctx.lineTo(r * 0.2 + 1, -r * 1.3); ctx.lineTo(r * 0.2 + 4, -r * 0.9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff3333';
    ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.35, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.2, -r * 0.35, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Facing dot
  if (e.tier !== 'boss') {
    ctx.fillStyle = faceDotCol;
    ctx.beginPath(); ctx.arc(faceDotX, faceDotY, 2.2, 0, Math.PI * 2); ctx.fill();
  }

  // HP bar
  ctx.fillStyle = 'rgba(0,0,0,.7)'; roundRect(e.x, e.y - 9, e.w, 5, 2); ctx.fill();
  ctx.fillStyle = pct > 0.5 ? '#22cc44' : pct > 0.25 ? '#ffaa00' : '#ff2200';
  roundRect(e.x, e.y - 9, e.w * pct, 5, 2); ctx.fill();
}
