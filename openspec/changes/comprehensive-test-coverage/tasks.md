## 1. Unit test setup

- [x] 1.1 Add Vitest and related dev dependencies (e.g. vitest, @vitejs/plugin-react if component tests later); add `vitest.config.ts` (or equivalent) with TypeScript and path alias for `@/`
- [x] 1.2 Add `test` script to `package.json` (e.g. `vitest run`) and optionally `test:coverage`; verify with a minimal passing test

## 2. Unit tests — validators

- [x] 2.1 Add unit tests for `modules/poll/poll.validators.ts`: createPollSchema (valid, empty question, too few/too many options, option length); voteSchema (valid, empty optionId)
- [x] 2.2 Add unit tests for `modules/auth/auth.validators.ts`: registerSchema, loginSchema, verifySchema, resendSchema (valid and invalid email/code/fields)

## 3. Unit tests — services

- [x] 3.1 Add repository or Prisma mock for poll module; add unit tests for poll service (createPoll, getPoll, getResults, castVote, closePoll) covering success and error paths (poll not found, closed poll)
- [x] 3.2 Add repository and email mock for auth module; add unit tests for auth service (register, login, verifyOtp, resendOtp) covering success and error paths (duplicate email, invalid/expired OTP)

## 4. E2E setup

- [x] 4.1 Add Playwright and Cucumber-related dev dependencies (e.g. @playwright/test, @cucumber/cucumber and a Playwright–Cucumber integration or cucumber-playwright); add Playwright config with baseURL from env (e.g. BASE_URL)
- [x] 4.2 Create E2E directory structure (e.g. `e2e/features/`, `e2e/steps/` or equivalent); add `test:e2e` script to `package.json`; verify E2E run with one minimal feature/scenario

## 5. E2E feature files and step definitions

- [x] 5.1 Write `e2e/features/public-voting.feature` with scenarios mirroring the public-voting spec (guest visits valid/invalid poll, successful vote, vote without selection, vote on closed poll, return visit after voting, first visit, option selection feedback, mobile layout)
- [x] 5.2 Implement Playwright step definitions for public-voting steps (navigate to poll, fill/select option, click Vote, assert form vs results, assert cookie, assert "Poll not found" and "This poll is closed")
- [x] 5.3 Write `e2e/features/poll-management.feature` with scenarios mirroring the poll-management spec (create poll success/validation, add/remove options, dashboard with/without polls, copy link, close poll, view closed poll as guest, admin poll detail)
- [x] 5.4 Implement Playwright step definitions for poll-management steps (admin auth if needed, create poll form, dashboard assertions, copy link, close poll, poll detail); document or seed test admin for E2E

## 6. Documentation and optional CI

- [x] 6.1 Document in README how to run unit tests (`pnpm test`) and E2E tests (start app, set BASE_URL, `pnpm test:e2e`); note any prerequisites for E2E (e.g. test DB or user)
- [x] 6.2 Optionally add CI workflow (e.g. GitHub Actions) to run unit tests on push/PR and E2E on PR or schedule
