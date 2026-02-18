## Context

PollApp API routes live under `app/api/` (polls, auth, admin). Validation uses Zod schemas in `modules/poll/poll.validators.ts` and `modules/auth/auth.validators.ts`; route handlers parse request bodies with these schemas and return JSON with a consistent `{ error: string }` shape on failure. There is no OpenAPI spec or docs UI today. **next-openapi-gen** supports Next.js App Router, Zod schemas, and JSDoc tags to generate OpenAPI 3.0 and a docs page; we will wire it so the **same Zod objects** used at runtime drive the generated spec.

## Goals / Non-Goals

**Goals:**

- Generate a valid OpenAPI 3.0 spec from the codebase with no separate hand-written spec file.
- Use existing Zod schemas (createPollSchema, voteSchema, registerSchema, loginSchema, verifySchema, resendSchema) as the source for request/response schemas in the spec—no duplicate schema definitions.
- Expose a docs UI (e.g. Scalar) at a stable URL (e.g. `/api-docs`) for browsing and testing endpoints.
- Document all public-facing API routes (polls CRUD/vote/results/close, auth register/login/verify/resend, admin polls list) with descriptions, path/query/body params, and response codes.
- Provide a single CLI command (e.g. `pnpm openapi:generate`) and document it in README for local and CI.

**Non-Goals:**

- Changing API contract or handler behavior; this is documentation and tooling only.
- Documenting the NextAuth catch-all route (`auth/[...nextauth]`); it SHALL be excluded from the generated spec.
- Supporting non-Zod schema sources in this change (TypeScript-only or custom YAML); Zod-first.

## Decisions

**1. Use next-openapi-gen with Zod as the only schema type**

- **Choice:** Configure `schemaType: "zod"` and point the tool at the directories (or files) where our Zod schemas live so it can resolve `@body`, `@response`, etc. to those schemas.
- **Rationale:** We already validate with Zod; reusing it for OpenAPI keeps one source of truth and avoids drift. next-openapi-gen supports Zod and JSDoc on App Router routes.
- **Alternative:** Hand-maintained OpenAPI YAML—rejected due to duplication and drift risk.

**2. Keep Zod schemas in existing modules; reference them from route JSDoc**

- **Choice:** Do not move or duplicate schemas. In each route file, import the existing validator (e.g. `createPollSchema`) and reference it in JSDoc (e.g. `@body createPollSchema`, `@response 201:PollResponse`). Schema discovery may require configuring `schemaDir` (or equivalent) to include `modules/poll` and `modules/auth` so the generator can resolve named exports.
- **Rationale:** Validators stay the single source of truth; route handlers already import them for `.parse()`. JSDoc only adds references.
- **Alternative:** Define schemas in a dedicated `schemas/` folder used only for OpenAPI—rejected to avoid duplication.

**3. Config file and output location**

- **Choice:** Use the tool’s default config name (e.g. `next.openapi.json`) in project root. Set `apiDir` to `app/api`, `routerType` to `app`, and `outputDir` to `./public` (or similar) so the generated spec is served statically. Docs URL set via `docsUrl` (e.g. `/api-docs`).
- **Rationale:** Aligns with next-openapi-gen conventions; `public/` is a natural place for a static OpenAPI file in Next.js.
- **Alternative:** Output to a different directory or embed spec in the docs page—follow tool defaults unless we hit a concrete need.

**4. Docs UI: Scalar (or tool default)**

- **Choice:** Use the default UI provided by the init/generate flow (Scalar if that’s the default). No custom UI implementation in this change.
- **Rationale:** Reduces scope; we can switch UI later via config if needed.
- **Alternative:** Swagger UI or Redoc—supported by the tool but not required for first version.

**5. Exclude NextAuth catch-all from the spec**

- **Choice:** Add `app/api/auth/[...nextauth]/route.ts` to `ignoreRoutes` in config, or add `@ignore` in that route’s JSDoc, so it does not appear in the public API docs.
- **Rationale:** That route is framework-internal (NextAuth); documenting it adds noise and may expose internal details. Public auth surface is register, login, verify, resend.

**6. Optional: add `.describe()` to Zod fields**

- **Choice:** Optionally add `.describe()` to schema fields where it improves readability in the generated OpenAPI (e.g. "Poll question, 1–200 characters"). Not mandatory for every field.
- **Rationale:** Improves docs quality with little cost; existing validators already have some message strings we can align with.
- **Alternative:** Leave schemas as-is—acceptable if the generator produces usable schemas without it.

## Risks / Trade-offs

- **[Risk] Generator cannot resolve Zod schemas from `modules/`** → Mitigation: Configure `schemaDir` (or schema paths) to include `modules/poll` and `modules/auth`; if the tool expects a single dir, we may need to re-export schemas from a single entry (e.g. `schemas/index.ts`) or adjust path config. Verify with a minimal route first.
- **[Risk] JSDoc references (e.g. `@body createPollSchema`) not resolved** → Mitigation: Follow next-openapi-gen docs for Zod + App Router; use exact export names. If needed, define small wrapper schemas in the route file that re-export or extend the module schema.
- **[Trade-off] Spec is generated at build/code time, not runtime** → Acceptable: Regenerate on `pnpm openapi:generate` or as part of build; README and optional CI step keep it up to date.
- **[Risk] Generated spec or docs page break in a future Next.js or next-openapi-gen upgrade** → Mitigation: Pin dev dependency to a known-good version; treat OpenAPI generate as a documented dev step so failures are visible in CI if we add the step.

## Migration Plan

1. Add `next-openapi-gen` (done). Run `npx next-openapi-gen init` (or equivalent) to create config and optional docs page scaffold.
2. Adjust config: `apiDir`, `routerType`, `schemaType: "zod"`, `schemaDir` (or schema paths) to include validator modules, `ignoreRoutes` for `auth/[...nextauth]`, `docsUrl`, `outputDir`.
3. Add JSDoc to each public route (polls, auth register/login/verify/resend, admin polls) referencing existing Zod schemas; run generate and fix any resolution errors.
4. Add `openapi:generate` (or similar) script to `package.json` and a short "API documentation" section in README.
5. Optionally: add `.describe()` to Zod fields and regenerate. No rollback needed—purely additive; existing API behavior unchanged.

## Open Questions

- Exact config keys and paths for next-openapi-gen (e.g. single `schemaDir` vs multiple paths)—to be confirmed during implementation against the tool’s current API.
- Whether response schemas for success (e.g. 201 with created poll) should be formalized as named Zod schemas in modules for reuse in JSDoc, or inlined in route files; decision can be made when adding `@response` tags.
