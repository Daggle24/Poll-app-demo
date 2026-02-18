# Error handling in PollApp

This document describes how errors are handled across the application: in the UI (error boundaries), in API routes, and in forms.

## Overview

- **UI errors** (e.g. React render errors, failed data loading) are caught by **error boundaries** and show a friendly message with a “Try again” action.
- **API errors** return a consistent `{ error: string }` JSON shape and HTTP status codes; clients show these messages in forms or inline.
- **Form validation** uses Zod on both client and server; invalid input is reported inline and via API responses.

---

## 1. Error boundaries (UI)

We use Next.js App Router **error boundaries** (`error.tsx`) so that when a component in a segment throws, the user sees a fallback UI instead of a blank or broken page.

### Where they are

| File | Scope | When it catches |
|------|--------|------------------|
| `app/error.tsx` | Global (everything under root layout) | Errors in the main app shell, landing page, or any segment that doesn’t have its own `error.tsx`. |
| `app/poll/[id]/error.tsx` | Public poll page | Errors while rendering the poll vote/results page (e.g. failed server component, client component throw). |
| `app/admin/error.tsx` | Admin section | Errors in any admin route: login, register, verify, dashboard, create poll, poll detail. |

All three are **Client Components** (required by Next.js for `error.tsx`). They receive:

- **`error`** – the thrown `Error` (and optional `digest` for server errors).
- **`reset()`** – a function that re-renders the segment so the user can “Try again” without leaving the page.

### What the user sees

- **Global** (`app/error.tsx`): Uses `LayoutShell` (header with PollApp, theme toggle, Admin). Card with “Something went wrong”, **Try again** and **Go home**.
- **Poll page** (`app/poll/[id]/error.tsx`): Uses `PublicPollShell` (no header, theme toggle, “Powered by PollApp” footer). Same card + **Try again** and **Go home**.
- **Admin** (`app/admin/error.tsx`): Minimal admin shell (theme toggle in header). Card + **Try again**, **Dashboard**, and **Home**.

Errors are also logged to the console (`console.error`) for debugging.

### What error boundaries do *not* catch

- **404s** – Handled by `not-found.tsx` (e.g. `app/poll/[id]/not-found.tsx` for invalid poll IDs).
- **Errors inside event handlers or async code** (e.g. `fetch` in a button click) – Those must be handled in the component (e.g. `setError`, inline message). Error boundaries only catch render-time and commit-phase errors.
- **Errors in the root layout itself** – For those you would add a root `app/global-error.tsx` (not currently implemented).

---

## 2. API error responses

All API routes use the helpers in `lib/api-utils.ts` so responses are consistent.

### Shape

- **Body**: `{ error: string }`
- **Status**: Chosen by the helper (see below).

### Helpers

| Helper | Status | Use |
|--------|--------|-----|
| `apiError(message, status)` | Any | Generic error response. |
| `apiValidationError(message)` | 400 | Invalid input (e.g. Zod validation). |
| `apiNotFound(message)` | 404 | Resource not found. |
| `apiUnauthorized(message)` | 401 | Not authenticated. |
| `apiForbidden(message)` | 403 | Not allowed (e.g. not poll owner). |
| `apiServerError(message)` | 500 | Unexpected server error. |

Example in a route:

```ts
import { apiValidationError, apiServerError } from '@/lib/api-utils'

// Validation failure
return apiValidationError(parsed.error.issues[0]?.message ?? 'Validation failed')

// Unexpected error
} catch (err) {
  console.error(err)
  return apiServerError()
}
```

### How the client uses them

- **Forms** (login, register, verify, create poll, vote): `fetch` the route, then `const data = await res.json()` and show `data.error` in the UI (e.g. under the form or next to the submit button).
- **SWR** (e.g. poll results): SWR’s `error` and `data` are used to show loading/error states in components like `PollResults`.

---

## 3. Form and client-side errors

- **Validation**: Zod schemas (e.g. in `modules/auth/auth.validators.ts`, `modules/poll/poll.validators.ts`) are used on the server; the same or similar checks can be used on the client to show errors before submit.
- **Submit flow**: On submit, the client calls the API, then:
  - If `!res.ok`, it reads `(await res.json()).error` and sets local error state (e.g. `setError(data.error)`).
  - If the request throws (network, etc.), it sets a generic message (e.g. “Something went wrong. Please try again.”).
- **Loading state**: Buttons are disabled and show “Sending…”, “Verifying…”, etc., while the request is in flight so the user doesn’t double-submit.

These client-side and API-level errors are **separate** from error boundaries: they don’t trigger `error.tsx`; they’re handled inside the form component.

---

## 4. Summary

| Layer | Mechanism | User-facing |
|-------|-----------|-------------|
| React render / segment | `error.tsx` (error boundaries) | “Something went wrong” card + Try again / navigation. |
| API | `lib/api-utils.ts` + status codes | `{ error: string }`; forms and SWR show the message. |
| Forms | Local state + API `error` | Inline message under form or button; loading state during submit. |
| Not found | `not-found.tsx` | Dedicated “Poll not found” / 404 UI. |

Together, this gives consistent error handling: boundaries for unexpected UI failures, APIs for structured server errors, and forms for validation and request errors.
