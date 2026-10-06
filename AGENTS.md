# skill-set

Bun + Turborepo monorepo; every directory under `crates/` is a workspace. Commands live in the root `package.json` scripts and `README.md`.

## Submodules

`crates/skills` (mattpocock/skills) and `crates/gstack` (garrytan/gstack) are git submodules of third-party repos, pinned to specific commits. Run `git submodule update --init --recursive` when a `crates/` directory is empty.

- Treat submodule contents as vendored: changes belong upstream. Edits here are limited to bumping the pinned commit, committed as the gitlink change in this repo.
- Each submodule carries its own `AGENTS.md`; follow it when working inside that directory.

## Tooling

- Bun is the package manager (`packageManager` in `package.json`); `bun.lock` is the lockfile.
- Biome (`biome.json`) formats and lints the repo, excluding the submodules; run `bun run check:fix` before committing.
- Code owned by this repo goes in a new workspace under `crates/`, picked up automatically by the `crates/*` glob.
- New skills go in `crates/skill-set/skills/<name>/`; register each in `.claude-plugin/plugin.json` and symlink it into `.agents/skills/<name>` (see `README.md`).

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
