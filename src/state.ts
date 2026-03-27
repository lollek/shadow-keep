import type { DungeonState, GameState, SaveData, TownState } from './types';

export const S: GameState = { mode: 'title', player: null, depth: 0, gold: 0 };
export const sv: SaveData = { gold: 0, deepest: 0 };

export const store = {
  G: null as DungeonState | null,
  TW: null as TownState | null,
  running: false,
  shakeT: 0,
  shakeX: 0,
  shakeY: 0,
  isSneaking: false,
  msgT: 0,
};

export function shake(a: number): void {
  store.shakeT = 8;
  store.shakeX = (Math.random() - 0.5) * a;
  store.shakeY = (Math.random() - 0.5) * a;
}
