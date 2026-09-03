# LaTeX CV

This directory is the canonical composition and rendering pipeline for the concise CV. The document is deliberately maintained as explicit LaTeX, not as an HTML export or a template-driven rewrite. `cv/knowledge-base.json`, `role-dossiers.json`, and `technical-assets.json` remain the factual evidence register; the CV selects only claims supported there.

## Render

```sh
make -C cv/latex
make -C cv/latex check
```

The default renderer is Tectonic, launched ephemerally through `nix run nixpkgs#tectonic`; no global TeX installation is required. To use an existing local Tectonic installation instead:

```sh
make -C cv/latex TECTONIC=tectonic
```

The pipeline produces:

- `output/pdf/Pavel_Vasilyev_Fractional_AI_Systems_CV.pdf`
- `cv/latex/provenance.json`
- `cv/latex/build-meta.tex` (generated build metadata consumed by the PDF footer)

`provenance.json` is regenerated on every build and records the repository, remote, branch, commit, timestamp, generator, session history locator, factual inputs, and renderer. Set `CODEX_SESSION_LOCATOR` when a more specific recoverable session path is available.

## Composition rules

- Keep the file to one page unless a concrete, relevant role needs its own evidence.
- Prefer demonstrated systems and responsibilities over capability labels.
- Do not turn an exploratory contract into a senior role or assert authority that is not recorded in `role-dossiers.json`.
- Keep private systems descriptively useful without implying that their source is public.
