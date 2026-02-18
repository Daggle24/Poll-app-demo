# Strategy and Execution Plan – Poll Fullstack Application 

## Architecture Review

We conducted a structured architecture brainstorming session using AI-assisted analysis to evaluate different design approaches based on the requirements.

After assessing trade-offs and scalability considerations, we selected a **Clean Layered Architecture (3-Tier)** as the recommended structure.

This allows:

* Clear separation of concerns
* Isolation of business logic
* Better maintainability
* Easier scalability and future extension

The backend is structured around:

* Controller layer (route handlers)
* Service layer (business logic)
* Repository layer (data access)

This ensures the application remains modular and extensible while keeping complexity appropriate for the scope of the project.

## Spec-Driven Development

We defined the requirements in a structured Markdown specification and then translated them into executable task groups using a Spec-Driven Development approach.

The implementation was divided into the following task groups:

| Group                       | Tasks | Focus                                                      |
| --------------------------- | ----- | ---------------------------------------------------------- |
| 1. Project Setup & Database | 6     | Prisma, environment setup, migrations                      |
| 2. Poll API Module          | 9     | Repository, service layer, route handlers, Zod validation  |
| 3. Auth API Module          | 10    | OTP flow, NextAuth, Resend integration, middleware         |
| 4. Shared UI & Theme        | 6     | next-themes, ThemeToggle, Zustand, layout                  |
| 5. Public Voting UI         | 8     | `/poll/[id]`, option rows, vote form, cookies              |
| 6. Poll Results UI          | 6     | Progress bars, SWR live polling, results view              |
| 7. Admin Auth Pages         | 5     | Login, register, OTP verification                          |
| 8. Admin Dashboard          | 9     | Poll list, create form, detail view, close poll            |
| 9. Admin Polls List API     | 2     | Authenticated poll listing endpoint                        |
| 10. Polish & Validation     | 5     | Loading states, error boundaries, responsiveness, metadata |

Tasks were ordered by dependency: database and API layers first, followed by UI, and finally polish and validation.

The specification phase was executed using Anthropic Opus 4.6 to ensure high-quality reasoning and completeness before implementation began.

## Parallelized Execution via Sub-Agents


                    ┌─────────────────┐
                    │ setup-database  │  (Group 1 — 6 tasks)
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────────┐
      │ poll-api │   │ auth-api │   │ ui-foundation│
      │ Grp 2+9 │   │  Grp 3   │   │    Grp 4     │
      │ 11 tasks │   │ 10 tasks │   │   6 tasks    │
      └─────┬────┘   └────┬─────┘   └──────┬───────┘
            │              │                │
            └──────┬───────┘                │
                   │        ┌───────────────┘
                   ▼        ▼
          ┌────────────────────┐
          │  public-poll-ui    │  (Groups 5+6 — 14 tasks)
          └────────┬───────────┘
                   │
          ┌────────────────────┐
          │     admin-ui       │  (Groups 7+8 — 14 tasks)
          └────────┬───────────┘
                   │
          ┌────────────────────┐
          │    polish-qa       │  (Group 10 — 6 tasks)
          └────────────────────┘


To meet the requirement of completing the coding test within two hours, the workload was parallelized using specialized sub-agents assigned to each task group.

Execution flow:

* **setup-database** (Group 1 — 6 tasks)
* **poll-api** (Groups 2 + 9 — 11 tasks)
* **auth-api** (Group 3 — 10 tasks)
* **ui-foundation** (Group 4 — 6 tasks)
* **public-poll-ui** (Groups 5 + 6 — 14 tasks)
* **admin-ui** (Groups 7 + 8 — 14 tasks)
* **polish-qa** (Group 10 — 6 tasks)

This structure allowed concurrent implementation across isolated modules while maintaining architectural consistency.

After the architectural reasoning and specification phase, execution was performed using the “Auto” model in Cursor to optimize cost-efficiency, since the heavy architectural reasoning had already been completed.

