# 0002 — GitHub only in v1; every integration behind a contract

**Status:** Accepted · **Date:** 2026-10-01

## Context
Supporting GitHub and GitLab doubles the code-host work. GitLab does support stacked merge requests, so it isn't ruled out on features. The issue tracker is more likely to need a second integration than the code host.

## Decision
v1 supports GitHub only. Each kind of integration (issue tracker, code host, notifications, identity provider, LLM provider, execution environment, and later chat) is defined once as a contract. Workflows depend only on contracts, never on a vendor.

## Alternatives considered
- **GitHub and GitLab in v1.** Rejected: doubles work for no current user.
- **Call vendor APIs directly from workflows.** Rejected: makes every new integration a change to every workflow.

## Consequences
- Adding GitLab, Linear, or GitHub Issues later means writing one new package (Q-ORG-5).
- Contracts must be designed from what workflows need, not from GitHub's API shape, or GitLab will fit badly.
