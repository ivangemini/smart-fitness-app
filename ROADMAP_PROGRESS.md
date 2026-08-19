# Smart Fitness Roadmap Progress

Updated: 2026-08-19

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI and Git history override stale prose.

Focused roadmap references retained as stable contracts:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`.

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete, including repository-wide convergence closure.
- Stories S10: source/CI plus isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: baseline retained. Companion is the presentation/character of the existing Coach, not a separate assistant.
- Phase 14: autonomous source/runtime preparation is complete for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics: active and substantially implemented.**
- **Phase 16 — Proactive Coach: planned successor.**
- **Phase 17 — Goals & Planning: planned successor.**

## Current verified checkpoint

### Mobile

Current `main`: `bb48f0452690f0b33e824eea18aae8fb61a7fc2d` (#764).

Phase 15 mobile progression through #755–#764 now includes compact Progress IA, bounded weight details, deterministic exercise series, Strength & Training drill-down, Activity drill-down, Highlights drill-down, Body measurement drill-down, plus reviewed exercise and weight Progress → Companion contextual handoffs.

### Backend

Current verified backend `main`: `92fbf47d3bf10725e11ee43ccf61eba042abcba1` (#267).

Backend Phase 15 question infrastructure now includes the minimal-scope question router (#266) and minimized evidence + strict structured-answer boundary (#267). #267 passed exact-head Backend CI before merge.

## Phase 15 — workstream status

### P15-A — Bounded Coach data access

Purpose-specific typed retrieval foundations exist across current mobile and backend contracts. Raw application state, raw Labs documents, unconfirmed drafts, provider payloads and secrets remain outside model-visible context.

**Status:** active; extend only when a reviewed question requires a new minimal scope.

### P15-B — Deterministic analytics

Shared deterministic progress/training analytics are already consumed by current Progress surfaces, including bounded periods, exercise progression and body/activity/highlight summaries.

**Status:** substantially implemented; add facts only where evidence quality and reuse justify them.

### P15-C — Coach retrieval/orchestration

Completed foundation:

- question → minimal supported scope routing (#266);
- minimal model-visible evidence assembly (#267);
- structured answer contract with explicit evidence scopes, caveats, data quality and confidence (#267);
- fail-closed unsupported routes and evidence-scope mismatches (#266/#267).

**Next:** compose the reviewed pieces into an authenticated read-only end-to-end question orchestration/API path. Do not add automatic mutation.

### P15-D — Progress IA and drill-down

Completed through #764:

- compact Body / Strength & Training / Activity / Highlights overview;
- weight details;
- body measurement detail;
- Strength & Training detail;
- Activity detail;
- Highlights detail;
- deliberate period/exercise selection where relevant;
- textual/empty-state fallbacks instead of rendering unsupported charts.

**Status:** source/CI-complete for the currently reviewed drill-down set.

### P15-E — Coach ↔ Progress linking

Completed reviewed contexts:

- selected exercise/period Progress → Companion (#760);
- weight/period Progress → Companion (#762).

Both rebuild bounded facts inside Coach rather than transporting raw state.

**Status:** partially complete. Further contexts require equivalent metric-level minimization and fail-closed parsing.

### P15-F — Closure

Remaining after the orchestration/linking contracts stabilize:

- accessibility review;
- performance/regression review;
- exact-head CI for final source packages;
- canonical docs synchronization and closure checkpoint.

## Remaining Phase 14 gates

- **Push:** staging-only APNs/FCM material, bounded provider sends, signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** staging-only private S3-compatible storage plus Gemini material, configured-provider readiness, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Current execution order

1. Finish P15-C authenticated read-only question orchestration/API composition.
2. Extend P15-E only for explicitly reviewed minimal contexts where it materially improves the product.
3. Run P15-F accessibility/performance/regression and documentation closure.
4. Execute Phase 14 provider/device evidence independently whenever prerequisites become available.
5. Repair reproduced defects; do not manufacture unrelated cleanup work.
6. Do not start Phase 16 or Phase 17 source expansion before Phase 15 contracts stabilize.

## Authorization / release boundary

Phase 15 does not relax provider, native/device or production controls. Those remain governed by current `AGENTS.md`, least privilege, privacy, preflight, evidence, recovery and rollback requirements.
