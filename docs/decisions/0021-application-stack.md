# 0021 — Application stack and dependency policy

**Status:** Accepted · **Date:** 2026-10-02

## Context
Orc will be built largely by AI agents. Without a fixed stack, each change risks pulling in a new library for a solved problem. The choices must fit the architecture: one API that the web UI and CLI only consume (FR-54, C-5), row-level security on every database transaction (0014), and Zod-shaped contracts shared across packages.

## Decision
The approved packages are listed in [`CLAUDE.md`](../../CLAUDE.md). Adding a package not on that list needs a person's approval and an update to the list. The main choices:

- **API:** NestJS, with Zod schemas through `nestjs-zod` for validation and the OpenAPI spec. One validation system; no `class-validator`.
- **Database:** Drizzle ORM and drizzle-kit migrations on `pg`. Every query runs in a transaction that sets the current organization for RLS (0014). pgvector through Drizzle's vector column.
- **API client:** `@hey-api/openapi-ts` generates `packages/api-client`, including TanStack Query hooks and Zod schemas.
- **Web:** TanStack Start (React, Vite) with TanStack Router, TanStack Query, TanStack Table, React Hook Form with Zod, shadcn/ui, Tailwind CSS, and Tabler Icons.
- **CLI:** commander, using the generated API client.
- **Tooling:** Biome for lint and format, Vitest and Playwright for tests, tsdown for building libraries, `pnpm -r` for tasks.

TanStack Start renders and routes only. It has no server functions, no server-side data access, and no credentials; all data comes through the generated API client, so the web UI can do nothing the API doesn't expose (FR-54).

## Alternatives considered
- **TypeORM.** Rejected: its entity and repository model makes per-transaction RLS settings awkward.
- **Prisma.** Rejected: RLS needs per-transaction client extensions, and pgvector needs raw SQL.
- **TanStack Router on a plain Vite SPA.** Simpler and has no server to misuse. Start was chosen instead, with the rule above.
- **Next.js or Remix.** Rejected: server-side data paths would bypass the API.
- **ESLint and Prettier.** Rejected for Biome: one tool, less configuration.

## Consequences
- Agents follow the list in `CLAUDE.md` and ask before adding a package.
- shadcn/ui defaults to Lucide icons; components copied in are switched to Tabler.
- Start's server runtime is a deployment target with no secrets; review must reject any server function or loader that reaches past the API client.
