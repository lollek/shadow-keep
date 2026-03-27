---
description: "Use when adding new game features that span multiple modules, implementing roadmap items, or making cross-cutting changes to game systems."
---
# Feature Implementation Checklist

When adding a new game feature, update these modules in order:

1. **types.ts** — Add/extend types and unions
2. **constants.ts** — Add new constants (tile values, tuning numbers, theme data)
3. **map-gen.ts** — Place new tiles/entities during generation (if applicable)
4. **collision.ts** — Handle new tile collision behavior (if applicable)
5. **update.ts** — Add gameplay logic (interaction, damage, effects)
6. **draw/dungeon.ts** — Render new tiles/effects
7. **Tests** — Add tests for new pure logic in `src/__tests__/`

Cross-reference ROADMAP.md for design specs of planned features.
