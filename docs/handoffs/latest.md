# Latest Handoff

Updated: 2026-08-10

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `079817f30b625a9424a7be6011aa8b15d0de2676`.
- Latest runtime merge: PR #595 `fix: converge Weight Entry on shared FormField`.
- PR #595 exact validated head: `b09be182a5b55d8c5a19a7203adfa1a1b222efae`; Mobile CI #2126 passed the complete Hermes gate before merge.
- PR #593 exact validated head: `1edade7075999ba5bc210fe8456a3d73531d0a2b`; Mobile CI #2124 green.
- PR #591 exact validated head: `1ef8da30bebe13fa9b0407acb82ac44cb50208cd`; Mobile CI #2122 green.
- PR #590 exact validated head: `adeda4fc66490cd2e2ad05ca84454f962cc6c31d`; Mobile CI #2118 green.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open and blocked on real exact-head required Hermes validation.
- **LG-H2 Stories is complete for current image-only v1 source scope.**
- **LG-4 Workouts source convergence is complete.**
- Active priority: **LG-5 QA and bounded polish, validation-first.**
- **Coach product/material expansion remains deferred.**

## LG-5 runtime progress

Merged demonstrated-defect runtime batches now total 24 and run through PR #595. Earlier package detail is retained in `docs/current-status.md`; the newest three are:

- #591 residual Coach navigation convergence to shared `LiquidGlassIconButton`.
- #593 Workouts History floating action convergence to shared elevated `LiquidGlassSurface`.
- #595 Weight Entry convergence to shared `FormField` and shared accessibility/focus/error ownership.

PR #576 remains a scope/documentation audit rather than a runtime package. Completed workout history is an immutable read surface in the current product contract; do not invent edit/delete UI from generic session state actions. See `docs/qa/lg5-completed-history-scope.md`.

## Latest package — PR #595

Confirmed defect: Weight Entry duplicated a label/TextInput/error recipe despite the shared `FormField` already owning programmatic accessibility label, focus state, error border and `InlineError`.

Fix preserves `parseDisplayNumber`, `displayWeightInputToKg`, canonical kg persistence through `addWeightEntry`, UUID/date creation, decimal keyboard, keyboard-aware scrolling, safe-area bottom clearance and save/cancel routing.

Exact validation: Mobile CI #2126 green on `b09be182a5b55d8c5a19a7203adfa1a1b222efae` across line audits, TypeScript, full regression, model smoke, Expo export and Expo Doctor.

## CI execution

- #562 moved routine authoritative Mobile CI to Hermes.
- #563 removed only duplicate merge-generated post-merge Mobile CI runs.
- #564 persisted the runner policy in mobile `AGENTS.md`.
- Backend #216 persisted the backend policy.
- Backend #215 must remain unmerged until its required exact-head Hermes workflows actually execute and pass; do not weaken the policy to clear a queue.

## Contracts to preserve during LG-5

Do not casually rewrite Active Session set/RPE/lifecycle semantics, workout/program create/edit/save/reorder/attach/favorite/delete semantics, completed-history read-only retention/navigation, weight/body-measurement canonical storage, private persistence/sync schemas, Social server authority/privacy/chronological Following semantics, Coach API/auth/navigation contracts, or backend ownership/revision/idempotency contracts.

Potentially long collections should use one suitable virtualized list boundary with stable identity. Keyboard-open forms must retain active-input and primary-action reachability.

## Next work

The next bounded runtime package is already source-confirmed on read-only `WorkoutHistoryScreen`:

- Filter chips, clear/reset actions and history-card press feedback still share opacity-only pressed styling.
- Filter/reset controls own local opaque theme fills rather than the Liquid Glass control/accent material tokens.
- Correct only material and pressed-state ownership.
- Preserve filtering, route-param behavior, stable `session.id` keys, `FlatList`, unit conversion/localization, safe-area clearance and read-only `/workout-history/[sessionId]` navigation.
- Existing localization/units tests already protect those semantic boundaries; add only focused material assertions rather than duplicating them.

Other bounded evidence:

- `QuickActionsCard` identity remains a candidate only until live usage is established; repository code search is not indexed.
- Weight Details is intentionally bounded to 10 recent entries and needs no collection refactor.
- Home/Profile/Coach/Nutrition/Settings controls audited after #593 are no-change evidence unless new defects emerge.

## Other priorities

- Stories image-only v1 remains source-complete and server-authoritative; no mock/demo Stories.
- LG-H3 Steps remains blocked until reviewed native health/activity provider/permissions exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach product/material expansion remains intentionally deferred.

## Documentation / CI guard

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve both explicit source-refactor authorization markers unless deliberately changing the contract: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Authorization boundaries

Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
