import type { TileMap } from './types';
import { store } from './state';
import { MAP_W, T } from './constants';

export function updateFog(): void {
  const G = store.G!;
  const p = G.player, map = G.map, fog = G.fog;
  const R = 8;
  const px = Math.floor((p.x + p.w / 2) / T);
  const py = Math.floor((p.y + p.h / 2) / T);
  for (let y = 0; y < fog.length; y++)
    for (let x = 0; x < fog[0].length; x++)
      if (fog[y][x] === 2) fog[y][x] = 1;
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      if (dx * dx + dy * dy > R * R) continue;
      const tx = px + dx, ty = py + dy;
      if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= fog.length) continue;
      if (hasLOS(px, py, tx, ty, map)) {
        fog[ty][tx] = 2;
      }
    }
  }
}

export function hasLOS(x0: number, y0: number, x1: number, y1: number, map: TileMap): boolean {
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy, x = x0, y = y0;
  while (true) {
    if (x === x1 && y === y1) return true;
    if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
    if (map[y][x] === 0) return false;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
  }
}
