import type { Rect, TileMap } from './types';

export function ov(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function moveEntity(
  e: Rect & { vx?: number; vy?: number },
  dx: number,
  dy: number,
  map: TileMap,
): void {
  if (!tileCollide({ x: e.x + dx, y: e.y, w: e.w, h: e.h }, map)) {
    e.x += dx;
  } else {
    if (e.vx !== undefined) e.vx = 0;
  }
  if (!tileCollide({ x: e.x, y: e.y + dy, w: e.w, h: e.h }, map)) {
    e.y += dy;
  } else {
    if (e.vy !== undefined) e.vy = 0;
  }
}

export function separateEntities(a: Rect, b: Rect): void {
  const acx = a.x + a.w / 2, acy = a.y + a.h / 2;
  const bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
  const dx = acx - bcx, dy = acy - bcy;
  const dist = Math.hypot(dx, dy) || 1;
  const minDist = (a.w + b.w) / 2;
  if (dist >= minDist) return;
  const push = (minDist - dist) / 2;
  const nx = dx / dist, ny = dy / dist;
  a.x += nx * push; a.y += ny * push;
  b.x -= nx * push; b.y -= ny * push;
}

export function tileCollide(rect: Rect, map: TileMap): boolean {
  const x0 = Math.floor(rect.x / 24);
  const y0 = Math.floor(rect.y / 24);
  const x1 = Math.floor((rect.x + rect.w - 1) / 24);
  const y1 = Math.floor((rect.y + rect.h - 1) / 24);
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      if (ty < 0 || ty >= map.length || tx < 0 || tx >= map[0].length) return true;
      if (map[ty][tx] === 0) return true;
    }
  }
  return false;
}
