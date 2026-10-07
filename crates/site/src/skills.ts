import { readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

export type Bucket = "engineering" | "productivity" | "intus";
export type Invocation = "user" | "model";

export interface Skill {
  name: string;
  description: string;
  bucket: Bucket;
  invocation: Invocation;
  argumentHint?: string;
  /** Path of the SKILL.md relative to the repo root, for linking to GitHub. */
  path: string;
  /** Upstream repo the skill is vendored from, or null when owned by this repo. */
  upstream: { repo: string; sha: string } | null;
}

export interface Frontmatter {
  [key: string]: string | boolean;
}

/** Minimal YAML frontmatter parser: flat `key: value` pairs, quoted or bare, booleans. Nested keys are skipped. */
export function parseFrontmatter(markdown: string): Frontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown);
  if (!match) return {};
  const out: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s/.test(line)) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value === "") continue;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1).replace(/\\"/g, '"');
    }
    out[key] = value === "true" ? true : value === "false" ? false : value;
  }
  return out;
}

function bucketFor(repoRelativePath: string): Bucket {
  if (repoRelativePath.startsWith("crates/skills/skills/engineering/")) return "engineering";
  if (repoRelativePath.startsWith("crates/skills/skills/productivity/")) return "productivity";
  return "intus";
}

interface DevinManifest {
  requiredPlugins?: { source: string; repo: string; sha: string }[];
}

export function loadSkills(repoRoot: string): Skill[] {
  const manifest = JSON.parse(
    readFileSync(join(repoRoot, ".claude-plugin/plugin.json"), "utf8"),
  ) as { skills: string[] };
  const devin = JSON.parse(
    readFileSync(join(repoRoot, ".devin-plugin/plugin.json"), "utf8"),
  ) as DevinManifest;
  const upstream = devin.requiredPlugins?.[0]
    ? { repo: devin.requiredPlugins[0].repo, sha: devin.requiredPlugins[0].sha }
    : null;

  return manifest.skills.map((entry) => {
    const dir = resolve(repoRoot, entry);
    const file = join(dir, "SKILL.md");
    const fm = parseFrontmatter(readFileSync(file, "utf8"));
    const path = relative(repoRoot, file);
    const bucket = bucketFor(path);
    return {
      name: typeof fm.name === "string" ? fm.name : basename(dirname(file)),
      description: typeof fm.description === "string" ? fm.description : "",
      bucket,
      invocation: fm["disable-model-invocation"] === true ? "user" : "model",
      argumentHint: typeof fm["argument-hint"] === "string" ? fm["argument-hint"] : undefined,
      path,
      upstream: bucket === "intus" ? null : upstream,
    };
  });
}
