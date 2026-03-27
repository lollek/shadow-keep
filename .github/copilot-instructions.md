# Shadow Keep — Project Guidelines

## Architecture
Browser-based 2D dungeon crawler in TypeScript + Vite. Single-page canvas game, no frameworks.

**Module structure:**
- `src/types.ts` — All type definitions (single source of truth for interfaces)
- `src/constants.ts` — Game constants, tile size `T`, `UI_HEIGHT`, shop items, buildings, active items
- `src/state.ts` — Mutable global state: `S` (GameState), `sv` (SaveData), `store` (DungeonState/TownState + fade/help/pause overlay state)
- `src/main.ts` — Entry point, game loop, event handlers, fade overlay rendering
- `src/update.ts` — Main dungeon tick (player movement, enemy AI, projectiles, damage, caltrops)
- `src/combat.ts` — Melee, shooting, dodge, particle bursts, active items (useActiveItem)
- `src/player.ts` — Player factory, stackable passive helpers (itemCount, toughMul, vampireHeal)
- `src/map-gen.ts` — BSP procedural dungeon generation (pure functions)
- `src/enemies.ts` — Enemy factory functions (pure, no global state)
- `src/collision.ts` — Rect overlap, tile collision, entity separation (pure)
- `src/fog.ts` — Fog of war with Bresenham LOS
- `src/game-flow.ts` — Floor transitions (with fade), town ↔ dungeon flow, run stats
- `src/town.ts` — Town update loop, shop UI (with tier gating), building interaction
- `src/draw/` — All rendering (dungeon, town, player, enemies, projectiles, helpers)
- `src/canvas.ts`, `src/audio.ts` (SFX + procedural music), `src/save.ts`, `src/ui.ts` — Browser services (`RENDER_SCALE` in canvas.ts controls camera zoom)

**Key patterns:**
- `store.G` holds the active `DungeonState` (nullable — only set during dungeon)
- `store.TW` holds the active `TownState` (nullable — only set during town)
- `store.fade/fadeDir/fadeText/fadeCb` — fade-to-black transition system
- `store.pauseKind` distinguishes blur-pause from checkpoint flow; `store.helpOpen` tracks the reusable help overlay
- Tile values: 0=wall, 1=floor, 2=exit, 3=chest, 4=water, 5=spikes, 6=breakable (see `TileValue` in types.ts)
- Floor themes: 4 bands (Dungeon 1-4, Caverns 5-9, Shrine 10-14, Shadow Keep 15+) via `getTheme()` in constants.ts
- Shop tier gating: rare items require floor 5, epic items require floor 10 (checked in openShop)
- 4 shops: SW (Swordsmith), SA (Herbalist), SF (Toolmaker), SS (Shrine — unlocked at floor 10)
- Player-facing copy uses `shuriken` in UI, even though internal fields still use `arrows`
- Player presentation now faces the mouse direction; if changing zoom/aiming logic, keep `RENDER_SCALE` and mouse-to-world conversions in sync
- `Player.weapon` stores the currently selected weapon; Castle Gate now opens a run-start weapon choice before descent
- Active items: `ActiveItemId` union, Q key, one at a time, cooldown-based
- `WEAPONS` in constants.ts is the data source for melee cooldown/range/arc/damage tuning and Castle Gate selection UI
- The yellow melee telegraph in draw/dungeon.ts should reflect the selected weapon's actual arc and reach; keep it synced with `WEAPONS`
- Dual Tanto is offense-only in the current design and should not enter a blocking/parry state
- Stackable passives: `itemCount()`, `toughMul()`, `vampireHeal()` in player.ts
- Run stats: `S.run` tracks kills, goldEarned, startTime per descent
- Personal bests: `sv.bestFloor`, `sv.bestKills`, `sv.bestGold` in SaveData
- Constants `T` (tile size=24px) and `UI_HEIGHT` (HUD height=62px) must always be used — never hardcode these values
- Use `TILE_*` constants from constants.ts — never hardcode tile numeric values
- Pure logic modules (map-gen, collision, fog, enemies, player) take explicit parameters for testability

## Code Style
- TypeScript strict mode, ES modules
- Prefer `const` for objects whose reference never changes
- Use union types for finite sets (e.g., `ItemId`, `EnemyTier`, `GameMode`)
- No classes — plain objects + factory functions
- Inline short functions; extract only when genuinely reused

## Build and Test
```bash
npm run dev        # Vite dev server with HMR
npm run build      # Production build to dist/
npm test           # Vitest — run all tests
npm run test:watch # Vitest in watch mode
```

## Conventions
- Tests go in `src/__tests__/*.test.ts`
- Test pure modules (map-gen, collision, fog, enemies, player). Drawing/DOM modules don't need unit tests.
- Commit per logical feature, not per file
- See ROADMAP.md for planned features and their design specs
