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

