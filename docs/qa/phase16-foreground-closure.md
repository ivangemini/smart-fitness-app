# Phase 16 Foreground Proactive Coach Closure Evidence

Updated: 2026-08-19

This document records the source/CI closure boundary for the first reviewed **Phase 16 — Proactive Coach** foreground slice. It does not claim push/background delivery, production rollout, model-triggered autonomy, physical-device evidence, or automatic plan mutation.

## Verified checkpoint

- Mobile `main`: `11282c8d65d15c60c27f27aa41806b374101dbd5` (#772).
- Backend `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270); no backend change was required for this deterministic foreground slice.

## Reviewed sequence

- **#770 — proactive insight selector foundation.** Adds bounded deterministic selection for notable strength progression, conservative strength stagnation and positive consistency change. Source input is bounded before analytics. Stable evidence-derived keys support deduplication. Local-day semantics are used where consistency evidence depends on training days.
- **#771 — account-scoped presentation state.** Adds schema-versioned local presentation memory with global seven-day cooldown, stable dismissed evidence keys, account scoping, account-deletion cleanup and privacy inventory coverage.
- **#772 — authenticated Companion foreground card.** Surfaces at most one eligible insight inside Companion, records cooldown before presentation, fails closed when presentation persistence is unavailable, persists dismissal before hiding the card, localizes neutral EN/RU copy and routes evidence to the relevant Progress drill-down.

## Product and safety invariants

The reviewed foreground slice enforces:

- one concise proactive insight by default;
- deterministic evidence selection outside model prompts;
- bounded source history and explicit evidence/sample thresholds;
- a global seven-day presentation cooldown;
- stable evidence-key dismissal/deduplication;
- no guilt, punishment, streak-loss or compulsive engagement mechanics;
- no reward for repeated same-day workouts, food restriction, weight loss or medical testing;
- no automatic workout, program, nutrition, goal, Labs or safety mutation;
- no Home takeover, badge loop, push/background delivery or notification firehose;
- no separate Coach/Companion recommendation authority;
- storage failure fails closed rather than repeatedly surfacing the same insight.

## Evidence handoff

Strength insights route to **Strength & Training** with the relevant exercise preselected. Canonical exercise ID is preferred; legacy name-based sessions use the established normalized-name fallback. Consistency insight evidence routes to **Activity**.

The destination rebuilds facts from canonical application state. Route params remain selectors rather than serialized private state or broad analytics payloads.

## Validation

#770, #771 and #772 were merged only after their required exact-head Mobile CI passed. #772 exact-head CI passed:

- repository file line audit;
- changed-file line limit;
- TypeScript;
- full regression suite;
- expanded-model smoke;
- Expo export;
- Expo Doctor.

The initial #772 CI run found a test-fixture TypeScript literal widening issue (`schemaVersion: 1` inferred as `number`). The fixture was typed explicitly; production logic was unchanged, and the resulting exact head passed the complete authoritative gate.

## Closure classification

**Phase 16 foreground Proactive Coach v1 is source/CI-complete for the reviewed deterministic Companion-card scope.**

This closure does not authorize or claim:

- push, background scheduling or OS notification delivery;
- provider/model-triggered proactive generation;
- production rollout or physical-device accessibility evidence;
- goal-aware proactive observations beyond currently canonical goal facts;
- automatic application of Coach recommendations or plan changes.

Further Phase 16 expansion requires a new purpose-specific contract. Phase 17 may now reuse the existing fitness-profile goal authority for typed goal-relative facts without creating a second source of truth.
