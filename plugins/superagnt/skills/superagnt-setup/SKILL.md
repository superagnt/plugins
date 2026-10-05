---
name: superagnt-setup
description: This skill should be used when a superagnt MCP call fails (401/403, tool not found, missing connection, credit, plan limit or trial errors), when connecting or reconnecting the superagnt server, right after a fresh connection (run onboarding first), or when the user asks "what can superagnt do", about pricing or trials, or how to add tools or skills. Covers agnt_onboarding, agnt_platform_map, agnt_tools_search/enable, and the human-confirmed upgrade flow. Money never moves without a human tap on a confirmation link.
version: 0.2.0
---

# Setup, errors, and finding more

## Connecting / reconnecting

The live setup doc handles every client:
`https://superagnt.com/agent-setup/prompt.md` — fetch and follow it. The
endpoint is `https://mcp.superagnt.com/mcp`, OAuth-first (the consent screen
doubles as signup). On Claude the server is a claude.ai connector, not part of
the plugin: give the user https://claude.ai/customize/connectors/yours?modal=add-custom-connector&connectorName=superagnt&connectorUrl=https%3A%2F%2Fmcp.superagnt.com%2Fmcp&open_in_browser=1
(claude.ai's Add custom connector dialog, prefilled) and they click Add. It
opens in the browser, and the Claude desktop app only loads connectors when it
starts: in the desktop app, tell them to refresh it with Cmd+R (Ctrl+R on
Windows) or quit and reopen it once they've approved. Tokens, when a client needs one, are revealed on the dashboard's MCP page —
never invent or reuse one.

## First call on a fresh connection: `agnt_onboarding`

Once tools respond, call `agnt_onboarding` before anything else. Pass a
sentence or two about who the user is and what they want from an agent (ask
them: "tell me a little about yourself and what you'd like automated"), plus
which client this is. It returns the full platform brief — every surface,
what it's for, and live links. Then:

- Save what's relevant to this user in your memory (if this client has one),
  so later sessions skip rediscovery.
- Give the user a short brief of the 3–5 use cases most useful to THEM,
  drawn from what they told you — not the whole catalog.

For a raw capability map any time later (no intent collection, always
current): `agnt_platform_map`.

## Tool names: flat and grouped servers

A server lists its tools one of two ways, fixed when it was created. New
servers (including every new workspace's default server) are **grouped**:
one tool per family and risk level with an `action` argument, e.g.
`agnt_db_write` with `action: "insert"`, `agnt_agents_write` with
`action: "create"`, `data_linkedin_posts` with `action: "reactions"`. Servers
created before grouped tools shipped are **flat**: one tool per operation (`agnt_db_insert`, `agnt_agents_create`,
`data_linkedin_get_post_reactions`). These skills write flat names; on a
grouped server call the grouped tool whose description lists that name as an
action (each action line reads `- insert (agnt_db_insert): ...`). Flat names
still resolve server-side there, but they are not listed, so most clients
will not let you call them.

On grouped servers the `agnt_email_*` tools are
`agnt_inbox_automation_read` / `_write` / `_delete`, and `data_*` results come
back as a compact markdown view. Pass `response_format: "json"` for every
view field as JSON, or `"raw"` for the full upstream payload, when a step
needs a field the table leaves out.

## Error triage

- **401 / auth expired**: re-run the client's login step
  (`claude mcp login superagnt`, `codex mcp login superagnt` or equivalent).
  For a Claude connector, the user reconnects superagnt in claude.ai under
  Customize, Connectors. If the client is token-based, the user re-reveals
  the token in the dashboard.
- **Tool not found**: first check which surface this server lists (see
  "Tool names" above). On a grouped server the operation usually lives inside
  a grouped tool: look for the tool whose description lists it as an action,
  or run `agnt_tools_search`, whose hits carry `grouped_name` and `action`.
  Only a family missing under both names is off: enable it with
  `agnt_tools_enable` (grouped: `agnt_tools_write` with `action: "enable"`);
  every family enables instantly on every plan. Data sources are always on
  for a grouped server, so never enable `data:*` there. After enabling, some
  clients only pick up new tools on reconnect/restart; say so instead of
  calling enable again.
- **`requires_upgrade` with a `confirm_url`**: not an error, and the call did
  not run. The organization hit a plan limit, spent its included or trial
  data credits, or its trial or plan ended; `reason` says which, and the
  result names the next plan and what it unlocks. Give the user the link,
  they review the plan in the browser, then re-run the call. `rate_limited`
  only means wait `retry_after_seconds`. Money moves only on that page, never
  from a tool call.
- **`requires_connection`**: the tool needs the user's own account
  (a vendor integration). The result carries a connect link — hand it over.
- **Credit errors**: `agnt_credits_balance` for the number;
  `agnt_usage_recent` for where it went. Top-ups are dashboard actions. AI
  credits (what running agents spend) are a dashboard top-up on the builder
  plans and during the trial; those plans include data credits only.

## Finding more

- `agnt_platform_map` — the whole platform in one call, with live links.
- `agnt_tools_search` — every tool family, enabled or not, with what it does.
- `agnt_guidance_search` — how-to guidance for building on the platform.
- Packaged skills (a skill plus the tools it needs):
  `https://superagnt.com/skills`.
- Open-source skill library (this plugin's skills and more, MIT):
  `https://github.com/superagnt/leverage`.
- A duplicate of an installed skill under two names (plugin copy + a loose
  skills-dir copy) wastes context — keep the plugin copy, delete the loose
  one.

<!-- skill_id: superagnt-setup · source: https://github.com/superagnt/plugins -->
