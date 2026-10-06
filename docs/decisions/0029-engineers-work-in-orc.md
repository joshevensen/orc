# 0029 — Engineers work in Orc, not only at checkpoints

**Status:** Accepted · **Date:** 2026-10-06 · **Supersedes in part:** 0025 (asynchronous, no interactive sessions, live previews later), 0026 (no "Ask Orc" in v1)

## Context
Orc is meant to replace the IDE as an engineer's daily workspace, since engineers no longer write most code by hand. Measured against that, checkpoint-only interaction sends engineers back to their editors for most of what they still do: small fixes, understanding code, redirecting an agent that's going the wrong way, checking something in the environment, and exploring without a ticket. Orc orchestrates existing coding agents (0011), which already support being steered mid-run. The goal is for engineers to start every task in Orc and leave only to debug.

## Decision
- **Steering a run.** A person who may continue a run can message a running agent: interrupt now, or deliver after the current step. Each message is an explicit action (FR-8) and is part of the run record.
- **Quick edits without taking over.** Engineers edit code inline in the walkthrough or the diff; the edit is their commit (FR-91), and checks re-run automatically.
- **Take over and hand back** stay (FR-11, FR-87), with "open in" links for VS Code, Cursor, and JetBrains, and a one-tap reason for leaving Orc that is measured.
- **A terminal into the run's sandbox,** for Engineers, while the run is paused or taken over. It is the same sandbox the agent uses, with the same lack of credentials and the same egress rules (Q-SEC-4, Q-SEC-5). Commands are recorded for audit. It lives only as long as the run's sandbox, so it is not a long-lived environment.
- **A repo browser:** files, search, and each name's definition and usages, at the task's branch. Read-only.
- **The agent transcript** (every file read, search, command, test, and edit) is part of the run record (FR-77), shown to Engineers.
- **Ask the codebase and scratch sessions.** Questions that don't need a task are answered with links to the code. An answer can become a task or a scratch session: a draft task with its own branch that stays out of the tracker and pull requests until it's promoted. Asking goes through the LLM gateway like every model call.
- **Preview links.** Orc links to the organization's own preview environments when a repo has them. Orc-hosted live previews stay later.
- **Merge conflicts** are shown with main's version, the branch's, and Orc's proposed merge, and a person picks one or edits it (FR-86).
- **A command palette and keyboard shortcuts** for every action.

## Alternatives considered
- **Keep checkpoints only (0025).** Rejected: it keeps engineers in their editors, which defeats the goal.
- **Build an IDE into Orc.** Rejected: debugging with breakpoints and profiling stay in real editors; Orc makes leaving and returning seamless instead.
- **A long-lived interactive environment per engineer.** Rejected for v1: the terminal reuses the run's sandbox.

## Consequences
- Runs need a channel for steering messages (Temporal signals into a running agent session).
- The API needs an authenticated, audited exec path into a paused or taken-over sandbox.
- Ask needs a read-only agent session over a repo checkout, and scratch sessions need draft tasks that exist before a tracker item does.
- Engineers leaving Orc, and why, becomes a success measure.
