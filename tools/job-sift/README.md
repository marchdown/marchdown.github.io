# job-sift

Pulls live listings off RemoteOK and the current month's HN "Who is hiring?"
thread, scores each one against a real skill profile, and prints the ones
worth a look. No cache, no daemon — it hits both sources fresh every run.

Built to reframe "job hunting" as "sourcing contracts worth taking on":
this is the sourcing half of that.

## Run

```
cargo run --release
```

Writes a full ranked report to `../../output/job-sift/report-<unix>.json`
alongside the printed top 15. Exits non-zero only if *both* sources fail —
a single source failing is reported loudly on stderr but doesn't stop the
other from running.

## Scoring

`SKILL_PROFILE` and `WORK_MODE_BONUS` in `src/main.rs` are weighted keyword
lists grounded in `cv/knowledge-base.json` (tier 3 = current focus, tier 2 =
deep prior background, tier 1 = adjacent). Single-word keywords match whole
words only — plain substring search on short tokens like `cto`, `rust`,
`api`, `aws` produces false positives (`cto` inside "contractor", `rust`
inside "trust"/"frustrate", `api` inside "escapism"). Multi-word phrases
still match as substrings since that collision risk doesn't apply.
