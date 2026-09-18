---
name: workspace-db
description: This skill should be used when an agent workflow needs durable state: "save these results", "track status across runs", "remember this between sessions", building a pipeline, queue, or CRM-like table, or logging events over time. Covers table design in the superagnt workspace Postgres (agnt_db_*): schema patterns for pipelines, HITL queues, KPI events, and audit logs, plus canvas-ready column rules. Prefer it over local files or scratch JSON for anything a later run must read.
version: 0.2.0
---

# The workspace database

Every superagnt workspace can carry a real Postgres the agent owns:
`agnt_db_list_tables`, `agnt_db_execute_sql`, `agnt_db_apply_migration`,
`agnt_db_insert` / `select` / `update` / `upsert` / `delete`,
`agnt_db_load_csv`. If the tools are missing, enable the `database` family
(`agnt_tools_enable`); if the database is not yet provisioned,
`agnt_db_status` says so and provisioning is automatic on first use.

Local files die with the session. Anything a later run, another agent, a
schedule, or a canvas must read belongs here.

## Schema patterns

- **Pipeline**: one row per item, a text `status` column with a small set of
  stable values (they become funnel stages — renaming a value breaks
  downstream reads), `updated_at timestamptz`. Upsert on a stable natural
  key so re-runs are idempotent.
- **HITL queue**: pipeline + a `needs_human` boolean and a `resolution`
  column the human's decision lands in.
- **KPI events**: append-only, one row per event, `event_at timestamptz`,
  numeric measures in real numeric columns — never jsonb-only, a chart
  should not dig into jsonb for a y-axis.
- **Audit log**: append-only, who/what/when, never updated in place.

## Rules

- Migrations through `agnt_db_apply_migration` with a short descriptive
  name; ad-hoc DDL through `execute_sql` gets lost.
- Ask before destructive SQL (drop/truncate/mass delete) — always.
- Design for the canvas from day one: timestamptz + numeric measures +
  stable status strings are exactly what canvas widgets bind to (see the
  canvas skill).

## More

- CSVs and exports land as tables in one call: `agnt_db_load_csv` — then
  process at row scale with the data-pipelines skill.
- Tables are the hand-off surface to task agents and schedules (task-agents
  skill): a hosted run has no chat history, it reads state from here.
- Live platform reference: https://superagnt.com/agent-setup/prompt.md

<!-- skill_id: workspace-db · source: https://github.com/superagnt/plugins -->
