import { describe, it, expect } from 'vitest';
import { generateMap } from '../map-gen';
import { tileCollide } from '../collision';
import { getTheme, MAP_W, MAP_H, TILE_CHEST, TILE_WATER, TILE_SPIKES, TILE_BREAKABLE, ACTIVE_ITEMS, BLDGS, SS, WEAPONS } from '../constants';
import { makePlayer } from '../player';
import type { TileMap } from '../types';

describe('getTheme', () => {
  it('returns Dungeon for floors 1-4', () => {
    expect(getTheme(1).name).toBe('Dungeon');
    expect(getTheme(4).name).toBe('Dungeon');
  });

  it('returns Caverns for floors 5-9', () => {
    expect(getTheme(5).name).toBe('Caverns');
    expect(getTheme(9).name).toBe('Caverns');
  });

  it('returns Shrine for floors 10-14', () => {
    expect(getTheme(10).name).toBe('Shrine');
    expect(getTheme(14).name).toBe('Shrine');
  });

  it('returns Shadow Keep for floors 15+', () => {
    expect(getTheme(15).name).toBe('Shadow Keep');
    expect(getTheme(99).name).toBe('Shadow Keep');
  });
});

describe('weapon definitions', () => {
  it('defines four selectable weapons', () => {
    expect(Object.keys(WEAPONS)).toHaveLength(4);
    expect(WEAPONS.katana.name).toBe('Katana');
    expect(WEAPONS.dual_tanto.killResetOnMeleeKill).toBe(true);
    expect(WEAPONS.dual_tanto.canBlock).toBe(false);
    expect(WEAPONS.naginata.meleeRange).toBeGreaterThan(WEAPONS.katana.meleeRange);
    expect(WEAPONS.nodachi.damageMul).toBeGreaterThan(WEAPONS.katana.damageMul);
    expect(WEAPONS.naginata.icon).toBe('🔱');
    expect(WEAPONS.nodachi.meleeArc).toBeGreaterThan(Math.PI / 2);
    expect(WEAPONS.naginata.meleeArc).toBeLessThan(WEAPONS.katana.meleeArc);
  });
});

function countTile(map: TileMap, tile: number): number {
  let n = 0;
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[0].length; x++)
      if (map[y][x] === tile) n++;
  return n;
}

describe('environment tile placement', () => {
  it('places chest tiles on floor 1', () => {
    // Run several times because chest placement is probabilistic
    let found = false;
    for (let i = 0; i < 10; i++) {
      const { map } = generateMap(1);
      if (countTile(map, TILE_CHEST) > 0) { found = true; break; }
    }
    expect(found).toBe(true);
  });

  it('places water tiles', () => {
    let found = false;
    for (let i = 0; i < 10; i++) {
      const { map } = generateMap(1);
      if (countTile(map, TILE_WATER) > 0) { found = true; break; }
    }
    expect(found).toBe(true);
  });

  it('does not place spikes before floor 3', () => {
    for (let i = 0; i < 5; i++) {
      const { map } = generateMap(1);
      expect(countTile(map, TILE_SPIKES)).toBe(0);
    }
  });

  it('places spikes on floor 3+', () => {
    let found = false;
    for (let i = 0; i < 10; i++) {
      const { map } = generateMap(5);
      if (countTile(map, TILE_SPIKES) > 0) { found = true; break; }
    }
    expect(found).toBe(true);
  });

  it('does not place breakable walls before floor 2', () => {
    for (let i = 0; i < 5; i++) {
      const { map } = generateMap(1);
      expect(countTile(map, TILE_BREAKABLE)).toBe(0);
    }
  });

  it('places breakable walls on floor 2+', () => {
    let found = false;
    for (let i = 0; i < 10; i++) {
      const { map } = generateMap(3);
      if (countTile(map, TILE_BREAKABLE) > 0) { found = true; break; }
    }
    expect(found).toBe(true);
  });
});

describe('tileCollide with breakable walls', () => {
  function makeFloorMap(w: number, h: number): TileMap {
    return Array.from({ length: h }, () => {
      const row = new Uint8Array(w);
      row.fill(1);
      return row;
    });
  }

  it('blocks movement on breakable walls', () => {
    const map = makeFloorMap(10, 10);
    map[3][3] = TILE_BREAKABLE;
    expect(tileCollide({ x: 72, y: 72, w: 20, h: 20 }, map)).toBe(true);
  });

  it('allows movement on water tiles', () => {
    const map = makeFloorMap(10, 10);
    map[3][3] = TILE_WATER;
    expect(tileCollide({ x: 72, y: 72, w: 20, h: 20 }, map)).toBe(false);
  });

  it('allows movement on spike tiles', () => {
    const map = makeFloorMap(10, 10);
    map[3][3] = TILE_SPIKES;
    expect(tileCollide({ x: 72, y: 72, w: 20, h: 20 }, map)).toBe(false);
  });

  it('allows movement on chest tiles', () => {
    const map = makeFloorMap(10, 10);
    map[3][3] = TILE_CHEST;
    expect(tileCollide({ x: 72, y: 72, w: 20, h: 20 }, map)).toBe(false);
  });
});

describe('ACTIVE_ITEMS', () => {
  it('defines all three active items', () => {
    expect(ACTIVE_ITEMS.smoke).toBeDefined();
    expect(ACTIVE_ITEMS.dash).toBeDefined();
    expect(ACTIVE_ITEMS.caltrops).toBeDefined();
  });

  it('each has name, icon, cd, and desc', () => {
    for (const key of ['smoke', 'dash', 'caltrops'] as const) {
      const item = ACTIVE_ITEMS[key];
      expect(item.name).toBeTruthy();
      expect(item.icon).toBeTruthy();
      expect(item.cd).toBeGreaterThan(0);
      expect(item.desc).toBeTruthy();
    }
  });

  it('smoke bomb has the longest cooldown', () => {
    expect(ACTIVE_ITEMS.smoke.cd).toBeGreaterThan(ACTIVE_ITEMS.dash.cd);
    expect(ACTIVE_ITEMS.smoke.cd).toBeGreaterThan(ACTIVE_ITEMS.caltrops.cd);
  });
});

describe('Shrine shop', () => {
  it('BLDGS includes shrine building', () => {
    const shrine = BLDGS.find(b => b.id === 'shrine');
    expect(shrine).toBeDefined();
    expect(shrine!.label).toBe('Shrine');
  });

  it('SS has 5 items with valid fields', () => {
    expect(SS).toHaveLength(5);
    for (const item of SS) {
      expect(item.n).toBeTruthy();
      expect(item.i).toBeTruthy();
      expect(item.c).toBeGreaterThan(0);
      expect(typeof item.a).toBe('function');
    }
  });

  it('active item purchases set activeItem on player', () => {
    const p = makePlayer();
    SS[0].a(p); // smoke
    expect(p.activeItem).toBe('smoke');
    SS[1].a(p); // dash
    expect(p.activeItem).toBe('dash');
    SS[2].a(p); // caltrops
    expect(p.activeItem).toBe('caltrops');
  });

  it('passive item purchases stack in items array', () => {
    const p = makePlayer();
    SS[3].a(p); // vampire
    SS[3].a(p); // vampire again
    expect(p.items.filter((i: string) => i === 'vampire')).toHaveLength(2);
    SS[4].a(p); // tough
    expect(p.items).toContain('tough');
  });
});
