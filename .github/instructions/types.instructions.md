---
description: "Use when modifying game types, adding new tile types, enemy types, item types, game modes, or extending interfaces. Covers type definitions in types.ts and related constants."
applyTo: "src/types.ts"
---
# Type System Conventions

- All finite sets use union types: `GameMode`, `EnemyTier`, `ItemId`, `AIState`, etc.
- `TileValue` is `0 | 1 | 2 | 3 | 4 | 5 | 6` — when adding a new tile type, extend the union AND add a `TILE_*` constant in constants.ts, then update map-gen, collision, draw/dungeon, and update.ts
- `FloorTheme` defines per-biome colors (floorCols, wallCols, waterCol, spikeCol, ambientTint) — accessed via `G.theme`
- `Enemy` interface has ALL fields required with defaults provided by `enemyBase()` — never make fields optional
- `Particle` uses a discriminated union (`NormalParticle | RippleParticle`) — extend via new variant, not optional fields
- `Player.items` is `ItemId[]` — add new item IDs to the `ItemId` union type
- Keep interfaces flat — avoid nesting objects unless there's a clear data boundary
