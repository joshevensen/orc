# 0024 — Execution environments on EKS with Agent Sandbox, gVisor, and Karpenter

**Status:** Accepted, verify early · **Date:** 2026-10-02 · **Supersedes:** 0018

## Context
Each run needs its own isolated place to install, build, test, and run code (FR-63), which survives pauses (FR-64), starts fast (Q-PERF-1), and can reach only allowed network destinations (Q-SEC-5). Capacity must grow when many runs start at once and shrink to nothing when idle. Hosting is EKS (0023).

## Decision
Use the Kubernetes SIG **Agent Sandbox** project (`Sandbox`, `SandboxTemplate`, `SandboxClaim`, `SandboxWarmPool`) with **gVisor** as the runtime, on a dedicated sandbox node pool provisioned by **Karpenter**:
- Karpenter adds nodes when sandbox pods are pending and removes them when idle, down to zero. A `NodePool` CPU and memory limit caps total sandbox capacity, and with it cost.
- Sandbox nodes use a node class whose bootstrap installs `runsc` and its containerd shim; sandbox pods select it through a `RuntimeClass`.
- Sandbox nodes have no IAM role beyond what the node itself needs, pods get no AWS credentials (no Pod Identity or IRSA), and the instance metadata service is unreachable from pods (IMDSv2 with a hop limit of 1, plus network policy).
- Cilium network policies enforce the egress allowlist, including allowlisting by domain name.
- Each sandbox has its own EBS-backed volume, so a paused run keeps its state.

When every slot is taken, runs wait in Temporal until capacity frees up; they don't fail. Warm pools and per-repo images with dependencies pre-installed (rebuilt on a schedule) keep start-up fast. The sandbox sits behind the `Sandbox` contract.

## Alternatives considered
- **ECS or EKS on Fargate.** Each task is its own micro-VM, so isolation is stronger and there are no nodes to manage. Rejected: there's no pause and resume, no warm pools, images are pulled on every start, and privileged containers aren't allowed. Revisit if gVisor proves too weak.
- **Lambda.** Rejected: 15-minute limit.
- **Kata Containers on bare-metal instances.** Stronger isolation, but expensive and harder to run.
- **Managed third-party sandboxes (E2B, Modal).** Rejected: code leaves our account.

## Consequences
- Agent Sandbox's API is v1beta1, and hibernate-and-resume appears planned rather than shipped. **Verify early:** pause/resume behaviour, warm-pool start time, Karpenter node start time, gVisor on the chosen EKS node image, and gVisor compatibility with the repos' build tools.
- We maintain the gVisor install in the sandbox node class across node image updates.
- If it falls short, the contract allows replacing it (e.g. with Fargate) without touching workflows.
