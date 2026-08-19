# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current `main`: `bb48f0452690f0b33e824eea18aae8fb61a7fc2d` (#764).

Phase 15 Progress work has advanced materially beyond the previous Liquid Glass checkpoint:

- #755 established the compact Progress information architecture around Body, Strength & Training, Activity and Highlights;
- #756 added bounded weight-detail periods;
- #758 added deterministic bounded exercise progress series;
- #759 added the Strength & Training drill-down;
- #760 added bounded exercise Progress → Companion context;
- #761 added the Activity drill-down;
- #762 added weight-only Progress → Companion context;
- #763 added the Highlights drill-down;
- #764 added the Body measurement drill-down.

The top-level Progress surface now uses progressive disclosure rather than a wall of charts. Weight, measurements, training, activity and highlights all have intentional detail paths. Existing contextual Coach linking is deliberately scoped to reviewed exercise and weight contexts rather than passing raw application state.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `92fbf47d3bf10725e11ee43ccf61eba042abcba1` (#267).

Phase 15 Coach question infrastructure now includes:

- #266 — a minimal-scope structured question router that receives only the question plus explicitly available server scopes and fails closed for unsupported/unreviewed domains;
- #267 — minimized model-visible evidence, strict answer output contracts, evidence-scope validation and fail-closed unsupported/scope-mismatch handling.

The #267 exact-head Backend CI passed lint, formatting, build, production-configuration validation, isolated-staging topology validation and the full test gate before merge.

The P15-C foundation remains read-only. It does not yet expose the new bounded question path through a public `/v1` endpoint and it does not apply canonical mutations.

## Active roadmap state

**Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics is active.**

Current workstream state:

1. **P15-A bounded data access:** substantial mobile/server capability foundations exist; continue only with purpose-specific reviewed scopes.
2. **P15-B deterministic analytics:** shared training/progress calculations are already supporting the shipped Progress drill-down surfaces; continue where Coach needs additional validated facts.
3. **P15-C Coach orchestration:** router + minimized evidence + structured answer boundary are complete; next source package is end-to-end authenticated orchestration/API composition without automatic mutation.
4. **P15-D Progress IA/drill-down:** compact overview plus weight, body-measurement, training, activity and highlights detail surfaces are source/CI-complete through #764.
5. **P15-E Coach ↔ Progress:** reviewed exercise and weight contextual handoffs are source/CI-complete; add further metric contexts only with equivalent minimization contracts.
6. **P15-F closure:** accessibility/performance/regression review and canonical documentation synchronization remain after the remaining P15-C/P15-E work stabilizes.

Phase 16 Proactive Coach and Phase 17 Goals & Planning remain successors; do not pull them forward before Phase 15 contracts are stable.

## Phase 14 external evidence boundary

Phase 14 remains independently actionable when its external prerequisites become available and does not block Phase 15 source work.

- **Push:** provider/device evidence still requires usable staging-only APNs/FCM material plus signed physical-device execution.
- **Labs / Analyses:** configured-provider evidence still requires staging-only private S3-compatible storage plus Gemini material, followed by a bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** backend route/auth/account-lifecycle staging evidence is complete; mobile/physical-device runtime evidence remains.
- **Steps:** signed native/physical-device support, permissions, real aggregate reads and local-day/DST/Home evidence remain.

## Current execution order

1. Complete P15-C end-to-end authenticated question orchestration using the reviewed router → minimal context/evidence → structured answer boundary.
2. Keep the new question path read-only and fail closed; no silent program, workout, nutrition, goal or Labs mutation.
3. Extend Coach ↔ Progress only for explicitly reviewed, minimal metric/exercise/period contexts.
4. Run P15-F accessibility/performance/regression closure and keep roadmap/status/handoff docs synchronized.
5. Execute Phase 14 external evidence independently when provider/signing/device prerequisites become available.
6. Repair reproduced defects; do not manufacture unrelated cleanup work.

## Execution boundary

`AGENTS.md` remains the operational authority. Ordinary inspect/edit/test/PR/merge work should continue in the largest safe coherent pass with independent workstreams parallelized. Provider activation, deployment, native/device execution, credential changes and production-sensitive operations remain separately authorization-gated.
