## Why

The PollApp has no automated tests today. Adding comprehensive test coverage (unit tests plus end-to-end tests driven by the existing spec scenarios) will catch regressions, document behavior, and give confidence when changing code. Reusing the WHEN/THEN scenarios from the public-voting and poll-management specs in Cucumber feature files keeps tests aligned with the product requirements.

## What Changes

- Introduce a **unit-testing** layer (e.g. Jest or Vitest) for business logic and validation: poll and auth services, Zod validators, and selected utilities. Optionally add component tests for critical UI (e.g. vote form, create poll form).
- Introduce **Playwright** for browser automation and **Cucumber** (Gherkin) for scenario-based E2E tests. Feature files SHALL mirror the scenarios already defined in `openspec/changes/poll-app/specs/public-voting/spec.md` and `openspec/changes/poll-app/specs/poll-management/spec.md` (guest poll page, voting, cookie behaviour, closed poll; admin create poll, validation, dashboard, shareable link, close poll, poll detail).
- Add **step definitions** that drive Playwright (navigate, fill form, click, assert text and cookies). Scenarios remain readable and traceable to the spec requirements.
- Add **test scripts** to `package.json` (e.g. `test`, `test:e2e`) and document how to run unit and E2E tests in the README. Optionally wire E2E or unit tests into CI (e.g. GitHub Actions).
- No change to application behaviour or APIs; this is additive test infrastructure and test code only.

## Capabilities

### New Capabilities

- **unit-testing**: Unit tests for poll and auth services, Zod validators in `modules/poll` and `modules/auth`, and key utilities. Optionally React component tests for vote form and create poll form. Test runner (Jest or Vitest), assertions, and coverage reporting.
- **e2e-testing**: Playwright + Cucumber (Gherkin) E2E tests. Feature files for public voting and poll management that map to the existing spec scenarios; Playwright step definitions; config for base URL and browser; scripts to run E2E against a running app or with a test server.

### Modified Capabilities

- None. Public-voting and poll-management specs are not changed; their scenarios are reused as the source for E2E feature files.

## Impact

- **Dependencies**: New dev dependencies (test runner, Playwright, Cucumber/playwright-cucumber or similar, and any assertion/coverage libs).
- **Repository layout**: New directories for unit tests (e.g. `__tests__/`, `*.test.ts`, or colocated tests) and for E2E (e.g. `e2e/` or `tests/e2e/` with `features/` and `steps/`).
- **Scripts and CI**: New npm/pnpm scripts; optional CI job to run unit and E2E tests on push or PR.
- **Documentation**: README section on how to run unit and E2E tests and any environment (e.g. test DB or mock) required for E2E.
