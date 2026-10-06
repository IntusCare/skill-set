# skill-set
Software Factory

## Development

Turborepo monorepo using Bun workspaces. Each package under `crates/` is a workspace.
Tool versions are pinned in `mise.toml`; install [mise](https://mise.jdx.dev) and run `mise install`.

```sh
git submodule update --init --recursive
mise install
bun install
bun run build      # turbo run build
bun run test       # turbo run test
bun run typecheck  # turbo run typecheck
```
