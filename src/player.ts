import type { ItemId, Player } from './types';

export function makePlayer(): Player {
  return {
    x: 0, y: 0, w: 20, h: 20,
    hp: 100, maxHp: 100, spd: 2.2, atk: 10,
    arrows: 10, items: [],
    invincible: 0, meleeCd: 0, arrowCd: 0,
    stamina: 100, maxStamina: 100,
    blocking: false, parryWindow: 0,
    dodgeT: 0, dodgeDx: 0, dodgeDy: 0,
    dodgeCd: 0, guardBreaks: 0,
    activeItem: null, activeCd: 0,
  };
}

/** Count how many times an item appears (for stackable passives). */
export function itemCount(p: Player, id: ItemId): number {
  return p.items.filter(i => i === id).length;
}

/** Damage reduction multiplier from Iron Lamellar stacks: 0→1, 1→0.8, 2→0.65, 3+→0.55 */
export function toughMul(p: Player): number {
  const stacks = itemCount(p, 'tough');
  if (stacks >= 3) return 0.55;
  if (stacks === 2) return 0.65;
  if (stacks === 1) return 0.8;
  return 1;
}

/** Heal amount per kill from Vampire Fang stacks: 3 per stack */
export function vampireHeal(p: Player): number {
  return itemCount(p, 'vampire') * 3;
}
