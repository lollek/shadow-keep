import { S, sv, store } from './state';
import { T, getTheme } from './constants';
import { snd, startMusic } from './audio';
import { setMsg, updateHUD, hideAll, showPanel } from './ui';
import { writeSv } from './save';
import { generateMap } from './map-gen';
import { spawnEnemy, makeBoss } from './enemies';
import { updateCamera } from './camera';
import { updateFog } from './fog';
import { initTown } from './town';
import type { DungeonState, Room } from './types';

export function startDescent(): void {
  if (!S.player) return;
  S.depth = 0; S.gold = sv.gold;
  S.run = { kills: 0, goldEarned: 0, startTime: Date.now() };
  nextFloor();
}

export function returnToTown(): void {
  sv.gold = S.gold; writeSv();
  store.pauseKind = null;
  S.mode = 'town';
  hideAll(); initTown();
  startMusic('Town');
}

export function nextFloor(): void {
  S.depth++;
  if (S.depth > sv.deepest) { sv.deepest = S.depth; writeSv(); }
  const floor = S.depth;
  const theme = getTheme(floor);
  const text = floor % 5 === 0
    ? `★ BOSS FLOOR ${floor} ★`
    : `Floor ${floor} — ${theme.name}`;
  fadeTransition(text, () => {
    if (floor % 5 === 0) initBossFloor(floor);
    else initDungeonFloor(floor);
  });
}

export function fadeTransition(text: string, cb: () => void): void {
  store.fadeText = text;
  store.fadeCb = cb;
  store.fade = 0;
  store.fadeDir = 1;
}

function initDungeonFloor(floor: number): void {
  S.mode = 'dungeon'; hideAll();
  const p = S.player!;
  p.invincible = 0; p.meleeCd = 0; p.arrowCd = 0;

  const { map, rooms, startRoom, exitRoom } = generateMap(floor);
  p.x = startRoom.cx * T + T / 2 - p.w / 2;
  p.y = startRoom.cy * T + T / 2 - p.h / 2;

  const fog = Array.from({ length: map.length }, () => new Uint8Array(map[0].length));
  const enemies = rooms.flatMap((r, i) => {
    if (i === 0) return [];
    if (r === exitRoom) return [];
    const count = 1 + Math.floor(Math.random() * Math.max(1, Math.floor(floor / 2)));
    return Array.from({ length: count }, () => {
      const ex = (r.x + 1 + Math.floor(Math.random() * (r.w - 2))) * T;
      const ey = (r.y + 1 + Math.floor(Math.random() * (r.h - 2))) * T;
      return spawnEnemy(ex, ey, floor);
    });
  });

  const theme = getTheme(floor);
  store.G = {
    mode: 'explore', floor, map, rooms, startRoom, exitRoom,
    player: p, enemies, projectiles: [], particles: [], caltrops: [],
    fog, keys: {}, mouse: { x: 0, y: 0 },
    cam: { x: 0, y: 0 },
    meleeFlash: null,
    showMap: false,
    sneaking: false,
    goldBonus: 0,
    rmb: false,
    isSneaking: false,
    bossDefeated: false,
    spikeCd: 0,
    theme,
  };
  updateCamera(); updateFog();
  startMusic(theme.name);
  setMsg('Floor ' + floor + ' — ' + theme.name, 2500);
  document.getElementById('ctrl')!.textContent = 'WASD · Click=Melee · E=Throw · M=Map · H/?=Help';
  updateHUD();
}

function initBossFloor(floor: number): void {
  S.mode = 'dungeon'; hideAll();
  const p = S.player!;
  p.invincible = 0; p.meleeCd = 0; p.arrowCd = 0;

  const BW = 22, BH = 16;
  const map = Array.from({ length: BH }, () => new Uint8Array(BW));
  for (let y = 1; y < BH - 1; y++)
    for (let x = 1; x < BW - 1; x++) map[y][x] = 1;

  const pillars: [number, number][] = [
    [5, 4], [5, BH - 5], [BW - 6, 4], [BW - 6, BH - 5],
    [Math.floor(BW / 2) - 1, Math.floor(BH / 2) - 2],
    [Math.floor(BW / 2) + 1, Math.floor(BH / 2) + 2],
  ];
  pillars.forEach(([px, py]) => {
    if (py > 0 && py < BH - 1 && px > 0 && px < BW - 1) {
      map[py][px] = 0; map[py][px + 1] = 0; map[py + 1][px] = 0; map[py + 1][px + 1] = 0;
    }
  });
  map[Math.floor(BH / 2)][BW - 2] = 2;

  const startRoom: Room = { cx: 3, cy: Math.floor(BH / 2), x: 1, y: 1, w: BW - 2, h: BH - 2 };
  const exitRoom: Room = { cx: BW - 2, cy: Math.floor(BH / 2), x: BW - 3, y: Math.floor(BH / 2) - 1, w: 2, h: 2 };
  const fog = Array.from({ length: BH }, () => new Uint8Array(BW).fill(2));

  p.x = startRoom.cx * T + T / 2 - p.w / 2;
  p.y = startRoom.cy * T + T / 2 - p.h / 2;

  const boss = makeBoss(floor, (BW - 8) * T, Math.floor(BH / 2) * T);

  store.G = {
    mode: 'boss', floor, map, rooms: [startRoom], startRoom, exitRoom,
    player: p, enemies: [boss], projectiles: [], particles: [], caltrops: [],
    fog, keys: {}, mouse: { x: 0, y: 0 },
    cam: { x: 0, y: 0 },
    meleeFlash: null,
    showMap: false,
    sneaking: false,
    goldBonus: 0,
    rmb: false,
    isSneaking: false,
    bossDefeated: false,
    spikeCd: 0,
    theme: getTheme(floor),
  };
  updateCamera();
  startMusic(getTheme(floor).name);
  snd('boss'); setMsg('★ BOSS FLOOR ' + floor + ' ★ Exit sealed until the boss falls.', 3200);
  document.getElementById('ctrl')!.textContent = 'WASD · Click=Melee · E=Throw · H/?=Help';
  updateHUD();
}

export function onFloorExit(): void {
  if (store.fadeDir !== 0) return;
  const G = store.G!;
  snd('exit');
  if (G.floor % 5 === 0) {
    const bonus = G.mode === 'boss' ? 60 : 40;
    S.gold += bonus; sv.gold = S.gold; writeSv();
    store.pauseKind = 'checkpoint';
    S.mode = 'pause';
    document.getElementById('cpTitle')!.textContent = 'Floor ' + G.floor + ' Complete!';
    document.getElementById('cpMsg')!.innerHTML =
      `Checkpoint! Bonus: <b style="color:#ffd700">+${bonus} gold</b> (total: ${S.gold})<br><br>Return to town to spend at shops, or press deeper.`;
    showPanel('cpPanel');
  } else {
    nextFloor();
  }
}
