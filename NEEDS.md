# NEEDS — marchdown.github.io

## What this repo IS (the settled north star)
A **personal-statement artpiece** that answers one question for a visitor:
*who is marchdown, and why & how would you collaborate with me?* It is the front door
that **props up [co-loop](https://github.com/marchdown/co-loop)** — the site says *who/why*,
co-loop is the *how* (fork the seed, run your agent, we loop).

The site's job is **grounding**: take sprawling creative energy and settle it into something
three readers can each stand on —
- a **state employment official** (plain-language: is this person employable, what support unlocks them),
- an **application reviewer** (legible proof, fast),
- a **potential collaborator** (the experience that makes them want to fork co-loop).

The medium *is* the message: the garden is sprawl; it must visibly **ground** into a clear,
professional statement. The same act marchdown does for a living (grounding machine output),
performed on his own creativity.

## Goals
- Keep the garden (`index.html`) as the expressive hero — but make it **ground** into a
  legible statement: who I am · what I do · why & how to collaborate (→ co-loop) ·
  selected real work · availability/contact · provenance.
- **Progressive disclosure / accessibility:** a plain, legible version must be one scroll
  (or one click) away and work without flying through a starfield — the official and ATS
  need the grounded text, the collaborator gets the experience. Both served.
- Professional self-presentation & "business attitude": reliable, reachable, clear offer.
- Reuse the spine + blocks from `~/career-prep/positioning-blocks.md` (one true story, many views).

## Blockers
- none

## Needs
- One structural decision: does the legible statement live as a calm section the garden
  **settles into** (same page), or as a **separate clean page** linked from the garden? (rec: settles-into)
- Owner's real `{{ }}` values eventually (name, location) — site can ship with tasteful defaults first.

## Notes
- Garden internals: seamless loop, rings recycle at alpha≈0; AUTO=0.05 → ~120s loop (pacing pass).
- Known rough edges: fruit tip-positions approximate; starfield speed tracks AUTO baseline not live scroll.
- Local preview: `ruby -run -e httpd . -p 8731` then http://localhost:8731/
- Root `index.html` (garden) not yet committed.

## CV status (2026-06-28)
- **Three complete, sendable editions** + a review index, all in `drafts/`:
  - `cv.html` — Edition A "Severe": single-col serif, monochrome, fine typography.
  - `cv-professional.html` — Edition B: two-col sans, slate accent, ML/data-science-forward.
  - `cv-plain.html` — Edition C: single-col, ATS-safe, plain-language (block C voice).
  - `cv-editions.html` — comparison index ("best for" per edition). **Review entry point.**
- Facts confirmed by owner + reconstructed from old CVs in iCloud
  (`~/Library/Mobile Documents/com~apple~CloudDocs/`, esp. *Vasilyev CV 11April2024 En.pdf*,
  *vasilyev cv 2022.pdf*, *Pavel_CV.pdf*) + signed Spring Research contract in `~/Documents/`.
- Roles (year-level; gaps handled honestly via spanning Independent-practice line + curated-highlights framing):
  Move38 LLM eng 2026 · Dissemblage.art 2024–25 · LevEhad CTO 2024 · Stamina AI 2023 ·
  Spring Research lead 2021–22 · Independent 2010–present · Earlier (DS/NLP) 2009–19.
- Education: MSc Comp Ling, RSUH Moscow 2015 · BSc Nuclear Physics, Czech Technical Univ Prague.
- **Private gap reasons (family/illness/adjustment/self-funded) stay OFF the CV** — owner's directive;
  reserved for cover letter / employment-official conversation (positioning block G).
- Owner reviews the three editions **tomorrow (2026-06-29) with a helper**.

## CV editions — now FIVE (committed)
- English: `cv.html` (severe), `cv-professional.html`, `cv-plain.html`.
- Hebrew (RTL, AI-drafted, flagged for native polish): `cv-he-professional.html`, `cv-he-plain.html`.
- Index: `cv-editions.html` (bilingual, "best for" per edition). **Review entry point.**
- Committed to `main` locally: 6b75e48 (English + garden) · 91d415d (Hebrew). BSc year = 2009 filled.

## Open items (CV)
- **Hebrew needs native review** by tomorrow's helper — fluency/idiom/term choices (e.g. פרומפטים vs הנחיות).
- Spring Research dates use 2021–22 (contract start = 1 Oct 2021; old CVs said 2020–22, contradicted) — confirm.
- Stale in old CVs, intentionally overridden: Tel Aviv→Jerusalem, marchdown@→uprootiny@gmail. Phone omitted (offer).
- **Remote unresolved:** origin = github.com/marchdown (account SUSPENDED per global policy). Nothing pushed.
  Decide: re-home to GitLab (active host) vs wait. Old populated site lives at ~/Documents/GitHub/marchdown.github.io (2018, stale).
- After review: promote the chosen edition(s) out of `drafts/` to the site proper (garden → grounds-into-CV).
_updated: 2026-06-28 · session: ~/.claude/projects/-Users-uprootiny-marchdown-github-io_
