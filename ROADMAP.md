# Shadow Keep — Game Roadmap

## Current State
A browser-based feudal-Japan dungeon crawler with:
- Town hub (4 shops: swordsmith, herbalist, toolmaker, shrine) + castle gate entrance
- Castle Gate weapon choice before each descent
- 4 run-start weapons with distinct combat identity: katana, dual tanto, naginata, nodachi
- Shrine shop unlocked at floor 10, sells active items + stackable passives
- Procedural BSP dungeon generation, boss every 5 floors
- 5 enemy types (basic/charger/sniper/elite/minion) + bosses
- Combat: melee, ranged (shuriken), dodge-roll, guard/parry, backstab, sneak
- Weapon-specific melee range, arc, cooldown, windup, swing timing, knockback, and attack telegraph
- Dual Tanto kill-chains on melee kill and cannot block
- Naginata uses long-reach narrow thrusting attacks; Nodachi uses wide sweeping heavy cuts with a committed windup
- Enemy AI: patrol → suspect → chase → search with cone-of-vision + noise, plus pack alerting
- Fog of war (Bresenham LOS), minimap, particles, screen shake
- Active items: smoke bomb, dash strike, caltrops (Q key, cooldowns)
- Stackable passives: vampire fang (+3 heal/kill/stack), iron lamellar (-20%/-35%/-45% dmg)
- Player sprite visually faces the mouse in town and dungeon
- Per-weapon player visuals and swing language
- Slightly zoomed-in world rendering for clearer combat readability
- Ranged enemies fire sooner and more often
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
- Melee cannot strike through walls or breakable walls
- Natural enemy pack encounters replace old death-splitting enemies
- Noise still affects AI, but the old on-screen ripple indicator is removed
- Environmental tiles: water (slows), spikes (damage), breakable walls (destructible)
- 7 tile types: wall, floor, exit, chest, water, spikes, breakable

## Next — Combat Feel Follow-Up
- Continue tuning weapon recovery and timing readability after the first nodachi windup pass
- Re-check whether the softened melee telegraph is readable enough at high combat density without disappearing into the background
- Fine-tune naginata and nodachi commitment so they feel distinct without drifting too far apart in effectiveness

## Later — Boss Rework
- Current bosses need more readable attack identity and more satisfying combat rhythm
- Add telegraphed attack patterns: charge, slam, projectile volley
- Add vulnerability windows after major attacks
- Add arena pressure/hazards that support the boss pattern rather than random attrition
- Consider per-theme boss variants with different movesets

## Later — Pack AI Polish
- Push pack behavior further than shared alerting: leader/follower spacing, flanking, staggered aggression, or coordinated pressure
- Decide whether packs should have clearer visual identity or composition rules by floor/theme
- Tune encounter composition so pack rooms feel deliberate instead of just denser versions of solo rooms

## Later — Additional Ideas
- Weapon balance pass after more playtesting
- Settings panel (volume slider, key rebinding)
- More enemy types and boss patterns
- New floor themes beyond floor 15
- Achievements / challenge modes
- Leaderboard (local)

## Later — Progression Rethink
- Re-evaluate run persistence: gold currently persists across death/reload, but the rest of progression resets too aggressively
- Decide what should persist between deaths, what should persist only at checkpoints, and what should stay run-only
- Reduce frustration of returning to town and restarting from floor 1 every time without flattening the game into permanent power creep
- Consider a stronger checkpoint/meta-progression structure so town returns feel like forward progress instead of a reset tax