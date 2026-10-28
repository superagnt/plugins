# Content Ideas Engine: a Claude skill for content ideas from your audience on X, by superagnt

superagnt is a marketing plugin for Claude and ChatGPT that helps businesses find customers through outbound, SEO and ads.
Content Ideas Engine is one of its skills, and it runs on live data out of the box in
Claude, ChatGPT and Codex.

What it does, step by step, and every file it installs:
https://www.superagnt.com/skills/audience-radar

## Install

Claude Code, once the superagnt connector is added to Claude (the
[marketplace README](../../README.md#install) links its dialog):

```
/plugin marketplace add superagnt/plugins
/plugin install audience-radar@superagnt
```

In the Claude app (plugins need a paid plan): [add the plugin](https://claude.ai/customize/plugins/new?marketplace=superagnt%2Fplugins&plugin=audience-radar).

Codex:

```
codex plugin marketplace add superagnt/plugins
codex plugin add superagnt@superagnt
codex plugin add audience-radar@superagnt
codex mcp login superagnt
```

Any agent that reads SKILL.md files:

```
npx skills add superagnt/plugins --skill audience-radar
```

ChatGPT and every other client: https://www.superagnt.com/install?skill=audience-radar

The skill is plain markdown, [skills/audience-radar/SKILL.md](skills/audience-radar/SKILL.md).
Read it before you install.
