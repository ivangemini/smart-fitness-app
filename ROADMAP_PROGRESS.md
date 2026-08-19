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
- **Phase 16 — Proactive Coach: deterministic foreground Companion-card slice source/CI-complete through #770–#772.**
- **Phase 17 — Goals & Planning: next executable product source phase, reusing existing fitness-profile goal authority.**

## Current verified checkpoint

### Mobile

Current `main`: `11282c8d65d15c60c27f27aa41806b374101dbd5` (#772).

Phase 15 mobile includes bounded Coach capabilities/selective retrieval (#749–#751), compact Progress IA/current drill-downs (#755–#764), and selector-only exercise, Weight, Measurements, Activity and Highlights Progress → Companion handoffs through #768.

Phase 16 foreground includes:

- #770 deterministic bounded selector for notable strength progression, conservative stagnation and positive consistency change;
- #771 account-scoped schema-versioned cooldown/dismissal state with privacy/account-cleanup integration;
- #772 one authenticated Companion card, persistence-before-display, fail-closed storage behavior, neutral localized copy and evidence-specific Progress navigation.

#772 passed exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Focused closure evidence: `docs/qa/phase16-foreground-closure.md`.

### Backend

Current verified backend `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

Backend Phase 15 question infrastructure includes minimal-scope routing (#266), minimized evidence and strict structured answers (#267), authenticated read-only question API composition (#269), and bounded confirmed Labs overview/marker-history evidence (#270). No backend change was required for the deterministic Phase 16 foreground slice.

## Phase 15 — closure status

P15-A through P15-F remain source/CI-complete for the reviewed scope. Detailed evidence and boundary notes remain in `docs/qa/phase15-closure.md`.

Permanent Phase 15 invariants remain:

- purpose-specific bounded data access;
- deterministic analytics outside model prompts;
- read-only Coach orchestration unless the user explicitly confirms a separately reviewed mutation flow;
- compact Progress progressive disclosure;
- selector-only Progress ↔ Companion handoffs;
- raw Labs documents/unconfirmed drafts outside ordinary Coach context;
- missing evidence remains missing.

## Phase 16 — foreground closure

The reviewed first Proactive Coach product slice is complete for source/CI evidence.

### Completed

- deterministic trigger/evidence contracts;
- bounded source input before analytics;
- stable evidence-derived deduplication keys;
- seven-day global presentation cooldown;
- account-scoped dismissal memory and deletion cleanup;
- one concise foreground Companion card;
- neutral EN/RU copy;
- targeted evidence drill-down to Strength & Training or Activity;
- fail-closed presentation when storage is unavailable;
- explicit anti-compulsion/no-auto-mutation boundaries.

### Not included

- Home takeover;
- push/background/OS notification delivery;
- provider/model-triggered proactive generation;
- badges, streak-loss or punitive engagement mechanics;
- automatic workout/program/nutrition/goal/Labs/safety mutation;
- production rollout or signed physical-device evidence.

Further Phase 16 expansion requires a newly reviewed purpose/delivery contract rather than widening the current selector implicitly.

## Phase 17 — Goals & Planning

### Existing authority

Goal-related state already exists in the canonical fitness profile and synchronization path:

- `goalType`;
- `targetWeight`;
- `weeklyWeightChangeGoal`;
- `trainingDaysPerWeek`.

The existing Profile goals editor already mutates these fields through `updateProfileGoals`, with explicit confirmation around related nutrition-target recalculation.

### Initial execution direction

1. Build typed deterministic goal facts over existing fitness-profile state, weight history and completed training history.
2. Add neutral goal-relative Progress context without universal scores or inferred body composition.
3. Expose only minimum typed goal context to Coach where a reviewed question scope needs it.
4. Preserve explicit confirmation for any future planning or nutrition/program mutation.
5. Add a new persisted goal entity only if a reviewed requirement cannot be safely represented by the current profile authority; define migration/sync/conflict/deletion semantics first if that threshold is reached.

## Remaining Phase 14 gates

- **Push:** staging-only APNs/FCM material, bounded provider sends, signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** staging-only private S3-compatible storage plus Gemini material, configured-provider readiness, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Keep Phase 15 closed unless a reproduced defect, failed invariant or new reviewed capability requires reopening it.
2. Treat Phase 16 foreground v1 as complete for the reviewed deterministic Companion-card scope; expand only under a separate contract.
3. Execute Phase 17 typed goal facts and goal-aware Progress/Coach context over the existing fitness-profile authority.
4. Execute Phase 14 provider/device evidence independently whenever its prerequisites become available.
5. Repair reproduced defects; do not manufacture unrelated cleanup work.

## Authorization / release boundary

Source/CI closure does not relax provider, native/device, production or medical-safety controls. Those remain governed by current `AGENTS.md`, least privilege, privacy, preflight, evidence, recovery and rollback requirements.