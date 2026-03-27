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

## Phase 1 — Dungeon Variety (In Progress)

### 1.1 Loot Chests
- Chest tile type (value 3) placed in non-start, non-exit rooms
- Interaction on walk-over: random reward (gold, arrows, small heal)
- Visual: distinct chest sprite on the map
- Sound: "loot" sound on pickup

### 1.2 Floor Themes
- Theme per floor band (1-4: dungeon, 5-9: caves, 10-14: shrine, 15+: shadow)
- Each theme defines: floor colors, wall colors, ambient tint, name
- Theme shown in floor message ("Floor 7 — Caverns")
- Theme data in constants.ts, used by draw/dungeon.ts

### 1.3 Environmental Tiles
- **Water** (tile value 4): slows movement to 50%, blue tint, ripple particles
- **Spikes** (tile value 5): deals damage on contact (once per second), red glint
- **Breakable walls** (tile value 6): destroyed by melee or explosive arrows, reveals floor
- Placed during map generation based on floor theme

## Phase 2 — Build Diversity (Planned)

### 2.1 Active Items with Cooldowns
- Smoke bomb: break enemy LOS in radius, 30s cooldown
- Dash strike: lunge forward dealing 2x damage, 15s cooldown
- Caltrops: drop behind you, slows + damages enemies, 20s cooldown
- Active slot (1 at a time), key binding: Q

### 2.2 Stackable Passives
- Vampire fang: +3 per stack (3/6/9 heal per kill)
- Iron lamellar: stacks reduce damage 20%/35%/45%

### 2.3 4th Shop — Shrine
- Sells active items and upgraded passives
- Unlocks after reaching floor 10

## Phase 3 — Progression & Feel (Planned)

### 3.1 Run Summary on Death
- Stats: floors cleared, enemies killed, gold earned, time elapsed
- Personal bests tracking in save data

### 3.2 Persistent Unlocks
- Floor milestones unlock new shop tiers
- Cosmetic unlocks for player sprite

### 3.3 Damage Numbers
- Floating text above enemies on hit
- Color-coded: white=normal, yellow=backstab, red=critical

## Phase 4 — Audio & Polish (Planned)

### 4.1 Background Music
- Procedural music loop using Web Audio oscillators
- Different mood per theme (dungeon=tense, caves=ambient, shrine=ethereal)

### 4.2 Floor Transitions
- Fade to black between floors
- Brief loading text

### 4.3 QoL
- Settings panel (volume, key rebinding)
- Pause on focus loss
- Arrow count always visible in HUD
