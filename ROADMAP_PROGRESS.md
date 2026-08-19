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
- Phase 13 Companion v1: retained. Companion is the presentation/character of the existing Coach, not a separate assistant.
- Phase 14: autonomous source/runtime preparation is complete for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics: source/CI-complete for the currently reviewed scope.**
- **Phase 16 — Proactive Coach: next planned product source phase.**
- **Phase 17 — Goals & Planning: planned after the relevant Phase 16 contracts.**

## Current verified checkpoint

### Mobile

Current `main`: `bf302de39c1190f736f17c731f0d2fac2f41e569` (#768).

Phase 15 mobile now includes bounded Coach capabilities/selective retrieval (#749–#751), compact Progress IA and current drill-down set (#755–#764), plus selector-only exercise, Weight, Measurements, Activity and Highlights Progress → Companion contextual handoffs (#760, #762, #766, #767, #768).

#768 passed exact-head Mobile CI and hardens the Highlights handoff by filtering session input to the 90-day Coach window before analytics. Longer-history all-time record evidence remains Progress-only.

### Backend

Current verified backend `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

Backend Phase 15 question infrastructure now includes minimal-scope routing (#266), minimized evidence and strict structured answers (#267), authenticated read-only question API composition (#269), and bounded confirmed Labs overview/marker-history evidence (#270). #269/#270 passed authoritative Backend CI before merge.

## Phase 15 — closure status

### P15-A — Bounded Coach data access

Purpose-specific typed retrieval exists for the reviewed workout/exercise/program/profile/body/nutrition/safety/Labs needs. Raw application state, raw Labs documents, unconfirmed drafts, provider payloads and secrets remain outside model-visible context.

**Status:** source/CI-complete for the reviewed capability set.

### P15-B — Deterministic analytics

Shared deterministic progress/training analytics support current Progress and Coach facts with bounded periods, evidence/sample semantics and fail-closed missing data.

**Status:** source/CI-complete for the current reviewed fact set.

### P15-C — Coach retrieval/orchestration

Completed:

- question → minimal supported scopes (#266);
- minimized model-visible evidence and strict output contract (#267);
- authenticated read-only `/v1/coach/questions` composition (#269);
- confirmed structured Labs overview/history scope (#270).

**Status:** source/CI-complete for strength, nutrition, safety/recovery and confirmed structured Labs question scopes. Automatic mutation remains prohibited.

### P15-D — Progress IA and drill-down

Completed current set:

- compact Body / Strength & Training / Activity / Highlights overview;
- Weight detail;
- Body measurement detail;
- Strength & Training detail;
- Activity detail;
- Highlights detail;
- deliberate period/exercise selection and textual/empty-state fallbacks.

**Status:** source/CI-complete.

### P15-E — Coach ↔ Progress linking

Completed reviewed contextual handoffs:

- exercise/period (#760);
- Weight/period (#762);
- measurement/period (#766);
- Activity/period (#767);
- Highlights/period (#768).

All rebuild facts inside Companion and pass selector context rather than raw state. **Status:** source/CI-complete for the current drill-down set.

### P15-F — Closure

Closure review found and fixed one substantive boundary issue in #768: older sessions are now removed before Highlights Companion analytics rather than merely dropping all-time output fields. Existing shared UI/touch-target/safe-area contracts and exact-head CI cover the current source surfaces; no speculative accessibility refactor was justified.

Focused evidence matrix: `docs/qa/phase15-closure.md`.

**Status:** complete for source/CI evidence. This does not claim signed physical-device, provider or production rollout evidence.

## Remaining Phase 14 gates

- **Push:** staging-only APNs/FCM material, bounded provider sends, signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** staging-only private S3-compatible storage plus Gemini material, configured-provider readiness, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Keep Phase 15 closed unless a reproduced defect, failed invariant or new reviewed capability requires reopening it.
2. Execute Phase 14 provider/device evidence independently whenever its prerequisites become available.
3. Begin Phase 16 Proactive Coach under its own reviewed frequency, dismissal, relevance and anti-compulsion contracts, reusing Phase 15 bounded deterministic facts.
4. Begin Phase 17 Goals & Planning only after typed goal ownership/state semantics are reviewed.
5. Repair reproduced defects; do not manufacture unrelated cleanup work.

## Authorization / release boundary

Phase 15 source closure does not relax provider, native/device, production or medical-safety controls. Those remain governed by current `AGENTS.md`, least privilege, privacy, preflight, evidence, recovery and rollback requirements.