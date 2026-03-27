import type { Building, Player, ShopItem } from './types';

export const T = 24;
export const MAP_W = 56;
export const MAP_H = 42;

export const FLOOR_COLS = ['#1c1410', '#1e1612', '#1a1210', '#201814', '#1b1311'];
export const WALL_COLS = ['#0e0a08', '#100c0a', '#0c0808', '#120e0c', '#0f0b09'];

export const BLDGS: Building[] = [
  { id: 'weapon', label: 'Swordsmith', color: '#2a1008', roof: '#6a2a10', icon: '⚔', x: 0.15, desc: 'Blades & speed' },
  { id: 'apoth', label: 'Herbalist', color: '#0a1a0a', roof: '#1a5a1a', icon: '🌿', x: 0.38, desc: 'Healing & HP' },
  { id: 'fletcher', label: 'Bowyer', color: '#0a1020', roof: '#1a3060', icon: '🏹', x: 0.62, desc: 'Arrows & bows' },
  { id: 'dungeon', label: 'Castle Gate', color: '#1a0808', roof: '#550000', icon: '⛩', x: 0.5, desc: 'Enter the keep', yMul: 0.78 },
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
  { n: 'Vampire Fang', i: '🩸', d: 'Heal 3/kill', c: 60, r: 'rare', a: (p: Player) => { p.items.push('vampire'); } },
  { n: 'Iron Lamellar', i: '🛡', d: 'Take 20% less dmg', c: 80, r: 'epic', a: (p: Player) => { p.items.push('tough'); } },
];

export const SF: ShopItem[] = [
  { n: 'Arrow Bundle', i: '🏹', d: '+20 arrows', c: 14, r: 'common', a: (p: Player) => { p.arrows += 20; } },
  { n: 'Full Quiver', i: '✨', d: '+50 arrows', c: 30, r: 'rare', a: (p: Player) => { p.arrows += 50; } },
  { n: 'Fire Arrows', i: '💥', d: 'Arrows explode', c: 65, r: 'rare', a: (p: Player) => { p.items.push('explosive'); } },
  { n: 'Yumi Bow', i: '⚡', d: '+20 ATK + fast arr', c: 90, r: 'epic', a: (p: Player) => { p.atk += 20; p.items.push('fastarrows'); } },
  { n: 'Endless Quiver', i: '🎒', d: '+80 arrows', c: 70, r: 'epic', a: (p: Player) => { p.arrows += 80; } },
];
