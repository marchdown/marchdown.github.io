# co-loop — directions for human-directed agentic collaboration

Source: `/Users/uprootiny/co-loop` (4 commits, 11 files, branch checked out: `codex/first-plot`), read 2026-10-25.
Status of this document: a map, not a spec. Nothing here is built.

## What exists, what doesn't

| Piece | State |
|---|---|
| Rules: one plot per collaborator, append-only JOURNAL, branch per experiment, spec before code, provenance | written (README, PROTOCOL, AGENTS) |
| Interop toolchain: `co-loop` CLI, `state.json`, observatory (starfield) | spec only, no code |
| Cross-fork loop actually run | once: Codex claimed `plots/codex.md` (2026-07-29) and proposed a two-plot state fixture |
| Open seam: "challenge whether the fixture is enough" (Codex to marchdown) | **unanswered since 2026-07-29** |

The protocol's own roles are repo-shaped: Seed, Fork, Peer. **The human director appears nowhere.** Every
direction below is a way to put the human in the protocol as something enforceable, not implied.

## The levers a human directs with

Intent (what to do) · Gates (what needs a yes) · Attention (when to be interrupted) · Trust (whose output to
believe) · Pace and budget (how fast, how much) · Memory (what is learned from dead ends).

## Directions

| # | Direction | Lever | Smallest real version | Checkable by |
|---|---|---|---|---|
| A | **Directive and decision log.** Each plot carries `DIRECTIVE.md` (goal, done-state, non-goals). Human decisions are `#decision` journal lines. An agent's spec-before-code step must cite a directive line. | Intent, Gates | one directive file plus a pre-commit hook that rejects an agent commit whose message lacks a directive reference | the hook fails a commit without one |
| B | **Seam state machine with a named human at each exit.** open, claimed, proposed, accepted or rejected, where acceptance is a human's journal line, not an agent's. | Gates | the seam descriptor schema Codex already proposed, plus the state transitions | a seam cannot show "accepted" without a human-attributed line |
| C | **Attention-shaped digest.** `co-loop digest`: what changed since you last looked, ordered by cost of delay, with the default action if ignored. Plain text, diffable, before any UI. | Attention | fold JOURNAL and git history into a markdown digest | a stranger can act on the digest without opening the repo |
| D | **Quota-aware handoff.** An agent that hits a wall writes `#blocked reason=quota until=...`. A peer fork with quota claims the seam. The repo is the bus; JOURNAL's keep-both-sides rule absorbs races. | Pace, budget | one journal tag plus a claim rule | two forks, one blocked, one finishes the seam |
| E | **Trust ladder.** unverified, then agent-verified (tests, CI), then **human-used** (a person launched it and clicked through). Verifier PASS is not the top rung (AGENTS #10). | Trust | provenance trailer gains `verified-by` and `used-by` fields | the trailer reads differently for a human-used commit |
| F | **N=3 from one human.** The protocol says the starfield earns its keep at N>=3 forks. One person can run three agent-forks (Claude Code, Codex, a third, on different machines) and direct all of them. That is the realistic first population. | Population | two-plot fixture first (Codex's proposal), then a third | three plots with real journal lines and one merged seam |
| G | **Dead ends as data.** Codex's plot has a "blind alleys" section that is better evidence than its results. Make it a `#dead-end` tag with reason and evidence, searchable by the next agent and human. | Memory | a tag convention and a grep | the next agent skips a recorded dead end |
| H | **Directing surface.** A thin PWA (pocket already has the pipeline) or the cockpit app that renders the digest and writes approve, reject, redirect as commits. | Attention, Gates | read-only digest page first | approve on the phone produces a commit |
| I | **Measure it.** Interruptions per accepted seam, time to decision, rework rate, abandoned seams. Decide the sensor before building, as with any prompt change: a hypothesis, not a fix. | all | a results table from the first real runs | the numbers exist and the sensor was fixed first |

## Honest limits (from the repo itself)

- Two-person loop is overkill; plain git is enough. Hence F.
- Eventually consistent: a peer sees a claim only after `git fetch`. D and B inherit this.
- The `magnitude` metric must track accountable significance, not commit volume, or the observatory lies. I
  inherits that: pick honest metrics.
- The first "peer" is another agent of the same human. Cross-human collaboration is untested.

## Suggested order (default, change freely)

1. **Close the open loop:** answer Codex's seam and run the two-plot fixture (F). Cheapest real test, waiting since July.
2. **A plus B:** put the human in the protocol, enforced by a hook, before building any viewer.
3. **C:** the digest, as plain text.
4. **D:** quota-aware handoff. This is where mu-harness (attention, wall-climbing, pacing) and co-loop meet.
5. Defer the observatory (H and the starfield) until `state.json` has real data from steps 1-4.

_created: 2026-10-25 · session: Claude Code job 5c74fffd · repo read: /Users/uprootiny/co-loop @ 1f5b9b9_
