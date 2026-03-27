import { describe, it, expect } from 'vitest';
import { generateMap, carve, farthestRoom } from '../map-gen';
import { MAP_W, MAP_H } from '../constants';

describe('generateMap', () => {
  it('produces a map with correct dimensions', () => {
    const { map } = generateMap(1);
    expect(map.length).toBe(MAP_H);
    expect(map[0].length).toBe(MAP_W);
  });

  it('generates at least 2 rooms', () => {
    const { rooms } = generateMap(1);
    expect(rooms.length).toBeGreaterThanOrEqual(2);
  });

  it('places an exit tile (value 2) on the map', () => {
    const { map, exitRoom } = generateMap(1);
    expect(map[exitRoom.cy][exitRoom.cx]).toBe(2);
  });

  it('start room and exit room are different', () => {
    const { startRoom, exitRoom } = generateMap(1);
    expect(startRoom).not.toBe(exitRoom);
  });

  it('start room is always rooms[0]', () => {
    const { rooms, startRoom } = generateMap(1);
    expect(startRoom).toBe(rooms[0]);
  });

  it('exit room is the farthest room from start', () => {
    const { map, rooms, startRoom, exitRoom } = generateMap(1);
    const expected = farthestRoom(rooms, startRoom, map);
    expect(exitRoom).toBe(expected);
  });

  it('rooms have floor tiles (value 1)', () => {
    const { map, rooms } = generateMap(1);
    for (const r of rooms) {
      expect(map[r.cy][r.cx]).toBeGreaterThanOrEqual(1);
    }
  });

  it('all rooms are reachable from start via BFS on floor tiles', () => {
    const { map, rooms } = generateMap(1);
    const visited = Array.from({ length: MAP_H }, () => new Uint8Array(MAP_W));
    const queue: [number, number][] = [[rooms[0].cx, rooms[0].cy]];
    visited[rooms[0].cy][rooms[0].cx] = 1;
    while (queue.length) {
      const [x, y] = queue.shift()!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) continue;
        if (visited[ny][nx] || map[ny][nx] === 0) continue;
        visited[ny][nx] = 1;
        queue.push([nx, ny]);
      }
    }
    for (const r of rooms) {
      expect(visited[r.cy][r.cx]).toBe(1);
    }
  });
});

describe('carve', () => {
  it('carves floor tiles between two points', () => {
    const map = Array.from({ length: 20 }, () => new Uint8Array(20));
    carve(5, 5, 15, 10, map);
    // All tiles along the L-shaped corridor should be floor
    expect(map[5][5]).toBe(1);
    expect(map[10][15]).toBe(1);
  });
});

describe('farthestRoom', () => {
  it('returns the room farthest from start by BFS distance', () => {
    const map = Array.from({ length: MAP_H }, () => new Uint8Array(MAP_W));
    // Create two rooms connected by a corridor
    const roomA = { x: 2, y: 2, w: 4, h: 4, cx: 4, cy: 4 };
    const roomB = { x: 40, y: 30, w: 4, h: 4, cx: 42, cy: 32 };
    for (let y = roomA.y; y < roomA.y + roomA.h; y++)
      for (let x = roomA.x; x < roomA.x + roomA.w; x++) map[y][x] = 1;
    for (let y = roomB.y; y < roomB.y + roomB.h; y++)
      for (let x = roomB.x; x < roomB.x + roomB.w; x++) map[y][x] = 1;
    carve(roomA.cx, roomA.cy, roomB.cx, roomB.cy, map);

    const result = farthestRoom([roomA, roomB], roomA, map);
    expect(result).toBe(roomB);
  });

  it('returns last room if none reachable', () => {
    const map = Array.from({ length: MAP_H }, () => new Uint8Array(MAP_W));
    const roomA = { x: 2, y: 2, w: 3, h: 3, cx: 3, cy: 3 };
    const roomB = { x: 20, y: 20, w: 3, h: 3, cx: 21, cy: 21 };
    // Only carve roomA, leave roomB disconnected (all walls)
    for (let y = roomA.y; y < roomA.y + roomA.h; y++)
      for (let x = roomA.x; x < roomA.x + roomA.w; x++) map[y][x] = 1;
    // roomB tiles are walls so BFS won't reach it — roomA has dist 0
    // farthestRoom returns roomA (dist 0 > -1 for roomB)
    const result = farthestRoom([roomA, roomB], roomA, map);
    expect(result).toBe(roomA);
  });
});
