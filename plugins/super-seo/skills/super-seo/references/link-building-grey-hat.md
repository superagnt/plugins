---
status: research
created: 2026-09-20
updated: 2026-09-20
type: research
---

# Grey and black hat link acquisition in 2026

Paid links are not a fringe tactic, they are the market. 91.89% of 518 surveyed SEO professionals believe their competitors buy backlinks (editorial.link), the average price they call acceptable for one good link is $508.95, and 55.98% think Google is ineffective at detecting paid links at all. This note records what practitioners do, what it costs, what it yields and how it goes wrong. It is reported behaviour, not a recommendation: Google's link spam policy prohibits buying links that pass PageRank, and the risk labels are the substance here, not a disclaimer on it.

## TL;DR

- Real market rate sits far below agency quotes. BuzzStream via (linkdoctor.io): a vendor-sold guest post averages ~$461, the same link direct from the owner ~$295, a link insertion ~$179. Agencies mark up 60-100%+ over publisher cost (stickermule.com). @fba states the arbitrage plainly: source DR 50-80 links for $500, resell at $1,500.
- DR is the most gamed number in the market. @harpreetchatha_ posted a seller sheet offering a DR 63 domain at $45 with zero organic traffic; the only metric a buyer moves is their own DR, equally manufactured. Survivors screen on traffic and topical relevance [consensus].
- Niche edits are the highest-ROI paid link, S-tier per (YT Vasco's SEO Tips, "How to Build Backlinks to Rank #1 on Google (2026 tier list)"), because the host page is already live and indexed while a guest post starts at zero. But (YT Frey Chu, "I Ranked 14 Backlink Strategies From Worst to Best") spent thousands and ranks them mid: the $100-$130 tier reliably delivers DR 50-70 hosts with no traffic and no relevance. The price band decides the outcome, not the tactic [contested].
- PBNs still run at scale. @siggyseo claims 3,000+ and uses them only in "dirty tiers" (pointed at other links, never the money site). A credible 10-site network costs $20,000-$30,000, which is why nobody selling PBN links at $100-$500 is selling a good one.
- Punishment is overwhelmingly silent. With Penguin inside the core ranking system the default is algorithmic devaluation, no notice and no reconsideration path, and Mueller has said manual actions are reserved for "extreme cases". The burned describe a slow bleed, not a ban [consensus].
- The Aug 30 2026 site reputation abuse change split parasite SEO enforcement geographically: EU pressure forced Google to stop applying the penalty inside the EEA, so one page can rank in Paris and be invisible in New York. The UK sits outside the carve-out (YT Julian Goldie SEO, "Google Just Changed Parasite SEO Forever").
- The loudest live fight is Outrank's public marketplace paying publishers $1 per DR per post (@tibo_maker). @iannuttall's objection: a public seller menu creates a correlatable buyer-seller graph. @nemekn gave the mechanism: run Penguin, flag buyers, then flag every site linking to multiple flagged buyers as a seller.
- The two things an agent should own are price intelligence and link decay monitoring. Sellers resell slots by deleting niche edits after a week (diggitymarketing.com), and in one documented burn only ~3,500 of 36,000 links were still live. Nobody checks this by hand; a cron job does it perfectly.

### The paid link market: what things cost

Published price tables converge more than the discourse suggests. (editorial.link): low-quality guest posts $30-$150, premium $500-$4,000, low-quality niche edits $90-$150, good niche edits $200-$400, digital-PR links $500-$2,000. (linkbuilder.io) cites Ahrefs at $361.44 as the average paid backlink, Siege Media recommending ~$500 long term, and Authority Hacker's guest post band of $150-$1,000. Authority Hacker's own 755-builder survey reports a much lower $83 average, which mostly measures how much of the market transacts at the floor. Retainers sit an order of magnitude higher: one r/SEO poster was quoted 10 backlinks a month at $3,000-$4,000; another paid five figures monthly for "buying zero click backlinks from spam sites" (r/SEO, "Over $10,000 a Month for SEO??").

**Agent:** price discovery, vendor shortlisting and direct-publisher identification are fully agent-executable. The purchase is not.

### Vendor vetting, the only part of this that is skill

The consensus screen barely touches domain metrics. @PassiveSphere's pre-purchase checklist: no outlinks to adult, casino, gambling or crypto; not external links in every article; ranks organically; ranks for keywords in its own niche; content written for readers rather than for selling links. The r/SEO scam thread converged identically, its top comment arguing a relevant site with 5,000 real monthly visitors beats a DR 70 site nobody clicks, and naming inflated metrics with no traffic, thin AI content and outbound-link-stuffed pages as disqualifiers.

@harpreetchatha_ supplied the receipt in September 2026, a DR 63 domain at $45 with zero organic traffic: "The only thing you'll see improve is your DA / DR, which is meaningless because your traffic will definitely not grow." DR is computed from links, so a network linking to itself manufactures exactly the number buyers shop on.

The structural warning, from u/Different_Gur_1631 (r/SEO): good sites do not publicly advertise that they sell links, because they do not need to. Anything on a public menu is also on your competitor's menu, which is @iannuttall's objection to marketplaces and the logic (YT Vasco's SEO Tips) uses to push bought PBN links to C or D: "if you can buy it, so can I. And so can casinos." Two failure modes to design against: sellers who place a niche edit then delete it a week later to resell the slot, flagged by (diggitymarketing.com), and no contract, since the seller "can just remove the link whenever they feel like it and you're out of pocket" (r/SEO).

**Agent:** the best fit in this dimension. Traffic, outlink density, niche relevance, bad-neighbourhood and organic-ranking checks are all API calls producing a scored table rather than a gut feel.

### Niche edits and link insertions

A niche edit is a paid edit to a page that already exists, ranks and has index history. (YT Vasco's SEO Tips) ranks them S-tier and guest posts A-tier for that reason, and sells only niche edits: the value is the host page's existing metrics, not anything new. (YT Frey Chu) is the counterweight with receipts: "I've actually spent thousands of dollars on niche edits, partly as an experiment." The cheap tier is a trap, producing DR 50-70 hosts with no traffic and no relevance, and he concluded much of it was wasted. He ranks paid niche edits B-tier and DIY link inserts A-tier: email a publisher directly, offer roughly $100 to place a link with your anchor on a page you picked. He also reports the reverse trade, being offered ~$500 to insert links on his own directories.

@KaiCromwell reported a portfolio-wide shift: dropping PR links cut cost per link over 50% with better results, budget moved to insertions and guest posts. @jm0rr1s, eight years running a link agency, on supply hardening: "Sites that used to accept good pitches for content now want money."

**Risk: medium.** A paid link passing PageRank is a plain link scheme violation, but it is the most normalised behaviour in the market and enforcement is overwhelmingly devaluation. **Agent:** target discovery (pages ranking for your terms, with traffic, already linking out contextually) is fully agent-executable. The pitch is agent-drafted and human-sent. Payment never.

### PBNs in 2026

Private blog networks are not dead, they consolidated. @suganthan drew 166 likes in September 2026 with "A lot of you are so new to SEO you don't even know what a PBN is." @siggyseo, replying to @iannuttall, claimed "3k+ pbns" and gave the doctrine in one line: use them in dirty tiers, and if you sell from them, only ever share a screenshot of the anchor, never the URL [single-source, from a self-identified operator at scale]. (YT Vasco's SEO Tips) ranks a self-built PBN B-tier and bought PBN links C or D, naming two failure conditions: generic rather than niche-specific networks lose most of their effect, and shared hosting means "if any competitor of yours rats you out" the entire network and every link vanishes at once.

The economics explain the quality distribution. PBN hosting vendors put a credible 10-site network at $20,000-$30,000 all in: expired domains at $100-$3,000 each ((easyblognetworks.com): $50-$1,000 per domain, ~$25/year hosting), plus cloud hosting with IP diversity across separate C-class ranges at ~$60/month for ten sites. PBN links retail at $100-$500. Nobody amortises a $25,000 network at $100 a link, which is why networks selling at that price are the unfiltered ones taking casino, gambling and adult money, called "super shady, not cloaked at all" by (YT Vasco's SEO Tips).

One geographic exception: @loki_yan_seo argues spider pools, site clusters (站群) and PBNs remain extremely effective, but limits that to smaller-language markets, naming Chinese [single-source]. Competitive English SERPs are the hard case.

**Risk: high** bought, **medium-high** for a good own network in deep tiers. @xamfonos_ on a betting site: "We used Outrank and PBNs so aggressively... It didn't take that long before Google slammed us with manual penalty and our traffic tanked." **Agent:** not executable, because footprint hygiene is adversarial judgement and registrar, host and payment control is exactly what an autonomous system should not hold.

### Expired and aged domains

Two plays share one supply chain. The rebuild buys an expired domain with residual authority, revives a topically adjacent site, lets it re-index as its own entity, then links out. The redirect skips that and 301s every page at the target. (YT Vasco's SEO Tips) ranks the redirect C-tier: "this is a bit black hat... it did work quite effective, but I haven't done it in a while." (YT Frey Chu) ranks the rebuild B-tier and names time as the constraint: months of shopping marketplaces for genuine leftover authority that is topically adjacent, plus the rebuild, "months of work just to get one backlink". His 2026 caveat matters: AI-assisted rebuilds make this viable at scale for the first time.

Supply side: expireddomains.net is the standard free discovery layer, acquisition via GoDaddy Auctions, NameJet, DropCatch and SnapNames, whose backorders run $59-$69 by TLD ($69-$79 at SnapNames), charged only on a win (domaindetails.com). Contested brandable .com auctions close in the hundreds to thousands. Enforcement is now named. Google's spam updates explicitly include expired domain abuse, and (YT Kasra Dash, "Google's March 2026 Spam Update") gives the canonical example: buying an expired bakery domain and turning it into an e-commerce store, borrowing authority between two unrelated things. Topical adjacency is the line, not a cosmetic. (diggitymarketing.com) documents an irrelevant-redirect manual action from a real rejection notice (an Irish food festival domain redirecting to US kitchenware), described as the first redirect penalty the author had seen in five years, which itself says how rare the manual version is.

**Risk: high** for irrelevant 301s, **medium** for a genuinely adjacent rebuild allowed to become its own entity first. **Agent:** shortlisting is a strong fit. Pull expiring lists, score on referring domains, Wayback continuity, topical adjacency and spam-inflation signals, alert on the good ones. Bidding is human-gated.

### Parasite SEO after the site reputation abuse split

Parasite SEO publishes on someone else's high-authority domain so the page inherits that trust. Two halves get conflated. The link half is weak. (YT Vasco's SEO Tips) puts parasite platform links in C-tier: they are nofollow, and anything free you can get, everyone can get, so "if you're doing parasite SEO for the links, kind of pointless." (YT Frey Chu) agrees the equity is zero and values it for visibility instead, citing a semi-viral Reddit post that sent thousands of real visitors.

The ranking half is where the money is. @ConnorShowler: organic SEO takes months to reach commercial intent, "Meanwhile I regularly see Parasite SEO on established authority websites rank page 1 in days or even hours." He rates Facebook and Reddit as the best free sources and paid spots on independent publishers as strong value: "Way better off paying for a parasite spot than some janky PBN links lol." Market rates (stickermule.com): $150-$350 for a mid-tier DR 30-50 host (avg ~$220), $300-$1,500 for higher-authority hosts, $800-$1,500 for a press release, the $5-$50 bulk tier dismissed as "footprint, not results". (YT Frey Chu) names the black end without detail: gambling and adult operators taking over .edu pages and subdomains.

Then August 2026. Per (YT Julian Goldie SEO), Google amended the site reputation abuse policy effective August 30 2026 under EU regulatory pressure, because legitimate publishers running normal partner, deals and sponsored sections were caught alongside spammers. Outside the EEA nothing changes and violating pages are still pulled. Inside the EEA (27 EU states plus Iceland, Norway, Liechtenstein) the penalty does not land and the section may be judged on its own merits, so one page can be invisible in New York and ranking in Paris. The UK sits outside the carve-out because of Brexit, the detail most likely to be gotten wrong. Search Console warnings still fire globally.

Buried in the same update, Google published the four factors it applies to hosted content, the most actionable item here: does it look like it belongs (design, layout, feel); is quality consistent with the domain; is a real named author or editor taking responsibility; is it duplicated word for word elsewhere. Its safe example is a curated, disclosed, bylined deals section folded into the normal site. Its unsafe example is an article with no author, no editor, no disclosure, unreachable from the menu, not matching site style, copied from a third-party marketplace.

Enforcement is not uniform. (YT Kasra Dash) showed listwire.usatoday.com at an all-time traffic high during the March 2026 spam update, flagged by Charles Floate: aggressive parasite publishing on a major news domain running into a spam update and winning, at least in that window.

**Risk: medium** for disclosed, bylined, integrated placements on relevant hosts, **high** for bulk syndication onto unrelated authority domains, and now asymmetric by region. **Agent:** identifying which authority hosts already rank for your commercial terms is fully agent-executable via SERP tooling, as is the per-region rank tracking the policy split now demands. Publishing and paying are human-gated.

### Link exchanges, ABC swaps, sitewide and footer deals

Swaps are the only zero-cash channel at scale, which is why both tier lists rank them near the top. (YT Frey Chu) puts them S-tier and prefers an aggressive variant: pull a competitor's referring domains, contact each, ask them to swap the competitor's link for yours. His argument is certainty, since you verify DR, page relevance, real traffic and outbound link count before agreeing.

(YT Vasco's SEO Tips) calls swaps the only genuinely free method and is relaxed about swapping with direct competitors. He also shows where it is going: his product runs an automated exchange across thousands of sites, places contextual rather than profile links, and deliberately breaks one-to-one reciprocity so a participant may give one and receive two. That is not generosity, it is footprint avoidance.

That is what ABC exchanges are for: A links to B, B to C, C to A, so no pair reciprocates directly. Per the exchange guides surveyed, Google works at macro-pattern level rather than per link, with temporal clustering as a primary signal, because organic cross-linking accumulates over years while an organised campaign produces an acquisition spike. Reciprocal links inserted at similar times, in similar positions (footers, sidebar widgets), with similar anchors, are the easy pattern, and a footer carrying 50 outbound links to unrelated sites in exchange for equivalent footer links is a blatant scheme with zero navigational value.

The market is professionalising in public: @GetTrueDR posts open offers with verified metrics ("TrueDR 53 · DR 53 · 15.6K monthly users. One editorial link each"), @yeonjidev sells DR 50 backlinks via a paid directory listing, @codyschneider's new-site playbook ends at "once DA gets high enough start cold emailing for link exchange", and @DarayuthH scrubbed the phrase "link exchange" from his marketplace after being warned, a reminder that the words are a footprint too. The inbound side is automated: @asaio87 suspected a swap pitch was a bot, asked for a sorting function in pseudocode, and got one.

**Risk: low** for a handful of relevant, temporally scattered contextual swaps, **medium-high** for network-automated swaps at volume, **high** for sitewide or footer reciprocity. **Agent:** partner discovery and qualification are fully agent-executable and probably the strongest ROI automation here, since the entire cost is research and email. The agreement is human-gated, and the volume dial is where an unattended agent gets its operator burned.

### Tiered link building

Tiered building points links at the pages linking to you. @ConnorShowler's chronology puts it last, as "icing". The honest read from (distribb.io) is that the economics fail: tier 2 is built at volume, meaning blog comments, forum profiles, web 2.0 posts, directory spam and auto-generated pages, all discounted by Google for over a decade, and "building them by hand costs the same as building a tier 1 link and returns a fraction as much." The likeliest outcome is not a penalty but nothing: money spent, links ignored, tier 1 unaffected. Two real failure modes: a guest post you placed now sits in an obvious spam neighbourhood and the publisher may remove it once they notice what points at it, and bundled services report only tier 1 so the buyer cannot see what was built underneath.

Operators are candid about the effort. On (BlackHatWorld, "Is GSA Still a Good Option for Tier 2 Backlinks in 2025?") an elite member argues the automation is not the problem, the link list is, and hired a VA purely to maintain lists. Another, stacking A-Parser, ScrapeBox, GSA PI, ZennoPoster and XRumer, reports "GSA SER fails A LOT on engines it should be posting to. Probably 80% of what it should post to fails", concluding "99% of people will not do it".

**Risk: low to medium.** Dominant risk is wasted spend; the tail risk is contaminating a tier 1 placement you paid for. **Agent:** not worth agent time for a small SaaS, except defensively, monitoring what points at your own tier 1 placements.

### How punishment actually lands

The mental model most buyers hold is wrong. With Penguin folded into the core ranking system, the documented default is that spammy links are devalued rather than the site demoted, with no notification and no reconsideration mechanism, and John Mueller has said manual action is something Google tries to do "fairly rarely and usually really in kind of the extreme cases". @iannuttall, who argues hardest against public link buying, concedes it: "Manual actions for unnatural links aren't as common as they once were because the spam algorithm detects them and ignores them."

So the realistic downside is a slow bleed. One documented case (ronthewebguy.com): domain authority falling 43 to 34 in two months from late 2025, January 2026 still one of the site's best months, then collapse from February to July 2026 to under 60 monthly organic visitors from 1,600+, a 96% loss, with roughly 3,500 of 36,000 backlinks still live [single-source, not source-verified, HTTP 403 on direct fetch]. The shape, metrics degrading months before traffic does, is what to internalise.

The market-wide version is more persuasive because it is a census. The study of 40,000+ link-selling sites cited by (editorial.link) tracked 44,276 active paid-link sites in June 2023 down to 31,388 by April 2024, roughly 29% attrition, with ~11,000 survivors carrying fewer than 100 indexed pages and only 6.6% showing positive year-over-year traffic. Sellers are dying faster than buyers, so a link bought today on a site already deindexing is an asset with a known half-life.

@iannuttall frames the tail risk best: "It may not be all-or-nothing. It may be that every algorithm update brings a new drop in traffic over time until the site no longer ranks for any of the things that matter, maybe even your own brand name."

@nemekn gave the clearest detection hypothesis [single-source, unconfirmed by Google]: run Penguin; flagged sites are buyers; sites linking to multiple flagged buyers are sellers; fully algorithmic, and "it's the buyers that give the seller away". True or not, it predicts why a public marketplace is more dangerous than private outreach at identical volume.

On what triggers the rare manual version, (diggitymarketing.com) is the strongest evidence base because its examples come from real manual action rejection notices: non-relevant niche edits, sponsored posts, zero-traffic rebuilds on archived content, guest post farms with author-box money anchors, "best/top rated" pages, fake social profiles hiding dofollows, and irrelevant redirects. Its load-bearing claim: "The biggest cause of Manual Actions is too many 'money keyword' anchor text links." Anchor ratios, not link counts, are the trigger.

Disavow is narrower than folklore. Mueller's 2024 guidance: disavowing makes sense with a manual action for link spam, or if you are certain you would get one if a human looked; otherwise the algorithm already ignores them. @akwhateverrr, reacting to @mjdhameliya's unannounced new domain picking up 187 spam referring domains overnight that resolved to PBN sellers, landed on the right posture: "I dont think disavow is needed these should be filtered by google but disavowing might pull down the harm. Maybe."

## What is contested

- **Does buying links still work.** @fba says no for real businesses: 60+ SaaS companies to seven-figure outcomes at DR 50-60 without buying, and link-selling is simply the easiest money in SEO. @iannuttall, @suganthan and the grey-hat reply pool say it obviously works, which is why the market exists, and the real question is risk pricing. Both are right about different niches: @SEOKeval ranked an ecom brand top 3 for "cbd gummies" on 5-6 backlinks a month and said "The CBD/THC space is unique for SEO in that there's no overdoing it with link building... be aggressive with anchor text, and still see results." Anchor aggression survivable in CBD is not survivable in B2B SaaS.
- **Are public marketplaces worse than private buying.** @iannuttall says yes, the buyer-seller graph becomes trivially correlatable. @dallas_on_ai says the framing is wrong: "It's not a pbn lol. Backlinks are added to real genuine sites that are niche relevant." @tibo_maker counters that the risk argument cuts both ways: "if you're sure about that, plug your competitors on Outrank and all your issues will disappear." @iannuttall's rebuttal, via Marie Haynes: links alone do not penalise, patterns consistent with manipulation do, which is why negative SEO mostly fails but buying still carries risk.
- **Can Google detect paid links at all.** 55.98% of 518 surveyed professionals say no, 44.02% say yes (editorial.link). A near coin flip among people who do this for a living should temper confidence either way.
- **Do PBNs belong in a 2026 stack.** @siggyseo runs 3,000+ in deep tiers; (YT Vasco's SEO Tips) will build his own but not buy others'; u/Lazy_Accountant_1274 wrote only "DO NOT INVEST IN PBN's". Opinion tracks almost perfectly with whether the speaker has run a network.
- **Are niche edits S-tier or a money pit.** (YT Vasco's SEO Tips) sells them and ranks them top. (YT Frey Chu) bought thousands of dollars of them and ranks them mid, conceding a trustworthy vendor would move them to A. The disagreement is entirely $100-$150 versus $200-$400.

## Grey hat corner

| Practice | Market price | Claimed yield | Failure mode | Risk |
|---|---|---|---|---|
| Niche edit / link insertion | $75-$600, avg ~$141-$179; good tier $200-$400 | Fastest-indexing paid link, S-tier per Vasco | Cheap tier is high DR, no traffic, no relevance; seller resells the slot | Medium |
| Guest post (paid) | Direct ~$295, vendor ~$461; premium $500-$4,000 | Full control of content and anchor | Author-box money anchors on known guest post farms are a documented manual action trigger | Medium |
| Bought PBN link | $100-$500 | Volume and anchor control | Whatever you can buy, casinos bought too; shared hosting loses the whole network at once | High |
| Own PBN, niche-specific | $20k-$30k per 10 sites; domains $100-$3,000; ~$60/mo hosting | Unlimited controlled links in deep tiers | Footprint discovery, competitor reporting, simultaneous total loss | Medium-high |
| Expired domain 301 redirect | Domain cost plus $59-$69 backorder | Instant transfer of residual authority | Named as expired domain abuse in spam updates; irrelevant redirects draw manual actions | High |
| Expired domain rebuild | Same acquisition cost plus months of rebuild | Genuine standalone asset that can link out | Time cost; must be topically adjacent or it is the abuse case | Medium |
| Parasite placement (paid) | $150-$350 mid-tier, $300-$1,500 high-authority, $800-$1,500 PR | Page 1 in days or hours on commercial terms | Site reputation abuse removal, now region-split; $5-$50 tier is pure footprint | Medium to high |
| Link swap / ABC exchange | $0 cash | Verified quality before committing; competitor displacement | Temporal clustering and reciprocity patterns; footer or sitewide reciprocity is blatant | Low to medium-high by volume |
| Tiered links (GSA etc) | Software, proxies, VA time | Amplifies tier 1 equity | ~80% engine failure rate; usually ignored; can contaminate paid tier 1 | Low to medium |

## Agent playbook notes

For a small SaaS, an agent should not be the thing that buys links. It should be the thing that stops you buying them badly, and that catches the decay nobody else catches.

**Fully agent-executable, on cron:**

- **Link decay and liveness monitoring, weekly.** Every acquired link lands in the workspace database with URL, anchor, cost, date and vendor. The agent re-fetches each host page and verifies the link exists, is still dofollow, and the page is still indexed. This counters the resell-the-slot scam and the 36,000-to-3,500 decay pattern, and no human does it consistently.
- **Vendor and inventory scoring.** Given a seller sheet or marketplace listing, resolve each domain against organic traffic, niche keyword rankings, outbound link density, bad-neighbourhood outlinks and content quality, then emit pass/fail with reasons.
- **Price intelligence.** Log every quote by domain, DR, real traffic and link type, and compute effective cost per trafficked-relevant link. This closes the $295-versus-$461 spread and makes the @fba markup visible.
- **Anchor ratio monitoring.** Money-keyword anchor concentration is the documented primary manual action trigger, so track the ratio and alert before a campaign pushes past the page-one competitor norm.
- **Parasite and placement discovery.** For each commercial term, list the high-authority hosts already ranking that accept third-party content, ranked by fit against Google's four hosted-content factors.
- **Region-split rank tracking.** Mandatory after the Aug 30 2026 EEA carve-out: blended rank numbers will lie about any page the site reputation abuse policy touches. Track US, EEA and UK separately.
- **Swap partner discovery.** Pull competitor referring domains, filter to contextual linkers with real traffic that are niche-adjacent but not direct competitors, enrich to a contactable editor, queue. Frey Chu's competitor-displacement play, mechanised up to contact.
- **Expired domain shortlisting.** Score auction inventory on referring domains, Wayback continuity, topical adjacency and spam-inflation signals, surfacing only the few worth a human bid.

**Agent-drafted, human-gated:** any outbound email to a publisher; any commitment of money; disavow files, where the agent assembles candidates with evidence but a human decides and submits, and per Mueller the default answer is usually no; and the volume dial on swaps and insertions, since temporal clustering is the detection signal and an agent that acquires efficiently is an agent that acquires suspiciously.

**Never agent work:** building or operating a PBN, executing 301 redirect networks, and anything needing registrar, host or payment account control.

**Cadence:** link liveness, anchor ratios and domain scans weekly; vendor scoring at quote time; price rollup and opportunity discovery monthly; region-split rank tracking daily.

## Sources

**X**

- [@iannuttall, Sept 3 2026](https://x.com/iannuttall/status/2095420271754702994): the public-marketplace buyer-seller graph argument.
- [Replies to that thread](https://x.com/iannuttall/status/2095420271754702994): @siggyseo's 3,000+ PBNs, @xamfonos_'s manual penalty, @nemekn's reverse-Penguin theory.
- [@harpreetchatha_, Sept 4 2026](https://x.com/harpreetchatha_/status/2095674918793023915): a DR 63 domain at $45 with zero organic traffic.
- [@fba, Nov 11 2025](https://x.com/fba/status/1988191492892926117): source DR 50-80 links at $500, resell at $1,500.
- [@ConnorShowler, Sept 6 2026](https://x.com/ConnorShowler/status/2096605884487000393): parasite spots rank page 1 in days, beating PBN links.
- [@ConnorShowler, Sept 24 2025](https://x.com/ConnorShowler/status/1970954798263390359): the four-stage chronology, buffer links then tiered links.
- [@KaiCromwell, Nov 6 2025](https://x.com/KaiCromwell/status/1986509642755686717): dropping PR links cut cost per link over 50%.
- [@freychu, Jun 21 2025](https://x.com/freychu/status/1936498276448325955): $2k+ on niche edits, blind to the referring domain.
- [@PassiveSphere, Jul 22 2026](https://x.com/PassiveSphere/status/2079901774559768778): the five-point pre-purchase vetting checklist.
- [@tibo_maker, Aug 2026](https://x.com/tibo_maker/status/2092166071654445257): Outrank pays $1 per DR per post, DR 40+.
- [@suganthan, Sept 3 2026](https://x.com/suganthan/status/2095453394563735741): most current SEOs do not know what a PBN is.
- [@mjdhameliya, Sept 19 2026](https://x.com/mjdhameliya/status/2101224005500014874): an unannounced new domain drew 187 spam referring domains.
- [@loki_yan_seo, Sept 10 2026](https://x.com/loki_yan_seo/status/2097855584297243067): spider pools and PBNs still strong in smaller-language markets.
- [@SEOKeval, Sept 18 2026](https://x.com/SEOKeval/status/2100938138390499571): CBD to top 3 on 5-6 links a month, aggressive anchors.
- [@codyschneider, Jan 15 2026](https://x.com/codyschneider/status/2011830738606338377): directories, drip-ping indexing, then cold-email exchange.
- [@GetTrueDR, Sept 20 2026](https://x.com/GetTrueDR/status/2101462859188154808): swap offers now quote verified DR plus real traffic.

**YouTube** (all four transcripts pulled and read in full)

- [Vasco's SEO Tips, "How to Build Backlinks to Rank #1 on Google (2026 tier list)", 56:16](https://www.youtube.com/watch?v=sRqKwb_8X4s): the full tier list, plus an automated swap network that breaks reciprocity on purpose.
- [Frey Chu, "I Ranked 14 Backlink Strategies From Worst to Best", 20:24](https://www.youtube.com/watch?v=Vj1LUdq4nDY): thousands spent on niche edits, the $100-$130 trap, competitor swaps S-tier.
- [Julian Goldie SEO, "Google Just Changed Parasite SEO Forever", 8:09](https://www.youtube.com/watch?v=O3BpnQ8U9LY): the Aug 30 2026 EEA carve-out and Google's four hosted-content factors.
- [Kasra Dash, "Google's March 2026 Spam Update", 10:53](https://www.youtube.com/watch?v=FpvoFW7T01c): named spam targets; listwire.usatoday.com at an all-time high mid-update.

**Reddit**

- [r/SEO, "How do you even do link building in 2025?"](https://www.reddit.com/r/SEO/comments/1pi9vks/how_do_you_even_do_link_building_in_2025/): the buyer's dilemma, heavily moderated comments.
- [r/SEO, "How not to get scammed when buying backlinks?"](https://www.reddit.com/r/SEO/comments/1rxqcza/how_not_to_get_scammed_when_buying_backlinks/): avoid public advertisers, screen on traffic not DR, expect no contract.
- [r/SEO, "Black hat gets rewarded?"](https://www.reddit.com/r/SEO/comments/1v4emt6/black_hat_gets_rewarded/): keyword-domain mini-sites climbing five years unpunished.
- [r/SEO, "Did I leave money on the table ignoring guest post requests?"](https://www.reddit.com/r/SEO/comments/1rdybm0/did_i_leave_money_on_the_table_ignoring_guest/): an agency quoting 10 backlinks a month at $3,000-$4,000.
- [BlackHatWorld, "Is GSA Still a Good Option for Tier 2 Backlinks in 2025?"](https://www.blackhatworld.com/seo/is-gsa-still-a-good-option-for-tier-2-backlinks-in-2025.1687108/): the link list is the moat, ~80% engine failure rate.

**Web**

- [editorial.link, link building statistics, 518 SEOs](https://editorial.link/link-building-statistics/): $508.95 acceptable price, 91.89% believe competitors buy, 55.98% doubt detection.
- [editorial.link, buying backlinks in 2026](https://editorial.link/buy-backlinks/): the price table by type, plus the 40,000+ seller census.
- [linkdoctor.io, buying links in 2026](https://linkdoctor.io/blog/buying-links/): BuzzStream's $461 vendor vs $295 direct, $179 insertions.
- [linkbuilder.io, link building pricing](https://linkbuilder.io/link-building-pricing/): Ahrefs' $361.44 average; retainers $3,000-$15,000+/month.
- [diggitymarketing.com, white hat link types that get you penalized](https://diggitymarketing.com/white-hat-link-penalties/): seven link types from real manual action rejection notices.
- [stickermule.com, parasite SEO buyer's guide](https://www.stickermule.com/write/seomasterclass/parasite-seo-services-the-buyers-guide): placement pricing by host tier and agency markups.
- [distribb.io, tiered link building in 2026](https://distribb.io/blog/tiered-link-building-strategy): why tier 2 economics fail and contaminate paid tier 1.
- [easyblognetworks.com, cost of a good PBN domain](https://www.easyblognetworks.com/blog/cost-of-a-good-pbn-domain): $50-$1,000 per domain, ~$25/year hosting.
- [ronthewebguy.com, SEO shortcuts penalty case study](https://ronthewebguy.com/seo-shortcuts-google-penalty-case-study/): the 96% collapse [single-source, HTTP 403 on direct fetch].
