# JOURNAL — marchdown.github.io

Newest first.

## 2026-11-06 — The working note, and two repos made public

**Ask (owner):** "i kinda like the CV we worked out sitting with a colleague
`~/Downloads/landing/index.html` but oh please *rephrase it* so it reads better and use at
least two examples from our latest projects and make them into proper repos and publish on
github".

**The page:** "Oracles for AI Systems", a typeset working note (position, retainer offer,
calibration bench, booking widget on a Cloudflare worker, record of roles). Now
`oracles.html` here, with `worker/` beside it. Rephrased sentence by sentence without
changing structure or voice; a 2026 Move38 row added to the record from the knowledge
base; Telegram and email now come from `site.js`; WhatsApp, LinkedIn and the booking
endpoint stay empty until supplied (the page hides what it lacks). Its facts disagree with
`cv/knowledge-base.json` in three places; both versions stand and NEEDS.md names them.

**Which projects:** an audit agent checked tidy-harness, api-hyle-lol, free-llm-harness
and pi-harness for secrets, private data, licence, tests and claims. Chosen: tidy-harness
(Swift verifier for agent behaviour) and free-llm-harness (Python reliability harness).
Rejected: api-hyle-lol, because a real OpenRouter key is committed in its history (the
key must be revoked and the history rewritten before any public remote; the README's
"deployed, 99.5 % uptime" is also unverifiable); pi-harness, because it is custody of one
Mac's agent install with fleet hostnames in its notes.

**tidy-harness** (`github.com/marchdown/tidy-harness`, full history, v0.1.0): the reference
scorecard threw on a tested claim with no mutation; now it reports false, as the Swift
core does. The catalog and conformance checks skip loudly without their local inputs and
`check.sh` ends with `GREEN WITH SKIPS` naming them. MIT licence, README without private
project names, Actions running `check.sh`. With the real inputs: 21 tests, 11 probes
agreed, Swift and Babashka agree exactly on 151 sessions, `ALL GREEN`.

**free-llm-harness** (`github.com/marchdown/free-llm-harness`, fresh history, v0.1.0): home
paths replaced by `~` expansion, two docs listing private project paths removed, local
run dirs ignored, MIT licence, pytest workflow. Published from an orphan branch so the
GitLab history (which carries those paths) stays private; the code is the same.

**Verified from outside:** fresh clones of both in a temp dir with a fake `HOME`:
tidy-harness `GREEN WITH SKIPS (5b3046a): skipped catalog conformance`; free-llm-harness
`5 passed`; no tracked file in either contains a home path or a key-shaped string.
GitHub Actions green on `main` and on the tag for both.

**Linked:** oracles.html §3.2 opens with the two as worked examples of oracles; tools.html
entries now link them; cv.html swaps the private pi-harness line for tidy-harness and links
the Python part of the harness work.

## 2026-11-06 — Iteration: phone, thumbnails, the harnesses

**Ask (owner):** "iterate", then "we have better harnesses. we have the harnesses [that
should be] at hyle.lol and our opencode and pi and hermes configuration repos and
wisdom.md and so, so much more".

**Phone (emulated with 390 px same-origin iframes; Chrome would not shrink the window):**
gallery, CV and letter collapse cleanly; the landing band orphaned "hire me" on a second
line. Fixed: under 640 px the name takes its own line above the three words.

**Thumbnails:** the gallery was text-only. Headless Chrome captured all nineteen live
pages (`thumbs/`, 640 px JPEGs, ~500 KB total). The extension route failed twice (blocked
on arcana.dissemblage.art, then a frozen renderer), and the first headless pass rendered
Enfilade as a grey slab (WebGL under software GL); a second pass with
`--use-angle=metal` fixed it. `feed.js` renders a thumb on the right at desktop width,
above the text on phones.

**The harnesses:** a search agent inventoried pi-harness, pi-doctrine, pi-agent-config,
hermesbase, the Hermes and opencode configurations, api-hyle-lol, hyle-api,
tidy-harness, free-llm-harness, and the doctrine files. Findings that shape the page:
every one is private or has no remote; api.hyle.lol times out and hyle.lol is a GitHub
Pages 404 despite the proxy README's "deployed, 99.5 % uptime"; hermesbase's own README
says there is no application in it yet; Hermes and opencode are configurations of other
people's agents. So `tools.html` now carries six named, unlinked entries near the top
(pi-harness, tidy-harness, free-llm-harness, api.hyle.lol as *offline*, the doctrine,
agent configurations) with wording that matches each repo's own claims, and `cv.html`
gains a pi-harness line without the n=3 numbers (kept out since commit 5821af3).
Nothing links anywhere until something is made public.

**Verified:** no console errors on gallery or tools; CV re-printed to one page (it
spilled to two with the new line; trimmed a sentence that repeated the lede and a few
points of print spacing).

## 2026-11-06 — The CV, redone

**Ask (owner):** "the cvs themselves, redo them again, you could do much better than
what's already in there."

**What was there:** thirteen editions in `drafts/` (severe, professional, plain,
Hebrew, magazine, academic, fractional, two targeted one-pagers from the
`cv-salestech-ai` branch, merged here as abbe6f0) plus a Node generator over
`cv/knowledge-base.json`. The generated ones are factual but read as lists of nouns:
"Tool calling, provider routing and fallback, quota and rate-limit handling…"; the
measured results sit at the bottom under Selected Work; the contact block links
hyperstitious.org (404) or marchdown.hyperstitious.org (timeout).

**Decision:** one canonical `cv.html` at the root, hand-authored, evidence first.
Lede states the offer in one breath. Then "Recent work, with what it showed": six items,
each with the claim, the measured result where one exists (88 requests, 100 % / 83 %,
p95 6.4 s), and an italic one-line takeaway. Then roles, newest first, one paragraph
each. Then stack, education, languages in a two-column block. Paper on screen, A4 in
print, name and contacts from `site.js` so the legal name change touches one file.
Facts are transcribed from `cv/knowledge-base.json`; nothing new was claimed.
pi-harness numbers stay out (commit 5821af3 removed them on purpose); topo-sonify is
labelled a research prototype that stopped after the WASM build (owner's status).

**Verified:** renders in Chrome with no console errors; headless Chrome prints it to
one A4 page (`cv.pdf`, checked by page count after three rounds of print-CSS
tightening: 2 → 2 → 1). Mobile layout collapses to one column (CSS only; not viewed
on a phone).

**Left as is:** `drafts/` and its editions index, linked from the CV footer as "older
editions". The Node generator still exists; `cv.html` does not use it.

**Open:** the CV branch's knowledge base says `marchdown@gmail.com`; the owner gave
`uprootiny@gmail.com` today and `site.js` uses that. Decide which the CV carries.

## 2026-11-06 — The band, the gallery, the tools, the letter

**Ask (owner, in pieces across the session):** the landing band becomes
`[gallery] [tools] · name · [hire me]`; gallery and tools are scroll-fed lists of the
better-baked projects, AI-era work prominent and older work folded; `hire me` unfolds
into `cv`, a letter-style "hire me to tune AI for you" page (rephrased from the owner's
own paragraph), and contacts; `gallery` unfolds into donation addresses; the name is a
placeholder in one place, in Latin, Cyrillic and Hebrew, easy to replace before a legal
name change; and the landing geometry gets slightly Lovecraftian, "weird things you
can't quite point out".

**Sources, verified live 2026-11-06:** dissemblage.art (the vitrine, ten pieces on
subdomains, all 200), hyperstitious.art (studio index, 200), umbra/pocket/ledger/lab
(200), GitHub and GitLab public listings. hyperstitious.org is a GitHub Pages 404 even
though the CVs link it; flagged in NEEDS.md. Excluded on purpose: topo-sonify (owner
calls it abandoned early; see memory), profane (its own page says "first commit
pending"), hermesbase ("not a running agent system yet"), verse-garden and hyle (pages
say too little to vouch for), ruby and doctrine (not portfolio-shaped).

**Shape:** `site.js` (identity + donations, fills `data-site` slots), `site.css`,
`projects.json` + `feed.js` (batches of three on an IntersectionObserver; an `earlier`
era folds into `<details>` at the end; an empty donation address renders "pending"),
`gallery.html`, `tools.html`, `hire.html`. The letter follows the six moves of the
letters genre (`letters/README.md` on the letters-not-cvs branch) with the
target-specific moves left open and the owner's brief paragraph as "the brief".

**Wrongness budget on the landing** (all on the 8 s clock, loop still pixel-exact):
10 % of nodes take the camera sway with the opposite sign; 6 % breathe against the rest;
5 % are absent for about a third of the loop (their filaments go to half); one node is
violet; 12 % of filaments stop 1–5 px short of their node; and the whole projection
rides a 2 px ripple at harmonic 1.

**Verified (Chrome, local server):** no console errors on any page; seam check still 0
differing channels; 1.5 ms per frame; both unfolds open one at a time; gallery renders
all 11 then its end note; tools renders 13 then "earlier work · 4" then its end note.
One bug found and fixed on the way: the sentinel stayed in view after a batch so the
observer never re-fired; now it re-observes after each batch.

**Not verified:** phone layout; the live Pages host; clipboard copy of a real address
(no addresses yet).

## 2026-11-05 — Landing background: seamless 8-second cinematic loop

**Ask (owner):** slow, continuous, seamless cinematic motion; structures breathe
and evolve; fine particles drift; luminous filaments pulse; light travels
across surfaces; camera movement almost imperceptible; no abrupt transitions,
no fast movement, no dramatic rotations; perfect 8-second loop; preserve
composition and negative space.

**Before:** `index.html` tumbled a 40-node random hypergraph through full
rotations on three axes at ~0.3–0.5 rad per second of `time`, with a fresh
random layout on every load. Fast, dramatic, never looping.

**Decision:** make seamlessness structural rather than tuned. One phase clock
φ = 2π·(t mod 8 s)/8 s drives everything, and every oscillation is an integer
harmonic of φ, so `render(φ)` is exactly periodic. Layout comes from a seeded
RNG (mulberry32) so the composition is identical on every load.

Motion budget per 8 s loop, all in the unit frame (min of viewport w, h):
- camera: yaw ±1.5°, pitch ±1°, dolly ±1 %, one cycle
- structure: breathes ±2 %, one cycle; per-node Lissajous drift ≤1.4 %
- filaments: alpha pulse at harmonic 1 or 2; half of them carry a soft light
  that runs end to end once or twice per loop and enters/leaves past the ends
  so it never pops
- nodes: own glow pulse plus a broad plane-wave light band crossing once
- dust: 170 motes, each fades in, drifts ≤4.5 % of the frame, fades out and
  resets while invisible
- the structure is centred slightly above the middle so the name/link band
  stays empty

Also: DPR-correct canvas, time-based clock (8 s at any refresh rate), and a
single still frame under `prefers-reduced-motion`.

**Verified (Chrome, local server, 1710×981 CSS px at DPR 2):**
- seam: `render(0)` vs `render(2π)` differ in 0 of 26.8 M channels;
  `render(π)` differs in 4.6 M, so the loop moves and closes exactly
- cost: 0.46 ms per frame
- no console errors; UI band clear of the structure

Seam check, from the page console:

    const c = canvas, x = c.getContext('2d');
    const grab = p => { __loop.render(p); return x.getImageData(0,0,c.width,c.height).data; };
    const a = grab(0), b = grab(__loop.TAU); let d = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; d  // expect 0

**Not verified:** how it reads on a phone, and on the live GitHub Pages host.

Session: `~/.claude/projects/-Users-uprootiny-marchdown-github-io`, job 0e536177.
