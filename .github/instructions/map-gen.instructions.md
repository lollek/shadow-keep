---
description: "Use when working on dungeon map generation, room placement, corridor carving, tile placement, or adding new map features like chests, traps, or environmental tiles."
applyTo: "src/map-gen.ts"
---
# Map Generation Guidelines

- `generateMap()` must remain a pure function — takes `floor` number, returns `MapGenResult`
- Tile values: 0=wall, 1=floor, 2=exit, 3=chest, 4=water, 5=spikes, 6=breakable — use `TILE_*` constants
- BSP depth limit is 5. Room size range: MIN_ROOM=4, MAX_ROOM=9
- Always verify new tile placements are within map bounds and on floor tiles
- `carve()` stamps 3x3 floor tiles for corridors (ensures walkability)
- `farthestRoom()` uses BFS — don't assume Euclidean distance equals path distance
- `placeEnvironment()` handles post-generation tile placement (water, spikes, breakable walls) — extend it for new environmental tiles
- Chests placed in ~40% of non-start, non-exit rooms; spikes appear floor 3+; breakable walls floor 2+
- When adding new tile types during generation, respect room boundaries (don't place in walls or corridors)
- Test new generation features in `src/__tests__/environment.test.ts` or `map-gen.test.ts` — verify connectivity is preserved
