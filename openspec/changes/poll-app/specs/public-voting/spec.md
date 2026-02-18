## ADDED Requirements

### Requirement: Public poll page accessible without authentication
The poll page at `/poll/[id]` SHALL be accessible to any visitor without authentication. The page SHALL display the poll question and all available options.

> **Note**: Use the Shadcn MCP to browse and install any needed UI components (RadioGroup, Button, Card, Badge, etc.) with up-to-date documentation.

#### Scenario: Guest visits valid poll link
- **WHEN** an anonymous guest navigates to `/poll/{id}` for an existing active poll
- **THEN** the system SHALL display the poll question and all options in a vote form

#### Scenario: Guest visits invalid poll link
- **WHEN** a guest navigates to `/poll/{id}` where the ID does not match any poll
- **THEN** the system SHALL display a "Poll not found" error page

### Requirement: Cast a vote on an active poll
A guest SHALL be able to select one option and submit their vote on an active poll. After voting, the system SHALL set a `voted_{pollId}` cookie and redirect the guest to the results view.

#### Scenario: Successful vote
- **WHEN** a guest selects an option and clicks the "Vote" button
- **THEN** the system creates a Vote record, sets the `voted_{pollId}` cookie, and displays the results view

#### Scenario: Vote without selecting an option
- **WHEN** a guest clicks "Vote" without selecting any option
- **THEN** the system SHALL display a validation message "Please select an option"

#### Scenario: Vote on a closed poll
- **WHEN** a guest attempts to vote on a poll where `isActive` is `false`
- **THEN** the system SHALL NOT accept the vote and SHALL display "This poll is closed" with the results

### Requirement: Prevent trivial double voting via cookie
After a guest votes on a poll, the system SHALL set a browser cookie `voted_{pollId}`. On subsequent visits, if this cookie exists, the system SHALL show the results view directly instead of the vote form.

#### Scenario: Return visit after voting
- **WHEN** a guest who has already voted visits the same poll link
- **THEN** the system SHALL display the results view instead of the vote form

#### Scenario: First visit to a new poll
- **WHEN** a guest without a `voted_{pollId}` cookie visits an active poll
- **THEN** the system SHALL display the vote form

### Requirement: Poll vote UI inspired by reference design
The vote form SHALL display options in a card-based layout with numbered purple badges (1., 2., 3., etc.), option text, and a prominent purple "Vote" button. The selected option SHALL have a visible highlight border. The layout SHALL be mobile-responsive.

#### Scenario: Option selection visual feedback
- **WHEN** a guest clicks on an option row
- **THEN** the selected option SHALL display a highlight border and a checkmark indicator

#### Scenario: Mobile layout
- **WHEN** a guest views the poll page on a screen narrower than 640px
- **THEN** the layout SHALL stack vertically and remain fully usable with touch targets of adequate size
