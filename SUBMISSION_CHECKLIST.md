# Stillway Submission Checklist

## Links

- Public repository: https://github.com/nowonderwhyy/stillway-flight-booking
- Demo video: student-owned final recording and upload

## Required artifacts

- [x] Public source repository
- [x] SQLite schema and migration
- [x] Idempotent seed logic with 20 flights
- [x] `IMPLEMENTATION_PLAN.md` with manual-review evidence
- [x] `PROMPT_LOG.md`
- [x] `README.md` with deterministic localhost instructions
- [x] `DEMO_SCRIPT.md` targeting 2:15
- [x] Four polished release screenshots
- [x] Production build and browser test evidence
- [ ] YouTube demo link shorter than 2:30 — student handoff item
- [x] Clean-clone rehearsal after final implementation push

## Privacy gate

- [x] Runtime `.env` ignored; `.env.example` contains no secret
- [x] Runtime SQLite and personal booking rows ignored
- [x] Browser traces and reports ignored
- [x] Original image working PNGs ignored; optimized WebP assets tracked
- [x] Course transcripts and unrelated paths excluded
- [x] No airline logos, credentials, payment data, or live-flight claims

## Final command gate

```powershell
npm ci
npm run db:setup
npm run db:verify
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The implementation package is complete independently of the student-owned video step. Add the final YouTube URL above and to the README immediately before course submission.
