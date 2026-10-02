# 0019 — A provider-neutral LLM gateway

**Status:** Accepted, verify early (masking engine amended by 0022) · **Date:** 2026-10-02 · **Supersedes:** 0010

## Context
The agent runs inside the sandbox but needs a model. Putting provider credentials in the sandbox would break 0009. Orc also needs one place to record cost (FR-47), apply spending caps (FR-48), pin model versions (FR-82), and keep PII out of model context (Q-SEC-3). 0010 did this with Bedrock and Bedrock Guardrails. Organizations should be able to choose their provider (Bedrock, the Anthropic API, DigitalOcean Inference, others later).

## Decision
The sandbox can reach exactly one model endpoint: Orc's LLM gateway. The gateway exposes an Anthropic-compatible API to the agent and holds the provider credentials. For every request it:
- masks PII with consistent placeholders, using Orc's own masking, and stops the run when content can't be safely masked;
- enforces the run's approved model version and spending cap;
- records tokens, cost, and what kinds of PII were masked;
- forwards the request through the organization's configured `LlmProvider`.

Provider packages (`models-bedrock`, `models-anthropic`, `models-digitalocean`) only authenticate, translate, forward, and report usage. They don't make policy decisions. Each organization uses its own account and credentials with its chosen provider.

## Alternatives considered
- **Bedrock only, with Bedrock Guardrails (0010).** Rejected: couples masking and the contract to one provider.
- **Provider masking where available.** Rejected: behaviour would differ by provider and couldn't be measured consistently.
- **Call the provider directly from the sandbox.** Rejected: credentials in the sandbox.
- **Run the agent loop outside the sandbox, with tools executing inside it.** Workable, but every file read and command becomes a remote call; revisit if 0011's check fails.

## Consequences
- The gateway is on the critical path for every run; it must be reliable and fast.
- PII protection is best-effort (Q-SEC-3); masked-PII records show where it's working and where it isn't. Masking quality is ours to build and measure.
- Models and versions differ by provider, so evals record the provider and model, and runs aren't assumed comparable across providers (FR-82).
- Bedrock and the Anthropic API both serve Claude natively, so they ship first; the Anthropic provider is nearly a pass-through.
- With the Anthropic API, prompts and code go to Anthropic rather than to a cloud account the organization controls. Admins choose per organization knowing that.
- Bedrock serves Claude natively. DigitalOcean's endpoints are OpenAI-compatible, so the gateway must translate. **Verify early:** that translation preserves tool use, prompt caching, and extended thinking well enough for the Agent SDK. If it doesn't, DO ships as a degraded option or not at all.
- Adding another provider is one new package (Q-ORG-5).
