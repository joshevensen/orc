# 0010 — All model calls go through an Orc LLM gateway

**Status:** Accepted · **Date:** 2026-10-01

## Context
The agent runs inside the sandbox but needs a model. Putting Bedrock credentials in the sandbox would break 0009. Orc also needs one place to record cost (FR-47), apply spending caps (FR-48), pin model versions (FR-82), and keep PII out of model context (Q-SEC-3).

## Decision
The sandbox can reach exactly one model endpoint: Orc's LLM gateway. The gateway holds the Bedrock credentials (in our account), and for every request it:
- masks PII with consistent placeholders, using Bedrock Guardrails' sensitive-information filters, and stops the run when content can't be safely masked;
- enforces the run's approved model version and spending cap;
- records tokens, cost, and what kinds of PII were masked.

## Alternatives considered
- **Call Bedrock directly from the sandbox.** Rejected: credentials in the sandbox.
- **Run the agent loop outside the sandbox, with tools executing inside it.** Workable, but every file read and command becomes a remote call; revisit if 0011's check fails.

## Consequences
- The gateway is on the critical path for every run; it must be reliable and fast.
- PII protection is best-effort (Q-SEC-3); masked-PII records show where it's working and where it isn't.
