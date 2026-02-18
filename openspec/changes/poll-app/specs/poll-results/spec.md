## ADDED Requirements

### Requirement: Display poll results with vote counts and percentages
The results view SHALL display the poll question, each option with its vote count, percentage of total votes, and a visual progress bar. The total vote count SHALL be displayed below the options.

> **Note**: Use the Shadcn MCP to browse and install any needed UI components (Progress, Card, Badge, etc.) with up-to-date documentation.

#### Scenario: Results with votes
- **WHEN** a user views results for a poll with votes cast
- **THEN** the system SHALL display each option with its vote count, percentage (rounded to nearest integer), and a filled progress bar proportional to the percentage

#### Scenario: Results with no votes
- **WHEN** a user views results for a poll with zero votes
- **THEN** all options SHALL show 0 votes, 0%, and empty progress bars

#### Scenario: Percentage calculation
- **WHEN** a poll has options with 4124, 32, 43, and 41 votes
- **THEN** percentages SHALL be calculated as `Math.round((optionVotes / totalVotes) * 100)` for each option

### Requirement: Results UI inspired by reference design
The results view SHALL use a dark card layout with each option displayed as a row containing: a purple numbered badge, option text, vote count label (e.g. "4124 votes"), percentage text, and a background progress bar fill. The progress bar SHALL fill from left to right behind the option row proportional to the vote percentage.

#### Scenario: Visual layout of result rows
- **WHEN** results are displayed
- **THEN** each option row SHALL contain a numbered purple badge, the option text, a muted vote count, a bold percentage, and a background fill bar

#### Scenario: Total votes display
- **WHEN** results are displayed
- **THEN** the total number of votes SHALL be shown below the option list (e.g. "3042 votes")

### Requirement: Live-updating results via client-side polling
The results view SHALL automatically refresh data every 3 seconds using SWR's `refreshInterval`. New votes SHALL be reflected in the UI without requiring a manual page reload.

#### Scenario: New vote reflected in results
- **WHEN** a new vote is cast on a poll while another user is viewing results
- **THEN** the results view SHALL update vote counts and percentages within 3 seconds

#### Scenario: Polling stops when page is not visible
- **WHEN** the user switches to a different browser tab
- **THEN** SWR SHALL pause polling and resume when the tab becomes active again

### Requirement: Results accessible to both guests and admins
The results view at `/poll/[id]` SHALL be accessible to guests (after voting or on closed polls) and to admins viewing their polls. The admin detail page at `/admin/dashboard/[id]` SHALL display the same results data.

#### Scenario: Guest views results after voting
- **WHEN** a guest has voted on a poll (cookie exists)
- **THEN** navigating to `/poll/{id}` SHALL display the results view

#### Scenario: Admin views poll results
- **WHEN** an admin navigates to `/admin/dashboard/{id}`
- **THEN** the system SHALL display full results with the same vote data

### Requirement: Dark and light mode support
The results view (and all UI) SHALL support both dark and light modes using the project's existing CSS variable system. A theme toggle component SHALL be available to switch between modes. The default mode SHALL respect the user's system preference.

#### Scenario: System prefers dark mode
- **WHEN** a user's OS is set to dark mode and they visit the app for the first time
- **THEN** the app SHALL render in dark mode

#### Scenario: Manual theme toggle
- **WHEN** a user clicks the theme toggle
- **THEN** the app SHALL switch between dark and light mode and persist the preference
