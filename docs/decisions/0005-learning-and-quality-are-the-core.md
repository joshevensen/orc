# 0005 — Learning and quality are the core; the coding agent is replaceable

**Status:** Accepted · **Date:** 2026-10-01

## Context
Turning a work item into a pull request is now offered inside Jira and GitHub and by several vendors, and coding agents are starting to keep memory (e.g. Copilot Memory). Models are improving fast. Anything Orc builds that platforms will give away is at risk of being replaced.

## Decision
Orc's lasting value is organization-wide learning, measured quality, specification quality, verification, and policy. The coding agent, execution environments, model, and triggers are swappable parts. Orc can serve its lessons and skills to other agents (FR-74).

## Alternatives considered
- **Compete as a better coding agent.** Rejected: that's where the platforms and model vendors are investing most.

## Consequences
- Workflows stay thin; rigidity goes in the safety layer, flexibility in skills.
- Engineering effort is weighted toward lessons, evals, verification, and specs.
- Lessons must be usable outside Orc (MCP, API, export).
