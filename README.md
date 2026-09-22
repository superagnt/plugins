# superagnt_ plugins for Claude Code

One install gives your agent the superagnt_ MCP server — every data source
(X, TikTok, YouTube, Instagram, Reddit, LinkedIn, web), people + company
enrichment, a real workspace Postgres, schedules, webhooks and shareable
canvases — plus the skills that teach the workflows.

## Install

```
/plugin marketplace add superagnt/plugins
/plugin install superagnt@superagnt
```

Auth is OAuth on the first tool call; the consent screen doubles as signup.
No tokens, no config editing, no secrets in this repo.

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

- `plugins/superagnt/` — the MCP server config plus eight base skills
  (data-sources, lead-generation, workspace-db, task-agents, automations,
  data-pipelines, canvas, superagnt-setup) and the `/superagnt:connect`
  command.
- `plugins/<skill>/` — one skill per packaged workflow. Read any skill before
  installing; they are plain markdown.

Two rules every skill follows: your agent can propose a paid module (each
has a free trial) but money only ever moves on a confirmation page you open
yourself, and nothing sends outbound (email, posts, DMs) — drafts are the
deliverable.

## Other harnesses

Not on Claude Code? The same setup is one paste in any MCP client:

```
Fetch and execute the appropriate instructions to set me up for superagnt_ from https://superagnt.com/agent-setup/prompt.md
```

## About this repo

Generated from the superagnt monorepo (`tools/claude-plugins/`) — issues and
PRs here are read, but content changes land upstream and sync out. MIT
licensed.
