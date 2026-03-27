import { describe, it, expect } from 'vitest';
import { makePlayer, itemCount, toughMul, vampireHeal } from '../player';

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
    expect(p.activeCd).toBe(0);
  });

  it('starts with no active item', () => {
    const p = makePlayer();
    expect(p.activeItem).toBeNull();
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

describe('itemCount', () => {
  it('returns 0 for empty items', () => {
    const p = makePlayer();
    expect(itemCount(p, 'vampire')).toBe(0);
  });

  it('counts single item', () => {
    const p = makePlayer();
    p.items.push('vampire');
    expect(itemCount(p, 'vampire')).toBe(1);
  });

  it('counts stacked items', () => {
    const p = makePlayer();
    p.items.push('vampire', 'vampire', 'tough');
    expect(itemCount(p, 'vampire')).toBe(2);
    expect(itemCount(p, 'tough')).toBe(1);
  });
});

describe('toughMul', () => {
  it('returns 1 with no Iron Lamellar', () => {
    expect(toughMul(makePlayer())).toBe(1);
  });

  it('returns 0.8 with 1 stack', () => {
    const p = makePlayer(); p.items.push('tough');
    expect(toughMul(p)).toBe(0.8);
  });

  it('returns 0.65 with 2 stacks', () => {
    const p = makePlayer(); p.items.push('tough', 'tough');
    expect(toughMul(p)).toBe(0.65);
  });

  it('returns 0.55 with 3+ stacks', () => {
    const p = makePlayer(); p.items.push('tough', 'tough', 'tough');
    expect(toughMul(p)).toBe(0.55);
  });
});

describe('vampireHeal', () => {
  it('returns 0 with no Vampire Fang', () => {
    expect(vampireHeal(makePlayer())).toBe(0);
  });

  it('returns 3 per stack', () => {
    const p = makePlayer(); p.items.push('vampire');
    expect(vampireHeal(p)).toBe(3);
    p.items.push('vampire');
    expect(vampireHeal(p)).toBe(6);
    p.items.push('vampire');
    expect(vampireHeal(p)).toBe(9);
  });
});
