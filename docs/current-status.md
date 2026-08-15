# Smart Fitness Current Status

Updated: 2026-08-15

Exact code, tests and current Git history override this checkpoint if it becomes stale.

This file intentionally stays short. Detailed backend behavior lives in the [canonical backend baseline](https://github.com/ivangemini/smart-fitness-backend/blob/main/docs/project-context.md); forward sequencing lives in `docs/implementation-plan.md`.

## Current verified checkpoint

### Mobile

- repository: `ivangemini/smart-fitness-app`;
- current `main`: `9313fa18419dc657423a7d363724b017b8519392` (#662, documentation/runtime-evidence update);
- latest merged runtime/source checkpoint before this branch: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660);
- active prepared branch: `fix/p14-home-steps-docs`.

The current branch adds provider-neutral Steps consumption on Home, refreshes daily Steps on foreground/local-day rollover, fixes the Labs scope contradiction and removes stale mobile copies of backend documentation.

### Backend

- repository: `ivangemini/smart-fitness-backend`;
- current `main`: `2b73f34e168d7a6a1dd4087df1a1992e44137d54` (#241);
- #241 exact-head Backend CI: green before merge.

#241 hardens push-registration device authority, masks Labs storage-provider diagnostics, makes the Labs → Coach/model boundary strict confirmed-structured-facts-only and adds test-checked API/data-model references. #237–#240 remain the canonical durable push/Story source baseline.

## Program status

- **Phase 14 Push:** provider-neutral source path is complete and registration authority is hardened; APNs/FCM/native/runtime/deployment evidence remains gated. Use `docs/qa/push-runtime-evidence-matrix.md`.
- **Labs / Analyses:** approved private product scope; provider-neutral source composition and internal confirmed-structured-facts-only model/tool exposure policy are source-complete. Production storage/OCR/model/native-picker/device evidence remains gated.
- **Stories S10:** source-complete; use `docs/qa/stories-s10-runtime-matrix.md` for authorized runtime evidence and repair only reproduced defects.
- **Steps:** provider-neutral local-day source plus Home consumption/refresh behavior is source-complete on the active branch; HealthKit/Health Connect adapters, permissions and physical-device evidence remain gated.
- **Companion:** Phase 13 v1 remains the bounded baseline; richer pet/cosmetics/progression remains deferred unless reprioritized.

## Current execution rule

Until an explicit activation gate is opened, continue read-only audits, QA/evidence preparation, canonical documentation/reference synchronization and bounded fixes for reproduced defects. Do not manufacture a new broad source program merely because Phase 14 remains active.

## Closed activation gates

Without direct authorization, do not deploy backend code, execute production migrations, activate/schedule production push workers, activate APNs/FCM/provider credentials, request native push permission implicitly, activate HealthKit/Health Connect, activate production Labs providers, add native dependencies solely to bypass a reviewed gate, publish OTA/EAS, build/install native releases, access/mutate production data or submit to app stores.
