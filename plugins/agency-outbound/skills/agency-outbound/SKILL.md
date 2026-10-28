---
name: agency-outbound
description: "This skill should be used when the user wants to run the Agency Outbound skill, or asks to \"pull the people engaging with a competitor's LinkedIn posts\", \"build a list from a LinkedIn hashtag\", \"enrich these engagers and keep the ones who fit\", \"push the leads into my HeyReach, Instantly, Smartlead or lemlist campaign\", \"how are this workspace's campaigns doing\", or \"build a dashboard I can share\", for outbound run in one superagnt workspace per company. Runs on the superagnt MCP: LinkedIn post and engager data, first-party enrichment, the workspace database, the sequencer connected in this workspace, its synced results and the workspace dashboard. One workspace per chat, named before every write. Leads are staged; starting a campaign is always the human's."
version: 0.1.0
---

# Agency Outbound

Outbound for one company, start to finish inside that company's own superagnt
workspace: a list from the people engaging with competitors' LinkedIn posts
and with the hashtags its buyers follow, enriched and cut to the ones who fit,
pushed into the sequencer the workspace already runs, then the results read
back from the workspace's synced tables and turned into a dashboard view whose
link you can send, or a report in chat where dashboards aren't on yet.

For the scoring rubric and the outreach playbook in depth, the
`warm-outbound-engine` skill goes further on each; the base `lead-generation`
skill covers enrichment and dedup. This skill stands alone without them.

## Start here

Three first runs that work as pasted. When the person sends one of these, run
it as written, and ask only for what it leaves open: which competitor, which
hashtag, which campaign.

1. "Pull everyone who reacted to or commented on the last 3 posts on my top
   competitor's LinkedIn page, keep the ones who fit my ideal customer, and
   save them to a table in this workspace. Ask me which competitor first."
2. "Find this week's most engaged LinkedIn posts under a hashtag my buyers
   follow, pull the people who commented, keep the ones who fit my ideal
   customer, and find verified emails for the best 20. Ask me for the hashtag
   first."
3. "Take the people engaging with my top competitor's LinkedIn page this
   month, keep the ones who fit my ideal customer, and add them to my campaign
   in this workspace's sequencer, stopped so I can check the list before it
   starts."

Each one runs steps 1 to 3 at their smallest, and the third adds step 4. On a
first run in a workspace, step 1's questions come first, minus whatever the
prompt already answers.

## The workspace comes first

Each workspace is one company: its own database, sequencer connections,
synced results and dashboard, and nothing in it is readable from another
workspace. That separation only holds if the agent keeps it:

- **One workspace per chat.** If this chat has more than one superagnt
  connection, ask which workspace it works in before the first call, and use
  only that connection's tools from then on.
- **Name the workspace before every write**: the tables in step 1, every push
  in step 4, a sync in step 5, the publish in step 6. Use the name the person
  knows it by: the connection's name when it is named for its workspace (for
  example `superagnt-acme`), or the name they used in this chat. A bare
  `superagnt` connection doesn't say which workspace it reaches, so when
  nothing else does, ask.
- **A second workspace is a second connection**, named for its workspace when
  it's added (the server name in the MCP config, or the name field in
  Claude's Add custom connector dialog), never a second bare `superagnt`. On
  the consent screen the person picks that workspace before approving: it may
  open on another of their workspaces.
- **Never move rows between workspaces.** A list built in this workspace goes
  into this workspace's sequencer and dashboard, never another's.

The platform's own rules on this: `agnt_guidance_load({ "name": "workspaces" })`.

## Step 0: tools

**Codex:** superagnt's tools can take a few seconds to appear in a new chat.
If none are listed, wait about 10 seconds and check again.

`agnt_tools_list_enabled`. If the LinkedIn tools aren't served, turn them on:
`agnt_tools_enable({ "families": ["data:linkedin", "database"] })` (on a
grouped server, `agnt_tools_write` with `action: "enable"`). Most servers
serve them already, along with the first-party `data_agnt_*` people and
company tools, the database, vendor sync, the dashboard and the platform's
guidance (`agnt_guidance_load`). `requires_upgrade` means a plan limit: give
the person the `confirm_url`, wait, then retry.

The sequencer's tools appear once the vendor is connected in this workspace;
no enable step connects one. Not connected yet: ask the person to connect it
on its page in this workspace in the superagnt app, with that company's own
key. A sync call for a vendor that isn't connected returns
`INTEGRATION_NOT_CONNECTED` with a `connect_url` to that page.

### Tool names on grouped servers

This skill writes flat (per-operation) names. New servers list grouped tools
instead: one tool per resource with an `action` argument. Flat names resolve
there but are not listed, so most agent apps won't let you call them:

| Flat | Grouped tool, action |
|---|---|
| `data_linkedin_get_company_s_post` | `data_linkedin_companies`: `posts` |
| `data_linkedin_get_company_post_comments` | `data_linkedin_companies`: `post_comments` |
| `data_linkedin_search_post_by_hashtag` | `data_linkedin_search`: `hashtag_posts` |
| `data_linkedin_get_post_reactions` | `data_linkedin_posts`: `reactions` |
| `data_linkedin_get_profile_post_comment` | `data_linkedin_posts`: `comments` |
| `data_linkedin_get_profile_data_by_url` | `data_linkedin_profiles`: `profile_by_url` |
| `data_agnt_companies_enrich` | `data_agnt_companies`: `enrich` |
| `data_agnt_people_email_finder` / `_email_verifier` | `data_agnt_contacts`: `find_email` / `verify_email` |
| `agnt_db_apply_migration` / `agnt_db_execute_sql` | `agnt_db_sql`: `apply_migration` / `execute_sql` |
| `agnt_db_select` | `agnt_db_read`: `select` |
| `agnt_db_insert` / `agnt_db_upsert` / `agnt_db_update` | `agnt_db_write`: `insert` / `upsert` / `update` |
| `agnt_sync_catalog` / `agnt_sync_list` / `agnt_sync_status` / `agnt_sync_preview` / `agnt_sync_changes` | `agnt_sync_read`: `catalog` / `list` / `status` / `preview` / `changes` |
| `agnt_sync_enable` | `agnt_sync_write`: `enable` |
| `agnt_dashboards_guide` / `agnt_dashboards_describe_data` / `agnt_dashboards_preview` / `agnt_dashboards_list_files` | `agnt_dashboards_read`: `guide` / `describe_data` / `preview` / `list_files` |
| `agnt_dashboards_apply_template` / `agnt_dashboards_write_file` / `agnt_dashboards_publish` | `agnt_dashboards_write`: `apply_template` / `write_file` / `publish` |
| `agnt_agents_create` / `agnt_schedules_create` | `agnt_agents_write`: `create` / `agnt_schedules_write`: `create` |
| `agnt_tools_enable` | `agnt_tools_write`: `enable` |
| `agnt_guidance_load` | `agnt_guidance_read`: `load` |

`agnt_tools_list_enabled` keeps its name on both. The sequencer calls are in
step 4's table, both ways.

**Grouped data calls return a markdown table that drops fields this skill
keys on.** Pass `response_format: "json"` on every LinkedIn call in steps 2
and 3. Posts then carry `urn` (the comments call takes it) and `url` (the
reactions call takes it); reactions carry `urn` (the reactor's member id) and
`url` (their profile); comments carry `author_url` (the commenter's profile)
and `url`, which links the comment itself, never a person. For a field the
json view leaves out, pass `response_format: "raw"`.

## Step 1: the buyer and the sources (first run in a workspace)

Ask once, in one message, and draft what you can from the company's website
so the person only corrects it:

- who buys: the roles that own the problem, the kind and size of company, the
  region, and who looks close but never buys;
- the competitors whose LinkedIn company pages its buyers follow: 2 to 5, each
  as the page's slug (the part after `linkedin.com/company/`);
- 2 to 4 hashtags its buyers post and comment under;
- who never to contact: competitors and their staff, current customers,
  partners, the company's own team;
- which sequencer and campaign the leads go into (step 4).

Create the tables with `agnt_db_apply_migration`. If they exist from an earlier
run, add missing columns instead of recreating them:

```
icp_profile(id, company text, icp_description text, target_geography text,
            do_not_contact text, qualify_threshold int default 50,
            sequencer text, campaign_id text, updated_at timestamptz)
sources(source text unique, kind text, name text, added_at timestamptz)
scraped_posts(post_url unique, post_urn, source text, author text, snippet,
              reactions int, comments int, scraped_at timestamptz)
leads(id, person, linkedin_url unique, linkedin_member_urn unique, title,
      company, company_domain, location, email, email_verified boolean,
      source text, source_post_url, engagement text, engagement_text text,
      fit_score int, fit_reason text, status text, campaign_id text,
      staged_at timestamptz, replied_at timestamptz, meeting_at timestamptz,
      updated_at timestamptz)
```

`sources.kind` is `competitor_page` or `hashtag`. Write the answers with
`agnt_db_insert`, the do-not-contact list included, before the first scrape:
engager lists are full of competitors' staff.

## Step 2: pull the engagers

Start from competitor pages and hashtags. LinkedIn's keyword post search
fails often, so use it only when neither source produces, and say so in the
report.

1. **Competitor pages.** `data_linkedin_get_company_s_post` with the page's
   `username` returns its recent posts. Take the 1 to 3 most engaged from the
   last couple of months.
2. **Hashtags.** `data_linkedin_search_post_by_hashtag` with `hashtag` (no
   `#`). Take the 1 to 3 most engaged recent posts, and skip the ones the
   competitors or the company itself wrote.
3. Keep a run to 3 to 5 posts across all sources. That cap is the run's whole
   data cost. Skip posts already in `scraped_posts`; record the rest as you
   take them.
4. Reactors: `data_linkedin_get_post_reactions` with the post's `url`.
   Commenters: `data_linkedin_get_company_post_comments` with the post's `urn`
   for a company page's post, `data_linkedin_get_profile_post_comment` for a
   person's post. Take a reactor's profile from `url` and member id from `urn`,
   and a commenter's profile from `author_url`.
5. Record `engagement` (`reacted` or `commented`) and `engagement_text` (the
   comment, or the reaction type) on each lead, and `source` (the page slug or
   the hashtag) with `source_post_url`.
6. Drop anyone whose `linkedin_url` or `linkedin_member_urn` is already in
   `leads`, the competitors' own staff and anyone on the do-not-contact list.
   Then `agnt_db_upsert` the rest with `status = 'new'`.

Filter on the enriched profile, never on the post payload: post data leaves
out the location of plenty of real buyers.

## Step 3: enrich, then keep the fits

**The score gates the spend: a lead under the bar never costs an email
lookup.**

1. `data_linkedin_get_profile_data_by_url` for the real title, company,
   location and canonical profile URL. Dedupe again on both keys.
2. Gate: an empty or fake profile, or a location outside the target region,
   gets `fit_score = 3` with the reason, and stops.
3. `data_agnt_companies_enrich` for the domain, size and industry.
4. Score against `icp_profile.icp_description`: `fit_score` 0 to 100 with a
   two or three sentence `fit_reason` that cites the evidence. Over
   `qualify_threshold` (default 50) is a fit. A fit gets `status = 'fit'`;
   anyone under the bar gets `status = 'disqualified'` and nothing more, ever.
5. Only for fits, and only when the campaign sends email:
   `data_agnt_people_email_finder` from name and domain, then always
   `data_agnt_people_email_verifier`. A LinkedIn-only campaign (HeyReach
   always, Expandi or La Growth Machine when it sends no email) skips both
   calls. An unverified email stays `email_verified = false` and never goes
   into an email campaign.
6. `agnt_db_update` each row as it moves: `new`, then `fit` or
   `disqualified`, then `enriched` once it is ready to push (its email
   checked, or straight away for a LinkedIn-only campaign). A failed run then
   resumes instead of starting over.

Above about 500 leads a run, the per-lead work belongs in a data job rather
than a longer chat.

## Step 4: push the fits to the sequencer

Name the workspace, the sequencer and the campaign, and show the person the
first ten rows before the first push. Then stage, never start: the campaign
stays stopped, and pressing start is the person's.

1. Read the campaign first with the vendor's campaign read tool: its status,
   and every variable its steps use. A lead missing a variable gets the
   step's fallback text, silently. Fill every one, plus first name, last
   name, company and title. For HeyReach, also load the platform's doctrine
   once: `agnt_guidance_load({ "name": "linkedin-outreach" })`.
2. If a step uses a personal first line, write one per lead from what they
   engaged with: the topic, never the competitor whose post it was. Never
   invent a detail. Show the person five before the push.
3. Push only rows with `status = 'enriched'` and, for an email campaign,
   `email_verified = true`, into a campaign that isn't running:

| Sequencer | Flat | Grouped tool, action | Stays stopped when |
|---|---|---|---|
| HeyReach | `connection_heyreach_list_add_leads_v2` | `connection_heyreach_list_members_write`: `add_leads` | you add to the campaign's lead list; never enroll into a running campaign |
| Instantly | `connection_instantly_bulkaddleads` | `connection_instantly_leads_write`: `add` | the campaign is paused or a draft; pass `skip_if_in_workspace: true` |
| Smartlead | `connection_smartlead_add_campaign_leads` | `connection_smartlead_leads_write`: `add` | the campaign isn't started; a running one emails new leads on its schedule |
| lemlist | `connection_lemlist_add_campaign_lead` | `connection_lemlist_campaign_leads_write`: `add` | the campaign isn't running and has `autoReview` off (with it on, an added lead launches at once) |
| EmailBison | `connection_emailbison_add_leads_to_campaign` | `connection_emailbison_campaign_leads_write`: `add` | the campaign is paused; the leads must exist in EmailBison first |
| Expandi | `connection_expandi_add_campaign_contact` | `connection_expandi_campaign_contacts_write`: `add` | the campaign is paused |
| La Growth Machine | `connection_lagrowthmachine_upsert_lead` | `connection_lagrowthmachine_leads_write`: `upsert` | the audience feeds no running campaign |
| Apollo | `connection_apollo_io_add_contacts_to_sequence` | `connection_apollo_io_sequences_write`: `add_contacts` | the sequence is inactive; enroll saved contacts only |

4. A vendor can skip a lead silently (already in the list or the campaign).
   Stamp `staged_at` and `campaign_id`, and set `status = 'staged'`, only on
   rows you can see in the vendor afterwards.
5. Report what is waiting, where, and that nothing sends until the person
   starts the campaign.

## Step 5: read the results from the synced tables

The workspace syncs its sequencer into its own database, so replies, accepts
and meetings are a database query: no vendor rate limit and nothing that
fails halfway.

1. `agnt_sync_list` shows this workspace's syncs. No sync for the sequencer
   yet: `agnt_sync_preview` shows the tables and rows it would add against the
   plan's limits. Name the workspace, get the person's yes, then
   `agnt_sync_enable`. The first backfill takes a while; `agnt_sync_status`
   shows when each stream is current.
2. `agnt_sync_catalog` lists each stream's table and columns. Read it before
   writing a query, and never guess a column. The tables are named
   `<vendor>_<stream>`, for example `heyreach_campaign_leads`,
   `heyreach_messages`, `instantly_replies`, `instantly_campaign_daily_stats`,
   `smartlead_campaign_daily_stats` and, for meetings,
   `calendly_scheduled_events` and `calendly_invitees`.
3. Query with `agnt_db_execute_sql` (`read_only: true`), filtered to
   `_deleted_at is null`, and join the synced rows to `leads` on the LinkedIn
   URL or the email. Write what you learn (`replied_at`, `meeting_at`,
   `status`) into `leads`, the skill's own table. Never write into a synced
   table: the sync owns it and rewrites it.
4. A later run reads only what changed: `agnt_sync_changes` with the cursor
   the last run stored, kept in a `sync_cursors` table with one row per
   stream.

For the sync's own rules: `agnt_guidance_load({ "name": "sync" })`.

## Step 6: build the dashboard and share its view link

Each workspace has one dashboard, and its views query this workspace's
database, so the view you build here shows this company's numbers and no
one else's. No `agnt_dashboards_*` tools listed? The dashboard isn't on for
this workspace yet: report from the tables in the chat instead, and don't
build a share link some other way.

1. `agnt_dashboards_guide` once per chat, before the first write. Then
   `agnt_dashboards_describe_data` for the tables and their columns.
2. One view for the outbound: leads staged, accepts or opens, replies,
   interested replies and meetings booked, each compared with the period
   before; replies per day by channel; and a table of the interested replies
   (person, title, company, campaign, date). Build it with
   `agnt_dashboards_apply_template` from a template the guide lists, or
   `agnt_dashboards_write_file`.
3. `agnt_dashboards_preview` and read the report: every query returns rows
   and none errors. Then name the workspace and `agnt_dashboards_publish` with
   a plain summary.
4. A view only goes public if it reads no platform data (credits, usage), has
   no images, lists every table's columns, has no column named like a secret
   and no web address written in its text. Keep emails and phone numbers out
   of a view you'll share: anyone with the link can open it.
5. You can't make the link, and no tool reads it back. Give the person the
   view's `open_in_app_url` from the publish result (a page in the superagnt
   app, for people in the workspace, never the link to send), and ask them to
   press Share there and copy the link the dialog shows: that is the link to
   send. It shows live numbers, read only, with no login. Afterwards
   `agnt_dashboards_list_files` shows `public_link` on the view, which says a
   link is live and since when but carries no URL.

## Step 7: the report

From the tables, never from memory: posts scraped and from which sources,
new leads, how many fit, how many staged and into which campaign, and once
results sync back, replies, interested replies and meetings, by source. Every
report carries the score line ("scored N: X fit, Y under the bar, Z gated").
When nothing fit, list the five closest calls with their reasons. Name the
sources that produced fits and the ones that didn't: the next run reads that
paragraph.

Once a run has worked end to end, offer the standing version: the same
sweep (steps 2 to 5) every day or two, for this workspace only. Run it on
this agent's own scheduler when its scheduled runs see the superagnt tools,
or as a deployed superagnt agent (`agnt_agents_create`, then
`agnt_schedules_create`; enable the `lifecycle` and `schedules` families
first if they aren't listed). A scheduled run has nobody to approve a tool
call, so give it an allowlist: this skill's reads and its one staging call,
and nothing that starts, activates or resumes a campaign or sends a message.
Confirm the cadence and the expected data spend with the person before
scheduling anything.

## Hard rules

- **One workspace per chat, named before every write.** No row crosses from
  one workspace into another.
- **Stage, never start.** No campaign is started, activated or resumed by this
  skill. That is the person's call, in the vendor's app.
- **The do-not-contact list is absolute.** Nobody on it is looked up, staged
  or messaged. A lead under the bar never costs an email lookup.
- **Never write into a synced table.** Read them; keep the skill's own state
  in `leads`.
- **Never invent.** No made-up detail in a first line, and every number in a
  report or a dashboard comes from a query.
- Never scrape a post's engagers twice, and never push a `linkedin_url`
  already staged.

<!-- skill_id: agency-outbound · source: https://github.com/superagnt/plugins -->
