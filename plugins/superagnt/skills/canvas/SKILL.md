---
name: canvas
description: This skill should be used when the user asks for a "dashboard", "shareable report", "KPI page", or "live chart", or wants results as a URL someone else can open. Covers superagnt canvases: widgets bound to workspace-database queries (KPI rows, trends, funnels, tables, kanban), layout discipline, and share links. Use after data lands in the workspace database; see workspace-db for table design.
version: 0.2.0
---

# Canvases: results as a living page

A canvas is a hosted page of widgets, each bound to a SQL query over the
workspace database. It stays current as the data changes, and a share link
opens for anyone — no account needed on the viewer's side.

## Procedure

1. Data first. Widgets bind to tables; if the table does not exist yet, the
   workspace-db skill's patterns come first.
2. `agnt_canvas_introspect_schema` to see what is bindable, then
   `agnt_canvas_preview_query` BEFORE `agnt_canvas_put_widget` — previews
   are capped at 50 rows, so aggregate in SQL (`group by date_trunc`), never
   in the widget.
3. Build the page: `agnt_canvas_put_widget` per widget,
   `agnt_canvas_set_layout` once at the end.
4. Share: `agnt_canvas_share_create` returns the public link;
   `agnt_canvas_share_revoke` kills it. Confirm with the user before
   creating a share link — it makes the page reachable outside the
   workspace.

## Layout discipline

- Lead with a KPI row (3–5 single numbers), then trends, then detail tables.
- One measure per widget; failed/error series in the danger tone, never the
  accent.
- Time widgets need `event_at`/`created_at` timestamptz columns; funnels and
  kanbans bind to stable status strings — schema rules in workspace-db.
- The canvas tools are missing only when neither the flat
  `agnt_canvas_put_widget` nor the grouped `agnt_canvas_write` (action
  `put_widget`) is listed. Then enable the family:
  `agnt_tools_enable({ families: ['canvas'] })`, or on a grouped server
  `agnt_tools_write` with `action: "enable"` and the same `families`.
  Canvases are on every plan and count against no limit; what the plan caps
  is the workspace database behind them (tables, rows, storage).

## Tool names on grouped servers

New servers list one tool per family with an `action` argument. The flat
names above map to:

| Flat | Grouped tool, action |
|---|---|
| `agnt_canvas_get`, `_introspect_schema`, `_preview_query`, `_chart_render`, `_snapshot`, `_share_list` | `agnt_canvas_read`: `get`, `introspect_schema`, `preview_query`, `chart_render`, `snapshot`, `share_list` |
| `agnt_canvas_put_widget`, `_update_widget`, `_set_layout`, `_share_create` | `agnt_canvas_write`: `put_widget`, `update_widget`, `set_layout`, `share_create` |
| `agnt_canvas_remove_widget`, `_share_revoke` | `agnt_canvas_remove`: `remove_widget`, `share_revoke` |

Flat names still resolve on a grouped server but are not listed, so most
clients will not let you call them: use the grouped tool.

## More

- A canvas over a table a task agent keeps fresh is a live dashboard with
  zero upkeep — pair with the task-agents skill.
- Worked examples with real dashboards: https://superagnt.com/skills

<!-- skill_id: canvas · source: https://github.com/superagnt/plugins -->
