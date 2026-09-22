---
status: research
created: 2026-09-20
updated: 2026-09-20
type: research
---

# On-page optimization and E-E-A-T

On-page SEO in 2026 is two jobs people keep conflating. The first is making a page eligible to rank: mostly relevance and intent matching, and nearly free. The second is winning the click once eligible, which is title and snippet work and where the recoverable revenue sits, because the AI Overview era collapsed click-through rates on pages whose rankings never moved. Evidence below comes from Zyppy's 81,000-title studies, Ahrefs on 300,000 keywords and 1.4M ChatGPT prompts, a 131-practitioner expert survey, three practitioner video walkthroughs read in full, and the r/SEO and r/bigseo threads where the counter-position gets argued. Several widely repeated best practices here do not survive the data, and a few correlate with losing traffic.

## TL;DR

- Google rewrites 61.6% of title tags (80,959 titles, 2,370 sites, zyppy.com). Length dominates: 51-60 characters gets rewritten 39-42% of the time, over 70 characters 99.9%, 1-5 characters 96.6%. [consensus]
- Matching H1 to title is the highest-leverage anti-rewrite move. When both contain a number, Google retains it 97.3% of the time versus 25.8% rewrite when only the title has it (zyppy.com). [consensus]
- Separator choice is measurable: dashes stripped 19.7% of the time, pipes 41.0%. Brackets rewritten 77.6% with 32.9% full removal; parentheses 61.9% with 19.7% (zyppy.com). [consensus]
- Clickbait title conventions correlate with *losing* traffic in core updates: adjectives -0.420 and numbers -0.297 against traffic change across 50 sites, heavy schema .381, update frequency .455 (X @CyrusShepard, zyppy.com). The most counterintuitive finding in the corpus. [contested]
- Content optimizer scores are weak predictors. Surfer's own study reports 0.28 Spearman across 1M SERP entries; Ahrefs measured Clearscope .30 versus Surfer .27; Originality.ai put Surfer at 26% and Clearscope at 17.5%. Treat 70-80 as a coverage floor, not a target to max. [consensus on numbers, contested on interpretation]
- 131 surveyed practitioners rated search intent match the top individual signal and meta description dead last, so low most believe it has no ranking impact (signal.zyppy.com, ppc.land). [consensus]
- Google's own AI optimization guide says structured data is not required, there is no ideal page length, no requirement to chunk, and no need to write specially for generative search (developers.google.com). This contradicts most published AEO advice. [single-source but authoritative]
- AI Overviews cut position-one CTR 34.5% in Ahrefs' March 2025 measurement and up to 58% by December 2025. Rankings hold, clicks vanish, analytics never flags it. The highest-value thing an agent can detect. [consensus]
- ChatGPT citation data: natural-language slugs cited 89.78% versus 81.11% for opaque URLs, and cited pages show title-to-prompt cosine similarity 0.602 versus 0.484 (ahrefs.com, 1.4M prompts). Title wording is now a retrieval signal, not just a click signal. [single-source]
- E-E-A-T-as-checklist is under real attack. Zyppy's 50-site study found author information at -0.041, insignificant. r/SEO practitioners argue trust reduces to links plus click behaviour. Lily Ray's counter: risk sits at page-type level, not byline level. [contested]

### Title tags: the rewrite tax comes first

Google rewrites 61.6% of title tags across 80,959 titles on 2,370 sites (zyppy.com); an earlier 41,000-title sample put it at 67%. If your title is rewritten, every CTR decision you made was overridden, so rewrite-proofing is upstream of CTR testing, not parallel to it.

Rewrite rate by length: 1-5 characters 96.6%, 20 or fewer over 50%, 51-60 characters 39-42% (the floor), over 60 above 76%, over 70 at 99.9%. Zyppy's separate length study frames the target as 50-60 characters or 580-600 pixels on desktop, mobile tolerating 70-80, with peak traffic around 55-60 characters across a quarter-million URLs.

Structural levers are cleaner because they are binary. Dashes survive at 19.7% removal, pipes at 41.0%. Square brackets are the worst common construction: 77.6% rewrite with 32.9% of bracketed text deleted, versus parentheses at 61.9% and 19.7%. Zyppy's guidance is to write the title as one continuous sentence, because Google's rewrite behaviour is to drop the least relevant segment and segmentation hands it a cut point.

The H1 alignment finding is the one most people have not internalized. When title and H1 both contain a number, 97.3% of displayed titles retain it, versus 25.8% rewrite when only the title carries it. Zyppy reports matching H1 to title dropped rewriting across the board, often dramatically. The mechanism is presumably corroboration: Google wants on-page confirmation that the title describes the page, and the H1 is the cheapest witness.

Remaining anti-rewrite rules: no repeated keyword inside one title, no identical boilerplate across many pages, never ship empty or partial titles. **Agent verdict:** fully automatable. Deterministic string analysis against a published rule set, all inputs from a crawl.

### CTR-driven title testing as a repeatable loop

The practitioner version is not A/B splitting, which most small SaaS sites cannot power. It is a Search Console gap hunt. Matt Diggity's workflow filters GSC for positions 3-20, over 500 monthly impressions, and CTR below a positional par: under 3% for positions 3-5, under 2% for 6-10, 1.5% beyond (YT Matt Diggity, "I Let AI Agents Run My SEO"). Those thresholds are the reusable artifact, turning "low CTR" from a vibe into a filter. His arithmetic: a page at 10,000 monthly impressions moved from 2% to 5% CTR yields 300 extra visitors, and at 2% site conversion that is six more leads from roughly twenty minutes of work.

He reports three agents (click-gap, decay, depth) flagging 28 pages on a US moving company site and $19,200 monthly new organic revenue in GA4 within three weeks. Treat the revenue as a single-source vendor claim attached to an agency pitch; treat the thresholds and method as reusable. [single-source]

What separates this from generic AI output is the evidence file. His explicit instruction is not to ask a model what is wrong with a page, because that produces generic advice and confident hallucination. Instead the prompt supplies traffic trends, search data, ranking history, page summary, competitor pages and which SERP features are present, then forces one primary diagnosis from a fixed enum (stale content, wrong content type, missing coverage, weak title, stronger competitors, technical) with a confidence score out of ten and supporting evidence. Forcing one diagnosis from a closed list is what makes the output actionable rather than a listicle.

His second agent catches what he calls the invisible traffic killer: impressions holding steady while clicks fall. That is the AI Overview signature, invisible in analytics because rankings did not move. Ahrefs anchors it: position-one CTR for AIO keywords fell from 0.073 in March 2024 to 0.026 in March 2025, about 34.5%, across 300,000 keywords split evenly between AIO and non-AIO informational terms. By December 2025 the same methodology reports 0.016, up to 58%. 99.2% of AIO keywords are informational, telling you where to look first.

**Agent verdict:** fully automatable for detection and drafting, human gate on publish. Detection is a GSC query plus arithmetic; titles are brand voice.

### Headings, H1, and the bare-minimum pass

Nathan Gotch states the floor explicitly: keyword in the title, meta description, URL slug, H1, an H2 variation, and the first sentence, which he frames as roughly 50% of on-page SEO with NLP and entity coverage as the rest (YT Nathan Gotch, "The SEO Audit Process I'd Use in 2026"). Nobody disputes the floor. The disputes are about what sits above it.

Below H1, practitioner consensus is a subheading every 200-300 words, phrased as the questions users actually ask (YT Surfer Academy, "How to Write SEO Content That Ranks"). Question headings give Google and LLMs explicit signals about section content, and the same source notes this is a decades-old tactic that still works. Adjacent rules from that walkthrough: lead with the answer, keep paragraphs to two or three sentences, target a sixth to eighth grade reading level.

Gotch adds two structural checks: flag any page deeper than three clicks from the homepage, and flag pages with fewer than three to five unique internal inlinks. Both are Screaming Frog columns, trivially automatable, and both matter more than any heading tweak on a site carrying orphan pages.

**Agent verdict:** the floor and the structural checks run end to end from a crawl plus GSC. Heading rewrites need a voice gate.

### Meta descriptions: dead as a ranking signal, alive as a click lever

The 2026 survey asked 131 practitioners to score over 100 signals from +3 to -3, producing 13,665 data points (X @CyrusShepard; signal.zyppy.com). Meta description finished last, rated so low most respondents believe it has no ranking impact; search intent match finished first (ppc.land). That pairing is the story: the item agencies put on monthly deliverable reports is the lowest-rated signal in the survey.

The mechanism is CTR, not ranking. The r/bigseo thread on high impressions and no clicks is instructive because the poster had already rewritten every title and meta description with no improvement. Top-voted diagnoses were AI Overviews suppressing blog-query clicks, position (impressions from 20-40 where low CTR is expected), and PAA impressions counting in GSC while producing almost no clicks. You cannot fix a positional or SERP-feature problem with copy, and much meta description work is exactly that mistake.

**Agent verdict:** automatable to draft, but check whether the CTR deficit is explained by position or AIO presence before spending a rewrite.

### Entity and semantic optimization: do the optimizer scores correlate

Every independent measurement lands in the same band. Surfer's own 2025 study reports 0.28 Spearman across 1M SERP entries. Ahrefs, with no stake in either tool, measured Clearscope .30 and Surfer .27 across both correlation models. Originality.ai put Surfer at 26% and Clearscope at 17.5%. Weak to moderate, positive, nowhere near deterministic.

The recurring practical reading is to use the score as a coverage floor around 70-80 rather than a ceiling to chase, because pushing for 95+ produces content reading as machine-assembled term-stuffing. The Zyppy over-optimization data below supports that failure mode.

What the tools do demystifies the score. Surfer's editor analyses pages currently ranking, extracts entities they consistently mention, and measures your coverage against that set, surfacing counts like 38 of 81 (YT Surfer Academy). It reverse-engineers the SERP; it does not model the algorithm. Its own guidance: skip terms that do not fit, and read a stuck score after auto-optimizing as a missing subtopic rather than missing vocabulary, fixed by writing the heading two or three competitors share that your outline skipped.

The r/SEO counter is that entity coverage is downstream of something simpler: every keyword you get clicks for *is* topical authority by definition, requiring no mystical topical map (r/SEO, 338 points). A top comment reduces it further, arguing Google rewards measurable signals (clicks, links, topical footprint) rather than appraising quality.

**Agent verdict:** an agent can run entity gap analysis end to end without a paid optimizer by scraping the top ten, extracting shared headings and repeated noun phrases, and diffing against the target page. Diggity's third agent is exactly this. The paid score is convenience, not requirement.

### Information gain versus topic coverage

Information gain is the fashionable answer. It is not clearly the winning one.

Nathan Gotch states he has a study showing topic coverage matters more than information gain, while agreeing a transcript of your own point of view is a useful input, and claims 100% AI content is losing to hybrid (X @nathangotch). Both are pre-publication claims from an interested party with a tool affiliation. [single-source]

Against that, Cyrus Shepard's summary of Andy Crestodina's 1,042-marketer survey reports original research raised self-reported strong results by roughly 50%, expert collaboration was the strongest single predictor, and 92%+ of marketers now use AI with essentially zero correlation between AI usage and better results. Marketers using six or more proven strategies were nearly 3x more likely to report strong results (X @CyrusShepard). Self-reported data, so causal direction is ambiguous.

David Quaid puts information gain on an explicit myth list alongside LLMs.txt, schema, outbound citations, content structure and depth, meta descriptions and E-E-A-T (X @DavidGQuaid). Shepard's survey curation includes Dan Petrovic arguing content that is too expert-level actively harms visibility.

**Agent verdict:** agent with human gate. An agent reliably finds *coverage* gaps against the SERP. It cannot generate genuine information gain, which by definition requires first-party data, original testing, or a named human's experience.

### Featured snippets and people-also-ask

Honest finding: this is the worst-evidenced area in the charter, and the search results are contaminated. Queries for 2026 snippet length data surface a dense layer of AI-generated content-farm pages (aiocopilot.com, dataenriche.com, niumatrix.com, w3era.com, metadatareactor.com) citing suspiciously precise statistics, including a supposed Moz and "Search Quality Research Group" study reporting a 42-word desktop and 38-word mobile optimum and a 31% higher full-render rate for 36-44 word snippets. I could not verify that study exists and am not treating it as real. Fabricated precision attached to a plausible-sounding institution is the dominant failure mode here, and any agent researching this niche needs a source-credibility filter or it will launder these numbers into a client deliverable.

What survives is weaker and older: a 40-60 word direct-answer paragraph immediately after a question-phrased heading, no preamble. The logic is display-space constraint rather than algorithm, and it agrees with the lead-with-the-answer advice (YT Surfer Academy). Treat it as a reasonable heuristic with no strong 2026 study behind it. [contested]

The well-evidenced PAA finding is negative: PAA impressions count in GSC but convert to almost no clicks, so a page with high impressions and near-zero CTR may simply be living inside PAA boxes (r/bigseo). An agent reading raw GSC CTR without segmenting by SERP feature will misdiagnose this constantly.

**Agent verdict:** agent-runnable for formatting, but frame it as a low-cost heuristic, not a tested tactic.

### E-E-A-T signals that are actually actionable

The strongest empirical result here is negative. Zyppy's 50-site study across core updates found author information correlated at -0.041 with traffic change, statistically insignificant, alongside table of contents at +0.042 and word count at -0.161. Zyppy's headline on a related study is that the winners were "not author boxes." If you have been selling author boxes as an E-E-A-T fix, the data does not support it.

Google's official generative-AI guide compounds this: structured data is not required, no ideal page length, no requirement to chunk, no need to write specially for generative search, and avoid seeking inauthentic mentions (developers.google.com). The r/SEO thread surfacing it notes what is absent: no LLMs.txt, no special writing, no chunking, no mention of E-E-A-T at all.

Two things remain actionable, both at a different altitude than a byline. First is page-type risk, Lily Ray's position and the most useful reframing in the corpus. Certain page types, especially at scale, are a liability rather than an asset, and AI tools now recommend building exactly those without understanding the risk. The pattern she names is content hooking a reader with a promise to educate, then steering toward your product as the single solution (X @lilyraynyc, 199 likes). Her test is whether an objective third party would see the page as helpful and unbiased, not whether you think it is. An intent-honesty check, not a schema check.

Second, the consequence is visible at URL-pattern level. Google issued WindowsForum.com a partial manual action for thin content with little or no added value, scoped to one URL pattern covering 168,290 threads (r/SEO). Pattern-scoped manual actions are the enforcement mechanism matching Ray's framing.

The counter-camp has a real argument. The r/SEO thread on smart-sounding SEO not mattering reduces it to trust equals backlinks, topical authority equals backlinks from related topics, helpful content equals backlinks without the spam. A top comment invokes Eric Schmidt's line about brands sorting the cesspool and argues Google need not judge content quality when it can look at who links to you. The sharpest version: Google built E-E-A-T guidance, found every implementation unreliable, too expensive, or worse-performing than PageRank validated by user behaviour, and now pretends SEOs were crazy for pushing it.

**Agent verdict:** the checklist half (author schema, bio, about and contact pages, citations) is automatable and cheap, worth doing because the downside is zero. The part that moves the needle, page-type risk and honest-versus-promotional judgement, needs a human gate. An agent asked whether its own principal's content is objectively unbiased will say yes.

### Engagement signals after the navboost leak

The May 2024 Content Warehouse leak confirmed three click signals inside NavBoost: goodClicks (clicks that do not bounce back quickly), badClicks (fast pogo-sticks), and lastLongestClick (the result holding attention). Google representatives had said for years that click data was not a ranking signal (sparktoro.com).

The 2026 survey ranks behaviour and click signals fifth at 29.4% of respondents naming it top-three, behind relevance 57.1%, backlinks 54.8%, content quality 47.6% and authority/trust 36.5%, ahead of brand signals 27.0%, user satisfaction 19.8%, technical SEO 17.5%, topical authority 14.3% and internal links 11.1% (ppc.land). Practitioners believe it matters, and matters less than the classics.

The on-page consequence is the interesting part. If lastLongestClick is real, the above-the-fold contract between title, snippet and opening paragraph is a ranking-relevant surface, not just a conversion surface. A title overpromising relative to the page earns the click and then earns a badClick. That is the mechanistic case against clickbait titles, and it lines up with the correlations below.

**Agent verdict:** an agent monitors the proxies (CTR by position, and the impressions-flat-while-clicks-fall pattern) end to end. It cannot observe goodClicks or dwell directly.

### Over-optimization: the signals that correlate with losing

This is the finding most likely to change what a competent SEO does tomorrow, and it inverts a decade of advice. Shepard's published correlations for features associated with update traffic *declines*: anchor text variety .337, click-baity title tags .420, heavy schema usage .381, page update frequency .455 (X @CyrusShepard). He flags correlation is not causation in the same post, the right caveat, which does not make the numbers go away.

Inside the title finding, from the 50-site study: adjectives -0.420 and numbers -0.297 against traffic change, with listicle-style titles correlating with losses (zyppy.com). Freshness ran against the usual advice too: winning sites averaged 774 days since last on-page date, losing sites 273. Heavier updating correlated with losing.

These are almost certainly proxies rather than causes. Sites stuffing adjectives and numbers into titles, re-dating constantly, blanketing everything in schema and varying anchor text aggressively are sites doing aggressive SEO, and what got demoted was the aggregate pattern. The practical instruction is identical either way: the cluster of moves reading as "an SEO worked on this page" is the cluster that correlated with decline. Ahrefs' citation data agrees on freshness, with cited pages at a median ~500 days and non-cited pages trending younger.

**Agent verdict:** an agent detects all four patterns from a crawl. One of the highest-value automatable audits available, and almost nobody runs it, because the industry default is additive.

### Titles and URLs as AI retrieval signals

Ahrefs analysed 1.4M ChatGPT 5.2 prompts, comparing retrieved URLs cited against not, roughly a 50/50 split (49.98% cited). Two findings are directly on-page. Cosine similarity between the cited URL's title and the prompt was 0.602 versus 0.484 for non-cited, rising to 0.656 against the best-matching fan-out query: titles written the way a person phrases a question, rather than how a keyword tool phrases it, are measurably more retrievable.

Natural-language slugs were cited 89.78% of the time versus 81.11% for opaque URLs. An eight-point gap on a decision made once at publish time and expensive to reverse, which makes it a high-value default for an agent enforcing publishing standards. (The rest of that study, on retrieval-source citation rates, is AEO territory.)

**Agent verdict:** fully automatable. Slug linting and title-to-query phrasing comparison are mechanical.

## What is contested

**Does E-E-A-T do anything mechanically, or describe outcomes?** Ray's camp holds the risk is real at page-type level. The r/SEO camp holds trust reduces to PageRank plus click behaviour, and that rich author schema loses routinely to anonymous content on stronger domains. Zyppy's -0.041 and Google's AI guide omitting E-E-A-T both favour the sceptics on the mechanical question. Ray's page-type argument is untouched by that data and survives it.

**Information gain versus topic coverage.** Gotch claims a forthcoming study showing coverage wins; Quaid calls information gain a myth; Crestodina's survey found original research raised strong results ~50%. Unresolved, and the camps partly measure different things (rankings versus business outcomes).

**Do optimizer scores earn their subscription?** Everyone agrees the correlation is 0.27-0.30. The fight is whether 0.28 justifies the workflow. Pro: a fast coverage floor. Con: chasing it produces the exact over-optimized pattern that correlated .420 with update losses.

**Should you update content frequently?** Standard advice says yes. Zyppy says winners were older (774 versus 273 days) and update frequency correlated .455 with decline; Ahrefs says cited pages median ~500 days. Either standard advice is wrong, or frequent updating marks sites already in trouble updating in panic. Nobody has separated these.

**Is the clickbait finding causal?** Shepard says not established. Alternative reading: listicle-heavy sites are disproportionately affiliate and content farms, and the update targeted the business model, not the title syntax.

## Grey hat corner

The grey-hat surface for on-page is narrow (most of it lives in links), but two practices appear with enough specificity to document.

**Physical and semi-physical CTR manipulation.** The published version is local: have one or two team members search the business on Google Maps, open the listing, request directions, and physically drive in each morning, tracking the GBP before adding a third person. The escalation is paying an Uber driver roughly $10 to request directions and leave a five-star review on arrival, producing a local IP, a genuine route, and a review timed to the visit (X @indexsy, 78 likes, attributed to Tristan Zheng). Market price: $10 per instance, free for the staff version. Claimed yield: map pack movement, with the claim that reviews plus CTR alone produce six figures monthly in some industries. Failure mode is stated in the source: do not unleash the whole team at once or Google claps the profile and it does not come back. **Risk: high.** It targets exactly the NavBoost-style signals the leak confirmed exist, the class Google has the most footprint data to detect. The organic version (click farms, CTR bots) is the same play with worse economics and identical detection surface.

**Staff-incentivized review velocity.** The same source recommends paying the receptionist per review mentioning her name, weekly gift-card draws, and coaching reviews to mention service and city, acknowledging Google frowns on it. Market price: $10-50 per review in gift-card value. Claimed yield: velocity, with profiles holding far fewer total reviews taking the map pack when all reviews landed in the past month. **Risk: medium to high**, and it violates platform policy rather than a ranking algorithm, so enforcement is review removal or suspension rather than demotion.

**What is not grey hat but reads like it.** The over-optimization correlations mean entirely white-hat, Google-recommended behaviour (adding schema, updating pages, writing compelling titles) sits in the same correlation band as manipulation when done at volume. The line is not white versus grey, it is restrained versus maximized. The same @indexsy thread makes the adjacent point that typical agency on-page deliverables are theatre: rewriting meta descriptions, keeping titles under 55 characters, fixing page speed on zero-traffic pages.

## Agent playbook notes

Given the tool surface (SERP, keyword, backlink, on-page and LLM-visibility data, web search and fetch, Postgres, cron, plus people and company enrichment), here is what actually runs.

**End to end, no human gate, weekly cron:**

- *Title rewrite-risk audit.* Score every title against the Zyppy rule set: character count against the 51-60 band, separator type, bracket usage, keyword repetition, cross-page boilerplate, empty titles, and title-to-H1 overlap. Pure string analysis.
- *Click-gap detection.* GSC filtered to positions 3-20, impressions above 500, CTR below positional par (3% for 3-5, 2% for 6-10, 1.5% beyond). Store in Postgres so week-over-week movement is trackable.
- *Decay and AIO-suppression detection.* Compare trailing three months against the prior three. Flag clicks down over 20%, and separately flag impressions flat while clicks fall. That second pattern is the highest-value item here for a small SaaS, because it is invisible in GA4 and rank tracking.
- *Over-optimization audit.* Count adjectives and numbers in titles sitewide, measure schema density per page, content re-date frequency, and internal anchor text variety. Flag the pattern that correlated with core-update decline.
- *Slug and title-phrasing lint on new pages.* Enforce natural-language slugs (89.78% versus 81.11%) and compare title phrasing against actual GSC queries and PAA phrasings by cosine similarity (cited median 0.602).
- *Bare-minimum on-page pass.* Keyword in title, meta, slug, H1, an H2 variation, first sentence. Plus crawl depth over three clicks and pages under three to five unique internal inlinks.
- *Entity and coverage gap analysis.* Scrape the top ten, extract shared headings and repeated entities, diff against the target page, report missing subtopics. Replaces a Surfer or Clearscope seat for the one job the 0.28 correlation supports.

**With a human gate:**

- *Title and meta rewrites.* Draft with the full evidence file (current title, competitor titles, SERP features, actual GSC queries, position history), force one diagnosis from a closed enum with a confidence score, hold for approval. Brand voice and overpromise risk both need a human, and the badClick mechanism means an overpromising title is worse than a boring one.
- *Anything touching E-E-A-T judgement.* An agent adds author schema and verifies about, contact and author pages exist. It cannot judge whether a page is promotional content pretending to be educational.
- *Content-type and page-type decisions.* "Should this page exist" is higher-stakes than "is this page optimized," and it is the question agents are worst at, because scaled page generation is what they are best at producing.

**Do not automate:** information gain generation (first-party data, original testing and named human experience are the inputs, and an agent has none; it can only brief a human), and any CTR or review manipulation.

**Cadence:** click-gap and decay weekly, because the AIO effect moves too fast for monthly. Rewrite-risk and over-optimization monthly. Slug and title lint on publish, triggered not scheduled. Coverage gap on demand plus a quarterly sweep of the top fifty pages.

**Calibration note:** set expectations at 3 to 6 months to ranking potential, faster in low-competition niches, longer in legal, finance and health (YT Surfer Academy). Agents reporting week-one results are measuring noise. Check at 30, 60 and 90 days.

## Sources

**X**

- [@CyrusShepard, over-optimization correlations](https://x.com/CyrusShepard/status/1803890849639731611) - Anchor variety .337, click-baity titles .420, heavy schema .381, update frequency .455 against update declines.
- [@CyrusShepard, 2026 Ranking Factors Expert Survey](https://x.com/CyrusShepard/status/2097739110710653292) - 131 practitioners, 13,000+ data points, nine areas including a new Google AI category.
- [@CyrusShepard, ten survey takeaways](https://x.com/CyrusShepard/status/2099554986439143498) - Quotes rejecting content length and warning overly expert content can hurt visibility.
- [@CyrusShepard, on Crestodina's 1,042-marketer study](https://x.com/CyrusShepard/status/2099969054660547003) - Original research raised strong-result likelihood ~50%; AI usage near-zero correlation.
- [@lilyraynyc, page types as liability](https://x.com/lilyraynyc/status/2079656501258359188) - Scaled promotional-but-educational pages are a liability; the test is third-party perceived bias.
- [@nathangotch, coverage versus information gain](https://x.com/nathangotch/status/2090622916106887532) - Forthcoming study claiming coverage beats uniqueness; 100% AI content losing to hybrid.
- [@DavidGQuaid, the 2026 myth list](https://x.com/DavidGQuaid/status/2020636044639547492) - Schema, information gain, meta descriptions, content structure and E-E-A-T all on an explicit myth list.
- [@indexsy, local SEO 80/20 with Tristan Zheng](https://x.com/indexsy/status/2100324231167009245) - Local on-page floor, the drive-in CTR play, and the $10 Uber-driver review tactic.

**YouTube**

- [Matt Diggity, "I Let AI Agents Run My SEO"](https://www.youtube.com/watch?v=0ccnRNTxwqc) - Full transcript. Three-agent architecture, positional CTR par thresholds, forced-single-diagnosis prompt design, claimed $19,200/month.
- [Nathan Gotch, "The SEO Audit Process I'd Use in 2026"](https://www.youtube.com/watch?v=hDBsQTK7VTc) - Full transcript, 9,773 words. Bare-minimum on-page pass, crawl depth over three clicks, sub-five inlink flagging, cannibalization detection, thin content.
- [Surfer Academy / Matt Kenyon, "How to Write SEO Content That Ranks"](https://www.youtube.com/watch?v=QL_fgTOS4pI) - Full transcript. What Content Score measures, 70/30 proven-to-unique outline split, subheadings every 200-300 words, 3-6 month timeline.

**Reddit**

- [r/SEO, "A Few Things That Finally Clicked About Authority, Topics, and How Google Actually Ranks Pages"](https://www.reddit.com/r/SEO/comments/1p06nk4/a_few_things_that_finally_clicked_about_authority/) - 338 points. Topical authority as the phrases you already get clicks for; comments tie it to navboost and internal PageRank.
- [r/SEO, "Let's be straight - most of the smartest sounding SEO stuff doesn't matter does it?"](https://www.reddit.com/r/SEO/comments/1rq8lq8/lets_be_straight_most_of_the_smartest_sounding/) - The reductionist counter-case, plus the claim Google abandoned E-E-A-T as unimplementable.
- [r/bigseo, "High impressions but almost no clicks"](https://www.reddit.com/r/bigseo/comments/1pfk98w/high_impressions_but_almost_no_clicks_what_am_i/) - AIO suppression, positions 20-40, and PAA impressions counting in GSC while producing no clicks.
- [r/SEO, WindowsForum thin-content manual action](https://www.reddit.com/r/SEO/comments/1v6jn8x/google_hit_windowsforumcom_with_a_thincontent/) - Partial manual action scoped to one URL pattern covering 168,290 threads.
- [r/bigseo, "Sometimes the simplest SEO changes make the biggest difference"](https://www.reddit.com/r/bigseo/comments/1ohz0or/sometimes_the_simplest_seo_changes_make_the/) - Titles plus internal linking alone moved rankings in two weeks.

**Web**

- [Zyppy, "Google Rewrites 61% of Page Title Tags"](https://zyppy.com/seo/google-title-rewrite-study/) - 80,959 titles, 2,370 sites. Rewrite rates by length, bracket versus parenthesis, dash versus pipe, 97.3% H1-alignment retention.
- [Zyppy, "The Ideal SEO Title Tag Length"](https://zyppy.com/title-tags/meta-title-tag-length/) - 50-60 characters or 580-600 pixels, quarter-million URLs, peak traffic at 55-60 characters.
- [Zyppy, "10 Ways To Stop Google Rewriting Your Title Tags"](https://zyppy.com/title-tags/beat-google-title-rewrites/) - The anti-rewrite checklist with supporting percentages per tactic.
- [Zyppy, "How Recent Google Updates Punish Good SEO: 50-Site Case Study"](https://zyppy.com/seo/google-updates-punish-good-seo/) - Adjectives -0.420, numbers -0.297, author info -0.041, word count -0.161, winners 774 days versus losers 273.
- [Ahrefs, "AI Overviews Reduce Clicks by 34.5%"](https://ahrefs.com/blog/ai-overviews-reduce-clicks/) - 300,000 keywords, position-one CTR 0.073 to 0.026, 99.2% of AIO keywords informational.
- [Ahrefs, "Why ChatGPT Cites One Page Over Another"](https://ahrefs.com/blog/why-chatgpt-cites-pages/) - 1.4M prompts. Cosine 0.602 versus 0.484, slugs 89.78% versus 81.11%, cited median ~500 days, search-sourced 88.46%.
- [Google Search Central, AI features optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) - Official mythbusting: no structured data requirement, no ideal page length, no chunking, no special writing style.
- [PPC Land, "131 SEOs rank relevance top Google factor, meta description dead last"](https://ppc.land/131-seos-rank-relevance-top-google-factor-meta-description-dead-last/) - Full top-ten ordering with percentages and the seven-point scale methodology.
- [Zyppy Signal, 2026 Google Ranking Factors Expert Survey](https://signal.zyppy.com/p/google-ranking-factors-expert-survey) - Primary source. Intent match highest, meta description lowest, original research topping content quality.
- [SparkToro, on the Google Content Warehouse API leak](https://sparktoro.com/blog/an-anonymous-source-shared-thousands-of-leaked-google-search-api-documents-with-me-everyone-in-seo-should-see-them/) - Source disclosure behind goodClicks, badClicks and lastLongestClick.
