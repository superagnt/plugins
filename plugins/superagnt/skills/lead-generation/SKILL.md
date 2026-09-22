---
name: lead-generation
description: This skill should be used when the user asks to "find leads", "build a lead list", "prospect", "find companies that…", "find people who…", "enrich these leads", or "find emails for this list", or wants an ICP-filtered outreach list. Covers the full superagnt workflow: company and people discovery, enrichment, scoring, storing results in the workspace database, and drafting outreach for human review. Sending is always human-approved.
version: 0.2.0
---

# Lead generation on superagnt

The workflow: pin the ICP → discover companies → find the people → verify
emails → score → store → draft. Everything lands in the workspace database so
runs compound instead of starting over.

## Procedure

1. **Pin the ICP once.** Ask the user for company filters (size, industry,
   geography, signals) and buyer titles. Store them in an `icp_profile` table
   (`agnt_db_insert`) so later runs read instead of re-asking.
2. **Discover companies**: `data_agnt_companies_search` (filters) or
   `data_agnt_companies_discover` (similar-to / signal-based). Enrich with
   `data_agnt_companies_enrich` when a row needs more than the search
   returned.
3. **Find the people**: `data_agnt_people_search` scoped by company + the ICP
   titles; `data_agnt_people_enrich` for the chosen ones.
4. **Emails**: `data_agnt_people_email_finder`, then ALWAYS
   `data_agnt_people_email_verifier` before a draft is written against an
   address. Unverifiable ≠ discard — mark the row, LinkedIn outreach still
   works.
5. **Store with per-row status**: one `prospects` table, upserted
   (`agnt_db_upsert`) with a stable key (person + company), columns for
   `status`, `fit_score`, `fit_reason`, `draft`. Schema patterns: the
   workspace-db skill.
6. **Score and draft.** Fit score with a one-line reason per row; outreach
   drafts written into the `draft` column in the user's voice (ask for two of
   their past emails if voice matters).

## Hard rules

- **Never send anything.** Drafts are the deliverable; the human sends, or
  wires their own sending tool deliberately.
- Verified-email counts and list sizes reported to the user must come from
  the table (`agnt_db_select count`), not memory.
- Large lists (500+): move enrichment to a data job (data-pipelines skill)
  instead of looping calls in-session.

## More

- A standing weekly refresh belongs on a task agent (task-agents skill), not
  in repeated client sessions.
- The packaged end-to-end version of this workflow:
  https://superagnt.com/skills (Outbound Pipeline Engine)

<!-- skill_id: lead-generation · source: https://github.com/superagnt/plugins -->
