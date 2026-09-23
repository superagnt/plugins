---
status: reference
created: 2026-09-23
updated: 2026-09-23
type: reference
---

# Cold outreach playbook

The rules this skill writes and stages by. Distilled in September 2026 from 25 YouTube transcripts read in full (Alex Hormozi, Nick Abraham, Alex Berman), 60 of Nick Abraham's posts on X about LinkedIn outreach, and agnt_'s own production LinkedIn outbound, which is the system this skill generalizes. Nick Abraham matters most here: he runs this exact motion (scraping LinkedIn creators' engagers into an always-on campaign) at agency scale.

Tags: **[H]** Hormozi, **[NA]** Nick Abraham, **[AB]** Alex Berman, **[agnt_]** agnt_'s own system, **[I]** inference for this skill rather than something a source said. Video ids and X dates are in Sources at the end. These are defaults. Once the user has about 100 sends per variant, their own reply data overrides anything here.

## The five rules that decide most of the outcome

1. **The list beats everything.** A bad list gets no replies however good the rest is [H]; engagement "just indicates intent" [NA]. This skill's whole edge is the list: people who engaged with the problem this week. Never stage a marginal fit hoping the message will carry it; tighten the score instead [H, I].
2. **The offer beats the copy, and the copy beats personalization tricks.** "0 personalization + 10/10 offer beats 10/10 personalization + 6/10 offer" [NA]. The lead magnet is the biggest response-rate lever there is [H]. Worrying about subject lines means "you've already lost the cold email battle" [AB].
3. **Give before you ask, then ask small.** The first message earns a reply, not a meeting. Make "an ask they would feel silly saying no to", never a request for their time [NA]; permission asks like "Want me to send it over?" [AB]; the give comes before the ask [H].
4. **One-to-one or nothing.** Looking like a broadcast is the fastest way to be ignored [H]. One true, specific detail proves you looked [H]; a compliment alone no longer does [AB]; AI flattery generated from their profile reads as spam [NA].
5. **Reply speed is most of the game.** "90% of 'reply rate' problems are really speed-to-lead problems" [NA]; speed to contact, sustained through the thread [H]. The reply system is `webhook-auto-reply.md`.

## Sourcing

- **Likes, comments and reposts all count as intent** [NA]. When something is scarce (custom connection notes, InMail credits, the top of the send queue), rank commenters above reactors: a comment took effort, and commenters convert better [NA, agnt_].
- **Draw from several sources, never one post.** Nick scrapes 5 to 10 creators whose audience overlaps the ICP; one creator yields a tiny list unless a post went viral [NA]. This skill's three ponds do the same job: buyer-behavior posts (where the author is a lead too), the `watchlist` of competitors and creators, and topic searches.
- **Refill weekly.** "Run this every Sunday, scrape the last 7 days engagement, push it to a master database" [NA]. Scraping once is a named failure mode because the list goes stale. The standing run in step 7 is this refill.
- **Pull wide, filter yourself.** Don't pre-filter at the source by title and size, which produces tiny lists; take the whole set and judge each row against the ICP [NA]. Target department and seniority rather than exact titles: widening one client from "SDR Manager only" to "sales department, manager and above" took weekly reach from 150 to 750 and lifted response rate [NA].
- **Build the do-not-contact list before the first scrape.** The user's competitors and lookalike competitors (engager lists are full of them, and they post about bad outreach publicly), current and past employees of any company whose audience you scraped, current customers, and the creators themselves [NA].
- **Dedupe on the LinkedIn profile URL twice**, at ingestion and again right before staging: the same people engage every week and creator audiences overlap [NA].
- **At most two active contacts per company**, replacing non-responders rather than adding more [AB]. Never blast a small market [AB].
- **Be honest about fit.** Cold outreach works best for big tickets (roughly $10k or more per customer) and specific targets; a low-price, broad, self-serve product "needs a ton of volume" [H]. Say so if the user's economics don't support it.

## Before the first send: the sender

- **The profile is the landing page.** Prospects click the sender's profile before replying, and an empty one reads as a scam [H]. The headline should state the benefit, the audience, the differentiator and one proof point, not "Founder at X" [AB]; the sender should be posting about the buyer's problem, roughly three times a week [H]. Check the sender profile before any campaign starts and recommend fixes. Never edit it.
- **Stay well inside LinkedIn's limits.** About 200 connection requests a week per account is the ceiling [NA], and an account that hasn't been sending gets locked if it suddenly fires 100 or more [NA]. Ramp new senders slowly and leave the daily numbers to HeyReach's per-account limits [I].
- **Withdraw pending requests after about 10 days** [AB].
- **Never** rented or "avatar" profiles, stacked or resold Sales Navigator licenses, or tools that get around LinkedIn's caps. Some agencies do this [NA]; this skill sends from the user's own account, and a restriction costs them their network [I].
- **Email lanes:** verify every address and keep catch-alls separate [AB, NA]; plain text from sending infrastructure, never the main domain or the CRM [NA]; no open tracking: judge campaigns by replies, since opens are an outdated metric [AB]; run a placement test before launch [NA]; keep the word "free" out of the copy, since removing it took one campaign from under 1% to over 3% reply [NA].

## Connection requests (HeyReach)

- **Blank by default.** Berman's newest play opens with a totally blank request [AB], and agnt_'s own engager campaigns accept at 62.3% with the recipe on the skill page [agnt_].
- **Custom notes are a capped, monthly resource.** They get more acceptances than blank ones, but LinkedIn limits how many you can send, so reserve them for the top-scored fits and write those carefully [NA]. A reasonable cut is the top 10 to 20% by `fit_score` [I].
- **Note shape, when you use one:** "Hey Dana, you've been in a lot of the outbound and pipeline conversations lately. Would love to connect." [NA, adapted]. No pitch, no link, no creator name, and short enough for LinkedIn's note limit.
- Test a one-line note for the top tier against blank as the control, and keep whichever wins on accepted-and-replied, not acceptance alone [AB, I].

## The first message

### Rules for every lane

- **Topic, never the creator.** "Saw you've been engaging with lots of [topic] content lately" works; "Saw you engaging with [Creator]'s content" doesn't, and people screenshot creator name-drops and send them to the creator [NA]. Don't quote their comment back or link the post; for commenters, speak to the substance of their point in your own words [NA, I]. The exception is a lead who wrote the post: their own post is the natural opener ("saw you're hiring your first SDRs"), because it's their public statement rather than someone else's audience [I].
- **Lead with the give.** The lead magnet goes in the cold copy [H]; service lead magnets are "by far" getting the best results [NA]. When the user has one, the call to action offers it ("Worth sending over X?") [NA]. The full play is `free-resource-first-touch.md`.
- **One real detail, one proof point, one ask.** A specific, researched pain or signal [AB]; one true case study with a number from a similar company, never invented [AB]; exact figures, never ranges (Hormozi's only edit to a cold email he liked was replacing "20 to 30 new members" with "17.3") [H].
- **Anchor everything to the one thing that is actually different** about the product [NA].
- **Short.** Two to four lines on LinkedIn [NA]; 35 to 80 words in email, the length of Berman's own examples [AB, I]. Longer isn't better on cold [H].
- **Soft asks only.** "Want me to send over how we did this?", "Worth a quick chat?", "Mind if I send it over?" [NA, AB]. Never "Can we hop on a 15-min call?" [NA], never a calendar link [NA, AB].

### LinkedIn, after they accept

- **Nick's all-purpose template:** "Hey {first_name}, Saw {specific signal}. We help {type of company} {specific outcome}. Recently, we helped {similar company} {specific result} in {timeframe}. Worth sending over {low-risk asset}?" [NA]
- **His engager version:** "Saw you're engaging with a ton of {topic} content on LinkedIn. Would love to {give value}. Open to it?" [NA]
- **Berman's one-line qualifier:** "Hey {first_name}, are you running {category} for {company}?" and, when they say no, "Why not?" [AB]. It works best when the category is exactly what the product fixes.
- Put the whole message in the campaign's `fullMessage` variable (SKILL.md step 6), so HeyReach delivers exactly what was written.

### Email

- **Subject:** lowercase, internal-looking, two to five words [NA]. Berman's "quick question" family still works but is worn out in sales-heavy inboxes; test one topic-specific subject per campaign [AB].
- **Body shapes:** pain then ask ("PC"), or pain, a partial solution, then an offer to expand on it ("PPC", his most effective) [AB]. Or the shape Hormozi endorsed: one specific detail, a question about the problem, why you ask, a permission ask, and a PS saying part of the work is already done for them [H].
- No link in the first email, no emojis, no word "free" [AB, NA, I].

### Never

Name the creator; write "I saw you follow X" (worst of all for competitors' pages); open with a company introduction; ask for their time; send a calendar link; fake "Re:" or "Fwd:" subjects; fake "tried calling you"; fake mutual connections or referrals; fake "just bumping this"; AI flattery about their profile ("huge fan of your work"); scarcity, guarantees or client names that aren't literally true; any invented number [NA, AB, H].

## The offer

- **"Cold-ready" means three things:** extremely low perceived risk (social proof plus a guarantee), it helps them make or save money, and it solves a massive pain [NA].
- **A commodity service is not an offer.** "We do X" doesn't convert cold traffic; pitch an outcome. The exception is a signal list where the prospect is already shopping [NA]. An engager list is a mild signal, so still pitch the outcome [I].
- **Three levels, strongest first:** a service lead magnet (a free deliverable tied to the paid outcome); a guarantee ("if we don't deliver X, you get Y"), offered on the call to great fits only; an easy yes, such as a short video on where their site loses visitors [NA].
- **Hormozi's one-line offer:** "I help [who] get [dream outcome] in [time] without [effort], and I guarantee [X]" [H]. Hold it for the second or third touch; the first message is about them [H, I].

## Follow-ups

The sequence lives in HeyReach or Instantly, built by the user. Read it (SKILL.md step 6) and suggest changes against these rules; don't rebuild it inside an agent.

- **Every follow-up adds something new:** a second finding, a case study, a sales asset, a new angle. Never "just bumping this" [NA, AB, H].
- **Email:** Nick cut his sequences from four steps (2023) to two (2025): an offer with social proof, then one follow-up with value [NA]. Berman runs four follow-ups at +3, +5, +7 and +7 days: a short bump, a new idea, a testimonial, a polite breakup [AB]. Default to two or three touches over two to three weeks [I].
- **LinkedIn (Berman's cadence):** the opener; 15 minutes later one line of proof; 5 days later a result plus a native LinkedIn article or document; 4 days after that a last shot with a 5-minute ask; then check-ins at 2 and 3 months, "not being too aggressive on the messages after the first few" [AB]. Stage the long-tail check-ins as a separate re-engagement campaign the user starts [I].
- **Stop on:** any reply (HeyReach and Instantly do this natively), a "not interested", a competitor or employee match found late, or the last step going unanswered [NA].
- **Unanswered leads go to nurture, not a longer sequence.** Re-engage them with a fresh campaign next quarter; Nick quotes 8% reply with 30% of those positive on quarterly re-engagement [NA].
- **Non-acceptors** after the withdraw window are candidates for a later email lane, never emailed in the same run [AB, I].

## Replies

The system that catches and drafts them is `webhook-auto-reply.md`. The rules for what the reply says:

- **Surface interested replies immediately** and aim for a human response within 5 to 30 minutes; a call beats a written answer when there's a number [NA]. Keep the speed through the whole thread, even when they answer six hours later [H].
- **Answer exactly what they asked.** Price gets a range the user has approved; a request for information gets one relevant case study or asset; a meeting gets two or three specific times, never a bare calendar link [NA].
- **Move off LinkedIn in the first reply:** ask for their best email or number [NA]. Then continue on whichever channel they actually answer on [H].
- **Acknowledge, compliment, ask:** acknowledge what they said, compliment it, ask a question tied to the compliment that leads toward what you sell [H].
- **A "no" to something free hides a cost** (time, effort, hassle): ask why [H]. A "no" to the qualifier gets "Why not?" [AB].
- **After they've used the resource,** ask whether it helped, then offer the paid version with a risk reversal [H].
- **A positive reply that goes quiet** gets two follow-ups, then nurture [NA].
- **Mirror every LinkedIn conversation** into the workspace database: threads are lost when a seat lapses or an account gets restricted [NA].
- **Booked calls:** ask what could get in the way of making it, take the soonest slot, and remind the night before, the morning of, and an hour before [H].

## Benchmarks

Sanity ranges, not targets. Never quote them to the user as their expected result, and judge every campaign against the user's own baseline for that offer [NA].

| Signal | Range | Source |
|---|---|---|
| Engager campaign, connection acceptance | 62.3% over 8 weeks | [agnt_] the skill page's proof |
| Engager campaign, reply rate | 36% over 8 weeks; 55.3% over one 7-day window with a free resource attached | [agnt_] |
| Cold connection acceptance, one account | about 10% today; up to about 50% in good conditions | [NA] |
| LinkedIn DM reply vs cold email | 5 to 7% vs 2 to 3% | [NA] |
| InMail reply, even on weak campaigns | 8 to 10% | [NA] |
| Quarterly re-engagement of old leads | about 8% reply, 30% of those positive | [NA] |
| Free-audit ask vs book-a-call ask | 4:1 response, one test | [H], the host's number |
| "30 to 50% reply" screenshots | marketing, no methodology | [AB]; Nick calls posted screenshots "strictly for show" |

What to measure, per opener variant, per search term or creator, and per lane: acceptance, reply rate, positive replies per 100 contacted, meetings booked, shows and wins [H, NA]. Fix the top of the funnel first, since a response-rate gain multiplies everything downstream, and test the offer before polishing copy [H]. Once a week, have the user mark what booked, showed and closed, so sourcing learns which topics produce pipeline rather than replies [NA].

## Contested: defaults, not dogma

- **Blank request or a note.** Berman goes blank (2026); Nick says notes win but are capped. Default blank; notes for the top tier as a test.
- **Mentioning the engagement.** Nick's rule since 2026 is topic-only; he named creators in a P.S. in 2025 and stopped. Berman never mentions how he found someone. Default: topic, never creator or post.
- **Sequence length.** Two steps [NA] against five touches [AB]. Hormozi's three-a-day-for-five-days applies to people who already raised a hand, never to cold strangers [H].
- **How much personalization.** Offer beats personalization and AI personalization goes to spam [NA], yet even cheesy personalization beats none [NA], and a compliment isn't enough without a researched pain [AB]. Resolution: one scraped, true, specific detail (the topic they engage with, a fact from their site), never generated flattery.
- **One channel or many.** Nick routes each lead to the channel he has data for (verified email, open profile, else a connection request); Berman climbs LinkedIn, then email, then a text, then a letter; Hormozi hits everything and continues where they answer. This skill stays one lane per campaign and records non-acceptors for a later email lane.
- **Links on LinkedIn.** Nick is still testing links in the first message; Berman prefers a native article or document to a bare link.
- **Sending setup.** Berman argues for your own SMTP over Google or Microsoft inboxes behind a sequencer, without data. Treat it as one opinion.
- **Volume.** Hormozi's "100 a day" is a daily-activity mindset from warm and consumer-platform DMs, not a LinkedIn invitation quota.

## Sources

- **Alex Hormozi:** "$100M Cold Outbound Masterclass" with Enzo Carasso (`Jg5ziFeG6-k`), "Watch This To Generate 1000s of Leads (In Any Niche)" (`Mst4hreQYl0`), "Giving Away Free Stuff Will Make You Rich" (`7NMH1oAkgLY`), "Watch this to get your first 5 customers" (`w7g08dVTwaE`), "Try This Hook For Cold Calls" (`E0txxecMmPI`), "Using DM's for getting clients" (`jKpYqDrZUNE`); MoreMozi clips "150 LinkedIn DMs a Day Is Not a Growth Strategy" (`RF2VaX9N8Z4`), "Why Most Cold Outreach Fails" (`KIs-egpg1bg`), "You Need to Start Doing Outbound" (`SZ9yqgnz7mw`).
- **Nick Abraham:** "How to Scrape LinkedIn Creators for Warm B2B Leads" (`gbdzLWhdmVM`), "Book 10+ Demos Weekly Using This LinkedIn Scraping Hack" (`IDBJ9BLQlHg`), "The LinkedIn InMail Strategy That Works" (`NdKflKPVyps`), "38 Minutes Of The Best Cold Outreach Advice W/ Nick Abraham" (`CMfMrZaOxrc`, Hoani Taylor's channel), "Every Outbound Channel Ranked Worst to Best" (`cavzhhi7UD0`), "Not Getting Replies? Here's Why" (`ADavMIG4t4U`), "The Offer Framework That Books 9x More Meetings" (`ofv0vRF1p9I`), "The Re-Engagement Playbook" (`tjAf8DFH6_Y`); 60 posts on X as @NickAbraham12, 2021 to September 2026, weighted to 2025 and 2026.
- **Alex Berman:** "How I Do LinkedIn Outreach in 2026" (`Kjfkoa15cNU`), "How I Send Linkedin DMs In August 2025" (`XvSE8L3P9p4`), "How To Write Killer Cold Emails That GUARANTEE Responses" (`881Dr4lMey4`), "I Sent 10 Million Cold Emails - These 5 Scripts Made the Most Money" (`NAHRRm-9S6k`), "This AI Writes Perfect Cold Emails" (`DMphaU4ZPzM`), "How to Write Cold Email Followups" (`ecf0ye4q2yI`), "The Best Cold Email Subject Line" (`7kEV0DAAXt4`), "Get a Reply From Any Billionaire for Free" (`YQtTEJsx918`). Four of these came back only as machine-dubbed foreign-language caption tracks and were read by back-translation.
- **agnt_:** the skill page's proof (agnt_'s own HeyReach account, 1 July to 24 August 2026), and "Run Your Entire Business on AI Agents" (`s3iAOMQm7gE`, from 1:21:38).
- YouTube links are `https://www.youtube.com/watch?v=<id>`. Timestamped citations for every claim are in the research notes this file was distilled from.
