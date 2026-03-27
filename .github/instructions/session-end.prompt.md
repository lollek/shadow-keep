---
description: "Run at the end of each coding session to review and update copilot configuration files. Ensures instructions, skills, and roadmap stay in sync with the codebase."
---
# Session End — Update Copilot Configuration

Before ending this session, review and update the following if any changes were made:

## Checklist

1. **ROADMAP.md** — Mark completed features as done or remove them. Update "Current State" section.
2. **.github/copilot-instructions.md** — Update if:
   - New modules were added or renamed
   - Key patterns changed (tile values, state shape, new constants)
   - Build/test commands changed
3. **.github/instructions/*.instructions.md** — Update file-specific instructions if:
   - New tile types, enemy types, or item types were added
   - Module APIs changed (new exports, renamed functions)
   - New conventions were established during implementation
4. **Memory notes** — Save any reusable insights to `/memories/` (debugging patterns, user preferences, project conventions)

## What to look for
- Tile value ranges in docs vs actual `TileValue` union in types.ts
- Module list in copilot-instructions.md vs actual files in `src/`
- Feature checklist order still makes sense for the current architecture
- Any new "Key patterns" discovered during implementation
