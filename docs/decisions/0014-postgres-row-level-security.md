# 0014 — Postgres with row-level security and pgvector

**Status:** Accepted (hosting amended by 0017) · **Date:** 2026-10-01

## Context
All data is scoped to an organization (0001, Q-ORG-1). Lessons need similarity search to find the ones relevant to a piece of work.

## Decision
Use Postgres (RDS). Every table carries `org_id`, and row-level security policies enforce isolation in the database, not only in application code. Use pgvector for lesson retrieval.

## Alternatives considered
- **Isolation only in application code.** Rejected: one missed filter leaks data.
- **A separate vector database.** Rejected: another system to run, for no need at this scale.

## Consequences
- Every database session must set the current organization; tests must cover cross-organization access.
- One database to back up and restore (Q-DAT-4).
