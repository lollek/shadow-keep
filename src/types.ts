export type GameMode = 'title' | 'town' | 'dungeon' | 'dead' | 'pause' | 'shop';
export type EnemyTier = 'basic' | 'charger' | 'sniper' | 'splitter' | 'elite' | 'minion' | 'boss';
export type AIState = 'patrol' | 'suspect' | 'chase' | 'search';
export type AttackState = 'idle' | 'windup' | 'strike' | 'recovery';
export type DungeonMode = 'explore' | 'boss';
export type ItemId = 'vampire' | 'tough' | 'explosive' | 'fastarrows';
export type ActiveItemId = 'smoke' | 'dash' | 'caltrops';

/** Tile values: 0=wall, 1=floor, 2=exit, 3=chest, 4=water, 5=spikes, 6=breakable wall */
export type TileValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface FloorTheme {
  name: string;
  floorCols: string[];
  wallCols: string[];
  waterCol: string;
  spikeCol: string;
  ambientTint: string;
}
export type SoundType =
  | 'melee' | 'shoot' | 'hit' | 'hurt' | 'die'
  | 'clear' | 'loot' | 'boss' | 'explode' | 'buy' | 'town' | 'exit';

export interface Rect {
  x: number; y: number; w: number; h: number;
}

export interface Player extends Rect {
  hp: number; maxHp: number; spd: number; atk: number;
  arrows: number; items: ItemId[];
  invincible: number; meleeCd: number; arrowCd: number;
  stamina: number; maxStamina: number;
  blocking: boolean; parryWindow: number;
  dodgeT: number; dodgeDx: number; dodgeDy: number;
  dodgeCd: number; guardBreaks: number;
  activeItem: ActiveItemId | null;
  activeCd: number;
}

export interface Enemy extends Rect {
  vx: number; vy: number;
  hp: number; maxHp: number; spd: number; atk: number;
  tier: EnemyTier; color: string;
  canShoot: boolean; shootT: number; shootInt: number;
  stateT: number;
  patrolDx: number; patrolDy: number; patrolT: number;
  patrolTargetAngle: number;
  aiState: AIState; suspectT: number;
  searchX: number; searchY: number; searchT: number;
  facing: number;
  atkState: AttackState; atkT: number; atkCd: number; atkCdMax: number;
  windup: number; strikeDur: number; strikeX: number; strikeY: number;
  canBlock: boolean; guardHP: number; blocking: boolean;
  chargeVx: number; chargeVy: number; chargeT: number;
  phase2: boolean; minionT: number;
  _split: boolean;
  _noiseCue: boolean;
}

export interface Projectile extends Rect {
  vx: number; vy: number;
  owner: 'player' | 'enemy';
  dmg: number; angle: number;
  explosive: boolean;
  boss: boolean;
  reflected: boolean;
  shooterX: number; shooterY: number;
  ownerId: Enemy | null;
}

export interface NormalParticle {
  type?: undefined;
  x: number; y: number; vx: number; vy: number;
  life: number; color: string;
}

export interface RippleParticle {
  type: 'ripple';
  x: number; y: number; r: number; maxR: number;
  life: number;
}

export interface DmgParticle {
  type: 'dmg';
  x: number; y: number; vy: number;
  life: number; text: string; color: string;
}

export type Particle = NormalParticle | RippleParticle | DmgParticle;

export interface Room {
  x: number; y: number; w: number; h: number;
  cx: number; cy: number;
}

export type TileMap = Uint8Array[];

export interface MeleeFlash {
  angle: number; timer: number;
}

export interface Caltrop extends Rect {
  life: number;
}

export interface DungeonState {
  mode: DungeonMode;
  floor: number;
  map: TileMap;
  rooms: Room[];
  startRoom: Room;
  exitRoom: Room;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  caltrops: Caltrop[];
  fog: Uint8Array[];
  keys: Record<string, boolean>;
  mouse: { x: number; y: number };
  cam: { x: number; y: number };
  meleeFlash: MeleeFlash | null;
  showMap: boolean;
  sneaking: boolean;
  goldBonus: number;
  rmb: boolean;
  isSneaking: boolean;
  bossDefeated: boolean;
  spikeCd: number;
  theme: FloorTheme;
}

export interface GameState {
  mode: GameMode;
  player: Player | null;
  depth: number;
  gold: number;
}

export interface SaveData {
  gold: number;
  deepest: number;
}

export interface TownState {
  keys: Record<string, boolean>;
  mouse: { x: number; y: number };
}

export interface ShopItem {
  n: string; i: string; d: string; c: number; r: string;
  a: (p: Player) => void;
}

export interface Building {
  id: string; label: string; color: string; roof: string;
  icon: string; x: number; desc: string; yMul?: number;
}

export interface BuildingRect extends Building {
  bx: number; by: number; bw: number; bh: number;
}
