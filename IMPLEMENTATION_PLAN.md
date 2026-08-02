# Stillway Flight Booking Application — Implementation Plan

> Status: Active  
> Product: Stillway — “Travel at your rhythm.”  
> Working directory: `C:\Users\paulk\Desktop\stillway-flight-booking`

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
- [ ] Create and push the public GitHub repository.

Exit evidence: pending first public push.

### Phase 1 — Product and visual foundation

- [ ] Lock the design tokens, content hierarchy, responsive layout, and trust language.
- [ ] Generate one original cinematic hero image and a coordinated destination set.
- [ ] Record the happy path and responsive behavior before feature coding.

Exit evidence: pending.

### Phase 2 — Scaffold, database, and seeded inventory

- [ ] Install and configure application dependencies.
- [ ] Add the Prisma SQLite schema and committed migrations.
- [ ] Add idempotent future-dated seed generation with at least 20 available flights.
- [ ] Add `db:setup`, `db:reset`, and `db:verify` commands.

Exit evidence: pending.

### Phase 3 — Backend and domain behavior

- [ ] Implement validated flight search, booking, lookup, and health endpoints.
- [ ] Implement atomic round-trip inventory updates.
- [ ] Implement deterministic Journey Fit scoring and explanations.
- [ ] Add clear expected-error responses without leaking stack traces.

Exit evidence: pending.

### Phase 4 — Core booking interface

- [ ] Build the homepage search and same-page results experience.
- [ ] Build outbound/return selection with a persistent trip summary.
- [ ] Build guest checkout, confirmation, and My Trips lookup.
- [ ] Cover loading, empty, validation, inventory, lookup, and database errors.

Exit evidence: pending.

### Phase 5 — Journey Fit and premium polish

- [ ] Add four presets and adjustable normalized weights.
- [ ] Add original media, restrained motion, and responsive refinement.
- [ ] Complete keyboard, focus, contrast, touch-target, and reduced-motion work.

Exit evidence: pending.

### Phase 6 — Automated verification and local deployment

- [ ] Add domain, API, component, and end-to-end tests.
- [ ] Pass lint, type-checking, tests, and production build.
- [ ] Verify clean setup and the deterministic localhost production workflow.

Exit evidence: pending.

### Phase 7 — Chrome-led visual QA and troubleshooting

- [ ] Exercise the production build in Chrome at desktop, laptop, and mobile sizes.
- [ ] Check console/network health, layout, keyboard navigation, and reduced motion.
- [ ] Complete a real booking and prove persistence with My Trips and `db:verify`.
- [ ] Capture final screenshots and record every material fix.

Exit evidence: pending.

### Phase 8 — Submission packaging

- [ ] Finalize the public repository and clean-clone rehearsal.
- [ ] Finalize README, prompt log, demo script, screenshots, and submission checklist.
- [ ] Record a 2:15 target demo, upload a video shorter than 2:30, and add its URL.
- [ ] Mark the active goal complete only after all artifacts are verified.

Exit evidence: pending.

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
- The production localhost build, public repository, required documents, and sub-2:30 demo are complete.

## Revision log

- **2026-08-01 — Plan approved:** Established the phased implementation, manual review record, local deployment boundary, public repository choice, real-carrier sample-data policy, Journey Fit behavior, and submission evidence strategy.
- **2026-08-01 — Execution started:** Created the active project goal and generated the Next.js workspace. The scaffold reported dependency advisories; review was added to the verification work instead of applying a forced downgrade.

