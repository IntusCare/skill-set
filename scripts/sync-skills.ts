// Vendors upstream skills into ./skills and stamps the package version into every
// extension manifest. Plugin installers (Claude, Devin, Codex) don't reliably fetch
// git submodules or keep symlinks, so the shipped skills must be real files.
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = join(import.meta.dir, "..");
const readJson = (path: string) => JSON.parse(readFileSync(join(root, path), "utf8"));
const writeJson = (path: string, data: unknown) =>
  writeFileSync(join(root, path), `${JSON.stringify(data, null, 2)}\n`);

const sources = [{ crate: "crates/skills", manifest: ".claude-plugin/plugin.json" }];

const outDir = join(root, "skills");
rmSync(outDir, { recursive: true, force: true });

const seen = new Map<string, string>();
for (const { crate, manifest } of sources) {
  const manifestPath = join(crate, manifest);
  if (!existsSync(join(root, manifestPath))) {
    throw new Error(`${manifestPath} missing; run: git submodule update --init --recursive`);
  }
  for (const rel of readJson(manifestPath).skills as string[]) {
    const src = join(root, crate, rel);
    const name = basename(src);
    if (seen.has(name)) throw new Error(`Duplicate skill "${name}" in ${seen.get(name)} and ${crate}`);
    seen.set(name, crate);
    cpSync(src, join(outDir, name), { recursive: true, dereference: true });
  }
}

const { version } = readJson("package.json");
for (const path of [
  ".claude-plugin/plugin.json",
  ".devin-plugin/plugin.json",
  ".codex-plugin/plugin.json",
]) {
  writeJson(path, { ...readJson(path), version });
}

console.log(`Synced ${seen.size} skills into skills/ at version ${version}`);
