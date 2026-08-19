# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current merged `main` while the final Phase 15 handoff validates: `ff9e71af8a306e4e8802fc50a67da730dbc8e689` (#767).

Verified Phase 15 mobile progression now includes:

- #749 — shared deterministic training/progress analytics plus bounded workout/exercise Coach capabilities;
- #750 — bounded current-program, profile, body, nutrition and confirmed-Labs Coach capabilities;
- #751 — selective Coach retrieval/fact packets;
- #755 — compact Progress IA around Body, Strength & Training, Activity and Highlights;
- #756 — bounded Weight detail periods;
- #758 — bounded exercise progress series;
- #759 — Strength & Training drill-down;
- #760 — selected-exercise Progress → Companion context;
- #761 — Activity drill-down;
- #762 — Weight → Companion context;
- #763 — Highlights drill-down;
- #764 — Body measurement drill-down;
- #766 — Measurements → Companion context;
- #767 — Activity → Companion context.

PR #768 is the final reviewed current-set P15-E handoff: Highlights → Companion. It passes only selector context through navigation, rebuilds trend facts inside Companion and enforces the 90-day Coach history window before analytics input. All-time record status remains Progress-only rather than broadening Companion history. Exact-head Mobile CI is required before merge.

The Progress first level uses progressive disclosure rather than a wall of charts. Weight, measurements, training, activity and highlights have deliberate detail paths, and reviewed Progress → Companion handoffs transport selectors/anchors rather than raw state or prebuilt analytics.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

Phase 15 Coach question infrastructure now includes:

- #266 — minimal-scope structured question routing;
- #267 — minimized evidence, strict structured answer output and fail-closed scope validation;
- #269 — authenticated read-only `POST /v1/coach/questions` composition from router through user-scoped retrieval to structured answer;
- #270 — bounded confirmed structured Labs overview/marker-history evidence in the same question path.

#269 and #270 passed authoritative Backend CI before merge. The question path remains read-only: it does not automatically mutate workouts, programs, nutrition targets, goals or Labs data. Labs model-visible evidence is confirmed structured marker data only; raw documents, extraction drafts and provider payloads remain excluded.

## Active roadmap state

**Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics is in closure.**

Current workstream state:

1. **P15-A bounded data access:** source/CI-complete for the currently reviewed capabilities. Extend only for a new reviewed purpose-specific scope.
2. **P15-B deterministic analytics:** source/CI-complete for the current Progress/Coach facts. Missing evidence remains missing and calculations stay outside the model.
3. **P15-C Coach retrieval/orchestration:** authenticated read-only question orchestration is source/CI-complete through #270 for strength, nutrition, safety/recovery and confirmed structured Labs question scopes.
4. **P15-D Progress IA/drill-down:** source/CI-complete for the current compact overview and Weight, Measurements, Strength & Training, Activity and Highlights detail set.
5. **P15-E Coach ↔ Progress:** exercise, Weight, Measurements and Activity contexts are merged; Highlights #768 is the final reviewed current-set handoff pending exact-head completion.
6. **P15-F closure:** boundary review and canonical documentation synchronization are active. Source CI is not physical-device/provider/release evidence.

Phase 16 Proactive Coach and Phase 17 Goals & Planning remain successors. Do not silently treat Phase 15 closure as authorization for provider rollout, autonomous plan changes or medical behavior.

## Phase 14 external evidence boundary

Phase 14 remains independently actionable when its external prerequisites become available and does not block Phase 15 source closure.

- **Push:** staging-only APNs/FCM material plus signed physical-device permission/token/delivery/tap evidence remain.
- **Labs / Analyses:** configured-provider evidence still requires staging-only private S3-compatible storage plus Gemini material, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** backend route/auth/account-lifecycle staging evidence is complete; remaining mobile/physical-device runtime evidence remains.
- **Steps:** signed native/physical-device support, permissions, real aggregate reads and local-day/DST/Home evidence remain.

## Validation / closure boundary

Authoritative Mobile CI covers repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Backend source changes use the separate Backend CI gates. `docs/qa/phase15-closure.md` records the Phase 15 source/CI evidence boundary.

Source/CI completion does **not** claim:

- production deployment or provider activation;
- signed physical-device evidence;
- model quality/effectiveness evidence against production data;
- automatic mutation authority;
- diagnosis, prescribing, medication/supplement dosing or raw-Labs model access.

## Current execution order

1. Finish exact-head validation and merge #768 if green.
2. Finalize P15-F canonical status/handoff/roadmap synchronization against the exact resulting mobile/backend `main` SHAs.
3. Treat Phase 15 source work as closed for the reviewed scope unless validation reproduces a defect or a new contract is explicitly reviewed.
4. Keep Phase 14 external evidence independently actionable when prerequisites exist.
5. Only then advance successor Phase 16/17 work under their reviewed product/safety contracts.

## Execution boundary

`AGENTS.md` remains the operational authority. Ordinary inspect/edit/test/PR/merge work should continue in the largest safe coherent pass with independent workstreams parallelized. Provider activation, deployment, native/device execution, credential changes and production-sensitive operations remain separately evidence- and authorization-gated.
