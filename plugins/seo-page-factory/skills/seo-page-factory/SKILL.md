---
name: seo-page-factory
description: This skill should be used when the user wants to run the SEO Page Factory blueprint, or asks to "write SEO pages for keyword gaps", "draft pages for keywords my competitors rank for", "run a keyword gap and write the pages", "fill my content gaps", or wants a recurring loop that turns competitor rankings into publish-ready page drafts. Runs on the superagnt MCP: SERP + keyword data, web scrape, and the workspace database, with an optional weekly hosted run.
version: 0.1.0
---

# SEO Page Factory

Find the keywords the user's competitors rank for that they don't, score
which ones are winnable, and DRAFT THE FULL PAGE for each: title,
structure, body, meta, internal links, in the user's voice. The output
is pages ready to publish, not a report. Publishing stays with the user.

## Step 0 — tools

`agnt_tools_list_enabled`; if `data:seo`, `data:web` or `database`
families are missing, `agnt_tools_enable({ "families": ["data:seo",
"data:web", "database"] })`. A `requires_upgrade` result carries a
`confirm_url` — give it to the user and wait, then re-run. (Connecting
through the seo-page-factory blueprint endpoint pre-enables these.)

## Step 1 — learn the site (first run only)

Ask the user for their domain and 2-3 competitor domains. Sanity-check
each with `data_seo_domain_overview`; if they only know one competitor,
propose more with `data_seo_competitors` and let them pick. Then learn
their site: `data_web_scrape` the homepage plus 2-3 representative
pages, and record voice notes (tone, sentence length, how they use
headings), the URL structure, and the pages worth linking to
internally. Store everything:

- `factory_targets(id, domain, is_self boolean, active, created_at)` —
  via `agnt_db_apply_migration` then `agnt_db_insert`.
- `factory_site_profile(id, voice_notes text, url_pattern text,
  internal_links jsonb, updated_at timestamptz)`.
- `factory_pages(keyword primary key, competitor, competitor_url,
  volume int, difficulty int, intent, winnability int, status text
  default 'gap', draft_md text, title, meta_description, seen_at
  timestamptz)` — `status` moves gap → drafted → published/skipped.

## Step 2 — find the winnable gaps

For each active competitor: `data_seo_keyword_gap` with `target1` = the
competitor and `target2` = the user's domain, ordered by volume. Enrich
the keepers: `data_seo_ranked_keywords` for the competitor's ranking
URL and position, `data_seo_search_intent` in batches. Score
winnability from volume, difficulty vs the user's domain strength, and
intent fit with what they sell. Upsert into `factory_pages` on
`keyword` (`agnt_db_upsert`); skip branded keywords on either side — a
gap on a competitor's own name is not a page to write.

## Step 3 — draft the pages

Take the top winnable gaps (cap at 5 drafts per run — quality beats
volume, and each competitor scrape costs credits). Per keyword:
`data_web_scrape` the competitor page it has to beat, work out what
that page answers and what it misses, then draft the FULL page in the
user's voice from `factory_site_profile`: title, H2/H3 structure, the
complete body, meta description, and internal links to their real
pages. The draft must beat the competitor page on completeness, not
echo it — and never copy its sentences. Save `draft_md` + `title` +
`meta_description` on the row, mark it `drafted`, and present each
draft to the user with its numbers (volume, difficulty, the URL to
beat). They review, publish on their site, and mark rows `published`
or `skipped`.

## Step 4 — offer the weekly run (a task agent)

Once one loop has produced drafts the user actually rates, offer to
make it weekly by building a task agent — the full recipe is the base
`task-agents` skill. Short form: `agnt_agents_create` with a system
prompt carrying steps 2–3 verbatim (tables, scoring, draft shape, the
5-draft cap), add ONLY the tools those steps use, `agnt_agents_deploy`,
then `agnt_schedules_create` — cadence confirmed with the user first;
every firing is a billed run. The `lifecycle` and `schedules` families
are sold under modules with free trials; `requires_upgrade` →
`confirm_url` → wait. If the user prefers local-only, skip this and
tell them to re-run the skill whenever.

## Rules

- Never fabricate volume, difficulty, position or intent — every number
  reported comes from a tool result or the table.
- Drafts never copy competitor sentences; the competitor page sets the
  bar, the draft is original work in the user's voice.
- This skill drafts pages into the table; it never publishes to the
  user's site or CMS.

<!-- skill_id: seo-page-factory · source: https://github.com/superagnt/plugins -->
