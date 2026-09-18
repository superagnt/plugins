---
name: data-pipelines
description: This skill should be used for data-processing jobs over many rows — "process this CSV", "enrich every row", "classify these 5,000 records", "run AI on each item", "scrape all of these URLs" — AI and non-AI alike, whenever the row count outgrows one context window. Covers superagnt data jobs: server-side batch processing over workspace-database rows with per-item status, retries, and cost control, instead of looping tool calls in-session.
version: 0.2.0
---

# Data jobs: row-scale processing

A data job runs a processing step against every row of a dataset —
server-side, one item at a time, with per-item status and retries. The step
can be AI (classify, extract, summarize, score), a data call (enrich, verify,
scrape), plain code (parse, dedupe, reshape), or a mix. Looping tool calls
in-session breaks down past a few dozen rows: context fills, one failure
loses the run, and nothing records which items finished.

Rule of thumb: under ~50 items, loop in-session with idempotent per-item
upserts. Over that, it's a data job.

## Getting rows in

Source rows live in a workspace-database table (workspace-db skill) with a
stable key and a `status` column. For CSVs and exports, `agnt_db_load_csv`
lands the file as a table in one call — from there any row count is
job-ready. Data from the data-sources tools lands the same way (upsert as
you fetch).

## Running the job

1. The job itself (the per-item recipe) is created once — via the dashboard's
   data-pipelines page or the `data-jobs` management family
   (`agnt_data_job_create` / `list` / `read` / `inspect_run`). The family is
   sold under the Data Jobs module (free trial):
   `agnt_tools_enable(['data-jobs'])`, and on `requires_upgrade` hand the
   `confirm_url` to the human and wait.
2. `agnt_data_job_submit` (always available) pushes 1–1000 payloads onto an
   existing job — each payload a row pointer like `{ "row_id": ... }`.
3. **Results must be written back to a workspace table.** Make sure the
   job's recipe upserts each item's output into a table with a `status`
   column — that table is the ONLY place this session, later sessions, task
   agents, and canvases can read outcomes from. A recipe that merely returns
   its result stores it where only the dashboard can see it.
4. Report progress from the table, not memory: counts by status via
   `agnt_db_select`. Failed items keep their error (`agnt_data_job_inspect_run`
   shows failures and sandbox logs); fix the cause and resubmit the failures,
   never the whole batch.

## Cost discipline

State the item count and the per-item shape to the user BEFORE submitting
hundreds of rows — batch jobs spend credits at batch speed. Sample 5 items
in-session first to prove the step, then scale. Webhook-fed jobs (one
delivery = one item, automations skill) inherit the same rule: know the
expected volume before binding.

## More

- Table design for pipelines: the workspace-db skill
- Feeding a job from an inbound webhook: the automations skill
- Live platform reference: https://superagnt.com/agent-setup/prompt.md

<!-- skill_id: data-pipelines · source: https://github.com/superagnt/plugins -->
