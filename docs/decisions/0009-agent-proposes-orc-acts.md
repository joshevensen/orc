# 0009 — The agent proposes; Orc acts (declared actions)

**Status:** Accepted · **Date:** 2026-10-01

## Context
In 2026, text in GitHub issues and pull requests steered several major coding agents into leaking credentials and pushing code. Orc reads content anyone can write (Q-SEC-1). Safety can't depend on the model resisting manipulation.

## Decision
The agent never acts on the outside world. It runs in the sandbox with no credentials and can only **request** actions. Each workflow step declares which kinds of action it may request (e.g. Develop's implement step: "push commits to this run's branch"). A request is a structured record: type, target, contents.

Outside the sandbox, the **Action service** checks each request:
1. Is this action type declared for this step?
2. Is the target this run's own work item, repo, and branch?
3. Does policy allow the paths it touches (FR-27)?
4. Do the deterministic checks pass: secret scan (FR-85), dependency check (FR-84)?

Only then does Orc perform it with its own credentials, and record it (Q-AUD-1). A rejected request stops the run and is flagged (Q-SEC-7). For git, the agent commits inside the sandbox; Orc extracts the commits, checks them, and pushes them itself.

## Alternatives considered
- **Give the agent scoped tokens.** Rejected: a manipulated agent can still misuse any token it holds.
- **Rely on prompt defences.** Rejected: not a security boundary.

## Consequences
- Implements Q-SEC-4 and Q-SEC-6.
- Every new external capability needs a declared action type and a check, which slows adding them, deliberately.
