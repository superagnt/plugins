# Competitor Tracker: a Claude skill for tracking your competitors on X, by superagnt

superagnt is a marketing plugin for Claude and ChatGPT that helps businesses find customers through outbound, SEO and ads.
Competitor Tracker is one of its skills, and it runs on live data out of the box in
Claude, ChatGPT and Codex.

What it does, step by step, and every file it installs:
https://www.superagnt.com/skills/competitor-mindshare

## Install

Claude Code, once the superagnt connector is added to Claude (the
[marketplace README](../../README.md#install) links its dialog):

```
/plugin marketplace add superagnt/plugins
/plugin install competitor-mindshare@superagnt
```

In the Claude app (plugins need a paid plan): [add the plugin](https://claude.ai/customize/plugins/new?marketplace=superagnt%2Fplugins&plugin=competitor-mindshare).

Codex:

```
codex plugin marketplace add superagnt/plugins
codex plugin add superagnt@superagnt
codex plugin add competitor-mindshare@superagnt
codex mcp login superagnt
```

Any agent that reads SKILL.md files:

```
npx skills add superagnt/plugins --skill competitor-mindshare
```

ChatGPT and every other client: https://www.superagnt.com/install?skill=competitor-mindshare

The skill is plain markdown, [skills/competitor-mindshare/SKILL.md](skills/competitor-mindshare/SKILL.md).
Read it before you install.
