---
name: shortform-script-engine
description: This skill should be used when the user wants to run the Short-Form Script Engine blueprint, or asks to "write short-form scripts from what's working in my niche", "give me TikTok scripts built on proven hooks", "what hooks are winning and write me the videos", or wants a weekly batch of ready-to-film scripts. Runs on the superagnt MCP: TikTok data + workspace database, with an optional weekly hosted run.
version: 0.1.0
---

# Short-Form Script Engine

Study the top-performing short-form videos in the user's niche, rank
the hook patterns that keep winning, and WRITE five ready-to-film
scripts on them: hook line, beat-by-beat structure, CTA, proof linked.
The output is scripts to record, not research to read.

## Step 0 — tools

`agnt_tools_list_enabled`; if `data:tiktok` or `database` families are
missing, `agnt_tools_enable({ "families": ["data:tiktok", "database"] })`.
A `requires_upgrade` result carries a `confirm_url` — give it to the
user and wait, then re-run. (Connecting through the
shortform-script-engine blueprint endpoint pre-enables these.)

## Step 1 — define the niche (first run only)

Ask the user for their niche, 3-5 creators they rate, what they sell,
and the CTA their videos should land on. Derive 5-8 searches: topic
phrases, format names, the rated creators' usernames (via
`data_tiktok_user_s_videos` for their catalogs). Store it:

- `script_config(id, niche, cta text, voice_notes text, created_at)` —
  via `agnt_db_apply_migration` then `agnt_db_insert`.
- `script_searches(id, query, active, created_at)`.
- `script_winners(video_id primary key, query_id, author, title,
  hook_text, hook_pattern, plays bigint, likes int, url, posted_at
  timestamptz, seen_at timestamptz)`.
- `script_drafts(id, hook_pattern, script_md text, example_urls jsonb,
  status text default 'draft', week text, created_at timestamptz)` —
  `status` moves draft → filmed/skipped.

## Step 2 — study the winners

For each active search: `data_tiktok_search_videos`, keep the top
performers by plays/likes for their age. Per keeper,
`data_tiktok_video_details` for the full description and stats. The
hook is the opening line, read from the title/description text.
Classify each into a named pattern (result-first, contrarian claim,
"I did X for N days", direct question, POV, listicle — extend the set
as real patterns appear, never force a fit). Upsert into
`script_winners` on `video_id` (`agnt_db_upsert`) so the ranking
sharpens week over week instead of resetting.

## Step 3 — write the five scripts

Rank patterns by how often they repeat among winners. Take the top
patterns and write FIVE complete scripts against the user's niche and
CTA, in their voice: the hook line (their version, not a copy), the
beat-by-beat structure with rough seconds, the visual note per beat
where it matters, and the CTA. Each script cites the 2-3 winning
videos its pattern is built on (`example_urls`). File into
`script_drafts` with the week, present all five, and let the user mark
what they filmed — `filmed` rows teach next week's batch what their
audience actually rewards.

## Step 4 — offer the weekly run (a task agent)

Once one batch has been filmed from, offer to make it weekly by
building a task agent — the full recipe is the base `task-agents`
skill. Short form: `agnt_agents_create` with a system prompt carrying
steps 2–3 verbatim (tables, pattern set, script shape, the CTA), add
ONLY the tools those steps use, `agnt_agents_deploy`, then
`agnt_schedules_create` — cadence confirmed with the user first; every
firing is a billed run. The `lifecycle` and `schedules` families are
sold under modules with free trials; `requires_upgrade` →
`confirm_url` → wait. If the user prefers local-only, skip this and
tell them to re-run the skill each week.

## Rules

- Never fabricate plays, likes or hook text — everything cited comes
  from a tool result or the table.
- Scripts borrow the PATTERN, never the words: no rewritten copies of
  another creator's script.
- Hook text is read from the video's caption text; when the spoken
  opening is not available, say so.
- This skill writes scripts; it never posts, comments, or DMs.

<!-- skill_id: shortform-script-engine · source: https://github.com/superagnt/plugins -->
