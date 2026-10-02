# 0013 — How lessons are learned, approved, and served

**Status:** Accepted · **Date:** 2026-10-01

## Context
Learning is Orc's core (0005). Learning from comments is also a way to poison Orc: anyone who can comment can try to teach it something (Q-SEC-1).

## Decision
- **Sources:** only work Orc took part in: comments, review feedback, and requested changes on its work items and proposed changes, conversations about that work, and edits to its specifications (FR-67, FR-73, FR-81).
- **Approval:** nothing applies until approved. Any Manager or Admin can approve a lesson of any scope; who approves what is the organization's call (FR-68).
- **Shape:** scoped to a repo, team, or the organization; versioned; editable, retirable, and expirable (FR-69).
- **Measured** like a skill change before use (FR-70); every run records which lessons it applied (FR-71); conflicts go to a person (FR-72).
- **Stored** as versioned rows in Postgres with embeddings for retrieval (0014), not as files.
- **Served** to other agents through an MCP server (primary), the API, and export (FR-74–FR-76).

## Alternatives considered
- **Learn from all PRs in the organization.** Rejected for now: far more data, much harder to keep clean.
- **Auto-apply lessons.** Rejected: poisoning risk.
- **Lessons approved only by their own team's Manager.** Rejected: needs ownership rules (e.g. who owns a repo) that Orc doesn't have.

## Consequences
- Learning is slower but trustworthy.
- Outside agents' use of lessons is unmeasured unless they report back.
