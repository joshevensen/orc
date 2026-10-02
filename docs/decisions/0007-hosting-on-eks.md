# 0007 — Host Orc on EKS in our own AWS account

**Status:** Accepted · **Date:** 2026-10-01

## Context
Orc needs to run long-lived services, Temporal, and many isolated execution environments. Code and model usage should stay in our own AWS account (C-3).

## Decision
Run everything on EKS in our AWS account: the API, workers, web UI, Temporal, and execution environments (on a separate node group). Use RDS Postgres for data.

## Alternatives considered
- **ECS/Fargate.** Simpler, but no good fit for the sandbox runtime chosen in 0008.
- **A managed third-party sandbox.** Rejected: code would run outside our account.

## Consequences
- Kubernetes is the one platform to learn and operate, for a solo builder.
- Q-ORG-3 (any infrastructure) is still satisfied: nothing outside the sandbox and deployment manifests depends on EKS specifically.
