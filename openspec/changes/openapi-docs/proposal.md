## Why

The PollApp exposes REST APIs for polls and admin auth but has no formal API documentation. Consumers (frontend, future integrations, or third parties) have no single source of truth for request/response shapes, status codes, or validation rules. Adding OpenAPI 3.0 documentation generated from the codebase—using the **existing Zod schemas** already used for validation—gives accurate, up-to-date docs with minimal duplication and a Swagger-like UI for exploration.

## What Changes

- Add **next-openapi-gen** as a dev dependency for automatic OpenAPI 3.0 generation from Next.js App Router API routes.
- Introduce a **config file** (e.g. `next.openapi.json`) for API directory, schema type (Zod), output path, and docs URL.
- **Annotate API route handlers** with JSDoc tags (`@description`, `@body`, `@response`, `@pathParams`, etc.) that reference the **existing Zod schemas** in `modules/poll/poll.validators.ts` and `modules/auth/auth.validators.ts` (e.g. `createPollSchema`, `voteSchema`, `registerSchema`, `loginSchema`, `verifySchema`, `resendSchema`). No new schema definitions—reuse current validators so docs and runtime validation stay in sync.
- **Generate** an OpenAPI spec (e.g. `openapi.json` in `public/`) and serve a **docs UI** (e.g. Scalar at `/api-docs`) for browsing and trying endpoints.
- Add a **generate** script (e.g. `pnpm openapi:generate` or run via `npx next-openapi-gen generate`) and document the step in README for local and CI use.
- **Exclude** internal or auth-only routes from public docs if needed (e.g. `auth/[...nextauth]`) via config or `@ignore` JSDoc.

## Capabilities

### New Capabilities

- **api-documentation**: OpenAPI 3.0 documentation for the PollApp API, generated from route handlers and existing Zod schemas. Includes a docs UI at a configured path (e.g. `/api-docs`), JSDoc-driven operation descriptions, and request/response schemas derived from the same Zod objects used for validation.

### Modified Capabilities

- None. This is additive; existing specs (poll-api, admin-auth, etc.) do not change in behavior—only documentation and tooling are added.

## Impact

- **API route files** (`app/api/polls/*`, `app/api/auth/*`, `app/api/admin/*`): Add JSDoc blocks that reference existing Zod schemas and describe operations; no change to handler logic.
- **Zod validators** (`modules/poll/poll.validators.ts`, `modules/auth/auth.validators.ts`): Remain the single source of truth; optionally add `.describe()` on fields to improve OpenAPI schema readability. No breaking changes to types or validation behavior.
- **Dependencies**: New dev dependency `next-openapi-gen`; optional UI dependency (e.g. Scalar) if not bundled by the tool.
- **Config and output**: New `next.openapi.json` (or equivalent), generated `openapi.json` (or similar) in `public/` or configured output dir.
- **Docs and CI**: README updated with how to generate and view API docs; optional CI step to regenerate spec on build or in a docs job.
- **Excluded routes**: NextAuth catch-all `app/api/auth/[...nextauth]/route.ts` excluded from public API docs (config or `@ignore`).
