# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `bf302de39c1190f736f17c731f0d2fac2f41e569` (#768).

Phase 15 mobile source work now includes:

- #749 — shared deterministic training/progress analytics plus bounded workout/exercise Coach capabilities;
- #750 — bounded current-program, profile, body, nutrition and confirmed-Labs Coach capabilities;
- #751 — selective Coach retrieval/fact packets;
- #755 — compact Progress IA around Body, Strength & Training, Activity and Highlights;
- #756/#758/#759/#761/#763/#764 — Weight, exercise-series, Strength & Training, Activity, Highlights and Body-measurement drill-down foundations;
- #760/#762/#766/#767/#768 — selected-exercise, Weight, Measurements, Activity and Highlights Progress → Companion handoffs.

#768 closes the reviewed current-set P15-E handoffs. Its exact-head Mobile CI passed repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. The Highlights handoff enforces the 90-day Coach history boundary before analytics input and deliberately keeps longer-history all-time record evidence Progress-only.

The Progress first level uses progressive disclosure rather than a wall of charts. Contextual handoffs carry selectors/period/anchor metadata only; Companion rebuilds bounded facts from canonical state rather than receiving raw state or prebuilt analytics through navigation.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

Phase 15 Coach question infrastructure includes:

- #266 — minimal-scope structured question routing;
- #267 — minimized evidence, strict structured answer output and fail-closed scope validation;
- #269 — authenticated read-only `POST /v1/coach/questions` composition from router through user-scoped retrieval to structured answer;
- #270 — bounded confirmed structured Labs overview/marker-history evidence in the same question path.

#269 and #270 passed authoritative Backend CI before merge. The question path remains read-only and does not automatically mutate workouts, programs, nutrition targets, goals or Labs data. Labs model-visible evidence is confirmed structured marker data only; raw documents, extraction drafts, provider payloads and secrets remain excluded.

## Phase status

**Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics is source/CI-complete for the currently reviewed scope.**

1. **P15-A bounded data access:** complete for the reviewed capability set; extend only for a new purpose-specific reviewed scope.
2. **P15-B deterministic analytics:** complete for the current Progress/Coach facts; missing evidence remains missing and calculations stay outside the model.
3. **P15-C Coach retrieval/orchestration:** authenticated read-only question orchestration is complete for strength, nutrition, safety/recovery and confirmed structured Labs scopes.
4. **P15-D Progress IA/drill-down:** complete for the compact overview and current Weight, Measurements, Strength & Training, Activity and Highlights details.
5. **P15-E Coach ↔ Progress:** complete for the current drill-down set through #768 with selector-only, fail-closed, bounded context contracts.
6. **P15-F closure:** source boundary review and canonical documentation closure are complete with `docs/qa/phase15-closure.md` as the focused evidence matrix.

Phase 16 Proactive Coach and Phase 17 Goals & Planning remain successors. Phase 15 closure does not authorize autonomous plan changes, medical behavior, unrestricted model access or provider rollout.

## Phase 14 external evidence boundary

Phase 14 remains independently actionable when its external prerequisites become available.

- **Push:** staging-only APNs/FCM material plus signed physical-device permission/token/delivery/tap evidence remain.
- **Labs / Analyses:** configured-provider evidence still requires staging-only private S3-compatible storage plus Gemini material, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** backend route/auth/account-lifecycle staging evidence is complete; remaining mobile/physical-device runtime evidence remains.
- **Steps:** signed native/physical-device support, permissions, real aggregate reads and local-day/DST/Home evidence remain.

## Validation / closure boundary

Source/CI completion does **not** claim production deployment, provider activation, signed physical-device evidence, model quality against production data, diagnosis/prescribing authority or automatic canonical mutation. `docs/qa/phase15-closure.md` records the reviewed evidence boundary.

## Current execution order

1. Keep Phase 15 closed for the reviewed scope unless a reproduced defect, failed closure invariant or newly reviewed capability requires reopening it.
2. Execute Phase 14 external provider/device evidence independently when its prerequisites are available.
3. Advance Phase 16 Proactive Coach under a separate reviewed product/safety contract; reuse Phase 15 bounded deterministic facts rather than creating a second data authority.
4. Advance Phase 17 Goals & Planning only after its typed ownership/state contracts are reviewed.
5. Repair demonstrated defects; do not manufacture unrelated cleanup work.

## Execution boundary

`AGENTS.md` remains the operational authority. Provider activation, deployment, native/device execution, credential changes and production-sensitive operations remain separately evidence- and authorization-gated.