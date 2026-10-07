import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Bucket, Skill } from "./skills";

const REPO = "https://github.com/IntusCare/skill-set";

export function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function skillUrl(skill: Skill): string {
  if (skill.upstream) {
    const inUpstream = skill.path.replace(/^crates\/skills\//, "");
    return `https://github.com/${skill.upstream.repo}/blob/${skill.upstream.sha}/${inUpstream}`;
  }
  return `${REPO}/blob/main/${skill.path}`;
}

interface BucketCopy {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  tone: "light" | "grey" | "dark";
}

const BUCKETS: Record<Bucket, BucketCopy> = {
  engineering: {
    id: "engineering",
    eyebrow: "Engineering",
    title: "Daily code work.",
    lede: "From the first grilling session to the merged PR: plan, spec, ticket, implement test-first, review, and retro. Small, composable skills that hand off to each other instead of owning your process.",
    tone: "light",
  },
  productivity: {
    id: "productivity",
    eyebrow: "Productivity",
    title: "Thinking tools, not code tools.",
    lede: "Interviews that sharpen a plan, handoffs between sessions, questionnaires for the one person who can decide, and a reset button for when a message does not land.",
    tone: "grey",
  },
  intus: {
    id: "intus",
    eyebrow: "Intus Care",
    title: "Built in-house.",
    lede: "Skills owned by this repo. They ship alongside the vendored set and load automatically for agents working inside skill-set.",
    tone: "dark",
  },
};

const ORDER: Bucket[] = ["engineering", "productivity", "intus"];

function renderSkill(skill: Skill): string {
  const invocation =
    skill.invocation === "user"
      ? '<span class="tag tag--user">User-invoked</span>'
      : '<span class="tag">Model-invoked</span>';
  const hint = skill.argumentHint
    ? `<span class="skill__hint">${escapeHtml(skill.argumentHint)}</span>`
    : "";
  return `<li class="skill reveal">
  <h4 class="skill__name"><a href="${escapeHtml(skillUrl(skill))}">${escapeHtml(skill.name)}</a>${hint}</h4>
  <p class="skill__desc">${escapeHtml(skill.description)}</p>
  <div class="skill__meta">${invocation}</div>
</li>`;
}

function renderGroup(title: string, note: string, skills: Skill[]): string {
  if (skills.length === 0) return "";
  return `<div class="group">
  <h3 class="group__title">${title} <small>${note}</small></h3>
  <ul class="skills">
${skills.map(renderSkill).join("\n")}
  </ul>
</div>`;
}

function renderBucket(bucket: Bucket, skills: Skill[]): string {
  const copy = BUCKETS[bucket];
  const user = skills.filter((s) => s.invocation === "user");
  const model = skills.filter((s) => s.invocation === "model");
  const groups =
    bucket === "intus"
      ? `<ul class="skills">\n${skills.map(renderSkill).join("\n")}\n</ul>`
      : [
          renderGroup("User-invoked", "You type the slash command. The model never reaches for these on its own.", user),
          renderGroup("Model-invoked", "The model can pick these up from trigger phrases, or you can call them directly.", model),
        ].join("\n");
  return `<section class="section section--${copy.tone}" id="${copy.id}" aria-labelledby="${copy.id}-title">
  <div class="section__inner">
    <div class="section__head reveal">
      <div>
        <p class="eyebrow">${copy.eyebrow}</p>
        <h2 class="section__title" id="${copy.id}-title">${copy.title}</h2>
      </div>
      <p class="section__lede">${copy.lede}</p>
    </div>
${groups}
  </div>
</section>`;
}

function renderHeroCells(skills: Skill[]): string {
  return skills
    .map((s, i) => `<li style="--i:${i}">${escapeHtml(s.name)}</li>`)
    .join("");
}

export function renderPage(skills: Skill[]): string {
  const css = readFileSync(join(import.meta.dir, "styles.css"), "utf8");
  const count = (b: Bucket) => skills.filter((s) => s.bucket === b).length;
  const userCount = skills.filter((s) => s.invocation === "user").length;
  const upstream = skills.find((s) => s.upstream)?.upstream ?? null;
  const upstreamShort = upstream ? upstream.sha.slice(0, 7) : "";
  const year = new Date().getUTCFullYear();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skill Set: agent skills for real engineering</title>
<meta name="description" content="Intus Care's curated agent skill set for Claude Code, Devin and OpenAI Codex: ${skills.length} skills for grilling, specs, tickets, TDD, code review and more.">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" content="#000000">
<style>
${css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="nav">
  <a class="nav__brand" href="#top" aria-label="Skill Set home">Skill Set</a>
  <nav aria-label="Sections">
    <ul class="nav__links">
      <li><a href="#engineering">Engineering</a></li>
      <li><a href="#productivity">Productivity</a></li>
      <li><a href="#intus">Intus Care</a></li>
      <li><a href="#install">Install</a></li>
    </ul>
  </nav>
  <div class="nav__right">
    <a class="btn btn--light btn--small" href="${REPO}">GitHub</a>
  </div>
</header>

<main id="main">
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__scene" aria-hidden="true">
    <div class="hero__floor"></div>
    <div class="hero__unit">
      <span class="hero__brand">Skill Set</span>
      <ul class="hero__cells">${renderHeroCells(skills)}</ul>
    </div>
  </div>
  <div class="hero__copy">
    <h1 class="hero__title" id="hero-title">Skill Set</h1>
    <p class="hero__sub">${skills.length} agent skills for real engineering. One plugin for <a href="#install">Claude Code, Devin and Codex</a>.</p>
  </div>
  <div class="hero__actions">
    <a class="btn btn--primary" href="#install">Install</a>
    <a class="btn btn--light" href="#engineering">Browse Skills</a>
  </div>
</section>

<section class="specs" aria-label="At a glance">
  <div class="spec reveal"><span class="spec__value">${skills.length}</span><span class="spec__label">Skills</span></div>
  <div class="spec reveal"><span class="spec__value">${count("engineering")}</span><span class="spec__label">Engineering</span></div>
  <div class="spec reveal"><span class="spec__value">${count("productivity")}</span><span class="spec__label">Productivity</span></div>
  <div class="spec reveal"><span class="spec__value">${userCount}</span><span class="spec__label">User-invoked slash commands</span></div>
</section>

${ORDER.map((b) => renderBucket(b, skills.filter((s) => s.bucket === b))).join("\n\n")}

<section class="section section--grey" id="install" aria-labelledby="install-title">
  <div class="section__inner">
    <div class="section__head reveal">
      <div>
        <p class="eyebrow">Install</p>
        <h2 class="section__title" id="install-title">One repo. Three agents.</h2>
      </div>
      <p class="section__lede">Every manifest points at the same pinned skills, so whichever agent you use, you get the same set at the same version.</p>
    </div>
    <div class="install">
      <article class="agent reveal">
        <h3>Claude Code</h3>
        <p>Add the repo as a marketplace, then install the plugin.</p>
        <ol>
          <li><code>/plugin marketplace add IntusCare/skill-set</code></li>
          <li><code>/plugin install skill-set@intuscare-skill-set</code></li>
        </ol>
        <p class="agent__foot">Manifest: <code style="display:inline;padding:1px 6px">.claude-plugin/plugin.json</code></p>
      </article>
      <article class="agent reveal">
        <h3>Devin</h3>
        <p>Customize, Plugins, Add plugin, From repository. Or from the CLI:</p>
        <ol>
          <li><code>devin plugins install IntusCare/skill-set</code></li>
        </ol>
        <p class="agent__foot">Manifest: <code style="display:inline;padding:1px 6px">.devin-plugin/plugin.json</code></p>
      </article>
      <article class="agent reveal">
        <h3>OpenAI Codex</h3>
        <p>Add the marketplace, then install <code style="display:inline;padding:1px 6px">skill-set</code> from <code style="display:inline;padding:1px 6px">/plugins</code>.</p>
        <ol>
          <li><code>codex plugin marketplace add IntusCare/skill-set</code></li>
        </ol>
        <p class="agent__foot">Manifest: <code style="display:inline;padding:1px 6px">.codex-plugin/plugin.json</code>. Ships the engineering bucket only.</p>
      </article>
    </div>
  </div>
</section>
</main>

<footer class="footer">
  <div class="footer__inner">
    <span>&copy; ${year} <a href="https://github.com/IntusCare">Intus Care</a>. MIT licensed.</span>
    ${
      upstream
        ? `<span>Vendored skills from <a href="https://github.com/${upstream.repo}">${upstream.repo}</a> at <a href="https://github.com/${upstream.repo}/tree/${upstream.sha}"><code style="font-family:var(--mono)">${upstreamShort}</code></a>.</span>`
        : ""
    }
    <span>Generated from <a href="${REPO}/blob/main/.claude-plugin/plugin.json">plugin.json</a>. <a href="skills.json">skills.json</a></span>
  </div>
</footer>

<script>
(() => {
  document.documentElement.classList.add("js");
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 24);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const el of items) el.classList.add("is-visible");
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  for (const el of items) io.observe(el);
})();
</script>
</body>
</html>
`;
}
