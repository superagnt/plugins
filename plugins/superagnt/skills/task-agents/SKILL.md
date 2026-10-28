---
name: task-agents
description: "This skill should be used when a task must recur (\"run this every day\", \"on a schedule\", \"set up a cron\", \"keep this updated while I sleep\", \"check X every morning\") or when a recurring job keeps re-running inside this client and eating its usage. Covers the two ways to run it: this client's own scheduler when it can run the superagnt tools, or a superagnt task agent, a small deployed agent that runs one job on the hosted runtime, fired by a schedule or webhook, with state in the workspace database. Cron mechanics in schedules.md."
version: 0.2.0
---

# Task agents: recurring work

A recurring task can run two ways. Offer whichever fits the human:

- **This client's own scheduler.** If the client can schedule a recurring
  task whose runs have the superagnt tools, use it. Each run starts with no
  chat history, so write the task to stand alone and keep its state in the
  workspace database. Runs use the human's plan for this client; superagnt
  data calls still spend data credits. A scheduled run starts with nobody
  signed in: check that the client can run unattended on this machine and
  that something will fire it (the client's scheduler, cron or launchd), and
  test one run. Nobody approves calls in a scheduled run and superagnt
  doesn't gate tools for a client, so give the run an allowlist of only the
  tools the job needs, with nothing that sends a message or starts a
  campaign (on a grouped server that's the whole group tool, such as
  `connection_gmail_mail_send`), and check in the test run that the
  scheduled run's tool list has none of them. If the client can't restrict
  tools for a scheduled run, build a task agent. Have
  each run write its result where the human looks, and check the last run's
  timestamp in the next attended session. If you are not sure the client can
  schedule, or that its scheduled runs see the superagnt tools, say so and
  build a task agent.
- **A task agent.** A small deployed superagnt agent that carries ONE job.
  It runs on the hosted runtime, billed per run to the workspace, and a
  schedule or webhook fires it with nobody at a keyboard and the laptop
  closed. Use it when the client can't schedule, when the job reacts to
  events (webhooks), or when it must run whether or not the human's machine
  is on.

What doesn't work is re-running the job by hand in chat each time. Once a
task has run in-session more than twice and will keep recurring, offer one
of the two. The recipe below builds a task agent; steps 1 and 2 apply to a
client-scheduled task too.

## Recipe

1. **Prove the task in-session first.** Never hand an agent a job that has
   not succeeded once end to end.
2. **State in the workspace database** (workspace-db skill). A hosted run has
   no chat history — everything it needs to resume must be in a table.
3. **Enable the families.** `agnt_tools_enable({ families: ['lifecycle'] })`
   for create/deploy; `['schedules']` for cron. Both are on every plan. Plans
   cap deployed agents and enabled schedules, so a `requires_upgrade` result
   carries a `confirm_url` naming the next plan: hand it to the human and
   wait; not an error.
4. **Create narrow.** `agnt_agents_create` with a name and a system prompt
   that is the full job: the task, the tables it reads/writes, what done
   looks like, what to do on failure. Then `agnt_agents_update_config` with
   `{ tools: { add: [...] } }` — config refs copied verbatim from
   `agnt_tools_search`, and only the tools the job needs. A task agent with
   every tool is a liability, not a convenience.
5. **Deploy.** `agnt_agents_deploy` flips it live and it starts billing from
   its first session, so confirm with the human before calling. Runs spend
   AI credits. The builder plans include none and the trial a one-time AI
   credit for hosted agents: past that, the human tops them up in the
   superagnt app.
6. **Wire the trigger.** An event exists → bind a webhook to the agent
   (automations skill). Purely time-based → create a schedule
   ([schedules.md](schedules.md)). On-demand from another agent or session →
   `agnt_agents_dispatch` (fire-and-forget) or the
   `agnt_agents_session_start` / `send` / `poll` trio when the result is
   needed synchronously.
7. **Smoke-test.** One `agnt_agents_session_start` run before trusting the
   trigger; enable the `observability` family to read the transcript
   (`agnt_observability_read_session`).

## Keeping it honest

- Results land where the human already looks: a dashboard view (dashboards
  skill), or a table the next session reads — never only in the agent's own transcript.
- One job per agent. A second job is a second agent; they can hand off via
  `agnt_agents_dispatch` or agent-to-agent webhooks.
- Misbehaving agent: `agnt_agents_set_enabled(false)` stops triggers
  reversibly — prefer it over archiving.

## Tool names on grouped servers

This skill writes flat (per-operation) tool names. New superagnt servers list
grouped tools instead: one tool per resource with an `action` argument. Flat
names still resolve there but are not listed, so call the grouped form:

- `agnt_agents_create` / `agnt_agents_update_config` / `agnt_agents_deploy` / `agnt_agents_set_enabled` → `agnt_agents_write`, action `create` / `update_config` / `deploy` / `set_enabled`
- `agnt_agents_dispatch` / `agnt_agents_session_start` / `agnt_agents_session_send` → `agnt_agents_run`, action `dispatch` / `session_start` / `session_send`
- `agnt_agents_session_poll` → `agnt_agents_read`, action `session_poll`
- `agnt_observability_read_session` → `agnt_observability_read`, action `read_session`
- `agnt_schedules_create` / `agnt_schedules_update` → `agnt_schedules_write`, action `create` / `update`

`agnt_tools_enable` is `agnt_tools_write`, action `enable`, on a grouped
server. `agnt_tools_search` and `agnt_tools_list_enabled` keep their names.

## More

- Cron syntax, cadence discipline, timezones: [schedules.md](schedules.md)
- Event triggers instead of clocks: the automations skill
- Setup guide, every client: https://www.superagnt.com/install

<!-- skill_id: task-agents · source: https://github.com/superagnt/plugins -->
