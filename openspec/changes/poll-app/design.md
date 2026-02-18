## Context

Greenfield Next.js 16 project (App Router) with shadcn `radix-maia` style already initialized. Purple-themed CSS variables, dark/light mode, Figtree font, and hugeicons are all configured. Several shadcn UI components are already installed (button, card, input, label, dialog, radio-group, badge, etc.).

The application has two user types:
- **Admin**: authenticated user who manages polls via a dashboard
- **Guest**: anonymous visitor who votes and views results via shareable links

Requirements doc specifies a layered backend architecture (controller → service → repository) within Next.js route handlers, with Prisma + PostgreSQL.

## Goals / Non-Goals

**Goals:**
- Fully functional poll lifecycle: create → share → vote → view results
- Clean admin dashboard behind authentication
- Frictionless anonymous voting experience (no auth wall)
- Live-updating results via client-side polling
- Dark/light mode with the existing purple accent theme
- Mobile-responsive across all views
- Deployable to Vercel with Neon/Supabase PostgreSQL

**Non-Goals:**
- WebSocket/SSE-based real-time (client-side polling is sufficient)
- Multi-tenant or multi-admin role hierarchy (single admin role for now)
- Poll editing after creation (create-only for v1)
- Rate limiting or anti-spam on votes (future concern)
- Internationalization (English only)
- Analytics or advanced reporting

## Decisions

### 1. Authentication: NextAuth.js with custom email OTP provider

**Choice**: NextAuth.js v5 (Auth.js) with a custom email OTP credential flow.

**Why over alternatives**:
- *Custom JWT from scratch*: more work, less secure defaults, session management boilerplate
- *Clerk/Auth0*: external dependency, overkill for single-role admin auth
- NextAuth gives us session management, CSRF protection, and middleware guards out of the box. Custom OTP provider lets us control the email verification flow.

**Approach**: Admin registers with email → receives OTP → verifies → session created. Sessions stored in DB via Prisma adapter.

### 2. Database schema: Prisma with PostgreSQL

**Choice**: Prisma ORM with the schema from requirements (Poll, Option, Vote, Admin models).

**Additions to the proposed schema**:
- `Admin` model for authenticated users (email, name, hashedOtp, otpExpiresAt)
- `Poll.adminId` foreign key to tie polls to their creator
- `Poll.isActive` boolean to allow closing polls
- `Vote` gets an optional `voterToken` (browser fingerprint/cookie) to prevent trivial double-voting

### 3. API architecture: layered within Next.js route handlers

**Choice**: Three-layer architecture inside `/modules`:

```
/app/api/...        → Route handlers (controllers) — parse request, call service, return response
/modules/poll/      → poll.service.ts (business logic), poll.repository.ts (Prisma queries)
/modules/auth/      → auth.service.ts, auth.repository.ts
```

**Why**: Keeps business logic testable and isolated from HTTP concerns. Repository layer makes it easy to swap or mock DB access.

### 4. Routing structure

```
/                        → Landing / redirect
/poll/[id]               → Public poll page (vote + results)
/admin/login             → Admin login (OTP flow)
/admin/register          → Admin registration
/admin/dashboard         → Poll list + create
/admin/dashboard/new     → Create new poll form
/admin/dashboard/[id]    → Poll detail / results for admin
```

Admin routes protected by NextAuth middleware. Public `/poll/[id]` is fully open.

### 5. Frontend state: Zustand for client state, SWR for server state

**Choice**: Zustand for UI state (theme, modals) + SWR for data fetching with automatic revalidation.

**Why SWR over plain fetch**:
- Built-in polling interval (`refreshInterval`) for live-updating results
- Deduplication, caching, revalidation on focus
- Minimal boilerplate compared to React Query for this scope

**Why not React Query**: SWR is lighter and sufficient for our simple read-heavy patterns.

### 6. UI component approach: shadcn + custom poll components

**Existing shadcn components to leverage**: Button, Card, Input, Label, Dialog, RadioGroup, Badge, Separator, Spinner.

**New components to build**:
- `PollCard` — displays a poll with options, progress bars, vote counts (inspired by reference design)
- `PollOptionRow` — individual option with number badge, label, vote count, percentage, progress bar
- `CreatePollForm` — question + dynamic option inputs (2–5)
- `VoteButton` — primary CTA for casting vote
- `ResultsBar` — animated progress bar with percentage
- `ThemeToggle` — dark/light mode switcher

**Design direction** (from reference image): dark background, card-based layout, purple numbered badges on options, subtle border on selected option, progress bar fills behind option rows, vote count + percentage right-aligned, prominent "Vote" CTA button in purple.

### 7. Shareable links

**Choice**: Use the poll's `cuid` ID directly in the URL: `https://domain.com/poll/{id}`.

**Why not short codes**: CUID is already URL-safe, unique, and doesn't require an extra lookup table. Good enough for v1. Short vanity URLs can be added later.

### 8. Double-vote prevention (lightweight)

**Choice**: Set a browser cookie (`voted_{pollId}`) after voting. Check cookie client-side to show results instead of vote form.

**Trade-offs**: This is trivially bypassable (clear cookies, incognito). Acceptable for v1 since we explicitly listed rate limiting as a non-goal. The Vote model stores `voterToken` for future server-side enforcement.

### 9. Live-updating results

**Choice**: SWR `refreshInterval` of 3 seconds on the results endpoint.

**Why not WebSockets**: Polling is simple, stateless, and works with Vercel serverless. WebSockets require persistent connections and a different infra model. For a poll app with moderate traffic, 3s polling is good enough.

### 10. Email delivery for OTP

**Choice**: Resend as the email provider.

**Why**: First-class Next.js/Vercel integration, generous free tier (100 emails/day), simple API. Alternative considered: Nodemailer with SMTP — more config, less reliable deliverability.

## Important: Shadcn Component Installation

When implementing UI components, use the **Shadcn MCP server** to browse available components, read their up-to-date documentation, and install them with the correct CLI commands. Do NOT rely on cached or memorized shadcn APIs — always query the MCP for the latest component docs, props, and usage patterns. This ensures we use the correct imports, variants, and composition patterns for the `radix-maia` style configured in this project.

## Risks / Trade-offs

- **Cookie-based double-vote is weak** → Acceptable for v1. Mitigation: `voterToken` in DB enables server-side enforcement later.
- **OTP emails may land in spam** → Mitigation: use Resend with proper domain verification. Fallback: show OTP in console for local dev.
- **3s polling creates load at scale** → Mitigation: SWR deduplicates requests. Future: switch to SSE or WebSocket if needed.
- **No poll editing** → Admins must delete and recreate. Keeps the data model simple for v1.
- **Single admin role** → No granular permissions. Sufficient for current requirements but will need expansion if multiple admin types are needed.
