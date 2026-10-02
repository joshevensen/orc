# 0026 — One repo per task; run records instead of conversation

**Status:** Accepted · **Date:** 2026-10-02

## Context
With the web app as Orc's workspace (0025), three requirements added more interface and system complexity than their value for v1:
- **Multi-repo tasks (FR-32 as first written).** One task changing several repos needs multi-repo sandboxes, coordinated branches, a repo switcher in review, and shipping a set of pull requests together.
- **Talking with Orc about a run (FR-77 as first written).** A chat that answers "why did you do that?" needs a model call per question, can misstate what happened, and blurs the line between comments that go to the tracker and questions that shouldn't.
- **Mentions in Orc's comments.** Mapping `@person` to each tracker's mention format duplicates what the tracker already does well.

## Decision
- **A task changes exactly one repo.** It's chosen when the task is created. Work that needs several repos is split into linked tasks, one per repo, and people decide the order they ship in. Investigate may still *read* related repos. A submodule repo counts as one repo.
- **Run records replace conversation.** Every step writes decision records as it goes: what was decided, the reason, what was checked, and which lessons were used. The web app shows them as a searchable, filterable history. Asking Orc questions about a run is [later].
- **Mentions stay in the tracker.** Orc's comment box has no mention support; `@name` in an Orc comment is plain text in the tracker. Orc's own notifications to specific people go through notifications (FR-79, FR-80).

## Alternatives considered
- **Keep multi-repo tasks.** Rejected for v1: most work is single-repo, and linked tasks cover the rest.
- **An "Ask Orc" mode beside comments.** Rejected for v1: the run record answers the same questions without a model call.
- **Mentions mapped to each tracker.** Rejected: people who want to notify someone can do it in the tracker.

## Consequences
- Cross-repo features take more coordination by people; Orc shows task links but doesn't order or ship them together.
- The agent and workflows must write good decision records; that's a requirement on `sandbox-agent` and every workflow step, and something evals can check.
- Corrections that become lessons come from comments, change reviews, manual edits, and replies to Orc's messages (FR-81).
