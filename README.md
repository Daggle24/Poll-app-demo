# Poll App

A Next.js poll application: **admins** sign in with email OTP to create and manage polls; **public users** vote without an account. Results update in near real time.

## Prerequisites

- **Node.js** 20+
- **pnpm** (or npm/yarn)
- **PostgreSQL** (local, or [Neon](https://neon.tech) / [Supabase](https://supabase.com) for a hosted DB)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string. **Vercel + Supabase:** use the [Connection Pooler](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler) URL (port 6543), not the direct URL (`db.*.supabase.co:5432`), or you may get P1001 in production. |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth; generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | App URL; use `http://localhost:3000` for local dev |
| `RESEND_API_KEY` | No | [Resend](https://resend.com) API key for OTP emails. If empty, OTP codes are **logged to the terminal** (handy for local testing). |

### 3. Database

Create the database (if needed), then run migrations:

```bash
pnpm prisma migrate dev
```

(Optional) Seed or inspect data with Prisma Studio:

```bash
pnpm prisma studio
```

### 4. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing the app

### Without Resend (local)

Leave `RESEND_API_KEY` empty. When you register or log in, the **6-digit OTP is printed in the terminal** where `pnpm dev` is running. Use that code on the verify page.

### Flow to try

1. **Landing** — [http://localhost:3000](http://localhost:3000)
2. **Admin sign up** — Go to **Login** or **Register**, enter email (and name for register). You'll be sent to the verify page; enter the OTP from the email (or from the terminal if no Resend key).
3. **Dashboard** — After verify, you're in the admin dashboard. Create a poll (question + 2–5 options).
4. **Poll detail** — Open a poll, use **Copy share link**, then **Close poll** (with confirmation) if you want.
5. **Public vote** — Open the share link in another browser or incognito. Vote once; you'll see results and "You've already voted." Refresh to see updated counts (SWR refreshes every few seconds).
6. **Theme** — Use the theme toggle in the header to switch dark/light.

## API documentation

OpenAPI 3.0 docs are generated from the codebase (JSDoc + Zod schemas). To generate the spec and view the docs:

```bash
pnpm openapi:generate
pnpm dev
```

Then open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to browse and try the API.

## Automated tests

### Unit tests

Run all unit tests (Vitest):

```bash
pnpm test
```

With coverage:

```bash
pnpm test:coverage
```

Tests cover poll and auth validators, and poll and auth services (with mocked repositories). No database or email is required for unit tests.

### E2E tests

E2E tests use **Playwright** and **Cucumber** (Gherkin). They run against a **running instance** of the app and use the **same database** as that instance (no mocks). So if you run `pnpm dev` with your normal `.env`, E2E hits your real DB.

1. Start the app (e.g. `pnpm dev`).
2. Optionally set the base URL (default is `http://localhost:3000`):
   ```bash
   export BASE_URL=http://localhost:3000
   ```
3. Run E2E:
   ```bash
   pnpm test:e2e
   ```

**Pre-seeding the database for E2E**

To get passing public-voting scenarios, create a test poll and set its ID:

```bash
pnpm prisma db seed
```

The seed creates an E2E test admin (`e2e@example.com`) and one **active** poll, then prints something like:

```
Created E2E poll: clxx...
Set in your environment:
  export E2E_POLL_ID=clxx...
```

Set that in your environment (or `.env`) and run E2E again. For "closed poll" scenarios, use a poll you have closed in the app (or create a second poll, close it, and set `E2E_CLOSED_POLL_ID` if you add support for it).

**Deterministic OTP for CI / automated admin login**

Admin E2E scenarios need to log in via OTP. To make this fully automated (no manual code-grabbing), the auth service supports a **deterministic OTP mode**:

1. Set `E2E_TEST_OTP` in the **server** `.env` (e.g. `E2E_TEST_OTP=000000`).
2. The E2E test steps read the same variable (defaults to `000000`) and fill the verify form automatically.
3. Because the server generates the fixed OTP and the tests know it, login is zero-touch.

**Never set `E2E_TEST_OTP` in production.** It is strictly for dev/CI environments.

**Prerequisites for E2E:**

- App is running at `BASE_URL`.
- **Public voting**: set `E2E_POLL_ID` to an existing active poll ID (e.g. from `pnpm prisma db seed`). If unset, scenarios that need a valid poll fail with a clear message.
- **Poll management**: set `E2E_TEST_OTP` in the server `.env` so admin login is automatic. Optionally set `E2E_ADMIN_EMAIL` (default `e2e@example.com`).

**Run E2E with the browser visible**

To watch the browser instead of headless:

```bash
E2E_HEADED=1 pnpm test:e2e
```

Playwright browsers are installed automatically when you run E2E; if needed, run `pnpm exec playwright install chromium` once.

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:coverage` | Run unit tests with coverage |
| `pnpm test:e2e` | Run E2E tests (Cucumber + Playwright); app must be running |
| `pnpm openapi:generate` | Generate OpenAPI spec to `public/openapi.json` |
| `pnpm prisma migrate dev` | Apply migrations (dev) |
| `pnpm prisma db seed` | Seed DB (E2E test admin + poll; prints `E2E_POLL_ID`) |
| `pnpm prisma studio` | Open Prisma Studio |

## Stack

- **Next.js** 16 (App Router), **React** 19
- **NextAuth.js** v5 (OTP via Resend or console)
- **Prisma** 7 + PostgreSQL
- **Shadcn UI**, **Tailwind**, **Zustand**, **SWR**, **Zod**
