# skill-set
Software Factory

## Development

Turborepo monorepo using Bun workspaces. Each package under `crates/` is a workspace.

```sh
git submodule update --init --recursive
bun install
bun run build      # turbo run build
bun run test       # turbo run test
bun run typecheck  # turbo run typecheck
bun run check      # biome check (format + lint + import sorting)
bun run check:fix  # biome check --write
```

## Installing as an agent extension

This repo is a plugin for Claude Code, Devin, and OpenAI Codex.

| Agent | Manifest | Install |
| --- | --- | --- |
| Claude Code | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | `/plugin marketplace add IntusCare/skill-set` then `/plugin install skill-set@intuscare-skill-set` |
| Devin | `.devin-plugin/plugin.json` | Customize → Plugins → Add plugin → From repository → `IntusCare/skill-set`, or `devin plugins install IntusCare/skill-set` |
| OpenAI Codex | `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json` | `codex plugin marketplace add IntusCare/skill-set`, then install `skill-set` from `/plugins` |

Skills are not copied into this repo. Each manifest points at the pinned `crates/skills` submodule:

- **Claude Code** lists the promoted skill directories under `crates/skills/skills/` (mirrors `crates/skills/.claude-plugin/plugin.json`).
- **Codex** takes a single `skills` path, so it points at `crates/skills/skills/engineering/` only.
- **Devin** depends on `mattpocock/skills` at the submodule's commit through `requiredPlugins`.

After bumping the submodule, update the Claude `skills` list and the Devin `requiredPlugins` sha to match.

## Skills owned by this repo

Repo-owned skills live in `crates/skill-set/skills/<name>/`. To ship and dogfood one:

1. Add it to the Claude `skills` list in `.claude-plugin/plugin.json`.
2. Symlink it into `.agents/skills/` so agents working in this repo load it without installing the plugin:

   ```sh
   ln -s ../../crates/skill-set/skills/<name> .agents/skills/<name>
   ```

To test the whole plugin from the working tree: `claude --plugin-dir .` (Claude Code), or `codex plugin marketplace add ./` (Codex, via `.agents/plugins/marketplace.json`).

`crates/gstack` is not bundled: its skills expect gstack's own `./setup` install under `~/.claude/skills/gstack`.
