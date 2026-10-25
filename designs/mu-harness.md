# mu-harness — design sheet

**Status: DESIGN. Nothing built.** Not CV material until a first commit exists (see "Evidence ledger").
Name is a placeholder (mu / phi / chi — pick one, then rename this file). Fill the `TODO` fields; delete
this banner when the first commit lands.

## One sentence

A harness for LLM agents that respects the human's attention, keeps pushing when it hits a wall, and
spreads work over time so tasks finish even when token quotas run out.

## The three ideas (as stated by the owner, 2026-10-25)

1. **Attention-shaping.** "A harness that values your attention spans and shapes."
2. **Wall-climbing.** "A harness that runs into a wall but keeps going up the wall to deliver."
3. **Pacing.** "A harness that paces your tasks over time so they do get fulfilled, token quotas notwithstanding."

## Problem, in the user's terms

TODO — what is it like today? (an agent run stalls, a quota dies at 3am, a notification interrupts at the
wrong moment, a task is half-done and nobody knows)

## Done state (concrete, testable)

TODO — one sentence each; each must be checkable by a command, a click, or a fresh request.

- Attention: TODO (e.g. "the human is interrupted at most N times per task; each interruption states the
  decision needed and the default taken if ignored")
- Wall-climbing: TODO (e.g. "on provider error, quota exhaustion, or a failed check, the run changes tactic
  X→Y→Z before reporting failure; every retreat is logged with its reason")
- Pacing: TODO (e.g. "a queue of N tasks with a quota of Q tokens/day finishes by day D, with a
  published schedule that updates as usage drifts")

## Non-goals

TODO

## Components

| Part | Job | Inputs | Outputs | Exists? |
|---|---|---|---|---|
| Attention shaper | decide when/what to surface to the human | TODO | TODO | no |
| Wall-climber | escalate tactics on failure: retry, reroute provider, shrink task, change model | TODO | TODO | no |
| Pacer | schedule tasks against quota windows and budgets | TODO | TODO | no |
| Ledger | record every decision, spend, retreat | TODO | TODO | no |

## Interfaces and boundaries

`TODO` — what talks to what; what must never be conflated (planner ≠ executor ≠ ledger).

## Measurement (how we will know it works)

TODO — decide the sensor before building. Prior art in this repo family: a probe-suite eval sensor with
per-run pass/fail, cost, and wall time (pi-harness `eval/`). Reuse the pattern only after deciding which
predicates are mechanical versus regex-flaky; do not loosen the sensor mid-experiment.

## Open questions

- TODO — attention: what counts as "an attention span" operationally (time since last interaction? task
  depth? user-declared focus windows)?
- TODO — wall-climbing: where is the line between persistence and thrashing (retry ceilings, cost caps)?
- TODO — pacing: which quota sources are knowable (provider headers, local counters, billing API)?

## Evidence ledger (what a CV may say)

| Claim | Evidence | Status |
|---|---|---|
| Design exists | this file | yes |
| Prototype runs | TODO commit | no |
| Measured behavior | TODO results file | no |

Rule: a CV line needs a row marked "yes" with a commit or results file a stranger can be shown.

_created: 2026-10-25 · session: Claude Code job 5c74fffd (CV work, branch worktree-cv-salestech-ai)_
