#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const kbPath = path.join(root, "cv", "knowledge-base.json");
const roleDossiersPath = path.join(root, "cv", "role-dossiers.json");
const technicalAssetsPath = path.join(root, "cv", "technical-assets.json");
const profileDirectory = path.join(root, "cv", "profiles");

function usage() {
  return `Usage: node scripts/generate-cv.mjs <profile> [options]

Profiles live in cv/profiles/. The first argument is required.

Options:
  --focus=tag,tag       Only render evidence related to these tags.
  --exclude=tag,tag     Remove evidence related to these tags.
  --max-roles=number    Limit selected experience in its profile order.
  --title="text"        Override the profile's visible role title.
  --summary=id          Select a named summary from the knowledge base.
  --out=path            Write HTML to a repository-relative path.
  --help                Show this help.

Examples:
  node scripts/generate-cv.mjs fractional-ai-systems
  node scripts/generate-cv.mjs fractional-ai-systems --focus=llm,repos,infrastructure --max-roles=4
  node scripts/generate-cv.mjs fractional-ai-systems --title="Principal LLM Systems Engineer" --out=drafts/cv-principal-llm.html`;
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const [key, value = true] = arg.slice(2).split(/=(.*)/s, 2);
    flags[key] = value;
  }
  return { positional, flags };
}

function csv(value) {
  if (typeof value !== "string" || value.trim() === "") return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function valueByIds(items, ids, label) {
  const table = new Map(items.map((item) => [item.id, item]));
  return ids.map((id) => {
    const item = table.get(id);
    if (!item) throw new Error(`Profile refers to missing ${label}: ${id}`);
    return item;
  });
}

function tagMatch(item, tags) {
  return tags.length === 0 || item.tags?.some((tag) => tags.includes(tag));
}

function git(command) {
  try {
    return execFileSync("git", command, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "unavailable";
  }
}

function profileEvidence(items, focusTags, excludedTags) {
  return items.filter((item) => tagMatch(item, focusTags) && !item.tags?.some((tag) => excludedTags.includes(tag)));
}

function renderDocument(model) {
  const {
    person, title, summary, scope, experience, capabilities, technicalStack, selectedWork, education, provenance
  } = model;
  const contact = [
    escapeHtml(person.location),
    `<a href="mailto:${escapeHtml(person.contact.email)}">${escapeHtml(person.contact.email)}</a>`,
    `<a href="${escapeHtml(person.contact.github)}">github.com/marchdown</a>`,
    `<a href="${escapeHtml(person.contact.website)}">hyperstitious.org</a>`
  ].join('<span class="separator">|</span>');
  const scopeHtml = scope.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("\n");
  const experienceHtml = experience.map((role) => `
      <article class="job">
        <div class="job-head">
          <span class="job-title">${escapeHtml(role.title)} <span class="organization">- ${escapeHtml(role.organization)}</span></span>
          <span class="dates">${escapeHtml(role.dates)}</span>
        </div>
        <p class="context">${escapeHtml(role.context)}</p>
        <ul>${role.bullets.map((bullet) => `<li>${escapeHtml(bullet.text)}</li>`).join("")}</ul>
      </article>`).join("\n");
  const capabilitiesHtml = capabilities.map((item) => `
        <div class="capability">
          <h3>${escapeHtml(item.heading)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </div>`).join("\n");
  const technicalStackHtml = technicalStack.map((item) => `
        <div class="capability">
          <h3>${escapeHtml(item.heading)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </div>`).join("\n");
  const workHtml = selectedWork.map((item) => `
      <p class="project"><strong><a href="${escapeHtml(item.url)}">${escapeHtml(item.name)}</a></strong> <span>- ${escapeHtml(item.text)}</span></p>`).join("\n");
  const provenanceLine = [
    `project_name=${provenance.project_name}`,
    `repo_path=${provenance.repo_path}`,
    `git_remote=${provenance.git_remote}`,
    `git_branch=${provenance.git_branch}`,
    `git_commit=${provenance.git_commit}`
  ].map(escapeHtml).join("; ");
  const sessionLine = [
    `generated_at=${provenance.generated_at}`,
    `generator=${provenance.generator}`,
    `session_source=${provenance.session_source}`,
    `session_locator=${provenance.session_locator}`
  ].map(escapeHtml).join("; ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escapeHtml(person.name)} - ${escapeHtml(title)}.">
<title>${escapeHtml(person.name)} - ${escapeHtml(title)}</title>
<style>
  :root { --ink:#17212b; --muted:#506171; --faint:#718191; --rule:#cbd4da; --accent:#0f5e75; --paper:#fff; --surface:#f3f6f7; }
  * { box-sizing:border-box; }
  html { -webkit-text-size-adjust:100%; }
  body { margin:0; background:var(--surface); color:var(--ink); font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
  a { color:inherit; text-decoration-thickness:1px; text-underline-offset:2px; }
  .page { width:min(820px,calc(100% - 32px)); margin:40px auto; padding:46px 54px 38px; background:var(--paper); border:1px solid var(--rule); box-shadow:0 22px 54px -38px #15243199; }
  header { border-bottom:2px solid var(--ink); padding-bottom:17px; }
  h1 { margin:0; font-size:31px; line-height:1.08; font-weight:700; letter-spacing:0; }
  .role-title { max-width:58ch; margin:7px 0 0; color:var(--accent); font-size:17px; font-weight:650; line-height:1.35; }
  .contact { margin:13px 0 0; color:var(--muted); font-size:13.5px; }.separator { margin:0 .45em; color:var(--faint); }
  h2 { margin:27px 0 9px; padding-bottom:6px; border-bottom:1px solid var(--rule); color:var(--accent); font-size:11px; font-weight:750; letter-spacing:.12em; line-height:1; text-transform:uppercase; }
  p { margin:.45em 0; }.summary { max-width:74ch; font-size:15.5px; }
  .scope { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px 26px; margin:11px 0 0; padding:0; list-style:none; }.scope li { position:relative; padding-left:14px; }.scope li::before { position:absolute; left:0; color:var(--accent); content:"-"; }
  .job { margin:16px 0 0; break-inside:avoid; }.job-head { display:flex; align-items:baseline; justify-content:space-between; gap:16px; flex-wrap:wrap; }.job-title { font-weight:700; }.organization { color:var(--muted); font-weight:500; }.dates { color:var(--muted); font-size:13px; font-variant-numeric:tabular-nums; white-space:nowrap; }.context { margin:2px 0 0; color:var(--muted); font-size:13.5px; }ul { margin:5px 0 0; padding-left:19px; }li { margin:3px 0; }
  .capabilities { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px 28px; margin-top:8px; }.capability { break-inside:avoid; }.capability h3 { margin:0 0 3px; font-size:14px; }.capability p { margin:0; color:var(--muted); font-size:13.5px; }
  .project { margin:7px 0; }.project strong { color:var(--ink); }.project span { color:var(--muted); }.details { display:grid; grid-template-columns:1fr 1fr; gap:8px 30px; }.details p { margin:0; }.label { color:var(--muted); font-weight:650; }
  footer { margin-top:28px; padding-top:11px; border-top:1px solid var(--rule); color:var(--faint); font:10px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace; }footer p { margin:.25em 0; }
  @media (max-width:620px) { .page { width:100%; margin:0; padding:28px 22px; border:0; box-shadow:none; } h1 { font-size:27px; }.scope,.capabilities,.details { grid-template-columns:1fr; } }
  @media print { @page { margin:14mm 15mm; } body { background:#fff; font-size:10.3pt; line-height:1.42; }.page { width:auto; margin:0; padding:0; border:0; box-shadow:none; }h1 { font-size:23pt; }h2 { margin-top:18px; break-after:avoid; }a { color:var(--ink); text-decoration:none; }.job,.capability { break-inside:avoid; }footer { font-size:7.5pt; } }
</style>
</head>
<body>
  <main class="page">
    <header>
      <h1>${escapeHtml(person.name)}</h1>
      <p class="role-title">${escapeHtml(title)}</p>
      <p class="contact">${contact}</p>
    </header>
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading">Profile</h2>
      <p class="summary">${escapeHtml(summary.text)}</p>
    </section>
    <section aria-labelledby="scope-heading">
      <h2 id="scope-heading">Fractional Scope</h2>
      <ul class="scope">${scopeHtml}</ul>
    </section>
    <section aria-labelledby="experience-heading">
      <h2 id="experience-heading">Selected Experience</h2>${experienceHtml}
    </section>
    <section aria-labelledby="capabilities-heading">
      <h2 id="capabilities-heading">Operating Capabilities</h2>
      <div class="capabilities">${capabilitiesHtml}</div>
    </section>
    <section aria-labelledby="stack-heading">
      <h2 id="stack-heading">Technical Stack</h2>
      <div class="capabilities">${technicalStackHtml}</div>
    </section>
    <section aria-labelledby="work-heading">
      <h2 id="work-heading">Selected Open Source</h2>${workHtml}
    </section>
    <section aria-labelledby="background-heading">
      <h2 id="background-heading">Background</h2>
      <div class="details">
        <p><span class="label">Education:</span> ${escapeHtml(education.join(" "))}</p>
        <p><span class="label">Languages:</span> ${escapeHtml(person.spoken_languages)}</p>
      </div>
    </section>
    <footer>
      <p>Artifact provenance: ${provenanceLine}.</p>
      <p>${sessionLine}.</p>
    </footer>
  </main>
</body>
</html>
`;
}

const { positional, flags } = parseArgs(process.argv.slice(2));
if (flags.help || positional.length !== 1) {
  console.log(usage());
  process.exit(flags.help ? 0 : 1);
}

const allowedFlags = new Set(["help", "focus", "exclude", "max-roles", "title", "summary", "out"]);
for (const key of Object.keys(flags)) {
  if (!allowedFlags.has(key)) throw new Error(`Unknown option: --${key}`);
}

const profileName = positional[0];
const [knowledgeBase, roleDossiers, technicalAssets, profile] = await Promise.all([
  readFile(kbPath, "utf8").then(JSON.parse),
  readFile(roleDossiersPath, "utf8").then(JSON.parse),
  readFile(technicalAssetsPath, "utf8").then(JSON.parse),
  readFile(path.join(profileDirectory, `${profileName}.json`), "utf8").then(JSON.parse)
]);

const focusTags = flags.focus === undefined ? profile.focus_tags ?? [] : csv(flags.focus);
const excludedTags = [...(profile.exclude_tags ?? []), ...csv(flags.exclude)];
const maxRoles = flags["max-roles"] === undefined ? profile.experience_ids.length : Number(flags["max-roles"]);
if (!Number.isInteger(maxRoles) || maxRoles < 1) throw new Error("--max-roles must be a positive integer");

const summaryId = flags.summary ?? profile.summary_id;
const summary = valueByIds(knowledgeBase.summaries, [summaryId], "summary")[0];
const scope = profileEvidence(valueByIds(knowledgeBase.scope_items, profile.scope_ids, "scope item"), focusTags, excludedTags);
const experience = valueByIds(knowledgeBase.experience, profile.experience_ids, "experience")
  .map((role) => ({
    ...role,
    bullets: profileEvidence(role.bullets, focusTags, excludedTags).slice(0, profile.max_bullets_per_role ?? 2)
  }))
  .filter((role) => role.bullets.length > 0)
  .slice(0, maxRoles);
const dossierByRoleId = new Map(roleDossiers.role_dossiers.map((dossier) => [dossier.role_id, dossier]));
for (const role of experience) {
  const dossier = dossierByRoleId.get(role.id);
  if (!dossier || !["allowed", "allowed-full-only"].includes(dossier.rendering_status)) {
    throw new Error(`Selected role has no CV-eligible dossier: ${role.id}`);
  }
  if (dossier.rendering_status === "allowed-full-only" && profileName.endsWith("-short")) {
    throw new Error(`Short profile cannot select full-only role: ${role.id}`);
  }
}
const capabilities = profileEvidence(valueByIds(knowledgeBase.capabilities, profile.capability_ids, "capability"), focusTags, excludedTags);
const technicalStack = profileEvidence(valueByIds(knowledgeBase.technical_stack, profile.technical_stack_ids, "technical-stack item"), focusTags, excludedTags);
const selectedWork = profileEvidence(valueByIds(knowledgeBase.selected_work, profile.selected_work_ids, "selected-work item"), focusTags, excludedTags);
const assetById = new Map(technicalAssets.assets.map((asset) => [asset.id, asset]));
for (const item of selectedWork) {
  if (!item.asset_id) continue;
  const asset = assetById.get(item.asset_id);
  if (!asset || !asset.cv_safe) throw new Error(`Selected work lacks a CV-safe technical asset: ${item.id}`);
}
for (const item of technicalStack) {
  for (const assetId of item.evidence_asset_ids ?? []) {
    const asset = assetById.get(assetId);
    if (!asset || !asset.cv_safe) throw new Error(`Technical stack item lacks a CV-safe asset: ${item.id}`);
  }
  for (const roleId of item.evidence_role_ids ?? []) {
    if (!dossierByRoleId.has(roleId)) throw new Error(`Technical stack item lacks a role dossier: ${item.id}`);
  }
}

if (scope.length === 0 || experience.length === 0 || capabilities.length === 0 || selectedWork.length === 0) {
  throw new Error("The selected focus/exclusion filter removed a required CV section. Broaden --focus or --exclude.");
}

const generatedAt = new Date().toISOString();
const provenance = {
  project_name: knowledgeBase.project,
  repo_path: root,
  git_remote: git(["remote", "get-url", "origin"]),
  git_branch: git(["branch", "--show-current"]),
  git_commit: git(["rev-parse", "HEAD"]),
  generated_at: generatedAt,
  generator: `Codex (GPT-5) via scripts/generate-cv.mjs (Node ${process.versions.node})`,
  session_source: "Codex API conversation",
  session_locator: process.env.CODEX_SESSION_LOCATOR ?? "/Users/uprootiny/.codex/sessions/ (2026-07-18 session)",
  profile: profileName,
  focus_tags: focusTags,
  exclude_tags: excludedTags,
  knowledge_base: path.relative(root, kbPath),
  role_dossiers: path.relative(root, roleDossiersPath),
  technical_assets: path.relative(root, technicalAssetsPath),
  source_profile: path.relative(root, path.join(profileDirectory, `${profileName}.json`))
};

const outputRelative = flags.out ?? profile.output;
if (!outputRelative || path.isAbsolute(outputRelative) || outputRelative.split(path.sep).includes("..")) {
  throw new Error("--out must be a repository-relative path");
}
const outputPath = path.join(root, outputRelative);
const provenancePath = outputPath.replace(/\.html$/, ".provenance.json");
if (provenancePath === outputPath) throw new Error("The output path must end in .html");

const document = renderDocument({
  person: knowledgeBase.person,
  title: flags.title ?? profile.label,
  summary,
  scope,
  experience,
  capabilities,
  technicalStack,
  selectedWork,
  education: knowledgeBase.education,
  provenance
});

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, document, "utf8");
await writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, "utf8");
console.log(`Generated ${path.relative(root, outputPath)}`);
console.log(`Generated ${path.relative(root, provenancePath)}`);
