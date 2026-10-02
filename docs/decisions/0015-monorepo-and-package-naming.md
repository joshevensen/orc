# 0015 — pnpm monorepo; packages named by kind, then vendor

**Status:** Accepted (package list amended by 0019, 0020; `cli` removed by 0025) · **Date:** 2026-10-01

## Context
Orc has several apps (API, worker, web UI, CLI) sharing contracts and integrations. The stack is TypeScript, NestJS, and React.

## Decision
One pnpm monorepo:

```
apps/
  api/      NestJS control plane (OpenAPI via @nestjs/swagger)
  worker/   Temporal workers
  web/      React (Vite), using the generated API client
  cli/      thin client of the API
packages/
  contracts/            integration interfaces and shared types only
  issue-tracker-jira/
  code-host-github/
  models-bedrock/
  notifications-email/
  sandbox-k8s/
  api-client/           generated from the OpenAPI spec
```

Integration packages are named **kind, then vendor**, one package per implementation. `api` and `worker` depend on `contracts`; dependency injection selects the implementation.

## Alternatives considered
- **Generic packages per kind (e.g. `integration-models`)** holding every vendor. Rejected: adding a vendor means editing a shared package.
- **Vendor-only names (e.g. `integration-jira`).** Workable, but kind-first names group and sort together.

## Consequences
- Adding an integration is adding a package (Q-ORG-5).
- The web UI and CLI can only do what the API exposes (FR-54).
- The repo itself is a pnpm workspace, so Orc can work on its own code (FR-31).
