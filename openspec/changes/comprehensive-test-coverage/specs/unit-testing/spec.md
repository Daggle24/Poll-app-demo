## ADDED Requirements

### Requirement: Unit tests for poll validators

The system SHALL provide unit tests for all exported Zod schemas in `modules/poll/poll.validators.ts`. Tests SHALL assert valid inputs pass and invalid inputs (wrong types, empty strings, out-of-range lengths, wrong option count) produce the expected validation errors.

#### Scenario: createPollSchema valid input

- **WHEN** the test parses a valid object with a non-empty question (1–200 chars) and 2–5 non-empty option strings (1–100 chars each)
- **THEN** parsing SHALL succeed and the result SHALL match the input shape

#### Scenario: createPollSchema invalid input

- **WHEN** the test parses an object with empty question, or fewer than 2 options, or more than 5 options, or an option longer than 100 characters
- **THEN** parsing SHALL fail and the error SHALL indicate the failing constraint (e.g. min/max options, length)

#### Scenario: voteSchema valid and invalid

- **WHEN** the test parses a valid object with a non-empty optionId
- **THEN** parsing SHALL succeed

- **WHEN** the test parses an object with missing or empty optionId
- **THEN** parsing SHALL fail

### Requirement: Unit tests for auth validators

The system SHALL provide unit tests for all exported Zod schemas in `modules/auth/auth.validators.ts` (register, login, verify, resend). Tests SHALL assert valid inputs pass and invalid inputs (invalid email, short code, missing fields) produce the expected validation errors.

#### Scenario: registerSchema and loginSchema

- **WHEN** the test parses a valid email (and name for register)
- **THEN** parsing SHALL succeed

- **WHEN** the test parses an invalid email or missing required field
- **THEN** parsing SHALL fail with an appropriate error

#### Scenario: verifySchema and resendSchema

- **WHEN** the test parses a valid email and 6-character code (verify) or valid email (resend)
- **THEN** parsing SHALL succeed

- **WHEN** the test parses a code with length other than 6 (verify) or invalid email
- **THEN** parsing SHALL fail

### Requirement: Unit tests for poll service

The system SHALL provide unit tests for the poll service (e.g. `modules/poll/poll.service.ts`) that cover createPoll, getPoll, getResults, castVote, and closePoll. The tests SHALL use a mocked or in-memory repository (or Prisma mock) so that no real database is required. Tests SHALL assert success and error paths (e.g. poll not found, closed poll, validation failures).

#### Scenario: Create poll with valid input

- **WHEN** the test calls createPoll with a valid question and 2–5 options and the mock repository accepts the write
- **THEN** the service SHALL return the created poll shape (id, question, options, isActive)

#### Scenario: Cast vote on active poll

- **WHEN** the test calls castVote with a valid pollId and optionId and the mock indicates an active poll
- **THEN** the service SHALL return success (e.g. vote recorded) and no error

#### Scenario: Cast vote on closed poll

- **WHEN** the test calls castVote and the mock indicates the poll is closed
- **THEN** the service SHALL return an error (e.g. "This poll is closed") and SHALL NOT record a vote

### Requirement: Unit tests for auth service

The system SHALL provide unit tests for the auth service (e.g. `modules/auth/auth.service.ts`) that cover register, login, verifyOtp, and resendOtp. The tests SHALL use mocked repository and email (or in-memory doubles) so that no real database or email is sent. Tests SHALL assert success and error paths (e.g. duplicate email, invalid OTP, expired OTP).

#### Scenario: Register and verify flow

- **WHEN** the test calls register with a new email and name and the mock accepts the admin
- **THEN** the service SHALL indicate success (e.g. OTP sent or stored) and the mock SHALL have received the expected data

#### Scenario: Verify with valid OTP

- **WHEN** the test calls verifyOtp with an email and code that the mock has stored as valid
- **THEN** the service SHALL return success (e.g. adminId, email) and no error

#### Scenario: Verify with invalid or expired OTP

- **WHEN** the test calls verifyOtp with a wrong code or expired OTP
- **THEN** the service SHALL return an error and SHALL NOT return admin credentials

### Requirement: Unit test runner and scripts

The system SHALL use a single unit test runner (e.g. Vitest) and SHALL provide an npm/pnpm script (e.g. `test`) that runs all unit tests. The runner SHALL support TypeScript and SHALL be configurable (e.g. via `vitest.config.ts`). Optionally, the system SHALL collect and report coverage for the modules under test.

#### Scenario: Run all unit tests

- **WHEN** a developer runs the configured test command (e.g. `pnpm test`)
- **THEN** all unit tests in the project SHALL run and the exit code SHALL be 0 if all pass and non-zero if any fail

#### Scenario: Coverage report (optional)

- **WHEN** the test command is run with coverage enabled (e.g. `pnpm test:coverage`)
- **THEN** the system SHALL output a coverage report for the modules under test (e.g. modules/poll, modules/auth)

### Requirement: Optional component tests

The system MAY provide component tests for critical UI components (e.g. vote form, create poll form) using a React testing approach (e.g. React Testing Library with Vitest). These tests SHALL render the component with minimal props/mocks and SHALL assert key behaviour (e.g. validation message when submitting empty, option selection). This requirement is optional and SHALL NOT block the completion of the unit-testing capability.

#### Scenario: Create poll form validation (if implemented)

- **WHEN** the test renders the create poll form and submits with an empty question
- **THEN** the component SHALL display a validation error message and SHALL NOT call the submit handler with data
