## Why

We need to build a polling web application that allows an admin to create polls with custom questions and share them publicly. Anonymous guests can vote and see live-updating results. This is the foundational feature set for the product — everything starts here.

## What Changes

- Add admin authentication with email OTP verification (login/registration)
- Add an admin dashboard for creating and managing polls (2–5 options per poll)
- Add a public-facing poll view where anonymous guests vote via shareable links
- Add a results view with visual progress bars, vote counts, and percentages
- Add live-updating results via polling (refetch every few seconds)
- Add REST API with layered architecture (route handlers → service → repository)
- Add Prisma schema with PostgreSQL for polls, options, and votes
- Add dark/light mode theming with shadcn components and purple accent palette
- Add mobile-responsive layouts across all views
- Add basic input validation (client-side and server-side)

## Capabilities

### New Capabilities

- `admin-auth`: Admin authentication — registration, login, and session management using email OTP verification. Only authenticated admins can create/manage polls.
- `poll-management`: Admin dashboard for creating polls (question + 2–5 options), viewing own polls, and accessing shareable links.
- `public-voting`: Public-facing poll page where anonymous guests cast a vote via a shareable link. No authentication required.
- `poll-results`: Results view displaying vote counts, percentages, and progress bars. Live-updates via client-side polling. Accessible to both admin and guests after voting.
- `poll-api`: REST API layer with route handlers as controllers, service layer for business logic, and repository layer for Prisma/DB access.

### Modified Capabilities

_None — this is a greenfield project._

## Impact

- **New dependencies**: Prisma, PostgreSQL driver, authentication library (e.g. next-auth or custom OTP flow), email service for OTP delivery
- **Database**: New Prisma schema with Poll, Option, Vote, and Admin models
- **API surface**: New route handlers under `/api/polls`, `/api/auth`
- **Frontend**: New pages/components — admin dashboard, poll creation form, public vote page, results view
- **Deployment**: Requires PostgreSQL (Neon/Supabase) and environment variables for DB connection + email service
