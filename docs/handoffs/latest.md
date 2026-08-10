# Latest Handoff

Updated: 2026-08-10

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `976ea57e2da8753ca990bc2fad151b384a8ccee3`.
- Latest runtime merge: PR #593 `fix: converge Workouts History floating material`.
- PR #593 exact validated head: `1edade7075999ba5bc210fe8456a3d73531d0a2b`; Mobile CI #2124 passed the complete Hermes gate before merge.
- PR #591 residual Coach navigation exact validated head: `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`; Mobile CI #2122 passed before merge.
- PR #590 Safety & Recovery Review virtualization exact validated head: `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`; Mobile CI #2118 passed before merge.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Open backend PR #215 `Route routine backend CI to Hermes` remains draft/open and must not merge without real exact-head required Hermes validation.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- Active priority: **LG-5 QA and bounded polish, validation-first.**
- **Coach product/material expansion remains deferred.**

## LG-5 runtime progress

Merged demonstrated-defect batches now total 23 and run through PR #593:

- #559 Create Program keyboard/safe-area reachability.
- #560 Program Add Workout short-height/large-text resilience plus New Routine notes 44 px interaction minimum.
- #561 shared text resilience.
- #565 shared SectionHeader active-theme consistency.
- #567 shared state active-theme consistency.
- #568 auth/account appearance consistency.
- #569 onboarding appearance consistency.
- #570 Exercise Detail loading-state ownership.
- #571 Share Workout state/theme resilience.
- #572 Coach history nested theme consistency.
- #573 paginated Social collection virtualization.
- #574 workout-post comment virtualization.
- #577 completed-workout exercise-group virtualization.
- #579 Workout Template Detail exercise virtualization.
- #580 Progress body-measurement keyboard reachability.
- #581 Coach Run History virtualization.
- #583 Account Sessions virtualization.
- #584 User Limitations virtualization.
- #585 Sync Conflict Review virtualization.
- #586 Active Session exercise virtualization.
- #590 Safety & Recovery Review restriction/finding virtualization.
- #591 residual Coach navigation convergence to shared `LiquidGlassIconButton`.
- #593 Workouts History floating action convergence to shared elevated `LiquidGlassSurface`.

PR #576 remains a scope/documentation audit rather than a runtime package. Completed workout history is an immutable read surface in the current product contract; do not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

Latest validation evidence:

- #590: Mobile CI #2118 green on exact head `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`.
- #591: Mobile CI #2122 green on exact head `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`.
- #593: Mobile CI #2124 green on exact head `1edade7075999ba5bc210fe8456a3d73531d0a2b`.

For #593, the confirmed live defect was limited to the Workouts tab History floating control: its local opaque material and opacity-only pressed state violated the elevated-floating-control contract. The fix preserves `/workout-history`, localization/accessibility, floating-tab safe-area clearance and 44 pt geometry while delegating visible material to shared elevated Liquid Glass with bounded blur and tokenized fill feedback.

## CI execution

- #562 moved routine authoritative Mobile CI to Hermes.
- #563 removed only duplicate merge-generated post-merge Mobile CI runs.
- #564 persisted the runner policy in mobile `AGENTS.md`.
- Backend #216 persisted the backend policy.
- Backend #215 still requires real exact-head Hermes execution before merge; do not weaken the policy or move routine validation back to hosted runners merely to clear the queue.

## Contracts to preserve during LG-5

Do not casually rewrite tuned `Set / Previous / weight / reps / RPE` table semantics, active-session persistence/finish/discard lifecycle, RPE value/select/skip behavior, workout/program create/edit/save/reorder/attach/favorite/delete semantics, completed-history read-only retention/navigation, body-measurement validation/persistence, safety/recovery decision/acknowledgement behavior, private persistence/sync schemas, Social server authority/privacy/chronological Following semantics, cursor/pagination and reaction/comment/report/relationship actions, Coach API/filter/auth/retry/navigation contracts, or backend API/revision/idempotency/ownership contracts.

Potentially long collections should use one suitable virtualized list boundary with stable identity rather than eager accumulation or same-axis nested virtualized lists. Keyboard-open forms must retain active-input and primary-action reachability.

## Next work

Continue LG-5 validation-first inspection against light/dark/system appearance, narrow/short phone geometry, safe areas, increased text size/long EN-RU copy, keyboard-open forms, state variants, long collections/stable identity, Active Session lifecycle, workout create/edit/save/program attachment, completed-history read-only review, and elevated material/blur fallback behavior.

Current bounded evidence:

- **There is no pre-authorized runtime package after PR #593.** Inspect first; change source only for a newly demonstrated defect.
- `QuickActionsCard` currently keys secondary actions by localized/displayed `action.label`. This is an identity smell, but repository code search is not indexed and live usage has not yet been established; verify usage before changing its API.
- The Workouts History floating-material mismatch is resolved by #593.
- Post-#593 no-change audit: Home/Profile already use shared `LiquidGlassIconButton`; Coach tab actions use shared `AppButton`; Nutrition calendar/Today controls already use tokenized material/pressed states and the 36 pt meal-add visual control has `hitSlop={12}` inside its 52 pt header; Settings already uses shared navigation/action controls with safe-area-aware scrolling. Do not churn these surfaces without new evidence.
- Weight Details remains bounded to 10 recent weigh-ins.
- `ProgramDetailScreen` remains bounded by the seven-day `WeekdayKey` structure.
- User Limitations, Sync Conflict Review, Active Session and Safety & Recovery Review long-collection candidates are resolved by #584, #585, #586 and #590.

If inspection shows no defect, record/reuse no-change evidence and move on. If it shows a concrete defect, fix the smallest coherent boundary and merge only an exact fully green runtime head.

## Backend #215

Do not merge #215 merely because the workflow files look correct. Required validation must actually run on the exact intended head. Do not move routine validation back to GitHub-hosted runners just to bypass an unavailable Hermes assignment unless the CI policy's demonstrated-outage/incompatibility exception is genuinely met and separately reviewed.

## Other priorities

- Stories image-only v1 remains source-complete and server-authoritative; no mock/demo Stories.
- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains intentionally deferred; bounded live-surface QA fixes do not reopen it.

## Documentation / CI guard

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve both explicit source-refactor authorization markers unless deliberately changing the contract: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Authorization boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
