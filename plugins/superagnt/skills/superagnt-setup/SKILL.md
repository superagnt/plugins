---
name: superagnt-setup
description: This skill should be used when a superagnt MCP call fails (401/403, tool not found, missing connection, credit or entitlement errors), when connecting or reconnecting the superagnt server, right after a fresh connection (run onboarding first), or when the user asks "what can superagnt do", about pricing or trials, or how to add tools or skills. Covers agnt_onboarding, agnt_platform_map, agnt_tools_search/enable, and the human-confirmed upgrade flow. Money never moves without a human tap on a confirmation link.
version: 0.2.0
---

# Setup, errors, and finding more

## Connecting / reconnecting

The live setup doc handles every client:
`https://superagnt.com/agent-setup/prompt.md` — fetch and follow it. The
endpoint is `https://mcp.superagnt.com/mcp`, OAuth-first (the consent screen
doubles as signup). Tokens, when a client needs one, are revealed on the
dashboard's MCP page — never invent or reuse one.

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

## Error triage

- **401 / auth expired**: re-run the client's login step
  (`claude mcp login superagnt` or equivalent). If the client is token-based,
  the user re-reveals the token in the dashboard.
- **Tool not found**: the family is not enabled. `agnt_tools_search` for it,
  then `agnt_tools_enable` — free families enable instantly. After enabling,
  some clients only pick up new tools on reconnect/restart; say so instead of
  retrying blind.
- **`requires_upgrade` with a `confirm_url`**: not an error. The family is
  sold under a named module with a free trial; give the user the link, they
  review price and trial in the browser, then re-run the enable. Money moves
  only on that page, never from a tool call.
- **`requires_connection`**: the tool needs the user's own account
  (a vendor integration). The result carries a connect link — hand it over.
- **Credit errors**: `agnt_credits_balance` for the number;
  `agnt_usage_recent` for where it went. Top-ups are dashboard actions.

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
