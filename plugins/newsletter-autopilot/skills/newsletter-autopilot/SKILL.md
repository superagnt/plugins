---
name: newsletter-autopilot
description: This skill should be used when the user wants to run the Newsletter Autopilot blueprint, or asks to "research and draft my newsletter", "assemble this week's issue", "keep a research pile for my newsletter and write the draft", or wants a standing weekly loop that ends in a complete cited issue draft. Runs on the superagnt MCP: X + web data and the workspace database, with an optional nightly hosted run.
version: 0.1.0
---

# Newsletter Autopilot

Research the user's topics on X and the web all week, keep only what is
genuinely new, and on send day assemble a COMPLETE issue draft in their
voice: sections, links, every claim cited, subject line options. The
user edits and sends; sending is never the agent's.

## Step 0 — tools

`agnt_tools_list_enabled`; if `data:x`, `data:web` or `database`
families are missing, `agnt_tools_enable({ "families": ["data:x",
"data:web", "database"] })`. A `requires_upgrade` result carries a
`confirm_url` — give it to the user and wait, then re-run. (Connecting
through the newsletter-autopilot blueprint endpoint pre-enables these.)

## Step 1 — learn the letter (first run only)

Ask the user for the topics they cover, the send day, and ONE past
issue (a link `data_web_scrape` can read, or pasted). From that issue
record the voice and the section shape: how it opens, how many
sections, how takes are framed, how links are dropped. Derive per
topic 1-3 X searches with engagement floors plus 1-2 web queries.
Store it:

- `issue_profile(id, topics text[], send_day text, voice_notes text,
  section_shape jsonb, updated_at timestamptz)` — via
  `agnt_db_apply_migration` then `agnt_db_insert`.
- `issue_queries(id, topic, kind text check (kind in ('x','web')),
  query, min_likes int, active, created_at)`.
- `issue_material(source_url primary key, topic, title, summary_md
  text, found_at timestamptz, used_in_issue text)` — the week's pile +
  the dedupe ledger in one.
- `issue_drafts(week primary key, draft_md text, subject_options
  jsonb, status text default 'draft', assembled_at timestamptz)`.

## Step 2 — research all week

Each run (nightly when scheduled): X queries through
`data_x_search_get_search_search` (section=top, the query's like
floor), web queries through `data_web_search`. Drop anything already
in `issue_material`. For the keepers that are pages,
`data_web_scrape`; for standout X posts, pull the thread. The bar: a
find earns its row when it would earn a sentence in the issue — new
information, a real number, a take worth reacting to. Write a 2-4
sentence `summary_md` per keeper so assembly never re-reads sources.

## Step 3 — assemble the issue

On send day (or on demand), build the COMPLETE draft from the week's
unused `issue_material`, in the recorded voice and section shape: the
open, each section written out with its links inline, every claim
citing its source URL, and 2-3 subject line options. Save to
`issue_drafts`, mark the material rows `used_in_issue`, and hand the
draft over. The user edits and sends from their own ESP — this skill
never sends, schedules, or publishes anything.

## Step 4 — offer the nightly run (a task agent)

Once one issue has shipped from a draft, offer to make the research
nightly by building a task agent — the full recipe is the base
`task-agents` skill. Short form: `agnt_agents_create` with a system
prompt carrying step 2 verbatim (tables, queries, the quality bar) and
step 3 gated on the send day, add ONLY the tools those steps use,
`agnt_agents_deploy`, then `agnt_schedules_create` — cadence confirmed
with the user first; every firing is a billed run. The `lifecycle` and
`schedules` families are sold under modules with free trials;
`requires_upgrade` → `confirm_url` → wait. If the user prefers
local-only, skip this and tell them to run the skill through the week.

## Rules

- Every claim in the draft cites its source URL — no cite, no claim.
- Quote sparingly: at most one short quotation per source; the draft
  summarizes in the user's voice, it never republishes someone else's
  writing.
- This skill drafts; it never sends email, posts, or touches the
  user's ESP.

<!-- skill_id: newsletter-autopilot · source: https://github.com/superagnt/plugins -->
