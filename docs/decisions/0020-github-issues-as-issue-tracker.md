# 0020 — GitHub Issues is the v1 issue tracker

**Status:** Accepted · **Date:** 2026-10-02

## Context
Orc started with Jira Cloud as its only issue tracker (C-1). Orc already uses GitHub as its code host through a GitHub App (0004). Using GitHub Issues too means one system, one app, and one webhook source, and a first-time user needs no separate tracker.

## Decision
GitHub Issues is the only issue tracker in v1. The package is `issue-tracker-github`, behind the `IssueTracker` contract. Jira, Linear, and others are later integrations (0002). A person starts work by assigning an issue to Orc's bot account or commenting a command; the exact trigger is an open question (requirements §9).

## Alternatives considered
- **Keep Jira in v1.** Rejected: a second vendor, app, and set of credentials, without a current user.
- **Both in v1.** Rejected: doubles the tracker work.

## Consequences
- GitHub Issues has fewer fields and weaker hierarchy than Jira. Where Orc needs structure (status, workflow, product mapping), it uses labels, issue types, and its own database, not tracker-specific fields. The `IssueTracker` contract must not assume GitHub's data shape (0002), or Jira will fit badly.
- Identity links (FR-4) shrink to GitHub accounts plus the identity provider.
- Non-production copies filter by repo or label instead of a Jira project (Q-OPS-1).
- Orc writes GitHub-flavored Markdown (FR-53).
