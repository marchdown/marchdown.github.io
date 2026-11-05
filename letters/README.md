# Letters, not CVs

A CV says *here is what I am*. A letter says *here is what I saw, and here is what I would
do about it*. The second is what gets a reply, and it is the only form of outreach the owner
is willing to send. This directory holds the letters, one file per target, plus the one
reusable piece (`BRIEF.md`).

The July 2026 attempt (`../TIER1_EMAILS_READY.md`) is the counter-example, kept as evidence:
five emails to Wiz, Cybereason, monday.com, JFrog and Varonis that assert a funding stage,
recite "most teams at your stage", and contain nothing that proves anyone looked at the
company. monday.com was already public; Wiz had been acquired. The template produced the
specificity of a horoscope. Nothing in this directory may be written that way.

## The shape

Six moves, in this order. Each is one short paragraph; the whole letter fits on one screen.

1. **I see you.** One or two sentences naming something specific and true about what they
   built, are building, or are struggling with. An observation a competent outsider would
   make after an hour of looking, not a compliment. It must trace to an artifact: a page,
   a post, a repo, a changelog, a job ad, a talk.
2. **Why I am writing.** Plain. "I am looking for paid work. I have done AI work since
   before it was cool. I think I would be useful to you in particular, and you cannot know
   that without a conversation."
3. **How I would approach your thing.** Two or three concrete first moves, in their
   vocabulary, in the order I would actually do them. This should read like the first ten
   minutes of a consultation, given away.
4. **Where you are exposed, where there is room.** One vulnerability and one potential,
   each stated as a hypothesis to check together, not a verdict. This paragraph earns the
   call. It is also the one most likely to be wrong, so it must be phrased so that being
   wrong costs nothing.
5. **The brief.** Three or four lines of what I have been doing, with one or two links.
   Pulled from `BRIEF.md`, trimmed to what this reader cares about. Never the whole CV.
6. **The ask.** A call or a coffee, with a concrete window. Name the menu once: hire me,
   buy a scoped piece of work, or put me on a retainer. Then stop.

## Rules

- **Every claim about them cites its source.** The letter file carries a `## Evidence`
  section listing each URL or document consulted and what it showed. If a sentence in the
  letter cannot be traced to a line in Evidence, cut the sentence.
- **No invented facts.** No funding stage, headcount, revenue, or "pattern I see" unless it
  was read somewhere and cited. "Probably" and "I would guess" are allowed only inside move 4,
  and only once or twice.
- **Every claim about me comes from `../cv/knowledge-base.json`** or `BRIEF.md`. The CV
  compiler already refuses unverified roles; the letters inherit that discipline.
- **No letter without an observation.** If an hour of looking yields nothing specific to say,
  there is no letter. Move on to the next target.
- **One letter costs about an hour.** That is the price and also the whole value. A target
  that is not worth an hour is not worth a letter.
- **Private repos stay private.** Link only what is public (`github.com/marchdown`,
  `co-loop`, `hyperstitious.org`). Private Elixir work is named, not linked, with an offer to
  walk through it on the call.

## Workflow

1. `tools/job-sift` surfaces candidates from RemoteOK and HN "Who is hiring" (reports land in
   `output/job-sift/`). Pick by fit, not by score; the score is a filter.
2. Look for an hour. Site, "how it works", about page, job ads past and present (HN Algolia
   keeps deleted ones: `hn.algolia.com/api/v1/search?query=<company>&tags=comment`),
   public repos, changelog, founder posts. Write the `## Evidence` section first.
3. Write the six moves against the evidence.
4. Fill `## Before sending`: address verified, role still open, claims re-read against
   Evidence, tone check (would I be glad to receive this?).
5. The owner sends. Nothing here sends itself. Log the send date and any reply at the bottom
   of the letter file.

## Files

- `BRIEF.md`: the reusable "what I have been doing" paragraph, in three lengths.
- `YYYY-MM-DD-<target>.md`: one letter, its evidence, its send checklist, its outcome.
