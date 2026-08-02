# Stillway Release QA Report

- QA date: 2026-08-01
- Target: Next.js production server on `http://127.0.0.1:3000`
- Primary hands-on surface: Codex Chrome extension

## Automated gate

- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: 4 files and 13 tests passed
- `npm run build`: passed; all pages and route handlers compiled
- `npm run test:e2e`: 3 Chromium scenarios passed

The browser suite covers a default ATL–SFO round trip through confirmation and My Trips, one-way checkout, no-result behavior, health connectivity, and a seat-exhaustion conflict returning HTTP 409.

## Chrome walkthrough

- Hero, imagery, search controls, and sample-data language rendered with no console warnings or errors.
- All six local images loaded through Next.js image optimization without remote dependencies.
- Desktop layout reported no horizontal overflow.
- Value changed the first ATL–SFO result from Delta at $328 to United at $271; Arrive Rested returned Delta to the top. Scores and explanations changed with the preset.
- Outbound and return selection produced one summary totaling $530.
- A real booking produced confirmation `STW-F6F4AE` at an unguessable UUID URL.
- Refresh retained the confirmation; My Trips recovered the same two-leg itinerary using the code and normalized email.
- `npm run db:verify` after the walkthrough reported 20 flights, 10 directional routes, and 1 booking.
- Narrow viewport emulation reported equal document and scroll widths, with full-width flight cards and no page overflow.
- Keyboard tab order began with home, Explore, My Trips, then the hero action, matching the visible structure.
- Reduced-motion emulation matched the media query, changed document scrolling to `auto`, removed hero transforms, and reduced CSS transitions to an effectively instant duration.

## Fixes from verification

1. Added an explicit Vitest include pattern so Playwright specifications are not collected as unit tests.
2. Isolated Playwright state by copying the seeded runtime database to an ignored E2E database before starting its production server.
3. Updated the no-result test to select one-way before using a later departure date, avoiding an intentional native return-date constraint.
4. Tightened server date validation so impossible calendar dates such as February 30 are rejected.

## Release screenshots

- `docs/screenshots/01-hero-search.png`
- `docs/screenshots/02-journey-fit-results.png`
- `docs/screenshots/03-booking-summary.png`
- `docs/screenshots/04-confirmation.png`

No release-blocking console errors, broken images, page overflow, persistence failures, stale lookup state, or unexplained Journey Fit behavior remained at the end of the walkthrough.
