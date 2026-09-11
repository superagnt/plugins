---
name: data-pipelines
description: This skill should be used when a task must run over many items: "enrich every row", "process this list of 500 companies", "run AI on each record", "scrape all of these URLs", or any batch too big for one context window. Covers superagnt data jobs: batch AI and data calls over workspace-database rows with per-item status, retries, and cost control, instead of looping tool calls in-session.
version: 0.1.0
---

# Batch work: data jobs

Looping tool calls in-session breaks down past a few dozen items: context
fills, one failure loses the run, and nothing records which items finished.
Data jobs run the batch server-side — one cheap structured call per item,
per-item status, resumable.

## When to switch

Rule of thumb: under ~50 items, loop in-session with results upserted per
item (idempotent on retry). Over that, submit a data job.

## Procedure

1. Source rows live in a workspace-database table (workspace-db skill) with
   a stable key and a `status` column.
2. `agnt_data_job_submit` with the recipe: what to do per item (a data call,
   an AI transform, or both) and where results land.
3. The data-jobs family is sold under the Data Jobs module (free trial): if
   `agnt_tools_enable(['data-jobs'])` returns `requires_upgrade`, give the
   human the `confirm_url` and wait.
4. Report progress from the table, not from memory: counts by status via
   `agnt_db_select`. Failed items keep their error; fix the cause and
   resubmit the failures, never the whole batch.

## Cost discipline

State the item count and the per-item shape to the user BEFORE submitting a
job over hundreds of rows — batch jobs spend credits at batch speed. Sample
5 items in-session first to prove the recipe, then scale.

<!-- skill_id: data-pipelines · source: https://github.com/superagnt/claude-plugins -->
