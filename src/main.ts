import { S, sv, store } from './state';
import { canvas, ctx, resize } from './canvas';
import { loadSv } from './save';
import { hideAll } from './ui';
import { makePlayer } from './player';
import { doMelee, doShoot, doDodge, useActiveItem } from './combat';
import { startMusic } from './audio';
import { updateDungeon } from './update';
import { returnToTown, nextFloor } from './game-flow';
import { initTown, updateTown } from './town';
import { drawDungeon } from './draw/dungeon';
import { drawTown } from './draw/town';

// Init
resize();
window.addEventListener('resize', resize);
loadSv();

// Game loop
function loop(): void {
  const m = S.mode;
  if (m === 'town') { updateTown(); drawTown(); }
  else if (m === 'dungeon') { updateDungeon(); drawDungeon(); }
  else if (m === 'pause' && store.G) {
    drawDungeon();
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 0, w, h);
    ctx.font = '600 16px monospace'; ctx.fillStyle = '#ddd'; ctx.textAlign = 'center';
    ctx.fillText('PAUSED', w / 2, h / 2);
    ctx.font = '10px monospace'; ctx.fillStyle = '#888';
    ctx.fillText('Click to resume', w / 2, h / 2 + 20);
  } else {
    if (store.G) drawDungeon();
    else if (store.TW || m === 'shop') drawTown();
  }

  // Fade transition overlay
  if (store.fadeDir !== 0) {
    store.fade += store.fadeDir * 0.04;
    if (store.fade >= 1 && store.fadeDir === 1) {
      store.fade = 1;
      if (store.fadeCb) { store.fadeCb(); store.fadeCb = null; }
      store.fadeDir = -1;
    } else if (store.fade <= 0 && store.fadeDir === -1) {
      store.fade = 0; store.fadeDir = 0;
    }
  }
  if (store.fade > 0) {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = `rgba(0,0,0,${store.fade})`;
    ctx.fillRect(0, 0, w, h);
    if (store.fade > 0.5 && store.fadeText) {
      ctx.globalAlpha = Math.min(1, (store.fade - 0.5) * 4);
      ctx.font = '600 14px monospace'; ctx.fillStyle = '#ddd'; ctx.textAlign = 'center';
      ctx.fillText(store.fadeText, w / 2, h / 2);
      ctx.globalAlpha = 1;
    }
  }

  requestAnimationFrame(loop);
}

// Mouse events
canvas.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  if (store.TW) store.TW.mouse = { x: mx, y: my };
  if (store.G) store.G.mouse = { x: mx, y: my };
});
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('mousedown', e => {
  e.preventDefault();
  if (e.button === 0 && store.G && S.mode === 'dungeon') doMelee();
  if (e.button === 2 && store.G) store.G.rmb = true;
});
canvas.addEventListener('mouseup', e => {
  if (e.button === 2 && store.G) store.G.rmb = false;
});
canvas.addEventListener('selectstart', e => e.preventDefault());

// Keyboard events
document.addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
  if (e.repeat) return;
  if (S.mode === 'pause' && store.G) { S.mode = 'dungeon'; return; }
  if (S.mode === 'town' && store.TW) store.TW.keys[e.code] = true;
  if (S.mode === 'dungeon' && store.G) {
    store.G.keys[e.code] = true;
    if (e.code === 'KeyE') doShoot();
    if (e.code === 'KeyQ') useActiveItem();
    if (e.code === 'KeyM') store.G.showMap = !store.G.showMap;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') store.G.sneaking = !store.G.sneaking;
    if (e.code === 'Space') doDodge();
  }
});
document.addEventListener('keyup', e => {
  if (store.TW) store.TW.keys[e.code] = false;
  if (store.G) store.G.keys[e.code] = false;
});
window.addEventListener('blur', () => {
  if (store.TW) store.TW.keys = {};
  if (store.G) { store.G.keys = {}; store.G.rmb = false; }
  if (S.mode === 'dungeon') S.mode = 'pause';
});
window.addEventListener('focus', () => {
  if (S.mode === 'pause' && store.G) S.mode = 'dungeon';
});

// Panel buttons
document.getElementById('titleBtn')!.onclick = () => {
  S.gold = sv.gold; S.player = makePlayer(); hideAll(); S.mode = 'town'; initTown();
  startMusic('Town');
  if (!store.running) { store.running = true; loop(); }
};
document.getElementById('deathTownBtn')!.onclick = () => {
  S.player = makePlayer(); returnToTown();
};
document.getElementById('cpTownBtn')!.onclick = () => { returnToTown(); };
document.getElementById('cpDeepBtn')!.onclick = () => {
  hideAll(); S.mode = 'dungeon'; nextFloor();
};
document.getElementById('shopClose')!.onclick = () => {
  hideAll(); S.mode = 'town';
};
