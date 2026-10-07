# @intuscare/site

Static GitHub Pages site that lists every skill shipped by the plugin.

`bun run build` reads the `skills` array in the root `.claude-plugin/plugin.json`, parses each `SKILL.md` frontmatter, and writes `dist/index.html` (plus `dist/skills.json`). The manifest is the single source of truth, so a skill shows up on the site exactly when it ships in the plugin.

Deployed by `.github/workflows/pages.yml` on every push to `main`.
