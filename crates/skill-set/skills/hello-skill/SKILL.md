---
name: hello-skill
description: Sample skill that greets the user and reports the current repo and branch. Use when the user says hello to the skill set or wants to check that skills are loading.
---

A minimal **template** skill. Copy this folder to `skills/<new-skill-name>/`, rename `name` in the frontmatter, and rewrite the description and steps.

1. **Find where you are.** Run `git rev-parse --show-toplevel` and `git branch --show-current`. Done when you have the repo root and branch name (or know you are outside a git repo).

2. **Greet the user.** Reply with one line: `Hello from skill-set! You're on <branch> in <repo-name>.` Outside a git repo, reply `Hello from skill-set! No git repo here.` Done when the greeting is sent.
