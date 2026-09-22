---
status: research
created: 2026-09-20
updated: 2026-09-20
type: research
---

# Running SEO with AI agents

Not what SEO is, but what practitioners have actually wired up to run it in 2025 and 2026, what it costs, and where it breaks. Evidence: four YouTube builds whose transcripts I read end to end, roughly fifteen X threads from people with receipts, four r/SEO comment threads, and six fetched web sources including Glenn Gabe's August 2026 spam update teardown and a vendor-by-vendor audit of the AI SEO agent market. The market has already sorted itself along one line: every step that consumes an API and produces a document is automated and cheap, every step that publishes is gated by a human, and nobody honest claims otherwise.

## TL;DR

- An audit of twelve shipped AI SEO agent products found nearly every vendor documents an explicit human approval checkpoint before publishing. Only Search Atlas (optional mode) and Scalenut ($89/mo tier and up) document unsupervised publishing at all (fixaeo.com). Being honest about that gate is differentiating right now, not disadvantaging.
- The binding constraint is data access, not the model. A six-agent n8n audit build says "I don't have direct access to live websites" and then hallucinates an audit until a live SEO data API is wired in as an MCP tool, after which the same run costs about 20,000 tokens and 1 minute 40 seconds (YT Jesse Cunningham).
- Agents degrade badly on wide data. CXL split one GSC agent into three after a single agent over 2,000 rows by 6 columns hallucinated and ran 20+ minutes, then found exporting that CSV into Gemini returned the analysis in 3 to 5 seconds (YT CXL).
- Content briefs are the cleanest win with a measured number: 2 hours down to 1 minute of generation plus 5 to 15 minutes of review, 50+ briefs in three months, about 60 hours banked (YT VertoDigital).
- Screaming Frog shipped a native MCP server in v24 (19 May 2026): about 29 tools over 60+ reports, £199/year, 500 URL free tier (screamingfrog.co.uk).
- Where agents publish unsupervised, Google catches it. The August 2026 spam update took an ultra-YMYL site down 200,000+ query rankings for programmatic scale plus AI content chunks, and a thin affiliate site down 14,000+ queries (gsqi.com).
- The programmatic survival threshold is quantified: uniqueness ratios below 30 to 40% are high risk, the canonical failure being 800 words of which 750 are boilerplate, a 6% ratio (digitalapplied.com).
- Practitioner consensus on what never to automate is narrow and consistent: judgment, keyword selection, final fact verification. "You should never automate judgment" (r/SEO, u/hansvangent).
- The fact-checking tax is the most under-modeled cost in any agent content pipeline: drafting was never the bottleneck, sourcing and verifying was, and AI sped up the cheap part while adding fake URLs to clean up (r/SEO, u/PennyLawrence946).
- One agency reports a full SEO/GEO audit-and-fix agent run going from roughly $250 to roughly $25 for the same output (X @HamonPaulm, 796 likes) [single-source].

### Automated technical audits

Point a crawler at a site, pull the issue set, have a model triage it into a prioritized fix list. The most agent-ready surface in SEO: deterministic input, document output, nothing ships.

What changed in 2026 is a first-party MCP. Screaming Frog v24 exposes roughly 29 tools over crawl control, 60+ reports, bulk exports with field selection, URL inspection and embeddings exports. An agency account is specific about both halves: weekly health checks that took 45 minutes of Excel comparison collapse to one pass, pre-launch QA drops from two hours to one run, a client-ready brief lands in under two minutes, but the MCP cannot set crawl speed or user agent (which crashes Shopify sites at 500 URLs in 20 seconds), configure JS rendering, set custom extraction, or switch GA4/GSC accounts. The failure modes matter more than the features: an open modal dialog in the desktop GUI makes MCP calls fail silently, 100% crawl completion does not mean API enrichment finished, concurrent GUI and MCP exports deadlock, and the explicit guidance is never to load 20,000 URLs into a conversation (richvoller.com). [single-source on the numbers]

The lower-cost path is a wholesale SEO data API: four calls (domain rank overview, relevant pages, ranked keywords performance, competitor visibility) into a Google Sheet, on the honest framing that you are buying the same data layer Ahrefs and Semrush resell with a UI on top, paying per run instead of $200 to $300 a month and giving up the charts. The highest-signal call is top-100-organic-pages sorted by count of number-one positions, which surfaces a competitor's money page immediately (his example: an affiliate page ranking number one for 486 queries) (YT Jesse Cunningham).

The best end-to-end pipeline on X is Nick Gray's: a newsletter form feeds Claude Code, which scrapes submitted URLs, runs the audit, checks DA, builds an HTML results page per site and a dashboard of pending audits. He records a Loom, pastes it back, and Claude rips the transcript and drafts the delivery email. 73 audits at roughly 10 minutes each (X @nickgraynews).

**Agent verdict:** crawl, diff, triage and brief run end to end. Applying fixes is a human gate or a PR.

### Keyword research and the competitor teardown

Nobody serious asks a model for "low competition keywords" any more, because it has no volume data and will invent it. Two replacements dominate.

The sitemap teardown needs no keyword tool: pull the competitor's `/sitemap.xml`, dump every URL to a sheet, strip non-SEO pages, infer each page's target keyword from its slug, dedupe, cluster, then feed the list back and ask what is missing, iterating while telling the model which additions you accepted and why (X @Nick_zv_). Cheap, exact rather than estimated, and it recovers a competitor's published strategy rather than a tool's model of it. He extends it with an SEO API backlink pull sorted by `first_seen`, on the argument that the links they just earned are their active strategy rather than their history.

SERP-weakness scanning inverts keyword difficulty: find queries whose results are vulnerable (Reddit threads, Quora, forums, outdated articles, thin listicles, small sites outranking major brands) and report what ranks, why the SERP is weak, and what a better page needs, ignoring difficulty scores. "Keyword difficulty is an estimate. The SERP is evidence" (X @2whazzuup) [single-source as a formalized prompt; the tactic is old].

Practitioners draw a hard line at selection: target keywords can be narrowed down by tools but should be decided by humans (r/SEO, u/who_am_i_to_say_so) [consensus].

**Agent verdict:** discovery, clustering and competitor mapping run end to end. Final selection is a human gate by preference, not by technical limit.

### Keyword to content brief pipelines

The best-measured automation in this research set, and the one to build first.

Verto Digital spent one to two hours per brief on the same loop: take a keyword, search Google, open the top five in tabs, analyze structure, headings, gaps and E-E-A-T, write the brief. At 20 to 30 briefs a month that is 40 to 60 hours. Their replacement: a form trigger, a Firecrawl `/search` call with limit 5 and markdown scraping enabled (the detail that matters, since without the markdown flag you get URL, title and description and no page body), GPT-4.1 mini with Anthropic's think tool to reason across five long documents, a JS node converting markdown to Docs formatting, and a Docs create-then-update pair. One minute to generate, 5 to 15 minutes to review. 50+ briefs in three months, about 60 hours saved, 90% of the time cut, quality held (YT VertoDigital).

CXL builds the same shape differently: a Google Doc per target query holding their article plus the top five competitors' full scraped bodies, with an agent producing common-across-competitors, our-specific-gaps, and a ranked experiment list ("add a jobs-to-be-done section", "add a downloadable template"). They use Firecrawl rather than a browsing agent for a stated reason: a browsing agent is too slow once you hand it 10 to 30 URLs at once (YT CXL).

**Agent verdict:** runs end to end. The brief is an internal artifact, nothing publishes, review is minutes not a rewrite.

### Content generation with QA gates

Practitioners with results converge on outline-approval-then-write, plus a hallucination sweep before publish.

The most complete public spec: scrape the top 10 ranking posts before writing a word, discard forums, Q&As and thin pages, extract the table stakes (topics in three or more of the top posts) and the value adds (what all of them omit), then hand back an outline for approval. The gate is load-bearing, because the model will happily outline garbage. Writing then runs against a brand book with a buzzword blacklist, a problem-agitate-solution intro of 50 to 80 words, 3 to 5 primary sources linked inline, 5 to 10 internal links with 2 to 3 word anchors, and 9 to 11 FAQs aimed at snippets and People Also Ask. A research-assurance pass runs before publish for invented statistics, dead sources and robot voice, and every post carries a real expert byline with name, photo and credentials (X @Nick_zv_). Two structural details worth stealing: write in batches of 5 to 10 with internal linking planned across the whole batch and upload together so interlinks are live on day one, and run an explicit anti-slop pass (cut the AI tells, add screenshots, kill fluff since slop is 2,000 words doing a 500-word job, fact-check everything, read it aloud).

CXL's position is more conservative and comes from a publisher with traffic to lose: the first draft still comes from a human, Claude Code improves existing posts against the gap brief, a copywriter sanity-checks the output, and they are testing whether from-scratch generation can hold their voice rather than assuming it (YT CXL).

The unmodeled cost is verification: drafting was never the bottleneck, sourcing and verifying was (r/SEO, u/PennyLawrence946). Mitigations in that thread are consistent: supply sources yourself as PDFs or links rather than letting it find them, use the most expensive reasoning model, and make it emit a source URL for every claim pulled from outside your supplied set so verification becomes a diff rather than a search. One commenter reports source-hunting is where LLMs collapse "like 80% of the time" (r/SEO, u/Material-Trouble-415). [consensus that the tax is real; contested how large]

A quieter failure matters for anyone shipping skills: guardrails built in Claude sometimes get ignored mid-task, with the model admitting afterwards it winged it (r/SEO, u/von_sip). The cheap defense is a post-hoc self-audit prompt asking whether any checklist step was skipped. [single-source]

**Agent verdict:** research, outline and draft run end to end. Publish is a human gate. Fact verification is a human gate unless the model is constrained to a supplied source set.

### Programmatic SEO with agents

The highest-variance practice, and the one where evidence is genuinely two-sided.

The builder case is real and cheapening. Ian Nuttall shipped a data-driven programmatic site from his phone using four parallel agent threads (research, build, Cloudflare Worker, testing) with 100+ pages indexed, noting pointedly that he has stopped calling them pSEO sites because the term now reads as spam (X @iannuttall). The circulating eight-stage recipe: mine keyword patterns from autocomplete and People Also Ask, build the data layer from APIs or scraped directories, design one high-quality page before scaling, generate against templates with per-page unique stats, auto-link related pages into hubs reachable within 2 to 3 clicks, stage sitemap submission and noindex thin variants, spot-check, prune pages with zero impressions after 60 to 90 days (X @denohawari).

The damage case has case files. Glenn Gabe reports an ultra-YMYL site losing over 200,000 query rankings from programmatic scaling across countries plus AI-generated chunks on individual pages; a thin affiliate site losing over 14,000 queries where padded bottom sections scored 97%+ AI probability; a 1.5 million URL site with roughly 85% of URLs programmatic taking a site-wide hit; and a 250,000+ URL operation losing nearly 25,000 queries. Recovery takes months after cleanup (gsqi.com).

The thresholds separating the outcomes are written down. Pages below 30 to 40% content uniqueness are high risk. Hit sites show around 87% average traffic loss with 60 to 90% ranking drops, impact visible within a median of about 14 days and full recovery in 3 to 6 months. Survival signals: unique per-page data, freshness timestamps tied to real data changes and rendered in both HTML and structured data, 100 to 150 words of human-reviewed editorial context per page, entity markup linked to verified profiles, and external backlinks to individual pages rather than the domain. Entity authority and differentiation signals are estimated at 3 to 4 times the weight of technical signals in recovery. The best engineering rule in the source: give each page type a mandatory non-null unique-data column, and if you cannot populate it, that page type should not exist (digitalapplied.com). Separately: programmatic pages with no internal link from a hub get crawled, indexed once, and deindexed within 60 to 90 days.

Community reaction is market signal. A post reporting a 1,151-page site built in two days with Cursor, 101 keywords and 124 users, drew "Congrats on the slop" (110 points) and a 78-point prediction of deindexing within 30 days, framed as a recurring genre: triumphant launch post, then the "I lost everything" post one to two months later. The most useful critical reply is not moralizing: use your own site as a user and see how much value you get versus false information (r/SEO, u/bikerboy3343). [contested: the disagreement turns entirely on whether a unique data layer exists, and most celebrated launches do not have one]

**Agent verdict:** template design and generation run end to end. Publish volume is a human gate, and that gate should be a scored threshold plus staged rollout rather than a person reading pages.

### Internal linking automation

Undersold and one of the cleanest wins: a graph problem over data you already own, touching no prose. Two patterns work: plan links across a batch at write time so interlinks are live on publication (X @Nick_zv_), and generate a template-driven link graph for programmatic sets where cities link to services and hubs link to children, nothing more than 2 to 3 clicks from an entry point (X @denohawari). Screaming Frog's MCP exposes the internal link graph and broken-link fix list directly, making "crawl, find orphans, propose links, emit a patch" a single agent loop (richvoller.com). The 60-to-90-day deindexing finding turns this from nice-to-have into a hard requirement for any generated page set.

**Agent verdict:** proposal and patch generation run end to end. Merging the patch is a normal code review.

### Rank tracking, decay detection and anomaly alerting

Two jobs that get conflated. Rank tracking proper is harder than it looks because Google publishes no ranking API, so everything runs through third-party SERP infrastructure and proxies (polymathdesk.com). Anomaly alerting on your own data is easier and is where value concentrates: a daily GSC API pull by page and query, a threshold on the delta (drops over 20% is the common figure), and a Slack post, plus a rule for pages dropping more than N positions in a week and indexing anomalies (dev.to, searchcans.com). GSC holds 16 months, so the argument for storing your own copy is to see past that window and catch drops the day they happen rather than when traffic looks wrong.

The agent-specific finding is a warning. CXL built three narrow GSC agents (top-3 at risk of falling out, positions 5 to 10 with upside and downside, positions 10 to 100 with the best shot at page one) after a single agent covering all three ranges produced hallucinations and near-zero accurate data. Even split, runs took 20 minutes inside n8n. What they use daily is exporting the CSV into Gemini with the same prompt, returning in 3 to 5 seconds (YT CXL). The lesson generalizes: do not stream wide tabular data through an agent loop, aggregate first and hand the model a small result set.

**Agent verdict:** collection, thresholding and alerting run end to end. Interpretation is agent-assisted but wants narrow mandates and pre-aggregation.

### Content refresh and decay-driven prioritization

Highest ROI per token here, and most often skipped in favor of publishing more. The prioritization query is simple enough to be a cron job: GSC, last 28 days, export keyword data, filter to positions 4 to 20, prioritize by impressions, improve the existing page rather than write a new one. Interventions: add new sections, extend existing ones, rewrite headings, write for the featured snippet if present (X @jakezward, 206 likes, 339 bookmarks) [consensus among practitioners].

CXL's version adds risk framing rather than only opportunity: which pages sit comfortably top three, which are at 2.6 to 3.0 and at risk of being pushed out, which are at five and within reach, which are about to fall off page one, which of the 10-to-100 group are closest to the line. The resulting gap briefs feed Claude Code via GitHub, which rewrites against the brief and leaves a note on what it changed, with a copywriter sanity-checking (YT CXL).

**Agent verdict:** detection, prioritization and draft rewrite run end to end. Publish is a human gate.

### AI visibility and citation tracking

The newest area and where an agent has the clearest structural advantage, because the work is running many queries and diffing results.

The build is small: query set in a sheet, a SERP API returning the full result page including the AI Overview block and its citations, a conditional branch because not every query triggers one, a split-out node keeping only citation URLs, storage, and an agent that identifies every brand mentioned per query, counts occurrences, tracks yours, and aggregates into share of voice. CXL wrapped theirs in a Lovable web app so non-n8n colleagues could run it.

The second-order move is the valuable one. Take each citation URL, scrape the cited page, and ask the model which part of that page the answer was lifted from, bucketed by depth. Over 100 citations, CXL found 48% extracted from the top 20% of the page, 79% from the upper half, and the remaining 10% at the bottom were purely FAQs. They then ran the obvious experiment, adding a summary box near the top of 15 articles, and reported honestly: one became the primary citation for its query with the answer visibly lifted from the new box, the other 14 showed no change, so they will not call it validated (YT CXL). That is the most intellectually honest result in this research set and it should be the template for how a skill reports its own experiments.

An audit of 33 articles gives a compatible checklist with numbers: get indexed in Bing first, because ChatGPT search overlaps roughly 87% with the Bing index and C-SEO Bench measured improving retrieval-rank position as about 7.6 times more effective than the best content-level tactic; move the answer to a 40 to 60 word paragraph directly under the headline that survives being lifted with no surrounding context; turn headings into questions, because a model pulls a section by its heading; make paragraphs quotable, the test being whether a model could quote and attribute without inventing anything, which needs a number, a named source or a stated vantage point (their median was 38% of paragraphs, target 60%); link out to primary sources (19 of 33 had none); show a date (zero of 33 did), since AI-cited pages run about 26% newer than the organic top ten with half under 13 weeks old. Reported outcome: 30% of articles edited, four hours, +40% AI search visibility (X @SkomorNick) [single-source, method undisclosed, directional].

Two plumbing details gate everything else. ChatGPT search runs on Bing's index and Bing supports IndexNow while Google does not, so setting an IndexNow key and pinging every URL on publish gets pages into Bing in minutes instead of weeks. And check robots.txt for OAI-SearchBot, Claude-SearchBot and PerplexityBot, because Cloudflare now blocks AI bots by default on new sites, and a blocked fetcher means no citation regardless of ranking (X @Nick_zv_). That is the highest-value single check an agent could run on a new client and it costs one request.

**Agent verdict:** runs end to end including the scheduled re-run. Strongest candidate for a default cron.

### Outreach personalization and link prospecting

Most obvious agent shape, most attached risk. The working version is audit-grounded rather than template-grounded: one widely-shared open-source Claude Code implementation runs `/seo prospect "plumbers" "San Francisco"` to find 30 local businesses ranked by close probability, `/seo audit` firing five subagents in parallel across keywords, backlinks, technical issues, content gaps and competitors into a composite score out of 100, `/seo email` to draft outreach built from that prospect's actual weak spots, and `/seo report-pdf` for a client deliverable, all on real SERP-API data (X @0xCristal). The tool-stack version: give the coding agent Serper for SERP research, waterfall email enrichment across Findymail, LeadMagic and Apollo, Apify for scraping, and a wholesale SEO data API for link prospecting, and it becomes the growth org (X @codyschneider).

The r/SEO position is where practitioner consensus and product opportunity diverge most sharply: "Everything can be automated in SEO except the holy grail the Backlinks" (u/ccrrr2), and more reasoned, that producing backlinks needs human evaluation of which links are valuable and whether a site is worth the time (u/Rankingsio).

**Agent verdict:** prospecting, enrichment, audit and draft run end to end. Sending is a human gate, for deliverability as much as ethics.

### The n8n, Make and Zapier genre: what people build and what breaks

The builds are more similar than the thumbnails suggest. Standard skeleton: trigger (form or schedule), a sheet of keywords or URLs, a split-out node so rows process individually rather than as one array, an API call (SerpApi or SearchAPI for SERPs, Firecrawl for page bodies, a wholesale SEO data API for metrics), a conditional branch for the empty case, an LLM node with a narrow mandate, and a write to Sheets, Docs or a CMS. n8n's library carries 9,049 templates of which about 184 are SEO, and the professional advice is to check for an existing one before building (YT CXL). The recurring orchestration pattern is the org chart: one director agent talking to specialist sub-agents, with per-agent model selection so cost and capability branch independently (YT Jesse Cunningham).

What actually breaks, drawn from what presenters show rather than claim: no data connection means confident fabrication; wide tables kill agents; live demos break (both CXL automations failed on stage in a recorded webinar, once mid-run and once on a missing header row, which is itself the finding, that these pipelines are brittle at the plumbing layer not the model layer); markdown formatting is a real step needing a dedicated conversion node, where a node-naming bug separately broke the reference chain (YT VertoDigital); and citations are non-deterministic, with CXL's tracker returning two brand mentions on one run and one on the next for the same query set, so any visibility metric must be a trend over repeated runs. The presenter's conclusion: some parts will break, and doing those manually still leaves you far ahead.

### The tool landscape and what vendors ship

The most useful market map audits twelve products against their own docs and API specs rather than their marketing (fixaeo.com). Prices anchor between $29 and $800 a month: FixAEO free plus $29 (WordPress drafts only), Scalenut from $59 with one-click publishing only from $89, Search Atlas OTTO $99 (meta tags, redirects, broken links, alt text, schema, internal linking, with automatic and approval modes), Otterly AI from $189 (read-only MCP server and Claude Skill, no publish path), Alli AI $249 (JS overlay changes across WordPress, Shopify, Wix, Squarespace, queued until approved), Scrunch AXP $250 platform (CDN-level handling of AI crawler requests), AthenaHQ $295 (brief, revision, draft across six CMS integrations, with a brief-approval endpoint), Profound Aim around $399 with three human checkpoints, and Evertune at $800. Peec AI is recommendation-only by design, Conductor AgentStack has no publish endpoint in its spec, and Relixir Rex claims autonomous publishing while documenting no review steps on pages that previously marketed multi-level approval workflows.

The finding that matters more than any price: nearly every vendor shipping an agent documents an explicit human approval checkpoint, and the gap between autonomy marketing and documented gates is the market's primary failure mode.

## What is contested

**Is SEO dying or restructuring.** The restructuring case: Google organic traffic is down about 2.5% year over year rather than the 25 to 60% figures in circulation, the SEO services market grew from roughly $74.9B in 2025 to roughly $83.98B in 2026, and AI answers read from the same content SEO produces (neilpatel.com, ahrefs.com). The crisis case: zero-click is about 60% of searches and 77% on mobile, organic click share fell 11 to 23 percentage points across verticals between January 2025 and January 2026, BrightEdge measured a 30% average organic decline for pages formerly ranking 1 to 3 on AI Overview queries, and Ahrefs measured a 34.5% CTR drop at position one across 300,000 keywords (150,000 with AI Overviews against 150,000 without), informational queries being 99.2% of AI Overview triggers. Carry one discrepancy: the CXL presenter renders the Ahrefs finding as 58% CTR loss at position one and 50% at two, a different cut than the published 34.5% headline, so cite 34.5% with its methodology. Most practitioners land on repriced rather than dead, with the metric moving from click volume to citation frequency. Steelmanning the crisis side: aggregate stability hides catastrophic vertical-level variance, and "informational content is where the AI Overview eats your lunch" is a real constraint, not a slogan (YT Jesse Cunningham).

**Whether AI-written content is itself a ranking problem.** Google's position is that AI content is fine and scaled low-value content is not. r/SEO splits: one camp says Google does not care and the evidence supports that, the other says the quality gap is visible to readers regardless of detection. Gabe's case files complicate both, because the hit sites combined AI content with programmatic scale, making AI authorship's independent contribution unidentifiable from that evidence.

**How large the fact-checking tax is.** Some report it exceeding the writing time it replaced, others report it manageable if you supply sources up front. Nobody reports it as zero.

**Whether third-party keyword tools still matter.** An active r/SEO thread argues they are becoming irrelevant, partly because Google removed the `num=100` parameter. Unresolved, and it directly affects which data surface an agent depends on.

## Grey hat corner

**Buying links.** 2026 market: average guest post $459, up 7.5% from $427 in 2025, roughly $295 direct versus $461 through a vendor, DR 60+ with real traffic at $700 to $1,500 before markup, Forbes-tier around $10k, floor around $150. Link insertions average $179 to $225, digital PR links $1,250 to $1,500. Agencies bill $3,000 to $10,000 a month, about half of buyers in the $5,000 to $10,000 band. One analysis of 52,671 sites reports only 1.37% of guest post opportunities meet quality standards (buzzstream.com, adsy.com). **Risk: medium to high.** The documented downside: $8,400 spent with one provider over 2024 to 2025, an independent audit showing 86% of the backlink profile toxic, Domain Authority up while rankings and traffic fell, and on complaint the account closed and refunds denied, with the vendor replying in-thread that every campaign was approved in writing. The most useful correction is that DA and toxic-score are third-party vanity metrics Google does not use, so an audit built on them proves less than it appears; the recovery path is stop buying, export links from GSC, attempt removals, disavow the rest, and tighten internal linking and content while Google recrawls (r/SEO, u/MAN0L2).

**Buying the listicle instead of the link.** The sharper version of the same budget: one guest post on a site that already ranks page one for "best [service] in [city]" beats ten cheap links, roughly $1k for one ranking page versus $100 times ten, because ChatGPT reads page one and cites third-party best-of lists rather than your positioning page. You write the post so you control the order, and you select the host by whether it already ranks, not by authority score. The free variant is listicle swaps: publish "best [service] in [their city]" with a peer at number one, they publish the reciprocal with you at number one, and five of these puts you on five ranking lists nobody paid for (X @Nick_zv_). **Risk: medium.** Both are paid or reciprocal links by the letter of the policy, but the value is placement ranking rather than link equity, and the pages are real and relevant, which changes the risk profile.

**Parasite SEO.** Publishing on high-authority third-party hosts to rent their ranking. The 2026 twist is that it is no longer mainly about Google: ChatGPT, Perplexity and AI Overviews lean heavily on LinkedIn, Reddit, YouTube and other large UGC sites, so the play is to occupy as much of the top 10 to 20 as possible across parasites to establish the consensus that gets cited (X @ConnorShowler, who sells a tool for it, discount accordingly). **Risk: high and rising.** The quality floor is visibly low: one widely-shared example is a ranking, fully AI-generated, affiliate-stuffed, anonymously-authored parasite page that still had "SEO Title:" in its meta title from the un-stripped template (X @Charles_SEO). Google has demoted site-reputation abuse since 2024 and hosts periodically purge.

**Mass AI page generation.** **Risk: high.** 87% average traffic loss, 60 to 90% ranking drops, 3 to 6 months to recover after cleanup, with enforcement pattern-matched to mass generation without editorial review, pure template-with-variable substitution, and aggregation adding no context. **DMCA complaints against competitors** appear as an active r/SEO thread and are flagged here only so the skill recognizes the tactic and treats requests for it as out of bounds.

## Agent playbook notes

Mapped onto an agent with SERP, keyword, backlink, on-page and LLM-visibility data, web search and fetch, a Postgres workspace database, cron, and enrichment plus email finding.

**Run unsupervised on a schedule.** Citation tracking, weekly or daily: run the query set, capture AI Overview presence and citation URLs, write to Postgres, report the trend rather than the reading. Anomaly detection, daily: GSC pull by page and query, flag drops over 20% or a position drop past a threshold in a week, alert. Crawl diffing, weekly: re-crawl, diff against the stored crawl, report only the delta. Competitor publishing watch, monthly: pull competitor sitemaps, diff, report new URLs, the cheapest competitive-intelligence loop in SEO and it needs no paid data. Crawler-access check, on every new site and monthly after: fetch robots.txt and verify the AI fetchers are not blocked.

**Run with a human gate.** Content briefs. Article outlines, approved before a word is written. Full drafts, gated on fact verification against a supplied source set rather than a read-through. Technical fix patches, delivered as a diff or PR. Programmatic page batches, gated on a scored threshold with staged release rather than on someone reading pages. Outreach emails, drafted from audit findings, sent by a person. Refresh rewrites, drafted against a gap brief, published by a person.

**Do not run at all.** Final keyword selection, by strong practitioner preference. Link purchasing decisions. Anything that sends or publishes without a named human in the loop.

**Engineering constraints to design in from the start.** Aggregate before handing data to the model, because wide tables produce hallucinations and 20-minute runs. Give each sub-agent one narrow mandate. Store every crawl, SERP snapshot and GSC pull in Postgres so diffing is a query rather than a re-fetch. Put a non-null unique-data field in the schema for any generated page type. Plan internal links across a publishing batch, not per page. Make every generated claim carry a source URL so verification is a diff. Add a post-run self-audit asking whether any checklist step was skipped.

**Sequencing for a new client.** Crawler-access check and IndexNow setup first, one request each and they gate everything downstream. Then the competitor sitemap teardown, which needs no paid data. Then the GSC positions 4 to 20 refresh sweep, the fastest measurable win. Then citation tracking as the standing measurement. New content last, because it compounds slowest and costs most to verify.

## Sources

**X**

- [@nickgraynews, Claude Code SEO audit pipeline](https://x.com/nickgraynews/status/2100727262169448847) : form intake to scrape to audit to HTML report to dashboard
- [@Nick_zv_, reverse-engineering a competitor](https://x.com/Nick_zv_/status/2070129634839326764) : sitemap to slugs to keyword map, plus backlinks sorted by first_seen
- [@Nick_zv_, five AI SEO practices](https://x.com/Nick_zv_/status/2100208340899090933) : the Claude command-center stack over wholesale SEO data APIs, GSC, Apify, Screaming Frog and
- [@Nick_zv_, the 0 to 72 leads workflow](https://x.com/Nick_zv_/status/2099845192383946998) : outline approval before writing, expert bylines, pre-publish hallucination sweep.
- [@Nick_zv_, ranking in LLMs](https://x.com/Nick_zv_/status/2100569712497414640) : buy the ranking listicle, listicle swaps, IndexNow for Bing, robots.txt checks
- [@Nick_zv_, anti-slop checklist](https://x.com/Nick_zv_/status/2069767246248026302) : the concrete pre-publish edit list for AI drafts.
- [@SkomorNick, auditing 33 articles for AI search](https://x.com/SkomorNick/status/2099736099060899904) : Bing first, answer at the top, question headings, quotable-paragraph ratio, visible
- [@denohawari, the programmatic SEO system](https://x.com/denohawari/status/2050559933209591832) : eight stages from keyword patterns to pruning at 60 to 90
- [@iannuttall, shipping a pSEO site from his phone](https://x.com/iannuttall/status/2100303247856775534) : four parallel agent threads, 100+ pages indexed.
- [@jakezward, stop publishing new content](https://x.com/jakezward/status/2100267737578697092) : the GSC positions 4 to 20 refresh sweep.
- [@jakezward, what AI search actually involves](https://x.com/jakezward/status/2099482586560995756) : 28 workstreams against the three-hack version of AEO.
- [@codyschneider, the marketing agent tool stack](https://x.com/codyschneider/status/2099981612733641190) : Serper, Apify, a wholesale SEO data API and waterfall enrichment as the minimum kit.
- [@0xCristal, open-source Claude Code SEO agency repo](https://x.com/0xCristal/status/2100201694198133146) : prospect, five-subagent parallel audit, audit-grounded cold email, client PDF.
- [@HamonPaulm, agent run costs](https://x.com/HamonPaulm/status/2101265909826609278) : a client audit-and-fix run from about $250 to about $25, unverified.
- [@Charles_SEO, a ranking parasite page with the template left in](https://x.com/Charles_SEO/status/2100840425775038562) : how low the parasite quality floor currently is.
- [@ConnorShowler, parasites for AI citations](https://x.com/ConnorShowler/status/2101343567092277731) : occupy the top 10 to 20 with UGC hosts to establish
- [@2whazzuup, the weak-SERP prompt](https://x.com/2whazzuup/status/2101412544414093758) : replace keyword difficulty with evidence Google lacks a good answer.

**YouTube**

- [CXL, "Build an SEO automation engine with n8n"](https://www.youtube.com/watch?v=RZGDkMlmQ18) : the richest source here. AI Overview citation tracking, the 100-citation depth
- [Jesse Cunningham, "I Built 6 SEO n8n Agents to Dominate Google"](https://www.youtube.com/watch?v=BMEClfPZQ2E) : the director-and-specialists pattern, and an agent hallucinating an audit until a live SEO data API
- [Jesse Cunningham, "I Built an SEO Agent That Replaces Manual SEO Work"](https://www.youtube.com/watch?v=-WdA6OZ9RjE) : the four SEO-API calls replacing a $200 to $300/mo tool, and
- [VertoDigital, "Automate SEO Content Briefs: 2 Hours to 15 Minutes"](https://www.youtube.com/watch?v=4M0OTqrVfXY) : the best-measured build, with Firecrawl settings, the think tool, and 60

**Reddit**

- [r/SEO, "What should never be automated in SEO?"](https://reddit.com/r/SEO/comments/1o6oecq/what_should_never_be_automated_in_seo/) : automate data and reporting, never judgment.
- [r/SEO, "Built a 1,151 page website two days ago with Cursor"](https://reddit.com/r/SEO/comments/1pwr3xm/built_a_1151_page_website_two_days_ago_101/) : how the community receives agent-built programmatic sites.
- [r/SEO, "Fact checking ai content is taking longer than writing from scratch"](https://reddit.com/r/SEO/comments/1ujoay0/fact_checking_ai_content_is_taking_longer_than/) : the verification tax and the supply-your-own-sources mitigation.
- [r/SEO, "LinkDaddy Review: $8,400 Spent, 86% Toxic Backlink Profile"](https://reddit.com/r/SEO/comments/1pfr3cv/linkdaddy_review_8400_spent_86_toxic_backlink/) : a grey-hat failure case with the vendor's rebuttal in-thread.

**Web**

- [Glenn Gabe, August 2026 Google spam update case studies](https://www.gsqi.com/marketing-blog/august-2026-google-spam-update-case-studies/) : four impact profiles, including 200,000+ queries lost on a programmatic-plus-AI YMYL
- [FixAEO, best AI SEO agents](https://fixaeo.com/blogs/best-ai-seo-agents/) : the vendor-by-vendor pricing audit and the universal human-approval checkpoint finding.
- [Digital Applied, programmatic SEO after the scaled content ban](https://www.digitalapplied.com/blog/programmatic-seo-after-march-2026-surviving-scaled-content-ban) : numeric survival thresholds and the non-null unique-data column rule.
- [Ahrefs, AI Overviews reduce clicks](https://ahrefs.com/blog/ai-overviews-reduce-clicks/) : 34.5% CTR drop at position one across 300,000 keywords, methodology included.
- [Rich Voller, Screaming Frog v24 MCP agency guide](https://richvoller.com/blog/screaming-frog-v24-mcp-agency-guide) : what the MCP does and does not do, plus the failure
- [Screaming Frog SEO Spider v24 release notes](https://www.screamingfrog.co.uk/blog/seo-spider-24/) : the native MCP server, 19 May 2026.
- [BuzzStream link building pricing 2026](https://www.buzzstream.com/blog/link-building-pricing/) and [Adsy on 52,671 sites](https://adsy.com/blog/how-much-should-you-pay-for-guest-post) : current prices for guest posts, niche edits and digital PR links.
- [Neil Patel, is SEO dead, a data-driven answer](https://neilpatel.com/blog/seo-dead/) : the restructuring side, with market-size and traffic-decline figures.
