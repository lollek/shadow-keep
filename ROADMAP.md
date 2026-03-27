# Shadow Keep — Game Roadmap

## Current State
A browser-based feudal-Japan dungeon crawler with:
- Town hub (4 shops: swordsmith, herbalist, toolmaker, shrine) + castle gate entrance
- Shrine shop unlocked at floor 10, sells active items + stackable passives
- Procedural BSP dungeon generation, boss every 5 floors
- 6 enemy types (basic/charger/sniper/splitter/elite/minion) + bosses
- Combat: melee, ranged (shuriken), dodge-roll, guard/parry, backstab, sneak
- Enemy AI: patrol → suspect → chase → search with cone-of-vision + noise
- Fog of war (Bresenham LOS), minimap, particles, screen shake
- Active items: smoke bomb, dash strike, caltrops (Q key, cooldowns)
- Stackable passives: vampire fang (+3 heal/kill/stack), iron lamellar (-20%/-35%/-45% dmg)
- Floating damage numbers (color-coded: white/yellow/orange/red)
- Run summary on death with personal bests tracking
- Persistent unlocks: shop tier gating (rare at floor 5, epic at floor 10)
- Procedural background music per theme (Web Audio oscillators)
- Fade-to-black floor transitions with text overlay
- Pause on focus loss with overlay + any-key resume
- Checkpoint panel isolated from pause flow (no repeat bonus/input leak)
- Reopenable help panel via `H` or `?`
- Boss exits visibly seal until the boss dies
- Gold persistence across death, 4 shop inventories
- Loot chests with random rewards (gold, shuriken, heal)
- 4 floor themes (Dungeon, Caverns, Shrine, Shadow Keep) with distinct visuals
- Environmental tiles: water (slows), spikes (damage), breakable walls (destructible)
- 7 tile types: wall, floor, exit, chest, water, spikes, breakable

## Now — Playtest Follow-Ups

### Thematic: Katana pose is still wrong
- **Symptom:** The player weapon still does not read as "sheathed at idle, drawn in combat". Blocking also looks awkward rather than like a clear guard stance.
- **Fix:**
	- Idle/town: katana worn at hip in sheath, readable silhouette, no exposed blade
	- Block: two-handed or forward guard pose with clear defensive silhouette
	- Melee: drawn blade feel should match the attack flash direction
	- Keep town and dungeon visuals consistent

## Next — Weapon Types (run-starting choice)
- Player selects weapon at Castle Gate before descending
- Each weapon has distinct attack pattern, range, speed, and damage
- **Katana** (default): balanced melee, medium speed, frontal arc
- **Dual Tanto**: fast attacks, short range, bonus backstab damage
- **Naginata**: slow, wide sweep, knockback effect, long reach
- **Nodachi**: very slow, huge damage per hit, long reach, narrow arc
- Needs: weapon type data, per-weapon draw language, selection UI, balance pass

## Later — Boss Rework
- Current bosses need more readable attack identity and more satisfying combat rhythm
- Add telegraphed attack patterns: charge, slam, projectile volley
- Add vulnerability windows after major attacks
- Add arena pressure/hazards that support the boss pattern rather than random attrition
- Consider per-theme boss variants with different movesets

## Later — Additional Ideas
- Settings panel (volume slider, key rebinding)
- More enemy types and boss patterns
- New floor themes beyond floor 15
- Achievements / challenge modes
- Leaderboard (local)