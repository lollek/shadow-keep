import { S, sv, store } from './state';
import { canvas, resize } from './canvas';
import { loadSv } from './save';
import { hideAll } from './ui';
import { makePlayer } from './player';
import { doMelee, doShoot, doDodge } from './combat';
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
  else {
    if (store.G) drawDungeon();
    else if (store.TW || m === 'shop') drawTown();
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
  if (S.mode === 'town' && store.TW) store.TW.keys[e.code] = true;
  if (S.mode === 'dungeon' && store.G) {
    store.G.keys[e.code] = true;
    if (e.code === 'KeyE') doShoot();
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
});

// Panel buttons
document.getElementById('titleBtn')!.onclick = () => {
  S.gold = sv.gold; S.player = makePlayer(); hideAll(); S.mode = 'town'; initTown();
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
