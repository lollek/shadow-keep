import { S, sv, store } from './state';
import { ACTIVE_ITEMS, WEAPONS } from './constants';
import type { ActiveItemId } from './types';

export function setMsg(t: string, d = 2200): void {
  document.getElementById('msg')!.textContent = t;
  store.msgT = d;
}

export function tickMsg(): void {
  if (store.msgT > 0) {
    store.msgT -= 16;
    if (store.msgT <= 0) document.getElementById('msg')!.textContent = '';
  }
}

export function updateHUD(): void {
  const p = S.player;
  if (!p) return;
  const pct = Math.max(0, p.hp) / p.maxHp * 100;
  document.getElementById('hpf')!.style.width = pct + '%';
  document.getElementById('hpf')!.style.background =
    pct > 50 ? '#dd0044' : pct > 25 ? '#ff6600' : '#ff1100';
  document.getElementById('hpt')!.textContent =
    Math.max(0, Math.ceil(p.hp)) + '/' + p.maxHp;

  const stp = Math.max(0, p.stamina) / p.maxStamina * 100;
  document.getElementById('stf')!.style.width = stp + '%';
  document.getElementById('stf')!.style.background =
    p.blocking ? (p.parryWindow > 0 ? '#ffdd00' : '#4488ff') : '#2255aa';

  document.getElementById('gld')!.textContent = String(S.gold);
  document.getElementById('atk')!.textContent = String(p.atk);
  document.getElementById('wpn')!.textContent = WEAPONS[p.weapon].name;
  document.getElementById('arr')!.textContent = String(p.arrows);
  document.getElementById('loc')!.textContent =
    S.mode === 'town' ? 'Town' : ('Floor ' + S.depth);
  document.getElementById('deep')!.textContent = String(sv.deepest || '—');

  const slotEl = document.getElementById('activeSlot')!;
  if (p.activeItem) {
    const def = ACTIVE_ITEMS[p.activeItem as ActiveItemId];
    slotEl.style.display = '';
    document.getElementById('activeIcon')!.textContent = def.icon;
    document.getElementById('activeName')!.textContent = def.name;
    const cdEl = document.getElementById('activeCd')!;
    if (p.activeCd > 0) {
      cdEl.textContent = '(' + Math.ceil(p.activeCd / 60) + 's)';
      cdEl.style.color = '#888';
    } else {
      cdEl.textContent = '[Q]';
      cdEl.style.color = '#ffd700';
    }
  } else {
    slotEl.style.display = 'none';
  }
}

const ALL_PANELS = ['titlePanel', 'deathPanel', 'cpPanel', 'shopPanel', 'weaponPanel'];

export function openHelp(): void {
  store.helpOpen = true;
  document.getElementById('helpPanel')!.style.display = 'flex';
}

export function closeHelp(): void {
  store.helpOpen = false;
  document.getElementById('helpPanel')!.style.display = 'none';
}

export function toggleHelp(): void {
  if (store.helpOpen) closeHelp();
  else openHelp();
}

export function showPanel(id: string): void {
  ALL_PANELS.forEach(p => document.getElementById(p)!.style.display = 'none');
  document.getElementById(id)!.style.display = 'flex';
}

export function hideAll(): void {
  ALL_PANELS.forEach(p => document.getElementById(p)!.style.display = 'none');
}
