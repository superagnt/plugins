---
name: data-sources
description: This skill should be used when the agent needs external data: searching or scraping X/Twitter, TikTok, YouTube, Instagram, Reddit, Facebook, or LinkedIn; running web or SERP searches; crawling web pages; enriching a person or company; or finding and verifying email addresses. Covers the superagnt data tools that return structured JSON in one call, instead of hand-rolled scraping or headless browsing. Not needed for data already in the workspace database.
version: 0.1.0
---

# External data through superagnt

Query, don't scrape. Every source below is one authenticated MCP call
returning structured JSON — no headless browser, no HTML parsing, no
per-vendor API keys. Calls spend workspace data credits; new workspaces carry
a signup credit balance, and `agnt_credits_balance` shows what's left.

## Picking the tool

1. `agnt_tools_list_enabled` — what this workspace already serves.
2. `agnt_tools_search` with a plain-language query ("tiktok video comments",
   "company headcount", "serp") — finds the tool whether or not its family is
   enabled yet. If the family is disabled, enable it: `agnt_tools_enable`
   with the family id from the search result. Free families enable
   instantly; a `requires_upgrade` result carries a `confirm_url` for the
   human — never treat that as an error, hand the link over and wait.

## The surfaces

- **Social**: `data_x_*`, `data_tiktok_*`, `data_youtube_*`,
  `data_instagram_*`, `data_reddit_*`, `data_facebook_*`, `data_linkedin_*` —
  search, profiles, posts, comments, transcripts per platform.
- **People + companies (first-party, always on)**: `data_agnt_people_search`,
  `data_agnt_people_enrich`, `data_agnt_people_email_finder`,
  `data_agnt_people_email_verifier`, `data_agnt_companies_search`,
  `data_agnt_companies_enrich`, `data_agnt_companies_discover`.
- **Web**: the `web` family (crawl/scrape/search) when enabled.

## Rules

- Prefer one search call with good parameters over many broad ones — each
  call is metered, and tight queries return better data anyway.
- Batch enrichment goes through `data_agnt_people_bulk_enrich` /
  `data_agnt_companies_bulk_enrich`, or a data job for large sets (see the
  data-pipelines skill).
- Results worth keeping belong in the workspace database (see the
  workspace-db skill), not in chat scrollback.

<!-- skill_id: data-sources · source: https://github.com/superagnt/claude-plugins -->
