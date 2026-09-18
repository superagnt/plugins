---
name: audience-radar
description: This skill should be used when the user wants to run the Content Ideas Engine blueprint, or asks to "find out what my audience talks about", "mine X for content ideas", "research what's working in my niche on X/Twitter", or wants a recurring content-research sweep with a cited ideas report. Runs on the superagnt MCP: X search + workspace database, with an optional nightly hosted run.
version: 0.2.0
---

# Content Ideas Engine

Mine X for what the user's audience actually talks about; file the signal;
write a cited ideas report. The recipe compounds: every sweep builds on the
tables the last one left.

## Step 0 — tools

`agnt_tools_list_enabled`; if `data:x` or `database` families are missing,
`agnt_tools_enable({ "families": ["data:x", "database"] })`. A
`requires_upgrade` result carries a `confirm_url` — give it to the user and
wait, then re-run. (Connecting through the audience-radar blueprint endpoint
pre-enables these.)

## Step 1 — define the radar (first run only)

Ask the user for their niche, audience, and 3–5 accounts they rate. Derive
8–12 standing searches: topic phrases, "how do I"-shaped questions, tool
names, and the rated accounts' handles. Sensible engagement floors (10–50
likes; higher for noisy topics). Store them:

- `radar_queries(id, query, min_likes, active, created_at)` — via
  `agnt_db_apply_migration` then `agnt_db_insert`.
- `radar_posts(post_id primary key, query_id, author, text, likes, replies,
  url, posted_at timestamptz, seen_at timestamptz)`.

## Step 2 — sweep

For each active query: `data_x_search_get_search_search` (section=top, the
query's like floor). Upsert results into `radar_posts` on `post_id`
(`agnt_db_upsert`) so re-runs never duplicate. Pull reply threads only for
standout posts — replies are where unmet needs hide, and thread pulls cost
more credits than searches.

## Step 3 — report

From `radar_posts` since the last sweep (`agnt_db_select`): the patterns that
repeated, 3–5 posts worth replying to today, and 3–5 post ideas — EVERY idea
cites the post that earned its place (author + link + likes). No cite, no
idea. Keep the report under a page.

## Step 4 — offer the night shift (a task agent)

Once one sweep has succeeded end to end, offer to make it nightly by
building a task agent — the full recipe is the base `task-agents` skill.
Short form: `agnt_agents_create` with a system prompt carrying steps 2–3
verbatim (tables, queries, report shape), add ONLY the tools those steps use
(`agnt_tools_search` for the config refs), `agnt_agents_deploy`, then
`agnt_schedules_create` — cadence confirmed with the user first; every
firing is a billed run. The `lifecycle` and `schedules` families are sold
under modules with free trials; `requires_upgrade` → `confirm_url` → wait.
If the user prefers local-only, skip this and tell them to re-run the skill
whenever.

## Rules

- Never fabricate engagement numbers or post text — everything reported
  comes from a tool result or the table.
- This skill reads X; it never posts, replies, or DMs.

<!-- skill_id: audience-radar · source: https://github.com/superagnt/plugins -->
