//! job-sift: pulls live listings off public job boards, scores them against
//! a real skill profile, and surfaces the ones actually worth a look.
//!
//! Sources are fetched live on every run (no cache, no daemon) — this is a
//! demand-driven CLI, not a background poller.

use serde_json::Value;
use std::collections::HashSet;
use std::fmt::Write as _;
use std::time::{SystemTime, UNIX_EPOCH};

const USER_AGENT: &str = "job-sift/0.1 (personal use; contact: uprootiny@gmail.com)";

/// (keyword, weight) — grounded in cv/knowledge-base.json: tier 3 is current
/// focus, tier 2 is deep prior background, tier 1 is adjacent/general.
const SKILL_PROFILE: &[(&str, i32)] = &[
    // tier 3 — current focus
    ("llm", 3),
    ("large language model", 3),
    ("prompt", 3),
    ("elixir", 3),
    ("phoenix", 3),
    ("rust", 3),
    ("nix", 3),
    ("fractional", 3),
    ("cto", 3),
    ("developer tooling", 3),
    ("devtools", 3),
    ("repository", 2),
    ("agent", 2),
    // tier 2 — deep prior background
    ("nlp", 2),
    ("machine learning", 2),
    ("swift", 2),
    ("macos", 2),
    ("infrastructure", 2),
    ("cloud", 2),
    ("aws", 2),
    ("gcp", 2),
    ("verification", 2),
    ("formal methods", 2),
    ("testing", 2),
    ("quantitative", 2),
    ("financial", 2),
    ("data science", 2),
    ("research", 2),
    // tier 1 — adjacent / general
    ("api", 1),
    ("backend", 1),
    ("consulting", 1),
    ("advisory", 1),
    ("open source", 1),
    ("linguistics", 1),
    ("signal processing", 1),
    ("audio", 1),
];

/// Independent-practice fit — how the work is shaped, not what it's about.
const WORK_MODE_BONUS: &[(&str, i32)] = &[
    ("fractional", 2),
    ("contract", 2),
    ("contractor", 2),
    ("freelance", 2),
    ("remote", 2),
    ("part-time", 2),
    ("part time", 2),
    ("consult", 1),
    ("advisory", 1),
];

#[derive(Debug, Clone)]
struct Listing {
    source: &'static str,
    title: String,
    company: Option<String>,
    url: String,
    score: i32,
    matched: Vec<&'static str>,
}

#[derive(Debug, Default)]
struct SourceStatus {
    name: &'static str,
    ok: bool,
    detail: String,
    count: usize,
}

/// Single-word keywords (e.g. "cto", "rust", "api", "aws") are matched
/// against whole words only — plain substring search on short tokens
/// produces real false positives ("cto" inside "contractor"/"director",
/// "rust" inside "trust"/"frustrate", "api" inside "escapism"/"rapid").
/// Multi-word phrases ("large language model", "formal methods") don't
/// have that collision risk, so those still match as substrings.
fn score_text(text: &str) -> (i32, Vec<&'static str>) {
    let lower = text.to_lowercase().replace('-', " ");
    let words: HashSet<&str> = lower
        .split(|c: char| !c.is_ascii_alphanumeric())
        .filter(|w| !w.is_empty())
        .collect();

    let mut score = 0;
    let mut matched = Vec::new();
    let mut check = |kw: &'static str, weight: i32| {
        let hit = if kw.contains(' ') {
            lower.contains(kw)
        } else {
            words.contains(kw)
        };
        if hit {
            score += weight;
            matched.push(kw);
        }
    };
    for (kw, weight) in SKILL_PROFILE {
        check(kw, *weight);
    }
    for (kw, weight) in WORK_MODE_BONUS {
        check(kw, *weight);
    }
    (score, matched)
}

fn strip_html(input: &str) -> String {
    let mut out = String::with_capacity(input.len());
    let mut in_tag = false;
    for c in input.chars() {
        match c {
            '<' => in_tag = true,
            '>' => in_tag = false,
            _ if !in_tag => out.push(c),
            _ => {}
        }
    }
    out.replace("&#x2F;", "/")
        .replace("&#x27;", "'")
        .replace("&quot;", "\"")
        .replace("&amp;", "&")
        .replace("&gt;", ">")
        .replace("&lt;", "<")
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
}

fn fetch_remoteok() -> Result<(Vec<Listing>, SourceStatus), String> {
    let body: Value = ureq::get("https://remoteok.com/api")
        .set("User-Agent", USER_AGENT)
        .call()
        .map_err(|e| format!("request failed: {e}"))?
        .into_json()
        .map_err(|e| format!("bad json: {e}"))?;

    let arr = body.as_array().ok_or("expected top-level JSON array")?;
    let mut listings = Vec::new();

    for job in arr.iter().skip(1) {
        // element 0 is RemoteOK's legal/meta blob, not a job
        let position = job.get("position").and_then(Value::as_str).unwrap_or("");
        if position.is_empty() {
            continue;
        }
        let company = job.get("company").and_then(Value::as_str).unwrap_or("");
        let url = job.get("url").and_then(Value::as_str).unwrap_or("");
        let description = job.get("description").and_then(Value::as_str).unwrap_or("");
        let tags = job
            .get("tags")
            .and_then(Value::as_array)
            .map(|t| {
                t.iter()
                    .filter_map(Value::as_str)
                    .collect::<Vec<_>>()
                    .join(" ")
            })
            .unwrap_or_default();

        let combined = format!("{position} {company} {tags} {description}");
        let (score, matched) = score_text(&combined);
        if score == 0 {
            continue;
        }
        listings.push(Listing {
            source: "remoteok",
            title: position.to_string(),
            company: Some(company.to_string()),
            url: if url.is_empty() {
                "https://remoteok.com".to_string()
            } else {
                url.to_string()
            },
            score,
            matched,
        });
    }

    let status = SourceStatus {
        name: "remoteok",
        ok: true,
        detail: format!("{} listings scanned, {} matched", arr.len().saturating_sub(1), listings.len()),
        count: listings.len(),
    };
    Ok((listings, status))
}

fn fetch_hn_whos_hiring() -> Result<(Vec<Listing>, SourceStatus), String> {
    // search_by_date, not search: the relevance-ranked endpoint can surface
    // an old, heavily-commented thread instead of the current month's.
    let search: Value = ureq::get("https://hn.algolia.com/api/v1/search_by_date")
        .query("query", "Who is hiring")
        .query("tags", "story")
        .query("hitsPerPage", "10")
        .set("User-Agent", USER_AGENT)
        .call()
        .map_err(|e| format!("thread lookup failed: {e}"))?
        .into_json()
        .map_err(|e| format!("bad json: {e}"))?;

    let hits = search
        .get("hits")
        .and_then(Value::as_array)
        .ok_or("no hits array in HN search response")?;

    let thread = hits
        .iter()
        .filter(|h| {
            h.get("title")
                .and_then(Value::as_str)
                .map(|t| t.to_lowercase().starts_with("ask hn: who is hiring"))
                .unwrap_or(false)
        })
        .max_by_key(|h| h.get("created_at_i").and_then(Value::as_i64).unwrap_or(0))
        .ok_or("no 'Ask HN: Who is hiring?' thread found in results")?;

    let story_id = thread
        .get("objectID")
        .and_then(Value::as_str)
        .ok_or("thread had no objectID")?;
    let thread_title = thread.get("title").and_then(Value::as_str).unwrap_or("?");

    let comments: Value = ureq::get("https://hn.algolia.com/api/v1/search")
        .query("tags", &format!("comment,story_{story_id}"))
        .query("hitsPerPage", "300")
        .set("User-Agent", USER_AGENT)
        .call()
        .map_err(|e| format!("comment fetch failed: {e}"))?
        .into_json()
        .map_err(|e| format!("bad json: {e}"))?;

    let comment_hits = comments
        .get("hits")
        .and_then(Value::as_array)
        .ok_or("no hits array in HN comments response")?;

    let mut listings = Vec::new();
    for c in comment_hits {
        let raw = c.get("comment_text").and_then(Value::as_str).unwrap_or("");
        if raw.is_empty() {
            continue;
        }
        let clean = strip_html(raw);
        let (score, matched) = score_text(&clean);
        if score == 0 {
            continue;
        }
        let object_id = c.get("objectID").and_then(Value::as_str).unwrap_or("0");
        let title: String = clean.chars().take(96).collect();
        listings.push(Listing {
            source: "hn-whoshiring",
            title,
            company: None,
            url: format!("https://news.ycombinator.com/item?id={object_id}"),
            score,
            matched,
        });
    }

    let status = SourceStatus {
        name: "hn-whoshiring",
        ok: true,
        detail: format!("{thread_title} — {} comments scanned, {} matched", comment_hits.len(), listings.len()),
        count: listings.len(),
    };
    Ok((listings, status))
}

fn main() {
    let mut all_listings: Vec<Listing> = Vec::new();
    let mut statuses: Vec<SourceStatus> = Vec::new();
    let mut hard_failures = 0;

    match fetch_remoteok() {
        Ok((mut l, s)) => {
            all_listings.append(&mut l);
            statuses.push(s);
        }
        Err(e) => {
            eprintln!("[job-sift] WARN remoteok fetch failed: {e}");
            statuses.push(SourceStatus {
                name: "remoteok",
                ok: false,
                detail: e,
                count: 0,
            });
            hard_failures += 1;
        }
    }

    match fetch_hn_whos_hiring() {
        Ok((mut l, s)) => {
            all_listings.append(&mut l);
            statuses.push(s);
        }
        Err(e) => {
            eprintln!("[job-sift] WARN hn-whoshiring fetch failed: {e}");
            statuses.push(SourceStatus {
                name: "hn-whoshiring",
                ok: false,
                detail: e,
                count: 0,
            });
            hard_failures += 1;
        }
    }

    if hard_failures == statuses.len() {
        eprintln!("[job-sift] FATAL: every source failed, nothing to report.");
        std::process::exit(1);
    }

    all_listings.sort_by(|a, b| b.score.cmp(&a.score));

    println!("job-sift — live contracts board ({})", now_human());
    for s in &statuses {
        let mark = if s.ok { "ok " } else { "FAIL" };
        println!("  [{mark}] {:<14} {}", s.name, s.detail);
    }
    println!();

    let top_n = 15;
    println!("top {top_n} matches, ranked by skill-profile score:\n");
    for (i, l) in all_listings.iter().take(top_n).enumerate() {
        let company = l.company.as_deref().unwrap_or("(hn thread comment)");
        println!("{:>2}. [{:>2}] {:<10} {} — {}", i + 1, l.score, l.source, l.title, company);
        println!("      matched: {}", l.matched.join(", "));
        println!("      {}", l.url);
    }

    if all_listings.is_empty() {
        println!("(no listings cleared the skill-profile bar this run — sources reachable, nothing matched)");
    }

    if let Err(e) = write_report(&all_listings, &statuses) {
        eprintln!("[job-sift] WARN could not write report file: {e}");
    }
}

fn now_human() -> String {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    format!("unix:{secs}")
}

fn write_report(listings: &[Listing], statuses: &[SourceStatus]) -> std::io::Result<()> {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    let dir = std::path::Path::new("../../output/job-sift");
    std::fs::create_dir_all(dir)?;

    let mut json = String::new();
    write!(json, "{{\n  \"generated_at_unix\": {secs},\n  \"sources\": [\n").ok();
    for (i, s) in statuses.iter().enumerate() {
        write!(
            json,
            "    {{\"name\": \"{}\", \"ok\": {}, \"count\": {}, \"detail\": {:?}}}{}\n",
            s.name,
            s.ok,
            s.count,
            s.detail,
            if i + 1 < statuses.len() { "," } else { "" }
        )
        .ok();
    }
    write!(json, "  ],\n  \"listings\": [\n").ok();
    for (i, l) in listings.iter().enumerate() {
        write!(
            json,
            "    {{\"source\": \"{}\", \"score\": {}, \"title\": {:?}, \"company\": {:?}, \"url\": {:?}, \"matched\": {:?}}}{}\n",
            l.source,
            l.score,
            l.title,
            l.company,
            l.url,
            l.matched,
            if i + 1 < listings.len() { "," } else { "" }
        )
        .ok();
    }
    write!(json, "  ]\n}}\n").ok();

    let path = dir.join(format!("report-{secs}.json"));
    std::fs::write(&path, json)?;
    println!("\nreport written: tools/job-sift/{}", path.display());
    Ok(())
}
