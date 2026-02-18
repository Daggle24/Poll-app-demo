## 1. Config and init

- [x] 1.1 Run `npx next-openapi-gen init` (or equivalent) and create config file (e.g. `next.openapi.json`) in project root
- [x] 1.2 Set config: `apiDir` to `app/api`, `routerType` to `app`, `schemaType` to `zod`, `outputDir` (e.g. `./public`), `docsUrl` (e.g. `/api-docs`)
- [x] 1.3 Configure `ignoreRoutes` (or use `@ignore`) so `app/api/auth/[...nextauth]` is excluded from the generated spec
- [x] 1.4 Set `schemaDir` (or schema paths) so the generator can resolve Zod schemas from `modules/poll` and `modules/auth`; verify with a single route if needed

## 2. Poll API routes — JSDoc and Zod references

- [x] 2.1 Add JSDoc to `app/api/polls/route.ts`: description, `@body createPollSchema`, `@response` for success and error; ensure schema import from `modules/poll/poll.validators`
- [x] 2.2 Add JSDoc to `app/api/polls/[id]/route.ts`: description, path param, `@response` for poll and 404
- [x] 2.3 Add JSDoc to `app/api/polls/[id]/vote/route.ts`: description, path param, `@body voteSchema`, `@response` for success and errors
- [x] 2.4 Add JSDoc to `app/api/polls/[id]/results/route.ts`: description, path param, `@response` for results
- [x] 2.5 Add JSDoc to `app/api/polls/[id]/close/route.ts`: description, path param, `@response` for success and errors (auth)

## 3. Auth API routes — JSDoc and Zod references

- [x] 3.1 Add JSDoc to `app/api/auth/register/route.ts`: description, `@body registerSchema`, `@response` for success and errors
- [x] 3.2 Add JSDoc to `app/api/auth/login/route.ts`: description, `@body loginSchema`, `@response` for success and errors
- [x] 3.3 Add JSDoc to `app/api/auth/verify/route.ts`: description, `@body verifySchema`, `@response` for success (token) and errors
- [x] 3.4 Add JSDoc to `app/api/auth/resend/route.ts`: description, `@body resendSchema`, `@response` for success and errors

## 4. Admin API routes — JSDoc

- [x] 4.1 Add JSDoc to `app/api/admin/polls/route.ts`: description, `@response` for poll list and errors (auth)

## 5. Generate, script, and docs

- [x] 5.1 Run `npx next-openapi-gen generate` and fix any schema-resolution or path errors until a valid OpenAPI file is produced
- [x] 5.2 Add script to `package.json` (e.g. `"openapi:generate": "next-openapi-gen generate"`) and document in README how to generate and view API docs at the docs URL

## 6. Optional polish

- [x] 6.1 Optionally add `.describe()` to Zod fields in `modules/poll/poll.validators.ts` and `modules/auth/auth.validators.ts` for clearer OpenAPI descriptions; regenerate spec
