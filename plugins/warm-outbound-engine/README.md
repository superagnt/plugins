# LinkedIn Warm Outbound: a Claude skill for finding warm leads on LinkedIn, by superagnt

superagnt is a marketing plugin for Claude and ChatGPT that helps businesses find customers through outbound, SEO and ads.
LinkedIn Warm Outbound is one of its skills, and it runs on live data out of the box in
Claude, ChatGPT and Codex.

What it does, step by step, and every file it installs:
https://www.superagnt.com/skills/warm-outbound-engine

## Install

Claude Code, once the superagnt connector is added to Claude (the
[marketplace README](../../README.md#install) links its dialog):

```
/plugin marketplace add superagnt/plugins
/plugin install warm-outbound-engine@superagnt
```

In the Claude app (plugins need a paid plan): [add the plugin](https://claude.ai/customize/plugins/new?marketplace=superagnt%2Fplugins&plugin=warm-outbound-engine).

Codex:

```
codex plugin marketplace add superagnt/plugins
codex plugin add superagnt@superagnt
codex plugin add warm-outbound-engine@superagnt
codex mcp login superagnt
```

Any agent that reads SKILL.md files:

```
npx skills add superagnt/plugins --skill warm-outbound-engine
```

ChatGPT and every other client: https://www.superagnt.com/install?skill=warm-outbound-engine

The skill is plain markdown, [skills/warm-outbound-engine/SKILL.md](skills/warm-outbound-engine/SKILL.md).
Read it before you install.
