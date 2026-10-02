# 0017 — Self-managed Kubernetes on any infrastructure

**Status:** Superseded by 0023 · **Date:** 2026-10-02 · **Supersedes:** 0007

## Context
0007 tied Orc to EKS and an AWS account. Orc must deploy on any infrastructure that can run it (Q-ORG-3). Managed Kubernetes services limit the node runtime (for example, DigitalOcean's DOKS allows only the default containerd runtime), which blocks the sandbox design in 0018. The builder knows DigitalOcean better than AWS.

## Decision
Run Orc on an upstream-conformant Kubernetes cluster we operate ourselves, starting with k3s. The reference deployment is DigitalOcean Droplets; nothing in Orc may depend on a particular cloud. The cluster runs the API, workers, web UI, LLM gateway, Temporal, and execution environments (the latter on a dedicated node pool). Cilium is the network layer, for the egress rules in 0018.

Postgres is any Postgres with row-level security and pgvector. The reference deployment uses the cloud's managed Postgres; self-run Postgres is the fallback.

## Alternatives considered
- **A managed Kubernetes service (EKS, DOKS, GKE).** Less to operate, but we can't choose the node runtime, and each has its own account, IAM, and lock-in.
- **ECS/Fargate or App Platform.** No fit for the sandbox runtime.
- **A managed third-party sandbox.** Rejected: code would run outside our infrastructure.

## Consequences
- We operate the control plane, upgrades, storage, and networking. Keep the cluster small and rebuildable from manifests.
- Cloud-specific pieces (load balancers, volumes, managed Postgres) stay behind plain Kubernetes and Postgres interfaces so the manifests move between providers.
- Q-ORG-3 is met directly rather than only in principle.
- **Verify early:** that the reference Postgres supports RLS and pgvector as needed.
