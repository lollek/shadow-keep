---
description: "Use when working on dungeon map generation, room placement, corridor carving, tile placement, or adding new map features like chests, traps, or environmental tiles."
applyTo: "src/map-gen.ts"
---
# Map Generation Guidelines

- `generateMap()` must remain a pure function — takes `floor` number, returns `MapGenResult`
- Tile values: 0=wall, 1=floor, 2=exit (extend with new values for new tile types)
- BSP depth limit is 5. Room size range: MIN_ROOM=4, MAX_ROOM=9
- Always verify new tile placements are within map bounds and on floor tiles
- `carve()` stamps 3x3 floor tiles for corridors (ensures walkability)
- `farthestRoom()` uses BFS — don't assume Euclidean distance equals path distance
- When adding new tile types during generation, respect room boundaries (don't place in walls or corridors)
- Test new generation features in `src/__tests__/map-gen.test.ts` — verify connectivity is preserved
