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

## Now — Bug Fixes & Theming

### BUG: Exit tile loops (floor skip)
- **Symptom:** Standing on exit tile causes sound loop; player jumps many floors at once.
- **Root cause:** `onFloorExit()` fires every frame during fade transition — no re-entry guard. Each frame increments `S.depth` and overwrites the fade callback.
- **Fix:** Guard `onFloorExit()` with `if (store.fadeDir !== 0) return;` so it only fires once per transition.

### BUG: Background music inaudible
- **Symptom:** Music plays but cannot be heard.
- **Root cause:** Volume is applied twice — once on the per-note gain node (`m.vol`) and again on the master gain node (`_musicGain.gain.value = m.vol`). Effective volume is ~0.04² = 0.0016, essentially silent.
- **Fix:** Set per-note gain to `1.0` and let the master `_musicGain` alone control volume.

### BUG: Boss skippable
- **Symptom:** Player can walk past the boss and reach the exit tile without fighting.
- **Root cause:** No gate on exit tile during boss mode. The `bossDefeated` flag exists in `DungeonState` but is never set to `true` and never checked.
- **Fix:** Block exit when `G.mode === 'boss' && !G.bossDefeated`. Set `G.bossDefeated = true` on boss kill. Show "Defeat the boss first!" message.

### Thematic: Katana + Shuriken reskin
- **Sword:** Currently a European longsword (straight silver rectangle + gold crossguard). Restyle as a katana: curved single-edge blade, tsuba (round guard), wrapped tsuka (handle). Sheathed at idle, drawn during melee/block.
- **Arrows → Shuriken:** Currently generic brown arrows with grey triangular head. Replace with 4-pointed throwing star shape. Rotate while in flight.
- **Shield → guard stance:** Current European buckler is out of theme. Replace visual with a katana-held-forward guard pose or remove shield visual entirely in favour of blade-parry.

## Next — Weapon Types (run-starting choice)
- Player selects weapon at Castle Gate before descending
- Each weapon has distinct attack pattern, range, speed, and damage
- **Katana** (default): balanced melee, medium speed, 180° frontal arc
- **Dual Tanto**: fast attacks, short range, bonus backstab damage, narrower arc
- **Naginata**: slow, wide 270° sweep, knockback effect, long reach
- **Nodachi**: very slow, huge damage per hit, long reach, narrow arc
- Needs: WeaponId type, weapon stats in constants.ts, per-weapon draw code, selection UI

## Next — Boss Rework
- Current bosses are damage sponges with only a phase-2 speed increase
- Add telegraphed attack patterns: charge (dash across arena), slam (AoE stomp), projectile volley
- Wind-up visual (red flash already exists) → distinct per-attack telegraph
- Vulnerability windows after big attacks (boss stunned briefly = safe damage window)
- Arena hazards that activate during fight (e.g. falling rocks, fire zones)
- Per-theme boss variants with different movesets
- Depends on weapon types being in place for best combat feel

## Future Ideas
- Settings panel (volume slider, key rebinding)
- More enemy types and boss patterns
- New floor themes beyond floor 15
- Achievements / challenge modes
- Leaderboard (local)