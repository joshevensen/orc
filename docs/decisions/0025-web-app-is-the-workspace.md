# 0025 — The web app is Orc's workspace; no CLI; review happens in Orc before the PR

**Status:** Accepted · **Date:** 2026-10-02 · **Supersedes:** 0003

## Context
0003 made the web UI a place for seeing and deciding, with work started from the issue tracker or a CLI. In practice the work, and the review of it, happens in Orc: engineers, designers, and support people describe tasks, check results, and ask for changes. Project managers need planning features (roadmaps, estimates, hierarchy) that Orc shouldn't rebuild, so they stay in the issue tracker. Maintaining a CLI alongside the web app doubles the interface work for a small team.

## Decision
- **The web app is the main interface.** There is no CLI in v1. The API stays complete and documented (FR-54), so a CLI can return later.
- **Work is organized around tasks, not sessions.** A task is a work item: either created in Orc (choose the repo — one per task, 0026 — describe the work; Orc creates the item in the issue tracker) or created by a project manager in the tracker. The navigation lists tasks grouped by state: needs you, queued or running, ready for review, done.
- **The issue tracker is the record.** Project managers plan there. Orc reads items and writes back status, comments, and proposed edits (FR-14); it doesn't become a second place to edit items.
- **Runs start only from Orc**, by an explicit action in the web app (FR-8). Tracker events update tasks but don't start runs. This settles the trigger-model question.
- **Asynchronous, not live.** People don't steer a run while it works. They answer questions and review at checkpoints, then request changes, which start follow-up runs (FR-78).
- **Review happens in Orc before a pull request exists.** Develop pushes to the run's branch and its run ends, holding the change for a change review; no run is in progress while people review (FR-7). People review the change in Orc (diff, change-review comments, evidence). Requesting changes is a follow-up (FR-78): Orc restates the work and starts a new run only once they confirm. Approving is the person's action that starts Ship (FR-19), which opens the pull request.
- **Live previews are later.** In v1, evidence is screenshots, test output, and recordings (FR-15). Opening the running app from a sandbox through Orc's authenticated proxy comes after.
- No chat integration (Slack, Teams) in v1; the chat contract is kept for later. Orc reaches people in the web app, by email, and through tracker mentions.

## Alternatives considered
- **Keep the CLI.** Rejected for v1: a second interface to build and keep in step.
- **Interactive sessions like a coding assistant.** Rejected: live steering is where other tools already compete, and it needs always-on sandboxes. Orc's value is learning and quality (0005).
- **Review on the GitHub pull request.** Cheaper, but splits the conversation between Orc and GitHub and puts unfinished work in front of reviewers.
- **Two-way editing of tracker items in Orc.** Rejected: rebuilds the tracker and needs fragile two-way sync.

## Consequences
- The web app needs a diff viewer with line comments; its package is chosen when that screen is built.
- Review comments are stored by Orc and are a source for learning (FR-67), alongside comments on the eventual pull request.
- Pull requests open later and in a cleaner state, so GitHub review is shorter.
- `apps/cli` and `commander` are removed.
