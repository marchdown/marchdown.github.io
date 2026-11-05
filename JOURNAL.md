# JOURNAL — marchdown.github.io

Newest first.

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
