# 0004 — Orc runs outside GitHub, as a GitHub App

**Status:** Accepted · **Date:** 2026-10-01 · **Revisit:** when GitHub documents a way for organizations to register their own external agents

## Context
GitHub now offers custom agents (profiles in `.github` / `.github-private`) and Agent HQ, which governs agents and logs their sessions. Those agents run on GitHub's infrastructure and models.

## Decision
Orc runs on its own infrastructure and uses GitHub as a code host through a GitHub App. People trigger it by assigning work or commenting to its bot account.

## Alternatives considered
- **Orc as a Copilot custom agent.** Rejected: breaks C-3 (Bedrock in our account), Q-SEC-4/5 (our own sandbox), and can't run the Jira-side workflows.
- **Orc as a third-party agent shown in Agent HQ.** Deferred: no documented route for an organization's own external agent was found.

## Consequences
- Orc owns its sandbox, model access, and policy.
- If GitHub opens third-party registration, add it as another trigger behind the contract, without moving Orc inside GitHub.
