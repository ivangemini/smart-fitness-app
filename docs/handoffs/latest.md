# Latest Handoff

Updated: 2026-08-11

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `68a9b76cfce41dfbdf01b36d8d15521121ffbc84`.
- Latest runtime merge: PR #603 `fix: converge Exercise Library interaction materials`.
- PR #603 exact validated head: `d78b759b6726f1416198456415f99dd399eed144`; Mobile CI #2144 run `31461541030` passed the complete Hermes gate before merge.
- LG-5 merged demonstrated-defect runtime batches now total **31**.
- Backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open at `0826ff18dac7d4afe78943d9881c5a530507f1af`; all three required exact-head Hermes workflows remain queued, so it is not merge-ready.
- LG-H2 Stories remains complete for current image-only v1 scope.
- LG-4 Workouts source convergence remains complete.
- Active priority: **LG-5 QA and bounded polish, validation-first**.
- Coach product/material expansion remains deferred.

## Recent runtime sequence

- #597 Workout History filter/action/row material convergence — head `9604d8bacb981a7855c07ef30932ecbb4abdf7b1`, CI #2130, merge `6b5920a211f88da5226609b560840d64a6e8dc9e`.
- #598 completed-history and pre-workout Safety row virtualization — head `c29ea3cac234ed9057b20674ecc94dbf2c0051df`, CI #2133, merge `539dd1cfd5623f40e3bca581ec2d8fa5e9392215`.
- #599 Safety Gate + Finish direct-action material feedback — head `56fe0939f9232eb47d4952a24759c707d29abe45`, CI #2135, merge `6e597b147d5a19efbed58b35188ada80b4358c00`.
- #600 Template Detail not-found shared action — head `db3f330fe47b016927d705889bea5c6369ab19e3`, CI #2138, merge `413cd54dc15a96bc60d7644062ece28741c92a66`.
- #601 Program Detail + Builder interaction materials — head `8860ab9a63ae66d3ee48ab99af8c01bddbf444cd`, CI #2140, merge `3404cc4c33c3a003c9ffd24074475b213aa5ebff`.
- #602 New Routine editor/picker/menu interaction materials — head `f7eb3d7ca45d560e21d6c9e9a0b38136bb75d63a`, CI #2142, merge `962ae155afd2521b5c457048f8e303bdaea3f00a`.
- #603 Exercise Library retry/row/details/filter materials — head `d78b759b6726f1416198456415f99dd399eed144`, CI #2144 run `31461541030`, merge `68a9b76cfce41dfbdf01b36d8d15521121ffbc84`.

PR #576 remains a scope/documentation audit rather than a runtime package; completed workout history remains read-only.

## Next bounded runtime package — Active Session interaction materials

Confirmed generic opacity-only owners:

- `SessionExerciseSection.tsx`: exercise expand/collapse, exercise menu, rest-timer action, Add Set.
- `SessionSetRow.tsx`: RPE edit badge and set-completion control.
- `RpeBottomSheet.tsx`: selected/unselected RPE choice buttons.
- `WorkoutSessionModals.tsx` + `workoutSessionScreenStyles.ts`: overflow actions/cancel and replacement rows.

Correct only material/pressed-state ownership. Preserve active-session draft persistence, set calculations, completion/RPE semantics, RPE select/dismiss timing, replacement/discard behavior, finish/add-exercise/workouts routes, the screen-level exercise `FlatList`, and replacement-list stable IDs/render bounds.

No-change evidence in this boundary:

- `SessionHeader.tsx` already uses shared Liquid Glass icon controls and dedicated fill-based Finish feedback.
- `WorkoutSessionFooterActions.tsx` already delegates to shared `PrimaryButton`/`SecondaryButton`.
- `SessionSetTable.tsx` owns no direct Pressable material.

A staging branch exists for this package. Rebase/reparent it to the exact current `main` after this docs checkpoint, inspect the clean diff, add/reuse focused guards, and merge only after exact-head Mobile CI is fully green.

## Contracts to preserve

Do not change workout/program lifecycle, completed-history read-only semantics, private persistence/sync schemas, Social server authority/privacy, Coach API/auth contracts, or backend ownership/revision/idempotency contracts as part of LG-5 presentation fixes.

Potentially long collections retain one suitable virtualized boundary with stable identity. Keyboard forms retain active-input/primary-action reachability. Direct interaction feedback changes material fill rather than relying on generic opacity.

## Other bounded evidence

- `QuickActionsCard` label-as-key remains a candidate only until live usage is established.
- Weight Details is intentionally capped to 10 recent entries with stable IDs.
- Home/Profile/Coach/Nutrition/Settings controls previously audited remain no-change evidence unless new defects appear.
- Program Detail remains semantically bounded by its seven-day weekday model.

## Documentation / CI guard

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve the source-refactor authorization markers: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

Do not perform authorization-gated release, deployment, production/provider, credential, native-health or store actions unless explicitly requested.
