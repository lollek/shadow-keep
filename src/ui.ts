import { S, sv, store } from './state';

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
  document.getElementById('arr')!.textContent = String(p.arrows);
  document.getElementById('loc')!.textContent =
    S.mode === 'town' ? 'Town' : ('Floor ' + S.depth);
  document.getElementById('deep')!.textContent = String(sv.deepest || '—');
}

const ALL_PANELS = ['titlePanel', 'deathPanel', 'cpPanel', 'shopPanel'];

export function showPanel(id: string): void {
  ALL_PANELS.forEach(p => document.getElementById(p)!.style.display = 'none');
  document.getElementById(id)!.style.display = 'flex';
}

export function hideAll(): void {
  ALL_PANELS.forEach(p => document.getElementById(p)!.style.display = 'none');
}
