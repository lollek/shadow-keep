---
description: "Use when modifying game types, adding new tile types, enemy types, item types, game modes, or extending interfaces. Covers type definitions in types.ts and related constants."
applyTo: "src/types.ts"
---
# Type System Conventions

- All finite sets use union types: `GameMode`, `EnemyTier`, `ItemId`, `AIState`, etc.
- When adding a new tile type, add it to the tile value documentation comment AND update map-gen, collision, draw/dungeon, and update.ts
- `Enemy` interface has ALL fields required with defaults provided by `enemyBase()` — never make fields optional
- `Particle` uses a discriminated union (`NormalParticle | RippleParticle`) — extend via new variant, not optional fields
- `Player.items` is `ItemId[]` — add new item IDs to the `ItemId` union type
- Keep interfaces flat — avoid nesting objects unless there's a clear data boundary
