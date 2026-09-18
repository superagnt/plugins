---
name: video-multiplier
description: This skill should be used when the user wants to run the Video Multiplier blueprint, or asks to "package my YouTube upload", "write chapters and a description for this video", "turn this video into posts", "repurpose my video into a thread / shorts / newsletter", or wants every new upload to come back as a full content package. Runs on the superagnt MCP: YouTube data + workspace database, with an optional per-upload hosted run.
version: 0.1.0
---

# Video Multiplier

Turn one YouTube upload into the full package: chapters, title options,
description, and a week of post drafts built from the transcript. One
video becomes seven pieces. Publishing stays with the user.

## Step 0 — tools

`agnt_tools_list_enabled`; if `data:youtube` or `database` families are
missing, `agnt_tools_enable({ "families": ["data:youtube", "database"] })`.
A `requires_upgrade` result carries a `confirm_url` — give it to the
user and wait, then re-run. (Connecting through the video-multiplier
blueprint endpoint pre-enables these.)

## Step 1 — intake

Take the video link directly, or resolve the user's channel
(`data_youtube_youtube_channel_id`, `data_youtube_channel_videos`) so
new uploads can queue themselves. On first run, ask what they plug in
every post (links, products, sponsor lines) and where their audience
lives (X, LinkedIn, shorts, a newsletter) — that decides which
derivative drafts to produce. Store it:

- `multiplier_profile(id, standing_links jsonb, channels text[],
  voice_notes text, updated_at timestamptz)` — via
  `agnt_db_apply_migration` then `agnt_db_insert`.
- `multiplier_packages(video_id primary key, url, title, status text
  default 'queued', chapters_md text, title_options jsonb,
  description_md text, packaged_at timestamptz)`.
- `multiplier_posts(id, video_id, kind text, draft_md text, source_ts
  text, status text default 'draft', created_at timestamptz)` —
  `kind` ∈ thread / short_script / linkedin / newsletter_section.

## Step 2 — package the upload

`data_youtube_video_details` for title, stats and length, then
`data_youtube_video_subtitles` for the transcript. From the transcript
write the studio package: chapters with `mm:ss` timestamps at the real
topic turns, five title options (the honest ones — no bait the video
does not pay off), and the full description with the standing links.
Save on `multiplier_packages` (`agnt_db_upsert`) and show it ready to
paste. No subtitles → say so and stop; never package from the title
alone.

## Step 3 — draft the derivative week

From the same transcript, draft the week for the channels the user
named: an X thread built on the strongest sequence, 2-3 short-form
scripts each anchored on one moment (hook, beats, CTA), a LinkedIn
post, a newsletter section. Every draft quotes or paraphrases the
video's actual lines and carries its source timestamp in `source_ts`.
File each into `multiplier_posts` and present the set for review. The
user edits and posts; nothing goes out by itself.

## Step 4 — offer the per-upload run (a task agent)

Once one package has shipped, offer to make it automatic per upload by
building a task agent — the full recipe is the base `task-agents`
skill. Short form: `agnt_agents_create` with a system prompt carrying
steps 2–3 verbatim (tables, package shape, the channel list), add ONLY
the tools those steps use, `agnt_agents_deploy`, then
`agnt_schedules_create` on a daily check of the channel for new uploads
— cadence confirmed with the user first; every firing is a billed run.
The `lifecycle` and `schedules` families are sold under modules with
free trials; `requires_upgrade` → `confirm_url` → wait. If the user
prefers local-only, skip this and tell them to re-run the skill per
upload.

## Rules

- Every chapter, quote and claim comes from the transcript or the video
  details — never from memory of the topic.
- Titles never promise what the video does not deliver.
- This skill drafts; it never uploads, posts, comments, or edits the
  user's YouTube studio.

<!-- skill_id: video-multiplier · source: https://github.com/superagnt/plugins -->
