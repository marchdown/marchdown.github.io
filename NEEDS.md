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
- **Donation addresses** for the gallery unfold and gallery.html: which chains, which addresses.
  `site.js` → `donations`; empty addresses render as "address pending" (visible, not silent).
- **Name forms**: confirm the Hebrew spelling in `site.js` (`פבל וסילייב`, owner's own) and whether
  the landing should drift through all three scripts (current) or sit on one (`nameCycle: ['en']`).
- **hyperstitious.org is a 404** (empty GitHub Pages site, checked 2026-11-06) while
  **hyperstitious.art is live**. `cv/knowledge-base.json` and the CV editions link the dead one.
  Fix the knowledge base (person.contact.website) or revive the .org.
- Status of the extra live pieces not yet listed (verse-garden, profane, hyle, ruby, hermesbase,
  doctrine): included only the ones whose own page presents finished work. Say which others belong.
- **Which email the CV carries**: `cv/knowledge-base.json` (from the cv-salestech-ai branch) says
  `marchdown@gmail.com`; `site.js` says `uprootiny@gmail.com` (owner, 2026-11-06). `cv.html` follows
  `site.js`. Settle the knowledge base either way.
- **Review `cv.html`** (the one canonical CV, 2026-11-06) and say what is wrong or missing; the
  thirteen older editions in `drafts/` stay reachable from its footer until retired.
- **Make a harness public** so the tools page and CV can link one: pi-harness or pi-doctrine are
  the natural candidates (checked 2026-11-06: every harness repo is private or has no remote;
  api.hyle.lol times out; hyle.lol is a Pages 404). Until then they are named, not linked.
- **hyle.lol**: decide whether to bring the proxy host back or retire the "live, 99.5 % uptime"
  claim in `~/api-hyle-lol/README.md`; the tools page says "offline".

## Resolved
- Structure (2026-11-06): the landing stays the artpiece; the legible pages are separate and reached
  from the band at the bottom: gallery · tools · name · hire me (→ cv, letter, contacts).

## Notes
- Landing (`index.html`, 2026-11-05): seeded hypergraph on an 8 s phase clock, seamless by
  construction (`render(0)` ≡ `render(2π)`); motion budget and seam check in `JOURNAL.md`.
  Not yet checked on a phone or on the live Pages host.
- Identity lives in `site.js` only (name in three scripts, email, telegram, links, donations);
  every page fills `data-site` slots from it. A legal name change is a one-line edit there.
- `projects.json` is the single source for gallery.html and tools.html (`feed.js` renders it;
  `era: earlier` folds up at the end). Only reachable, finished work goes in.
- Local preview: `ruby -run -e httpd . -p 8731` then http://localhost:8731/

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
- Spring Research dates = **2020–2022** (owner started May 2020; contract signed late, Oct 2021 — a red herring). Resolved.
- Stale in old CVs, intentionally overridden: Tel Aviv→Jerusalem, marchdown@→uprootiny@gmail. Phone omitted (offer).
- **Remote unresolved:** origin = github.com/marchdown (account SUSPENDED per global policy). Nothing pushed.
  Decide: re-home to GitLab (active host) vs wait. Old populated site lives at ~/Documents/GitHub/marchdown.github.io (2018, stale).
- After review: promote the chosen edition(s) out of `drafts/` to the site proper (garden → grounds-into-CV).
_updated: 2026-06-28 · session: ~/.claude/projects/-Users-uprootiny-marchdown-github-io_
