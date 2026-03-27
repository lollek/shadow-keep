import { describe, it, expect } from 'vitest';
import { ov, tileCollide, separateEntities, moveEntity } from '../collision';
import type { Rect, TileMap } from '../types';

describe('ov (overlap)', () => {
  it('returns true for overlapping rects', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 };
    const b: Rect = { x: 5, y: 5, w: 10, h: 10 };
    expect(ov(a, b)).toBe(true);
  });

  it('returns false for non-overlapping rects', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 };
    const b: Rect = { x: 20, y: 20, w: 10, h: 10 };
    expect(ov(a, b)).toBe(false);
  });

  it('returns false for edge-touching rects', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 };
    const b: Rect = { x: 10, y: 0, w: 10, h: 10 };
    expect(ov(a, b)).toBe(false);
  });

  it('returns true when one rect contains the other', () => {
    const a: Rect = { x: 0, y: 0, w: 20, h: 20 };
    const b: Rect = { x: 5, y: 5, w: 5, h: 5 };
    expect(ov(a, b)).toBe(true);
  });
});

function makeFloorMap(w: number, h: number): TileMap {
  return Array.from({ length: h }, () => {
    const row = new Uint8Array(w);
    row.fill(1);
    return row;
  });
}

describe('tileCollide', () => {
  it('returns false on floor tiles', () => {
    const map = makeFloorMap(10, 10);
    expect(tileCollide({ x: 24, y: 24, w: 20, h: 20 }, map)).toBe(false);
  });

  it('returns true on wall tiles', () => {
    const map = makeFloorMap(10, 10);
    map[3][3] = 0; // set a wall
    // entity at tile (3,3) → pixel (72, 72)
    expect(tileCollide({ x: 72, y: 72, w: 20, h: 20 }, map)).toBe(true);
  });

  it('returns true for out-of-bounds positions', () => {
    const map = makeFloorMap(10, 10);
    expect(tileCollide({ x: -5, y: 24, w: 20, h: 20 }, map)).toBe(true);
  });

  it('returns true when partially overlapping a wall', () => {
    const map = makeFloorMap(10, 10);
    map[2][2] = 0;
    // Entity overlaps tile (2,2) (pixels 48-71) — entity at x=50, w=20 covers tiles 2..2
    expect(tileCollide({ x: 50, y: 48, w: 20, h: 20 }, map)).toBe(true);
  });
});

describe('separateEntities', () => {
  it('pushes overlapping entities apart', () => {
    const a: Rect = { x: 0, y: 0, w: 20, h: 20 };
    const b: Rect = { x: 5, y: 0, w: 20, h: 20 };
    separateEntities(a, b);
    // After separation, centers should be farther apart
    const distBefore = 5;
    const distAfter = Math.abs((a.x + 10) - (b.x + 10));
    expect(distAfter).toBeGreaterThan(distBefore);
  });

  it('does nothing for non-overlapping entities', () => {
    const a: Rect = { x: 0, y: 0, w: 10, h: 10 };
    const b: Rect = { x: 50, y: 50, w: 10, h: 10 };
    const ax = a.x, bx = b.x;
    separateEntities(a, b);
    expect(a.x).toBe(ax);
    expect(b.x).toBe(bx);
  });
});

describe('moveEntity', () => {
  it('moves entity on floor tiles', () => {
    const map = makeFloorMap(10, 10);
    const e = { x: 48, y: 48, w: 20, h: 20 };
    moveEntity(e, 5, 0, map);
    expect(e.x).toBe(53);
  });

  it('blocks entity movement into walls', () => {
    const map = makeFloorMap(10, 10);
    map[2][3] = 0; // wall at tile (3,2)
    const e = { x: 46, y: 48, w: 20, h: 20, vx: 5, vy: 0 };
    // Moving right should be blocked by wall at tile 3 (pixel 72)
    moveEntity(e, 24, 0, map);
    expect(e.x).toBe(46); // didn't move
    expect(e.vx).toBe(0); // velocity zeroed
  });

  it('zeroes vx/vy on collision when present', () => {
    const map = makeFloorMap(10, 10);
    map[2][4] = 0; // wall
    const e = { x: 48, y: 48, w: 20, h: 20, vx: 10, vy: 10 };
    moveEntity(e, 50, 0, map); // try to move into wall
    expect(e.vx).toBe(0);
  });
});
