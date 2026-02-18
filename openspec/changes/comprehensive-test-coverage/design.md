## Context

PollApp is a Next.js App Router app with poll and auth modules (`modules/poll`, `modules/auth`), Zod validators, API routes, and React components. There are no automated tests. The product behaviour is already specified in OpenSpec (public-voting and poll-management) with WHEN/THEN scenarios. We need a unit-testing layer for logic and validation and an E2E layer that reuses those scenarios via Gherkin and Playwright.

## Goals / Non-Goals

**Goals:**

- Unit tests for poll and auth services, Zod validators, and key utilities; runnable via a single command (e.g. `pnpm test`).
- E2E tests implemented with Playwright and Cucumber (Gherkin); feature files that mirror the public-voting and poll-management spec scenarios; step definitions implemented with Playwright; runnable via a single command (e.g. `pnpm test:e2e`).
- Test layout and scripts documented so developers can run and extend tests without ambiguity.
- Optional CI integration (e.g. run unit tests on every push; run E2E on PR or scheduled).

**Non-Goals:**

- Changing application code or API contracts for the sake of testability (use mocks/adapters where needed).
- Full coverage of every component or route; focus on critical paths and business logic first.
- Performance or load testing in this change.

## Decisions

**1. Unit test runner: Vitest**

- **Choice:** Use Vitest for unit (and optional component) tests.
- **Rationale:** Vitest is fast, has good TypeScript and ESM support, Jest-compatible API, and fits modern Next.js/React projects. No Jest-specific config needed for Next.
- **Alternative:** Jest — more ecosystem weight and sometimes more config for TS/ESM in Next.js; rejected in favour of Vitest.

**2. Unit test layout: colocated and/or `__tests__`**

- **Choice:** Place unit tests either next to source (e.g. `poll.service.test.ts` beside `poll.service.ts`) or in a `__tests__` directory under each module (e.g. `modules/poll/__tests__/poll.service.test.ts`). Prefer one consistent pattern per repo.
- **Rationale:** Colocated or module-local tests keep tests close to the code they cover and simplify imports. Avoid a single top-level `tests/` that duplicates the full source tree.
- **Alternative:** Single flat `tests/` — acceptable but can become deep; allow if the team prefers.

**3. E2E: Playwright + Cucumber (Gherkin)**

- **Choice:** Use Playwright for browser automation and Cucumber (e.g. `@playwright/test` with `@cucumber/cucumber` or a Playwright–Cucumber integration) so that feature files are written in Gherkin and step definitions call Playwright APIs.
- **Rationale:** Spec scenarios are already in WHEN/THEN form; Gherkin feature files can mirror them and stay traceable. Playwright is the standard for Next.js E2E and supports multiple browsers and CI.
- **Alternative:** Playwright alone with plain test files — loses the direct mapping to spec language; rejected for this change in favour of Cucumber for scenario alignment.

**4. E2E feature file structure**

- **Choice:** Organise feature files by capability, e.g. `e2e/features/public-voting.feature` and `e2e/features/poll-management.feature`. Scenarios and step names SHALL map to the requirement/scenario names or text in the OpenSpec public-voting and poll-management specs.
- **Rationale:** One feature file per capability keeps scenarios grouped and makes it obvious which spec they implement. Step definitions live in a `e2e/steps` (or similar) directory and use a shared Playwright fixture (e.g. page, baseURL).

**5. E2E execution model**

- **Choice:** E2E tests run against a running app (developer runs `pnpm dev` then `pnpm test:e2e`, or CI starts the app and runs E2E). Base URL configurable via env (e.g. `BASE_URL=http://localhost:3000`).
- **Rationale:** Next.js apps are best tested E2E against a real server. Avoid in-process server unless the team explicitly wants it; out-of-process is simpler and more realistic.
- **Alternative:** Start server from within the test run — possible with Playwright’s webServer config; can be added later if CI needs it.

**6. Services and DB in unit tests**

- **Choice:** Unit tests for services (e.g. poll.service, auth.service) SHALL use mocks or in-memory/test doubles for the repository or Prisma client so tests do not require a real database. Validator tests are pure (no mocks).
- **Rationale:** Fast, deterministic unit tests; no DB setup in CI for unit runs. E2E can use a real or seeded test DB if desired.
- **Alternative:** Real DB in unit tests — rejected for speed and CI simplicity.

## Risks / Trade-offs

- **[Risk] Cucumber–Playwright integration is brittle or heavy** → Mitigation: Choose a well-maintained adapter (e.g. cucumber-playwright or official patterns). If maintenance is an issue, fall back to Playwright-only tests that still reference scenario names in descriptions.
- **[Risk] E2E flakiness (timing, cookies)** → Mitigation: Use Playwright’s auto-waiting and explicit assertions; avoid fixed sleeps; clear or isolate cookies per scenario where needed.
- **[Risk] E2E requires auth (admin flows)** → Mitigation: Use test-only auth (e.g. seed a test admin and log in via UI or a test token) or mock auth in E2E; document in README.
- **[Trade-off] Unit tests mock Prisma/repos** → Tests may not catch DB-specific bugs; E2E and integration tests complement this. Acceptable for this change.

## Migration Plan

1. Add Vitest (and any React testing deps if doing component tests); add `pnpm test` script; write a minimal unit test to verify setup.
2. Add unit tests for validators and services in the chosen layout; run and fix until green.
3. Add Playwright and Cucumber deps; add `e2e/` (or `tests/e2e/`) with `features/` and `steps/`; add `pnpm test:e2e` script; implement one feature file (e2e) and steps to verify setup.
4. Implement remaining E2E scenarios from public-voting and poll-management specs; run E2E against local app.
5. Document in README; add CI job(s) if desired. No rollback needed — tests are additive; disabling scripts or removing test deps reverts behaviour.

## Open Questions

- Exact Cucumber–Playwright package (e.g. `cucumber-playwright`, or separate `@cucumber/cucumber` + custom Playwright world); to be fixed during implementation.
- Whether admin E2E flows use a seeded test user or a dedicated test OTP path; can be decided when implementing poll-management steps.
