import type { Player } from './types';

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
  };
}
