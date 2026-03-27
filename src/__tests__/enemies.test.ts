import { describe, it, expect } from 'vitest';
import { mkEnemy, makeBoss, spawnEnemy } from '../enemies';

describe('mkEnemy', () => {
  it('creates a basic enemy with floor-scaled stats', () => {
    const e = mkEnemy('basic', 100, 100, 1);
    expect(e.tier).toBe('basic');
    expect(e.hp).toBe(18 + 1 * 4); // 22
    expect(e.maxHp).toBe(e.hp);
    expect(e.spd).toBe(0.8);
    expect(e.color).toBe('#2a0000');
  });

  it('creates a charger with larger size', () => {
    const e = mkEnemy('charger', 100, 100, 3);
    expect(e.tier).toBe('charger');
    expect(e.w).toBe(26);
    expect(e.h).toBe(26);
    expect(e.hp).toBe(28 + 3 * 5); // 43
    expect(e.color).toBe('#8B0000');
  });

  it('creates a sniper that can shoot', () => {
    const e = mkEnemy('sniper', 100, 100, 4);
    expect(e.tier).toBe('sniper');
    expect(e.canShoot).toBe(true);
    expect(e.spd).toBe(0.3);
  });

  it('creates a splitter with large size', () => {
    const e = mkEnemy('splitter', 100, 100, 5);
    expect(e.tier).toBe('splitter');
    expect(e.w).toBe(30);
    expect(e.h).toBe(30);
    expect(e.hp).toBe(38 + 5 * 6); // 68
  });

  it('creates an elite that can block and shoot', () => {
    const e = mkEnemy('elite', 100, 100, 7);
    expect(e.tier).toBe('elite');
    expect(e.canBlock).toBe(true);
    expect(e.canShoot).toBe(true);
    expect(e.guardHP).toBe(3);
  });

  it('creates a minion with fixed stats', () => {
    const e = mkEnemy('minion', 100, 100, 10);
    expect(e.tier).toBe('minion');
    expect(e.hp).toBe(10);
    expect(e.w).toBe(18);
  });

  it('scales basic enemy HP with floor', () => {
    const e1 = mkEnemy('basic', 0, 0, 1);
    const e5 = mkEnemy('basic', 0, 0, 5);
    expect(e5.hp).toBeGreaterThan(e1.hp);
    expect(e5.hp - e1.hp).toBe(4 * 4); // 4 hp per floor
  });

  it('initializes AI state to patrol', () => {
    const e = mkEnemy('basic', 0, 0, 1);
    expect(e.aiState).toBe('patrol');
    expect(e.atkState).toBe('idle');
  });
});

describe('makeBoss', () => {
  it('creates a boss with large size', () => {
    const b = makeBoss(5, 100, 100);
    expect(b.tier).toBe('boss');
    expect(b.w).toBe(52);
    expect(b.h).toBe(52);
  });

  it('scales boss HP with floor', () => {
    const b1 = makeBoss(1, 0, 0);
    const b5 = makeBoss(5, 0, 0);
    expect(b1.hp).toBe(100 + 1 * 22); // 122
    expect(b5.hp).toBe(100 + 5 * 22); // 210
    expect(b5.hp).toBeGreaterThan(b1.hp);
  });

  it('boss can shoot and block', () => {
    const b = makeBoss(3, 0, 0);
    expect(b.canShoot).toBe(true);
    expect(b.canBlock).toBe(true);
    expect(b.guardHP).toBe(5);
  });

  it('boss starts in chase state', () => {
    const b = makeBoss(1, 0, 0);
    expect(b.aiState).toBe('chase');
  });
});

describe('spawnEnemy', () => {
  it('returns a valid enemy', () => {
    const e = spawnEnemy(100, 100, 1);
    expect(e.x).toBe(100);
    expect(e.y).toBe(100);
    expect(e.hp).toBeGreaterThan(0);
    expect(['basic', 'charger', 'sniper', 'splitter', 'elite']).toContain(e.tier);
  });

  it('only produces basic enemies on floor 1', () => {
    // spawnEnemy on floor 1: charger requires floor>=2, sniper>=3, etc.
    // With any random roll, floor 1 should always give basic
    for (let i = 0; i < 20; i++) {
      const e = spawnEnemy(0, 0, 1);
      expect(e.tier).toBe('basic');
    }
  });
});
