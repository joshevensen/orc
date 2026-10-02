# Decision records

One short record per significant decision: what was decided, why, what else was considered, and what follows from it. Records are append-only. To change a decision, write a new record that supersedes the old one and mark the old one **Superseded**.

Requirement IDs (FR-, Q-, C-) refer to [requirements.md](../requirements.md).

| # | Decision | Status |
|---|---|---|
| [0001](0001-internal-first-org-scoped-data.md) | Internal first, with all data scoped to an organization | Accepted |
| [0002](0002-github-only-integrations-behind-contracts.md) | GitHub only in v1; every integration behind a contract | Accepted |
| [0003](0003-web-ui-and-cli-no-chat.md) | Web UI and CLI; no chat integration in v1 | Accepted |
| [0004](0004-orc-runs-outside-github.md) | Orc runs outside GitHub, as a GitHub App | Accepted |
| [0005](0005-learning-and-quality-are-the-core.md) | Learning and quality are the core; the coding agent is replaceable | Accepted |
| [0006](0006-durable-runs-on-temporal.md) | Durable runs on self-hosted Temporal | Accepted |
| [0007](0007-hosting-on-eks.md) | Host Orc on EKS in our own AWS account | Superseded by 0017 |
| [0008](0008-execution-environments-agent-sandbox.md) | Execution environments on Agent Sandbox with gVisor | Superseded by 0018 |
| [0009](0009-agent-proposes-orc-acts.md) | The agent proposes; Orc acts (declared actions) | Accepted |
| [0010](0010-llm-gateway.md) | All model calls go through an Orc LLM gateway | Superseded by 0019 |
| [0011](0011-agent-loop-claude-agent-sdk.md) | Agent loop on the Claude Agent SDK, behind an interface | Accepted, verify early |
| [0012](0012-skills-in-separate-repo.md) | Skills live in a separate repo | Accepted |
| [0013](0013-lessons-design.md) | How lessons are learned, approved, and served | Accepted |
| [0014](0014-postgres-row-level-security.md) | Postgres with row-level security and pgvector | Accepted |
| [0015](0015-monorepo-and-package-naming.md) | pnpm monorepo; packages named by kind, then vendor | Accepted |
| [0016](0016-reviewability-over-pr-size-limits.md) | Reviewability instead of PR size limits | Accepted |
| [0017](0017-self-managed-kubernetes.md) | Self-managed Kubernetes on any infrastructure | Accepted |
| [0018](0018-execution-environments-self-managed.md) | Execution environments on Agent Sandbox with gVisor, on our own nodes | Accepted, verify early |
| [0019](0019-provider-neutral-llm-gateway.md) | A provider-neutral LLM gateway | Accepted, verify early |
| [0020](0020-github-issues-as-issue-tracker.md) | GitHub Issues and Jira are the v1 issue trackers | Accepted |
| [0021](0021-application-stack.md) | Application stack and dependency policy | Accepted |
| [0022](0022-pii-masking-presidio.md) | PII masking with Presidio; real values restored in responses | Accepted, verify early |
