import type { Enemy, EnemyTier } from './types';

function enemyBase(type: EnemyTier, x: number, y: number): Enemy {
  const startAng = Math.random() * Math.PI * 2;
  return {
    x, y, w: 22, h: 22, vx: 0, vy: 0,
    hp: 0, maxHp: 0, spd: 0, atk: 0,
    tier: type, color: '',
    canShoot: false, shootT: 28 + Math.random() * 18, shootInt: 70,
    stateT: 0,
    patrolDx: Math.cos(startAng), patrolDy: Math.sin(startAng),
    patrolT: Math.floor(80 + Math.random() * 120),
    patrolTargetAngle: startAng,
    aiState: 'patrol', suspectT: 0,
    searchX: x, searchY: y, searchT: 0,
    facing: startAng,
    atkState: 'idle', atkT: 0, atkCd: 0, atkCdMax: 100,
    windup: 20, strikeDur: 8, strikeX: 0, strikeY: 0,
    canBlock: false, guardHP: 0, blocking: false,
    chargeVx: 0, chargeVy: 0, chargeT: 0,
    phase2: false, minionT: 0,
    _split: false, _noiseCue: false,
  };
}

export function spawnEnemy(x: number, y: number, floor: number): Enemy {
  const r = Math.random();
  let type: EnemyTier = 'basic';
  if (floor >= 2 && r < 0.18) type = 'charger';
  else if (floor >= 3 && r < 0.32) type = 'sniper';
  else if (floor >= 4 && r > 0.82) type = 'splitter';
  else if (floor >= 6 && r > 0.92) type = 'elite';
  return mkEnemy(type, x, y, floor);
}

export function mkEnemy(type: EnemyTier, x: number, y: number, floor: number): Enemy {
  const b = enemyBase(type, x, y);
  const f = floor;
  switch (type) {
    case 'charger':
      return { ...b, w: 26, h: 26, hp: 28 + f * 5, maxHp: 28 + f * 5, spd: 1.8, atk: 13, canShoot: false, color: '#8B0000', atkCdMax: 90, windup: 18, strikeDur: 8 };
    case 'sniper':
      return { ...b, w: 22, h: 22, hp: 14 + f * 3, maxHp: 14 + f * 3, spd: 0.3, atk: 22, canShoot: true, shootT: 18, shootInt: 60, color: '#1a3000', atkCdMax: 120, windup: 22, strikeDur: 6 };
    case 'splitter':
      return { ...b, w: 30, h: 30, hp: 38 + f * 6, maxHp: 38 + f * 6, spd: 0.6, atk: 9, canShoot: false, color: '#4a2800', atkCdMax: 100, windup: 20, strikeDur: 8 };
    case 'elite':
      return { ...b, w: 24, h: 24, hp: 48 + f * 10, maxHp: 48 + f * 10, spd: 1.4, atk: 17, canShoot: true, shootT: 20, shootInt: 55, color: '#1a001a', atkCdMax: 70, windup: 14, strikeDur: 6, canBlock: true, guardHP: 3 };
    case 'minion':
      return { ...b, w: 18, h: 18, hp: 10, maxHp: 10, spd: 1.5, atk: 6, canShoot: false, color: '#1a1a1a', atkCdMax: 80, windup: 16, strikeDur: 8 };
    default:
      return { ...b, w: 22, h: 22, hp: 18 + f * 4, maxHp: 18 + f * 4, spd: 0.8, atk: 8, canShoot: f >= 3 && Math.random() < 0.35, shootT: 26, shootInt: 65, color: '#2a0000' };
  }
}

export function makeBoss(floor: number, x: number, y: number): Enemy {
  const b = enemyBase('boss', x, y);
  return {
    ...b,
    w: 52, h: 52,
    hp: 100 + floor * 22, maxHp: 100 + floor * 22,
    spd: 1, atk: 22,
    canShoot: true, shootT: 26, shootInt: 34,
    color: '#991111',
    minionT: 220,
    aiState: 'chase',
    atkCdMax: 60, windup: 25, strikeDur: 10,
    canBlock: true, guardHP: 5,
  };
}
