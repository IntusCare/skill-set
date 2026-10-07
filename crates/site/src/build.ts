import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { renderPage } from "./render";
import { loadSkills } from "./skills";

const repoRoot = resolve(import.meta.dir, "../../..");
const outDir = resolve(import.meta.dir, "../dist");
const skills = loadSkills(repoRoot);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), renderPage(skills));
writeFileSync(join(outDir, "skills.json"), `${JSON.stringify(skills, null, 2)}\n`);
writeFileSync(join(outDir, ".nojekyll"), "");

console.log(`site: wrote ${skills.length} skills to ${outDir}`);
