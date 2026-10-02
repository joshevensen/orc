# 0016 — Reviewability instead of PR size limits

**Status:** Accepted · **Date:** 2026-10-01

## Context
2026 data shows AI-generated pull requests are larger, wait several times longer for review, and merge far less often than human ones. Hard size limits would split work artificially.

## Decision
No size limit. Instead, make medium-sized changes easy to review:
- the description gives the goal, cross-file context, and verification evidence per acceptance criterion (FR-59);
- everything else sits as close to the code as possible, as line or file comments (FR-60);
- comments point at decisions, uncertainty, and risk, and never argue the code is correct (FR-61);
- commits are ordered so they can be read in sequence (FR-15);
- stacked pull requests when a change splits cleanly, without depending on the feature (FR-62).

## Alternatives considered
- **Hard size limits.** Rejected: size is a proxy for review effort, not the thing itself.

## Consequences
- Review time and merge rate (§8) show whether this works; revisit if they don't improve.
