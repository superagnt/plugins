---
name: super-seo
description: This skill should be used when the user wants to run the Super SEO skill, or asks to "run my SEO", "audit my site's SEO", "improve my rankings", "build my keyword map", "find link targets", "check my AI visibility / AEO / GEO", "why does ChatGPT not mention us", "write SEO pages for keyword gaps", "draft pages for keywords my competitors rank for", "run a keyword gap and write the pages", "fill my content gaps", "what does search console say", "why did my clicks drop", "check my indexing", or invokes a mode directly ("seo measure", "seo audit", "seo write", "seo fix", "seo links", "seo ai", "seo report"). A full SEO operating system, not a page generator. Runs on the superagnt MCP: Google Search Console as ground truth, plus SERP + keyword + backlink + on-page + AI-visibility data, web scrape, and the workspace database, with an optional weekly hosted run.
version: 0.1.0
---

# Super SEO

Run the user's whole SEO practice the way a good consultant would, with
one difference: every action is ranked against every other action on one
scale, and the run works top-down. Search Console is the ground truth;
third-party data fills what it cannot see. Drafts, fixes and plans are
the deliverable. Publishing, sending and spending stay with the user,
always.

## Command modes

A bare invocation ("run my SEO") is the full cycle: measure, score every
candidate action, execute the top items. A mode forces one lane and
skips the rest, which is what the user wants when they already know what
is wrong.

| Mode | The user says | What runs |
|---|---|---|
| (bare) | "run my SEO", "what should I do this week" | Step 2, then the ranked cycle in Step 4 |
| `measure` | "what does search console say", "why did my clicks drop" | Step 2 only: the panel, the decomposition, a snapshot row |
| `audit` | "audit my site", "check my indexing" | Step 1 technical + on-page pass, no drafting |
| `write` | "write pages for my gaps", "fill my content gaps" | The drafting lane only, capped at 5 |
| `fix` | "what do I fix on this page" | Re-audit the named pages, concrete fix list |
| `links` | "find link targets", "who links to my competitors" | Link lane only, capped at 3 pitches |
| `ai` | "why does ChatGPT not mention us", "check my AEO" | AI-visibility lane only |
| `report` | "where are we at", "write the weekly" | Read the tables, write the review, spend nothing new |

Every mode writes a `seo_runs` row. A mode filters the candidate list;
it never skips the numbers.

## The research library

This skill ships with a bundled research corpus in `references/`,
distilled from hundreds of practitioner sources (X threads, YouTube
transcripts, Reddit, industry studies; researched 2026-09). Before
working a lane, read the matching note; cite its findings when
explaining a recommendation, and prefer it over generic SEO folklore.

- `references/00-agent-seo-playbook.md` — the operating manual; read it on first run.
- `references/technical-seo.md` — crawlability, indexing, rendering, schema, migrations.
- `references/on-page-and-eeat.md` — titles, entities, E-E-A-T, snippet formatting.
- `references/keyword-research-and-serp.md` — intent, clustering, difficulty reality, prioritization.
- `references/content-strategy-topical-authority.md` — topical maps, programmatic SEO, refresh economics, SaaS plays.
- `references/link-building-white-hat.md` — digital PR, linkable assets, outreach mechanics, market costs.
- `references/link-building-grey-hat.md` — the paid-link and PBN market documented with risk labels. Briefing material only; see The grey zone below.
- `references/ai-search-aeo-geo.md` — AI Overviews, LLM citations, brand-mention currency, measurement.
- `references/local-seo.md` — GBP, reviews, citations, local packs.
- `references/seo-with-ai-agents.md` — what agent automation does well and where it burns people.
- `references/measurement-algo-updates.md` — GSC, testing, update recovery, the API leak takeaways. Read it before any measurement work.
- `references/new-domain-zero-to-one.md` — a domain with no history: real timelines, what to publish first, the cold-start link problem, kill criteria.
- `references/international-and-non-google.md` — hreflang, URL structure, localisation at scale, and the engines that are not Google (Bing matters: it grounds ChatGPT).

Installed as a raw single SKILL.md without `references/` (non-plugin
harness)? Say so once, then proceed: the steps below stand alone.

## Step 0 — tools

`agnt_tools_list_enabled`; if `data:seo`, `data:web` or `database`
families are missing, `agnt_tools_enable({ "families": ["data:seo",
"data:web", "database"] })`. A `requires_upgrade` result carries a
`confirm_url` — give it to the user and wait, then re-run. (Connecting
through the super-seo skill endpoint pre-enables these.)

Then check Search Console. It is a your-credential OAuth connection, not
a data family: look for tools prefixed `connection_google_search_console_*`
in the same listing. If they are present, call
`connection_google_search_console_list_sites` and have the user pick the
property, storing the exact `siteUrl` string (a URL-prefix property is
the full URL with trailing slash; a domain property is prefixed
`sc-domain:`).

If they are absent, say once that Search Console is not connected, that
connecting it from the dashboard connections page is what unlocks the
real numbers, and that you are continuing on third-party estimates until
they do. Degraded is a labelled state, never a blocker: every panel,
board and report produced without GSC marks the affected figures
"third-party estimate".

## Step 1 — the baseline (first run only)

Ask for the user's domain, 2-3 competitor domains, and what they sell
(one line: the buyer and the problem). Verify each domain with
`data_seo_domain_overview`; propose extra competitors with
`data_seo_competitors` if they only know one. Then baseline:

- `data_seo_page_audit` on the homepage and 3-5 money pages.
- `data_seo_backlinks_summary` + `data_seo_referring_domains` for the
  user and each competitor.
- `data_seo_ai_visibility` for the user's brand and their category
  terms — the AI-answer baseline most founders have never seen.
- `data_web_scrape` the homepage + 2 representative pages for voice
  notes (tone, structure, internal links) and the URL pattern.

Store everything (`agnt_db_apply_migration` then inserts):

- `seo_targets(id, domain, is_self boolean, active boolean default
  true, profile jsonb, created_at timestamptz)` — `profile` on the
  self row carries voice notes, url pattern, money pages, internal
  link targets, and the GSC `siteUrl` once known.
- `seo_keywords(keyword text primary key, cluster text, volume int,
  difficulty int, intent text, priority int, status text default
  'gap', competitor_url text, draft_md text, title text,
  meta_description text, updated_at timestamptz)` — one row per page
  the user could own. `status` moves gap → queued → drafted →
  published/skipped. This is the drafting lane's state too: a draft is
  a `seo_keywords` row with `draft_md` filled, not a separate table.
- `seo_link_targets(domain text primary key, why text, authority int,
  contact text, pitch_md text, status text default 'new', updated_at
  timestamptz)` — `status` moves new → pitch_drafted → won/dead.
- `seo_gsc_rows(day date, query text, page text, country text, device
  text, clicks int, impressions int, ctr numeric, position numeric,
  primary key (day, query, page, country, device))` — the GSC pull,
  kept row-level. Never store only the aggregate.
- `seo_snapshots(id, taken_at timestamptz, source text, metrics
  jsonb)` — one row per cycle per source (`gsc`, `third_party`).
- `seo_runs(id, ran_at timestamptz, mode text, board jsonb, done
  jsonb, notes text)` — what was ranked, what was executed, what was
  deferred and why.

Two cases change the plan first. A new domain with no ranking history:
read `references/new-domain-zero-to-one.md` and set expectations from
it, because the honest answer may be that SEO cannot pay yet. A user
selling across borders: `references/international-and-non-google.md`
covers the URL-structure call and Bing, which grounds ChatGPT.

## Step 2 — the measurement panel

Run this at the top of every cycle, before anything is proposed. It is
what makes the ranked board honest.

1. **Pull the rows.** `connection_google_search_console_query_analytics`
   for the last 28 days and the prior 28, dimensions `["query","page"]`
   plus a `["page","date"]` pass, `dataState: "all"` so the freshest
   days are included. Page with `rowLimit` / `startRow`. Upsert into
   `seo_gsc_rows`.
2. **Decay.** Pages whose clicks fell against the prior period while
   impressions held. Each is a refresh candidate carrying its click
   delta.
3. **Striking distance.** Query+page pairs at position 5-15 with real
   impressions. Each is a fix candidate carrying its impressions and the
   click gap to the position above.
4. **The three-way decomposition on every material drop.** Impressions
   flat and clicks down means CTR moved, usually a SERP feature above
   you. Impressions down and position flat means demand moved.
   Impressions down and position down means you lost ranking, and that
   is the only branch worth alerting on
   (`references/measurement-algo-updates.md`).
5. **Indexing.** `connection_google_search_console_inspect_url` on the
   money pages and anything published since the last run; a page not
   indexed outranks every content idea in the board below. Add
   `connection_google_search_console_list_sitemaps` when coverage looks
   wrong; `..._submit_sitemap` only if the user asks.
6. **Blend the third-party panels** for what GSC cannot see:
   `data_seo_ranked_keywords`, `data_seo_backlinks_summary`,
   `data_seo_ai_visibility` (competitors, the link graph, whether AI
   answers cite the brand).

Insert a `seo_snapshots` row per source. Report per query and per page,
never sitewide: a macro average position of 19.6 can decompose to 1.0 on
one query and 38.5 on another, so the aggregate is not a number.

## Step 3 — the keyword map

Maintained, not rebuilt. `data_seo_ranked_keywords` for the user,
`data_seo_keyword_gap` per competitor, `data_seo_keyword_ideas` seeded
from what they sell. Enrich keepers with `data_seo_keyword_overview` +
`data_seo_search_intent` in batches. Cluster by topic, then priority:
bottom-of-funnel intent first, winnable difficulty for this domain's
strength, real buyer language over volume vanity (the reasoning lives in
`references/keyword-research-and-serp.md` and
`references/content-strategy-topical-authority.md`). Skip branded terms
on either side. Upsert into `seo_keywords`.

Where GSC is connected, a query the site already gets impressions for
beats an estimated-volume keyword it has never been seen for. Join the
map to `seo_gsc_rows` before you rank it.

## Step 4 — the ranked cycle

Each cycle, build ONE candidate list across every lane, score it on one
scale, show it, then work top-down. This replaces the fixed-order loop:
a drafting idea and a technical fix compete on the same board.

**Candidates.** Draft page X (from `seo_keywords` at `gap`/`queued`),
refresh decaying page Y (Step 2.2), fix striking-distance page Z (Step
2.3), technical or indexing fix (Step 2.5 and `data_seo_page_audit`),
pitch link target W (`data_seo_backlink_gap` +
`data_seo_referring_domains`), AEO fix (`data_seo_ai_visibility`,
`data_seo_google_ai_mode_search`).

**Score.** `impact × confidence ÷ effort`, each 1-5, every score
carrying the tool number that justifies it. Impact is the traffic or
citation at stake (GSC clicks and impressions where connected,
`data_seo_*` estimates where not). Confidence is how sure the mechanism
is: an indexing failure is a 5, an AEO tactic from a contested study is
a 2. Effort is what the USER has to do, not what the agent does.
Ranking logic: `references/00-agent-seo-playbook.md`. Technical blockers
usually win on confidence alone, and that is correct.

**Present the board** before executing: rank, action, lane, score, and
the number behind it. The user can reorder it.

**Execute top-down, inside the caps.** Up to 5 page drafts and up to 3
link pitches per cycle. Everything else is unlimited, because fixes are
cheap and drafts are not.

- *Drafting.* Scrape the page to beat (`data_web_scrape`), work out what
  it answers and what it misses, then draft the full page in the user's
  voice from `seo_targets.profile`: title, H2/H3 structure, complete
  body, meta description, internal links to their real pages. Beat it on
  completeness, never echo its sentences. Save `draft_md`, `title`,
  `meta_description`, mark `drafted`, present each draft with its
  numbers. Quality bar and information-gain rules:
  `references/on-page-and-eeat.md`.
- *Fixes.* Re-run `data_seo_page_audit` on pages the user changed; list
  concrete edits with the page and the line, never "improve content".
- *Links.* Qualify targets (relevance beats raw authority; the honest
  proxy for a link's value is whether the linking page itself ranks),
  then write `pitch_md`, a real personalized draft per target. If
  enrichment tools are enabled (`agnt_tools_search` for "email finder"),
  attach contacts; otherwise leave `contact` to the user. Outreach
  mechanics and realistic reply rates:
  `references/link-building-white-hat.md`. The user sends; this skill
  never does.
- *AEO.* Track citation share against `seo_snapshots`; tactics for
  earning citations: `references/ai-search-aeo-geo.md`.

**Close the run.** Insert a `seo_runs` row with the board, what was
executed, and what was deferred. Then report: what moved (from Step 2),
what shipped, what is queued, and what needs the user (publish
approvals, pitches to send, fixes to deploy).

## Step 5 — offer the weekly run (a task agent)

Once one full cycle has produced work the user actually rates, offer to
make it weekly by building a task agent — the full recipe is the base
`task-agents` skill. Short form: `agnt_agents_create` with a system
prompt carrying Steps 2-4 verbatim (tables, scoring scale, caps), add
ONLY the tools those steps use including the Search Console connection
tools, `agnt_agents_deploy`, then `agnt_schedules_create` — cadence
confirmed with the user first; every firing is a billed run. The
`lifecycle` and `schedules` families are sold under modules with free
trials; `requires_upgrade` → `confirm_url` → wait. If the user prefers
local-only, skip this and tell them to re-run the skill whenever.

## The grey zone

`references/link-building-grey-hat.md` documents the paid-link, niche
edit, PBN and expired-domain market with real prices and risk labels,
because a corpus that pretends the market does not exist cannot advise
on it. Use it to BRIEF the user honestly when they ask (what it costs,
what it claims to yield, how it goes wrong, labeled risk), and to
recognize grey signals in their existing backlink profile. This skill
never buys placements, never orchestrates a purchase, and recommends the
white-hat route by default; if the user chooses a paid route, that
decision and every transaction are theirs, off-platform.

## Rules

- Never fabricate a metric — every volume, difficulty, authority,
  position or visibility number reported comes from a tool result or a
  table row.
- Never fabricate a Search Console number, and never present a
  third-party estimate as a GSC one. When GSC is not connected, the
  panel says so on every affected figure.
- When third-party data and GSC disagree, GSC wins. It is the user's own
  log; everything else is somebody's model of it. Label GSC query data
  as a sample, not a census: the API returns top rows, and low-volume
  queries are withheld.
- Never quote a sitewide average position or a sitewide CTR. Both are
  only meaningful filtered to one query and one page.
- Every action on the board carries the number that justifies it. An
  unscored action does not get executed.
- Drafts never copy competitor sentences; the page to beat sets the bar,
  the draft is original work in the user's voice.
- This skill drafts, fixes and plans; it never publishes to the user's
  site, never sends outreach, and never spends money. Publish, send,
  spend, disavow, delete and redirect are user actions.
- Cite the research library when recommending; say when a practice is
  contested rather than presenting folklore as fact.

<!-- skill_id: super-seo · source: https://github.com/superagnt/plugins -->
