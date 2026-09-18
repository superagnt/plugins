# Schedules (cron) — task-agents subskill

A schedule starts a session on a DEPLOYED agent on a cron cadence and sends
it a fixed input text. Hosted runtime: fires with the user's machine closed.
Tools: `agnt_schedules_create` / `list` / `update` / `delete` (the
`schedules` family, Automation module — `requires_upgrade` → `confirm_url` →
wait).

## Creating one

`agnt_schedules_create` takes:

- `agent_id` — from `agnt_agents_list`. The agent must be deployed.
- `cron_expression` — standard 5-field cron (minute hour dom month dow).
  Minute resolution is the finest allowed; `* * * * *` is rejected. Unsure
  about an expression? https://crontab.guru reads them back in English.
- `timezone` — IANA name (`Europe/Berlin`); defaults to UTC. Set it to the
  user's zone whenever the cadence is phrased in local time ("every morning").
- `input_text` — the message each firing sends. The run has NO other
  context: the text must carry the whole task, or point at the workspace
  tables that do. Max 8 KB.
- `enabled` — defaults to true: **the schedule is live the moment it is
  created.** Pass `false` to stage it dormant.

## Cadence discipline

- **Confirm the cadence with the human before creating.** Every firing is a
  billed agent run. Nightly beats hourly until proven otherwise; never
  default to minutes.
- Prefer an event over a clock: if the work reacts to something happening,
  a webhook trigger (automations skill) runs exactly when needed and never
  burns an empty run.
- Make runs idempotent — upsert on stable keys (workspace-db skill) so a
  double-fire or retry never duplicates output.
- `agnt_schedules_list` shows the next run; the `observability` family's
  `agnt_observability_list_trigger_runs` shows whether past runs actually
  fired. Check there before declaring a schedule broken.

## Local alternative

If the user wants everything local, use this client's own scheduler if it
has one and keep superagnt as the data + state layer the local run calls
into. Say so plainly rather than forcing the hosted path.
