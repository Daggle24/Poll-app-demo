## ADDED Requirements

### Requirement: OpenAPI 3.0 spec generated from codebase

The system SHALL produce a valid OpenAPI 3.0 specification file generated from the Next.js App Router API routes and existing Zod schemas, using next-openapi-gen (or equivalent tooling). The spec SHALL be written to a configured output directory (e.g. `public/`) and SHALL describe all public API endpoints that are not explicitly excluded.

#### Scenario: Spec generated via CLI

- **WHEN** the configured generate command (e.g. `pnpm openapi:generate` or `npx next-openapi-gen generate`) is run
- **THEN** the tool scans the configured API directory, resolves JSDoc and Zod references, and writes the OpenAPI document (e.g. `openapi.json`) to the configured output path

#### Scenario: Excluded routes omitted from spec

- **WHEN** the OpenAPI spec is generated
- **THEN** the NextAuth catch-all route `app/api/auth/[...nextauth]` SHALL NOT appear in the spec (via config `ignoreRoutes` or JSDoc `@ignore`)

### Requirement: Request and response schemas from existing Zod validators

The system SHALL use the existing Zod schemas defined in `modules/poll/poll.validators.ts` and `modules/auth/auth.validators.ts` as the source for request body and response schemas in the generated OpenAPI spec. Route handlers SHALL reference these schemas in JSDoc (e.g. `@body`, `@response`) so that the generated spec reflects the same shapes used for runtime validation.

#### Scenario: Poll create endpoint documented with createPollSchema

- **WHEN** the OpenAPI spec is generated and the create-poll endpoint is documented
- **THEN** the request body schema for that endpoint SHALL be derived from the existing `createPollSchema` (question, options array) without defining a separate schema for documentation

#### Scenario: Auth endpoints documented with auth Zod schemas

- **WHEN** the OpenAPI spec is generated
- **THEN** register, login, verify, and resend endpoints SHALL use the existing Zod schemas (registerSchema, loginSchema, verifySchema, resendSchema) for request body documentation

### Requirement: Docs UI for browsing and testing API

The system SHALL expose a documentation UI (e.g. Scalar) at a configured path (e.g. `/api-docs`) that loads the generated OpenAPI spec and allows users to browse operations, view request/response schemas, and optionally try requests.

#### Scenario: Docs page loads generated spec

- **WHEN** a user visits the configured docs URL (e.g. `http://localhost:3000/api-docs`)
- **THEN** the docs UI SHALL load and display the generated OpenAPI spec and list all documented endpoints

#### Scenario: Docs reflect current Zod-based schemas

- **WHEN** the OpenAPI spec has been regenerated after a change to a Zod validator
- **THEN** the docs UI SHALL show the updated request/response shapes after refresh or regeneration

### Requirement: JSDoc annotations on public API routes

All public-facing API route handlers (polls, auth register/login/verify/resend, admin polls list) SHALL include JSDoc blocks that describe the operation and reference Zod schemas for body, path params, and responses as required by the generator. Descriptions SHALL be sufficient for a reader to understand the purpose and contract of each endpoint.

#### Scenario: Route has description and schema references

- **WHEN** a route is included in the API documentation
- **THEN** its handler SHALL have JSDoc with at least a description and the appropriate tags (e.g. `@body`, `@response`, `@pathParams`) referencing the existing Zod schemas where applicable

### Requirement: Documented generate step and README

The project SHALL provide a documented way to generate the OpenAPI spec (e.g. npm/pnpm script) and the README SHALL explain how to run the generator and how to view the API documentation (URL and any prerequisites).

#### Scenario: Developer runs generate from README

- **WHEN** a developer follows the README instructions for API documentation
- **THEN** they SHALL be able to run the generate command and open the docs URL to view the current API documentation
