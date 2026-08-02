# Stillway Product and Visual Foundation

## Brand promise

Stillway is a calm flight marketplace for people who want to understand the tradeoffs in a trip without opening five tabs. The product line is **“Travel at your rhythm.”** It should feel composed and premium, never exclusive or ornamental.

## Experience principles

1. **One surface, one decision at a time.** Search and results share the homepage. Outbound selection flows directly into return selection.
2. **Make tradeoffs legible.** Journey Fit never hides price, duration, timing, stops, or emissions behind a score.
3. **Trust through restraint.** Sample schedules are labeled, totals are explicit, and checkout clearly states that no payment occurs.
4. **Motion confirms state.** Movement is short, interruptible, and never required to understand the interface.
5. **Useful before decorative.** Every large image supports place and mood; all transactional controls remain high-contrast and plain-language.

## Design tokens

- Canvas: warm ivory `#f4f1e9`
- Surface: soft white `#fffdf8`
- Ink: deep slate `#18201d`
- Muted ink: `#66706b`
- Sage: `#8e9a83`
- Brass: `#a9824f`
- Hairline: `rgba(24, 32, 29, 0.12)`
- Positive: `#3f6b52`
- Warning: `#9a623b`
- Radius scale: 14 / 20 / 28 / full
- Shadow: low-contrast, broad, and warm; no hard card shadows
- Type: Geist Sans with tight display tracking and generous body leading

## Content hierarchy

1. Translucent top navigation: Stillway, Explore, My Trips, sample-data badge.
2. Editorial hero with the primary promise and original flight imagery.
3. A large “Start here” planner overlapping the hero boundary, with a three-step progress rail and visually grouped route, date, traveler, and search controls.
4. A short booking roadmap: real sample inventory, transparent priorities, and no-payment confirmation.
5. Same-page result workspace: Journey Fit controls, flight list, persistent trip summary.
6. Destination editorial cards.
7. Compact footer with sample-data and airline-name disclaimer.

## Happy path

1. Round trip is selected by default with ATL → SFO, one traveler, and dates derived from seeded inventory.
2. Search validates visible fields and scrolls to same-page results.
3. Journey Fit starts at Balanced and offers Spend Less, Arrive Rested, Fastest, and Lighter Impact presets. Each preset names its tradeoff. Optional tuning distributes a fixed 100-point preference budget, so raising one dimension necessarily lowers the others.
4. The traveler selects an outbound flight, then a return flight; the right rail updates immediately.
5. Continue opens a focused booking route with the selected itinerary retained in the URL and revalidated on the server.
6. Guest details are collected with a clear “Demo booking — no payment or charge” statement.
7. A real database transaction creates the booking and redirects to a refresh-safe confirmation URL.
8. My Trips requires the confirmation code and matching email.

## Responsive behavior

- **Desktop ≥ 1100px:** full hero, six-column search panel, result list plus sticky summary rail.
- **Tablet 720–1099px:** wrapped search grid, single result column, in-flow summary card.
- **Mobile < 720px:** compact hero, stacked planner, horizontally scrollable presets, full-width cards, and an in-flow trip summary before the flight list.
- No horizontal page overflow at 390px. All interactive targets are at least 44px. Focus order follows visual order.

## Motion rules

- Entry: 320–520ms opacity and small vertical travel.
- Selection: 180–240ms border, background, and scale feedback.
- Result reordering: layout animation only; no spinning or looping indicators.
- Reduced motion: remove position, scale, and parallax effects; keep short opacity changes.

## Original media inventory

All selected assets were generated with the built-in image-generation workflow, copied into the project, resized, and encoded as WebP. Prompts consistently requested refined natural editorial photography, quiet early light, restrained ivory/mist/slate color, card-friendly framing, and no people, text, logos, watermarks, oversaturation, or CGI treatment.

- `public/images/hero-flight.webp` — wide cloud-and-wing hero with left-side copy space.
- `public/images/atlanta.webp` — leafy Atlanta skyline origin card.
- `public/images/san-francisco.webp` — Golden Gate Bridge through morning mist.
- `public/images/new-york.webp` — Brooklyn Bridge and lower Manhattan.
- `public/images/miami.webp` — restrained Art Deco coast at sunrise.
- `public/images/seattle.webp` — skyline, Space Needle, evergreens, and Rainier haze.
- `public/images/chicago.webp` — calm architectural river view.

## Carrier policy

The interface may show real carrier names and IATA codes as plain text. It must not copy airline logos or imply live inventory, affiliation, schedule accuracy, or actual sale. Every result area and footer identifies the content as fictional sample data for a class demonstration.
