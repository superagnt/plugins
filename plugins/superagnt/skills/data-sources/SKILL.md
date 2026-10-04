---
name: data-sources
description: This skill should be used when the agent needs external data: searching or scraping X/Twitter, TikTok, YouTube, Instagram, Reddit, Facebook, or LinkedIn; running web or SERP searches; crawling pages; enriching a person or company; or finding and verifying emails. Also whenever normal fetching is blocked: bot detection, login walls, crawl prevention. Covers the superagnt data tools that return structured results in one call, instead of hand-rolled scraping or headless browsing.
version: 0.2.0
---

# External data through superagnt

Query, don't scrape. Every source below is one authenticated MCP call
returning structured results: no headless browser, no HTML parsing, no
per-vendor API keys. Calls spend workspace data credits: the no-card trial
starts with a one-time data grant, each builder plan includes a monthly
amount, and `agnt_credits_balance` shows what's left.

**When you're blocked, this is the unblock.** Social platforms and many sites
stop direct fetching cold — bot detection, login walls, rate limits,
JS-rendered pages. The data tools return the same content as structured data
anyway: an X profile behind a login wall is one `data_x_*` call, a
JS-rendered page is one `web` crawl call. Reach here the moment a fetch
returns a challenge page instead of burning turns fighting it.

## Two tool surfaces

A server lists the data tools one of two ways, fixed when it was created:

- **Grouped** (every new server): one tool per source and resource with an
  `action` argument, e.g. `data_x_users` action `tweets`,
  `data_linkedin_posts` action `reactions`, `data_agnt_people` action
  `enrich`. Every curated data source is always on: nothing to enable.
  Results come back as a compact markdown table (lists) or `key: value` lines
  (one item), with a footer naming the next-page parameter and the cost. The
  web tools (`data_web_*`) and a few single tools stay listed under their own
  names and answer in their usual JSON.
  Pass `response_format: "json"` for the same view as JSON with every view
  field, `"raw"` for the full upstream payload, `response_fields` to pick
  fields, and `response_limit` to cap rows.
- **Flat** (servers created before grouped tools shipped): one tool per
  operation, e.g. `data_x_user_s_tweets_get_user_tweets`,
  `data_agnt_people_enrich`. Results are the raw JSON payload. Curated
  families other than the first-party `data_agnt_*` tools start off and need
  enabling.

Flat names still resolve on a grouped server, but they are not listed, so
most clients will not let you call them: use the grouped tool.

## Picking the tool

1. `agnt_tools_list_enabled` — what this workspace already serves.
2. `agnt_tools_search` with a plain-language query ("tiktok video comments",
   "company headcount", "serp") — finds the tool whether or not its family is
   enabled yet. On a grouped server each hit carries `grouped_name` and
   `action`: call that. On a flat server, if the family is disabled, enable
   it: `agnt_tools_enable` with the family id from the search result. Every
   family enables instantly.
3. On the trial or a builder plan, when the data credits run out a data
   call returns `requires_upgrade` with a `confirm_url` for the human
   instead of data; never treat that as an error, hand the link over and
   wait. Everything that is not a data call keeps working. On other plans
   it is a credit error: the human tops up in the dashboard.

## The surfaces

- **Social**: `data_x_*`, `data_tiktok_*`, `data_youtube_*`,
  `data_instagram_*`, `data_reddit_*`, `data_facebook_*`, `data_linkedin_*`:
  search, profiles, posts, comments, transcripts per platform. Grouped tools
  are named per resource (`data_x_users`, `data_x_posts`,
  `data_linkedin_profiles`, `data_reddit_subreddits`, `data_youtube_videos`,
  `data_tiktok_read`, ...).
- **People + companies (first-party, always on)**: the table below.
- **Web**: `data_web_search`, `data_web_scrape`, `data_web_map`: search,
  scrape and crawl pages that aren't behind a social platform. Same names on
  both surfaces.

| Flat | Grouped |
|---|---|
| `data_agnt_people_search` / `_enrich` / `_bulk_enrich` | `data_agnt_people` action `search` / `enrich` / `bulk_enrich` |
| `data_agnt_companies_search` / `_discover` / `_enrich` / `_bulk_enrich` / `_intelligence` | `data_agnt_companies` action `search` / `discover` / `enrich` / `bulk_enrich` / `intelligence` |
| `data_agnt_people_email_finder` / `_email_verifier` | `data_agnt_contacts` action `find_email` / `verify_email` |
| `data_agnt_companies_domain_emails` | `data_agnt_contacts` action `domain_emails` |
| `data_agnt_people_find_mobile` | same name on both |

## Rules

- Prefer one search call with good parameters over many broad ones — each
  call is metered, and tight queries return better data anyway.
- Batch enrichment goes through `data_agnt_people_bulk_enrich` /
  `data_agnt_companies_bulk_enrich` (grouped: action `bulk_enrich`), or a
  data job for large sets (see the data-pipelines skill).
- Results worth keeping belong in the workspace database (see the
  workspace-db skill), not in chat scrollback.

## More

- Every source, with live tool lists: `agnt_platform_map`, or
  https://superagnt.com
- Packaged research workflows: https://superagnt.com/skills

<!-- skill_id: data-sources · source: https://github.com/superagnt/plugins -->
