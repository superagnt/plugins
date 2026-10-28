# Super SEO: a Claude skill for SEO, by superagnt

superagnt is a marketing plugin for Claude and ChatGPT that helps businesses find customers through outbound, SEO and ads.
Super SEO is one of its skills, and it runs on live data out of the box in
Claude, ChatGPT and Codex.

What it does, step by step, and every file it installs:
https://www.superagnt.com/skills/super-seo

## Install

Claude Code, once the superagnt connector is added to Claude (the
[marketplace README](../../README.md#install) links its dialog):

```
/plugin marketplace add superagnt/plugins
/plugin install super-seo@superagnt
```

In the Claude app (plugins need a paid plan): [add the plugin](https://claude.ai/customize/plugins/new?marketplace=superagnt%2Fplugins&plugin=super-seo).

Codex:

```
codex plugin marketplace add superagnt/plugins
codex plugin add superagnt@superagnt
codex plugin add super-seo@superagnt
codex mcp login superagnt
```

Any agent that reads SKILL.md files:

```
npx skills add superagnt/plugins --skill super-seo
```

ChatGPT and every other client: https://www.superagnt.com/install?skill=super-seo

The skill is plain markdown, [skills/super-seo/SKILL.md](skills/super-seo/SKILL.md).
Read it before you install.
