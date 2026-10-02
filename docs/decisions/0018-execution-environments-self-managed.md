# 0018 — Execution environments on Agent Sandbox with gVisor, on our own nodes

**Status:** Accepted, verify early · **Date:** 2026-10-02 · **Supersedes:** 0008

## Context
Each run needs its own isolated place to install, build, test, and run code (FR-63), which survives pauses (FR-64), starts fast (Q-PERF-1), and can reach only allowed network destinations (Q-SEC-5). 0008 chose Agent Sandbox with gVisor on EKS. Hosting is now self-managed Kubernetes (0017), so we control the node runtime.

## Decision
Use the Kubernetes SIG **Agent Sandbox** project (`Sandbox`, `SandboxTemplate`, `SandboxClaim`, `SandboxWarmPool`) with **gVisor** as the runtime. We install `runsc` and its containerd shim on a dedicated sandbox node pool, expose it as a `RuntimeClass`, and let that pool autoscale (to zero when idle where the infrastructure allows). Sandbox pods have:
- no cloud credentials, with the instance metadata address (169.254.169.254) blocked by network policy;
- Cilium network policies enforcing the egress allowlist;
- persistent storage per sandbox, so a paused run keeps its state.

Warm pools and per-repo images with dependencies pre-installed (rebuilt on a schedule) keep start-up fast. The sandbox sits behind the `Sandbox` contract.

## Alternatives considered
- **Kata Containers or Firecracker microVMs.** Stronger isolation, but need nested virtualization or bare metal; revisit if gVisor proves too weak.
- **Plain containers.** Rejected: too weak for untrusted code.
- **Managed sandboxes (E2B, Modal, DigitalOcean's agent runtime, currently private preview).** Rejected for v1: code leaves our infrastructure, or the service isn't available.

## Consequences
- Agent Sandbox's API is v1beta1, and hibernate-and-resume appears planned rather than shipped. **Verify early:** pause/resume behaviour, warm-pool start time, gVisor compatibility with the repos' build tools, and that gVisor runs on the reference Droplet image and kernel.
- We maintain the gVisor install across node image upgrades.
- If it falls short, the contract allows replacing it without touching workflows.
