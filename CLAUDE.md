# Orc

Orc hands well-defined engineering work to AI while people stay in control. Read before building:

- [docs/requirements.md](docs/requirements.md): what Orc must do (FR-, Q-, C- IDs)
- [docs/architecture.md](docs/architecture.md): how it's built
- [docs/decisions/](docs/decisions/README.md): why (ADRs)

## Workspace

pnpm 11 workspace, Node 24+, TypeScript, ESM. Layout and package naming follow ADR 0015: `apps/*` (api, worker, web, cli) and `packages/*` (contracts, integrations named kind-then-vendor, api-client).

- `api` and `worker` depend on `packages/contracts`, never on an integration package directly; Nest DI selects the implementation.
- `web` and `cli` use only `packages/api-client`. They never import from `api`, `worker`, or an integration package.

## Dependencies

Use only the packages listed below (ADR 0021). **Adding a package not on this list needs a person's approval first**: stop and ask, giving the package, why, and what on the list falls short. When approved, add it here in the same change.

Prefer the platform (Node and browser built-ins, `fetch`, `Intl`, `crypto`) over a package.

### Approved

| Area | Packages |
|---|---|
| Language and validation | `typescript`, `zod` |
| API | `@nestjs/*`, `nestjs-zod`, `@nestjs/swagger` |
| Database | `drizzle-orm`, `drizzle-kit`, `pg` |
| Durable runs | `@temporalio/client`, `@temporalio/worker`, `@temporalio/workflow`, `@temporalio/activity`, `@temporalio/testing` |
| API client | `@hey-api/openapi-ts` (generates `packages/api-client`) |
| Web | `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/react-table`, `react`, `react-dom`, `react-hook-form`, `@hookform/resolvers`, shadcn/ui (copied components and their Radix dependencies), `tailwindcss`, `@tabler/icons-react` |
| CLI | `commander` |
| Code host and issue trackers | `octokit`, `jira.js` |
| LLM providers and agent | `@anthropic-ai/sdk`, `@anthropic-ai/bedrock-sdk`, `@anthropic-ai/claude-agent-sdk`, `openai` (DigitalOcean only) |
| Sandbox | `@kubernetes/client-node` |
| Auth | `openid-client` |
| MCP | `@modelcontextprotocol/sdk` |
| Email | `nodemailer` |
| Logging and tracing | `pino`, `nestjs-pino`, `@opentelemetry/*` |
| Tooling | `@biomejs/biome`, `vitest`, `@playwright/test`, `tsdown` |

### Not allowed

| Don't use | Use instead |
|---|---|
| `class-validator`, `class-transformer`, `joi`, `yup` | `zod` via `nestjs-zod` |
| `typeorm`, `prisma`, `sequelize`, `knex` | `drizzle-orm` |
| `next`, `remix`, `@remix-run/*` | `@tanstack/react-start` |
| `axios`, `node-fetch`, `got` | `fetch` |
| `lodash`, `underscore`, `ramda` | built-ins |
| `moment`, `dayjs` | `Intl`, `Date`; ask if real date math is needed |
| `redux`, `zustand`, `mobx` | TanStack Query for server state, React state for the rest |
| `eslint`, `prettier` | `@biomejs/biome` |
| `jest`, `mocha` | `vitest` |
| `lucide-react` | `@tabler/icons-react` |
| `bullmq`, `agenda` | Temporal |
| `@aws-sdk/client-bedrock-runtime` | `@anthropic-ai/bedrock-sdk` |

## Rules that code review enforces

- **Web has no backend.** TanStack Start renders and routes only. No server functions, no server-side loaders that reach past the API client, no secrets in the web app (FR-54, ADR 0021).
- **Every database access is org-scoped.** Queries run in a transaction that sets the current organization for row-level security (ADR 0014). Tests cover cross-organization access.
- **Workflows are deterministic.** Anything with side effects runs as a Temporal activity (ADR 0006).
- **Credentials never enter a sandbox.** Model calls go through the LLM gateway; external changes go through the Action service (ADRs 0009, 0019).
- **Zod is the source of truth** for API shapes, contracts, and action requests; derive TypeScript types with `z.infer`.
