# Shadow Keep — Project Guidelines

## Architecture
Browser-based 2D dungeon crawler in TypeScript + Vite. Single-page canvas game, no frameworks.

**Module structure:**
- `src/types.ts` — All type definitions (single source of truth for interfaces)
- `src/constants.ts` — Game constants, tile size `T`, `UI_HEIGHT`, shop items, buildings
- `src/state.ts` — Mutable global state: `S` (GameState), `sv` (SaveData), `store` (DungeonState/TownState)
- `src/main.ts` — Entry point, game loop, event handlers
- `src/update.ts` — Main dungeon tick (player movement, enemy AI, projectiles, damage)
- `src/combat.ts` — Melee, shooting, dodge, particle bursts
- `src/map-gen.ts` — BSP procedural dungeon generation (pure functions)
- `src/enemies.ts` — Enemy factory functions (pure, no global state)
- `src/collision.ts` — Rect overlap, tile collision, entity separation (pure)
- `src/fog.ts` — Fog of war with Bresenham LOS
- `src/game-flow.ts` — Floor transitions, town ↔ dungeon flow
- `src/town.ts` — Town update loop, shop UI, building interaction
- `src/draw/` — All rendering (dungeon, town, player, enemies, projectiles, helpers)
- `src/canvas.ts`, `src/audio.ts`, `src/save.ts`, `src/ui.ts` — Browser services

**Key patterns:**
- `store.G` holds the active `DungeonState` (nullable — only set during dungeon)
- `store.TW` holds the active `TownState` (nullable — only set during town)
- Tile values: 0=wall, 1=floor, 2=exit. New tile types extend this (see types.ts)
- Constants `T` (tile size=24px) and `UI_HEIGHT` (HUD height=62px) must always be used — never hardcode these values
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
