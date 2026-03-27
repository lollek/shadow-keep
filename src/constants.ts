import type { ActiveItemId, Building, FloorTheme, Player, ShopItem, WeaponDef, WeaponId } from './types';

export const T = 24;
export const UI_HEIGHT = 62;
export const MAP_W = 56;
export const MAP_H = 42;

// Tile values
export const TILE_WALL = 0;
export const TILE_FLOOR = 1;
export const TILE_EXIT = 2;
export const TILE_CHEST = 3;
export const TILE_WATER = 4;
export const TILE_SPIKES = 5;
export const TILE_BREAKABLE = 6;

// Legacy fallback colors (used by default theme)
export const FLOOR_COLS = ['#1c1410', '#1e1612', '#1a1210', '#201814', '#1b1311'];
export const WALL_COLS = ['#0e0a08', '#100c0a', '#0c0808', '#120e0c', '#0f0b09'];

// Floor themes by floor band
export const THEMES: FloorTheme[] = [
  { // Floors 1-4: Dungeon
    name: 'Dungeon',
    floorCols: ['#1c1410', '#1e1612', '#1a1210', '#201814', '#1b1311'],
    wallCols: ['#0e0a08', '#100c0a', '#0c0808', '#120e0c', '#0f0b09'],
    waterCol: '#0a2040', spikeCol: '#6a2020', ambientTint: 'rgba(0,0,0,0)',
  },
  { // Floors 5-9: Caverns
    name: 'Caverns',
    floorCols: ['#141a1c', '#161c1e', '#12181a', '#182020', '#13191b'],
    wallCols: ['#080e10', '#0a100c', '#080c0e', '#0c1210', '#090f0b'],
    waterCol: '#0a3050', spikeCol: '#503a20', ambientTint: 'rgba(30,60,80,0.06)',
  },
  { // Floors 10-14: Shrine
    name: 'Shrine',
    floorCols: ['#1a1018', '#1c1220', '#18101a', '#201422', '#1b111d'],
    wallCols: ['#0a0610', '#0c080e', '#0a060c', '#0e0a12', '#0b0711'],
    waterCol: '#201040', spikeCol: '#5a1a4a', ambientTint: 'rgba(60,20,80,0.06)',
  },
  { // Floors 15+: Shadow Keep
    name: 'Shadow Keep',
    floorCols: ['#0e0a0a', '#100c0c', '#0c0808', '#120e0e', '#0f0b0b'],
    wallCols: ['#060404', '#080606', '#040202', '#0a0808', '#070505'],
    waterCol: '#100820', spikeCol: '#802020', ambientTint: 'rgba(100,0,0,0.08)',
  },
];

export function getTheme(floor: number): FloorTheme {
  if (floor >= 15) return THEMES[3];
  if (floor >= 10) return THEMES[2];
  if (floor >= 5) return THEMES[1];
  return THEMES[0];
}

export const SS: ShopItem[] = [
  { n: 'Smoke Bomb', i: '💨', d: 'Active: break enemy LOS', c: 45, r: 'rare', a: (p: Player) => { p.activeItem = 'smoke'; p.activeCd = 0; } },
  { n: 'Dash Strike', i: '⚡', d: 'Active: lunge for 2× dmg', c: 45, r: 'rare', a: (p: Player) => { p.activeItem = 'dash'; p.activeCd = 0; } },
  { n: 'Caltrops', i: '🔩', d: 'Active: drop spike trap', c: 45, r: 'rare', a: (p: Player) => { p.activeItem = 'caltrops'; p.activeCd = 0; } },
  { n: 'Vampire Fang', i: '🩸', d: 'Heal +3/kill (stacks)', c: 60, r: 'rare', a: (p: Player) => { p.items.push('vampire'); } },
  { n: 'Iron Lamellar', i: '🛡', d: '-20% dmg taken (stacks)', c: 80, r: 'epic', a: (p: Player) => { p.items.push('tough'); } },
];

// Active item cooldowns (in frames, 60fps ≈ 16ms/frame)
export const ACTIVE_ITEMS: Record<ActiveItemId, { name: string; icon: string; cd: number; desc: string }> = {
  smoke: { name: 'Smoke Bomb', icon: '💨', cd: 480, desc: 'Break enemy LOS in radius' },
  dash: { name: 'Dash Strike', icon: '⚡', cd: 240, desc: 'Lunge forward for 2x damage' },
  caltrops: { name: 'Caltrops', icon: '🔩', cd: 320, desc: 'Drop spikes that slow & damage' },
};

export const WEAPONS: Record<WeaponId, WeaponDef> = {
  katana: {
    name: 'Katana',
    icon: '🗡️',
    desc: 'Balanced cut with medium reach and a frontal arc.',
    canBlock: true,
    meleeCd: 28,
    meleeRange: 3,
    meleeArc: 1.2,
    damageMul: 1,
    backstabMul: 2.5,
    knockback: 4,
    killResetOnMeleeKill: false,
  },
  dual_tanto: {
    name: 'Dual Tanto',
    icon: '🗡️🗡️',
    desc: 'Fast chain strikes. Shorter reach, stronger backstabs, no guard, melee kills reset your next attack.',
    canBlock: false,
    meleeCd: 18,
    meleeRange: 2.25,
    meleeArc: 1.05,
    damageMul: 0.82,
    backstabMul: 3.1,
    knockback: 2.2,
    killResetOnMeleeKill: true,
  },
  naginata: {
    name: 'Naginata',
    icon: '🔱',
    desc: 'Long thrusting reach with a narrow attack lane and strong knockback.',
    canBlock: true,
    meleeCd: 38,
    meleeRange: 4.6,
    meleeArc: 0.42,
    damageMul: 1.08,
    backstabMul: 2.2,
    knockback: 5.8,
    killResetOnMeleeKill: false,
  },
  nodachi: {
    name: 'Nodachi',
    icon: '⚔️',
    desc: 'Slow, sweeping cuts with a huge arc, long reach, and heavy damage.',
    canBlock: true,
    meleeCd: 46,
    meleeRange: 3.6,
    meleeArc: 1.62,
    damageMul: 1.75,
    backstabMul: 2.7,
    knockback: 6.5,
    killResetOnMeleeKill: false,
  },
};

export const BLDGS: Building[] = [
  { id: 'weapon', label: 'Swordsmith', color: '#2a1008', roof: '#6a2a10', icon: '⚔', x: 0.12, desc: 'Blades & speed' },
  { id: 'apoth', label: 'Herbalist', color: '#0a1a0a', roof: '#1a5a1a', icon: '🌿', x: 0.32, desc: 'Healing & HP' },
  { id: 'fletcher', label: 'Toolmaker', color: '#0a1020', roof: '#1a3060', icon: '✦', x: 0.52, desc: 'Shuriken & tricks' },
  { id: 'shrine', label: 'Shrine', color: '#1a0a20', roof: '#4a1a6a', icon: '⛩', x: 0.72, desc: 'Actives & upgrades' },
  { id: 'dungeon', label: 'Castle Gate', color: '#1a0808', roof: '#550000', icon: '⛩', x: 0.5, desc: 'Choose a weapon & enter', yMul: 0.78 },
];

export const SW: ShopItem[] = [
  { n: 'Sharpening Stone', i: '🪨', d: '+8 ATK', c: 18, r: 'common', a: (p: Player) => { p.atk += 8; } },
  { n: 'Wakizashi', i: '⚔️', d: '+15 ATK', c: 30, r: 'common', a: (p: Player) => { p.atk += 15; } },
  { n: 'Katana', i: '🗡️', d: '+25 ATK', c: 55, r: 'rare', a: (p: Player) => { p.atk += 25; } },
  { n: 'Legendary Blade', i: '🔥', d: '+45 ATK', c: 100, r: 'epic', a: (p: Player) => { p.atk += 45; } },
  { n: 'Wind Sandals', i: '💨', d: '+0.8 speed', c: 40, r: 'rare', a: (p: Player) => { p.spd += 0.8; } },
  { n: 'Tabi Boots', i: '👟', d: '+1.5 speed', c: 70, r: 'epic', a: (p: Player) => { p.spd += 1.5; } },
];

export const SA: ShopItem[] = [
  { n: 'Bandage', i: '🩹', d: 'Heal +20 HP', c: 15, r: 'common', a: (p: Player) => { p.hp = Math.min(p.hp + 20, p.maxHp); } },
  { n: 'Healing Herb', i: '🌿', d: 'Full heal', c: 35, r: 'common', a: (p: Player) => { p.hp = p.maxHp; } },
  { n: 'Spirit Jade', i: '💎', d: '+40 max HP', c: 50, r: 'rare', a: (p: Player) => { p.maxHp += 40; p.hp = Math.min(p.hp + 40, p.maxHp); } },
  { n: "Oni's Heart", i: '❤️', d: '+80 max HP + heal', c: 110, r: 'epic', a: (p: Player) => { p.maxHp += 80; p.hp = p.maxHp; } },
  { n: 'Vampire Fang', i: '🩸', d: 'Heal +3/kill (stacks)', c: 60, r: 'rare', a: (p: Player) => { p.items.push('vampire'); } },
  { n: 'Iron Lamellar', i: '🛡', d: '-20% dmg taken (stacks)', c: 80, r: 'epic', a: (p: Player) => { p.items.push('tough'); } },
];

export const SF: ShopItem[] = [
  { n: 'Shuriken Pouch', i: '✦', d: '+20 shuriken', c: 14, r: 'common', a: (p: Player) => { p.arrows += 20; } },
  { n: 'Bandolier', i: '🧷', d: '+50 shuriken', c: 30, r: 'rare', a: (p: Player) => { p.arrows += 50; } },
  { n: 'Blast Seals', i: '💥', d: 'Thrown stars explode', c: 65, r: 'rare', a: (p: Player) => { p.items.push('explosive'); } },
  { n: 'Balanced Stars', i: '⚡', d: '+20 ATK + fast throws', c: 90, r: 'epic', a: (p: Player) => { p.atk += 20; p.items.push('fastarrows'); } },
  { n: 'Shinobi Satchel', i: '🎒', d: '+80 shuriken', c: 70, r: 'epic', a: (p: Player) => { p.arrows += 80; } },
];
