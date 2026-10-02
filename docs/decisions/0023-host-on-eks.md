# 0023 — Host Orc on EKS in AWS; drop DigitalOcean

**Status:** Accepted · **Date:** 2026-10-02 · **Supersedes:** 0017

## Context
0017 moved Orc to Kubernetes we operate ourselves on DigitalOcean Droplets. Two problems surfaced:
- The standard Kubernetes cluster autoscaler doesn't support self-managed clusters on Droplets, so sandbox capacity wouldn't grow or shrink with demand without custom scaling code.
- DigitalOcean's managed Kubernetes (DOKS) can't run gVisor (0024), DigitalOcean Functions are capped at 15 minutes and 1 GB, and one Droplet per run hit the account's Droplet limit.

AWS covers all of these with managed services, and it's what the builder's workplace uses.

## Decision
Run Orc on **EKS** in our AWS account: the API, workers, LLM gateway, web UI (static files), Temporal, and execution environments (0024). Use **RDS Postgres** (with pgvector) for data, **S3** for object storage, and **Karpenter** to provision nodes on demand.

DigitalOcean is dropped entirely, including DigitalOcean Inference as an LLM provider: `models-digitalocean` is removed, leaving Bedrock and the Anthropic API (0019).

## Alternatives considered
- **Self-managed Kubernetes on Droplets (0017).** Rejected: no node autoscaling without custom code.
- **DOKS with plain containers.** Rejected: too weak for untrusted code.
- **One Droplet per run.** Rejected: the account's Droplet limit caps concurrency.
- **ECS or EKS on Fargate for sandboxes.** Considered in 0024.

## Consequences
- Kubernetes manifests stay free of AWS specifics where practical, so Q-ORG-3 still holds; AWS-specific pieces (Karpenter node classes, IAM, RDS, S3) sit in deployment config.
- `object-store-s3` and `models-bedrock` become the default implementations.
- Local development still uses `docker-compose.yml`, with SeaweedFS as the local S3-compatible store (MinIO's image is no longer published).
- The Anthropic API has no embeddings API, and DigitalOcean was the other embedding source. Organizations on the Anthropic API also connect Bedrock, used only for embeddings (0021).
