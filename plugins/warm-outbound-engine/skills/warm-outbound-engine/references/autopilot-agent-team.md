---
status: reference
created: 2026-09-23
updated: 2026-09-23
type: reference
---

# Autopilot: from one good run to an agent team

The skill is meant to be run once, end to end, in the user's own client. Once they like what it staged, the next thing they want is for it to keep happening without them. This file is how to get there on superagnt. It is guidance, not a script: the right team depends on the user's volume, their lane, how much of the reply side they want automated, and their budget. Work the decisions out with them.

It is grounded in three real systems running this motion on superagnt, read from their live configuration, run history and costs in September 2026: agnt_'s own LinkedIn outbound, a client deployment that has run it since June, and the managed version of this skill (the hosted "LinkedIn Outbound Scout" agnt_ provisions for customers). All three arrived at the same shape by different routes, and all three broke in instructive ways. Both are below.

## TL;DR

- **Split the run into five jobs:** choose (an agent), per-lead work (a data job or a skill), send (the vendor's campaign), react (a webhook into an agent), report (a bound channel). Both production systems that started without this split replaced their first design within weeks.
- **Agents choose and react. They never do per-lead work one session at a time.** Both production systems began with one agent session per lead and abandoned it (after 19 days in one, 7 weeks in the other).
- **Data jobs are where AI cost comes down.** Moving per-lead scoring from agent sessions into a data job cut AI cost per lead by 92% on the same model, and by about 200x where the move also shrank the input and dropped to a smaller model. After that, data calls are 84% to 92% of the per-lead bill.
- **The table is the work list and the ledger.** Status columns, every identity key, fire-once stamps on anything paid or external, and an explicit state for "waiting on the human".
- **The expensive failures were plumbing, not judgment:** duplicate submissions, a downstream gate that quietly starved the sender, a broken skill that delivered nothing for three weeks while its schedule kept firing, and a one-off experiment that drained the shared AI wallet and switched off reply handling.
- **Wire the human before you turn on the clock:** one report per run in a channel they read, approvals as state, and alerts when a lane produces nothing.

## When it's ready

Convert when all of this is true, and say plainly which part isn't:

- One local run staged leads the user looked at and liked, and the score's closest calls look right to them.
- The lane is connected and its campaign exists (for HeyReach: built in HeyReach, with a sender and an empty list, per SKILL.md step 6).
- The do-not-contact list exists (competitors, customers, the user's own staff).
- The user has agreed a cadence, a per-run cap, and an expected monthly spend. Deployed agents, schedules and data jobs bill per run, and each is sold under a trialable module (Agent Runtime, Automation, Data Jobs): a `requires_upgrade` carries a `confirm_url` for the user.

## The team

| Job | Primitive | Why that primitive |
|---|---|---|
| **Choose**: which terms, creators and posts this run | A scheduled agent on a small model | The one step that needs judgment every run, and its turn stays small |
| **Per-lead work**: fetch, gate, score, look up email, write the message, enroll | A data job fed by the agent (or TypeScript skills, at low volume) | A fixed recipe per lead: one structured model call instead of a session |
| **Send** | The vendor's campaign (HeyReach, Instantly) | The engine owns delivery: timing, acceptance, reply-stop. Never rebuild it in an agent |
| **React**: replies, accepts | A webhook into a deployed agent | Reading a thread and deciding what to do is where an agent earns its cost (`webhook-auto-reply.md`) |
| **Report** | One message per run to a bound channel, plus a canvas | The human reads it where they already are |

Two shapes work, and the choice is volume:

- **Low, bounded volume** (tens of leads a run, results needed in the same turn): one agent whose per-lead work runs in TypeScript skills that each return about one line. This is the managed version's design, "the agent chooses, the skills fetch": the scout decides what to search, and each lead is scraped, gated, scored and parked by skills, so a 40-lead run costs the agent's context about what a 5-lead run does. No queues, no data jobs; the `leads` table is the work list. One constraint shapes it: skills running under the agent's key can't reach the outbound sequencer connections, so enrolling leads into HeyReach or Instantly stays in the agent's own turn (a data job with those tools in its allowlist can enroll).
- **Continuous volume** (hundreds a week and up): the agent submits new lead ids to a data job and ends its turn. Both production systems run this way, chaining everything by push: the agent calls `agnt_data_job_submit`, the job calls the next hop, vendor webhooks wake the reply agent. Nothing polls.

What not to build:

- **One agent session per lead**, whether a cron that says "process the next lead" or an agent queue with an item per lead. It's the most expensive shape and the one both production systems abandoned. A polling cron is worse: one week of a five-minute "anything to do?" schedule produced 1,314 mostly idle sessions.
- **An agent queue**, except where each item genuinely needs an agent loop (say, "research this company and pick the right three people"), and then with a budget. One such queue on a large model cost $0.88 an item and, in two days, about 35 times what the whole always-on system spent in a day.
- **A second copy of the vendor's delivery state.** An agent that sent connection requests and tracked acceptances in its own table produced 43 requests and zero messages. Ask the vendor live (the `linkedin-outreach` platform skill).

## Data jobs: where the AI cost comes down

An agent session carries its prompt, its tool definitions and every intermediate result on every turn, so per-lead work inside a session scales with the batch. A data job is non-agentic batch inference: one structured model call per item against a cached rubric, a small model by default, and no session per item. The platform's own guidance puts it at one to two orders of magnitude cheaper than looping agent sessions. In production:

| Change | AI cost per scored lead |
|---|---|
| Agent session per lead → data job, same small model | $0.050 → $0.0038 (−92%) |
| Agent on a large model reading ~100k tokens of raw profile and website per lead → data job on a small model reading a compact JSON of extracted fields | about $0.52 → $0.0026 (about 200x) |
| TypeScript skills in one agent turn, small-model gate plus a mid-size-model score (the managed version, by design) | about $0.025 |

Once AI is fixed, data calls dominate: 84% to 92% of the per-lead cost in both production jobs. One system's whole sourcing lane came to about $0.025 per lead sourced and evaluated, and about $0.08 per qualified lead, all-in. Its scheduled sourcing agent cost about $0.10 to $0.12 a run on a small model, so the clock is not the lever.

**What belongs in the job:** fetching the profile and company, the cheap deterministic gates (region, obvious disqualifiers, do-not-contact), the one structured score, the email lookup for leads above the bar, writing the first message from the row with one more structured call, enrolling the lead with its message variable, and the status write.

**What stays in the agent:** choosing terms, creators and posts; reading the steering query; run-level decisions; anything conversational; the report.

**The levers, in the order they paid off:**

1. Per-lead work out of agent sessions.
2. Extracted fields in, not raw payloads. The ~100k-token input was most of the old bill.
3. A small model for gates and routine scoring. Spend a bigger model only where a score is genuinely hard, or only on the closest calls.
4. Gate before spend. Cheap deterministic gates removed 48% to 59% of leads before any model or email call, and email lookups run only above the bar.
5. Dedupe at the source and fire paid side effects once. One system resubmitted 45% to 60% of its items, and before it added a fire-once guard, one lead triggered a paid downstream step 237 times.
6. Then work the data bill: posts per run capped, no email lookup for a LinkedIn-only lane, no re-fetching what's already in the table.

**Building one from an MCP client** (the platform skills below have the details):

- Write the per-lead recipe with the SDK's `agnt.ai` helpers: `agnt_guidance_load({ "name": "typescript-sdk", "section": "ai" })` has the contract (stdin items in, one result per item out).
- Validate it on 3 to 5 real rows with `agnt_typescript_skill_dry_run`, including the tools it needs, until it's green. Never create a job from a red dry run.
- `agnt_data_job_create` with the returned `validated_code_id`, a `tools` allowlist of only what the recipe calls, `model: "haiku"`, and conservative `chunk_size` and `concurrency` (production runs use chunks of 5 to 10 at concurrency 3 to 5).
- The sourcing agent feeds it with `agnt_data_job_submit({ "data_job_id": ..., "payloads": [{ "lead_id": ... }] })`, only for leads that are genuinely new. Backfill existing rows with `agnt_data_job_backfill`.
- Watch it with `agnt_data_job_read` (the `queue` block shows pending, failed and `stalled`) and `agnt_data_job_inspect_run`. Repair by reading the recipe, editing, dry-running and `agnt_data_job_update`; resubmit the failed items, never the whole batch.
- The job's own per-item results are visible only in the dashboard. Write every outcome back to the workspace table, because that's the only thing agents, reports and canvases can read.

**Recipe rules that the production failures wrote:**

- Short-circuit a lead that's already scored, and stamp every paid or external side effect so it fires once.
- Validate what the next hop requires before calling it. One system sent 1,551 requests the next step rejected, mostly on URL shape.
- Throw on a failed send. One sending leg sat inside a bare `catch`: only 3 of 3,125 leads ever reached it, and nothing recorded why.
- Version the payload between hops, and keep test traffic out of the production job.
- Mark transient errors (429s, 5xx, timeouts) retryable and everything else terminal, with a reason on the row.

## Cadence

- **Volume comes from posts per run times engagers per post, not from the clock.** Both production systems land at 35 runs a week with 3 to 5 posts each and see about 35 to 45 new leads per run.
- **Business-hours weekday schedules with an explicit timezone** (`agnt_schedules_create` takes an IANA `timezone`; a cron written in UTC and labeled as local time drifts an hour twice a year). Several smaller runs a day beat one big sweep, and keep the sending account under its limits. One or two runs a day can use a high-intent mode that ranks posts by engagement.
- **A creator watchlist refills on a weekly rhythm:** pull the last 7 days of engagement from each watched creator, once a week (Nick Abraham runs his every Sunday).
- **Match sourcing to sending.** HeyReach sends at the pace its account limits allow. A list that grows faster than the campaign can send just ages.
- **Make the first scheduled run wider** so the first report shows real work, then settle into the cap.
- **Replies are events, not a clock.** Wire them as webhooks.

## The human in the loop

This is the weakest layer in all three production systems, so decide it before the clock starts.

- **One report per run, in a channel the user reads,** with a fixed shape: posts by source, new leads, score distribution, qualified, emails found, staged per lane, and the closest calls when nothing qualified. In two of the three systems the sourcing agent had no channel at all, so its reports lived only in session transcripts nobody opened.
- **A canvas over the tables** for the standing view: pipeline stats, qualified leads with their rationale, closest calls, leads over time, what's waiting on the user's stack, posts scraped (`agnt_guidance_load({ "name": "canvas-dashboards" })`).
- **Approvals are state, not a convention.** A draft is `staged` and owned by the user until a send API confirms it `sent`. One system logged staged drafts as sent and re-drafted the same leads day after day, at about $1 a run, with zero sends.
- **Alert on silence.** Page the user when a lane produces nothing for N runs, a trigger is skipped for credits, a downstream gate is parking everything, a vendor key returns 402, or a skill fails to compile. The two longest outages were silent: a broken skill that delivered nothing for three weeks while the schedule fired 35 times a week (it filed the same issue 123 times, each superseding the last), and a downstream quality gate that starved the sender for nearly two weeks while sourcing kept spending.
- **Give agent-filed config requests an owner.** An open blocking request makes the platform skip that agent's webhook deliveries, and skipped deliveries are not replayed.
- **Fail loud, never freeze.** A scheduled agent never asks a blocking question mid-run; it reports and ends. One real agent froze for 7 days on a question, with 238 contacts waiting.

## Budgets and wallets

- **The always-on lane shares its AI wallet with everything else in the workspace.** In one production system, a one-off experiment on a large model drained the workspace's AI wallet in two days, and from then on every AI-driven agent skipped its triggers, including the reply agent. Prospect replies sat unhandled for more than a week. Keep experiments small and sampled, top the wallet up before any big batch, and alert on credit skips.
- **Vendors on the user's own key can run dry** (web research, sequencers). Out-of-credit errors failed thousands of items across both production jobs before anyone noticed. Alert on them.
- **Sample five items before scaling anything,** and state the per-lead cost to the user before the volume starts.

## Putting it together

The order that avoids the known failures, with the reason for each:

- **Tables first.** They already exist from the local run; add the states the team needs (`owner_state`, fire-once stamps, `replies`).
- **The data job before the agent that feeds it.** The agent's prompt needs the job's id, and the job must be green on real rows first.
- **The sourcing agent narrow.** `agnt_agents_create` as a draft with only its own tools and a prompt that is the choosing steps, the report contract and the fail-loud rule; deploy only after the user says so; then `agnt_schedules_create`, created with `enabled: false` until the smoke test passes.
- **Deploy before subscribing webhooks.** Deliveries to a draft agent fail and deliveries to a disabled one are skipped, and neither is replayed. The reply side is `webhook-auto-reply.md`.
- **Bind the report channel and build the canvas before the clock starts.**
- **Smoke test:** one scheduled run and one real reply end to end. Watch the first three runs, then leave it, with the alerts on.
- **Group the agents as one team** so the user finds them together (`agnt_guidance_load({ "name": "agent-teams" })`).

Staging stays the user's call even here. Whether the team adds leads to a paused list the user releases, or straight into a live campaign, is decided explicitly at build time and written into the agent's prompt. The self-serve default is paused; the managed version flows once its campaigns are connected.

## Load before building

- `agnt_guidance_load({ "name": "linkedin-outreach" })`: HeyReach. The engine owns delivery; the enroller, reply handler, acceptance handler and monitor shapes; custom variables at enrollment; campaign prerequisites; per-run caps; fail loud.
- `agnt_guidance_load({ "name": "data-pipelines" })`: data job versus sub-agent, the `agnt.ai` helpers, push intake.
- `agnt_guidance_load({ "name": "typescript-sdk", "section": "ai" })`: the recipe contract.
- `agnt_guidance_load({ "name": "lead-generation" })`: dedup, the leads table, search-history discipline, the stop rule for repeated failures.
- `agnt_guidance_load({ "name": "workspace-db-design" })`, `agent-teams`, `canvas-dashboards`.
- The base skills: `task-agents` (create, deploy, schedule, smoke-test), `automations` (webhooks), `data-pipelines`, `canvas`.

## Sources

Configuration, run history and cost of three production systems on superagnt, read-only, September 2026: agnt_'s own LinkedIn outbound (a scheduled sourcing agent, a qualification data job, a sequencing data job fed by webhook, and a reply agent), a client deployment running the same motion since June 2026 (seven weekday schedules, a scoring data job, persona campaigns in HeyReach, a reply-classifying agent), and the managed "LinkedIn Outbound Scout" (one agent with two TypeScript skills, seven weekday schedules, a canvas and setup tasks). Costs are 30-day figures from platform metering; the before-and-after comparisons use the agent-session eras of the same two systems. Platform guidance: the `data-pipelines`, `linkedin-outreach`, `lead-generation`, `agent-teams` and `typescript-sdk` platform skills. Nick Abraham on the weekly evergreen refill ("How to Scrape LinkedIn Creators for Warm B2B Leads", YouTube `gbdzLWhdmVM`).
