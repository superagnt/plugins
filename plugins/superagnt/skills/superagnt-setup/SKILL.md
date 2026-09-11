---
name: superagnt-setup
description: This skill should be used when a superagnt MCP call fails (401/403, tool not found, missing connection, credit or entitlement errors), when connecting or reconnecting the superagnt server, or when the user asks "what else can superagnt do", about pricing or trials, or how to add more tools, skills, or blueprints. Covers agnt_tools_search and enable, agnt_skills_search, connection links, and the human-confirmed upgrade flow. Money is never charged without a human tap on a confirmation link.
version: 0.1.0
---

# Setup, errors, and finding more

## Connecting / reconnecting

The live setup doc handles every client:
`https://superagnt.com/agent-setup/prompt.md` — fetch and follow it. The
endpoint is `https://mcp.superagnt.com/mcp`, OAuth-first (the consent screen
doubles as signup). Tokens, when a client needs one, are revealed on the
dashboard's MCP page — never invent or reuse one.

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

- `agnt_tools_search` — every tool family, enabled or not, with what it does.
- `agnt_guidance_search` — how-to guidance for building on the platform.
- Blueprints (packaged workflows: skill + tools):
  `https://superagnt.com/blueprints`. A duplicate of an installed skill under
  two names (plugin copy + a loose skills-dir copy) wastes context — keep the
  plugin copy, delete the loose one.

<!-- skill_id: superagnt-setup · source: https://github.com/superagnt/claude-plugins -->
