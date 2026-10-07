import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { loadSkills, parseFrontmatter } from "./skills";

describe("parseFrontmatter", () => {
  test("reads bare, quoted and boolean values", () => {
    const fm = parseFrontmatter(
      '---\nname: tdd\ndescription: "Test-driven: \\"red\\" first."\ndisable-model-invocation: true\nmetadata:\n  credits: x\n---\n# Body\n',
    );
    expect(fm).toEqual({
      name: "tdd",
      description: 'Test-driven: "red" first.',
      "disable-model-invocation": true,
    });
  });

  test("returns empty object without frontmatter", () => {
    expect(parseFrontmatter("# Just a heading\n")).toEqual({});
  });
});

describe("loadSkills", () => {
  const skills = loadSkills(resolve(import.meta.dir, "../../.."));

  test("loads every manifest entry with a name and description", () => {
    expect(skills.length).toBeGreaterThan(20);
    for (const s of skills) {
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(0);
    }
  });

  test("classifies buckets and invocation", () => {
    const byName = Object.fromEntries(skills.map((s) => [s.name, s]));
    expect(byName.tdd.bucket).toBe("engineering");
    expect(byName.tdd.invocation).toBe("model");
    expect(byName["grill-me"].bucket).toBe("productivity");
    expect(byName["grill-me"].invocation).toBe("user");
    expect(byName["hello-skill"].bucket).toBe("intus");
    expect(byName["hello-skill"].upstream).toBeNull();
    expect(byName.tdd.upstream?.repo).toBe("mattpocock/skills");
  });
});
