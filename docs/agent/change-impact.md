# Agent Change-Impact Matrix

Updated: 2026-08-21

## Purpose

Use this matrix before editing shared, persisted, cross-repository, native, or release-sensitive code. It answers: **if I change X, what else must I inspect before I assume the change is local?**

This is an inspection-routing aid. Exact callers, schemas, tests, and focused architecture determine the final impact set.

## Expansion rule

Start with the smallest row that matches the requested change. Expand the working set whenever source shows one of these signals:

- persisted shape or identifier changes;
- shared helper/context/API client is touched;
- request/response DTO changes;
- backend ownership/authorization changes;
- sync revisions/conflicts/tombstones are involved;
- native capability/configuration changes;
- provider-backed behavior changes;
- account deletion/export/privacy lifecycle changes;
- a route/tab/root provider changes;
- CI/release/deployment configuration changes.

## Matrix

| Change class | Inspect first | Expand to | Minimum evidence before completion |
| --- | --- | --- | --- |
| Leaf visual styling | route wrapper + feature component + shared token actually used | safe-area/dynamic-type/keyboard owner if relevant | typecheck + focused visual/runtime verification; full CI if source PR requires it |
| Shared UI primitive | component implementation + all call sites | theme/tokens, accessibility, layout invariants, screenshots/device surfaces | typecheck + regression tests + representative screens |
| Route wrapper | `src/app/<route>` + corresponding feature | root layout/navigation only if route composition changes | route navigation behavior + typecheck |
| Root layout/provider | `src/app/_layout.tsx` + provider order + navigation callers | auth, theme, sync, notifications, global overlays | full mobile regression + startup/navigation runtime |
| Primary tabs/navigation | tab layout/routes + navigation invariants | deep links, Companion entry, hidden routes, safe-area/floating-tab clearance | full CI + physical/runtime navigation verification when behavior changes |
| Workout session UI | workout session feature + route | active-session state, persistence, cancel/finish navigation if behavior touched | focused tests + session runtime |
| Workout save/cancel semantics | workouts feature + focused state actions | persistence, completed history, sync queue, Home summary, backend sync | regression + restart/offline evidence when persistence semantics change |
| Nutrition diary UI | nutrition feature + state boundary | persistence/sync only if data semantics change | focused tests + typecheck |
| Nutrition calculation | pure domain/helper + all consumers | targets, diary totals, Coach evidence if shared | deterministic tests with edge cases |
| Progress calculation/chart | progress feature + pure calculation source | measurements/history units/localization if relevant | deterministic tests + chart/runtime verification |
| New local AppState field | state type/default/load/save/migration | focused contexts, mutation actions, serialization, tests | persistence/restart tests; inspect whether it should instead be server authority |
| Existing synced entity shape | mobile state + serializers + sync adapter | backend validation/repository/schema, conflicts, migration/compatibility, recovery | coordinated cross-repo validation + restart/conflict tests |
| New synced entity family | architecture/ownership first | mobile state, outbox, pull materialization, backend schema/repo/service, conflicts/deletion/export | explicit reviewed contract + full sync evidence; never ad hoc |
| Sync enqueue/mutation planner | mutation path + journal/outbox | restart recovery, duplicate delivery, conflict resolution, cursor logic | adversarial/restart/duplicate tests + authoritative CI |
| Pull materialization | `SyncContext`, `applySyncPullResult`, adapters | conflicts, cursor advancement, validation, state replacement, tests | adversarial + conflict/recovery tests |
| Conflict resolution | conflict controller/state + sync transport | backend conflict semantics, retry/replay, persisted unresolved state | two-sided serialization/replay tests; device evidence if required |
| Shared mobile API client | `src/api/` client/config + all callers | auth refresh, error mapping, observability/privacy | full regression + contract-focused tests |
| API request/response DTO | mobile DTO/caller + exact backend route schema | service/repository, compatibility with released clients, docs | cross-repo exact-head validation |
| New backend endpoint | route + auth/validation | service, repository/schema, privacy, mobile consumer, API docs | backend build/test/lint/format + integration tests |
| Backend service logic | service + direct callers | repository/schema/provider adapter depending on behavior | focused tests + full backend gates |
| Backend repository query | repository + schema/index/ownership filters | service callers, deletion/export, concurrency | PostgreSQL/integration tests where data semantics matter |
| Database schema | schema + migration | repository/service/API DTO, data model docs, rollback/recovery | reviewed forward-safe migration + PostgreSQL tests; deployment remains separate |
| Authentication/login | mobile auth + API transport | backend auth routes/services/session/device, SecureStore, logout/reset | cross-repo auth tests + runtime sign-in/out |
| Refresh/session rotation | mobile retry/refresh + backend atomic session logic | concurrent refresh, device/session invalidation, replay behavior | concurrency/adversarial tests; never rely on happy path only |
| Account deletion | UI/action + backend deletion orchestration | sync, Labs, Social, media, learning state, push registration, export/privacy docs | integration lifecycle test across owned domains |
| Labs UI only | Labs feature + current API DTO | chart/reference presentation if affected | typecheck + focused runtime |
| Labs upload/extraction | Labs mobile import/review + backend document/job contracts | managed storage/provider config, privacy, deletion, raw-doc exposure policy | fail-closed tests + staging/provider/device evidence when activated |
| Labs confirmed result | confirmation API + result repositories | history/compare/Coach bounded evidence, deletion/export | backend integration + mobile readback; preserve draft/confirmed boundary |
| Social feed/profile UI | Social feature + API DTO | relationship/feed state only if semantics touched | focused runtime + typecheck |
| Social relationship/visibility | Social mobile actions + backend authorization | feed queries, Stories audiences, notifications, privacy | backend integration + multi-account visibility tests |
| Story lifecycle | Stories UI + backend lifecycle service/repo | audience, expiry/archive/highlights, viewed/replies, notifications/media | lifecycle/privacy tests + device evidence where native behavior matters |
| Managed media | picker/upload UI + backend media contract | storage/moderation/provider lifecycle, deletion/privacy | fail-closed + provider staging evidence if external path activated |
| Push permission/token UI | notification feature/native capability | backend registration/session cleanup | physical-device permission/token evidence |
| Push enqueue/delivery | backend outbox/worker/transport | preferences, Story/social event source, retry/invalid-token cleanup | worker integration + external provider/device evidence for real delivery |
| HealthKit/Health Connect | health feature + native config/plugin/entitlements | privacy copy, capability gating, release/native build | signed physical-device evidence + native build; OTA alone is insufficient |
| Coach display/history | Coach feature + run DTO | backend only if DTO/trust semantics change | focused runtime/tests |
| Coach deterministic worker | backend worker + orchestrator consumers | findings/proposals, validation, persistence, Knowledge mapping if finding IDs change | deterministic unit/integration tests + full backend gates |
| Coach model prompt/provider | provider adapter + strict output schema | deterministic validator, privacy/minimized evidence, capabilities | provider-disabled/failure tests + staging evidence if activated |
| Coach confirmation | mobile confirmation UI + backend apply service | target domain revision/staleness, before/after provenance | stale-source + explicit-confirmation integration tests |
| Companion progression | Companion derivation + completed workout history source | no new persistence unless separately designed | deterministic derivation tests; repeated same-day invariant |
| Knowledge article DTO/UI | Knowledge feature + backend published DTO | learning state only if version identity semantics change | exact-version tests + runtime reader |
| Knowledge editorial/publication | backend Knowledge module | sources/claims/quizzes/version immutability/admin authorization | publication-gate tests + editorial review contract |
| Learning state | Knowledge UI/retry queue + backend account state | deletion/export/privacy, exact article version, path suppression | cross-repo integration + retry/idempotency |
| Coach → Learn mapping | backend finding identity + mapping registry | Coach run detail, Knowledge hydration, learning-state suppression | deterministic allowlist/fail-closed tests |
| Localization copy | localization resources + affected UI | plural/number/date/unit formatter if semantics change | localization/typecheck + representative runtime |
| Appearance/theme | theme owner + shared UI consumers | auth/onboarding/global overlays if shared | light/dark/system representative runtime |
| Expo config/plugin | `app.config.ts`, `app.json`, native dependency | entitlements/permissions, EAS profile, runtime version | Expo config/Doctor + native build when native surface changes |
| Native dependency | package/config + native integration | iOS/Android build, runtime compatibility, release docs | native build/install; cannot be validated by OTA only |
| EAS update workflow | workflow + app runtime/update config | release gate, channel/branch semantics | workflow/config validation; deliberate publication separate |
| Mobile CI workflow | `.github/workflows/ci.yml` + runner policy | required gates/path filters/concurrency/dedup | validate exact workflow head on Hermes runner |
| Release gate | release workflow + release docs | build/update artifacts, required evidence, production boundary | exact release-gate validation; do not infer deployment |
| Backend deployment config | deployment docs/config + runtime env contract | migrations, health checks, rollback, DNS/Caddy/admin deploy boundary | preflight + rollback path + deliberate deployment evidence |
| Admin source | backend admin surface + authorization | deployment trigger, editorial/ops authority, production impact | source validation; merge/deploy authorization boundary checked separately |
| Provider config/secret | backend capability/config boundary | deployment secret store, readiness/fail-closed behavior | credential-blind preflight where possible + staging evidence; never commit secrets |

## High-fan-out triggers

Treat a change as high-fan-out even if the diff is small when it touches:

- `src/context/AppContext.tsx` or `src/context/appContext/`;
- `src/context/SyncContext.tsx`;
- `src/context/applySyncPullResult.ts`;
- `src/cloud/` queue/recovery code;
- shared `src/api/` transport/auth code;
- `src/app/_layout.tsx` or primary tab layout;
- SecureStore/session/token logic;
- persisted entity IDs/timestamps/revision metadata;
- backend auth/session/device ownership;
- backend schema/migrations/shared repositories;
- provider capability/adapters;
- `.github/workflows/`, Expo config, native entitlements/plugins.

For these areas, inspect callers and tests before editing rather than after a regression appears.

## Cross-repository compatibility check

Before changing an API or persisted contract, explicitly answer:

1. Can the current production backend accept the currently released mobile payload?
2. Can the changed backend still serve the currently released mobile client?
3. Can the changed mobile tolerate the currently deployed backend during rollout?
4. Is a migration forward-safe and independently deployable?
5. Is a capability gated until both sides are compatible?

If any answer is “no,” the change requires a deliberate rollout/migration plan rather than a normal isolated PR.

## Documentation impact routing

A change may require documentation updates when it alters:

- source-of-truth ownership → `docs/agent/ownership-map.md` + focused architecture;
- cross-module impact expectations → this file;
- validation evidence class → `validation-matrix.md`;
- top-level file/domain location → `PROJECT_MAP.md`;
- stable product architecture → `docs/project-context.md` / focused architecture;
- mutable completion/blocker → `docs/current-status.md` / handoff;
- forward sequencing → implementation plan/roadmap;
- release evidence → QA/release docs.

Do not update broad docs for ordinary leaf implementation movement.
