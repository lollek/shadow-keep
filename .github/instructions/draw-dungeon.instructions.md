---
description: "Use when working on dungeon rendering, tile drawing, fog of war visualization, minimap, particle rendering, or adding visual effects for new tile types."
applyTo: "src/draw/dungeon.ts"
---
# Dungeon Drawing Guidelines

- Camera offset uses `UI_HEIGHT` constant — never hardcode `62`
- Tile size uses `T` constant — never hardcode `24`
- Only draw tiles within the camera viewport (tx0..tx1, ty0..ty1 range)
- Fog values: 0=unseen (skip), 1=seen-but-dark (dim), 2=currently-visible (full)
- New tile types need rendering in the tile loop AND appropriate fog dimming
- Tile rendering uses `G.theme` colors (floorCols, wallCols, waterCol, spikeCol) — never use hardcoded color arrays
- Existing tile renderers: water (ripple animation), spikes (glint animation), chests (gold box), breakable walls (crack lines)
- Particle rendering happens after tiles but before UI
- Minimap draws all seen tiles at 3x scale — new tile types need minimap colors too
- Use `ctx.save()`/`ctx.restore()` for any transform or alpha changes
