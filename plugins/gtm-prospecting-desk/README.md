# Outbound Pipeline Engine: a Claude skill for outbound prospecting with verified emails, by superagnt

superagnt is a marketing plugin for Claude and ChatGPT that helps businesses find customers through outbound, SEO and ads.
Outbound Pipeline Engine is one of its skills, and it runs on live data out of the box in
Claude, ChatGPT and Codex.

What it does, step by step, and every file it installs:
https://www.superagnt.com/skills/gtm-prospecting-desk

## Install

Claude Code, once the superagnt connector is added to Claude (the
[marketplace README](../../README.md#install) links its dialog):

```
/plugin marketplace add superagnt/plugins
/plugin install gtm-prospecting-desk@superagnt
```

In the Claude app (plugins need a paid plan): [add the plugin](https://claude.ai/customize/plugins/new?marketplace=superagnt%2Fplugins&plugin=gtm-prospecting-desk).

Codex:

```
codex plugin marketplace add superagnt/plugins
codex plugin add superagnt@superagnt
codex plugin add gtm-prospecting-desk@superagnt
codex mcp login superagnt
```

Any agent that reads SKILL.md files:

```
npx skills add superagnt/plugins --skill gtm-prospecting-desk
```

ChatGPT and every other client: https://www.superagnt.com/install?skill=gtm-prospecting-desk

The skill is plain markdown, [skills/gtm-prospecting-desk/SKILL.md](skills/gtm-prospecting-desk/SKILL.md).
Read it before you install.
