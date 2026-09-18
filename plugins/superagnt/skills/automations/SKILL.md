---
name: automations
description: This skill should be used when work should be triggered by an event: "when X happens, do Y", "when a form is submitted", "when Stripe/GitHub fires a webhook", "notify my system when this finishes", or wiring superagnt to Zapier, Make, or any backend. Covers superagnt inbound and outbound webhooks — receiving events that trigger hosted work, sending signed results out, and inspecting deliveries. For cron-style recurring runs, use the task-agents skill.
version: 0.2.0
---

# Event-driven work on superagnt

Webhooks are how superagnt reacts to the outside world instead of being asked.
An inbound endpoint gives any external system (a SaaS, a form, a backend, a
Zapier zap) a URL that triggers work in the workspace; an outbound endpoint
lets an agent push results to a system the user already runs. This is what
most recurring needs actually are — "when a lead signs up", "when a payment
fails" — an event, not a clock. Reach for a schedule (task-agents skill) only
when no event exists to hook.

## Always available (no setup)

- `agnt_webhooks_inbound_url` — the workspace's inbound ingest URL.
- `agnt_webhooks_receive_recent` — read recent inbound deliveries in-session.
- `agnt_webhooks_send` — POST a payload to a configured outbound endpoint.

The simplest loop needs nothing else: hand the inbound URL to the external
system, then read deliveries with `receive_recent` when the session runs.

## The management family (`webhooks`)

`agnt_webhooks_create_endpoint`, `create_outbound`, `list_endpoints`,
`link_agent`, `link_data_job`, `set_active`, `rotate_secret`,
`list_deliveries`, `get_delivery`. Enable with
`agnt_tools_enable(['webhooks'])` — sold under the Automation module (free
trial); a `requires_upgrade` result carries a `confirm_url` for the human.
Hand the link over and wait; never treat it as an error.

Three patterns, in the order clients usually need them:

1. **Event → hosted agent.** `agnt_webhooks_create_endpoint` with
   `deployed_agent_id`: every delivery starts a session on that agent with
   the payload — work fires with nobody at a keyboard. Build the agent first
   (task-agents skill); a draft agent ingests but does not fan out until
   deployed.
2. **Event → data job.** Bind with `data_job_id` instead: each delivery
   enqueues one job item (raw JSON body as payload). Use for high-volume,
   non-conversational ingestion — a SaaS firing one webhook per record
   (data-pipelines skill).
3. **Agent → outside world.** `agnt_webhooks_create_outbound`
   (`target_kind=external`, the URL) then `agnt_webhooks_send`. Payloads are
   HMAC-SHA256 signed by default; the secret is returned ONCE at creation —
   store it, or `rotate_secret` later. `target_kind=agent` chains two
   deployed agents (signing forced on).

## Debugging deliveries

`agnt_webhooks_list_deliveries` / `get_delivery` show what actually arrived
and how it was acked. Check there before assuming the upstream never fired.

## More

- Schedules (cron) moved to the task-agents skill — see its `schedules.md`.
- Live setup + endpoint reference: https://superagnt.com/agent-setup/prompt.md
- Packaged event-driven workflows: https://superagnt.com/blueprints

<!-- skill_id: automations · source: https://github.com/superagnt/plugins -->
