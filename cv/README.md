# CV Compiler

`knowledge-base.json` is the factual source for all generated CVs. It stores each claim at the smallest useful unit: summary, experience bullet, capability, or project. Facts carry tags for selection and, where useful, local evidence references.

`role-dossiers.json` is the companion control layer. For every renderable role it records the formal title, engagement type, responsibilities, functional versus formal authority, relevant credentials, evidence, limitations, and open questions. The generator rejects a selected role that lacks a CV-eligible dossier. Unresolved recollections are retained separately and never render.

`technical-assets.json` is the code-evidence register. Each CV-safe project records its demonstrated capabilities, stack, repository path, remote, branch, commit, and evidence files. The generator rejects a selected project without a CV-safe asset record.

Profiles in `profiles/` define a market-facing edition without duplicating the source facts. A profile chooses a title, summary, sections, curated role order, focus tags, exclusions, and output location.

## Generate

```sh
node scripts/generate-cv.mjs fractional-ai-systems
node scripts/generate-cv.mjs fractional-ai-systems-short
```

The command writes both the HTML CV and its adjacent `.provenance.json` record. The HTML also exposes repository, revision, generator, and session provenance in its footer.

`fractional-ai-systems` is the fuller selected-history edition. `fractional-ai-systems-short` is the first-contact edition: two roles, one proof point each, and two relevant repositories.

## Parametric Changes

```sh
# Bias the same profile toward LLM systems and repository ownership.
node scripts/generate-cv.mjs fractional-ai-systems --focus=llm,repos,infrastructure

# Produce a shorter first-contact version.
node scripts/generate-cv.mjs fractional-ai-systems --max-roles=4 --out=drafts/cv-fractional-short.html

# Try a different market-facing title without changing factual data.
node scripts/generate-cv.mjs fractional-ai-systems \
  --title="Principal LLM Systems Engineer" \
  --out=drafts/cv-principal-llm.html
```

`--focus` filters tagged supporting evidence inside the selected profile. It is deliberately conservative: if it would remove an essential section, generation fails rather than producing a misleading or incomplete CV.

## Adding Facts

Add a new item to the appropriate `knowledge-base.json` collection, giving it:

- a stable `id`
- concise text grounded in evidence
- useful `tags`
- evidence paths for claims that may need review

Then add its ID to a profile, or create a new profile. Do not edit generated files directly; regenerate after changing the knowledge base or profile.
