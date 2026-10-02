# 0006 — Durable runs on self-hosted Temporal

**Status:** Accepted · **Date:** 2026-10-01

## Context
Runs last an hour or more, pause for hours waiting on people, must survive restarts without being lost or done twice (Q-REL-1), resume where they left off (FR-9), be cancellable (FR-10), and enforce retry limits (FR-13).

## Decision
Run workflows on Temporal, self-hosted on EKS, with RDS Postgres as its persistence. Workers use the Temporal TypeScript SDK. Human input reaches a run as a signal.

## Alternatives considered
- **BullMQ plus a state machine in Postgres.** Rejected: simpler to run, but means rebuilding durability, timers, and exactly-once resumption by hand.
- **AWS Step Functions.** Rejected: ties Orc to AWS (Q-ORG-3).
- **Temporal Cloud.** Rejected for now on cost; self-hosting is acceptable.

## Consequences
- One more system to operate: Temporal server, its database, upgrades.
- Workflow code must be deterministic; anything with side effects (model calls, git, external APIs) runs as an activity.
