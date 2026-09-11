---
name: gtm-prospecting-desk
description: This skill should be used when the user wants to run the GTM Prospecting Desk blueprint, or asks to "build my prospecting pipeline", "run my outbound research", "keep a prospect table current", or wants recurring ICP-filtered company and people discovery with scored rows and outreach drafts. Runs on the superagnt MCP: first-party people/company data + LinkedIn + workspace database. Drafts only — sending is always the human's.
version: 0.1.0
---

# GTM Prospecting Desk

Outbound research end to end, compounding in one pipeline table. This skill
builds on the base `lead-generation` skill's workflow — read that one for the
per-step tool detail; this one adds the standing-desk structure.

## Step 0 — tools

`agnt_tools_list_enabled`; if missing:
`agnt_tools_enable({ "families": ["data:linkedin", "database"] })` (the
first-party `data_agnt_*` people/company tools are always on).
`requires_upgrade` → `confirm_url` to the user → wait → re-run. (The
gtm-prospecting-desk blueprint endpoint pre-enables these.)

## Step 1 — pin the ICP (first run only)

Company filters (size, industry, geography, signals) + buyer titles + any
disqualifiers, into `icp_profile` (`agnt_db_insert`). Create
`prospects(id, company, company_domain, person, title, linkedin_url, email,
email_verified boolean, fit_score int, fit_reason text, status text,
draft text, updated_at timestamptz)` — upsert key (person, company_domain).

## Step 2 — the desk run

1. `data_agnt_companies_search` against the ICP filters (or
   `data_agnt_companies_discover` for similar-to expansion); skip companies
   already in the table unless refreshing.
2. `data_agnt_people_search` per company for the buyer titles;
   `data_agnt_people_enrich` on the chosen person; `data_linkedin_*` for
   profile detail when the LinkedIn family is enabled.
3. `data_agnt_people_email_finder` then ALWAYS
   `data_agnt_people_email_verifier`. Unverified rows keep
   `email_verified=false` — they stay workable via LinkedIn.
4. `agnt_db_upsert` every row with `status` transitions
   (new → enriched → scored → drafted) so a failed run resumes instead of
   restarting.
5. Score each row (fit_score + one-line fit_reason from the ICP), then write
   outreach drafts into `draft` for the top rows — the user's voice (ask for
   two past emails once, store the voice notes in `icp_profile`).

## Step 3 — report

From the table: counts by status, the top 10 by fit with reasons, and where
the drafts are. Numbers come from `agnt_db_select`, never memory.

## Step 4 — offer the standing desk

After one successful run: offer a scheduled refresh (weekly beats daily for
prospecting). Deploy a runner agent with step 2 + `agnt_schedules_create`;
cadence confirmed with the user, billed runs stated plainly, module trials
via `confirm_url` on `requires_upgrade`. 500+ row enrichment belongs in a
data job (see data-pipelines) rather than a longer session.

## Hard rules

- **Drafts only. This skill never sends email, LinkedIn messages, or
  anything else.** Wiring a sending tool is the user's own deliberate act.
- Respect disqualifiers in `icp_profile` absolutely — a disqualified company
  never re-enters the pipeline.

<!-- skill_id: gtm-prospecting-desk · source: https://github.com/superagnt/claude-plugins -->
