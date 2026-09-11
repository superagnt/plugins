---
description: Verify the superagnt MCP connection, complete OAuth if needed, and show what this workspace can do
---

Verify the superagnt_ MCP connection end to end and report.

1. Call `agnt_tools_list_enabled`. If it succeeds, the connection works —
   skip to step 3.
2. If it fails on auth, run the login step for this client
   (`claude mcp login superagnt` when the server was added manually; a
   plugin-carried server triggers OAuth on the first tool call — retry once).
   The consent screen doubles as signup for users without an account. If it
   still fails, fetch https://superagnt.com/agent-setup/prompt.md and follow
   the triage there.
3. Report: tool count, the enabled family labels, and the credit balance
   (`agnt_credits_balance`). Then suggest the single most relevant next step
   given what the user has been working on — nothing more.
