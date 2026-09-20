---
name: warm-outbound-engine
description: This skill should be used when the user wants to run the LinkedIn Engagement Outbound blueprint, or asks to "scrape LinkedIn post engagers", "build outbound from people engaging with my market", "find warm leads on LinkedIn", "turn LinkedIn engagement into a sequence", or wants recurring engagement-sourced prospecting staged into HeyReach, Instantly, AgentMail or their own Gmail. Runs on the superagnt MCP: LinkedIn post + engager data, first-party enrichment, workspace database, and one sending lane of the user's choice. Stages campaigns stopped; starting a sequence is always the human's.
version: 0.2.0
---

# LinkedIn Engagement Outbound

Outbound sourced from engagement, not from a list. Every lead in the table
did something in public first: reacted to, or commented on, a post about the
problem you solve. Builds on the base `lead-generation` skill for the
enrichment mechanics — read that for per-tool detail; this one adds the
engagement source, the scoring gate, and the four sending lanes.

## Step 0 — tools

`agnt_tools_list_enabled`; if missing:
`agnt_tools_enable({ "families": ["data:linkedin", "database"] })` (the
first-party `data_agnt_*` people/company tools are always on). That is the
whole first run — **do not enable a sending lane yet.** `requires_upgrade` →
`confirm_url` to the user → wait → re-run. (The `warm-outbound-engine`
blueprint endpoint pre-enables these two.)

## Step 1 — the ICP, and the searches it implies (first run only)

Ask once: who they sell to, and one sentence on the problem their product
removes. Write it to `icp_profile` (`agnt_db_insert`) with buyer titles,
company filters and disqualifiers.

Create the tables:

```
leads(id, person, linkedin_url unique, title, company, company_domain,
      email, email_verified boolean, source_post_url, engagement text,
      persona text, fit_score int, fit_reason text, status text,
      staged_at timestamptz, replied_at timestamptz, updated_at timestamptz)
search_history(term, kind, searched_at default now())
scraped_posts(post_url unique, post_urn, term_used, author, snippet, scraped_at)
```

Upsert key on `leads` is `linkedin_url` — it is the only identifier that
survives a job change.

## Step 2 — generate this run's search terms

**Do not keep a fixed keyword menu.** Generate 3–6 fresh phrases per run
from the ICP, steered by two queries:

```sql
-- what has actually converted
SELECT sp.term_used, count(l.id) AS leads,
       count(*) FILTER (WHERE l.fit_score > 50) AS qualified,
       count(*) FILTER (WHERE l.replied_at IS NOT NULL) AS replied
FROM scraped_posts sp JOIN leads l ON l.source_post_url = sp.post_url
GROUP BY 1 ORDER BY replied DESC, qualified DESC;

-- what not to repeat yet
SELECT term FROM search_history WHERE searched_at > now() - interval '14 days';
```

Write more phrases like the families with replies; drop the phrasing
patterns that produced leads and no replies. Never reuse a term from the
14-day window; everything older is fair game again.

**The single highest-leverage rule here: write the language your BUYER
posts in, not the language your industry sells in.** Category and execution
terms ("shelf reset", "category review", "Q3 launch at Target") surface
posts whose engagers are buyers. Vendor/martech terms ("retail media
network", "martech stack") surface posts engaged with by other vendors, and
a run of those poisons the table with people who will never buy. Test every
generated term: *would a buyer plausibly write or react to a post using this
phrase?*

Insert each term into `search_history` **before** the API calls, so a run
that dies halfway does not lose its history.

## Step 3 — the sweep

1. `data_linkedin_search_posts` (keyword) and
   `data_linkedin_search_post_by_hashtag` (hashtag). 3–5 posts per run —
   that cap is deliberate, it is the run's whole data cost.
2. Prefer posts with real engagement; a post with 4 reactions is not worth
   a scrape when a 90-reaction one is in the same result set.
3. Skip posts already in `scraped_posts`. Record the rest as you take them.
4. `data_linkedin_get_post_reactions` for reactors,
   `data_linkedin_get_profile_post_comment` for commenters. Record
   `engagement` ('reacted' | 'commented') per lead — commenters convert
   better and are worth a different opener.
5. Drop anyone whose `linkedin_url` is already in `leads`. Dedup at the
   source, never at send time.

**Geography and other filters belong on the enriched profile, not on the
search payload.** LinkedIn's post-search results omit location for plenty of
genuinely in-market posters; filtering there silently starves the funnel.
Take the lead, filter it in step 4.

## Step 4 — enrich, then score

Per new lead, in this order — **LinkedIn URL → email is not a one-step
lookup**:

1. `data_linkedin_get_profile_data_by_url` → real title, company, location.
2. `data_agnt_companies_enrich` (or `data_linkedin_get_company_by_domain`)
   → domain, size, industry.
3. `data_agnt_people_email_finder` from name + domain, then **always**
   `data_agnt_people_email_verifier`. Unverified stays
   `email_verified=false` — those rows are still workable on LinkedIn.
4. Score against the ICP: `fit_score` + a one-line `fit_reason`, and match a
   `persona` from the ICP's buyer titles. Apply disqualifiers here,
   absolutely.
5. `agnt_db_upsert` with `status` moving new → enriched → scored → staged,
   so a failed run resumes instead of restarting.

Above ~500 leads a run, this belongs in a data job rather than a longer
session — one cheap structured call per lead. See the base `data-pipelines`
skill.

## Step 5 — pick the lane, once

Ask which channel they send from and enable **only that one**. Four lanes:

### HeyReach — LinkedIn sequences

`agnt_tools_enable({ "families": ["connection:heyreach"] })`

`connection_heyreach_campaign_get_all` to find the persona-matched campaign
(or `connection_heyreach_list_create_empty` +
`connection_heyreach_list_add_leads_v2` for a fresh list), then
`connection_heyreach_campaign_add_leads_v2` with the scored rows.
Stamp `staged_at`.

Two settings that decide whether this works: **send a blank connection
request** (a request carrying a pitch converts materially worse than an
empty one), and turn on exclude-in-other-campaigns so one person never
appears in two sequences.

### Instantly — email sequences

`agnt_tools_enable({ "families": ["connection:instantly"] })`

`connection_instantly_createleadlist` then
`connection_instantly_bulkaddleads` with the verified-email rows only —
an unverified address in an Instantly campaign is a bounce charged against
the sending domain. `connection_instantly_listcampaign` to pick the
persona-matched campaign.

### AgentMail — an inbox the agent owns

`agnt_tools_enable({ "families": ["connection:agentmail"] })`

`connection_agentmail_create_inbox` once (its own domain — never the user's
primary), then `connection_agentmail_create_draft` per lead and
`connection_agentmail_send_draft` when the user releases them. Replies come
back through `connection_agentmail_list_messages` /
`connection_agentmail_reply_to_message`, which is what makes this lane the
one where the agent can actually hold the thread.

### Gmail — the user's own mailbox

**This lane is not on the workspace MCP and `agnt_tools_enable` will never
turn it on.** `connection_gmail_*` exists only inside a *deployed* agent's
tool config. Wire it at step 6 when the agent is created, as flat `tools`
entries: `{ kind: "integration", provider_id: "gmail", operation_id:
"save_draft" }` and `"send_email"`. `send_email` carries a
`default_permission` of `always_ask`, so every send surfaces for approval
unless the user explicitly asks for an override — offer the drafts-only
shape (`save_draft` alone) first.

**In every lane: stage, do not start.** Add the leads, leave the campaign
stopped, and report what is waiting. Pressing start is the user's act, and
it is the last point at which a bad list can still be caught.

## Step 6 — the standing run

One batch is not the product. A list built once and never refilled goes
quiet within weeks — the sequence outruns the leads and the channel looks
dead. Offer the standing version after one successful run: a task agent
carrying steps 2–5 verbatim, deployed and scheduled (recipe in the base
`task-agents` skill).

```
agnt_agents_create  → system prompt = steps 2-5, only the tools it uses
agnt_agents_deploy
agnt_schedules_create → a few runs per weekday beats one big daily sweep;
                        small batches keep the sending account under its limits
```

Cadence confirmed with the user, billed runs stated plainly, module trials
via `confirm_url` on `requires_upgrade`.

Then close the loop: a webhook-fed agent that writes replies and accepted
connections back onto `leads.replied_at`, which is what makes step 2's
steering query true. Without it the engine generates volume and never gets
warmer.

## Step 7 — report

From the table, never from memory (`agnt_db_select`): posts scraped, new
leads, how many cleared the score bar, how many staged and into what, and
the reply rate per search-term family. Name the terms that earned replies
and the terms that did not — that paragraph is what the next run reads.

## Hard rules

- **Stage, never start.** No campaign is started, activated or resumed by
  this skill. `connection_heyreach_campaign_start` and
  `connection_instantly_activatecampaign` are the user's to call.
- **Never send from the user's own mailbox without an explicit instruction
  for that run.** Drafts are the default in the Gmail and AgentMail lanes.
- **One lane.** Enabling all four loads hundreds of tools into the context
  for no gain, and staging the same person into two channels is how a warm
  lead becomes a complaint.
- Disqualifiers in `icp_profile` are absolute; a disqualified company never
  re-enters the table.
- Never scrape a post's engagers twice, and never contact a `linkedin_url`
  already in `leads`.

<!-- skill_id: warm-outbound-engine · source: https://github.com/superagnt/plugins -->
