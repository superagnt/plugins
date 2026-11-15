---
name: automations
description: "This skill should be used when work should be triggered by an event: \"when X happens, do Y\", \"when a form is submitted\", \"when Stripe/GitHub fires a webhook\", \"notify my system when this finishes\", or wiring superagnt to Zapier, Make, or any backend. Covers superagnt inbound and outbound webhooks: receiving events that trigger hosted work, sending signed results out, and inspecting deliveries. For cron-style recurring runs, use the task-agents skill."
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

## First step: create an endpoint

Every inbound flow starts with `agnt_webhooks_create_endpoint`. Give it a
`name` (3-50 characters: lowercase letters, digits and hyphens, unique in the
workspace). The result carries the endpoint's `id` and its `ingest_url`: hand
that URL to the external system, and each POST to it is a delivery in this
workspace.

Decide who signs before creating it, because a signed endpoint refuses an
unsigned request (401):

- **A SaaS with its own signature scheme** (Stripe, GitHub, a sequencer's
  webhooks): `source_kind: "external_integration"`. Signing is off and the
  long random `ingest_url` is the secret, so keep it out of anything public.
- **The user's own code, a form tool or Zapier**: leave the default
  (`external_user`). The result returns `signing_secret` once: store it now,
  or mint a new one later with `agnt_webhooks_rotate_secret`. Each request
  carries `X-Agnt-Webhook-Timestamp` (unix seconds, at most 5 minutes old) and
  `X-Agnt-Webhook-Signature: v1=<hex HMAC-SHA256 of "v1:<timestamp>:<raw body>">`.
  When the sender can't sign, pass `signing_mode: "none"`.

The simplest loop needs nothing else: create the endpoint unbound, hand over
the `ingest_url`, then read what arrived with `agnt_webhooks_receive_recent`
(`endpoint`: the endpoint's id) when the session runs. It is also the way to
see a vendor's real payload before building anything on it.

## Three patterns

Bind the endpoint when creating it, or later with `agnt_webhooks_link_agent`
or `agnt_webhooks_link_data_job`. In the order clients usually need them:

1. **Event → hosted agent.** `agnt_webhooks_create_endpoint` with
   `deployed_agent_id`: every delivery starts a session on that agent with
   the payload — work fires with nobody at a keyboard. Build and deploy the
   agent first (task-agents skill): a delivery to a draft agent fails, one to
   a disabled agent is skipped, and so is one while the agent has a blocking
   config request open (`agnt_agents_list_config_requests` shows it). None of
   them is replayed.
2. **Event → data job.** Bind with `data_job_id` instead: each delivery
   enqueues one job item (raw JSON body as payload). Use for high-volume,
   non-conversational ingestion — a SaaS firing one webhook per record
   (data-pipelines skill).
3. **Agent → outside world.** `agnt_webhooks_create_outbound`
   (`target_kind=external`, the URL) then `agnt_webhooks_send`. Payloads are
   HMAC-SHA256 signed by default; the secret is returned ONCE at creation —
   store it, or `rotate_secret` later. `target_kind=agent` chains two
   deployed agents (signing forced on).

## The webhooks family

Every tool here is the webhooks family (`agnt_webhooks_*`): create and manage
endpoints (`create_endpoint`, `create_outbound`, `update_outbound`,
`list_endpoints`, `link_agent`, `link_data_job`, `set_active`,
`rotate_secret`), read deliveries (`receive_recent`, `list_deliveries`,
`get_delivery`), and `send`. The standard tool profile serves it on every
plan, so a default server lists it with nothing to enable; a server whose
profile leaves it out lists it after
`agnt_tools_enable({ families: ['webhooks'] })`. Plans cap inbound events per
billing period, and deliveries past the cap are refused to the sender. A
`requires_upgrade` result (a plan limit, or a trial or plan that ended)
carries a `confirm_url` for the human. Hand the link over and wait; never
treat it as an error.

`agnt_webhooks_inbound_url` belongs to a deployed agent at run time: it lists
that agent's own endpoints, with a URL that delivers back into the session it
is running. From this client it returns an error: an endpoint's `ingest_url`
comes from `create_endpoint`, or later from `list_endpoints`.

## Debugging deliveries

`agnt_webhooks_list_deliveries` / `get_delivery` show what actually arrived
and how it was acked. Check there before assuming the upstream never fired.

## From the user's own code

A backend that sets up its own endpoints, or reads deliveries without an AI
client, can do it over the REST API instead: `/v1/webhook-endpoints` and
`/v1/outbound-webhook-endpoints` at `https://api.superagnt.com` (create, list,
delete, read deliveries), with a workspace API key the user creates on the API
Keys page of the superagnt app, sent as `Authorization: Bearer <key>`. The
superagnt-setup skill says when REST beats MCP.

## Tool names on grouped servers

This skill writes flat (per-operation) tool names. New superagnt servers list
grouped tools instead: one tool per resource with an `action` argument. Flat
names still resolve there but are not listed, so call the grouped form:

- `agnt_webhooks_inbound_url` / `agnt_webhooks_receive_recent` / `agnt_webhooks_list_endpoints` / `agnt_webhooks_list_deliveries` / `agnt_webhooks_get_delivery` → `agnt_webhooks_read`, action `inbound_url` / `receive_recent` / `list_endpoints` / `list_deliveries` / `get_delivery`
- `agnt_webhooks_send` / `agnt_webhooks_create_endpoint` / `agnt_webhooks_create_outbound` / `agnt_webhooks_update_outbound` / `agnt_webhooks_link_agent` / `agnt_webhooks_link_data_job` → `agnt_webhooks_write`, action `send` / `create_endpoint` / `create_outbound` / `update_outbound` / `link_agent` / `link_data_job`
- `agnt_webhooks_set_active` / `agnt_webhooks_rotate_secret` → `agnt_webhooks_admin`, action `set_active` / `rotate_secret`

`agnt_agents_list_config_requests` is `agnt_agents_read`, action
`list_config_requests`, and `agnt_tools_enable` is `agnt_tools_write`, action
`enable`, on a grouped server. `agnt_tools_search` and
`agnt_tools_list_enabled` keep their names.

## More

- Schedules (cron) moved to the task-agents skill — see its `schedules.md`.
- Setup guide, every client: https://www.superagnt.com/install
- Packaged event-driven workflows: https://superagnt.com/skills

<!-- skill_id: automations · source: https://github.com/superagnt/plugins -->
