---
name: dashboards
description: This skill should be used when the user asks for a "dashboard", "shareable report", "KPI page", or "live chart", or wants results as a page someone else can open. Covers the superagnt workspace dashboard: views (HTML pages on sa-* elements) bound to named queries over the workspace database and platform data, the draft-and-publish loop, and public links. Use after data lands in the workspace database; see workspace-db for table design.
version: 0.3.0
---

# The workspace dashboard: results as a living page

Every workspace has one dashboard of views. A view is an HTML page built from
`sa-*` elements (numbers, charts, tables, lists), each bound to a named query
over the workspace database or platform data (credits, usage, data jobs,
agent runs, pending approvals). Views stay current as the data changes.
People in the workspace see them in the superagnt app, and a person can share
one as a public link that anyone can open, no account needed.

## Procedure

1. Data first. Queries read tables; if the table does not exist yet, the
   workspace-db skill's patterns come first.
2. `agnt_dashboards_guide` once: the files, the query grammar, the `sa-*`
   elements and publishing. `agnt_dashboards_describe_data` lists the tables
   and platform datasets a query can read.
3. Build in your own draft: `agnt_dashboards_apply_template` for a starter
   view (number row, trend, breakdown, table with CSV, approvals, credits and
   usage), or `agnt_dashboards_write_file` for `queries/<name>.sql`,
   `views/<slug>.html` and the view's `dashboard.json` entry. Every write is
   checked and returns its problems in plain words. Each query runs once with
   its defaults, so aggregate in SQL (`group by date_trunc('day', ...)`).
4. `agnt_dashboards_preview` renders the view as a PNG with a report on each
   query. Fix what it names, then `agnt_dashboards_publish` with a one-line
   summary: people in the workspace see the new version at once.
5. Share: a person in the workspace turns on a view's public link from the
   superagnt app. Agents can't make one; `agnt_dashboards_unshare_view` turns
   one off.

## Layout discipline

- Lead with a row of 3–5 numbers (`sa-value`), then trends (`sa-chart`),
  then detail tables (`sa-table`).
- One measure per chart; failed/error series go in `danger-fields`, never the
  accent.
- Time charts need `event_at`/`created_at` timestamptz columns; funnels bind
  to stable status strings — schema rules in workspace-db.
- The dashboard tools are on for every workspace where the dashboard is on; a
  deployed agent gets them with `dashboards_enabled`. What the plan caps is
  the workspace database behind the queries (tables, rows, storage).

## Tool names on grouped servers

New servers list one tool per family with an `action` argument. The flat
names above map to:

| Flat | Grouped tool, action |
|---|---|
| `agnt_dashboards_guide`, `_list_files`, `_read_file`, `_describe_data`, `_history`, `_preview` | `agnt_dashboards_read`: `guide`, `list_files`, `read_file`, `describe_data`, `history`, `preview` |
| `agnt_dashboards_write_file`, `_edit_file`, `_apply_template`, `_publish`, `_restore` | `agnt_dashboards_write`: `write_file`, `edit_file`, `apply_template`, `publish`, `restore` |
| `agnt_dashboards_delete_file`, `_discard_draft`, `_unshare_view` | `agnt_dashboards_remove`: `delete_file`, `discard_draft`, `unshare_view` |

Flat names still resolve on a grouped server but are not listed, so most
clients will not let you call them: use the grouped tool. Canvases (the old
`agnt_canvas_*` tools) were retired; those names now only answer with this
replacement.

## More

- A view over a table a task agent keeps fresh is a live dashboard with zero
  upkeep — pair with the task-agents skill.
- Worked examples: https://superagnt.com/skills

<!-- skill_id: dashboards · source: https://github.com/superagnt/plugins -->
