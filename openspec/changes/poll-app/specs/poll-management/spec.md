## ADDED Requirements

### Requirement: Create poll with question and options
The system SHALL allow an authenticated admin to create a poll by providing a question (1–200 characters) and between 2 and 5 answer options (each 1–100 characters). The poll SHALL be created with `isActive: true` by default.

> **Note**: Use the Shadcn MCP to browse and install any needed UI components (Input, Button, Card, etc.) with up-to-date documentation.

#### Scenario: Successful poll creation
- **WHEN** an admin submits a valid question with 3 options
- **THEN** the system creates the poll with all options, assigns a unique CUID, and redirects to the poll detail page

#### Scenario: Too few options
- **WHEN** an admin submits a poll with fewer than 2 options
- **THEN** the system SHALL display a validation error "Poll must have at least 2 options"

#### Scenario: Too many options
- **WHEN** an admin submits a poll with more than 5 options
- **THEN** the system SHALL display a validation error "Poll must have at most 5 options"

#### Scenario: Empty question
- **WHEN** an admin submits a poll with an empty question
- **THEN** the system SHALL display a validation error on the question field

#### Scenario: Empty option text
- **WHEN** an admin submits a poll where one or more options have empty text
- **THEN** the system SHALL display a validation error on the empty option fields

### Requirement: Dynamic option inputs on create form
The create poll form SHALL start with 2 option input fields. The admin SHALL be able to add more options (up to 5) and remove options (down to 2) dynamically.

#### Scenario: Add option
- **WHEN** an admin clicks "Add option" and there are fewer than 5 options
- **THEN** a new empty option input field SHALL appear

#### Scenario: Add option at max
- **WHEN** an admin clicks "Add option" and there are already 5 options
- **THEN** the "Add option" button SHALL be disabled or hidden

#### Scenario: Remove option
- **WHEN** an admin clicks the remove button on an option and there are more than 2 options
- **THEN** that option field SHALL be removed

#### Scenario: Remove option at minimum
- **WHEN** there are exactly 2 options
- **THEN** the remove buttons SHALL be disabled or hidden

### Requirement: Admin dashboard poll list
The admin dashboard SHALL display a list of all polls created by the authenticated admin, ordered by creation date (newest first). Each poll entry SHALL show the question, number of votes, creation date, active status, and a shareable link.

#### Scenario: Dashboard with polls
- **WHEN** an authenticated admin visits `/admin/dashboard`
- **THEN** the system SHALL display all their polls with question, vote count, date, and status

#### Scenario: Dashboard with no polls
- **WHEN** an authenticated admin with no polls visits `/admin/dashboard`
- **THEN** the system SHALL display an empty state with a prompt to create the first poll

### Requirement: Shareable poll link
Each poll SHALL have a shareable URL in the format `/poll/{id}` where `{id}` is the poll's CUID. The admin dashboard SHALL provide a copy-to-clipboard action for each poll's shareable link.

#### Scenario: Copy shareable link
- **WHEN** an admin clicks the copy link action on a poll
- **THEN** the full URL (`{origin}/poll/{id}`) SHALL be copied to the clipboard and a confirmation toast SHALL appear

### Requirement: Close/deactivate a poll
An authenticated admin SHALL be able to close (deactivate) a poll they own. A closed poll SHALL no longer accept new votes but SHALL still display results.

#### Scenario: Close an active poll
- **WHEN** an admin clicks "Close poll" on an active poll
- **THEN** the poll's `isActive` flag SHALL be set to `false` and the UI SHALL reflect the closed state

#### Scenario: View closed poll as guest
- **WHEN** a guest visits the link of a closed poll
- **THEN** the system SHALL display the results without a vote form, with an indication that the poll is closed

### Requirement: Admin poll detail view
The admin SHALL be able to view a detail page for any poll they own at `/admin/dashboard/[id]`. This page SHALL show the poll question, all options with vote counts and percentages, total votes, active status, and the shareable link.

#### Scenario: View poll detail
- **WHEN** an admin navigates to `/admin/dashboard/[id]` for a poll they own
- **THEN** the system SHALL display full poll details including per-option vote counts and percentages
