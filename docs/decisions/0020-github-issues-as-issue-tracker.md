# 0020 — GitHub Issues and Jira are the v1 issue trackers

**Status:** Accepted · **Date:** 2026-10-02

## Context
Orc started with Jira Cloud as its only issue tracker (C-1). Orc already uses GitHub as its code host through a GitHub App (0004), so GitHub Issues needs no separate tracker for a personal or small-team user. The builder uses GitHub personally and Jira at work, and may introduce Orc there.

## Decision
GitHub Issues and Jira Cloud are both v1 issue trackers: `issue-tracker-github` and `issue-tracker-jira`, behind the one `IssueTracker` contract. An organization uses one or both (Q-ORG-5). Linear and others are later (0002). A person starts work by assigning an item to Orc or commenting a command; the exact trigger is an open question (requirements §9).

## Alternatives considered
- **GitHub Issues only in v1, Jira later.** Rejected: building both now tests the contract against two different tracker models and keeps the path to work adoption short, at the cost of more v1 work.
- **Jira only (the original plan).** Rejected: forces a separate tracker for personal use.

## Consequences
- Two trackers doubles the tracker work: webhooks, auth, native formatting (Markdown vs Atlassian Document Format), identity mapping, and tests for each.
- GitHub Issues has fewer fields and weaker hierarchy than Jira. Where Orc needs structure (status, workflow, product mapping), it uses its own database, not tracker-specific fields, so the contract fits both.
- Identity links (FR-4) cover Jira accounts, GitHub accounts, and the identity provider.
- Non-production copies filter by repo or label (GitHub) and project (Jira) (Q-OPS-1).
- Build the contract against both trackers from the start; if one is behind, GitHub Issues ships first.
