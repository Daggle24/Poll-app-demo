## ADDED Requirements

### Requirement: Admin registration with email OTP
The system SHALL allow a new admin to register by providing an email address and name. Upon submission, the system SHALL generate a 6-digit OTP, store it hashed with a 10-minute expiry, and send it to the provided email via Resend. The admin account SHALL NOT be considered verified until the OTP is confirmed.

#### Scenario: Successful registration request
- **WHEN** a visitor submits a valid email and name on the registration page
- **THEN** the system creates an unverified admin record, sends a 6-digit OTP to the email, and redirects to the OTP verification screen

#### Scenario: Registration with duplicate email
- **WHEN** a visitor submits an email that already belongs to a verified admin
- **THEN** the system SHALL display an error indicating the email is already registered

#### Scenario: Registration with invalid email format
- **WHEN** a visitor submits a malformed email address
- **THEN** the system SHALL display a validation error and NOT create any record

### Requirement: OTP verification
The system SHALL accept a 6-digit OTP code and verify it against the stored hash. A valid OTP within the expiry window SHALL mark the admin as verified and create an authenticated session. Expired or incorrect OTPs SHALL be rejected.

#### Scenario: Valid OTP within expiry
- **WHEN** an admin enters the correct 6-digit OTP within 10 minutes of issuance
- **THEN** the system verifies the admin, creates a session, and redirects to the admin dashboard

#### Scenario: Expired OTP
- **WHEN** an admin enters the correct OTP after the 10-minute window
- **THEN** the system SHALL reject the code and display "OTP expired, please request a new one"

#### Scenario: Incorrect OTP
- **WHEN** an admin enters an incorrect OTP code
- **THEN** the system SHALL display "Invalid code" and allow retry

#### Scenario: Resend OTP
- **WHEN** an admin requests a new OTP from the verification screen
- **THEN** the system SHALL invalidate the previous OTP, generate a new one, and send it to the admin's email

### Requirement: Admin login with email OTP
The system SHALL allow a verified admin to log in by entering their email. The system SHALL send a new OTP to that email. After OTP verification, an authenticated session SHALL be created.

#### Scenario: Successful login flow
- **WHEN** a verified admin enters their registered email on the login page
- **THEN** the system sends a 6-digit OTP and redirects to the OTP verification screen

#### Scenario: Login with unregistered email
- **WHEN** a visitor enters an email that does not belong to any admin
- **THEN** the system SHALL display an error indicating the account does not exist

### Requirement: Session management
The system SHALL use NextAuth.js to manage admin sessions. Sessions SHALL be stored in the database via Prisma adapter. Authenticated sessions SHALL persist across page reloads until explicitly logged out or expired.

#### Scenario: Session persists across navigation
- **WHEN** an authenticated admin navigates between admin pages
- **THEN** the session SHALL remain active and the admin SHALL stay logged in

#### Scenario: Logout
- **WHEN** an authenticated admin clicks the logout button
- **THEN** the session SHALL be destroyed and the admin SHALL be redirected to the login page

### Requirement: Admin route protection
All routes under `/admin/dashboard` SHALL require an authenticated admin session. Unauthenticated requests to protected routes SHALL be redirected to `/admin/login`.

#### Scenario: Unauthenticated access to dashboard
- **WHEN** an unauthenticated visitor navigates to `/admin/dashboard`
- **THEN** the system SHALL redirect to `/admin/login`

#### Scenario: Authenticated access to dashboard
- **WHEN** an authenticated admin navigates to `/admin/dashboard`
- **THEN** the system SHALL render the dashboard page
