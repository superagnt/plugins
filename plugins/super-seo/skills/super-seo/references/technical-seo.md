---
status: research
created: 2026-09-20
updated: 2026-09-20
type: research
---

# Technical SEO in the AI Overviews Era

Technical SEO has split into two jobs. The classic one: get crawled, rendered, indexed, and do not lose it in a migration. The new one: survive being fetched by a dozen crawlers with different capabilities, most less patient than Googlebot, some of which will click a button on your site. Sources are practitioner log studies, Google's current documentation, and rendering research that injected beacons into Google's Web Rendering Service.

## TL;DR

- Crawl budget constrains almost nobody at SaaS scale. Google scopes its guide to 1M+ page sites, 10k+ pages with daily-changing content, or sites with a large share of URLs in "Discovered - currently not indexed". What people call a crawl budget problem is usually an authority or internal-linking problem wearing a costume, and Google says do **not** use `noindex` to save crawl, because it still requests the page to see the tag (developers.google.com).
- The "rendering budget" is a myth with data against it. Merj and Vercel instrumented 100,000+ Googlebot fetches and found effectively 100% of indexable crawled HTML pages rendered, median delay 10 seconds (vercel.com).
- The JavaScript killer is not JavaScript. It is blocked resources and timing-out APIs. Google Product Expert Dave Smart says the most common JS error is sites blocking their own JS and API calls in robots.txt (YT Experts on the Wire).
- Googlebot crawls only the **first 2MB** of a supported file type, uncompressed, and indexes only what it downloaded (developers.google.com). Framework sites inlining large hydration state are exposed and nobody checks.
- Google's viewport expansion fires lazy-load listeners exactly **once**. Infinite scroll needing a second trigger is invisible, and a hero image without `max-height` pushes main content out of reach (YT Page 2 Podcast).
- AI crawlers are inconsistent: the same user agent sometimes renders and sometimes does not, so any "does it render" table lies by simplification (Zecchini). Googlebot is ~50% of crawler traffic Cloudflare sees, up from 30% year over year (blog.cloudflare.com).
- llms.txt is not fetched by the assistants it claims to serve. One publisher logged 4.4M requests over six months, ~324k from named AI bots: ChatGPT, Claude and Grok fetched pages, not llms.txt (X @TheSEOFramework). Google says it "will neither harm nor help" Search.
- Google states there is **no single page experience ranking signal** and good Core Web Vitals do not guarantee ranking (developers.google.com). The case for speed work is crawl health and conversion, not rank.
- FAQ and HowTo rich results are dead or dying. Schema is an eligibility mechanism for specific features, not a ranking lever, and Google says no special markup is needed for AI features.

### Crawl budget: who actually has one

Crawl budget is the set of URLs Google both *can* and *wants to* crawl. Capacity is a function of your server; demand of size, update frequency, page quality, popularity and staleness relative to the web. Google reserves the guide for sites over one million pages, over ten thousand with daily-changing content, or any site with many URLs stuck in discovered-not-indexed, calling these "a rough estimate" rather than thresholds (developers.google.com).

The mechanics live on the capacity side: if latency rises or the site returns 5xx or HTTP 429, the limit drops and Google crawls less. Sara Taher points at time to first byte as the health indicator and makes the sharpest point in the literature: speed work is high effort with no ranking guarantee, "but if you have a crawl efficiency or crawl budget issue, then it is worth investing in fixing" (YT Sara Taher). That reframes speed from a rank play into an indexing play [consensus].

Two directives people reverse: do **not** use `noindex` to reallocate crawl, because the page is still requested before the tag is seen, and do **not** use robots.txt as temporary reallocation, only as a permanent block. A 404 or 410 is "a strong signal not to crawl that URL again" (developers.google.com). Supporting `304 Not Modified` and keeping `<lastmod>` truthful are the cheap wins.

**Agent verdict:** end to end for monitoring (GSC buckets, TTFB and 5xx correlation, threshold alerts); human gate on which URL classes to kill.

### Discovered vs Crawled, currently not indexed

Different failures, and the split is the most useful diagnostic in the indexing literature. "Discovered" means Google knows the URL and declined to spend a fetch: discovery path, link depth, prioritisation. "Crawled" means Google spent the fetch and declined to index: duplication, or insufficient reason to hold it.

The best protocol in the corpus, from r/TechSEO: before changing anything, confirm the final URL returns 200, is indexable, carries the intended canonical, is in the sitemap, and has at least one ordinary internal HTML link. For Discovered, compare log activity and link depth against indexed peers. For Crawled, diff the rendered page against the raw response, then check whether the page is genuinely distinct from the nearest indexed alternative. That "separates a delivery problem from a page selection problem before you start changing slugs" (r/TechSEO).

A widely repeated tactic for stuck Discovered URLs: edit the slug slightly while keeping the same target, add links from pages that receive traffic, then resubmit (r/TechSEO). Whether the slug or the links did the work is unresolved [contested].

**Agent verdict:** end to end for the split and pre-flight checks; human-gated remediation.

### Index bloat and how to prune without making it worse

The cleanest recent case study is a programmatic SEO postmortem on r/TechSEO. A sitemap of 74,876 URLs, ~62,000 in three programmatic sections, producing ~97% of organic clicks and 78% of impressions at 0.3% CTR and average position ~18. Clicks fell from 207 on 17 August to 13 on 18 August as a spam update rolled out, no manual action. The cleanup cut the sitemap to 9,311. Their summary: "clean technical plumbing cannot rescue a weak page-generation thesis".

The pruning mechanics transfer. Pages with no replacement got a 410 plus an `x-robots-tag: noindex` header. Pages that must stay reachable but should not rank got `noindex`. 301s only where a genuine replacement existed, with a deliberate refusal to redirect thousands of unrelated URLs to a generic page. The comment that decides the strategy: `noindex` alone leaves Google re-crawling low-value pages indefinitely, so it is the wrong tool for dead content. Recovery has not arrived, and the poster is holding the site still so the result stays readable, which is the right call.

Hold the opposing view: in the crawl-log thread, a commenter argues that once the internal linking inflating low-value pages is fixed, you should *unblock* tag and archive pages and spend the time deleting the genuinely duplicate ones. Blocking is the fast fix; deletion is the correct one.

**Agent verdict:** agent-assisted with a hard human gate. It can inventory URL classes and propose a 410/noindex/301 disposition per class; executing deletions unsupervised is how you delete revenue.

### JavaScript and rendering: which myths died

Two things are now well evidenced. First, there is no meaningful rendering backlog. Merj and Vercel instrumented Googlebot with injected beacons across 100,000+ fetches and 37,000+ matched server-beacon pairs on nextjs.org and vercel.com in April 2024: effectively all indexable crawled HTML pages rendered, median delay 10 seconds, 26 seconds at the 75th percentile, ~3 hours at the 90th, ~18 hours at the 99th (vercel.com). Zecchini frames the debunk as a methodology complaint: the claim circulated for years without anyone showing data or mechanism.

Second, JavaScript is rarely the failure. Zecchini: "JavaScript is not really a problem if you think about that. Rendering might be a problem. Implementation is a problem most of the time." The concrete failure is an API called by JavaScript that times out, failing the render while looking like a JavaScript bug. Dave Smart independently names the most common error as sites blocking their own JS and API calls in robots.txt: Googlebot does not fetch subresources like a browser, it queues them, so a blocked resource never arrives and the page fails (YT Experts on the Wire).

Query-string URLs rendered materially slower: 31 minutes against 22 seconds at the 75th percentile, ~8.5 hours against ~2.5 hours at the 90th (vercel.com). A cheap argument for clean paths on anything you need indexed fast. Also confirmed: client-side removal of a `noindex` tag does not work, because Google may skip rendering once it sees `noindex` in the initial HTML.

**Agent verdict:** end to end for detection. Diff raw against rendered main content, check robots.txt against every subresource and API origin, flag query-string-heavy indexable URLs.

### Viewport expansion, lazy loading, and the 2MB wall

Google does not scroll. It renders at a set viewport, then reads the page's rendered height and resizes the viewport to match, firing every scroll listener and IntersectionObserver at once. Zecchini: "this kind of changing in dimension happens only once" (YT Page 2 Podcast). Infinite scroll that appends on a second trigger never gets one, so ensure the content describing the URL is present on first load.

The related trap is the hero image. Without a `max-height`, viewport expansion inflates it too, pushing main content far down. Zecchini checks this on every rendering audit while labelling the ranking consequence an assumption, not a Google statement.

Dave Smart adds the consequence that explains confusing audits: of Google's own tools, only the desktop user agent in the Rich Results Test fires intersection observers and expands the viewport. URL Inspection and the mobile-friendly tools do not, so lazy-loaded content can be missing from a live test while present in the index.

The hard limit nobody audits: "Googlebot crawls the first 2MB of a supported file type, and the first 64MB of a PDF file", on uncompressed data, and "once the cutoff limit is reached, Googlebot stops the fetch and only sends the already downloaded part of the file for indexing consideration" (developers.google.com). React and Next.js pages inlining large serialized state routinely push uncompressed HTML into the megabytes.

**Agent verdict:** end to end. Measure uncompressed HTML size, detect unbounded hero images, and compare a single-expansion render against a full-scroll render.

### AI crawlers and what they actually do

Cloudflare gives the shape. Between May 2024 and May 2025, Googlebot went from 30% to 50% of crawler requests, GPTBot from 2.2% to 7.7% on 305% raw growth, ChatGPT-User grew 2,825%, while ClaudeBot fell 46% and Bytespider collapsed 85%. Only ~14% of the top 10,000 domains carry any AI-specific robots.txt directive, and the most-blocked are GPTBot, CCBot and Google-Extended (blog.cloudflare.com). Googlebot is still half your crawl load, and the AI mix is volatile enough that robots.txt policy needs a review cadence.

Capability is not consistent. Zecchini reports testing Mistral, Bytespider, DuckAssistBot and ClaudeBot and seeing the same user agent sometimes render and sometimes not on identical requests, which is why he will not republish a capability table: readers read the column as a guarantee [single-source, from the person who built the harness]. Non-Google crawlers also use fixed network timeouts around 60 seconds where Google's are dynamic, which is why CDNs increasingly log 429 and 499 against AI bots and rarely against Googlebot.

On llms.txt, one WordPress publisher logged two six-month trials, the latest covering 4.4 million HTTPS requests with ~324,000 from named AI bots, and reports ChatGPT, Claude and Grok fetched pages while llms.txt was fetched only by scanners and checklist tools: "A dumb file at the root of the site does not summon the AI" (X @TheSEOFramework). Google agrees from the other direction: you do not need "new machine readable files, AI text files, markup, or Markdown".

Zecchini's Markdown position is about mechanism. He opposes `.md` suffix files because Google discovers those URLs and you have quietly doubled your crawl surface, and favours content negotiation on the `Accept` header: if a bot sends `Accept: text/markdown`, serve Markdown. He respects Google's advice against Markdown while declining to follow it, on the grounds Google is advising an audience that cannot safely test [contested].

The agent-era finding deserving more attention: Zecchini built pages with correct HTML but deliberately wrong ARIA labels, swapping Cancel and Save, and watched the ChatGPT agent click Cancel while Perplexity clicked correctly. Accessibility markup is now an agent-correctness surface, not just compliance.

**Agent verdict:** end to end. Parse logs by user agent, track the AI-bot mix, measure per-bot error rates, diff what each bot receives.

### Core Web Vitals: what the evidence supports

Google's current page experience documentation undercuts the marketing. It states there is "no single signal", that good Search Console CWV results "doesn't guarantee that your pages will rank at the top", and that "Google Search always seeks to show the most relevant content, even if the page experience is sub-par".

Searching for CWV ranking studies returns a wall of content-marketing pages quoting each other, itself a finding: I could not locate a methodologically credible 2025-2026 correlation study, and the claims that surface are uncited or circular. Treat any specific number about CWV and rankings as unsupported until you see the method [contested, leaning overstated].

The honest case is Zecchini's, from working in web performance before Core Web Vitals existed: the ranking incentive was the lever that finally got the industry to do what conversion data already justified. Add Taher's point that speed becomes load-bearing once you have a crawl-health problem and the policy writes itself: sell it as conversion and crawl capacity, never as a rank play.

One live gap: soft navigations are now measured in Core Web Vitals, but practitioners are asking openly whether soft LCP needs different thresholds and cannot find guidance (X @chrispholder). SPA-heavy products should not assume current thresholds are calibrated for them.

**Agent verdict:** end to end for measurement and regression alerting against CrUX and lab data. Fixes are engineering work.

### Internal linking mechanics

Strategy belongs elsewhere; the mechanics are the crawl story. A 400-page ecommerce crawl-log audit over 90 days found Googlebot hitting paginated archives, near-duplicate tag pages and backlink-less old posts multiple times a week, while the twelve category pages driving 80% of revenue were crawled roughly once every three weeks. The cause was structural: hundreds of global nav and sidebar links pointing at archives, almost nothing in the content layer pointing at categories. After removing or noindexing 60+ tag and archive pages, stripping global sidebar and footer links, and adding 340 contextual in-content links with specific anchors, category crawl frequency went from three weeks to about four days, and eight of twelve target terms moved from page two to page one within three months (r/TechSEO).

The best comment reframes it: on a 400-page site this was never a crawl budget problem, it was an authority-distribution problem that crawl logs made visible. Crawl frequency is a readout of internal PageRank distribution, which makes it a diagnostic instrument even on sites far too small to have a crawl budget.

Taher adds a mechanic from Google's doc: popular URLs get recrawled more often, so linking from genuinely popular pages to pages you want crawled is a legitimate lever. Two rules recur: links must be real `<a href>` elements in the rendered DOM, and Google did not discover a URL-encoded link in the Vercel tests, so anything percent-encoded inside a payload is not a link.

**Agent verdict:** end to end for analysis, human-gated for shipping. Compute click depth, count in-content versus template links, join to crawl frequency, propose source-to-target links with anchors.

### Sitemaps, robots controls and canonicals

Sitemaps are a weak signal and Google says so in its canonicalization ranking: redirects are "a strong signal", `rel="canonical"` is "a strong signal", sitemap inclusion is "a weak signal". What they are good for is discovery speed: the Vercel study found an updated sitemap "significantly reduces, if not eliminates, the time-to-discovery differences" between server-rendered and client-rendered link discovery. They are also a measurement instrument, since splitting sitemaps by page class turns GSC's per-sitemap indexed counts into a free cohort report. `<lastmod>` is only worth having if generated and truthful (YT Sara Taher).

Canonicalization rules worth memorising: do not use robots.txt for canonicalization, because blocked pages can still be indexed; do not use the URL removal tool for duplicates, because it hides every version; do not use `noindex` to steer canonical selection within a site; do include a self-referencing canonical; keep canonicals in the same language and hreflang cluster (developers.google.com). The conflict case bites hardest: specifying different canonicals through different mechanisms on the same page is explicitly a mistake, and it happens constantly when a CMS plugin and a framework both emit one.

**Agent verdict:** end to end. Sitemap freshness, canonical conflicts across HTML versus rendered versus HTTP header, and hreflang reciprocity are deterministic crawl-and-compare checks.

### Structured data that still pays

The direction is contraction. HowTo rich results are gone, and FAQ rich results are scheduled to stop appearing on 7 May 2026, with Rich Results Test support dropping in June 2026 and Search Console API support in August 2026 (searchengineland.com, seroundtable.com, via search; I did not fetch those pages, so confirm the dates against developers.google.com). Before deprecation, FAQ rich results were already restricted to authoritative government and health sites.

The AI angle is settled from Google's side and kills a lot of consulting revenue: "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add" (developers.google.com). What it still does is create eligibility for specific currently-supported features. Implement the types tied to features you can actually appear in, verify in the Rich Results Test, and stop treating schema coverage as a score to maximise.

**Agent verdict:** end to end. Generating, validating and monitoring markup against the supported-type list is mechanical, and valuable precisely because that list keeps shrinking.

### Site migrations

Google's guidance carries the numbers: permanent server-side redirects, 301 or 308; "keep the redirects for as long as possible, generally at least 1 year"; chains "ideally no more than 3 and fewer than 5"; submit both old and new sitemaps and watch the indexed counts cross over; use Change of Address only for a domain or subdomain move. Expect "a few weeks for most pages to move" on a small or medium site, and temporary fluctuation.

The failure modes Google names are exactly what goes wrong: a `noindex` or robots.txt block left on from staging, redirects pointing at broken destinations, insufficient server capacity for the crawl spike, stale sitemaps, and multiple old URLs collapsed onto one irrelevant destination.

Practitioners add two things worth stealing: map URLs one to one *before* build work starts, and monitor rankings and crawl errors for 30+ days after go-live (X @natmiletic). The sharpest redirect point: sending everything to the homepage tells search engines those pages are dead, and a migration finishes when the old URLs stop receiving traffic, not on launch day (X @gaoqian2580). Field tip: `curl -IL` shows the full chain and every Location header the browser hides (X @oldstackjournal).

**Agent verdict:** end to end except the cutover. Build the URL map, QA every redirect, diff pre- and post-launch metadata, run a 30-day watch. The DNS switch is human.

### Log-file analysis

A crawler tells you what is possible; logs tell you what happened. Zecchini names two metrics most teams never compute, time from publish to first crawl and time from update to recrawl, plus a waste metric: how many times a crawler fetches a page *after* publication and *before* the next update, which is pure crawl spent on stale content.

The second use is seeing which URL classes absorb crawl, which is how the ecommerce case found archives crawled weekly and revenue categories every three weeks. The third is bot segmentation: per-bot volume, error rate and capability drift, given AI crawlers hitting fixed timeouts and generating 429s and 499s Googlebot rarely triggers. One crawler nobody watches: Mediapartners-Google, which teams routinely exclude from server-side rendering, so it renders and fetches APIs for nothing (Zecchini).

Caching is the adjacent trap. Google "caches aggressively in order to reduce network requests" and "WRS may ignore caching headers" (developers.google.com). Dave Smart gives the consequences: your JS bundle can serve from Google's cache after a deploy, putting content and code out of sync, and the same applies to the API responses your client-side code fetches, so a freshness-critical feed can render from a stale cached response. Fixes are file-name fingerprinting rather than query-string versioning, since CDNs normalise query strings, and, where freshness matters, a POST request, which is never cached. Two more of his findings: `If-Modified-Since` and `ETag` are honoured but only once Google trusts them, while `Cache-Control` is largely ignored for resources; and Web Worker content often never indexes, with Worker-initiated API calls appearing to "almost always fail" [single-source].

**Agent verdict:** end to end, and the highest-leverage agent job here. Logs are structured, high-volume, boring, and nobody reads them.

## What is contested

**Is "Crawled - currently not indexed" a quality signal or an authority signal?** u/WebLinkr on r/TechSEO argues it is purely authority flow: "Google will index blank pages", there is no objective quality guide anywhere in Google's documentation, and if quality checks worked consistently the index would be free of spam. The fix is links from pages that have traffic. u/Abhi_mech007 in the same thread argues thin content is real, reporting a ten-word page stuck in soft-404 until content was added. Neither has published data, and they are probably describing different failure populations.

**Does the slug-edit-and-resubmit trick work?** Reported repeatedly, mechanism unexplained, confounded with the internal links usually added at the same time. Untested.

**Should Markdown be served to AI crawlers?** Google's Search team advises against it. Merj's Zecchini declines for technically capable teams, arguing `Accept` header content negotiation is an HTTP standard predating the debate, while agreeing `.md` suffix files are a bad idea because they expand your crawlable surface. Both coherent; the disagreement is about audience risk, not mechanism.

**Is Core Web Vitals work worth it for ranking?** Google says no single signal and no guarantee. The open-search evidence for a ranking effect is uncited and circular. The crawl-health and conversion cases are solid. Anyone quoting a ranking lift percentage should be asked for the method.

**Onely's partial-indexing numbers.** Onely claims 10-15% of pages go unindexed without JavaScript dependencies, rising to 40% of an average site's JavaScript-powered content, from a proprietary nine-month dataset. Single-vendor unpublished data, sitting awkwardly next to Vercel and Merj finding essentially everything indexable gets rendered. They may measure different things, page-level rendering versus element-level indexing, but the tension is unresolved [single-source].

**Are AI crawlers getting blocked harder?** A measurement of 1,046 websites across eight crawler identities before and after Cloudflare's 15 September 2026 change found training-crawler refusals rising slightly, ClaudeBot 19.9% to 22.8% and GPTBot 18.9% to 22.0%, while search and agent refusals fell sharply, OAI-SearchBot 16.9% to 3.0% and Perplexity-User 14.9% to 2.2%, with a non-Cloudflare control flat (X @aleyda, citing SeenSureHQ). That is the opposite of what a tightening default predicts, so it either is good news or needs replication.

## Grey hat corner

**Forcing indexation through the Google Indexing API.** Documented use is JobPosting and BroadcastEvent VideoObject only; the tactic points it at ordinary content. An r/TechSEO practitioner split a new 5,000-page programmatic cluster, 2,500 URLs via XML sitemap against 2,500 via Service Account pings, and after seven days reported 8.4% indexed in the control against 94% in the test group, most within 48 hours. The setup detail that trips people: the service account needs **Owner** in Search Console, not Full, or the API returns 403. Price is effectively zero; quota is ~200 URLs per day per project, routed around with multiple projects. Failure modes from the same thread: indexed URLs "start dropping in the next couple of days", people banned for overuse, misuse that "can actually lead to Google crawling your site slower", and John Mueller quoted saying Google sees "a lot of spammers misuse the Indexing API like this". Risk: **medium to high**. It buys a crawl, not retention.

**Parasite and borrowed-authority placement into AI surfaces.** One practitioner claims the only cited source slot in an AI Overview within 24 hours by publishing Gemini-written content on a Google-owned property, reasoning that "Google ALWAYS favours itself" (X @Charles_SEO, 289 likes). Single unverified self-report; mechanism plausible, not demonstrated. The technical cousin, renting a subfolder on a strong domain and reverse-proxying your content into it, is what Google's site reputation abuse policy was written to kill, and it carries manual action risk for the host. Risk: **high** and rising, because the enforcement target is the domain you are borrowing.

**Serving different content to bots than to users.** Dynamic rendering was once Google's own recommendation, retired because implementations drifted out of sync. Zecchini's view is that plenty of companies implemented it correctly and the retirement was about the median implementer. The grey-hat version serves enriched content only to crawlers. Risk: **low** if what the bot gets faithfully represents what the user gets, **high** the moment it does not.

**Not grey hat but widely mis-sold:** llms.txt, GEO scores and schema-coverage percentages. The cost is not a penalty, it is the hour spent turning a checkbox green instead of fixing a page that is actually being fetched (X @TheSEOFramework).

## Agent playbook notes

**Daily:** poll GSC index coverage and alert on movement between buckets, particularly growth in discovered-not-indexed or crawled-not-indexed as a share of submitted URLs. Watch 5xx and 429 rates and TTFB percentiles, which feed the crawl capacity limit directly.

**Weekly:** the render diff. Fetch raw HTML and rendered DOM for a rotating sample plus every changed URL, diff main content, check every subresource and API origin against robots.txt, measure uncompressed HTML against the 2MB limit, detect content appearing only after a second scroll trigger. Separately, segment logs by user agent for per-bot volume, error rate, and publish-to-crawl and update-to-recrawl latencies. Recompute crawl frequency by URL class and join it to revenue attribution, which turns a crawl report into a business report.

**On every deploy:** the regression gate, the cheapest high-value automation here, because the expensive incidents are nearly all deploy accidents. Diff canonicals, robots meta, hreflang reciprocity, titles, descriptions and status codes for the top N URLs against the previous build, and fail loudly on a new `noindex`, a new robots.txt Disallow, a changed canonical, or a redirect chain that grew.

**Monthly:** structured data validation against the supported feature list, sitemap truthfulness including `lastmod` accuracy, redirect chain audit, and an index-bloat report proposing a 410, noindex or 301 disposition per URL class with click and impression evidence attached.

**Human-gated, always:** deleting or noindexing URL classes, the DNS cutover on a migration, anything that changes robots.txt, and any use of the Indexing API outside its documented types.

**What an agent should not attempt:** judging whether a page deserves to exist. The programmatic postmortem above is the failure of automating page generation without a human thesis about why each page should be indexed, and an agent pruning on the logic that generated the bloat will just be wrong faster.

## Sources

**X**

- [@TheSEOFramework, llms.txt log study](https://x.com/TheSEOFramework/status/2099951264909988274) - 4.4M requests, ~324k from AI bots; assistants fetched pages, only scanners fetched llms.txt.
- [@aleyda on Cloudflare's 15 Sept change](https://x.com/aleyda/status/2100557965774270878) - 1,046 sites; training refusals rose, search and agent refusals fell sharply.
- [@aleyda on SERP featurization](https://x.com/aleyda/status/2099915188690633060) - first-page organic results down from 7-8 to 4-5 year over year.
- [@aleyda on Cyrus Shepard's survey](https://x.com/aleyda/status/2100860016005681355) - 130+ experts put brand and crawl eligibility above llms.txt-style tactics.
- [@glenngabe on scraper blocking](https://x.com/glenngabe/status/2100919161283121375) - one recovery appeared in Ahrefs, lagged in Semrush, was missed by Sistrix.
- [@StanSadokov on goto wrappers](https://x.com/StanSadokov/status/2099855506085200270) - encrypted destinations; a plain GET returns a 302 with the real URL.
- [@seorce_ on SERP data access](https://x.com/seorce_/status/2100957368213528873) - one rank tracker reportedly lost ~80% of retrievable data after 13 September.
- [@Linkbuildinghq quoting Sam Torres](https://x.com/Linkbuildinghq/status/2100020790049878080) - crawling, rendering and indexing are distinct; conflating them breaks JS SEO.
- [@shehroze37 on crawl budget](https://x.com/shehroze37/status/2100645773516181587) - most crawl budget issues traced to JS rendering, not robots.txt.
- [@chrispholder on soft navigations](https://x.com/chrispholder/status/2099450556246823175) - asks whether soft LCP needs its own thresholds; finds no guidance.
- [@natmiletic migration checklist](https://x.com/natmiletic/status/2056746565688320252) - map URLs before build starts, QA each redirect, monitor 30+ days.
- [@gaoqian2580 on migration redirects](https://x.com/gaoqian2580/status/2100193126623137913) - never collapse old URLs to the homepage.
- [@oldstackjournal on redirect debugging](https://x.com/oldstackjournal/status/2100345483353018436) - `curl -IL` exposes the full chain and every Location header.
- [@Charles_SEO on parasiting an AI Overview](https://x.com/Charles_SEO/status/2101254605460095252) - claims a sole AI Overview citation in 24 hours; unverified.

**YouTube**

- [Page 2 Podcast with Giacomo Zecchini](https://www.youtube.com/watch?v=cv3CrIMfVbw) - viewport expansion fires once, AI crawlers render inconsistently, and the log metrics that matter.
- [Experts on the Wire with Dave Smart](https://www.youtube.com/watch?v=UYX9QIY-gns) - blocked JS and APIs are the top error; Google ignores Cache-Control; Web Worker content often never indexes.
- [Sara Taher on managing crawl budget](https://www.youtube.com/watch?v=5uP__ArviTQ) - TTFB as crawl-health indicator; speed justified by crawl efficiency, not rankings.
- [Ernesto Ortiz with Patryk Wawok on crawl budget and index bloat](https://www.youtube.com/watch?v=xo3up4hhbaE) - long-form source found; transcript not pulled.

**Reddit**

- [r/TechSEO, crawl log analysis on internal linking](https://www.reddit.com/r/TechSEO/comments/1t0hf8s/crawl_log_analysis_revealed_google_was_wasting/) - category crawl frequency from ~3 weeks to ~4 days after relinking.
- [r/TechSEO, programmatic SEO postmortem](https://www.reddit.com/r/TechSEO/comments/1whus3o/programmatic_seo_postmortem_74876_urls_to_9311/) - 74,876 URLs to 9,311 after a ~95% collapse; 410 plus x-robots-tag for dead content.
- [r/TechSEO, Discovered vs Crawled at scale](https://www.reddit.com/r/TechSEO/comments/1uwrfxu/how_do_you_handle_discovered_vs_crawled_currently/) - the authority-versus-quality argument, plus the best pre-flight diagnostic in the corpus.
- [r/TechSEO, the Indexing API test](https://www.reddit.com/r/TechSEO/comments/1so09pd/bypassing_the_discovered_currently_not_indexed/) - 8.4% versus 94% indexed in a 5,000-URL split test, plus drop-off and ban reports.

**Web**

- [Google, crawl budget for large sites](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget) - the 1M and 10k thresholds, and why noindex is the wrong tool for saving crawl.
- [Vercel and MERJ, how Google handles JavaScript](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process) - ~100% render rate, 10s median delay, query strings materially slower.
- [Google, JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) - crawl-render-index order, aggressive caching, fingerprinting, History API, SPA soft-404s.
- [Google, Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot) - the 2MB uncompressed fetch limit; anything past the cutoff is never indexed.
- [Google, AI features optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) - no special schema, no new machine-readable files, llms.txt neither harms nor helps.
- [Google, page experience](https://developers.google.com/search/docs/appearance/page-experience) - no single signal and no ranking guarantee from good Core Web Vitals.
- [Google, consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) - redirects and rel=canonical strong, sitemaps weak, robots.txt and noindex wrong.
- [Google, site move with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) - 301 or 308, redirects for at least a year, chains under 3 to 5.
- [Cloudflare, from Googlebot to GPTBot](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/) - Googlebot at 50% share; only 14% of top domains carry AI robots.txt rules.
- [Onely, rendering SEO manifesto](https://www.onely.com/blog/rendering-seo-manifesto/) - the 10-15% versus 40% partial-indexing figures; single-source, in tension with Vercel.
