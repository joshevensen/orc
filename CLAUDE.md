# Orc

Orc hands well-defined engineering work to AI while people stay in control. Read before building:

- [docs/requirements.md](docs/requirements.md): what Orc must do (FR-, Q-, C- IDs)
- [docs/architecture.md](docs/architecture.md): how it's built
- [docs/decisions/](docs/decisions/README.md): why (ADRs)

## Workspace

pnpm 11 workspace, Node 24+, TypeScript 6, ESM. Layout and package naming follow ADR 0015 and [architecture §3](docs/architecture.md#3-repository-layout): `apps/*` (api, worker, gateway, sandbox-agent, web, cli) and `packages/*` (contracts, db, integrations named kind-then-vendor, api-client). Local Postgres, Temporal, and Presidio run from `docker-compose.yml` (`pnpm services:up`); copy `.env.example` to `.env`.

- Apps code against `packages/contracts`. Only an app's composition root (its integrations module) imports integration packages and binds them to contracts with Nest DI.
- Packages are framework-free TypeScript: no Nest decorators, no enums or other non-erasable syntax (`erasableSyntaxOnly`). Nest code lives only in apps.
- `web` and `cli` use only `packages/api-client`. They never import from `api`, `worker`, or an integration package.
- Workspace packages are named `@orc/<name>`, are `private`, and are never published. Only the CLI will be published, to npmjs.com under a name chosen at its first release.
- Internal packages export TypeScript source (`"exports"` points at `src/index.ts`) and have no build step. Node runs them with type stripping; Vite and tsdown bundle them. `tsdown` builds only the CLI and the sandbox agent.
- Import extensions: in packages and Vite/tsdown apps, relative imports end in `.ts`; in Nest apps (api, worker, gateway, compiled by SWC), they end in `.js`.
- NestJS stays on 11 until `nestjs-zod` supports 12. TypeScript stays on 6 until the tooling supports the native TypeScript 7 compiler.
- Dependencies are pinned to exact versions (`save-exact` in `.npmrc`). Updates come through grouped Dependabot PRs.

## Dependencies

Use only the packages listed below (ADR 0021). **Adding a package not on this list needs a person's approval first**: stop and ask, giving the package, why, and what on the list falls short. When approved, add it here in the same change.

Prefer the platform (Node and browser built-ins, `fetch`, `Intl`, `crypto`) over a package.

### Approved

| Area | Packages |
|---|---|
| Language and validation | `typescript`, `zod` |
| API | `@nestjs/*` on the Fastify platform (`@nestjs/platform-fastify`), `@fastify/cookie`, `@fastify/static` (Swagger UI), `nestjs-zod`, `@nestjs/swagger`, `reflect-metadata`, `rxjs` |
| Database | `drizzle-orm`, `drizzle-kit`, `pg` |
| Durable runs | `@temporalio/client`, `@temporalio/worker`, `@temporalio/workflow`, `@temporalio/activity`, `@temporalio/testing` |
| API client | `@hey-api/openapi-ts` (generates `packages/api-client`) |
| Web | `vite`, `@vitejs/plugin-react`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/react-query`, `@tanstack/react-table`, `recharts`, `react-markdown`, `remark-gfm`, `react`, `react-dom`, `react-hook-form`, `@hookform/resolvers`, shadcn/ui (copied components and their Radix dependencies), `tailwindcss`, `@tailwindcss/vite`, `@tabler/icons-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` (the shadcn CLI runs through `pnpm dlx shadcn`, not installed) |
| CLI | `commander` |
| Markdown (server) | `unified`, `remark-parse`, `remark-gfm`, `@types/mdast` (Orc's own Markdown ↔ Jira ADF converter lives in `issue-tracker-jira`) |
| Object storage | `@aws-sdk/client-s3` (S3-compatible: DigitalOcean Spaces, S3, MinIO), only in `object-store-s3` |
| Code host and issue trackers | `octokit`, `jira.js` |
| LLM providers and agent | `@anthropic-ai/sdk`, `@anthropic-ai/bedrock-sdk`, `@anthropic-ai/claude-agent-sdk`, `openai` (DigitalOcean only) |
| Sandbox | `@kubernetes/client-node` |
| Auth | `openid-client` |
| MCP | `@modelcontextprotocol/sdk` |
| Email | `nodemailer` |
| Logging and tracing | `pino`, `pino-http`, `nestjs-pino`, `@opentelemetry/*` |
| Types | `@types/*` for any approved package, and `@types/node` |
| Tooling | `@biomejs/biome`, `vitest`, `@playwright/test`, `tsdown`, `@swc/core`, `@swc/cli` (Nest builds), `testcontainers`, `@testcontainers/postgresql` |

Not npm packages, but part of the stack: **gitleaks** (secret scanning in the Action service, FR-85) and the **OSV API** via `fetch` (dependency vulnerability checks, FR-84).

### Not allowed

| Don't use | Use instead |
|---|---|
| `class-validator`, `class-transformer`, `joi`, `yup` | `zod` via `nestjs-zod` |
| `typeorm`, `prisma`, `sequelize`, `knex` | `drizzle-orm` |
| `next`, `remix`, `@remix-run/*`, `@tanstack/react-start` | `@tanstack/react-router` on Vite |
| `axios`, `node-fetch`, `got` | `fetch` |
| `lodash`, `underscore`, `ramda` | built-ins |
| `moment`, `dayjs` | `Intl`, `Date`; ask if real date math is needed |
| `redux`, `zustand`, `mobx` | TanStack Query for server state, React state for the rest |
| `eslint`, `prettier` | `@biomejs/biome` |
| `jest`, `mocha` | `vitest` |
| `lucide-react` | `@tabler/icons-react` |
| `bullmq`, `agenda` | Temporal |
| `@aws-sdk/*` other than `client-s3` | `@anthropic-ai/bedrock-sdk` for Bedrock; ask for anything else |
| `express`, `@nestjs/platform-express` | `@nestjs/platform-fastify` |
| Markdown ↔ ADF libraries | Orc's own converter in `issue-tracker-jira` |

## Rules that code review enforces

- **Web has no backend.** The web app is a static Vite SPA. All data comes through the generated API client; no secrets in the web app (FR-54, ADR 0021).
- **Every database access is org-scoped.** Queries run in a transaction that sets the current organization for row-level security (ADR 0014). Tests cover cross-organization access.
- **Workflows are deterministic.** Anything with side effects runs as a Temporal activity (ADR 0006).
- **Credentials never enter a sandbox.** Model calls go through the LLM gateway; external changes go through the Action service (ADRs 0009, 0019).
- **Zod is the source of truth** for API shapes, contracts, and action requests; derive TypeScript types with `z.infer`.
