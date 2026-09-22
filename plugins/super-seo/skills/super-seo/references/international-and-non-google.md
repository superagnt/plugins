---
status: research
created: 2026-09-20
updated: 2026-09-20
type: research
---

# International SEO and the Engines That Are Not Google

Two coverage holes in the corpus, failing in opposite directions. International SEO has a technical layer (hreflang) that is genuinely hard, well documented, and mostly not what decides the outcome, while the decision that does decide it (which markets, on what URL structure, with what quality of translation) is made by whoever owns the business. Non-Google engines are the reverse: near-zero effort, and the only question is whether the payoff is real. The 2026 twist is that the standard argument for Bing ("it grounds ChatGPT") has stopped being true, which changes the reason to do it rather than the answer.

Method note: the superagnt MCP tools this corpus uses for X, YouTube and Reddit were dead (expired auth). X posts were fetched individually through the fxtwitter JSON API, YouTube transcripts pulled with `yt-dlp` and read in full, and **Reddit was blocked outright from this network** (direct fetch, `.json`, `.rss`, old.reddit and a reader proxy all refused), so there is no practitioner-forum corroboration layer here. `searchengineland.com` returned HTTP 403 on every attempt and is cited only where another source carries the same fact.

## TL;DR

- **Hreflang is broken almost everywhere it exists.** 67% of implementations had issues across 374,756 domains (ahrefs.com), because of Google's own rule: "If two pages don't both point to each other, the tags will be ignored". It is a signal, not a directive, so it degrades silently rather than erroring.
- **The ccTLD failure mode is authority, not geotargeting.** A brightonSEO case had a .com head-office site outranking the client's own .co.uk on UK branded search purely because the .com had more backlinks (YT brightonSEO, Georgia James). Google's table names the cost: a ccTLD "can only target a single country".
- **Partial hreflang beats none, and is how you get budget for the rest.** Same case: developers refused a 42-domain rollout, so it shipped on **11 homepages** at the worst overlaps, sessions and lead quality rose, and that bought the full rollout.
- **Machine translation at scale is policy-violating and unpunished in practice.** Google's spam policy explicitly names "automated transformations like synonymizing, translating, or other obfuscation techniques", yet Reddit runs 4 to 5 million AI-translated pages per major market, roughly double the prior year, with no manual action (gsqi.com). Carry Glenn Gabe's conclusion: "You are not Reddit."
- **Bing no longer grounds ChatGPT, and this is now measured.** RESONEO captured 1,249 ChatGPT answers with retrieval in July 2026 and found four fetch pipelines, none of them Bing: "We have never observed it, on any account, in any regime, on any date". One retrieved URL in three appears on Google's first page, one in twenty on Bing's. Profound's 240M-citation dataset shows the same curve: ChatGPT-Bing alignment 26% to 8%, ChatGPT-Google 12% to 33%.
- **Bing is still worth an hour, for better reasons.** It out-refers the three major AI assistants combined per Ahrefs data, its SERP genuinely differs (48 of the top 100 domains shared across 10,000 terms), and it shipped the first official AI citation dashboard on 10 February 2026 (X @ViperChill, X @aleyda).
- **IndexNow is real infrastructure with an unresolvable ROI question.** Over 3.5 billion URLs submitted per day and 18% of all new URLs clicked in web search (blogs.bing.com, Dec 2024), but Google never adopted it and no controlled small-site test exists. At plugin-install cost the question barely matters.
- **The non-Google engines that matter are regional, not ideological.** Yandex 70.35% in Russia, Baidu 59.26% in China (Bing second at 18.92%), Naver 43.71% in South Korea, Seznam 15.63% in Czechia, against Bing's 4.5% worldwide (gs.statcounter.com, August 2026).
- **DuckDuckGo is Bing with a different interface** by its own documentation, so it needs no separate work. Brave is the genuine independent index; Ecosia and Qwant's European index went live in Germany on 30 July 2026.
- **The honest call: for a sub-$1M-ARR SaaS with one product and one language, everything here except Bing Webmaster Tools and IndexNow is a distraction.** Localisation follows revenue signal, never precedes it.

### Hreflang: the mechanism, and why two thirds of it is broken

Hreflang declares a page's linguistic and optionally regional variants, in HTML, an HTTP header or an XML sitemap. Google's contract is short and unforgiving: every variant points at every other variant including itself, codes are ISO 639-1 language plus optionally ISO 3166-1 Alpha 2 region, a region code alone is invalid, and "If you use codes that are listed as reserved for something else, Google Search ignores that part of the annotation" (developers.google.com).

The return-tag rule is the whole game: "If page X links to page Y, page Y must link back to page X. If this is not the case for all pages that use hreflang annotations, those annotations may be ignored" (developers.google.com). Ahrefs' scan of 374,756 domains found 67% had issues (ahrefs.com) [consensus]. Semrush's older audit of 20,000 multilingual sites decomposes it: 58% had conflicts within the page source, 37% incorrect hreflang links, 32% potentially missing hreflangs, 21% language mismatch, and inside the conflicts bucket, "in 96% of cases, the page doesn't contain a self-referencing hreflang" (semrush.com, February 2017, so the shape is durable and the levels are dated).

The conceptual trap is wiring hreflang against canonical. Hreflang says show the localised version; a cross-variant canonical says this page is not the authoritative one. Ahrefs supplies the resolution rule: "Hreflang tags are a signal, not a directive". A signal contradicting a directive loses, so: self-referencing canonicals on every locale page, always.

x-default is the most misused value in the spec. Google: it is "used when no other language/region matches the user's browser setting" and "While you can use the x-default value for any page, it was designed for language selector pages". Two misuses follow from ignoring that sentence: pointing x-default at the English/US commercial page, which makes the US page the global fallback and quietly cannibalises every other variant, and omitting it, which leaves everyone outside the declared set unassigned.

**Agent verdict:** end to end for detection and generation, human gate on publish. Building the variant graph and finding missing return tags, invalid codes, hreflang-to-404 targets and canonical conflicts is pure graph work; shipping the tags touches a template.

### Is hreflang worth it at all for a small SaaS

Georgia James, at brightonSEO in October 2025, raised the doubt herself: hreflang is "dying maybe", because "there's been really low uptake and so they've been hinting that they're looking into other avenues of automatic language detection" (YT brightonSEO, "Mastering international SEO with strategic hreflang") [contested, and a read of Google's posture rather than a Google statement].

Her counterargument is not technical. Engines infer geography well but are not mind readers: her client had a .com, a .co.uk, a .us, an .au, a .ca and 42 further generic domains, where the .com was a head-office brochure site not built to convert. In the UK, "the .com was ranking position one for all of their branded search" and outranked the .co.uk on core target keywords "because it had more backlinks", the .co.uk being a recent acquisition. No amount of engine intelligence recovers intent that was never expressed.

Her scoping advice cuts the work down hard. Do not specify language plus region unless multiple pages share a language: "There aren't really many instances with hreflang where you would need to specify a language and a region unless you have multiple pages in the same language, because generally users can make use of the content that you have available even if it is intended for another region." Not every page needs a variant declaration, and mismatched structures mean forcing it "can create loads of 404 pages". Top-level service pages and the homepage are often the whole job.

The budget story is the part worth stealing. When developers refused the 42-domain rollout on cost, the settlement was **11 homepages** at the painful overlaps (the UK and Benelux). Sessions rose, and more importantly "all of the inquiries that were coming through were of much higher quality because they were genuinely intended for that region", which bought approval for the whole UK site plus another ten domains.

**Agent verdict:** end to end for the scoping analysis (which page classes, which locales, the minimum viable subset); human gate on spending development time, because that decision is commercial.

### Generating hreflang at scale without a mapping spreadsheet

The only genuinely new implementation technique in the last 12 months: Gus Pelogia's embeddings method, surfaced by Aleyda Solis in February 2026 (X @aleyda). Crawl each locale with Screaming Frog using its OpenAI integration ("Custom JavaScript > Add From Library > Extract Embeddings"), export Locale, URL and Embedding to CSV, and run it through a Colab notebook matching each URL to its nearest equivalent in every other locale by cosine similarity, returning `Mutual_top`, `Rank` and the score (guspelogia.com).

The number that makes it credible: tested against Semrush's own live hreflang tags it reproduced an "89% match", at "$5 in credits" for thousands of URLs. The author's caveat is the gate: "Blindly trusting an AI output is a bad idea."

This is the highest-leverage international technique for an agent in the corpus, because the reason hreflang does not get implemented is almost never the tags, it is that nobody will build the equivalence map across locales where slugs, page counts and content boundaries do not line up.

**Agent verdict:** end to end for generation at the 89% level, human gate on the remaining 11%, which is exactly where the structural mismatches live.

### ccTLD versus subdirectory versus subdomain

Google publishes a comparison, not a recommendation. A ccTLD gives "Clear geotargeting" and makes "Server location irrelevant", at the cost of being "Expensive (can have limited availability)" and the decisive line, it "can only target a single country". Subdomains are "Easy to set up" and allow different server locations, but "Users might not recognize geotargeting from the URL alone". Subdirectories are "Easy to set up" with "Low maintenance (same host)", against "Single server location" and "Separation of sites harder". URL parameters are flatly "Not recommended" (developers.google.com).

For B2B SaaS the practitioner default is subdirectories, on link-equity grounds: they "inherit the root domain's authority", where ccTLDs "fragment domain authority across multiple domains" (tripledart.com) [consensus among SaaS practitioners]. The brightonSEO case is that sentence's empirical version: the ccTLD did not lose because geotargeting failed, it lost because it was a separate, younger, less-linked domain competing against the company's own .com. Concretely, a ccTLD costs a per-market registration plus a link profile built from zero plus separate Search Console properties plus, on restricted TLDs, a local presence requirement. A subdirectory is a path. A subdomain buys nothing a subdirectory does not unless you need a different stack per region.

Two things to avoid regardless of structure. Google: "Don't use IP analysis to adapt your content. IP location analysis is difficult and generally not reliable", and the SEO-specific version is that Googlebot crawls predominantly from US IPs, so a forced geo-IP redirect means "Google might not crawl, index, or rank all your content for different locales" (sitebulb.com, via Raquel Gonzalez). And do not stretch one ccTLD across markets: a .es serving France is a misdirection the engine reads literally.

**Agent verdict:** not autonomous. A migration-class decision with commercial and legal inputs. An agent builds the memo (existing market signal, link profile per domain, cost per ccTLD, migration risk) and refuses to execute.

### Translation, transcreation, and machine translation at scale

Three products sold under one word. Translation renders the same content in another language. Transcreation rewrites for a market (different examples, objections, proof, and usually different keywords, because the query is not a translation of the query: "chamarras mujer" in Mexico versus "chaquetas mujer" in Spain, at vastly different volumes, per sitebulb.com). Machine translation at volume is a content-generation programme wearing a localisation label.

Google's policy is unambiguous on paper: "Scaled content abuse is when many pages are generated for the primary purpose of manipulating search rankings and not helping users", explicitly including "Scraping feeds, search results, or other content to generate many pages (including through automated transformations like synonymizing, translating, or other obfuscation techniques)" (developers.google.com).

Enforcement does not match the text, and the counter-evidence is enormous. Glenn Gabe has tracked Reddit's AI translation programme for over a year: as of May 2026, roughly 4.5M AI-translated pages ranking for 10.9M queries in France, 4.7M and 10.6M in Germany, 5.2M and 9.5M in Spain, 3.7M and 8.1M in Italy, 4.2M and 10M in Brazil, 2.6M and 3.9M in Turkey, 1.6M and 2.0M in South Korea, roughly double the prior year, with hreflang counts on some pages rising from 22 to 31, and no manual action. Google's hedge is that its "policies do not strictly define content translated by AI as spam" where it provides value (gsqi.com) [single-source but exceptionally well documented]. The correct inference is Gabe's: "You are not Reddit. You don't have their users, their conversations, and their partnership with Google." Enforcement is selective, and a small SaaS publishing a few thousand machine-translated pages sits in the eligible class Reddit does not.

Practitioner consensus on quality is blunter than the policy: "Machine translation without human review destroys credibility overnight" and "even in high English-proficiency countries, native language content significantly outperforms English-only approaches" (X @mattdiggityseo). The same post cites a DeepL survey finding 96% of marketers reported positive ROI from localisation and 65% saw at least 3x [single-source, a translation vendor surveying buyers of translation, so directional at best].

**Agent verdict:** agent-assisted, never autonomous for publication. Draft translation plus market-specific keyword research is in reach; the gate is a native speaker on anything customer-facing, and page count per market follows a decision about the market, never the reverse.

### Sizing demand per market before you localise anything

The cheap version of market sizing does not use a keyword tool. It uses traffic you already have, and it is the same move in two independent sources.

Georgia James' step one is organic users by region compared against what paid is targeting, because channels that can target precisely act as the control group: "if you're noticing huge under representation or over representation in your organic user base, then that's an indication that there is a disconnect somewhere". Her worked example: a large share of an EU site's traffic came from the US, caused by US users searching in Spanish and Portuguese and landing there because no localised US version existed, which is a market signal and a routing bug in one chart. TripleDart points the same instrument at the opportunity: "If 20% of your traffic is from Germany but you never targeted it, that's a goldmine" [consensus].

The second free instrument is self-cannibalisation: "Treat yourself as a competitor. Whatever you use to do competitor research, plug yourself in, all of the different page variants, and see where you're competing with yourself." It is both a diagnosis (the engine cannot tell your variants apart) and a prioritisation signal (these are the page classes where hreflang pays). The third is not a tool: talk to customer service, logistics and sales, because "if something is going wrong with the site, I promise you, people will know about it", and crucially they can say where to leave things alone, since a regional overlap that looks alarming in a chart may not matter if inquiries are routed manually anyway (YT brightonSEO). All three checks cost nothing and run before any translation invoice exists.

**Agent verdict:** end to end. Geo traffic distribution, organic-versus-paid share comparison, cannibalisation detection and a ranked market shortlist are scheduled data work. The interview step is a human's.

### Multi-region pricing and currency pages

Currency is not a locale. Hreflang declares language and optionally region; it does not set currency, and a page differing only in the currency symbol is a duplicate with a different number on it. Google's guidance for country versions with similar content is to "pick a preferred version and use the rel="canonical" element and hreflang tags to make sure that the correct language or regional URL is served to searchers" (developers.google.com).

That is where SaaS pricing pages go wrong, in three ways: canonicalising every regional pricing page to the US one, which makes the others ineligible to rank at all and defeats the purpose of having them; generating a URL per currency (`/pricing?currency=eur`, `/uk/pricing/`) where the only delta is a formatted number, which is index bloat with a business justification attached; and swapping price client-side by IP, leaving one indexable page showing whatever currency Googlebot's US-based IP resolves to.

The defensible shapes are narrow. If price, plan structure, tax treatment or payment methods genuinely differ (VAT-inclusive EU pricing, a local payment rail, different tiers), the regional pricing page is a distinct page, takes a self-referencing canonical, and carries hreflang to its siblings. If only the symbol changes, keep one indexable pricing URL and switch currency by explicit user selection, generating no crawlable URLs. Pricing queries are reported at roughly 5 to 10% of SaaS search volume [unverified, surfaced in search results rather than a fetched study], and the page is bottom of funnel, which is why this trap is expensive when it fires.

**Agent verdict:** end to end for detection (currency-only duplicates, cross-region canonicals suppressing regional pages, geo-IP price swapping on one indexable URL); human gate on consolidation, because deleting a pricing URL is revenue-adjacent.

### Bing in 2026: the reason to do it changed, the answer did not

The standard 2025 argument was that Bing grounds ChatGPT, making Bing Webmaster Tools and IndexNow AEO infrastructure. That argument is now measurably wrong, and it is the most important finding here.

RESONEO instrumented ChatGPT's retrieval in July 2026: 1,249 answers with retrieval captured, 88,000 search results, 26,900 distinct pages across 6,400 domains, plus 7,782 results carrying internal metadata naming the pipeline that fetched each one. Four engines appear: `labrador` (OpenAI's in-house index), `bright` (a Google scrape), `oxylabs` (a Google scrape for news) and `serp`. On Bing: "A fifth engine, named bing, has been reported by other researchers. We have never observed it, on any account, in any regime, on any date" (think.resoneo.com). Overlap follows the pipelines: "One URL in three shows up on Google's first page" while "Only one in twenty on Bing". The same study found "13% of snippets run more than a month behind the crawl". Profound's longitudinal read agrees from a different dataset of 240 million ChatGPT citations with a 1,000-prompt focused analysis: ChatGPT-Bing alignment fell 26% to 8% while ChatGPT-Google rose 12% to 33%, framed as "ChatGPT is leaving Bing behind fast", with the caveat that most citations match neither index (tryprofound.com) [consensus across two independent datasets].

Three justifications survive, and they are better ones.

**Traffic that already exists.** Bing sits at 4.5% worldwide (gs.statcounter.com, August 2026), and Glen Allsopp reframes it from the referral side: "Ahrefs data shows it still drives more traffic than the three major AI assistants combined. Yet it gets 1/100th of the attention" (X @ViperChill, September 2025) [single-source, consistent with Ahrefs' repeated finding that AI referral traffic is a fraction of a percent of the web].

**A genuinely different SERP.** Allsopp took 10,000 hand-picked "best [product]" terms across both engines: only "48 domains are present in both search engines' top 100", "Just 162 of the top 500 domains in each overlap", both rank a similar breadth (12.2K versus 12.4K domains) but "Google promotes far fewer individual URLs: 82K versus 120K", and "Bing is FAR more likely to rank questionable sites". Reddit ranks badly in Bing, which he attributes to Reddit having blocked Microsoft's crawler. A SERP overlapping a third of the top 100 is a separate opportunity surface for a site that cannot win the Google version.

**Free reporting nobody else gives you.** AI Performance shipped in Bing Webmaster Tools on 10 February 2026: total citations, average cited pages, grounding queries (the phrases the AI used when retrieving content) and page-level citation activity, called by Aleyda Solis "the first official AI search visibility dashboard directly provided by platforms". The limits matter as much: "No intent or sentiment analysis, or an extract of the answers to check. Also, no data from other brands/sites, only yours" (X @aleyda) and "No clicks data. No CTR" (X @glenngabe). Coverage is Copilot and Bing's own AI summaries, not ChatGPT: "This is only for Microsoft Copilot" (YT Kasra Dash), who sizes Copilot at roughly 100 million monthly users with 15 million paying [single-source, uncorroborated]. Intents, Topics, Citation Share and a compare feature landed by 17 June 2026 (X @rustybrick). Two facts make setup a sub-hour job: the tool imports a verified property straight from Google Search Console, so verification is a login rather than a DNS change, and the grounding-queries report doubles as a content-ideas feed, Kasra Dash's own example being a run of tax questions he had no articles for, surfaced because Copilot cited him adjacently.

**Agent verdict:** end to end. Property import, IndexNow wiring, a weekly pull of citations, grounding queries and cited pages, and a diff against the Google Search Console query set to find Bing-only queries.

### IndexNow: adoption is real, measurable effect is not

IndexNow is a push protocol: publish a key file at the domain root, POST changed URLs, and participating engines are told rather than left to discover. Microsoft reports "over 3.5 billion URLs submitted per day" and, more interestingly, "18% of all new URLs clicked in web search results" arriving via IndexNow, with GoDaddy, the Internet Archive and Condé Nast among recent adopters (blogs.bing.com, 12 December 2024). Independent reporting gives lower and different numbers: "60 million websites are now joining IndexNow daily, and 1.4 billion URLs are being submitted each day", with eBay, LinkedIn and GitHub named and support limited to Bing and Yandex (ppc.land) [contested; the two figures cannot both describe the same quantity at the same date].

Google has never adopted it. Mueller's response at launch in October 2021 was "we too, would like to be crawled less often", and Google's own push mechanism, the Indexing API, remains "restricted to job postings and live streaming content" (ppc.land). Bing pairs IndexNow with sitemaps rather than replacing them: "The lastmod field in your sitemap remains a key signal, helping Bing prioritize URLs for recrawling and reindexing, or skip them entirely if the content hasn't changed since the last crawl" (blogs.bing.com July 2025, quoted in X @glenngabe).

What no source produced is a controlled test on a small site showing IndexNow changed a business outcome. The speed-ups circulating in 2026 ("up to 95% faster index inclusion") appear only in undated vendor posts with no methodology and were not citable [unverified]. Honest position: it measurably changes time-to-discovery on engines that accept it, does nothing for Google, and on a site publishing a handful of pages a week that difference is unlikely to show up in revenue. That is not an argument against doing it, because the cost is a plugin. It is an argument against spending any thought on it after the first hour.

**Agent verdict:** end to end. Key generation, key file placement and a submit-on-publish hook get wired once and never discussed again.

### DuckDuckGo, Brave and Ecosia: what they actually source from

The privacy engines get treated as one bucket. They have materially different supply chains, which is the only thing about them that affects SEO.

**DuckDuckGo** is downstream of Bing by its own account: it names specialised sources for instant answers, crowd-sourced sites like Wikipedia, its own crawler DuckDuckBot, and states it "largely sources" traditional links and images "from Bing" (duckduckgo.com help pages). It is not a separate optimisation target; Bing Webmaster Tools covers it. It sits at 0.7% worldwide (gs.statcounter.com, August 2026).

**Brave Search** is the genuine independent. Brave removed its last Bing API calls, which had covered "about 7% of query results", announcing that "Every Web search result seen in Brave Search is now served by our own index", averaging "about 22 million queries per day" at that point (brave.com, 27 April 2023). Independence makes it a crawl-access question rather than a ranking question, and crawl access is already the top-ranked AI-visibility factor in the corpus (see `ai-search-aeo-geo.md`).

**Ecosia and Qwant** are mid-migration. Both leaned on Bing historically, Ecosia specifically on "a mix of both Google and Bing libraries". They announced European Search Perspective on 3 December 2024 to build an independent European index, "starting in 2025" in French and German, with a later post confirming "EUSP search results are now live in Germany" as of 30 July 2026 (blog.ecosia.org). For an EU-facing SaaS this is a watch item: a third European index that is not Bing-derived is new supply, built language-first.

**Agent verdict:** end to end, mostly monitoring. Verify the site is crawlable by Brave's and the EUSP crawlers, keep Bing Webmaster Tools healthy (which covers DuckDuckGo), and track referral share by engine so the question gets settled by data.

### Yandex, and what its leak taught that Google's did not

Yandex holds 70.35% of Russian search against Google's 27.79%, with Bing at 0.77% (gs.statcounter.com, August 2026). It is also the only other IndexNow-supporting engine (ppc.land), so an IndexNow integration is already a Yandex integration.

The January 2023 source-code leak remains the most detailed look inside a production ranking system, and the interesting part is not the headline count. The widely repeated "1,922 ranking factors" is the initial file; combined files hold roughly 17,800, of which 244 are marked unused and 988 deprecated, leaving near 690 plausibly active (searchenginejournal.com). Named mechanics include backlink age, homepage links weighted above internal ones, links from top-100-PageRank sites, anchor diversity across branded and commercial terms, URL-level trivia (numerals, capitals, trailing slashes), document age and freshness, crawl depth as a weighted factor with orphan pages explicitly down-weighted, and penalty systems named SpamKarma, Pessimization (reducing PageRank to zero) and a PF Filter targeting click manipulation.

Three things it teaches that Google's own 2024 documentation leak did not. First, **user behaviour is wired in at industrial scale and with a vocabulary**: 102 factors tagged `TG_USERFEAT_SEARCH_DWELL_TIME`, of which 39 were active, alongside click-through ratio relative to all search clicks, regional click distribution, direct traffic share, unique visitor counts and search-referral share. Google's leak established that click signals exist; Yandex shows what a production implementation looks like, decomposed rather than a single engagement number. Second, **an engine's own analytics product can be a ranking input**: six factors integrate Yandex Metrika, including whether the counter is installed at all and time-on-URL for similar visitors via YandexBar. Google has consistently denied using Analytics data in ranking; Yandex is the existence proof that the architecture is buildable, which is a different claim from asserting Google does it. Third, **most of the factor list is dead weight**, 64% unused or deprecated in the leaked state, the best available corrective to ranking-factor listicles generally.

Standing caveat from every serious analysis: Yandex is not Google, and a factor's presence in one says nothing about its weight in the other [consensus].

**Agent verdict:** end to end if Russia is a market (Yandex Webmaster verification; IndexNow already covers submission). The leak is evidence for the corpus, not a task.

### Baidu, Naver and Seznam: where Google is not the question

**China.** Baidu holds 59.26%, and the surprise is Bing at 18.92% in second, ahead of Haosou at 6.48% and Sogou at 2.25%, with Google at 1.41% (gs.statcounter.com, August 2026). The recurring founder blocker is the ICP, and sources disagree. Chinafy: "An ICP (Internet Content Provider) license is not required to rank on Baidu, but it is required to legally host a website on servers in mainland China", distinguishing the ICP filing (备案, informational sites) from the commercial licence (经营许可证, e-commerce), and arguing the real blocker is technical, since "the ICP is simply a license to host in China, and the root of the issue is in fact the site's technical incompatibility with China's internet ecosystem", with "Baidu tends to favor sites that load in less than 2 seconds" (chinafy.com) [contested, and note the incentive: Chinafy sells China performance acceleration, so "performance, not paperwork" is the commercially convenient answer]. Counter-claims that most top Baidu performers hold a local filing could not be verified from a primary source [unverified].

**South Korea.** Naver at 43.71% against Google's 46.6%, the rare market where the domestic engine is coequal. The structure matters more than the share: Naver is a portal that prefers its own properties. Its result page runs paid results, Naver Café, Naver Encyclopaedia, maps, images, blogs, Naver Knowledge iN and apps, and in Oban International's worked example of a commercial query, organic external results appeared only "three scrolls down the page" and there were "only four" of them (obaninternational.com). Practically, ranking in Korea means publishing inside Naver Blog and Café rather than optimising your own domain, in Korean, submitted through Naver Search Advisor. That is a content-distribution programme, not an SEO programme.

**Czechia.** Seznam at 15.63% against Google's 79.33% and Bing's 3.93%. At a sixth of the market it earns a webmaster-tools verification if Czechia is a real market and nothing at all otherwise.

The shared lesson: these are market-entry decisions with legal, hosting, language and channel consequences, and none of them are a subdirectory away.

**Agent verdict:** not autonomous. An agent sizes the market from existing traffic and produces the entry-requirements memo; committing to a Chinese entity, a Korean content operation or per-market hosting is a founder decision.

### App stores and YouTube as search surfaces

If the product has a mobile app, the store search box is a larger acquisition surface than any non-Google engine above. Sensor Tower found search accounted for 59% of worldwide App Store installs, rising to 70% for non-game apps (up from 63% the prior year), with app referrals at 20% and browse at 12%; for games the ordering inverts, app referrals at 38% overtaking search at 35%, itself down from 42% and 44% in the two preceding years (sensortower.com, 2020 data) [dated, and the shape is more reliable than the level five years on]. For a SaaS with a companion app, the listing's title and subtitle carry more weight than a locale subdirectory does.

YouTube is the other surface routinely called a search engine. The claim "YouTube is the second largest search engine" could not be traced to a primary source here: the article that specifically debunks it returned HTTP 520 on fetch, and every other result restating it cites no measurement [unverified, and the failure to verify is the finding]. What is defensible without it: YouTube has its own query stream, its own ranking system and an indexable transcript, and it is a channel where a founder's face is an asset the web SERP will not reward directly. Treat it as a channel with search characteristics, not as the number two search engine.

**Agent verdict:** end to end for app-store keyword research and listing copy drafts; human gate on publishing store metadata, which is subject to review. For YouTube, agent-assisted at the metadata and transcript layer only.

### The honest ROI call: when a small SaaS should ignore all of this

The default answer is ignore it, and the default is right more often than the international SEO literature admits, because nearly all of that literature is written by agencies and translation vendors whose product is the opposite answer.

A single-product SaaS under roughly $1M ARR, selling in English, with organic traffic concentrated in one or two English-speaking markets, has one international action worth taking, which is nothing. Adding locales multiplies every other job in the corpus (content production, internal linking, technical audits, link building, AI-visibility monitoring) by the number of locales, against a market with no evidence of demand and no way to support the inbox.

Three triggers flip it, in order of strength. First, **revenue already arriving from a market you never targeted**, the only trigger that is actually evidence. Second, **self-cannibalisation between variants you already have**, a repair rather than an expansion, and where partial hreflang on a handful of page classes pays immediately. Third, **a market where the engine is not Google**, a channel decision with a hard floor: Korea via Naver and China via Baidu cannot be reached by adding `/kr/` to a sitemap.

Two things every small SaaS should do regardless, because they are sub-hour and permanent: verify Bing Webmaster Tools (import from Google Search Console, which also covers DuckDuckGo's supply) and wire IndexNow (which also covers Yandex and Seznam). Under an hour combined, for a free AI-citation dashboard nobody else provides and faster discovery on three engines.

The thing to refuse: locale subdirectories full of machine translation because it is cheap. It is cheap, it does violate the stated policy (developers.google.com), enforcement is real even though Reddit is exempt from it (gsqi.com), and the corpus already documents what scaled content does on a 9 to 18 month delay (see `content-strategy-topical-authority.md`).

## What is contested

- **Is hreflang dying?** Georgia James reports Google "hinting" at automatic language detection given low uptake (YT brightonSEO); Google's documentation still specifies it in full and carries no deprecation signal. Position: a signal with declining relative importance, not a deprecated one.
- **IndexNow volume.** Microsoft says over 3.5 billion URLs per day (blogs.bing.com); ppc.land reports 1.4 billion per day and 60 million websites joining daily. Irreconcilable as stated, and the 18% of new-URL clicks figure is Microsoft's own with no independent check.
- **Does IndexNow change any business outcome for a small site?** No controlled test found. The quoted "95% faster inclusion" appears only in undated vendor content [unverified].
- **Does Baidu require an ICP?** Chinafy says no for ranking, yes for mainland hosting, and points at page speed as the real constraint, which is also what Chinafy sells. The counter-claim could not be verified.
- **How independent is ChatGPT's retrieval?** RESONEO never observed a Bing pipeline at all; Profound measures declining but non-zero Bing alignment and notes most citations match neither index. Both agree the dependency is gone or going; they disagree on whether it was ever total.
- **Machine translation risk.** The policy text is clear (developers.google.com) and the largest visible violator has gone unpunished for over a year at nine-figure page scale (gsqi.com). Practitioners read this as selective enforcement; there is no way to distinguish that from a threshold nobody has published.
- **Localisation ROI.** The 96% positive ROI and 65% at 3x figures come from a DeepL survey relayed on X (X @mattdiggityseo). Vendor survey of vendor buyers; marketing, not evidence.
- **Reddit corroboration is missing entirely.** Reddit was unreachable on every route tried, so anything here that would normally be checked against r/TechSEO consensus has not been.

## Agent playbook notes

**Fully autonomous, on a schedule:**

- **Hreflang graph audit, weekly.** Build the variant graph across locales and flag missing return tags, non-self-referencing sets, invalid or reserved codes, hreflang targets returning 404 or 301, canonicals contradicting the annotations, and missing or misassigned `x-default`. Store the graph so the next run diffs against it: the usual cause of breakage is a new market launching without its return tags, which only a diff catches.
- **Hreflang generation by embeddings, on demand.** Embed page content per locale, match cross-locale equivalents by cosine similarity, emit the tag set with `Mutual_top`, rank and score attached. Expect roughly 89% agreement with a hand-built map (guspelogia.com) and route the rest to review.
- **Market signal monitoring, monthly.** Organic users and revenue by country, the same split for paid, the delta, and a ranked shortlist where organic is over-indexed relative to targeting. This is the trigger that starts any localisation conversation.
- **Cross-variant cannibalisation detection, weekly.** Rank-track your own variants as competitors on each target market's SERP and alert when one outranks another in that second variant's own market, which is the .com-versus-.co.uk failure in machine-readable form.
- **Bing Webmaster Tools pull, weekly.** Citations, cited pages, grounding queries, plus Intents, Topics and Citation Share since June 2026. Diff grounding queries against the Google Search Console query set; Bing-only queries are a free content backlog.
- **IndexNow submission, on publish.** Key file at root, POST on every create or material update, log responses. Wire once, never revisit.
- **Engine referral share tracking, monthly.** Sessions and signups by referring engine (Bing, DuckDuckGo, Brave, Ecosia, Yandex, Naver, Seznam, each AI assistant), so "is Bing worth it" gets settled by that client's data rather than by this note.
- **Currency-duplicate detection, monthly.** Pricing URLs whose only material delta is a currency symbol, and regional pricing pages canonicalised to a foreign master.

**Human-gated:** any hreflang deployment to a template, the ccTLD versus subdirectory versus subdomain decision, publishing any translated page (native review), consolidating or redirecting pricing URLs, entering a market requiring a legal entity or local hosting (China), committing to a platform-native content programme (Naver Blog and Café), and app-store metadata changes.

**Never:** publish machine-translated pages at scale without native review, force geo-IP redirects on indexable URLs, canonicalise regional pages to a single foreign master, or spin up locale subdirectories in markets with no revenue signal.

**Cadence summary:** on publish (IndexNow), weekly (hreflang diff, cannibalisation, Bing pull), monthly (market signal, referral share by engine, currency duplicates), on demand (embeddings hreflang generation, market entry memo).

## Sources

**X**

- [@mattdiggityseo, international SEO failure modes](https://x.com/mattdiggityseo/status/1975418526090600632) - machine translation without review, broken hreflang as compounding technical debt, and the DeepL 96%/3x ROI survey.
- [@aleyda, Bing AI Performance launch](https://x.com/aleyda/status/2021323481992802415) - the four metrics shipped 10 Feb 2026, and the explicit list of what is not included.
- [@glenngabe, hands-on with AI Performance](https://x.com/glenngabe/status/2021278363390816595) - "No clicks data. No CTR. It's a start but we really should see more IMO."
- [@KorayGubur, on the BWT dashboard](https://x.com/KorayGubur/status/2021356765950955675) - argues reporting is shifting from clicks and positions to topics and exposure.
- [@rustybrick, BWT AI reporting expansion](https://x.com/rustybrick/status/2067257582998483208) - Intents, Topics, Citation Share and compare added 17 June 2026.
- [@sengineland, AI Performance report](https://x.com/sengineland/status/2022370774493921441) - total citations, grounding queries, page-level trends, "but there's a catch".
- [@glenngabe, Bing on sitemaps and IndexNow](https://x.com/glenngabe/status/1950977134325055939) - quotes Bing that `lastmod` remains a key freshness signal and pairs sitemaps with IndexNow.
- [@ViperChill, Google versus Bing SERP overlap](https://x.com/ViperChill/status/1971211831487365133) - 10,000 terms, 48 of the top 100 domains shared, 162 of 500, and Bing out-referring the three major AI assistants combined.
- [@aleyda, embeddings for hreflang](https://x.com/aleyda/status/2026736337387143400) - surfaces Gus Pelogia's Screaming Frog plus OpenAI embeddings mapping method.
- [@sitebulb, international strategy mistakes](https://x.com/sitebulb/status/1976183601294127127) - links the Raquel Gonzalez guide used below.

**YouTube**

- [brightonSEO October 2025, Georgia James, "Mastering international SEO with strategic hreflang"](https://www.youtube.com/watch?v=jAlY0uoa2WQ) - the 42-domain client, the .com outranking the .co.uk on UK branded search, the 11-homepage partial rollout that bought the full one, and the case for language-only annotations.
- [Kasra Dash, "The New Bing Webmaster Tool Just Changed Everything"](https://www.youtube.com/watch?v=DhJQMCQnRVY) - walks the AI Performance tab, confirms coverage is Copilot only, and shows the Google Search Console import as the setup shortcut.

**Reddit**

- None. Reddit was unreachable from this network on every route attempted (direct fetch, `.json`, `.rss`, `old.reddit.com` and a reader proxy all returned 403 or a login interstitial). This note therefore has no practitioner-forum corroboration layer.

**Web**

- [Google, Localized versions of your pages](https://developers.google.com/search/docs/specialty/international/localized-versions) - the return-link rule, x-default's stated purpose, code format constraints and what happens to invalid annotations.
- [Google, Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) - the URL structure comparison table, the canonical-plus-hreflang instruction for near-duplicate country versions, and the warning against IP-based adaptation.
- [Google, Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies) - scaled content abuse verbatim, including "automated transformations like synonymizing, translating, or other obfuscation techniques".
- [Ahrefs, Hreflang tags guide](https://ahrefs.com/blog/hreflang-tags/) - 67% of implementations had issues across 374,756 domains; hreflang is a signal, not a directive.
- [Semrush, Most common hreflang mistakes](https://www.semrush.com/blog/the-most-common-hreflang-mistakes-infographic/) - 20,000 multilingual sites, the error breakdown, and the 96% missing-self-reference finding inside the conflicts bucket (2017).
- [Gus Pelogia, Using embeddings to map hreflang](https://www.guspelogia.com/embeddings-hreflang) - the Screaming Frog and OpenAI method, 89% match against Semrush's live tags, $5 for thousands of URLs.
- [Glenn Gabe, Reddit's AI translations one year later](https://www.gsqi.com/marketing-blog/reddit-ai-translations-expand-boom/) - per-country page and query counts, roughly doubled year over year, no manual action, "You are not Reddit".
- [RESONEO, What ChatGPT pulls, what it shows, what it cites](https://think.resoneo.com/chatgpt-retrieval/) - 1,249 answers, four named pipelines, no Bing observed, one in three on Google page one versus one in twenty on Bing, 13% of snippets over a month stale.
- [Profound, AI search shift](https://www.tryprofound.com/blog/ai-search-shift) - ChatGPT-Bing alignment 26% to 8%, ChatGPT-Google 12% to 33%, across 240M citations.
- [Bing Webmaster Blog, IndexNow expands adoption](https://blogs.bing.com/webmaster/December-2024/Look-How-Far-We-ve-Come-IIndexNow-Expands-Adoption-Across-Industries) - over 3.5B URLs per day, 18% of new URLs clicked, GoDaddy, Internet Archive and Condé Nast.
- [PPC Land, Google's absence from IndexNow](https://ppc.land/googles-absence-from-indexnow-raises-questions-about-web-indexing-standards/) - Bing and Yandex as the supporting engines, 1.4B URLs per day, Mueller's "we too, would like to be crawled less often", the Indexing API's narrow scope.
- [DuckDuckGo, Sources for our search results](https://duckduckgo.com/duckduckgo-help-pages/results/sources/) - names Bing as the source it "largely sources" traditional links and images from, alongside DuckDuckBot.
- [Brave, Search independence](https://brave.com/blog/search-independence/) - the final 7% of Bing-served results removed, full own-index serving, ~22M queries per day (April 2023).
- [Ecosia, Teaming up with Qwant on a European search index](https://blog.ecosia.org/eusp/) - EUSP announced 3 Dec 2024, French and German first, live in Germany by 30 July 2026, and what Ecosia used before.
- [Search Engine Journal, Yandex data leak](https://www.searchenginejournal.com/yandex-data-leak/477905/) - the real factor counts, 102 dwell-time factors, the six Metrika integrations, link and URL mechanics, and the named penalty systems.
- [Statcounter, Search engine market share](https://gs.statcounter.com/search-engine-market-share) - August 2026 worldwide and the country splits used here for Russia, China, South Korea and Czechia.
- [TripleDart, International SEO for SaaS](https://www.tripledart.com/blog/international-seo-for-saas) - subdirectories as the B2B SaaS default on authority-inheritance grounds, and geo reports as the pre-localisation demand check.
- [Sitebulb, 8 international SEO mistakes](https://sitebulb.com/resources/guides/8-international-seo-mistakes-fixes-for-your-expansion-strategy/) - one ccTLD across several markets, forced geo-IP redirects versus US-based Googlebot, and multilingual keyword divergence.
- [Chinafy, Do you need an ICP license to rank on Baidu](https://www.chinafy.com/blog/do-you-need-an-icp-license-to-rank-on-baidu) - ICP filing versus commercial licence, hosting versus ranking, and the sub-two-second performance claim.
- [Oban International, SEO on Naver](https://obaninternational.com/blog/seo-on-naver-the-beginners-guide/) - the Naver SERP stack, external organic results three scrolls down with only four present, Korean-language requirement, Naver Search Advisor.
- [Sensor Tower, App Store download sources](https://sensortower.com/blog/app-store-download-sources-report-2021) - 59% of installs from search, 70% for non-games, and the inverted ordering for games (2020 data).

