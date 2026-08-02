# Stillway Prompt Log

This log records the significant intent, design, implementation, review, and debugging prompts used to create Stillway. Local usernames, secrets, and unrelated course paths are omitted from the public copy.

## Session 1 — Product and plan discovery

### User prompt

Review the final-exam workshop and useful class transcripts, then collaborate on a phased implementation plan for a flight-booking application. Use SQLite with at least 10 seeded flights, create a distinctive custom feature, use Next.js for visual flexibility and Node.js for the backend, pursue a subtle premium Apple-like experience, plan for localhost first, and include a browser-led troubleshooting phase. Do not begin implementation until the plan is approved.

### Agent response and result

The workshop brief and the relevant vibe-coding/final-exam transcripts were reviewed. The agent identified the grading emphasis on concise prompting, a reviewed implementation plan, minimal-click usability, trust, visible SQLite persistence, a polished custom feature, screenshots, source code, and a demonstration shorter than 2:30.

### Manual review decisions

- Selected Journey Fit rather than a daylight route or seat-map feature.
- Selected guest round trips rather than one-way-only or user accounts.
- Selected quiet luxury rather than futuristic minimalism or adventure styling.
- Selected presets plus optional tuning for Journey Fit.
- Selected passenger details without mock payment.
- Selected Stillway and the line “Travel at your rhythm.”
- Selected an Atlanta-centered flight network.
- Replaced the recommended Railway deployment with localhost production deployment.
- Replaced fictional carriers with real carrier names/codes and fictional sample schedules.
- Selected original editorial imagery.
- Changed private-first GitHub handling to a public repository from the start.

## Session 2 — Implementation authorization

### User prompt

“PLEASE IMPLEMENT THIS PLAN,” followed by the complete approved Stillway implementation plan.

### Agent response and result

Execution began with the isolated workspace, active project goal, Next.js scaffold, durable plan, and prompt log. Work proceeds phase by phase, with status and evidence retained in `IMPLEMENTATION_PLAN.md`.

## Logging convention for later sessions

Each material prompt will add:

1. The user or agent instruction that materially changed the product or implementation.
2. The observed result.
3. Any review, correction, failure, or follow-up.
4. The affected phase and verification evidence.

## Session 3 — Original editorial media

### Agent prompt set

Generate a cohesive quiet-luxury travel photography system for a premium flight-booking website: one wide cloud-and-wing hero with negative space for copy, then card-friendly Atlanta, San Francisco, New York, Miami, Seattle, and Chicago destination images. Use soft early light, warm ivory, mist blue, muted natural color, believable optics, and restrained cinematic texture. Exclude text, logos, watermarks, focal people, oversaturation, HDR halos, and CGI styling.

### Result and review

Seven original images were generated with the built-in image tool. Each selected PNG was copied to the project, resized, encoded as an optimized WebP, and visually checked. The source PNGs remain in the generation cache; the public repository commits only the optimized WebP assets.

## Session 4 — Domain and interface implementation

### Agent implementation instruction

Implement each approved phase without broadening the product: Next.js Route Handlers, Prisma 7 with the SQLite adapter, idempotent future-dated inventory, validated search and booking APIs, atomic round-trip inventory changes, Journey Fit, same-page results, guest details, confirmation, and code-plus-email My Trips recovery.

### Result and review

The implementation created 6 airports, 5 carriers, 20 flight instances, 10 directional routes, and a complete production interface. Monetary values remain cents; datetimes remain UTC; airport-local formatting uses IANA timezones; booking legs lock their price. All expected API errors are explicit and stack traces remain server-side.

## Session 5 — Automated verification and corrections

### Agent verification prompt

Test ranking presets and custom normalization, strict input validation, price totals, confirmation format, the two-leg transaction, rollback, sold-out conflicts, component state, the default round-trip path, one-way checkout, My Trips recovery, and no results. Then run lint, TypeScript, a production build, and Chromium E2E.

### Results, failures, and fixes

- Vitest initially collected the Playwright file. The configuration was narrowed to `tests/**/*.test.{ts,tsx}`.
- The first E2E server waited for health before Playwright global setup could initialize its database. The runner was changed to copy the prepared seed database into an ignored isolated database before starting the production server.
- The first no-result browser case hit the intentional native return-date constraint. The case now selects one-way before moving the departure date.
- Date parsing was tightened to reject impossible normalized dates such as February 30.
- Final result: 13 Vitest tests, 3 Playwright cases, lint, TypeScript, and production build all passed.

## Session 6 — Chrome-led release review

### Agent QA prompt

Use the approved Chrome extension as the primary review surface. Inspect desktop and narrow layouts, exercise the real search/ranking/round-trip/checkout/refresh/My Trips path, check keyboard order and reduced motion, review console warnings and errors, verify SQLite changes, and capture release screenshots.

### Result and review

Chrome reported no console warnings or errors, no broken imagery, and no horizontal overflow. Value moved United $271 above Delta $328; Arrive Rested moved Delta back above United. The review created and refreshed confirmation `STW-F6F4AE`, recovered it through My Trips with the matching email, and verified 1 booking in SQLite while all 20 flight records remained. Reduced-motion emulation removed positional movement and smooth scrolling. Four final screenshots were retained under `docs/screenshots/`.

## Session 7 — Video scope handoff

### User prompt

“Don’t make the video, I’ll do that on my own. Just focus on the actual work itself.”

### Result and review

Video recording and upload work stopped. Recording automation was removed from the source tree so the repository remains focused on the actual application. The reviewed 2:15 narration and click path remain in `DEMO_SCRIPT.md` for the student’s own recording.

## Session 8 — Clean-checkout release rehearsal

### Agent release prompt

Clone the public repository into a new directory, remove any inherited database URL, and run the documented install, SQLite setup, verification, static checks, automated tests, production build, and browser suite without relying on the working copy.

### Results, failure, and fix

The first untouched checkout revealed a Windows-specific Prisma behavior: `migrate deploy` did not create a missing SQLite file and returned a schema-engine error. A cross-platform preparation script now creates the configured SQLite directory and empty file before migration. A second untouched public clone with no `.env` then created and seeded the database successfully, reported 20 flights and 10 routes, passed lint and TypeScript, passed 13 Vitest tests and 3 Chromium scenarios, and completed the optimized build.
