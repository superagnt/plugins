---
name: competitor-mindshare
description: This skill should be used when the user wants to run the Competitor Mindshare Monitor blueprint, or asks to "measure competitor mindshare", "track how much people talk about <brand> on X", "compare brand chatter", or wants a recurring share-of-voice measurement with a shareable dashboard. Runs on the superagnt MCP: X search + workspace database + canvas, with an optional daily hosted run.
version: 0.1.0
---

# Competitor Mindshare Monitor

Measure posts-per-hour and engagement for a fixed brand set with an identical
method every day, so the trend is real. The methodology is the one from the
public superagnt research reports: identical queries, literal-match
filtering, and rates computed from the returned page's own timestamps.

## Step 0 — tools

`agnt_tools_list_enabled`; if missing:
`agnt_tools_enable({ "families": ["data:x", "database", "canvas_share"] })`.
`requires_upgrade` → hand the `confirm_url` to the user, wait, re-run.
(The competitor-mindshare blueprint endpoint pre-enables these.)

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

## Step 3 — the dashboard

First run: `agnt_canvas_introspect_schema` →
`agnt_canvas_preview_query` (aggregate in SQL, `group by` day and brand) →
`agnt_canvas_put_widget`: a trend line per brand, a KPI row with today's
rates, and a table of the latest measurements. `agnt_canvas_set_layout`,
then — with the user's explicit OK — `agnt_canvas_share_create` for the
public link. Later runs just insert rows; the canvas stays current on its
own.

## Step 4 — offer the daily run

Same pattern as every blueprint: once one measurement pass has succeeded,
offer a daily schedule — deploy a runner agent with steps 2, then
`agnt_schedules_create` (cadence confirmed; billed runs; module trials via
`confirm_url` on `requires_upgrade`). Local-only users just re-run the
skill.

## Rules

- Never compare numbers measured with different query shapes, floors, or
  limits — change the method, start a new series (add a `method_version`
  column rather than mixing).
- Every published number traces to rows in `mindshare_daily`.

<!-- skill_id: competitor-mindshare · source: https://github.com/superagnt/claude-plugins -->
