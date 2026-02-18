## 1. Project Setup & Database

- [x] 1.1 Install dependencies: prisma, @prisma/client, swr, zustand, resend, next-auth@beta, zod, next-themes
- [x] 1.2 Initialize Prisma with PostgreSQL provider (`npx prisma init`)
- [x] 1.3 Create Prisma schema with Admin, Poll, Option, and Vote models per poll-api spec
- [x] 1.4 Create Prisma client singleton at `lib/prisma.ts`
- [x] 1.5 Run initial migration (`npx prisma migrate dev`)
- [x] 1.6 Set up `.env` with DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, RESEND_API_KEY

## 2. API Layer — Poll Module

- [x] 2.1 Create `modules/poll/poll.repository.ts` with createPoll, getPollById, getPollWithVotes, getAdminPolls, closePoll
- [x] 2.2 Create `modules/poll/poll.service.ts` with createPoll (validates 2-5 options, question length), getPoll, getResults (calculates percentages), castVote (checks isActive, validates optionId), closePoll
- [x] 2.3 Create route handler `app/api/polls/route.ts` — POST create poll (auth required)
- [x] 2.4 Create route handler `app/api/polls/[id]/route.ts` — GET poll by ID (public)
- [x] 2.5 Create route handler `app/api/polls/[id]/vote/route.ts` — POST cast vote (public)
- [x] 2.6 Create route handler `app/api/polls/[id]/results/route.ts` — GET results (public)
- [x] 2.7 Create route handler `app/api/polls/[id]/close/route.ts` — PATCH close poll (auth required)
- [x] 2.8 Add Zod validation schemas for poll creation and vote request bodies
- [x] 2.9 Add consistent error response helper (`{ error: string }` format with proper status codes)

## 3. API Layer — Auth Module

- [x] 3.1 Create `modules/auth/auth.repository.ts` with createAdmin, findAdminByEmail, updateOtp, verifyAdmin
- [x] 3.2 Create `modules/auth/auth.service.ts` with register (generate OTP, hash, send email), login (check exists, send OTP), verifyOtp (check hash + expiry)
- [x] 3.3 Create email utility with Resend for sending OTP emails (with console fallback for local dev)
- [x] 3.4 Configure NextAuth.js v5 with Prisma adapter and custom credentials provider for OTP flow
- [x] 3.5 Create route handler `app/api/auth/register/route.ts` — POST register admin
- [x] 3.6 Create route handler `app/api/auth/login/route.ts` — POST login (send OTP)
- [x] 3.7 Create route handler `app/api/auth/verify/route.ts` — POST verify OTP
- [x] 3.8 Create route handler `app/api/auth/resend/route.ts` — POST resend OTP
- [x] 3.9 Add NextAuth middleware to protect `/admin/dashboard` routes
- [x] 3.10 Add Zod validation schemas for auth request bodies

## 4. Shared UI & Theme

- [x] 4.1 Install any missing shadcn components needed (use Shadcn MCP for up-to-date docs and CLI commands)
- [x] 4.2 Set up next-themes provider in root layout with system default, dark/light support
- [x] 4.3 Create ThemeToggle component using shadcn Button + hugeicons sun/moon icons
- [x] 4.4 Create Zustand store for UI state (theme preference persistence)
- [x] 4.5 Update root layout metadata (title, description) and clean up placeholder page
- [x] 4.6 Create shared layout shell with ThemeToggle placement

## 5. Public Voting UI

- [x] 5.1 Create `app/poll/[id]/page.tsx` — server component that fetches poll data
- [x] 5.2 Create `components/poll/PollVoteForm.tsx` — client component with option selection, vote submission, cookie check
- [x] 5.3 Create `components/poll/PollOptionRow.tsx` — numbered purple badge, option text, highlight border on select, checkmark
- [x] 5.4 Create `components/poll/VoteButton.tsx` — prominent purple CTA button
- [x] 5.5 Implement cookie-based double-vote prevention (`voted_{pollId}` cookie set after vote, check on load)
- [x] 5.6 Handle closed poll state — show results with "This poll is closed" message instead of vote form
- [x] 5.7 Handle invalid poll ID — render "Poll not found" error page
- [x] 5.8 Ensure mobile-responsive layout (stacked vertical, adequate touch targets below 640px)

## 6. Poll Results UI

- [x] 6.1 Create `components/poll/PollResults.tsx` — client component with SWR fetching from `/api/polls/[id]/results`
- [x] 6.2 Create `components/poll/ResultOptionRow.tsx` — purple numbered badge, option text, vote count, percentage, background progress bar fill
- [x] 6.3 Implement progress bar fill behind option row (proportional to percentage, animated)
- [x] 6.4 Display total votes count below options list
- [x] 6.5 Configure SWR with `refreshInterval: 3000` for live-updating results
- [x] 6.6 Wire results view into `/poll/[id]` page — show after voting (cookie exists) or on closed polls

## 7. Admin Auth Pages

- [x] 7.1 Create `app/admin/login/page.tsx` with email input form, calls login API, redirects to OTP verify
- [x] 7.2 Create `app/admin/register/page.tsx` with email + name form, calls register API, redirects to OTP verify
- [x] 7.3 Create `app/admin/verify/page.tsx` with 6-digit OTP input (use shadcn InputOTP), verify + resend actions
- [x] 7.4 Handle auth error states: duplicate email, unregistered email, invalid OTP, expired OTP
- [x] 7.5 Add navigation links between login and register pages

## 8. Admin Dashboard

- [x] 8.1 Create `app/admin/dashboard/layout.tsx` with dashboard shell (header with logout, nav, ThemeToggle)
- [x] 8.2 Create `app/admin/dashboard/page.tsx` — poll list fetched server-side, ordered by newest first
- [x] 8.3 Create `components/admin/PollListItem.tsx` — question, vote count, date, active status badge, copy link action
- [x] 8.4 Create empty state component for dashboard with no polls (CTA to create first poll)
- [x] 8.5 Implement copy-to-clipboard for shareable link with toast confirmation
- [x] 8.6 Create `app/admin/dashboard/new/page.tsx` — create poll form page
- [x] 8.7 Create `components/admin/CreatePollForm.tsx` — question input, dynamic option inputs (2-5), add/remove buttons, submit
- [x] 8.8 Create `app/admin/dashboard/[id]/page.tsx` — poll detail with full results, close poll action, shareable link
- [x] 8.9 Implement close poll action with confirmation dialog and UI state update

## 9. API Route — Admin Polls List

- [x] 9.1 Create route handler `app/api/admin/polls/route.ts` — GET all polls for authenticated admin
- [x] 9.2 Add `getAdminPolls` to poll service (filter by adminId, include vote counts)

## 10. Polish & Validation

- [x] 10.1 Add client-side form validation on all forms (create poll, login, register, OTP)
- [x] 10.2 Add loading states with shadcn Spinner on all async actions
- [x] 10.3 Add error boundary components for graceful error handling
- [x] 10.4 Verify dark/light mode renders correctly across all pages
- [x] 10.5 Test mobile responsiveness on all views (poll vote, results, dashboard, auth pages)
- [x] 10.6 Add proper page metadata (title, description) for each route
