# Shadow Keep — Game Roadmap

## Current State
A browser-based feudal-Japan dungeon crawler with:
- Town hub (3 shops: swordsmith, herbalist, bowyer) + castle gate entrance
- Procedural BSP dungeon generation, boss every 5 floors
- 6 enemy types (basic/charger/sniper/splitter/elite/minion) + bosses
- Combat: melee, ranged (arrows), dodge-roll, blocking, parry, backstab, sneak
- Enemy AI: patrol → suspect → chase → search with cone-of-vision + noise
- Fog of war (Bresenham LOS), minimap, particles, screen shake
- 4 passive items (vampire fang, iron lamellar, fire arrows, yumi bow)
- Gold persistence across death, 3 shop inventories
- Loot chests with random rewards (gold, arrows, heal)
- 4 floor themes (Dungeon, Caverns, Shrine, Shadow Keep) with distinct visuals
- Environmental tiles: water (slows), spikes (damage), breakable walls (destructible)
- 7 tile types: wall, floor, exit, chest, water, spikes, breakable

## Phase 1 — Build Diversity

### 1.1 Active Items with Cooldowns
- Smoke bomb: break enemy LOS in radius, 30s cooldown
- Dash strike: lunge forward dealing 2x damage, 15s cooldown
- Caltrops: drop behind you, slows + damages enemies, 20s cooldown
- Active slot (1 at a time), key binding: Q

### 1.2 Stackable Passives
- Vampire fang: +3 per stack (3/6/9 heal per kill)
- Iron lamellar: stacks reduce damage 20%/35%/45%

### 1.3 4th Shop — Shrine
- Sells active items and upgraded passives
- Unlocks after reaching floor 10

## Phase 2 — Progression & Feel

### 2.1 Run Summary on Death
- Stats: floors cleared, enemies killed, gold earned, time elapsed
- Personal bests tracking in save data

### 2.2 Persistent Unlocks
- Floor milestones unlock new shop tiers
- Cosmetic unlocks for player sprite

### 2.3 Damage Numbers
- Floating text above enemies on hit
- Color-coded: white=normal, yellow=backstab, red=critical

## Phase 3 — Audio & Polish

### 3.1 Background Music
- Procedural music loop using Web Audio oscillators
- Different mood per theme (dungeon=tense, caves=ambient, shrine=ethereal)

### 3.2 Floor Transitions
- Fade to black between floors
- Brief loading text

### 3.3 QoL
- Settings panel (volume, key rebinding)
- Pause on focus loss
- Arrow count always visible in HUD
