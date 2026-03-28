# 影 Shadow Keep 影

A browser-based 2D dungeon crawler set in feudal Japan. Written in TypeScript with Vite, rendered on a single HTML5 canvas — no game engine, no UI framework.

## What Is It?

You infiltrate a fortress floor by floor, fighting enemies, looting chests, and returning to a town hub between runs to spend gold at shops. The game features:

- **Four weapons** with distinct combat feel: Katana, Dual Tanto, Naginata, Nodachi
- **Procedural BSP dungeon generation** with four visual themes (Dungeon → Caverns → Shrine → Shadow Keep)
- **Tactical combat**: melee, thrown shuriken, dodge-roll, guard/parry, backstab, sneak
- **Enemy AI**: patrol → suspect → chase → search with cone-of-vision, noise propagation, and pack alerting
- **Active items**: smoke bomb, dash strike, caltrops (Q key, cooldown-based)
- **Stackable passives**: vampire fang (heal on kill), iron lamellar (damage reduction)
- **Boss every 5 floors** — exit seals until the boss dies
- **Town hub** with four shops (Swordsmith, Herbalist, Toolmaker, Shrine); rare items unlock at floor 5, epic at floor 10
- **Persistent gold** across deaths; personal bests tracked across sessions
- Procedural background music (Web Audio API oscillators), fog of war, minimap, screen shake, floating damage numbers

## Controls

| Key / Button | Action |
|---|---|
| `WASD` | Move |
| `Shift` | Sneak |
| `Left Click` | Melee strike |
| `Right Click` | Guard / Parry |
| `Space` | Dodge roll |
| `E` | Throw shuriken |
| `Q` | Use active item |
| `M` | Toggle minimap |
| `H` / `?` | Open help panel |

## Development

### Prerequisites

Node.js 18+ and npm.

```bash
npm install
```

### Commands

```bash
npm run dev        # Start Vite dev server with HMR (http://localhost:5173)
npm run build      # Type-check + production build → dist/
npm run preview    # Preview the production build locally
npm test           # Run all tests (Vitest)
npm run test:watch # Run tests in watch mode
```

### Project Structure

```
src/
  types.ts        # All type definitions — single source of truth
  constants.ts    # Game constants (tile size T=24, UI_HEIGHT=62, weapons, items, themes)
  state.ts        # Mutable global state: S (GameState), sv (SaveData), store (scene state)
  main.ts         # Entry point, game loop, input handlers, fade overlay
  update.ts       # Dungeon tick: movement, enemy AI, projectiles, damage
  combat.ts       # Melee, shooting, dodge, parry, active items
  player.ts       # Player factory + passive item helpers
  map-gen.ts      # BSP procedural dungeon generation (pure functions)
  enemies.ts      # Enemy factory functions (pure)
  collision.ts    # Rect overlap, tile collision, entity separation (pure)
  fog.ts          # Fog of war with Bresenham line-of-sight
  game-flow.ts    # Floor transitions (fade), town ↔ dungeon flow, run stats
  town.ts         # Town update loop, shop UI, building interaction
  audio.ts        # SFX + procedural background music
  canvas.ts       # Canvas/camera setup; RENDER_SCALE controls zoom
  save.ts         # localStorage persistence
  ui.ts           # DOM HUD helpers
  camera.ts       # Camera/viewport helpers
  draw/
    dungeon.ts    # Tile, particle, minimap rendering
    enemies.ts    # Enemy sprites
    player.ts     # Player sprite and swing telegraph
    projectiles.ts
    town.ts       # Town scene rendering
    helpers.ts    # Shared drawing utilities
  __tests__/      # Vitest unit tests for pure modules
```

Key state conventions:
- `store.G` — active `DungeonState` (null when in town)
- `store.TW` — active `TownState` (null when in dungeon)
- `store.fade*` — fade-to-black transition system
- Tile values: `0`=wall `1`=floor `2`=exit `3`=chest `4`=water `5`=spikes `6`=breakable — always use `TILE_*` constants

### Testing

Unit tests cover the pure logic modules. Drawing and DOM code is not tested.

```bash
npm test
```

Test files live in `src/__tests__/` and cover: map generation, collision, fog of war, enemies, player stats, and environmental tiles.

### Adding Features

When adding new game features, work through the modules in this order:

1. `types.ts` — extend type unions
2. `constants.ts` — add constants
3. `map-gen.ts` — place new tiles/entities during generation
4. `collision.ts` — add tile collision behaviour
5. `update.ts` — add gameplay logic
6. `draw/dungeon.ts` — render new tiles/effects
7. `src/__tests__/` — add tests for new pure logic

See `ROADMAP.md` for planned features and design notes.
