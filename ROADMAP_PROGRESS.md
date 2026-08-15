# Smart Fitness Roadmap Progress

Updated: 2026-08-15

This is the cross-program roadmap index, not a duplicate implementation baseline.

Use `docs/implementation-plan.md` for forward sequencing, `docs/current-status.md` for the current checkpoint, `docs/handoffs/latest.md` for restart state, `docs/roadmap/phase14-active-workstreams.md` for Phase 14 and backend `docs/project-context.md` for the single detailed backend baseline.

Exact source, tests, migrations and Git history override stale prose.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home convergence: source/CI complete; bounded reproduced regressions only.
- Stories S10: source-complete; runtime/deployment/device evidence remains.
- Phase 12 Labs + Settings: approved provider-neutral source composition complete through confirmed-result interpretation and strict structured model exposure; provider/native/runtime work gated.
- Phase 13 Companion v1: retained; richer progression/cosmetics deferred.
- **Phase 14:** active bounded completion program.

## Checkpoints

- mobile current `main`: `9313fa18419dc657423a7d363724b017b8519392` (#662);
- mobile active prepared branch: `fix/p14-home-steps-docs`;
- backend current `main`: `2b73f34e168d7a6a1dd4087df1a1992e44137d54` (#241).

Backend #237–#241 details live only in the canonical backend baseline/reference set.

## Remaining active roadmap

1. **Real external push delivery:** APNs/FCM adapters/configuration, native permission/token lifecycle, offline reconnect convergence, privacy/content policy and physical-device/account-isolation evidence.
2. **Labs / Analyses runtime completion:** production storage/OCR/model configuration, authorized deployment/migrations, PDF native picker/dependency and provider/device/accessibility evidence. The internal confirmed-structured-facts-only model/tool exposure policy is source-complete in backend #241.
3. **Stories runtime evidence:** follow `docs/qa/stories-s10-runtime-matrix.md`; repair only reproduced defects.
4. **Steps native health activity:** Home now consumes the provider-neutral source on the active branch; remaining work is HealthKit/Health Connect adapters, explicit permission/disclosure UX and physical-device evidence.

Do not recreate closed provider-neutral source packages merely because runtime gates remain closed.

## Current execution order

1. Validate and land bounded source/docs hardening.
2. Keep canonical references synchronized.
3. Enter provider/native/runtime work only after the corresponding explicit gate is opened.
4. Continue read-only audits, QA/evidence preparation and bounded defect repair while gates remain closed.
5. Keep Companion v1 bounded unless reprioritized.

## Closed activation/release gates

Without direct authorization, do not deploy backend changes/migrations, activate/schedule production workers, configure/rotate APNs/FCM/provider credentials, request native permissions implicitly, activate HealthKit/Health Connect or production Labs providers, publish OTA/EAS, build/install native releases, access/mutate production data or submit to app stores.
