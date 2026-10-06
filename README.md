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
```

## Installing as an agent extension

This repo is a plugin for Claude Code, Devin, and OpenAI Codex. All three ship the same skills from `skills/`.

| Agent | Manifest | Install |
| --- | --- | --- |
| Claude Code | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | `/plugin marketplace add IntusCare/skill-set` then `/plugin install skill-set@intuscare-skill-set` |
| Devin | `.devin-plugin/plugin.json` | Customize → Plugins → Add plugin → From repository → `IntusCare/skill-set`, or `devin plugins install IntusCare/skill-set` |
| OpenAI Codex | `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json` | `codex plugin marketplace add IntusCare/skill-set`, then install `skill-set` from `/plugins` |

`skills/` is generated: plugin installers don't fetch submodules or keep symlinks, so the promoted skills from `crates/skills` are copied in as real files. After bumping a submodule or the `version` in `package.json`, run:

```sh
bun run sync:skills
```

This re-copies the skills and stamps the version into all three manifests. Commit the result.

`crates/gstack` is not bundled: its skills expect gstack's own `./setup` install under `~/.claude/skills/gstack`.
