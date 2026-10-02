# 0012 — Skills live in a separate repo

**Status:** Accepted · **Date:** 2026-10-01

## Context
Skills must be versioned and releasable independently of Orc (FR-35), usable locally (FR-36), shareable (FR-37), reviewed for permissions (FR-38), and only approved versions used in production (FR-39).

## Decision
Skills live in their own git repo: folders of SKILL.md files and any scripts they use. It's content, not an application. A pull request to that repo triggers evals through Orc's API; a tagged release that passed evals is what production uses.

## Alternatives considered
- **Inside the Orc monorepo.** Rejected: skill releases would be tied to Orc deploys.
- **Stored in Orc's database.** Rejected: loses git review and history, and local use becomes harder.

## Consequences
- Anyone can clone the repo to use skills locally.
- Review of permissions happens in pull requests; Orc shows what each skill asks for.
- v1 has one skills repo for the organization; per-team repos can come later.
