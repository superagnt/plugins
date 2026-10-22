---
name: competitor-mindshare
description: This skill should be used when the user wants to run the Competitor Tracker skill, or asks to "measure competitor mindshare", "track how much people talk about <brand> on X", "compare brand chatter", or wants a recurring share-of-voice measurement with a shareable dashboard. Runs on the superagnt MCP: X search + workspace database + the workspace dashboard, with an optional daily hosted run.
version: 0.3.0
---

# Competitor Tracker

Measure posts-per-hour and engagement for a fixed brand set with an identical
method every day, so the trend is real. The methodology is the one from the
public superagnt research reports: identical queries, literal-match
filtering, and rates computed from the returned page's own timestamps.

## Step 0 — tools

`agnt_tools_list_enabled`; if missing:
`agnt_tools_enable({ "families": ["data:x", "database"] })`.
`requires_upgrade` → hand the `confirm_url` to the user, wait, re-run.
(The competitor-mindshare skill endpoint pre-enables these. The workspace
dashboard's tools, `agnt_dashboards_*`, are on for every workspace.)

## Tool names on grouped servers

This skill writes flat (per-operation) tool names. New superagnt servers list
grouped tools instead: one tool per resource with an `action` argument. Flat
names still resolve there but are not listed, so call the grouped form:

- `data_x_search_get_search_search` → `data_x_discover`, action `search`
- `agnt_db_insert` → `agnt_db_write`, action `insert`
- `agnt_db_apply_migration` → `agnt_db_sql`, action `apply_migration`
- `agnt_dashboards_guide` / `agnt_dashboards_preview` → `agnt_dashboards_read`, action `guide` / `preview`
- `agnt_dashboards_write_file` / `agnt_dashboards_publish` → `agnt_dashboards_write`, action `write_file` / `publish`
- `agnt_agents_create` → `agnt_agents_write`, action `create`
- `agnt_schedules_create` → `agnt_schedules_write`, action `create`
- `agnt_tools_enable` → `agnt_tools_write`, action `enable`

On a grouped server every data source is already on, so skip the `data:*`
part of Step 0 (enable any other family with `agnt_tools_write`, action
`enable`). Grouped data calls return a compact markdown view: pass
`response_format: "json"` for every view field, or `"raw"` for the full
payload, when a step needs a field the table leaves out.

## Step 1 — name the brands (first run only)

The user lists brands/products to track (include their own). Record query
variants per brand — people abbreviate product names — in
`mindshare_brands(id, brand, variants text[], active)`. Create
`mindshare_daily(id, brand_id, measured_at timestamptz, posts_per_hour
numeric, median_likes numeric, sample_size int, top_post_url text)` via
`agnt_db_apply_migration`.

## Step 2 — measure

Per brand, identically: `data_x_search_get_search_search`
(section=latest, fixed like-floor, same limit for every brand). Filter the
returned page CLIENT-SIDE to posts whose text literally contains a brand
variant — the endpoint fuzzy-matches, and skipping this step inflates
everything. Rate = matching posts ÷ the span between the page's first and
last timestamps. Median likes over the matches. One `agnt_db_insert` row per
brand per day.

Method caveats to state in any summary: mindshare ≠ market share; gaps under
~1.5x are noise; generic brand names (a common word) over-count and need
tighter variants.

## Step 3 — the scoreboard view

First run: `agnt_dashboards_guide` once (the files, the query grammar, the
`sa-*` elements and publishing). Then build one view, `mindshare`, in your
draft with `agnt_dashboards_write_file` (pass `intent` on the first write):

- `queries/mindshare_today.sql`: today's posts per hour and median likes per
  brand, highest first.
- `queries/mindshare_trend.sql`: one row per day, oldest first, one column
  per brand (pivot in SQL: `max(d.posts_per_hour) filter (where b.brand =
  'Acme') as acme`).
- `views/mindshare.html`: an `sa-chart` kind `hbar` over today's rates, an
  `sa-chart` kind `line` over the trend (`y-fields` the brand columns,
  `series-labels` the brand names), and an `sa-table` of the latest
  measurements.
- the view's entry in `dashboard.json`.

`agnt_dashboards_preview` the view, fix what its report names, then
`agnt_dashboards_publish`. Later runs just insert rows; the view stays current
on its own (a new brand needs its column in the trend query, then publish).
To share the scoreboard, the user turns on the view's public link from the
superagnt app: agents can't make one.

## Step 4 — offer the daily run (a task agent)

Same pattern as every packaged skill: once one measurement pass has succeeded,
offer a daily run by building a task agent (recipe: the base `task-agents`
skill) — `agnt_agents_create` with a system prompt carrying step 2 verbatim
(brand table, query shape, insert), only the tools it uses, deploy, then
`agnt_schedules_create` (cadence confirmed; billed runs; a plan limit comes
back as `requires_upgrade` with a `confirm_url` for the user). Local-only
users just re-run the skill.

## Rules

- Never compare numbers measured with different query shapes, floors, or
  limits — change the method, start a new series (add a `method_version`
  column rather than mixing).
- Every published number traces to rows in `mindshare_daily`.

<!-- skill_id: competitor-mindshare · source: https://github.com/superagnt/plugins -->
