# 0008 — Execution environments on Agent Sandbox with gVisor

**Status:** Accepted, verify early · **Date:** 2026-10-01

## Context
Each run needs its own isolated place to install, build, test, and run code (FR-63), which survives pauses (FR-64), starts fast (Q-PERF-1), and can reach only allowed network destinations (Q-SEC-5). It must run in our account (0007).

## Decision
Use the Kubernetes SIG **Agent Sandbox** project (`Sandbox`, `SandboxTemplate`, `SandboxClaim`, `SandboxWarmPool`) on EKS, with **gVisor** as the runtime. Sandbox pods run on a dedicated node group with:
- no IAM role, and access to the instance metadata service blocked, so a pod can't obtain the node's AWS credentials;
- network policies (e.g. Cilium) enforcing the egress allowlist;
- persistent storage per sandbox, so a paused run keeps its state.

Warm pools and per-repo images with dependencies pre-installed (rebuilt on a schedule) keep start-up fast. The sandbox sits behind the `Sandbox` contract.

## Alternatives considered
- **Kata Containers.** Stronger isolation, but needs bare-metal nodes; harder to run.
- **Plain containers.** Rejected: too weak for untrusted code.
- **Managed sandboxes (E2B, Modal, etc.).** Rejected: code leaves our account.

## Consequences
- Agent Sandbox's API is v1beta1, and hibernate-and-resume appears planned rather than shipped. **Verify early:** pause/resume behaviour, warm-pool start time, and gVisor compatibility with the repos' build tools.
- If it falls short, the contract allows replacing it without touching workflows.
