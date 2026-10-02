# 0003 — Web UI and CLI; no chat integration in v1

**Status:** Superseded by 0025 · **Date:** 2026-10-01

## Context
Slack was originally an interface for starting work, approving, and notifications. The web UI is a better place to see runs, decide, and talk with Orc. But a web UI is somewhere people visit; it can't reach them when Orc is blocked.

## Decision
v1 interfaces are the web UI and the CLI, plus Jira for starting work. Orc reaches people through Jira mentions, email, and the web UI. No chat integration in v1; the chat contract is kept for later.

## Alternatives considered
- **Keep Slack.** Rejected: a third interface to build and keep consistent, for a solo builder.
- **Web UI only, no outbound notifications.** Rejected: blocking questions (FR-79, FR-80) would go unseen.

## Consequences
- Requirements updated: FR-1, FR-4, FR-6, FR-20, FR-52, FR-54, FR-55, FR-77, FR-80, Q-SEC-4, Q-ORG-5, Scope.
- Email delivery becomes a v1 integration (notifications contract).
