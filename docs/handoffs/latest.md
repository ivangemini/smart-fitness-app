# Latest Handoff

Updated: 2026-08-10

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `975440b6098fb4aebf6d874acca87be581334ed4`.
- Latest runtime merge: PR #565 `Fix LG-5 SectionHeader theme consistency`.
- PR #565 exact validated head: `1a60e87b64db0d87ec99c6ad5c6f47002cf87dde`; Mobile CI #2049 passed before merge.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Only open project PR at this checkpoint: backend #215 `Route routine backend CI to Hermes`, draft at exact head `0826ff18dac7d4afe78943d9881c5a530507f1af`.
- #215 remains blocked: its Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI runs are queued and have not produced exact-head validation evidence.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- Active priority: **LG-5 QA and bounded polish, validation-first.**
- **Coach material remains deferred.**

## What changed after the LG-4 checkpoint

LG-5 has already produced four bounded runtime fixes from demonstrated defects:

- **PR #559:** Create Program keyboard/safe-area reachability on short-height/increased-text layouts.
- **PR #560:** Program Add Workout choice-mode short-height/large-text scrolling plus New Routine notes 44 px interaction minimum; already-correct builder/editor/finish keyboard boundaries were deliberately left unchanged.
- **PR #561:** resilient long/localized text behavior for shared `ListRow`, destructive/tertiary buttons and `SegmentedControl`. Exact head `e16f8d961b4a128c4d7b1de5b4fc36d66342fd8e`; Mobile CI #2043 green.
- **PR #565:** shared `SectionHeader` now follows `AppThemeProvider` instead of `Colors.dark`. Exact head `1a60e87b64db0d87ec99c6ad5c6f47002cf87dde`; Mobile CI #2049 green.

CI execution also changed without product behavior:

- #562 moved routine authoritative Mobile CI to Hermes;
- #563 removed only duplicate merge-generated post-merge Mobile CI runs;
- #564 persisted the runner policy in `AGENTS.md`;
- backend #216 persisted the backend policy, but backend #215 still requires real exact-head Hermes execution before merge.

## Documentation audit result

The root instructions and complete documentation trees of both repositories were re-read on 2026-08-10.

Use these interpretation rules going forward:

- `docs/implementation-plan.md` + `docs/current-status.md` + this handoff + `docs/roadmap/liquid-glass.md` are the current Phase 11 source of truth.
- Old `ROADMAP_PROGRESS.md` Provider/P5 sequencing was stale and has been synchronized by the current docs checkpoint branch.
- Focused later backend privacy/export evidence overrides earlier planning notes that still label now-implemented source slices as future work.
- Historical documents remain historical; do not infer current work merely from an old `next slice` paragraph.
- Provider/staging/deployment/native/product activation remains authorization-gated even when source contracts are complete.
- Mobile `docs/backend/*` is historical design material; use the actual backend repo for current backend behavior.

## Contracts to preserve during LG-5

Do not casually rewrite:

- tuned `Set / Previous / weight / reps / RPE` table semantics;
- active-session persistence and finish/discard lifecycle;
- RPE value domain/select/skip behavior;
- workout/program create/edit/save/reorder/attach/favorite/delete semantics;
- completed-history retention and editable-history save/delete behavior;
- safety/recovery decision and acknowledgement behavior;
- private persistence/sync schemas;
- Social server authority/privacy;
- backend API/revision/idempotency/ownership contracts.

## Next work

Continue LG-5 by inspecting bounded secondary/shared surfaces against:

- light / dark / system appearance;
- narrow/short phone geometry and safe areas;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long exercise/history/program collections;
- Active Session set-entry/RPE/replace/finish/discard;
- workout create/edit/save/program attachment;
- completed-history read/edit/delete;
- elevated material and blur/fallback behavior.

If inspection shows no defect, do not create churn. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

## Backend #215

Do not merge #215 merely because the workflow files look correct. Required validation must actually run on the exact intended head. Do not move routine validation back to GitHub-hosted runners just to bypass an unavailable Hermes assignment unless the CI policy's demonstrated-outage/incompatibility exception is genuinely met and separately reviewed.

## Other priorities

- Stories image-only v1 remains source-complete and server-authoritative; no mock/demo Stories.
- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach material remains intentionally deferred.

## Documentation / CI guard

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve both explicit source-refactor authorization markers unless deliberately changing the contract: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Authorization boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
