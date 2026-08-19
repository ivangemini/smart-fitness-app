# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `11282c8d65d15c60c27f27aa41806b374101dbd5` (#772).

Phase 15 remains source/CI-complete for the reviewed Coach Intelligence + Progress scope. The current mobile baseline includes bounded Coach capabilities/selective retrieval (#749–#751), compact Progress IA and drill-downs (#755–#764), and selector-only Progress → Companion handoffs through #768.

The first reviewed Phase 16 Proactive Coach foreground slice is now also source/CI-complete:

- #770 — deterministic bounded proactive selector for notable strength progression, conservative strength stagnation and positive consistency change, with stable evidence keys and bounded source input;
- #771 — schema-versioned account-scoped presentation memory with a global seven-day cooldown, dismissed evidence keys, privacy inventory coverage and account-deletion cleanup;
- #772 — one authenticated foreground insight card inside Companion, persistence-before-display, fail-closed storage behavior, localized neutral copy and evidence-specific Progress drill-down.

#772 exact-head Mobile CI passed repository/changed-file line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Focused closure evidence is recorded in `docs/qa/phase16-foreground-closure.md`.

Phase 16 foreground v1 does not include Home takeover, push/background delivery, model-triggered proactive generation, badge/streak mechanics or automatic mutation of workouts, programs, nutrition, goals, Labs or safety state.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current verified backend `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

Phase 15 Coach question infrastructure remains the current backend baseline:

- #266 — minimal-scope structured question routing;
- #267 — minimized evidence, strict structured answer output and fail-closed scope validation;
- #269 — authenticated read-only `POST /v1/coach/questions` composition;
- #270 — bounded confirmed structured Labs overview/marker-history evidence.

No backend change was required for Phase 16 foreground v1 because selection and presentation are deterministic over already-approved bounded facts.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation of Coach, not a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the currently reviewed scope. See `docs/qa/phase15-closure.md`.
- **Phase 16 — Proactive Coach:** the reviewed deterministic foreground Companion-card slice is source/CI-complete through #770–#772. Further expansion requires a new purpose-specific contract.
- **Phase 17 — Goals & Planning:** next executable product source phase.

## Phase 17 authority baseline

The application already has canonical goal-related fitness-profile state: `goalType`, `targetWeight`, `weeklyWeightChangeGoal` and `trainingDaysPerWeek`. The same fields are already represented in fitness-profile synchronization metadata, and the existing Profile goals editor updates them through the established `updateProfileGoals` action.

Therefore Phase 17 must not introduce a second persisted goal authority merely to add goal-aware Progress/Coach behavior. The safe starting direction is:

1. define typed deterministic goal facts/views over existing fitness-profile state;
2. expose goal-relative status in Progress with explicit evidence and no pseudo-precision;
3. allow Coach to consume only the minimum typed goal context needed for a question;
4. preserve explicit confirmation for any future plan/nutrition changes;
5. introduce new goal persistence only if a reviewed requirement cannot be represented by the existing fitness-profile authority.

## Phase 14 external evidence boundary

Phase 14 remains independently actionable when its external prerequisites become available.

- **Push:** staging-only APNs/FCM material plus signed physical-device permission/token/delivery/tap evidence remain.
- **Labs / Analyses:** configured-provider evidence still requires staging-only private S3-compatible storage plus Gemini material, one bounded synthetic lifecycle and physical-device picker/accessibility evidence.
- **Stories:** backend route/auth/account-lifecycle staging evidence is complete; remaining mobile/physical-device runtime evidence remains.
- **Steps:** signed native/physical-device support, permissions, real aggregate reads and local-day/DST/Home evidence remain.

## Validation / closure boundary

Source/CI completion does **not** claim production deployment, provider activation, signed physical-device evidence, production-model quality, diagnosis/prescribing authority or automatic canonical mutation.

## Current execution order

1. Keep Phase 15 closed unless a reproduced defect, failed invariant or newly reviewed capability requires reopening it.
2. Treat Phase 16 foreground v1 as closed for the reviewed deterministic Companion-card scope; expand only under a new reviewed trigger/delivery contract.
3. Advance Phase 17 Goals & Planning by reusing the existing fitness-profile goal authority and adding typed deterministic goal-relative facts before richer planning UI.
4. Execute Phase 14 external provider/device evidence independently whenever prerequisites are available.
5. Repair demonstrated defects; do not manufacture unrelated cleanup work.

## Execution boundary

`AGENTS.md` remains the operational authority. Provider activation, deployment, native/device execution, credential changes and production-sensitive operations remain separately evidence- and authorization-gated.