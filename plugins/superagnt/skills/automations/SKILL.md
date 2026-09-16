---
name: automations
description: This skill should be used when the user asks to "run this every day", "on a schedule", "set up a cron", "monitor X and alert me", "keep this updated while I sleep", or "when X happens, do Y". Covers superagnt schedules and webhooks: turning a working one-off task into a recurring job with state in the workspace database and results delivered to chat, email, or a canvas.
version: 0.1.0
---

# Recurring work on superagnt

A task that worked once can keep running with nobody at the keyboard. Two
mechanisms:

- **Schedules** (`agnt_schedules_create` / `list` / `update` / `delete`) —
  cron that starts a session on a DEPLOYED superagnt agent and hands it an
  input text. The runs happen on superagnt's hosted runtime, so they fire
  with the user's laptop closed. Requires a deployed agent to dispatch to.
- **Webhooks** (`agnt_webhooks_*`) — an inbound URL that triggers work when
  an external system posts to it, and outbound sends for delivering results.

## Turning a one-off into a nightly job

1. Get the task working end to end in-session first. Never schedule
   something that has not succeeded once.
2. State must live in the workspace database (workspace-db skill) — a
   scheduled run has no chat history to lean on.
3. Deploy a small runner agent that carries the task's instructions, then
   `agnt_schedules_create` against it. If the lifecycle/schedules tools are
   not enabled, `agnt_tools_enable(['lifecycle','schedules'])` — these are
   sold under the Automation and Agent Runtime modules with free trials: a
   `requires_upgrade` result carries a `confirm_url` for the human. Hand it
   over and wait; never treat it as an error.
4. **Confirm the cadence with the human before creating the schedule.**
   Every firing is a billed agent run and schedules are live on creation.
   Nightly beats hourly until proven otherwise; never default to minutes.
5. Deliver results somewhere the human already looks: a canvas (canvas
   skill), email/chat via the messaging tools when enabled, or a table the
   next session reads.

## The alternative when hosted runs aren't wanted

If the user prefers everything local, use the harness's own scheduler if it
has one, and keep superagnt as the data + state layer the local run calls
into. Say so plainly rather than forcing the hosted path.

<!-- skill_id: automations · source: https://github.com/superagnt/plugins -->
