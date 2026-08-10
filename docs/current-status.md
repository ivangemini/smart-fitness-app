# Smart Fitness Current Status

Updated: 2026-08-10

## Verified checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current runtime `main`: `975440b6098fb4aebf6d874acca87be581334ed4`.
- Latest runtime merge: PR #565 — shared `SectionHeader` active-theme consistency.
- PR #565 exact validated head: `1a60e87b64db0d87ec99c6ad5c6f47002cf87dde`; Mobile CI #2049 passed before merge.
- Backend repo: `ivangemini/smart-fitness-backend`.
- Current backend `main`: `72a5c63c3004f09f2b4bb8652bb3cff663c10ffd`.
- Backend PR #215 is the only open project PR at this checkpoint. It remains draft/unvalidated at head `0826ff18dac7d4afe78943d9881c5a530507f1af`; Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI are still queued on Hermes.
- **LG-H2 Stories is complete for the current image-only v1 source scope.**
- **Progress/exercise secondary-material reassessment is complete for the current active source scope.**
- **LG-4 Workouts source convergence is complete.**
- **LG-5 QA and bounded polish is active.**
- **Coach material remains deferred by explicit product priority.**

Exact code, tests and current Git history override this checkpoint if it becomes stale.

## LG-5 completed source/CI batches

### PR #559 — Create Program keyboard safety

Confirmed defect: the auto-focused program-name input could open the keyboard inside a centered non-scrollable modal without keyboard avoidance or modal safe-area ownership, making actions unreachable on short-height/increased-text layouts.

Fix:

- `KeyboardAvoidingView` around the form;
- vertically scrollable modal content;
- handled keyboard taps;
- runtime safe-area top/bottom clearance;
- existing validation/create/cancel behavior preserved.

### PR #560 — Workouts short-height and large-text resilience

Confirmed defects:

- Program Add Workout choice mode could clip its lower action because a max-height/overflow-hidden panel contained non-scrollable localized choice content;
- New Routine expanded exercise notes had a 42 px direct-interaction minimum instead of the established 44 px minimum.

Fixes were bounded to those defects. The main Workout Builder, Workout Editor overlay and Finish keyboard/safe-area behavior were reassessed and left unchanged because they already satisfied the relevant source contracts.

### PR #561 — shared UI text resilience

Confirmed shared-control resilience debt was fixed in:

- `ListRow` flex/min-width behavior for long/localized values and large Dynamic Type;
- destructive/tertiary button label wrapping;
- equal-width `SegmentedControl` labels.

Exact validated head: `e16f8d961b4a128c4d7b1de5b4fc36d66342fd8e`; Mobile CI #2043 green before merge.

### PR #565 — shared SectionHeader theme consistency

Confirmed defect: live theme-aware surfaces such as Coach could render `SectionHeader` title/subtitle using the legacy `Colors.dark` palette while the surrounding screen used the active app palette.

Fix:

- `SectionHeader` now resolves colors from `useAppTheme()`;
- style generation is keyed to the active palette;
- layout, typography, action ownership and public API remain unchanged.

Exact validated head: `1a60e87b64db0d87ec99c6ad5c6f47002cf87dde`; Mobile CI #2049 green before merge.

## CI execution changes

These are validation-infrastructure changes, not product behavior:

- PR #562 routes authoritative routine Mobile CI to `[self-hosted, linux, x64, hermes-mobile-ci]` while preserving the complete gate.
- PR #563 skips only GitHub-generated merge-push duplicates after an already exact-head validated PR. The authoritative PR gate remains complete.
- PR #564 persists the runner/cost policy in `AGENTS.md` so later agents do not require the policy to be restated.
- Backend PR #216 persisted the backend counterpart policy.
- Backend PR #215 has **not** completed the actual backend workflow migration because its exact-head jobs have not received/finished Hermes execution. Do not merge it until required exact-head validation is green.

## Documentation audit — 2026-08-10

The project documentation was re-read across both repositories, including root instructions and the complete mobile/backend `docs/` trees.

Important interpretation rules from that audit:

- current Phase 11/LG-5 plans override old roadmap prose that still names Provider/Release P5 as the active autonomous program;
- later focused evidence files and current code override older privacy/export notes that still describe already-implemented source slices as future work;
- the complete Social account-data projection now has reviewed implementation/PostgreSQL evidence, while early Social disposition/source-plan files intentionally remain historical non-authorization boundaries;
- account-deletion durable receipt/status source exists even though an older cross-surface deletion planning document still calls it a next slice;
- provider, worker, storage, moderation, password-reset and staging source readiness never authorizes real credentials, provider calls, environment activation or deployment;
- mobile `docs/backend/*` is historical Architecture 1.0 design material; current backend implementation/documentation is authoritative in `ivangemini/smart-fitness-backend`;
- analytics/telemetry remains fail-closed with no production event registry authorization;
- local-state performance evidence still supports the existing AsyncStorage `AppState` snapshot; no storage rewrite is authorized without new measured evidence.

Historical documents are retained as evidence rather than rewritten to pretend their earlier state never existed.

## LG-5 active next work

LG-5 remains validation-first. Do **not** restart broad source migration unless QA identifies a concrete defect.

Continue checking:

- light / dark / system appearance;
- narrow/short phones and safe-area ownership;
- increased text size and long EN/RU copy;
- keyboard-open forms/editors;
- populated / empty / loading / error / disabled states;
- long exercise/history/program collections;
- Active Session set entry, RPE, replacement, finish and discard flows;
- workout creation/edit/save/program attachment;
- completed-history read/edit/delete flows;
- elevated material and blur/fallback behavior.

Physical-device evidence remains separately authorization-gated.

## Durable documentation / CI rule

`docs/implementation-plan.md` must retain the reviewed local-state decision reference `docs/architecture/local-state-performance-decision.md`. It must also retain the explicit source-refactor authorization markers unless that contract is deliberately changed: `There is no remaining approved autonomous source-refactor phase` and `no separate autonomous source-refactor phase is currently authorized`.

## Boundaries

- LG-H3 Steps remains blocked until a reviewed native health/activity provider and permission contract exist.
- LG-H4 feed ranking remains later; preserve chronological Following semantics.
- Coach material remains intentionally deferred.
- Analytics/telemetry collection remains disabled until separately authorized evidence/consent work exists.
- Do not perform OTA/EAS publication, native build/install, backend deployment, migration execution, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation or store submission without direct authorization.
