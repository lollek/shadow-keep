import type { Room, TileMap } from './types';
import { MAP_W, MAP_H, TILE_FLOOR, TILE_EXIT, TILE_CHEST, TILE_WATER, TILE_SPIKES, TILE_BREAKABLE } from './constants';

export interface MapGenResult {
  map: TileMap;
  rooms: Room[];
  startRoom: Room;
  exitRoom: Room;
}

export function generateMap(floor: number): MapGenResult {
  const map: TileMap = Array.from({ length: MAP_H }, () => new Uint8Array(MAP_W));
  const MIN_ROOM = 4, MAX_ROOM = 9;
  const rooms: Room[] = [];

  function bsp(x: number, y: number, w: number, h: number, depth: number): { cx: number; cy: number } {
    if (depth > 5 || w < MIN_ROOM * 2 + 3 || h < MIN_ROOM * 2 + 3) {
      const rw = MIN_ROOM + Math.floor(Math.random() * (Math.min(w - 4, MAX_ROOM) - MIN_ROOM + 1));
      const rh = MIN_ROOM + Math.floor(Math.random() * (Math.min(h - 4, MAX_ROOM) - MIN_ROOM + 1));
      const rx = x + 1 + Math.floor(Math.random() * (w - rw - 2));
      const ry = y + 1 + Math.floor(Math.random() * (h - rh - 2));
      rooms.push({ x: rx, y: ry, w: rw, h: rh, cx: Math.floor(rx + rw / 2), cy: Math.floor(ry + rh / 2) });
      for (let ty = ry; ty < ry + rh; ty++)
        for (let tx = rx; tx < rx + rw; tx++)
          map[ty][tx] = 1;
      return { cx: Math.floor(rx + rw / 2), cy: Math.floor(ry + rh / 2) };
    }
    const horiz = w > h ? (Math.random() < 0.6) : (Math.random() < 0.4);
    let ca: { cx: number; cy: number }, cb: { cx: number; cy: number };
    if (horiz) {
      const split = Math.floor(w * 0.35 + Math.random() * w * 0.3);
      ca = bsp(x, y, split, h, depth + 1);
      cb = bsp(x + split, y, w - split, h, depth + 1);
    } else {
      const split = Math.floor(h * 0.35 + Math.random() * h * 0.3);
      ca = bsp(x, y, w, split, depth + 1);
      cb = bsp(x, y + split, w, h - split, depth + 1);
    }
    carve(ca.cx, ca.cy, cb.cx, cb.cy, map);
    return { cx: Math.floor((ca.cx + cb.cx) / 2), cy: Math.floor((ca.cy + cb.cy) / 2) };
  }

  bsp(0, 0, MAP_W, MAP_H, 0);

  const extraCorridors = 2 + Math.floor(floor / 2);
  for (let i = 0; i < extraCorridors; i++) {
    const ra = rooms[Math.floor(Math.random() * rooms.length)];
    const rb = rooms[Math.floor(Math.random() * rooms.length)];
    carve(ra.cx, ra.cy, rb.cx, rb.cy, map);
  }

  const startRoom = rooms[0];
  const exitRoom = farthestRoom(rooms, startRoom, map);

  map[exitRoom.cy][exitRoom.cx] = TILE_EXIT;

  // Place loot chests in some non-start, non-exit rooms
  for (const r of rooms) {
    if (r === startRoom || r === exitRoom) continue;
    if (Math.random() < 0.4) {
      const cx = r.x + 1 + Math.floor(Math.random() * (r.w - 2));
      const cy = r.y + 1 + Math.floor(Math.random() * (r.h - 2));
      if (map[cy][cx] === TILE_FLOOR) map[cy][cx] = TILE_CHEST;
    }
  }

  // Place environmental tiles based on floor depth
  placeEnvironment(map, rooms, startRoom, exitRoom, floor);

  return { map, rooms, startRoom, exitRoom };
}

export function carve(x1: number, y1: number, x2: number, y2: number, map: TileMap): void {
  const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
  function stamp(x: number, y: number) {
    for (let oy = -1; oy <= 1; oy++)
      for (let ox = -1; ox <= 1; ox++) {
        const tx = x + ox, ty = y + oy;
        if (tx >= 0 && tx < MAP_W && ty >= 0 && ty < MAP_H) map[ty][tx] = TILE_FLOOR;
      }
  }
  let x = x1, y = y1;
  while (x !== x2) { stamp(x, y); x += sx; }
  while (y !== y2) { stamp(x, y); y += sy; }
  stamp(x, y);
}

export function farthestRoom(rooms: Room[], startRoom: Room, map: TileMap): Room {
  const mapH = map.length, mapW = map[0].length;
  const dist = Array.from({ length: mapH }, () => new Int32Array(mapW).fill(-1));
  const queue: [number, number, number][] = [[startRoom.cx, startRoom.cy, 0]];
  dist[startRoom.cy][startRoom.cx] = 0;
  while (queue.length) {
    const [x, y, d] = queue.shift()!;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= mapW || ny < 0 || ny >= mapH) continue;
      if (map[ny][nx] === 0 || dist[ny][nx] >= 0) continue;
      dist[ny][nx] = d + 1;
      queue.push([nx, ny, d + 1]);
    }
  }
  let best: Room | null = null, bestD = -1;
  for (const r of rooms) {
    const d = dist[r.cy]?.[r.cx] ?? -1;
    if (d > bestD) { bestD = d; best = r; }
  }
  return best || rooms[rooms.length - 1];
}

function placeEnvironment(map: TileMap, rooms: Room[], startRoom: Room, exitRoom: Room, floor: number): void {
  // Water pools — shallow pools in some rooms (more common in caves)
  const waterChance = floor >= 5 ? 0.35 : 0.15;
  for (const r of rooms) {
    if (r === startRoom) continue;
    if (Math.random() > waterChance) continue;
    // Place a small water patch (2x2 to 3x3) inside the room
    const wx = r.x + 1 + Math.floor(Math.random() * Math.max(1, r.w - 4));
    const wy = r.y + 1 + Math.floor(Math.random() * Math.max(1, r.h - 4));
    const ww = 2 + Math.floor(Math.random() * 2);
    const wh = 2 + Math.floor(Math.random() * 2);
    for (let ty = wy; ty < wy + wh && ty < r.y + r.h - 1; ty++)
      for (let tx = wx; tx < wx + ww && tx < r.x + r.w - 1; tx++)
        if (map[ty][tx] === TILE_FLOOR) map[ty][tx] = TILE_WATER;
  }

  // Spike traps — appear from floor 3+
  if (floor >= 3) {
    const spikeChance = floor >= 10 ? 0.3 : 0.18;
    for (const r of rooms) {
      if (r === startRoom || r === exitRoom) continue;
      if (Math.random() > spikeChance) continue;
      // Place 1-3 spike tiles scattered in the room
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const sx = r.x + 1 + Math.floor(Math.random() * (r.w - 2));
        const sy = r.y + 1 + Math.floor(Math.random() * (r.h - 2));
        if (map[sy][sx] === TILE_FLOOR) map[sy][sx] = TILE_SPIKES;
      }
    }
  }

  // Breakable walls — occasional wall tiles adjacent to rooms that can be broken
  if (floor >= 2) {
    for (const r of rooms) {
      if (r === startRoom) continue;
      if (Math.random() > 0.25) continue;
      // Pick a random wall edge of the room and place a breakable wall
      const side = Math.floor(Math.random() * 4);
      let bx: number, by: number;
      if (side === 0) { bx = r.x - 1; by = r.y + 1 + Math.floor(Math.random() * (r.h - 2)); }       // left
      else if (side === 1) { bx = r.x + r.w; by = r.y + 1 + Math.floor(Math.random() * (r.h - 2)); } // right
      else if (side === 2) { bx = r.x + 1 + Math.floor(Math.random() * (r.w - 2)); by = r.y - 1; }   // top
      else { bx = r.x + 1 + Math.floor(Math.random() * (r.w - 2)); by = r.y + r.h; }                  // bottom
      if (bx > 0 && bx < MAP_W - 1 && by > 0 && by < MAP_H - 1 && map[by][bx] === 0) {
        map[by][bx] = TILE_BREAKABLE;
      }
    }
  }
}
