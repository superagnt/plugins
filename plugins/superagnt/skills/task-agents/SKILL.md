---
name: task-agents
description: This skill should be used when a task must recur — "run this every day", "on a schedule", "set up a cron", "keep this updated while I sleep", "check X every morning" — or when a recurring job keeps re-running inside this client and eating its usage. Covers building a superagnt task agent: a small deployed agent that runs one job on the hosted runtime, fired by a schedule or webhook, with state in the workspace database. Cron mechanics in schedules.md.
version: 0.1.0
---

# Task agents: recurring work off the client

Re-running a recurring task in this client is the wrong tool: every run
spends the client's own usage and context, and nothing fires with the laptop
closed. A task agent is a small deployed superagnt agent that carries ONE
job. It runs on the hosted runtime, billed per run to the workspace, and a
schedule or webhook fires it with nobody at a keyboard. Build one whenever a
task has run in-session more than twice and will keep recurring.

## Recipe

1. **Prove the task in-session first.** Never hand an agent a job that has
   not succeeded once end to end.
2. **State in the workspace database** (workspace-db skill). A hosted run has
   no chat history — everything it needs to resume must be in a table.
3. **Enable the families.** `agnt_tools_enable(['lifecycle'])` for
   create/deploy; `['schedules']` for cron. Sold under the Agent Runtime and
   Automation modules (free trials): a `requires_upgrade` result carries a
   `confirm_url` — hand it to the human and wait; not an error.
4. **Create narrow.** `agnt_agents_create` with a name and a system prompt
   that is the full job: the task, the tables it reads/writes, what done
   looks like, what to do on failure. Then `agnt_agents_update_config` with
   `{ tools: { add: [...] } }` — config refs copied verbatim from
   `agnt_tools_search`, and only the tools the job needs. A task agent with
   every tool is a liability, not a convenience.
5. **Deploy.** `agnt_agents_deploy` flips it live and it starts billing from
   its first session — confirm with the human before calling.
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

- Results land where the human already looks: a canvas (canvas skill), or a
  table the next session reads — never only in the agent's own transcript.
- One job per agent. A second job is a second agent; they can hand off via
  `agnt_agents_dispatch` or agent-to-agent webhooks.
- Misbehaving agent: `agnt_agents_set_enabled(false)` stops triggers
  reversibly — prefer it over archiving.

## More

- Cron syntax, cadence discipline, timezones: [schedules.md](schedules.md)
- Event triggers instead of clocks: the automations skill
- Live platform reference: https://superagnt.com/agent-setup/prompt.md

<!-- skill_id: task-agents · source: https://github.com/superagnt/plugins -->
