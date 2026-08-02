# Stillway Flight Booking Application — Implementation Plan

> Status: Implementation complete; final video remains a student-owned submission step  
> Product: Stillway — “Travel at your rhythm.”  
> Working directory: `<Desktop>\stillway-flight-booking`

## Purpose and evidence strategy

Stillway is a quiet-luxury flight marketplace with guest one-way and round-trip booking, SQLite-backed persistence, a My Trips lookup, and a signature Journey Fit ranking experience. The application is built with Codex as the approved vibe-coding environment and is designed for a polished localhost production demonstration.

This document deliberately preserves four layers of evidence for the final-exam rubric:

1. The baseline AI proposal.
2. The student's manual reviews and corrections.
3. The approved phase plan and completion evidence.
4. An append-only revision log recording material implementation changes.

## Baseline AI proposal

The initial proposal recommended a Next.js/Node/SQLite marketplace with a calm premium visual system, a transparent preference-based flight score, persistent guest bookings, automated testing, browser-led QA, and a deployment path using a persistent cloud volume.

The suggested defaults were:

- Railway with a persistent volume for public hosting.
- Fictional airlines and original neutral carrier marks.
- A private repository until the final privacy review.
- Journey Fit presets plus optional tuning.
- Guest round trips without real payment.
- Atlanta-centered sample inventory.

## Manual review decisions

The following changes were made during review rather than accepting the baseline blindly:

- **Deployment:** changed Railway hosting to a final localhost production deployment.
- **Carrier identity:** changed fictional airlines to real airline names and IATA codes. Schedules remain fictional sample data and the UI must say so clearly.
- **Repository:** changed private-first to public from the initial push.
- **Product:** approved the Stillway name, quiet-luxury direction, and “Travel at your rhythm.” positioning.
- **Feature:** approved Journey Fit presets plus four adjustable priorities.
- **Booking:** approved guest one-way and round-trip booking, passenger details, and no payment form.
- **Inventory:** approved an Atlanta hub with at least 20 flight instances across five domestic routes.
- **Media:** approved original editorial imagery rather than licensed or remote photography.

## Approved architecture

- Next.js App Router, React, TypeScript, Tailwind CSS, Motion, and Lucide icons.
- Next.js Route Handlers provide the Node.js backend; there is no separate Express server.
- Prisma ORM 7 and SQLite store airports, carriers, flights, bookings, and booking legs.
- Zod validates all server-bound inputs.
- Vitest covers domain and API behavior; Playwright covers browser flows.
- The production target is `npm run build` followed by `npm start` on `http://localhost:3000`.

## Phase checklist and evidence

### Phase 0 — Isolate and govern the project

- [x] Create the isolated Desktop workspace.
- [x] Create the active project goal.
- [x] Scaffold the Next.js repository.
- [x] Create the durable implementation plan and prompt log.
- [x] Create and push the public GitHub repository.

Exit evidence: public repository created at `https://github.com/nowonderwhyy/stillway-flight-booking` from commit `97fe882`.

### Phase 1 — Product and visual foundation

- [x] Lock the design tokens, content hierarchy, responsive layout, and trust language.
- [x] Generate one original cinematic hero image and a coordinated destination set.
- [x] Record the happy path and responsive behavior before feature coding.

Exit evidence: `docs/PRODUCT_DESIGN.md` plus seven optimized original WebP assets under `public/images/`.

### Phase 2 — Scaffold, database, and seeded inventory

- [x] Install and configure application dependencies.
- [x] Add the Prisma SQLite schema and committed migrations.
- [x] Add idempotent future-dated seed generation with at least 20 available flights.
- [x] Add `db:setup`, `db:reset`, and `db:verify` commands.

Exit evidence: a clean migration and seed created 6 airports, 20 flight instances, and 10 directional routes. `npm run db:verify` prints the resolved path, schema status, inventory, routes, bookings, and earliest departure.

### Phase 3 — Backend and domain behavior

- [x] Implement validated flight search, booking, lookup, and health endpoints.
- [x] Implement atomic round-trip inventory updates.
- [x] Implement deterministic Journey Fit scoring and explanations.
- [x] Add clear expected-error responses without leaking stack traces.

Exit evidence: Zod-backed route handlers return explicit validation, lookup, inventory, and unexpected-error statuses. Integration tests proved two-leg creation, price locking, inventory decrement, lookup normalization, and complete rollback when a return leg lacks capacity.

### Phase 4 — Core booking interface

- [x] Build the homepage search and same-page results experience.
- [x] Build outbound/return selection with a persistent trip summary.
- [x] Build guest checkout, confirmation, and My Trips lookup.
- [x] Cover loading, empty, validation, inventory, lookup, and database errors.

Exit evidence: the production browser suite completed round-trip and one-way flows without placeholder screens, confirmed no-result messaging, recovered a persisted trip, and observed a real HTTP 409 sold-out conflict.

### Phase 5 — Journey Fit and premium polish

- [x] Add four presets and adjustable normalized weights.
- [x] Add original media, restrained motion, and responsive refinement.
- [x] Complete keyboard, focus, contrast, touch-target, and reduced-motion work.

Exit evidence: Chrome showed Value reorder ATL–SFO from Delta to United while Arrive Rested favored Delta, with visible scores and explanations. Narrow-width, keyboard, focus, imagery, console, and emulated reduced-motion checks passed.

### Phase 6 — Automated verification and local deployment

- [x] Add domain, API, component, and end-to-end tests.
- [x] Pass lint, type-checking, tests, and production build.
- [x] Verify clean setup and the deterministic localhost production workflow.

Exit evidence: 13 Vitest tests and 3 Playwright scenarios pass, alongside ESLint, TypeScript, and the optimized Next.js build. The production health endpoint reports SQLite connectivity and non-sensitive counts.

### Phase 7 — Chrome-led visual QA and troubleshooting

- [x] Exercise the production build in Chrome at desktop, laptop, and mobile sizes.
- [x] Check console/network health, layout, keyboard navigation, and reduced motion.
- [x] Complete a real booking and prove persistence with My Trips and `db:verify`.
- [x] Capture final screenshots and record every material fix.

Exit evidence: `docs/QA_REPORT.md` records the Chrome walkthrough, browser signals, four release screenshots, the persisted `STW-F6F4AE` QA booking, and the post-booking database count.

### Phase 8 — Submission packaging

- [x] Finalize the public repository and clean-clone rehearsal.
- [x] Finalize README, prompt log, demo script, screenshots, and submission checklist.
- [x] Hand the final recording and YouTube upload to the student, per the 2026-08-02 scope change.
- [x] Verify the implementation, documentation, public repository, and localhost demo so the active implementation goal can be closed.

Exit evidence: the final public `master` branch was cloned into a new directory without a `.env` or database. The exact release workflow created SQLite, applied the migration, seeded 20 flights, reported 10 directional routes and 0 initial bookings, passed lint and TypeScript, passed 13 Vitest tests and 3 Playwright scenarios, and produced the optimized Next.js build. Video recording and upload remain outside the implementation scope by explicit student request.

## Interface contract

- `GET /api/flights`: `origin`, `destination`, `date`, and `travelers` query parameters.
- `POST /api/bookings`: selected flight IDs, traveler count, name, email, phone, and seat preference.
- `POST /api/bookings/lookup`: confirmation code plus normalized email.
- `GET /api/health`: non-sensitive database connectivity and record counts.

Shared domain types include `FlightSearchInput`, `FlightResult`, `JourneyWeights`, `JourneyScoreBreakdown`, `CreateBookingInput`, `BookingConfirmation`, and `BookingLookupInput`. Money is stored as integer cents. Timestamps are UTC in storage and formatted with airport IANA timezones. Booking legs retain the booking-time price.

## Acceptance criteria

- A clean setup produces at least 20 available SQLite flight records.
- One-way and round-trip searches and bookings work without placeholder behavior.
- A round-trip booking creates one booking and two legs and decrements both inventories atomically.
- Journey Fit deterministically changes result order and explains its scoring.
- Confirmation and My Trips remain valid after refresh and server restart.
- My Trips requires the matching confirmation code and email.
- No real payment, account system, or live-flight claim is implied.
- The production localhost build, public repository, and required implementation documents are complete; the student owns the final sub-2:30 recording and upload.

## Revision log

- **2026-08-01 — Plan approved:** Established the phased implementation, manual review record, local deployment boundary, public repository choice, real-carrier sample-data policy, Journey Fit behavior, and submission evidence strategy.
- **2026-08-01 — Execution started:** Created the active project goal and generated the Next.js workspace. The scaffold reported dependency advisories; review was added to the verification work instead of applying a forced downgrade.
- **2026-08-01 — Phases 0–1 complete:** Created and pushed the public repository, locked the Stillway product foundation, generated seven original editorial images with the built-in image workflow, and recorded the responsive UX architecture before feature coding.
- **2026-08-01 — Phases 2–5 complete:** Added the Prisma 7 SQLite domain, 20 future-dated seeded flights, validated route handlers, atomic booking transactions, the complete guest booking interface, Journey Fit ranking, original imagery, responsive polish, and accessibility behavior.
- **2026-08-01 — Phase 6 complete:** Added 11 domain/integration/component tests and three isolated Playwright production scenarios. Lint, TypeScript, tests, dependency audit, database verification, and the optimized build passed.
- **2026-08-01 — Phase 7 complete:** Used the Chrome extension to test the real production app at desktop and narrow widths, complete and refresh a two-leg booking, recover it through My Trips, inspect console output, verify keyboard order and reduced motion, and capture four release screenshots.
- **2026-08-02 — Video handoff:** The student explicitly took ownership of recording and uploading the final video. Recording automation was removed from the project; the timed `DEMO_SCRIPT.md` remains as the handoff guide.
- **2026-08-02 — Phase 8 implementation complete:** A first clean checkout exposed that Prisma's Windows migration engine would not create a missing SQLite file. Added a cross-platform preparation step, pushed the fix, then repeated the rehearsal from a second untouched checkout with no `.env`. Database setup, verification, lint, type-checking, 13 Vitest tests, the production build, and 3 Playwright scenarios all passed.
