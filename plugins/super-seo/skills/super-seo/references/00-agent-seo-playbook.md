---
status: research
created: 2026-09-20
updated: 2026-09-20
type: research
---

# The agent SEO playbook

The operating manual for an agent running SEO end to end for a small SaaS company. The ten dimension notes beside this file hold the evidence, the sample sizes and the contested claims; this file cites them by filename rather than restating them.

Three convictions shape it. **Judgement is the constraint, not data:** a 5,000 keyword universe costs roughly $3 a pull (keyword-research-and-serp.md), so the scarce resource is the human gate, not the API budget. **Detection is the product, publishing is the risk:** every catastrophe in this corpus came from publishing at scale without a thesis, and every cheap win came from reading something nobody reads by hand. **There are two scoreboards now:** zero click is 68.01 percent of US searches and position-one CTR on AI Overview keywords fell 58 percent from December 2023 to December 2025 (ai-search-aeo-geo.md), so a program reporting only sessions looks like it is failing while it works.

## The operating loop

Eight stages, run as a loop rather than a project. Within each, plays are ranked by return per token, best first, and you stop when the next play is worth less than the first play of the next stage.

The deployed tools give third-party SERP, keyword, backlink, on-page and AI-visibility data, web search and scraping, a workspace Postgres database, cron schedules, data jobs, outbound webhooks, canvas dashboards, and people and company enrichment with an email finder and verifier. They do not include Search Console, the only first-party log a site owner gets and worth more than all of it (measurement-algo-updates.md), so ask for it in the first conversation and land it in Postgres with a data job. Where the client refuses, `ranked_keywords` is the proxy and the report says so.

### Stage 1: audit

Find what silently caps everything downstream, not a 200 item issue list.

**1. Crawler access check, the highest value per token in this document.** Fetch `robots.txt` with scraping and diff against the AI user-agent list, separating training crawlers (GPTBot, ClaudeBot) from search crawlers (OAI-SearchBot, PerplexityBot) from user-fetch agents. A blocked search crawler means no citation regardless of ranking, and CDN defaults now move AI visibility more than anything owners do deliberately (ai-search-aeo-geo.md, technical-seo.md).

**2. The indexation split.** Crawl the inventory, tag every URL in Postgres with the template that produced it, and read the buckets as two questions: crawled-not-indexed judges the page, discovered-not-indexed judges the site (technical-seo.md). Track the rate per template, because the level is noise and the slope is signal.

**3. Render and delivery diff.** Fetch raw HTML with scraping, compare against `on-page instant_pages`, then check every subresource and API origin against `robots.txt`, because sites blocking their own JavaScript is the top JS failure. Measure uncompressed HTML against Googlebot's 2MB limit, which framework sites breach and nobody audits (technical-seo.md).

**4. Competitive baseline.** `domain_rank_overview` on client and rivals, `competitors_domain` to find who actually shares their SERPs (usually not who the founder names), `backlinks summary` and `referring_domains` for the link baseline, `domain_technologies` and `domains_by_technology` for companies on the same stack.

**5. The over-optimization audit, which almost nobody runs because the industry default is additive.** Count adjectives and numbers in titles sitewide, schema density, re-date frequency and internal anchor variety: that cluster correlated with core-update declines, not gains (on-page-and-eeat.md). A previous agency's footprint shows here.

Everything lands in Postgres and surfaces on a canvas dashboard, not a PDF, because the audit becomes a live instrument once the crons start.

### Stage 2: keyword and topic map

A maintained asset, not a deliverable. Keep a `source` column so you learn which channel produced ranking pages, and a `measurement_regime` column so no delta is ever computed across Google's September 2025 `&num=100` change (keyword-research-and-serp.md).

**1. Striking distance first, always.** Positions 11 to 50 above an impression floor, ranked by the gap between current and modelled clicks, from `ranked_keywords` refreshed daily by a data job. Pushing 50 to 20 is the cheapest move in SEO.

**2. Competitor teardown, which needs no paid data.** Scrape their `sitemap.xml`, infer each page's target from its slug, verify with `keyword domain_intersection` (seo-with-ai-agents.md). Diff the sitemap monthly: new URLs are their live strategy, not their history.

**3. Discovery across five sources.** `keyword_ideas` and `keyword_overview` for volume and trend, `ranked_keywords` for what is owned, `SERP google organic` for autocomplete and People Also Ask, community scraping for topics with no volume yet, and the client's support tickets and sales calls, the one input a reproducible pipeline cannot copy (content-strategy-topical-authority.md).

**4. Cluster on SERP overlap, never on semantics.** Pull top-10 SERPs, build an adjacency matrix on shared URLs, cluster at a tunable threshold (start at 3 of 10, log outcomes, adjust), re-run monthly. Semantic clustering wearing SERP clustering's clothes merges keywords whose SERPs do not overlap at all (keyword-research-and-serp.md).

**5. Intent by SERP read, not tool label.** `search_intent` is a prior; the SERP is the label. Classify the top 10 by page type with `SERP google organic` plus `on-page instant_pages`, proceed at 7 of 10, and escalate a 5 and 5 split, because that is where expensive mistakes live.

**6. Site-relative difficulty, not a vendor number.** Store the top-10 referring domain distribution, the minimum and median domain rank, the count of forum results (a strong penetrability signal) and the client's own rank, then compute difficulty for this client (keyword-research-and-serp.md).

**7. Business value first, volume last.** Top-of-funnel posts convert at 0.03 to 0.19 percent against pain-point posts at 0.3 to 4.3 percent (content-strategy-topical-authority.md), so lead with category terms, comparisons and alternatives, and jobs-to-be-done queries, carrying CPC from `keyword_overview` as a value proxy.

**8. Kill switches before commitment.** Score SERP similarity on the head term plus five variants and kill the project if nine of ten results look identical. Record pixel depth to the first organic result, since median position one sits roughly 1,000 pixels down (keyword-research-and-serp.md).

### Stage 3: content production

Where agents destroy clients. Refresh before you publish, and publish narrow before wide.

**1. Refresh and decay rewrites, highest ROI per token and most often skipped.** Store clicks, impressions, position and queries daily, then fire the triggers: traffic down 20 percent over 90 days, keywords down five positions, CTR falling on flat impressions. Weight by format, because research pieces shed 89 percent of peak by month three against 61 percent for how-tos (content-strategy-topical-authority.md).

**2. The reproducibility gate, the single highest-leverage check to automate.** Before drafting, the agent answers in writing: could a competitor publish a near-identical page tomorrow from the same prompt and public data? A formatting or comprehensiveness answer blocks the draft (content-strategy-topical-authority.md).

**3. Collection-first drafting.** Treat the model as a collector, not a writer: queries the page already surfaces for including position 80 plus, community threads via scraping, first-party data from Postgres, competitor bodies via `on-page instant_pages`. Store the story angle per page so the pipeline never repeats one.

**4. Outline approval before a word is written.** Extract table stakes (topics in three or more of the top ten) and value adds (what all of them omit), then hand the outline back. The gate is load-bearing because the model will happily outline garbage (seo-with-ai-agents.md).

**5. The content edits that survive controlled testing.** Statistics, quotations and cited sources are the only levers with an experiment behind them (plus 32, plus 41, plus 31 percent), and keyword stuffing measured negative (ai-search-aeo-geo.md). Lead with the answer, keep sections atomic, keep the natural-language slug. Word count correlates with nothing.

**6. Fact verification as a diff, not a read-through.** Make the model emit a source URL for every external claim, then fetch each and confirm it resolves and contains it. Fabricated statistics and real-looking URLs that 404 are the dominant failure, and a second model hallucinates too (seo-with-ai-agents.md).

**7. Publish cadence as a hard config value, not a prompt instruction.** Cap at 25 to 30 pages a week: one case saw indexation fall to 41 percent at 80 a week against 87 percent at 25 to 30. Plan internal links across the batch and publish together, because pages with no hub link are deindexed within 60 to 90 days (seo-with-ai-agents.md).

**8. Programmatic pages only on three predicates.** A data anchor that exists nowhere else on the open web, internal links from at least two hand-written editorial pages, and a SERP that is not already ten identical pages. Every generated page type carries a mandatory non-null unique-data column, or it should not exist.

### Stage 4: on-page and technical hygiene

Making a page eligible to rank is nearly free. Winning the click once eligible is where the recoverable revenue sits, because AI Overviews collapsed CTR on pages whose rankings never moved (on-page-and-eeat.md).

**1. Click-gap and AIO-suppression detection, weekly.** Filter to positions 3 to 20, impressions above 500, CTR below positional par (3 percent at 3 to 5, 2 percent at 6 to 10, 1.5 percent beyond). More valuable still, flag impressions flat while clicks fall: the AI Overview signature, invisible in analytics because nothing moved.

**2. Title rewrite-risk audit.** Google rewrites 61.6 percent of titles, so rewrite-proofing is upstream of CTR testing. Score titles from `on-page instant_pages` on the 51 to 60 character band, separators (dashes stripped 19.7 percent, pipes 41.0 percent), brackets at 77.6 percent, and title-to-H1 alignment, the strongest lever measured (on-page-and-eeat.md).

**3. The deploy regression gate, the cheapest high-value automation in technical SEO.** The expensive incidents are nearly all deploy accidents. Diff canonicals, robots meta, hreflang, titles and status codes against the previous build and fail loudly, wired as a data job fired by an outbound webhook from CI (technical-seo.md).

**4. Internal linking as authority distribution.** Crawl, build the graph, find orphans and cannibalising pairs by query overlap, propose source-to-target links with anchors. One 400 page site moved category crawl frequency from three weeks to four days on relinking alone (technical-seo.md).

**5. The bare-minimum on-page pass, then stop.** Keyword in title, meta, slug, H1, one H2 variation and the first sentence, plus pages deeper than three clicks and pages under three to five internal inlinks (on-page-and-eeat.md). The line is not white against grey, it is restrained against maximised.

**6. Entity and coverage gap analysis, replacing a paid optimizer.** Scrape the top ten with `on-page instant_pages`, extract shared headings and repeated noun phrases, diff against the target. Optimizer scores correlate 0.27 to 0.30 with ranking, so 70 to 80 is a floor and never a target.

**7. Index bloat, proposed and never executed.** Inventory URL classes and propose a disposition each (410 plus `x-robots-tag` for dead content, `noindex` for reachable-but-not-ranking, 301 only where a replacement exists). Noindexing a page already in crawled-not-indexed just moves a row between report buckets.

**8. Two things to stop overselling.** Schema creates eligibility for specific features and is not a ranking lever: a controlled study on 1,885 pages found no citation lift (technical-seo.md). Core Web Vitals carry no single signal and no guarantee, so justify that work by crawl health and conversion.

### Stage 5: links

Almost everything sold as outreach is now a purchase and the price is mostly margin: a vendor guest post averages roughly $461 against roughly $295 direct (link-building-grey-hat.md). The agent's job is not to buy links, it is to stop the client buying badly and to catch decay nobody catches.

**1. Unlinked mention reclamation, the highest-conversion outreach in the discipline.** Well-qualified mentions convert at 15 to 40 percent against 3 to 8 percent cold, and about 20 percent of PR placements ship without a link (link-building-white-hat.md). Daily web search and scraping, diffed against a Postgres mentions table, the writer enriched with the email finder and verifier, a per-article ask queued.

**2. Link decay and liveness monitoring, which no human does consistently.** Every acquired link lands in Postgres with URL, anchor, cost, date and vendor, and weekly the agent re-fetches each host page to verify the link is live, dofollow and indexed. This catches the resell-the-slot scam and the case where only 3,500 of 36,000 links survived (link-building-grey-hat.md).

**3. Vendor and inventory scoring, the only part of paid links that is a skill.** Resolve every offered domain with `domain_rank_overview`, `ranked_keywords`, `backlinks summary` and a scrape for outbound link density. The only defensible proxy for a link's value is whether the linking page itself ranks (measurement-algo-updates.md).

**4. Anchor ratios and listicle watch.** Money-keyword anchor concentration is the documented primary trigger for the rare manual action, so track it from `referring_domains` and alert early. Track the "best X" SERPs with `SERP google organic` too: that list is both the placement prospect list and the AI-visibility target list (link-building-white-hat.md).

**5. Linkable assets and the free channels.** Build the statistics page nobody else can build, with a methodology section stating what the study did not measure (link-building-white-hat.md). Alongside it run broken link scanning, partner and association links, and swap discovery via `backlink domain_intersection`. The volume dial is where an unattended agent gets its operator burned.

**6. Journalist sourcing, drafted and never sent.** Poll the request platforms via web search, score each query against the client's expertise, and draft a reply giving exactly the position the query implies. Write to the AI-summary contract: finding in the first two lines, numbers as bullets, under 300 words (link-building-white-hat.md).

### Stage 6: AI-search visibility

What survived testing is short: be crawlable by the right bots, rank for the sub-queries a prompt fans out into, be mentioned by name in places others own, publish citable facts, stay fresh. Most of what is sold under the AEO and GEO labels has been tested and failed (ai-search-aeo-geo.md). Crawler access is play zero here as well as in stage 1: it is the top-scored factor in the 131 expert survey, it costs one request, and if it is wrong nothing below matters.

**1. Query fan-out mapping, the highest-leverage citation gap available.** Decompose each money prompt into sub-queries, pull positions with `SERP google organic`, and surface where the client sits 11 to 40: pages ranking for fan-out queries were reported 161 percent more likely to be cited (ai-search-aeo-geo.md). Run `SERP google AI-mode` alongside, a surface where only about 19 percent of citations come from the top 20.

**2. Prompt tracking as a cron job plus a table, not a product.** Run a stored prompt set with `ai_visibility llm_mentions`, persist to Postgres, compute share of voice against named competitors, surface it on a canvas dashboard. Report the trend and never the reading, because the same query set returns different counts run to run (seo-with-ai-agents.md).

**3. Competitor citation source analysis.** For every prompt naming a competitor and not the client, fetch and classify the cited sources with scraping. That turns an abstract gap into an addressable list of pages to be mentioned on.

**4. Own-domain comparison inventory, the cheapest underrated play.** Vendor blogs get cited directly because publishers do not write detailed comparisons for every niche (ai-search-aeo-geo.md). Build a few dozen hand-built opinionated alternatives and versus pages with real product access, never a generated matrix of every pairing, which is one of the eight templates that correlated with collapse.

**5. Brand mentions as the actual currency.** Across 75,000 brands, YouTube mentions correlated 0.737 with AI Overview presence and branded web mentions 0.664 against backlinks at 0.218, all weak and confounded by brand size (ai-search-aeo-geo.md). Chase unlinked mentions even when no link will come, and for B2B SaaS keep the G2 profile current.

**6. Plumbing, freshness, and what to skip.** Set an IndexNow key and ping on publish, because ChatGPT search leans on Bing's index and Bing supports IndexNow while Google does not (seo-with-ai-agents.md). Refresh because a page decayed, not on a calendar. Skip `llms.txt`, schema for citations, and mechanical chunking with prescribed word counts.

**7. If the client has a local surface, the pack is a separate system.** Three of the top five factors are fields an agent can edit, review recency outweighs lifetime volume, Google Posts move rankings not at all, and grids run twice daily because "open at time of search" is a top-five factor (local-seo.md).

### Stage 7: measure

Build an instrument the client does not otherwise have, and refuse to report numbers that cannot mean anything.

**1. Never quote macro CTR or macro average position.** A sitewide average position of 19.6 can decompose to 1.0 on one query and 38.5 on another (measurement-algo-updates.md). Build the decomposition in so the useless number is not available to quote.

**2. The three-way decomposition on every material drop.** Impressions flat and clicks down means CTR moved, usually a SERP feature above you. Impressions down and position flat means demand moved. Impressions down and position down means you lost ranking, and that is the only branch worth alerting on.

**3. Click-zone classification.** CTR work only exists in roughly positions 1 to 3 for specific terms and 1 to 7 for large ones; outside it the title could be blank for all the difference it makes. Surface CTR recommendations inside the zone, ranking recommendations outside.

**4. A private volatility index, which beats every public one because the sample is yours.** Public indexes sample a fixed, US-weighted, blue-links-only set, which is why practitioners screamed through June 2026 while dashboards stayed flat. Recompute daily with `SERP google organic` per country and device, storing the distribution rather than the mean (measurement-algo-updates.md).

**5. Penalty against devaluation triage, in order, under an hour.** Manual actions first, every time. Then align the drop against the update calendar, enforcing in code that movement before an announced start is not that update. Then check whether loss is confined to one template, and pull SERPs for lost queries, because a relevancy shift looks identical to a quality demotion in aggregate charts (measurement-algo-updates.md).

**6. Three scoreboards, and attribution on day one.** Measure performance, citation visibility, and input metrics you control (bot activity, crawl latency, entity coverage); most teams measure the middle one and stop. Wire a "how did you hear about us" field to Postgres with an outbound webhook: one case had AI search at 0.5 percent of visits and 12.1 percent of signups.

**7. Calibration the client hears before work starts.** Three to six months to ranking potential, longer in legal, finance and health, and AI brand movement in months not weeks. Recovery from a site-wide classifier is possible, rare and usually partial: 21 percent of 390 plus tracked sites recovered at all eleven months on (measurement-algo-updates.md).

### Stage 8: iterate

Re-derive the site's own CTR-by-position curve monthly and overwrite the benchmark in any forecast: that one job removes the largest source of forecast error. Re-cluster from live SERP overlap, re-run both gap analyses, and keep a fixed cohort panel so the next core update has a baseline instead of a scramble.

Report experiments the way the best practitioner in the corpus did: a summary box added to 15 articles produced one clear citation win and 14 unchanged, so they declined to call it validated (seo-with-ai-agents.md). An agent that reports every intervention as a success is an agent whose reports are worthless.

## The human gates

Short enough to memorise, and they do not move. Everything else runs unattended.

- **Publishing content:** any new page, refresh or programmatic batch. The agent drafts, verifies sources programmatically and stages; a human publishes. The batch gate is a scored threshold plus staged rollout, not a person reading 200 pages, which is theatre.
- **Sending outreach:** any email from the client's domain, any pitch under a named human's byline, any quote attributed to someone who has not seen it, anything posting under an identity in a third-party community.
- **Any purchase:** placements, sponsored posts, expired domains, review incentives. The agent does price discovery and vendor scoring, and never holds the payment method.
- **Disavows:** the agent assembles candidates with evidence, a human decides, and the default answer is no.
- **Deletions and URL inventory changes:** prune execution, noindexing a class, redirect maps, the DNS cutover, any `robots.txt` change. The cost of a wrong delete is asymmetric and irreversible.
- **Business decisions dressed as SEO decisions:** whether to allow training crawlers, whether to assert experience the client does not have, and the forecast number that goes in a board deck.
- **Should this page exist:** higher-stakes than "is this page optimised", and the question agents are worst at, precisely because scaled page generation is what they are best at.

## The white-to-grey ladder

Rungs rise in risk. The agent surfaces the label in chat before proposing the play, never buried in a report, and the gates above bind on every rung.

**Rung 1, clean (risk: none).** Refresh and decay work, internal linking, rewrite-proofing, crawler access checks, mention reclamation, broken link notifications, partner and association links, first-party statistics published to be cited, review requests that are coached but never gated by sentiment (local-seo.md), and customer switch stories published on the customer's own site, the most replicable play here because the claim on your own site is worthless (content-strategy-topical-authority.md).

**Rung 2, defensible but priced (risk: low).** A handful of temporally scattered contextual swaps with niche-adjacent non-competitors, direct-to-publisher insertions on pages that rank and carry traffic, hand-built guest posts with a real editorial reason, reciprocal listicle placements with peers. The failure mode is volume: at scale these become rung 4, because reciprocity and temporal clustering are the detection signals (link-building-grey-hat.md).

**Rung 3, works and is not currently enforced at scale (risk: medium).** Buying listicle placements at $300 to $1,000 plus, where the value is the host page's ranking rather than its equity. Owned extension domains built to shape prompt answers. Disclosed, bylined parasite placements, now asymmetric by region after the August 2026 site reputation abuse split, which forces separate US, EEA and UK tracking. Keyword-in-business-name with a filed DBA. Genuinely adjacent expired domain rebuilds (link-building-grey-hat.md, local-seo.md).

**Rung 4, high risk, and the agent argues against them.** Bought PBN links, since whatever you can buy the casinos bought too. Expired domain 301s into unrelated targets. Bulk parasite syndication. Reddit seeding through aged accounts, where citation share collapsed 86.4 percent in four days in August 2026 and ChatGPT cites only 1.93 percent of the Reddit it retrieves. Fabricated-consensus content farms. Scaled zero-volume generation. CTR manipulation and purchased GPS drives (ai-search-aeo-geo.md, link-building-grey-hat.md, local-seo.md).

**Rung 5, never, and not because of Google.** Buying reviews, paying staff per review, any incentivised or insider review program: the FTC enforces here with penalties past $50,000 per violation and a 2026 settlement on a $4 million judgment (local-seo.md). Also never: fabricated statistics, fabricating first-hand experience in a journalist pitch, and DMCA complaints weaponised against competitors.

One calibration across the ladder: punishment is overwhelmingly silent. With Penguin inside core ranking the default is devaluation with no notice and no reconsideration path, so the downside of rungs 3 and 4 is a slow bleed where metrics degrade for months before traffic does (link-building-grey-hat.md).

## Cadence

**Event-triggered, not scheduled.** Slug and title lint, the reproducibility gate, fact and URL verification, the deploy regression gate fired by an outbound webhook from CI, the IndexNow ping.

**Daily.** Ranking and query data into Postgres tagged with measurement regime and update window. The private volatility index. The three-way decomposition on material drops. Brand mention sweep. Journalist query sweep with replies queued. Region-split rank tracking wherever a hosted placement exists.

**Weekly.** Click-gap and decay detection, because the AI Overview effect moves too fast for monthly. Render diff on a rotating sample plus every changed URL. Log segmentation by user agent. Link liveness and anchor ratios. Template deindexation rate, alerting on slope not level. Cannibalisation sweep re-run over seven days to strip rotation tests. Prompt tracking.

**Monthly.** Re-cluster from live SERP overlap. Competitor sitemap diff. Query fan-out and the 11-to-40 citation gap report. Crawler access re-check, because CDN defaults change without the client knowing. Re-derive the CTR curve. Structured data validation. Index bloat report. Vendor price rollup.

**Quarterly, human-gated.** Consolidation and pruning decisions with 301 targets attached. Over-optimization audit. Portfolio review against the reproducibility test. Topic map rebuild. The honest conversation about which of the quarter's experiments showed anything.

**Per update.** Freeze the pre-window, stop analysing during the rollout, and run the delta report a week after it completes.
