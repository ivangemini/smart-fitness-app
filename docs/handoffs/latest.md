# Latest Handoff

Updated: 2026-08-11

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime `main`: `2e9d46baf5c311a16f8399b1f885bad34317ee6f`.
- Latest runtime merge: PR #607 `fix: converge Workouts exercise library theme/material`.
- PR #607 exact validated head: `642102c89a6cc21bfd924e0ecfa6c5276613b124`; Mobile CI #2155 run `31465438807` passed the complete Hermes Mobile gate before merge.
- LG-5 merged demonstrated-defect runtime batches now total **34**.
- Backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 remains draft/open at `0826ff18dac7d4afe78943d9881c5a530507f1af`; all three required exact-head Hermes workflows remain queued, so it is not merge-ready.
- LG-H2 Stories remains complete for current image-only v1 scope.
- LG-4 Workouts source convergence remains complete.
- Active priority: **LG-5 QA and bounded polish, validation-first**.
- Coach product/material expansion remains deferred.

## Recent runtime sequence

- #603 Exercise Library retry/row/details/filter materials — head `d78b759b6726f1416198456415f99dd399eed144`, CI #2144 run `31461541030`, merge `68a9b76cfce41dfbdf01b36d8d15521121ffbc84`.
- #604 docs-only checkpoint through #603 — merge `a3f134d60cddee0d60393161fba534f4495cb27e`.
- #605 Active Session interaction-material convergence — head `aabfe05b4572f1dbb5c9c83f557a454a6e0a4a3c`, CI #2150 run `31462888466`, merge `f46f9ed0e9de02aa4431edd428415762752ffdcf`.
- #606 workout-session preparation localization — head `10a67c251d681ca69355ef0354ce3017b864459c`, CI #2152 run `31463444416`, merge `b41f7a0762281bd28a1c1b12e6e4b5cc4f3a4a51`.
- #607 Workouts Exercise Library active-theme/material convergence — head `642102c89a6cc21bfd924e0ecfa6c5276613b124`, CI #2155 run `31465438807`, merge `2e9d46baf5c311a16f8399b1f885bad34317ee6f`.

PR #576 remains a scope/documentation audit rather than a runtime package; completed workout history remains read-only.

## What #607 closed

The live `/workouts/exercise-library` route and virtualized browser now follow `AppThemeProvider` light/dark/system colors and Liquid Glass material tokens instead of hard-coded dark materials. Filters, favorites, detail actions and browser interactions use material-specific pressed fills. `SectionList`, stable exercise IDs, favorites storage, search/filter/recent/similar derivation, custom exercise behavior, localization and safe-area ownership remain unchanged.

Exact-head CI initially exposed a stale legacy `WorkoutExerciseLibraryCard` import of the removed named `styles` export. That compatibility defect was fixed on the same bounded branch by switching the legacy card to `createWorkoutExerciseLibraryCardStyles`; the complete Hermes gate then passed.

## Next work

There is **no pre-authorized broad runtime package after #607**. Continue LG-5 in validation-first mode:

1. Inspect remaining live surfaces for a concrete source/QA mismatch against active-theme, material-feedback, compact-height/text-scaling, safe-area, virtualization and stable-identity contracts.
2. Reuse existing no-change evidence; do not restyle or refactor a surface merely because it is adjacent to a recently changed screen.
3. If a defect is demonstrated, fix only the smallest coherent boundary and add/reuse a focused source-contract guard.
4. Merge runtime work only after exact-head Hermes Mobile CI is fully green.
5. Keep backend PR #215 open until its three required queued workflows actually execute and pass.

Candidate-only evidence:

- `QuickActionsCard` label-as-key is not actionable until live usage is established.
- Weight Details recent history is intentionally capped at 10 stable-ID entries.
- Home/Profile/Coach/Nutrition/Settings controls previously audited remain no-change evidence unless a new mismatch is demonstrated.
- Program Detail remains semantically bounded by the seven-day weekday model.

## Contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history read-only semantics, private persistence/sync schemas, exercise repository/provider behavior, Social server authority/privacy, Coach API/auth contracts, or backend ownership/revision/idempotency contracts as part of LG-5 presentation fixes.

Potentially long collections retain one suitable virtualized boundary with stable identity. Keyboard forms retain active-input/primary-action reachability. Direct interaction feedback changes material fill rather than relying on generic opacity. Safe-area ownership remains singular per edge.

## Documentation / CI guard

Keep `docs/architecture/local-state-performance-decision.md` referenced from `docs/implementation-plan.md`. Preserve the source-refactor authorization markers: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

Do not perform authorization-gated OTA/EAS publication, native build/install, backend deployment, production/provider activation, credential/DNS, native-health or store actions unless explicitly requested.
