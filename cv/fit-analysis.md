# Fit analysis — requirement against evidence

Evidence lives in `technical-assets.json` and `role-dossiers.json`. Status: **covered** (a stranger can
check it), **partial** (adjacent evidence only), **gap** (nothing in the registers; do not claim).
Last checked 2026-10-25, session: Claude Code job 5c74fffd.

## Gloat — Senior AI Engineer, Agentic Systems

| Requirement | Evidence | Status |
|---|---|---|
| 5+ years production software | 2009 onward; earlier-roles dossier; owner statement | covered |
| LLM agents shipped to production, not demos | none: harnesses and infrastructure only; api-hyle-lol "live" claim unverified | **gap** |
| At least one agent orchestration framework (LangGraph etc.) | none; routing and fallback built by hand | **gap** |
| Strong Python | free-llm-harness (package, tests, 4 commits) | covered (small) |
| Prompt engineering with systematic evaluation | no evaluation evidence in the CV since pi-harness was removed; mu-harness is design only | **gap** (restorable) |
| Tool use, function calling | free-llm-harness `tools.py` function definitions | partial |
| Deploy, monitor, maintain AI in production (cloud, CI/CD, observability) | pocket deploy pipeline with outside verification; coggy and topo-sonify CI; audit logs in api-hyle-lol | partial |
| Multi-provider (Anthropic, Google) | inference_harness, free-llm-harness provider chains | covered |
| RAG, embeddings, vector databases | none | gap |
| MCP, agent memory, planning | coggy cognitive loop is symbolic, not LLM memory; no MCP | gap |
| Knowledge graph, graph ML | coggy AtomSpace (private); topology work | partial |
| HR tech, skills ontologies | none (Move38 ontology work is marked do-not-render) | gap |
| Responsible AI: guardrails, governance, audit trail | audit logs (api-hyle-lol); enforced hooks lived in pi-harness | partial |

## SalesTech startup (via recruiter)

| Requirement | Evidence | Status |
|---|---|---|
| 5+ years development, end-to-end features | pocket (apps, pipeline, deploy), earlier roles | covered |
| AI-powered product features | no product shipped | gap |
| Agentic workflows, guardrails, multi-step AI workflows | routing/fallback chains; no content guardrails | partial |
| Clean APIs, data models, workflows | gemini-gate, api-hyle-lol | partial |
| Latency, cost, scale, production quality | token/cost/latency audit logs; 88-request measurement | partial |
| Startup experience | not established | gap |
| Full-stack/serverless; classical ML or DS | pocket; Spring Research and earlier roles | covered |

## Highest-value additions (what would turn gaps into lines)

1. Any LLM agent in front of real users, even a small one with a URL (closes the biggest Gloat gap).
2. A framework-built agent (LangGraph or similar), even a weekend one with a repo.
3. An evaluation harness with a published result (mu-harness, or a reinstated pi-harness line).
4. Dated artifacts from 2022-2025 documenting the four years of AI-assisted work.
5. The macOS app that wraps Claude, if it exists: no repo matching that description was found.
