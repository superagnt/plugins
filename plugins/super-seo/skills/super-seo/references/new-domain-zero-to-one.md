---
status: research
created: 2026-09-20
updated: 2026-09-20
type: research
---

# SEO on a new domain: zero to one

Every other note here assumes a site with history in Google's index. This one covers where a SaaS founder actually is: a domain registered last week, zero referring domains, zero brand searches, no entity anywhere, an empty Search Console. The finding is that the first six to twelve months on a fresh domain are not an SEO problem, they are a "does anything reference you" problem, and most standard advice gets applied months before the conditions that make it work exist. Method note: the superagnt MCP data tools failed auth, so X posts were located by search and verified through the fxtwitter API, and transcripts pulled with `yt-dlp`. **Reddit was unreachable entirely**, so its postmortem vein is substituted with fetched BlackHatWorld threads and one ten-site launch postmortem, which is a real weakness here.

## TL;DR

- **The sandbox is real as a mechanism and fake as a named filter.** Google's leaked docs define `hostAge` as "The earliest firstseen date of all pages in this host/domain. These data are used in twiddler to sandbox fresh spam in serving time" (hobo-web.co.uk): a host-age-keyed spam gate, not a penalty box, which is how Mueller can truthfully deny a sandbox while every practitioner observes one [consensus on the effect, contested on the cause].
- **Time to first real traffic clusters at 6 to 12 months.** Diggity polled a mastermind on reaching 5,000 visits a month with no tricks: **74% said 6 to 12 months, 17% said 1 to 6, 6% said 12 to 18, 2% said two years plus** (YT Matt Diggity). His own last five from-scratch sites averaged **8.6 months**. A 75-expert survey breaks new domains out at a 6 to 12 month minimum (morningscore.io, Feb 2026).
- **The base rate is brutal and got worse.** Across 1M random URLs, **1.74% of newly published pages reach the top 10 within a year for even one keyword, down from 5.7% in 2017**, **72.9% of top-10 pages are over three years old**, and **96.55% of all pages get zero Google traffic** (ahrefs.com).
- **Page count is not the lever.** In a ten-site postmortem the site with **1,033 posts** was "currently a train wreck in every way", the one with **100 posts** was "a joke, big failure", and one with **14 posts** showed "exceptional" growth (fatstacksblog.com). Three winners, two maybes, five losers, and volume predicted nothing.
- **The first 10 to 20 links are cheap, easy and mostly inert.** Free startup directories run DR 77 to DR 92 (X @consumerxai), but a founder who submitted reported **zero backlinks actually materialised** while DR climbed 4.6 to 17 from elsewhere (X @bennett_ts). Directories are entity infrastructure, not link acquisition.
- **The aged-domain shortcut has a documented price and failure mode.** DR 34 with 100 RDs at **$600**, DR 41 at **$1,330**, DR 57 at **$4,000** (thewebsiteflip.com). A 301 inherits the link profile **in aggregate**, toxic links included, and topical mismatch is the line Google's spam updates name (`link-building-grey-hat.md`).
- **On a domain nobody cites, brand queries are the only ones you win.** Foundation Marketing and AirOps, April 2026, **57.2 million AI citations across 50 brands in 7 B2B verticals**: a brand-name query cites the brand's own site **77.6%** of the time, a category query **2.2%**, and **in 85% of unbranded AI responses no brand-owned website is cited at all** (X @alexgroberman).
- **AI citation is downstream of classic ranking, which is downstream of age.** AirOps on **548,534 pages across 15,000 prompts**: nearly **50% of ChatGPT citations came from pages ranking number one**, **3.5x** the rate beyond position 20, **85% of discovered pages never reach the answer** (X @alexgroberman). Meanwhile small publishers lost **60% of search referrals in two years** against 22% for large ones (searchenginejournal.com). "Optimise for LLMs instead" is the same queue with an extra filter, on a shrinking base.
- **Nobody with a commercial incentive publishes kill criteria**, so they must be set at launch as leading indicators (indexed ratio, impressions, query coverage), never as traffic.

### Is the sandbox real, and what is it

Three separable things get called the sandbox, and conflating them is why the argument never resolves.

**The documented mechanism.** The 2024 Content Warehouse leak contains a `PerDocData` attribute `hostAge`, documented as "The earliest firstseen date of all pages in this host/domain. These data are used in twiddler to sandbox fresh spam in serving time", stored as a 16-bit count of days since 2005-12-31 (hobo-web.co.uk). The operative phrase is "fresh spam": a serving-time re-ranking gate taking host age as one input to spam suppression, not a timer on every new domain.

**Google's position.** Mueller, May 31 2021, denies both the sandbox and its mirror image, the honeymoon period, explaining the observed behaviour as uncertainty instead: "we don't know and we have to make assumptions... Sometimes things settle down a little bit lower, sometimes a little bit higher" (searchenginejournal.com).

**What practitioners observe**, unanimous enough to be data even where the causal story is wrong. Diggity: a new site finds genuinely zero-competition terms, publishes, and still "starts on page billion of Google for these zero competition keywords. That's the sandbox", with the effect alone at **two to four months** (YT Matt Diggity). On BlackHatWorld's 2026 thread, `tiiberius`: "there is definitely a time period in which performance is held back. And it's artificial"; `Starblazer` claims ".com or .ai domains have 3-4 months sandbox period while cheap TLDs like .xyz, .top, etc. have 6-12 months" [single-source, uncorroborated]; `xcreator22` describes a "3 to 9 month trust evaluation phase".

The synthesis: **there is no timer you wait out, there is an evidence threshold you cross.** Age proxies for missing evidence, and anything substituting for it shortens the effect, which is why the sandbox looks real to people building nothing and fake to people building fast.

**Agent:** detection is fully agent-runnable. Track indexed ratio, impressions without clicks, and average position on deliberately zero-competition terms. Ranking 60th for a KD-0 term is a measurable state, not a vibe.

### How long until first meaningful organic traffic

**The base rate.** Across 1M random URLs seen by Ahrefs' crawler in September 2023, **1.74% of newly published pages reached the top 10 within a year for at least one keyword** (6.11% filtered to 2M English-content URLs from October 2023), and of those that did, **40.82% arrived within one month**, the honeymoon effect visible in aggregate. On 1.3M random US keywords, **72.9% of top-10 pages are over three years old** (59% in 2017), only **13.7% are under a year** (22% in 2017), and the average number one is **five years old** (ahrefs.com).

**The practitioner distribution.** Diggity's poll used a well-chosen threshold, 5,000 visits a month, explicitly excluding 301s, expired domains and tricks: **74% at 6 to 12 months, 17% at 1 to 6, 6% at 12 to 18, 2% at two years plus, 0.4% at 18 to 24, one vote under a month.** His five most recent from-scratch builds averaged **8.6 months**. The poll is from July 2022 and the SERP has hardened since, so treat 8.6 months as an optimistic floor, not a midpoint.

**The survey.** 75 experts, February 2026: 82% see a traffic increase within six months, but new domains are broken out at a **6 to 12 month minimum**, anything earlier "typically insignificant", with **link building at 52.1%** of where the effort goes (morningscore.io).

And the starting line moved: Google Search page views fell 34% and Discover 15% Dec 2024 to Dec 2025, while ChatGPT referrals grew over 200% but remain under 1% of publisher referrals (Chartbeat via Axios, reported searchenginejournal.com). The AI channel supposedly replacing search is two orders of magnitude too small to do it.

**Honest read:** budget **9 to 15 months to commercially meaningful organic traffic** on a fresh domain in 2026, with a real probability it never arrives. 73% of niche sites get under 1,000 monthly visitors in year one and 65% take over a year to steady revenue (wecantrack.com, citing Income School) [secondary].

### What to publish first, and how many pages

The corpus already carries the bottom-of-funnel-first case with its conversion data (`content-strategy-topical-authority.md`). What is different at zero authority is that **you cannot win the BOFU terms either**, because "best X software" and "X vs Y" is where funded competitors spend. The sequencing that works from zero is narrower, **high-intent and structurally uncontested**:

1. **Product and brand surface**: homepage, pricing, docs, changelog, integrations index, one page per integration or supported platform. Only you can satisfy these queries, and they are what assistants retrieve when someone asks about you by name. Founders skip them because they do not feel like SEO.
2. **Your own comparison set, hand-built**: a few dozen opinionated comparisons by someone who used both tools. The sibling note is emphatic that the machine-generated A-versus-B matrix is the detectable footprint and the hand-built few dozen is not.
3. **Jobs-to-be-done problem queries** that never name a solution category, where there is no incumbent because nobody with a keyword tool finds them.
4. **Breadth**, and only here: it reinforces a site that already has signals and does not ignite one that has none.

The evidence against front-loading volume is the ten-site postmortem: ten sites over roughly twelve months, **3 winners, 2 maybes, 5 losers**. Winners ran **496 posts at ~$60 each** ($60 to $80 a day from display ads), **82 at ~$80**, and **225 at ~$23**. Losers ran **100 posts at $75** ("100 posts for that traffic is a joke. Big failure") and **1,033 posts at $18** ("currently a train wreck in every way"). The maybe that matters most ran **14 posts**: "traffic growth for only 14 posts is exceptional" (fatstacksblog.com, Feb 2022). Post count spans 14 to 1,033 and predicts nothing; the author's conclusions were keyword research, content quality, "aged domains are hit or miss", and focus on one site.

The defensible floor is coherence, not count: one clear hub plus roughly 10 to 30 pages inside it, published over weeks rather than dumped in a day. Google is explicit that "the length of the content alone doesn't matter for ranking purposes (there's no magical word count target)" (developers.google.com).

**Agent:** tranche classification, uncontested-tail discovery, integration-page generation from the product's own API surface, and comparison drafting are agent-runnable end to end. The comparison verdict is not, without real product usage data.

### Minimum viable technical setup, and what does not matter yet

Google's starter guide is blunt about how little is required: "You usually don't need to do anything except publish your site on the web... the vast majority of sites listed in our results are found and added automatically as we crawl the web", and on sitemaps, "this isn't required". It also kills three founder time-sinks: "Google Search doesn't use the keywords meta tag", keywords in the domain name "have hardly any effect beyond appearing in breadcrumbs", and on E-E-A-T as a ranking factor, "No, it's not" (developers.google.com).

The genuine minimum: crawlable and renderable, correct status codes, self-referential canonicals, Search Console verified on day one so a baseline exists, and internal links that actually exist, because "the vast majority of the new pages Google finds every day are through links". What does not matter yet on a domain with no traffic: Core Web Vitals tuning beyond "it loads", schema beyond Organization and Product (`ai-search-aeo-geo.md` records no citation lift in the only controlled study), `llms.txt` (dead on arrival, same note), crawl budget (you do not have one, see `technical-seo.md`), log analysis, hreflang, and any audit tool score. The recurring pattern is a founder buying a technical audit for a 30-page site, a genuinely worthless purchase.

**Agent:** the entire minimum is agent-runnable and should be a one-shot check plus a weekly cron, not a project.

### The cold start link problem

The first 10 to 20 links are the cheapest you will ever get and the least useful, and being clear about that stops a founder burning month two on outreach.

The first tranche is free startup and software directories: Sourceforge DR 92, Product Hunt DR 91, GoodFirms DR 86, TrustRadius DR 84, Indie Hackers DR 81, SaaSHub DR 79, AlternativeTo DR 79, Peerlist DR 77 (X @consumerxai, July 2026), plus a long tail including Launching Next, Uneed, Toolify and F6S (X @2whazzuup, August 2026). Ahrefs recommends this as step one and names the discovery method: run Link Intersect against a few search competitors and harvest the directories linking to all of them, at a "near 100% success rate" (YT Ahrefs, Jan 2026).

The counter-evidence is a founder actually doing it. @bennett_ts, January 2026: "Domain rating jumped from 4.6 to 17 in the past 2 weeks. Sent [domain] to several launch directories but didn't get any backlinks from them. Idk if they're helping at all" [single-source]. Directories mostly nofollow and resolve to an entity signal rather than link equity, which is not nothing, since entity legibility is what the AI-answer section turns on.

What actually moves a new domain, in rough order of evidenced effect:

- **A free tool.** The argument is mechanical: tool queries do not trigger AI Overviews where informational queries do, and an AI Overview drops clicks to the top-ranking page by around 35% (YT Ahrefs) or **58%** (ahrefs.com), the same company disagreeing with itself [contested]. Either way, a calculator or checker is a page type whose clicks have not been taken, and it attracts links passively.
- **Sweat-equity partnerships.** Trade a build, a dataset or a co-branded tool to someone who already has the audience, hosted on their domain with a link back (YT Ahrefs). Highest yield for a founder with engineering time and no budget.
- **Buying them**, which is most of this market. Prices live in `link-building-grey-hat.md`; the new-domain fact is that a fresh domain buying links at market rate looks exactly like that, and `hostAge` exists to notice it.

The scale mismatch, plainly: the six-month new-domain case study reported **361 referring domains and 2,500 backlinks alongside 42 monthly organic visits** (seeklab.io). Whatever produced 361 RDs in six months was not organic, and it bought almost no traffic.

**Agent:** directory submission, Link Intersect harvesting, partnership prospect scoring and link-liveness monitoring are fully agent-runnable. Purchases and pitches are human-gated.

### Aged domain versus fresh: the buy decision

This covers founder-facing economics; supply chain, risk labels and enforcement record live in `link-building-grey-hat.md`.

Prices are documented and lower than people assume: DR 34 with 100 referring domains at **$600**, DR 41 with 150 RDs at **$1,330**, DR 57 with 182 RDs at **$4,000** via brokers, and a DR 44 dating domain with 871 RDs at **$3,900** on GoDaddy Auctions, with one documented outcome of roughly **$9,000 a month** two years on from a $4,000 buy (thewebsiteflip.com). Discovery is a three-minute workflow: auctions filtered by brand-adjacent keyword, export, bulk-analyse in Semrush, sort by authority score (X @codyschneider).

Three failure modes matter more than the upside. **You inherit the profile in aggregate**: a 301 does not let Google separate good links from toxic ones, so a domain with 871 referring domains sells you an unknown number of poisonous ones. **Topical mismatch is the named line**: Google's spam updates explicitly cover expired domain abuse (`link-building-grey-hat.md`), and the flip guidance agrees, calling health-to-technology "a red flag" (thewebsiteflip.com). **It is hit or miss**: the ten-site operator ran both arms, and **all three of his aged-domain sites were moved onto fresh domains in February 2022**, concluding "aged domains are hit or miss" and "play it safe with a fresh domain" (fatstacksblog.com). Diggity, selling the opposite position, still buys only from a vendor auditing for penalties, and his demonstration is "keywords marked new already on page 2" a month in, not revenue (YT Matt Diggity).

For SaaS the calculus is worse than for affiliate sites, because brand and domain are the same asset. The surviving version is narrow: buy the **exact-brand-name** domain if someone else holds it, or buy a genuinely adjacent property and run it as its own entity with editorial links out, never a blanket 301 into the product. **Risk: high** for an unrelated 301, **medium** for an adjacent rebuild.

**Agent:** shortlisting, Wayback continuity checks, referring-domain quality scoring and spam-inflation detection are strong fits. Bidding and the buy decision are human-gated.

### Brand and entity from zero, and why it compounds

The most consequential asymmetry is measured, recent and large. Foundation Marketing and AirOps, April 2026, **57.2 million AI citations across 50 brands in 7 B2B verticals**: asked about a brand **by name**, an assistant cites that brand's own site **77.6%** of the time; asked "who is the best in this category", **2.2%**; and **in 85% of unbranded AI responses no brand-owned website is cited at all** (X @alexgroberman). The brands that do surface on unbranded queries share one profile: deep expert content on their own site **plus** editorial coverage in trusted industry publications, so retrieval meets the name in several independent places.

Brand search is therefore not a vanity metric, it is the only query class you can win and the entry point to the rest: a brand query is uncontested by construction, it produces clicks, clicks produce engagement history, and that history is the evidence `hostAge`-style gates proxy for. Neil Patel, from a study of 82 factors influencing ChatGPT recommendations: "AI doesn't really read your website. It reads what everyone else says about you and repeats it... brand mentions across the web ranked higher than your own site's authority" (X @neilpatel, Aug 2026) [single-source].

So the highest-leverage work in months one to six is not on the site, it is whatever puts the name on pages you do not control: forums, podcasts, founder posting, review platforms, the directory tranche. Ahrefs adds a targeting trick worth stealing: run reddit.com or a niche forum through an organic keywords report, filter to your niche, and post into threads already pulling thousands of Google visits a month, preferring ones with few comments (YT Ahrefs).

**Agent:** brand-mention monitoring, forum-thread targeting by organic traffic, and assistant share-of-voice tracking run fine on a cron. Posting as a person in a community does not, and should not.

### When a new site competes in AI answers, and when never

AirOps modelled selection across **548,534 pages retrieved over 15,000 prompts**: nearly **50% of ChatGPT citations came from pages ranking number one on Google**, **3.5x** the rate beyond position 20, **85% of discovered pages never appear in the final answer**, and **89.6% of prompts trigger two or more follow-up searches** (X @alexgroberman, Jul 2026). So the pipeline for a new domain is rank first, get retrieved, then survive a step that drops five in six.

The one documented new-domain case: **61 AI-cited pages in six months**, ChatGPT 41, Gemini 15, Google AI Mode 9, AI Overviews 3, alongside **361 referring domains, 2,500 backlinks and 42 monthly organic visits** (seeklab.io) [single-source, vendor-published, RD count implies paid acquisition]. Sixty-one citations and forty-two visits is the lesson.

**So: when.** Branded AI answers almost immediately, since those queries retrieve you by name against no competition. Unbranded category inclusion only after top-three classic rankings plus third-party editorial coverage, a twelve-month-plus proposition. On competitive unbranded commercial queries in a vertical with entrenched incumbents and review-platform gatekeepers, **never** is a real answer: the 85% figure means the default is to cite publishers and review sites, and a new vendor is last in that set.

### Kill criteria

Nobody with a commercial incentive publishes these: searching for when to stop returns almost exclusively agency content arguing that stopping is the real risk, which is a finding about the literature, not the decision. These are inferred from the base rates above and stated as leading indicators, because traffic is lagging. Set them at launch; read them per-query and per-page, never as site averages (`measurement-algo-updates.md`).

- **Month 3, indexation.** Under 60% of submitted URLs indexed with no technical fault you can name is a quality classification problem, not patience. Fix or stop.
- **Month 4 to 6, impressions.** Impressions should rise across a widening set of distinct queries, even at position 40. A flat impression curve at month six is the strongest early kill signal available, and Diggity's two-to-four-month window should be behind you.
- **Month 6, position bands.** Some pages should sit at 11 to 30 on target queries. Nothing inside position 50 on uncontested long tail means the domain is not trusted at all.
- **Month 9 to 12, conversion, not traffic.** If product-surface and comparison pages rank and produce no signups, keyword selection was wrong and more of it will not help.
- **Month 12, the honest question.** 1.74% of new pages reach the top 10 in a year (ahrefs.com) and 5 of 10 launched sites failed outright in the one postmortem with real numbers (fatstacksblog.com). A twelve-month-old domain with flat impressions is not early, it is the modal outcome.

The counter-argument: "Losing patience too early is the number one killer of blogs", payoff claimed at 12 to 18 months, traffic before 12 to 15 months called unrealistic in hosting, crypto, health and finance (blackhatworld.com) [contested]. Both can be true, because these criteria test **direction**, not magnitude.

### What to do instead of SEO in month one

If a fresh domain cannot pay for nine to fifteen months, "start with SEO" is a resourcing error for a company that needs revenue this quarter. The correction is not "skip SEO", it is **do the parts that are actually brand and distribution work, and get customers through channels that pay now**.

Month one: ship the product surface pages (permanent assets, days of work), verify Search Console, submit the free directory tranche, then spend everything else on channels with a sub-30-day feedback loop. Ahrefs' own new-site list is instructive because only one of its plays is recognisably SEO: directories, a free tool, an email list, forums and communities, sweat-equity partnerships, experience-driven content. Every algorithmic channel can be revoked overnight, and "your email list, that's yours" (YT Ahrefs). @MicroLaunchHQ states the sequencing error plainly: "Distribution comes after launch. Biggest startup myth. Do both from day one" (X, Jul 2026).

Concretely: founder-led outreach and demos, posting where the buyers already are, a launch on platforms that carry their own traffic, and one genuinely useful free tool, which belongs in both columns and so goes first: distribution in month one, linkable asset in month nine. The calibrating counter-point, from a founder doing it: "got 30 trials from SEO this month so far... i started consistently working on SEO in April" (X @hustle_fred, Jul 2026), a four-month lag on an existing product [single-source]. That is the realistic good case, and still a quarter behind any outbound channel.

## What is contested

- **Filter or artefact.** Google denies the filter; the leak documents a host-age-keyed spam gate. Observed durations: 2 to 4 months (YT Matt Diggity), 3 to 4 on .com, 6 to 12 on cheap TLDs, 3 to 9 months (blackhatworld.com).
- **The AI Overview click cost.** Ahrefs' channel says "around 35%", Ahrefs' statistics page says "58% lower average click-through rate". Same company, different studies.
- **Whether volume ever helps.** 14 posts outperformed 1,033 (fatstacksblog.com), while the forum consensus is that people quit at 20 to 30 posts and that is the real failure. The threshold is unknown.
- **Whether directories do anything.** "Infrastructure" that compounds (X @consumerxai) versus "didn't get any backlinks from them" (X @bennett_ts). The entity-signal resolution here is my inference, not a measured finding.
- **Aged domains.** Documented wins ($4,000 in, ~$9,000 a month out) against an operator who abandoned all three of his. Nobody publishes the ones that did nothing.
- **Whether twelve flat months is a kill signal or impatience.** Forums say payoff starts at 12 to 18 months; base rates say most sites never get there; nobody selling SEO has an incentive to resolve it.
- **Whether AI answers are a new-site opportunity at all.** The citation data says they mirror classic rankings; the GEO vendor genre says otherwise and has published nothing comparable.

## Agent playbook notes

- **Day one, one-shot:** verify Search Console and store the baseline; crawl and record status codes, canonicals, indexability and the internal-link graph; generate the product surface tranche from the product's own API and feature inventory; run Link Intersect against three to five competitors and write the directory queue to Postgres.
- **Weekly cron:** work the directory queue; recrawl for status-code and canonical regressions; pull per-query impressions, positions and indexed ratio into a time series (never macro averages); refresh brand-mention monitoring; check liveness on every acquired link, since deletion is standard seller behaviour.
- **Monthly cron:** evaluate every kill criterion against the stored series and emit pass/warn/fail with the numbers attached; diff query coverage (distinct queries producing an impression) month over month, the best early-direction indicator available; re-run assistant visibility on the branded prompts plus the top ten unbranded ones.
- **Quarterly:** aged-domain shortlisting on request, scored on topical adjacency, Wayback continuity, referring-domain quality and spam inflation.
- **Human-gated, always:** buying any domain or link, posting as a person in a community, partnership pitches, the verdict in a competitor comparison, and the decision to kill the domain. The agent's job on the last is to make the criteria unmissable, not to make the call.
- **Cadence:** nothing meaningful changes week to week on a new domain, so weekly reporting manufactures noise and invites strategy thrash. Report monthly, defend the plan for two quarters unless a criterion trips.

## Sources

**X**

- [@alexgroberman, Jun 2 2026](https://x.com/alexgroberman/status/2061796747316449646): 57.2M AI citations, branded 77.6% versus unbranded 2.2%.
- [@alexgroberman, Jul 10 2026](https://x.com/alexgroberman/status/2075578551022358679): AirOps on 548,534 pages, ~50% of citations from Google's number one.
- [@neilpatel, Aug 1 2026](https://x.com/neilpatel/status/2083674193640476814): 82 factors, brand mentions outrank the site's own authority.
- [@consumerxai, Jul 21 2026](https://x.com/consumerxai/status/2079582673333531052): free startup directories, Sourceforge DR 92 to Peerlist DR 77.
- [@2whazzuup, Aug 16 2026](https://x.com/2whazzuup/status/2088863366773080094): fifteen lesser-known launch directories.
- [@bennett_ts, Jan 16 2026](https://x.com/bennett_ts/status/2012286979711316135): DR 4.6 to 17, but launch directories produced no backlinks.
- [@samuelthompson, Jul 14 2026](https://x.com/samuelthompson/status/2076873763564712402): agent-built directory, expecting clicks in 6 to 12 months.
- [@hustle_fred, Jul 31 2026](https://x.com/hustle_fred/status/2083170678547546518): 30 trials a month four months after starting SEO.
- [@MicroLaunchHQ, Jul 16 2026](https://x.com/MicroLaunchHQ/status/2077712874680598636): "Distribution comes after launch" called the biggest myth.
- [@codyschneider, May 25 2024](https://x.com/codyschneider/status/1794156432406765587): the three-minute expired-domain discovery workflow.
- [@hridoyreh, Aug 9 2026](https://x.com/hridoyreh/status/2086387006506995997): 782 backlinks from assets, directories and social, no timeline.

**YouTube**

- [Matt Diggity, "How Long Does SEO Take To Work for New Websites?"](https://www.youtube.com/watch?v=JrSYB1N3YRc) (transcript pulled and read, Jul 2022, 67k views): the 74% poll, his 8.6-month average, the sandbox at 2 to 4 months.
- [Ahrefs, "How I'd Get Traffic to a New Website if I Had to Start Over (2026)"](https://www.youtube.com/watch?v=Qs_p21vLp1A) (transcript pulled and read, Jan 2026, 66k views): directories, free tools, email list, traffic-targeted forum threads, sweat equity.

**Reddit**

- **None: the platform was unreachable.** reddit.com and old.reddit.com blocked at the fetch layer, curl got Reddit's bot interstitial, a text proxy returned 403 "blocked due to a network policy", and five Redlib mirrors returned 000, 403, 418, a redirect and an Anubis challenge. The r/juststart and r/SEO postmortems are the highest-value missing input here.

**Web**

- [ahrefs.com, how long it takes to rank](https://ahrefs.com/blog/how-long-does-it-take-to-rank-in-google-and-how-old-are-top-ranking-pages/): 1.74% reach the top 10 in a year; 72.9% of top-10 pages are three years old or more.
- [ahrefs.com, 107 SEO statistics for 2026](https://ahrefs.com/blog/seo-statistics/): 96.55% of pages get zero Google traffic; AI Overviews tied to a 58% lower CTR.
- [hobo-web.co.uk, "There is no Sandbox"](https://www.hobo-web.co.uk/there-is-no-sandbox-google-lies-black-hat-accusations-and-the-hostage-attribute/): the verbatim `hostAge` definition from the leak.
- [searchenginejournal.com, Mueller on sandbox and honeymoon](https://www.searchenginejournal.com/mueller-mentions-google-sandbox-and-honeymoon-ranking-effects/408994/): the May 2021 quotes denying both effects.
- [morningscore.io, 75-expert survey](https://morningscore.io/how-long-does-seo-take/): new domains at a 6 to 12 month minimum; link building is 52.1% of effort.
- [fatstacksblog.com, ten-site launch postmortem](https://fatstacksblog.com/site-launch-case-study/): 3 winners, 2 maybes, 5 losers; post counts 14 to 1,033.
- [searchenginejournal.com, Chartbeat via Axios](https://www.searchenginejournal.com/search-referral-traffic-down-60-for-small-publishers-data-shows/569959/): referrals down 60% small, 47% mid, 22% large.
- [developers.google.com, SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): sitemaps not required, keywords meta unused, no word count target, E-E-A-T not a ranking factor.
- [thewebsiteflip.com, aged domains redirected to niche sites](https://thewebsiteflip.com/guide/growth/aged-domains-redirect-niche-sites/): DR 34 at $600 through DR 57 at $4,000.
- [blackhatworld.com, sandbox in 2026](https://www.blackhatworld.com/seo/google-sandbox-still-a-thing-in-2026.1802385/): 3 to 4 months on .com, 6 to 12 on cheap TLDs.
- [blackhatworld.com, why new blogs fail in six months](https://www.blackhatworld.com/seo/why-most-new-blogs-fail-in-the-first-6-months.1746511/): the 12 to 18 month payoff claim.
- [seeklab.io, zero to 61 AI-cited pages](https://seeklab.io/blog/from-zero-to-61-ai-cited-pages-in-six-months-a-new-domain-case-study/): 61 citations alongside 361 referring domains and 42 monthly visits.
- [wecantrack.com, niche website statistics](https://wecantrack.com/insights/niche-website-statistics/): 73% under 1,000 monthly visitors in year one.

Related notes in this corpus, cited inline above: `link-building-grey-hat.md`, `content-strategy-topical-authority.md`, `ai-search-aeo-geo.md`, `technical-seo.md`, `measurement-algo-updates.md`.
