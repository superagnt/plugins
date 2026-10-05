# superagnt_ plugins for Claude Code

The superagnt_ MCP server gives your agent every data source (X, TikTok,
YouTube, Instagram, Reddit, LinkedIn, web), people + company enrichment, a real
workspace Postgres, schedules, webhooks and shareable canvases. These plugins
carry the skills that teach the workflows.

## Install

1. Add the superagnt server to Claude as a connector: [open the prefilled
   dialog](https://claude.ai/customize/connectors/yours?modal=add-custom-connector&connectorName=superagnt&connectorUrl=https%3A%2F%2Fmcp.superagnt.com%2Fmcp&open_in_browser=1) and click Add. The consent screen doubles as signup. One
   connector covers claude.ai, the desktop app, mobile, Cowork and Claude Code
   signed in with your Claude account. The desktop app only loads connectors
   when it starts, so refresh it with Cmd+R (Ctrl+R on Windows) or quit and
   reopen it after you approve.
2. Install the skills:

```
/plugin marketplace add superagnt/plugins
/plugin install superagnt@superagnt
```

No tokens, no config editing, no secrets in this repo. Claude Code signed in
with an API key doesn't load connectors; use the fallback in
https://superagnt.com/agent-setup/prompt.md.

## Skills

Skill plugins are packaged workflows: the skill plus the tools it needs.
Each pulls the base plugin in as a dependency, so one line installs the whole
stack:

```
/plugin install super-seo@superagnt             # your whole SEO practice, measured and ranked
/plugin install audience-radar@superagnt        # cited post ideas, every morning
/plugin install competitor-mindshare@superagnt  # a daily competitor scoreboard on X
/plugin install gtm-prospecting-desk@superagnt  # scored prospects + drafts, every morning
```

Every skill has a page describing exactly what it does before you install
anything: https://superagnt.com/skills

## What's inside

- `plugins/superagnt/` — eight base skills
  (data-sources, lead-generation, workspace-db, task-agents, automations,
  data-pipelines, canvas, superagnt-setup) and the `/superagnt:connect`
  command (the Codex copy also carries the MCP server config).
- `plugins/<skill>/` — one skill per packaged workflow. Read any skill before
  installing; they are plain markdown.

Two rules every skill follows: your agent can propose a plan upgrade when a
limit is reached, but money only ever moves on a confirmation page you open
yourself, and nothing sends outbound (email, posts, DMs). Drafts are the
deliverable.

## Other harnesses

Not on Claude Code? The same setup is one paste in any MCP client:

```
Install superagnt for me. It's the superagnt plugin from the github.com/superagnt/plugins marketplace, plus the superagnt MCP server (I'll sign in through my browser). The setup guide for each kind of agent is at https://superagnt.com/agent-setup/prompt.md
```

## About this repo

Generated from the superagnt monorepo (`tools/claude-plugins/`) — issues and
PRs here are read, but content changes land upstream and sync out. MIT
licensed.
