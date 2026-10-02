# 0001 — Internal first, with all data scoped to an organization

**Status:** Accepted · **Date:** 2026-10-01

## Context
Orc will first serve one organization, built by one person, with no target date. It may later serve other organizations.

## Decision
v1 supports a single organization. Multi-organization features (the Operator role, organization creation, cross-organization sharing) are deferred. Every piece of data still carries an organization ID from day one.

## Alternatives considered
- **Multi-organization from the start.** Rejected: large cost for a solo builder, no near-term user.
- **Single organization with no organization ID.** Rejected: retrofitting isolation later means touching every table and query.

## Consequences
- Q-ORG-1 holds from the start; multi-organization later is a feature, not a rewrite.
- Requirements marked [later] stay in the document so the design doesn't close them off.
