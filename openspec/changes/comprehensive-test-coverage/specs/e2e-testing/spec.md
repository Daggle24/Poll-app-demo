## ADDED Requirements

### Requirement: E2E tests driven by Gherkin feature files

The system SHALL provide end-to-end tests implemented with Playwright and Cucumber (Gherkin). Feature files SHALL be written in Gherkin (Given/When/Then) and SHALL mirror the scenarios defined in the OpenSpec public-voting and poll-management specs. Step definitions SHALL use Playwright to perform browser actions and assertions.

#### Scenario: Feature file for public voting

- **WHEN** a feature file exists for public voting (e.g. `e2e/features/public-voting.feature` or equivalent)
- **THEN** it SHALL contain scenarios that correspond to the requirements and scenarios in `openspec/changes/poll-app/specs/public-voting/spec.md` (e.g. guest visits valid poll link, guest visits invalid poll link, successful vote, vote without selecting option, vote on closed poll, return visit after voting, first visit to new poll, option selection visual feedback, mobile layout)

#### Scenario: Feature file for poll management

- **WHEN** a feature file exists for poll management (e.g. `e2e/features/poll-management.feature` or equivalent)
- **THEN** it SHALL contain scenarios that correspond to the requirements and scenarios in `openspec/changes/poll-app/specs/poll-management/spec.md` (e.g. successful poll creation, too few/too many options, empty question, empty option text, add/remove option, dashboard with polls, dashboard with no polls, copy shareable link, close poll, view closed poll as guest, admin poll detail view)

### Requirement: Playwright step definitions

The system SHALL provide step definitions that map Gherkin steps to Playwright actions and assertions. Steps SHALL include navigation to URLs, filling forms, clicking buttons, reading page text, and asserting cookies (e.g. `voted_{pollId}`). Step definitions SHALL be implemented in TypeScript or JavaScript and SHALL use a shared Playwright fixture (e.g. page, baseURL).

#### Scenario: Step for visiting poll page

- **WHEN** a step is defined for a phrase such as "an anonymous guest navigates to /poll/{id}" or "a guest visits the poll"
- **THEN** the step SHALL use Playwright to navigate to the configured base URL plus the poll path and SHALL wait for the page to load

#### Scenario: Step for asserting vote form or results

- **WHEN** a step is defined for asserting that the vote form is displayed or that the results view is displayed
- **THEN** the step SHALL use Playwright to assert the presence (or absence) of expected elements or text (e.g. "Vote" button, "Poll not found", results content)

#### Scenario: Step for asserting cookie

- **WHEN** a step is defined for asserting that the guest has already voted (e.g. return visit after voting)
- **THEN** the step SHALL use Playwright to read the browser context cookies and SHALL assert that `voted_{pollId}` is set where applicable

### Requirement: E2E test configuration

The system SHALL provide a configuration file for the E2E test run (e.g. Playwright config) that specifies the base URL (configurable via environment variable, e.g. `BASE_URL`), browser(s) to run (e.g. chromium for CI), and the location of feature files and step definitions. The configuration SHALL allow running E2E tests against a running instance of the application (e.g. `http://localhost:3000`).

#### Scenario: Run E2E tests

- **WHEN** a developer or CI runs the configured E2E command (e.g. `pnpm test:e2e`) with the application running at the configured base URL
- **THEN** all E2E scenarios SHALL run and the exit code SHALL be 0 if all pass and non-zero if any fail

#### Scenario: Base URL configuration

- **WHEN** the base URL is set via environment variable (e.g. `BASE_URL=http://localhost:3000`)
- **THEN** all step definitions that navigate or assert URLs SHALL use this base URL

### Requirement: Traceability to OpenSpec scenarios

Each E2E scenario in the feature files SHALL be traceable to a requirement or scenario in the OpenSpec public-voting or poll-management specs. Scenario names or descriptions in the feature file SHALL reference or mirror the WHEN/THEN wording of the spec so that a reader can map the test to the requirement.

#### Scenario: Public voting scenario naming

- **WHEN** a reviewer inspects the public-voting feature file
- **THEN** each scenario SHALL be identifiable as corresponding to one or more of: guest visits valid poll link, guest visits invalid poll link, successful vote, vote without selecting option, vote on closed poll, return visit after voting, first visit to new poll, option selection visual feedback, mobile layout

#### Scenario: Poll management scenario naming

- **WHEN** a reviewer inspects the poll-management feature file
- **THEN** each scenario SHALL be identifiable as corresponding to one or more of: successful poll creation, too few/too many options, empty question/option validation, add/remove option, dashboard with polls, dashboard with no polls, copy shareable link, close poll, view closed poll as guest, admin poll detail view

### Requirement: E2E test script and documentation

The system SHALL provide an npm/pnpm script (e.g. `test:e2e`) that runs the E2E test suite. The README or test documentation SHALL explain how to run E2E tests (start the app, set BASE_URL if needed, run the script) and SHALL note any prerequisites (e.g. database seeded for admin flows, or test user).

#### Scenario: Developer runs E2E from README

- **WHEN** a developer follows the README instructions for running E2E tests
- **THEN** they SHALL be able to start the application and run the E2E script successfully (assuming the app and any required env are available)
