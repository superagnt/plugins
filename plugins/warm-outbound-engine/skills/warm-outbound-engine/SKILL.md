---
name: warm-outbound-engine
description: This skill should be used when the user wants to run the LinkedIn Warm Outbound skill, or asks to "scrape LinkedIn post engagers", "build outbound from people engaging with my market", "find warm leads on LinkedIn", "turn LinkedIn engagement into a sequence", "write outreach from what people commented", "offer each lead a free personalized resource", "auto-reply to LinkedIn or cold email replies", or "put my LinkedIn outbound on autopilot", or wants recurring engagement-sourced prospecting staged into HeyReach, Instantly, AgentMail or their own Gmail. Runs on the superagnt MCP: LinkedIn post + engager data, first-party enrichment, workspace database, and one sending lane of the user's choice, with a research-backed cold outreach library and a hosted agent team for the recurring version. Stages campaigns stopped; starting a sequence is always the human's.
version: 0.3.0
---

# LinkedIn Warm Outbound

Outbound sourced from engagement, not from a list. Every lead in the table
did something in public first: reacted to, or commented on, a post about the
problem you solve. Builds on the base `lead-generation` skill for the
enrichment mechanics — read that for per-tool detail; this one adds the
engagement source, the scoring gate, the first message, and the four sending
lanes.

The intended arc: run it once end to end in this client, look at what it
staged, then put it on autopilot as a hosted agent team (step 7).

## The outreach library

This skill ships a reference library in `references/`, researched September
2026 from full YouTube transcripts (Alex Hormozi, Nick Abraham, Alex
Berman), Nick Abraham's LinkedIn outreach posts on X, and agnt_'s own
production system. Read the matching file before the step that needs it,
and prefer it over generic outreach folklore.

- `references/icp-scoring-rubric.md`: the two-layer scorer (a narrow gate,
  then one holistic score against the ICP description) and the weekly
  calibration loop. Read before step 4.
- `references/cold-outreach-playbook.md`: targeting, connection requests,
  first messages, follow-ups, replies, sending limits and benchmarks, per
  lane. Read before step 5.
- `references/free-resource-first-touch.md`: build each qualified lead a
  personalized asset from their own data and offer it instead of a pitch.
  Read when step 1 set a `first_touch_asset`.
- `references/webhook-auto-reply.md`: vendor webhooks into a deployed agent
  that classifies replies, logs them, and drafts or sends answers under
  approval.
- `references/autopilot-agent-team.md`: turning a good local run into a
  recurring agent team on superagnt: the team shape, data jobs for the
  per-lead work, cadence, cost, and how real deployments broke.

For LinkedIn via HeyReach, also load the platform's own doctrine:
`agnt_guidance_load({ "name": "linkedin-outreach" })`.

No `references/` folder next to this file (a harness that saved only
SKILL.md)? Fetch the one you need from
`https://raw.githubusercontent.com/superagnt/plugins/main/plugins/warm-outbound-engine/skills/warm-outbound-engine/references/<file>`.
If that fails, say so once and proceed: the steps below stand alone.

## Step 0 — tools

`agnt_tools_list_enabled`; if missing:
`agnt_tools_enable({ "families": ["data:linkedin", "database"] })` (the
first-party `data_agnt_*` people/company tools are always on). That is the
whole first run — **do not enable a sending lane yet.** `requires_upgrade` →
`confirm_url` to the user → wait → re-run. (The `warm-outbound-engine`
skill endpoint pre-enables these two.)

## Step 1 — the ICP, and the searches it implies (first run only)

Ask once, in one message, and draft what you can from their website so they
only have to correct it:

- who buys, in their words: the roles that own the problem, the kind of
  company, the situation in which they feel it, and who looks close but
  never buys. This becomes the ICP description the score reads
  (`references/icp-scoring-rubric.md`);
- where they can sell, and who never to contact: competitors, customers,
  partners, their own team;
- a watchlist: the competitors whose posts their buyers react to, and 5 to
  10 creators whose audience is the buyer. Optional, and the steadiest
  source there is;
- which channel they send from: HeyReach, Instantly, AgentMail or Gmail
  (recorded now, enabled at step 6);
- optionally, what they could give a prospect for free that proves they are
  good at their job (a report, a teardown, a sample list, a working setup of
  their product). See `references/free-resource-first-touch.md`; if they
  have nothing, skip it and the plain opener still works.

Create the tables. If they exist from an earlier version of this skill, add
the missing columns instead of recreating them:

```
icp_profile(id, sells text, problem text, icp_description text,
            trigger_signals text, target_geography text, personas text,
            do_not_contact text, qualify_threshold int default 50,
            lane text, first_touch_asset text, updated_at timestamptz)
watchlist(linkedin_url unique, kind text, name text, added_at timestamptz)
leads(id, person, linkedin_url unique, linkedin_member_urn unique, title,
      company, company_domain, email, email_verified boolean,
      source_kind text, pond text, source_post_url, engagement text,
      engagement_text text, persona text, fit_score int, fit_reason text,
      opener_variant text, first_message text, status text,
      staged_at timestamptz, replied_at timestamptz, reply_intent text,
      updated_at timestamptz)
search_history(term, kind, pond, searched_at default now())
scraped_posts(post_url unique, post_urn, pond, term_used, author, snippet,
              scraped_at)
```

Then write the answers to `icp_profile` (`agnt_db_insert`) and the watchlist
(`kind` is `competitor` or `creator`). The do-not-contact list goes in before
the first scrape: engager lists are full of competitors, and messaging one
is the fastest way to get your outreach posted about.

Upsert key on `leads` is `linkedin_url` — it is the only identifier that
survives a job change. LinkedIn also spells the same person as an encoded
member id (`ACoA…`) in some payloads, so keep `linkedin_member_urn` too and
dedupe on both.

## Step 2 — choose this run's sources, then write its searches

**Where you fish matters more than how hard.** There are three ponds, and
only one of them is the obvious one:

1. **Buyer behavior (write these first).** Posts written by people who have
   the problem right now: hiring for the function ("hiring a [role that owns
   the problem]"), scaling or straining ("our [process] is breaking"),
   evaluating ("anyone using a [category] tool for [job]?"), or the pain
   stated plainly at the end of a bad week. On these posts **the author is a
   lead too**, and the strongest one there is: writing the post is the
   intent signal.
2. **The watchlist.** The recent posts of the competitors and creators in
   `watchlist`. Everyone reacting to a competitor's product content is
   already shopping; a creator's audience is the buyer by construction.
3. **Topic.** Keywords and hashtags for the space. The widest pond and the
   noisiest: people who talk about a category for a living are often the
   ones selling into it, which is why it is one pond of three.

Over a week, aim for roughly 40% buyer-behavior searches, 30% watchlist and
30% topic. A run gives its searches to one or two ponds rather than all
three shallowly; the first run covers all three.

**Do not keep a fixed keyword menu.** Generate 3–6 fresh searches per run
from the ICP description, steered by two queries. Run both with
`agnt_db_execute_sql`; `agnt_db_select` can't express a join or a
`now() - interval` filter:

```sql
-- what has actually converted, per pond and term
SELECT sp.pond, sp.term_used, count(l.id) AS leads,
       count(*) FILTER (WHERE l.fit_score > 50) AS qualified,
       count(*) FILTER (WHERE l.replied_at IS NOT NULL) AS replied
FROM scraped_posts sp JOIN leads l ON l.source_post_url = sp.post_url
GROUP BY 1, 2 ORDER BY replied DESC, qualified DESC;

-- what not to repeat yet
SELECT term FROM search_history WHERE searched_at > now() - interval '14 days';
```

Write more phrases like the families with replies; drop the phrasing
patterns that produced leads and no replies. Never reuse a term from the
14-day window; everything older is fair game again. Give the next run's
searches to the pond that is producing.

**The single highest-leverage rule here: write the language your BUYER
posts in, not the language your industry sells in.** Category and execution
terms ("shelf reset", "category review", "Q3 launch at Target") surface
posts whose engagers are buyers. Vendor/martech terms ("retail media
network", "martech stack") surface posts engaged with by other vendors, and
a run of those poisons the table with people who will never buy. Test every
generated term: *would a buyer plausibly write or react to a post using this
phrase?*

Insert each term into `search_history` with its `kind` (`keyword`,
`hashtag`, `watchlist`) and `pond` **as soon as its search call returns**,
zero results included, so a run that dies halfway keeps the history of what
it actually searched. A term whose call failed (credits, provider error) is
not recorded and stays eligible next run.

## Step 3 — the sweep

1. Find the candidate posts: `data_linkedin_search_posts` for keyword
   searches (buyer behavior and topic), `data_linkedin_search_post_by_hashtag`
   for hashtags (topic only), and for a watchlist entry
   `data_linkedin_get_company_s_post` (a company page) or
   `data_linkedin_get_profile_s_posts` (a person), taking its 1–2 most
   engaged posts from the last couple of months. 3–5 posts per run across
   all ponds — that cap is deliberate, it is the run's whole data cost.
2. Prefer posts with real engagement; a post with 4 reactions is not worth
   a scrape when a 90-reaction one is in the same result set.
3. Skip posts already in `scraped_posts`. Record the rest, with their
   `pond`, as you take them.
4. `data_linkedin_get_post_reactions` for reactors,
   `data_linkedin_get_profile_post_comment` for commenters. Record
   `engagement` ('reacted' | 'commented') per lead — commenters convert
   better and are worth a different opener. Keep what they did in
   `engagement_text`: the comment itself for commenters, the reaction type
   for reactors. It is the one personalization hook every lead comes with.
5. On a buyer-behavior post written by a person, add the **author** as a
   lead too (`source_kind = 'author'`, with the post itself as
   `engagement_text`); everyone else is `source_kind = 'engager'`. Never add
   a competitor as the author of its own post, and drop the employees of a
   watched company when you pull its engagers.
6. Drop anyone whose `linkedin_url` or `linkedin_member_urn` is already in
   `leads`. Dedup at the source, never at send time.

**Geography and other filters belong on the enriched profile, not on the
search payload.** LinkedIn's post-search results omit location for plenty of
genuinely in-market posters; filtering there silently starves the funnel.
Take the lead, filter it in step 4.

## Step 4 — score, then enrich

Two layers, in this order, from `references/icp-scoring-rubric.md` (read it
before the first scoring pass). **The score gates the spend: a lead that
fails it never costs an email lookup.**

1. Check the profile URL first (free): a missing or malformed one never
   becomes a paid call.
2. `data_linkedin_get_profile_data_by_url` → real title, company, location,
   and the canonical profile URL. Dedupe again on both keys.
3. **The gate:** reject only an explicitly out-of-region location or an
   empty or fake profile (`fit_score = 3`, with the reason), and drop anyone
   on the do-not-contact list. Never judge the role here: a gate that
   guesses at fit from a headline starves the funnel.
4. `data_agnt_companies_enrich` (or `data_linkedin_get_company_by_domain`)
   → domain, size, industry. Research the company further only when the
   score can't be settled without it.
5. **The score:** one holistic judgment against
   `icp_profile.icp_description`: `fit_score` 0–100, a two- or
   three-sentence `fit_reason` that cites the evidence and names the
   uncertainty, and a `persona` only when confident. Above the bar
   (`qualify_threshold`, default 50) qualifies, and an unresolved maybe
   qualifies; a score at or under it needs a concrete wrong-way reason.
   Below the bar → `status = 'disqualified'` and stop: no email lookup, no
   message, ever.
6. Only for leads that cleared the bar, and only when the lane sends email:
   `data_agnt_people_email_finder` from name + domain, then **always**
   `data_agnt_people_email_verifier`. LinkedIn URL → email is not a one-step
   lookup. Unverified stays `email_verified = false`; those rows are still
   workable on LinkedIn. When `icp_profile.lane` is HeyReach, skip both calls.
7. `agnt_db_upsert` with `status` moving new → scored → enriched → staged,
   so a failed run resumes instead of restarting. `enriched` means ready to
   message. Never overwrite a known value with a blank.

Above ~500 leads a run, this belongs in a data job rather than a longer
session — one cheap structured call per lead
(`references/autopilot-agent-team.md`).

## Step 5 — write the first touch

Read `references/cold-outreach-playbook.md` before writing a single
message; it has the rules per lane. The ones that matter most:

- **The message has one job: a reply.** It reads one-to-one. No company
  intro, no feature list, no calendar link in the first touch.
- **Open with the topic they engage with, never the creator.** "Saw you've
  been in a lot of conversations about <topic>" works; "saw you liked
  <creator>'s post" reads as surveillance and gets screenshotted back to the
  creator. For commenters, the substance of what they said
  (`engagement_text`) is fair game, in your own words; never quote it back
  or link the post. For authors (`source_kind = 'author'`), their own post
  is the natural opener ("saw you're hiring your first SDRs"): it's their
  public statement, not someone else's audience. A generic compliment is
  worse than nothing.
- **Give before you ask, then ask small.** A yes/no question or permission
  to send something useful, not a meeting.
- **Never invent a detail or a number.** Exact figures from their own data,
  or none at all.

Write each lead's message into `leads.first_message` and tag
`opener_variant` (`plain`, or `asset` when step 1 set a
`first_touch_asset`). With an asset, build it for the top-scored leads first
and offer it in the message: `references/free-resource-first-touch.md`.

Show the user the first five messages (and the first five assets) before
anything is staged. After they approve the style, show a sample each run.

## Step 6 — stage into the lane, once

Enable **only** the lane recorded in `icp_profile.lane`. Four lanes:

### HeyReach — LinkedIn sequences

`agnt_tools_enable({ "families": ["connection:heyreach"] })`, then load the
platform's HeyReach doctrine once:
`agnt_guidance_load({ "name": "linkedin-outreach" })`. The campaign engine
owns delivery (timing, acceptance, reply-stop); this skill owns judgment
(who, what to say, what to do with replies).

1. The user builds the campaign in HeyReach: the sequence, a sender
   account, created with "Create empty list". Read it before touching it:
   `connection_heyreach_campaign_get_by_id` for the status,
   `connection_heyreach_campaign_get_sequence` for the variables each step
   uses.
2. Personalization rides on the lead at enrollment and can't be changed
   afterwards. Pass the whole first message as one custom variable
   (`customUserFields: [{ "name": "fullMessage", "value": ... }]`) and make
   the sequence's message step just that variable; also fill every other
   variable the sequence references, plus `firstName`, `lastName`,
   `companyName` and `position`. A missing variable falls back to generic
   copy silently. Write the message to the row, read it back, then enroll.
3. **Stage without starting:** `connection_heyreach_list_add_leads_v2` into
   the campaign's lead list works while the campaign is paused, and nothing
   sends until the user resumes it. `connection_heyreach_campaign_add_leads_v2`
   only works on an active campaign and starts delivery for those leads, so
   use it only when the user has said the campaign is live and wants leads
   flowing into it.
4. Leads already in HeyReach are skipped silently: a successful call does
   not mean every lead was added. Stamp `staged_at` only on rows you can see
   in the list afterwards.

Two settings that decide whether this works: **send a blank connection
request** (a request carrying a pitch converts materially worse than an
empty one), and turn on exclude-in-other-campaigns so one person never
appears in two sequences.

### Instantly — email sequences

`agnt_tools_enable({ "families": ["connection:instantly"] })`

`connection_instantly_listcampaign` to pick the persona-matched campaign,
then read its first step to see which variable it expects.
`connection_instantly_bulkaddleads` with `campaign_id`, the verified-email
rows only (an unverified address in an Instantly campaign is a bounce
charged against the sending domain), and `skip_if_in_workspace: true`. The
first message rides in the lead's `personalization` field or a
`custom_variables` key that the step references.

### AgentMail — an inbox the agent owns

`agnt_tools_enable({ "families": ["connection:agentmail"] })`

`connection_agentmail_create_inbox` once (its own domain — never the user's
primary), then `connection_agentmail_create_draft` per lead (`to`,
`subject`, `text`; never `send_at`) and `connection_agentmail_send_draft`
when the user releases them. Replies come back through
`connection_agentmail_list_messages` /
`connection_agentmail_reply_to_message`, which is what makes this lane the
one where the agent can actually hold the thread.

### Gmail — the user's own mailbox

**This lane is not on the workspace MCP and `agnt_tools_enable` will never
turn it on.** `connection_gmail_*` exists only inside a *deployed* agent's
tool config. Wire it at step 7 when the agent is created, as flat `tools`
entries: `{ kind: "integration", provider_id: "gmail", operation_id:
"save_draft" }` and `"send_email"`. `send_email` carries a
`default_permission` of `always_ask`, so every send surfaces for approval
unless the user explicitly asks for an override — offer the drafts-only
shape (`save_draft` alone) first.

**In every lane: stage, do not start.** Add the leads, leave the campaign
stopped, and report what is waiting. Pressing start is the user's act, and
it is the last point at which a bad list can still be caught.

## Step 7 — put it on autopilot

One batch is not the product. A list built once and never refilled goes
quiet within weeks — the sequence outruns the leads and the channel looks
dead. Once a run has worked end to end and the user liked what it staged,
offer the standing version: `references/autopilot-agent-team.md` covers the
team shape (who does the judgment, what moves into a data job to cut AI
cost, what webhooks trigger), the cadence, and the ways real deployments of
this exact motion have broken. The reply side is
`references/webhook-auto-reply.md`: without it `leads.replied_at` stays
empty, step 2's steering query has nothing to learn from, and the engine
generates volume without ever getting warmer.

Deployed agents, schedules and data jobs bill per run: confirm the cadence
and the expected spend with the user before deploying anything, and hand
over the `confirm_url` on any `requires_upgrade`.

## Step 8 — report

From the table, never from memory (`agnt_db_select`): posts scraped, new
leads, how many cleared the score bar, how many staged and into what, and
the reply rate per search-term family, per pond and per `opener_variant`.
Every report carries the score distribution line ("scored N: X qualified, Y
under the bar, Z gated"), which tells thin sourcing apart from a bar set too
high; when nothing qualified, list the five closest calls with their reasons
instead of an empty table. Once replies flow back: replies by intent and the
median time to answer one. Once a week, run the calibration loop in
`references/icp-scoring-rubric.md` with the user.
Name the terms that earned replies and the terms that did not — that
paragraph is what the next run reads.

## Hard rules

- **Stage, never start.** No campaign is started, activated or resumed by
  this skill. `connection_heyreach_campaign_start` and
  `connection_instantly_activatecampaign` are the user's to call.
- **Never send from the user's own mailbox without an explicit instruction
  for that run.** Drafts are the default in the Gmail and AgentMail lanes.
- **Replies to humans are approved.** A deployed reply agent sends only what
  the user approved, unless the user explicitly relaxed a named reply class
  (`references/webhook-auto-reply.md`).
- **One lane.** Enabling all four loads hundreds of tools into the context
  for no gain, and staging the same person into two channels is how a warm
  lead becomes a complaint.
- **Never invent.** No made-up personalization, numbers or claims about a
  lead's business, in a message or an asset.
- **The do-not-contact list is absolute.** Nobody on it is looked up,
  staged or messaged, ever. A lead under the score bar never costs an email
  lookup, an asset or a message.
- Never scrape a post's engagers twice, and never contact a `linkedin_url`
  already in `leads`.

<!-- skill_id: warm-outbound-engine · source: https://github.com/superagnt/plugins -->
