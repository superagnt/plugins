---
description: Verify the superagnt MCP connection, add the Claude connector if it is missing, and show what this workspace can do
---

Verify the superagnt_ MCP connection end to end and report.

1. Call `agnt_tools_list_enabled`. If it succeeds, the connection works:
   skip to step 3.
2. If the superagnt tools are missing, the server is not connected. On
   Claude it connects as a claude.ai connector, not through this plugin.
   Give the user this link and ask them to click Add, then approve on the
   consent screen (it doubles as signup):

   https://claude.ai/customize/connectors/yours?modal=add-custom-connector&connectorName=superagnt&connectorUrl=https%3A%2F%2Fmcp.superagnt.com%2Fmcp&open_in_browser=1

   The link opens in the browser, and the Claude desktop app only loads
   connectors when it starts. So in the desktop app, tell the user in the same
   message: once approved, refresh the app with Cmd+R (Ctrl+R on Windows) or
   quit and reopen it, then come back to this session; the tools are there on
   their next message. In the terminal, the user starts a new session. If the connector
   exists but fails on auth, the user reconnects superagnt in claude.ai under
   Customize, Connectors. Claude Code signed in with an API key (check
   `claude auth status`) never loads connectors: fetch
   https://superagnt.com/agent-setup/prompt.md and use its fallback.
3. Report: tool count, the enabled family labels, and the credit balance
   (`agnt_credits_balance`). Then suggest the single most relevant next step
   given what the user has been working on, nothing more.
