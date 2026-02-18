## ADDED Requirements

### Requirement: POST /api/polls — create a poll
The endpoint SHALL accept a JSON body with `question` (string) and `options` (array of strings). It SHALL validate inputs via the service layer and return the created poll with all options. Only authenticated admins SHALL be authorized to call this endpoint.

#### Scenario: Successful poll creation
- **WHEN** an authenticated admin sends `POST /api/polls` with `{ "question": "Favorite color?", "options": ["Red", "Blue", "Green"] }`
- **THEN** the system SHALL return 201 with the created poll object including `id`, `question`, `options`, `isActive: true`, and `createdAt`

#### Scenario: Unauthenticated request
- **WHEN** an unauthenticated visitor sends `POST /api/polls`
- **THEN** the system SHALL return 401 Unauthorized

#### Scenario: Invalid body (missing question)
- **WHEN** a request is sent without a `question` field
- **THEN** the system SHALL return 400 with a validation error message

#### Scenario: Invalid options count
- **WHEN** a request is sent with fewer than 2 or more than 5 options
- **THEN** the system SHALL return 400 with error "Poll must have 2-5 options"

### Requirement: GET /api/polls/[id] — get a poll
The endpoint SHALL return the poll data including question, options, active status, and creation date. This endpoint SHALL be publicly accessible (no auth required).

#### Scenario: Valid poll ID
- **WHEN** a request is sent to `GET /api/polls/{id}` with a valid ID
- **THEN** the system SHALL return 200 with the poll object

#### Scenario: Invalid poll ID
- **WHEN** a request is sent to `GET /api/polls/{id}` with a non-existent ID
- **THEN** the system SHALL return 404 with error "Poll not found"

### Requirement: POST /api/polls/[id]/vote — cast a vote
The endpoint SHALL accept a JSON body with `optionId` (string). It SHALL create a Vote record linking the option and poll. This endpoint SHALL be publicly accessible. It SHALL reject votes on inactive polls.

#### Scenario: Successful vote
- **WHEN** a guest sends `POST /api/polls/{id}/vote` with `{ "optionId": "valid-option-id" }`
- **THEN** the system SHALL create a Vote record and return 201 with the vote confirmation

#### Scenario: Vote on closed poll
- **WHEN** a guest sends a vote request for a poll where `isActive` is `false`
- **THEN** the system SHALL return 403 with error "This poll is closed"

#### Scenario: Invalid option ID
- **WHEN** a guest sends a vote with an `optionId` that does not belong to the specified poll
- **THEN** the system SHALL return 400 with error "Invalid option for this poll"

### Requirement: GET /api/polls/[id]/results — get poll results
The endpoint SHALL return the poll question, total vote count, and each option with its vote count and percentage. Percentage SHALL be calculated as `Math.round((optionVotes / totalVotes) * 100)`. This endpoint SHALL be publicly accessible.

#### Scenario: Results with votes
- **WHEN** a request is sent to `GET /api/polls/{id}/results`
- **THEN** the system SHALL return 200 with `{ question, totalVotes, results: [{ optionId, text, votes, percentage }] }`

#### Scenario: Results for poll with no votes
- **WHEN** a request is sent to a poll with zero votes
- **THEN** the system SHALL return 200 with all options showing `votes: 0` and `percentage: 0`

### Requirement: Layered architecture separation
Route handlers SHALL only handle HTTP concerns (parse request, validate basic shape, call service, return response). Business logic (validation rules, percentage calculation, authorization checks) SHALL live in the service layer. Database access SHALL be isolated in the repository layer using Prisma.

#### Scenario: Route handler delegates to service
- **WHEN** a route handler receives a valid request
- **THEN** it SHALL call the corresponding service function and SHALL NOT contain business logic or direct Prisma calls

#### Scenario: Service validates business rules
- **WHEN** the service layer receives poll creation data
- **THEN** it SHALL validate option count (2-5), question length, and option text before calling the repository

#### Scenario: Repository handles only data access
- **WHEN** the repository layer is called
- **THEN** it SHALL perform Prisma queries and return data without applying business rules

### Requirement: Prisma schema with Poll, Option, Vote, and Admin models
The database schema SHALL include four models: `Poll` (id, question, isActive, createdAt, adminId), `Option` (id, text, pollId), `Vote` (id, pollId, optionId, voterToken, createdAt), and `Admin` (id, email, name, emailVerified, hashedOtp, otpExpiresAt). Relationships SHALL use foreign keys with proper cascading.

#### Scenario: Poll with options created
- **WHEN** a poll is created with 3 options
- **THEN** the database SHALL contain one Poll record and three related Option records

#### Scenario: Vote references poll and option
- **WHEN** a vote is cast
- **THEN** the Vote record SHALL reference both the poll and the selected option via foreign keys

#### Scenario: Admin owns polls
- **WHEN** an admin creates a poll
- **THEN** the Poll record SHALL have the admin's ID in the `adminId` field

### Requirement: Error handling in API responses
All API endpoints SHALL return consistent error responses in the format `{ error: string }`. Server errors SHALL return 500 with a generic message. Validation errors SHALL return 400 with specific messages. Auth errors SHALL return 401.

#### Scenario: Server error
- **WHEN** an unexpected error occurs in any endpoint
- **THEN** the system SHALL return 500 with `{ "error": "Internal server error" }` and log the actual error server-side

#### Scenario: Validation error
- **WHEN** a request fails input validation
- **THEN** the system SHALL return 400 with `{ "error": "<specific validation message>" }`
