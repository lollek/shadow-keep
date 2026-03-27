import { describe, it, expect } from 'vitest';
import { hasLOS } from '../fog';
import type { TileMap } from '../types';

function makeFloorMap(w: number, h: number): TileMap {
  return Array.from({ length: h }, () => {
    const row = new Uint8Array(w);
    row.fill(1);
    return row;
  });
}

describe('hasLOS', () => {
  it('returns true for same point', () => {
    const map = makeFloorMap(10, 10);
    expect(hasLOS(5, 5, 5, 5, map)).toBe(true);
  });

  it('returns true for clear horizontal line', () => {
    const map = makeFloorMap(10, 10);
    expect(hasLOS(1, 5, 8, 5, map)).toBe(true);
  });

  it('returns true for clear vertical line', () => {
    const map = makeFloorMap(10, 10);
    expect(hasLOS(5, 1, 5, 8, map)).toBe(true);
  });

  it('returns true for clear diagonal line', () => {
    const map = makeFloorMap(10, 10);
    expect(hasLOS(1, 1, 8, 8, map)).toBe(true);
  });

  it('returns false when wall blocks the path', () => {
    const map = makeFloorMap(10, 10);
    map[5][4] = 0; // wall in the middle
    map[5][5] = 0;
    map[5][6] = 0;
    expect(hasLOS(5, 1, 5, 9, map)).toBe(false);
  });

  it('returns false when going out of bounds', () => {
    const map = makeFloorMap(5, 5);
    expect(hasLOS(2, 2, 10, 2, map)).toBe(false);
  });

  it('returns true for adjacent tiles', () => {
    const map = makeFloorMap(10, 10);
    expect(hasLOS(3, 3, 4, 3, map)).toBe(true);
  });

  it('returns false when first intermediate tile is wall', () => {
    const map = makeFloorMap(10, 10);
    map[5][3] = 0; // wall right after start
    expect(hasLOS(2, 5, 8, 5, map)).toBe(false);
  });
});
