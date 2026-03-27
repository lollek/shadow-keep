import { S, sv, store } from './state';
import { canvas, RENDER_SCALE } from './canvas';
import { UI_HEIGHT } from './constants';
import { snd } from './audio';
import { setMsg, tickMsg, updateHUD, hideAll, showPanel } from './ui';
import { writeSv } from './save';
import { startDescent } from './game-flow';
import { makePlayer } from './player';
import { BLDGS, SW, SA, SF, SS, WEAPONS } from './constants';
import type { BuildingRect, ShopItem, WeaponId } from './types';

export function initTown(): void {
  const { W, H } = tvArea();
  if (!S.player) S.player = makePlayer();
  const p = S.player;
  p.x = W / 2 - p.w / 2; p.y = H * 0.8;
  store.TW = { keys: {}, mouse: { x: 0, y: 0 } };
  hideAll();
  document.getElementById('ctrl')!.textContent = 'WASD to walk · F or Space to enter · H or ? for help';
  snd('town'); updateHUD();
}

export function tvArea(): { W: number; H: number } {
  return { W: canvas.width / RENDER_SCALE, H: (canvas.height - UI_HEIGHT) / RENDER_SCALE };
}

export function bldgRects(): BuildingRect[] {
  const { W, H } = tvArea();
  return BLDGS.map(b => {
    const bw = 90, bh = 80;
    const bx = b.x * W - bw / 2;
    const by = b.yMul ? b.yMul * H - bh / 2 : H * 0.42 - bh / 2;
    return { ...b, bx, by, bw, bh };
  });
}

export function updateTown(): void {
  const TW = store.TW;
  if (!TW || !S.player || S.mode !== 'town') return;
  const p = S.player;
  const { W, H } = tvArea();
  const spd = 2.2;
  const dx = ((TW.keys['KeyD'] || TW.keys['ArrowRight']) ? 1 : 0) - ((TW.keys['KeyA'] || TW.keys['ArrowLeft']) ? 1 : 0);
  const dy = ((TW.keys['KeyS'] || TW.keys['ArrowDown']) ? 1 : 0) - ((TW.keys['KeyW'] || TW.keys['ArrowUp']) ? 1 : 0);
  if (dx || dy) { const l = Math.hypot(dx, dy); p.x += dx / l * spd; p.y += dy / l * spd; }
  p.x = Math.max(0, Math.min(W - p.w, p.x)); p.y = Math.max(0, Math.min(H - p.h, p.y));
  tickMsg(); updateHUD();
  bldgRects().forEach(b => {
    if (p.x + p.w > b.bx + 10 && p.x < b.bx + b.bw - 10 && p.y + p.h > b.by + b.bh * 0.6 && p.y < b.by + b.bh) {
      setMsg('Press F or Space — ' + b.label, 400);
      if (TW.keys['KeyF'] || TW.keys['Space']) {
        TW.keys['KeyF'] = TW.keys['Space'] = false;
        enterBuilding(b.id);
      }
    }
  });
}

function enterBuilding(id: string): void {
  if (id === 'dungeon') { openWeaponSelect(); return; }
  if (id === 'shrine' && sv.deepest < 10) {
    setMsg('Reach floor 10 to unlock the Shrine');
    return;
  }
  const shops: Record<string, [string, string, ShopItem[]]> = {
    weapon: ['Swordsmith', 'Blades & Speed', SW],
    apoth: ['Herbalist', 'Healing & HP', SA],
    fletcher: ['Toolmaker', 'Shuriken & Tricks', SF],
    shrine: ['Shrine', 'Actives & Upgrades', SS],
  };
  if (shops[id]) openShop(...shops[id]);
}

function openWeaponSelect(): void {
  if (!S.player) return;
  S.mode = 'weapon-select';
  document.getElementById('weaponTitle')!.textContent = 'Choose Your Weapon';
  document.getElementById('weaponSub')!.textContent = 'Select a stance before descending from the Castle Gate';
  const grid = document.getElementById('weaponGrid')!;
  grid.innerHTML = '';

  (Object.entries(WEAPONS) as [WeaponId, (typeof WEAPONS)[WeaponId]][]).forEach(([weaponId, weapon]) => {
    const c = document.createElement('div');
    c.className = 'sc r-rare' + (S.player!.weapon === weaponId ? ' sel' : '');
    c.innerHTML = `<div class="sc-icon">${weapon.icon}</div><div class="sc-name">${weapon.name}</div><div class="sc-desc">${weapon.desc}</div><div class="sc-cost">Click to descend</div>`;
    c.onclick = () => {
      S.player!.weapon = weaponId;
      hideAll();
      startDescent();
    };
    grid.appendChild(c);
  });

  showPanel('weaponPanel');
}

export function openShop(title: string, sub: string, items: ShopItem[]): void {
  S.mode = 'shop';
  document.getElementById('shopTitle')!.textContent = title;
  document.getElementById('shopSub')!.textContent = sub + ' · Gold: ' + S.gold;
  const grid = document.getElementById('shopGrid')!;
  grid.innerHTML = '';
  items.forEach(item => {
    const locked = (item.r === 'rare' && sv.deepest < 5) || (item.r === 'epic' && sv.deepest < 10);
    const ok = !locked && S.gold >= item.c;
    const c = document.createElement('div');
    c.className = 'sc r-' + item.r + (ok ? '' : ' cant');
    if (locked) {
      const req = item.r === 'epic' ? 10 : 5;
      c.innerHTML = `<div class="sc-icon">🔒</div><div class="sc-name">${item.n}</div><div class="sc-desc" style="color:#666">Reach floor ${req}</div><div class="sc-cost" style="color:#555">Locked</div>`;
    } else {
      c.innerHTML = `<div class="sc-icon">${item.i}</div><div class="sc-name">${item.n}</div><div class="sc-desc">${item.d}</div><div class="sc-cost">${ok ? item.c + ' gold' : '🔒 ' + item.c + ' gold'}</div>`;
    }
    if (ok) c.onclick = () => {
      S.gold -= item.c; sv.gold = S.gold; writeSv();
      item.a(S.player!); snd('buy');
      openShop(title, sub, items);
    };
    grid.appendChild(c);
  });
  showPanel('shopPanel');
}
