# 0011 — Agent loop on the Claude Agent SDK, behind an interface

**Status:** Accepted, verify early · **Date:** 2026-10-01

## Context
Writing an agent loop from scratch is significant work and not Orc's core (0005). In-house systems at Stripe and Ramp built on existing open-source agents (Goose, OpenCode).

## Decision
Use the Claude Agent SDK (TypeScript) as the agent loop inside the sandbox. It supports Bedrock and loads skills in SKILL.md format. It sits behind an `Agent` interface so it can be replaced.

## Alternatives considered
- **OpenCode.** Model-agnostic and proven at Ramp; a fallback if the SDK doesn't fit.
- **Own agent loop.** Rejected: not core, and models change faster than custom loops keep up.

## Consequences
- **Verify early:** that the SDK can send its model calls to the Orc gateway (0010) rather than directly to Bedrock. The security design depends on it.
- Skills authored for the SDK also work locally in Claude Code (FR-36).
