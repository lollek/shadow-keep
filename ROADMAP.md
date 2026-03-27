# Shadow Keep — Game Roadmap

## Current State
A browser-based feudal-Japan dungeon crawler with:
- Town hub (4 shops: swordsmith, herbalist, bowyer, shrine) + castle gate entrance
- Shrine shop unlocked at floor 10, sells active items + stackable passives
- Procedural BSP dungeon generation, boss every 5 floors
- 6 enemy types (basic/charger/sniper/splitter/elite/minion) + bosses
- Combat: melee, ranged (arrows), dodge-roll, blocking, parry, backstab, sneak
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
- Gold persistence across death, 4 shop inventories
- Loot chests with random rewards (gold, arrows, heal)
- 4 floor themes (Dungeon, Caverns, Shrine, Shadow Keep) with distinct visuals
- Environmental tiles: water (slows), spikes (damage), breakable walls (destructible)
- 7 tile types: wall, floor, exit, chest, water, spikes, breakable

## Future Ideas
- Settings panel (volume slider, key rebinding)
- More enemy types and boss patterns
- New floor themes beyond floor 15
- Equipment slots with weapon variety
- Achievements / challenge modes
- Leaderboard (local)
