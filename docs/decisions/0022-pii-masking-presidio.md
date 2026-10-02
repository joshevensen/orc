# 0022 — PII masking with Presidio; real values restored in responses

**Status:** Accepted, verify early · **Date:** 2026-10-02 · **Amends:** 0019

## Context
0019 made the LLM gateway responsible for masking PII (Q-SEC-3) with its own engine, independent of the model provider. No mature JavaScript library does this. Microsoft Presidio is an open-source PII detector with configurable entity types and custom recognizers, shipped as Docker images with REST APIs.

## Decision
Run the **Presidio Analyzer** as a sidecar to the LLM gateway, reachable only by the gateway. For every model request, the gateway:
1. extracts the text (prompts, tool results, file contents) and sends it to the Analyzer with the organization's entity types and custom recognizers;
2. replaces each detection with a placeholder itself (not with Presidio's Anonymizer), keeping a per-run mapping so the same value always gets the same placeholder (`<EMAIL_1>`);
3. stops the run when content can't be safely masked (e.g. detections below the confidence threshold for a type the organization marks as strict);
4. caches masked results by content hash, so repeated history is masked identically and quickly, and prompt caching keeps working;
5. records which PII types were masked.

On the way back, the gateway **replaces placeholders in the model's response with the real values** before the sandbox sees them, so code, tests, and comments the agent writes contain real data, not placeholders. The real values came from the organization's own repo and work items, which the sandbox already holds.

## Alternatives considered
- **Presidio's Anonymizer for replacement.** Rejected: it doesn't keep consistent placeholders across a run's many requests.
- **Leave placeholders in responses.** Rejected: placeholders would leak into code, tests, and comments, and the agent couldn't act on real values (e.g. a test fixture or a log line it is investigating).
- **Own detection engine in TypeScript.** Rejected: rebuilding named-entity recognition and recognizers is not core (0005).

## Consequences
- A Python service runs alongside the TypeScript system; it's stateless, so operating it is limited to images and resources.
- Name detection is trained on prose and will produce false positives on code. Allowlists and an eval set of realistic work item, code, and log content measure and tune it (Q-SEC-3).
- Streaming responses must be buffered around placeholders so one split across chunks is still restored.
- A placeholder the model invents that isn't in the run's mapping is left as is and flagged.
- The per-run mapping holds real PII; it lives only in the gateway, is scoped to the run, and is deleted with the run's data (Q-DAT-2).
- **Verify early:** detection quality and latency on realistic content, and that masking stays deterministic across a long run.
