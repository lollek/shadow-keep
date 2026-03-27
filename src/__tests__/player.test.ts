import { describe, it, expect } from 'vitest';
import { makePlayer } from '../player';

describe('makePlayer', () => {
  it('returns player with default stats', () => {
    const p = makePlayer();
    expect(p.hp).toBe(100);
    expect(p.maxHp).toBe(100);
    expect(p.spd).toBe(2.2);
    expect(p.atk).toBe(10);
    expect(p.arrows).toBe(10);
    expect(p.stamina).toBe(100);
    expect(p.maxStamina).toBe(100);
  });

  it('returns player with correct dimensions', () => {
    const p = makePlayer();
    expect(p.w).toBe(20);
    expect(p.h).toBe(20);
  });

  it('starts with empty items', () => {
    const p = makePlayer();
    expect(p.items).toEqual([]);
  });

  it('starts with all cooldowns at zero', () => {
    const p = makePlayer();
    expect(p.invincible).toBe(0);
    expect(p.meleeCd).toBe(0);
    expect(p.arrowCd).toBe(0);
    expect(p.dodgeT).toBe(0);
    expect(p.dodgeCd).toBe(0);
    expect(p.parryWindow).toBe(0);
  });

  it('creates independent instances', () => {
    const p1 = makePlayer();
    const p2 = makePlayer();
    p1.hp = 50;
    expect(p2.hp).toBe(100);
    p1.items.push('vampire');
    expect(p2.items).toEqual([]);
  });
});
