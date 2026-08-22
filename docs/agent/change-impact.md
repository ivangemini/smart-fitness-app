# Agent Change-Impact Matrix

Updated: 2026-08-22

## Purpose

Use this matrix before editing shared, persisted, cross-repository, native, privacy-sensitive or release-sensitive code. It answers: **if I change X, what else must I inspect before I assume the change is local?**

This is an inspection-routing aid. Exact callers, schemas, tests and focused architecture determine the final impact set.

## Expansion rule

Start with the smallest row that matches the requested change. Expand the working set whenever source shows one of these signals:

- persisted shape or identifier changes;
- shared helper/context/API client is touched;
- request/response DTO changes;
- backend ownership/authorization changes;
- sync revisions/conflicts/tombstones are involved;
- native capability/configuration changes;
- private media/storage/privacy behavior changes;
- provider-backed behavior changes;
- account deletion/export/privacy lifecycle changes;
- a route/tab/root provider changes;
- CI/release/deployment configuration changes.

## Matrix

| Change class | Inspect first | Expand to | Minimum evidence before completion |
| --- | --- | --- | --- |
| Leaf visual styling | route wrapper + feature component + actual shared token | safe-area/dynamic-type/keyboard owner if relevant | typecheck + focused visual/runtime verification |
| Shared UI primitive | implementation + all call sites | theme/tokens, accessibility, layout invariants | typecheck + regression tests + representative screens |
| Route wrapper | `src/app/<route>` + feature | root navigation only if composition changes | route behavior + typecheck |
| Root layout/provider | `src/app/_layout.tsx` + provider order | auth, theme, sync, notifications, global overlays | full mobile regression + startup/navigation runtime |
| Primary tabs/navigation | tab layout/routes + navigation invariants | deep links, Companion entry, hidden routes, safe-area/floating-tab clearance | full CI + physical/runtime navigation when needed |
| Workout session UI | workout session feature + route | active-session state, persistence, cancel/finish if behavior touched | focused tests + session runtime |
| Workout save/cancel semantics | workouts + focused state actions | persistence, history, sync queue, Home summary, backend sync | regression + restart/offline evidence |
| Nutrition diary UI | nutrition feature + state boundary | persistence/sync if semantics change | focused tests + typecheck |
| Nutrition calculation | pure helper + consumers | targets, diary totals, Coach evidence if shared | deterministic edge-case tests |
| Progress calculation/chart | progress feature + calculation source | measurements/history units/localization | deterministic tests + chart/runtime |
| Progress-photo UI only | `src/features/progressPhotos/` component + route | shared media/layout helpers only if used | typecheck + focused runtime; preserve privacy copy/identity |
| Progress-photo capture/import/storage/delete | progressPhotos feature + storage/metadata helpers | camera/library native capability, EXIF re-encoding boundary, account cleanup, privacy inventory, QA checklist | focused tests + Mobile CI; V4 signed-device evidence for native lifecycle claims |
| Progress-photo comparison/body composition | comparison/analytics source + canonical photo/weight/measurement inputs | period/pose/aspect validation, privacy, Progress presentation | deterministic tests + representative runtime; V4 for visual/native claims; no AI/body-fat inference |
| New local AppState field | type/default/load/save/migration | focused contexts, actions, serialization, tests | persistence/restart tests; inspect correct authority first |
| Existing synced entity shape | mobile state + serializers + sync adapter | backend validation/repository/schema, conflicts, compatibility, recovery | coordinated cross-repo validation + restart/conflict tests |
| New synced entity family | architecture/ownership first | mobile state/outbox/pull + backend schema/repo/service + deletion/export | explicit reviewed contract + full sync evidence |
| Sync enqueue/mutation planner | mutation path + journal/outbox | restart recovery, duplicate delivery, conflicts, cursor logic | adversarial/restart/duplicate tests + authoritative CI |
| Pull materialization | `SyncContext`, `applySyncPullResult`, adapters | conflicts, cursor, validation, state replacement | adversarial + conflict/recovery tests |
| Conflict resolution | conflict controller/state + transport | backend conflict semantics, retry/replay, persisted unresolved state | serialization/replay + device evidence if required |
| Shared mobile API client | `src/api/` client/config + callers | auth refresh, error mapping, observability/privacy | full regression + contract tests |
| API request/response DTO | mobile DTO/caller + backend route schema | service/repository, released-client compatibility, docs | cross-repo exact-head validation |
| New backend endpoint | route + auth/validation | service, repository/schema, privacy, mobile consumer, API docs | backend build/test/lint/format + integration tests |
| Backend service logic | service + direct callers | repository/schema/provider adapter as relevant | focused tests + backend gates |
| Backend repository query | repository + schema/index/ownership filters | service callers, deletion/export, concurrency | PostgreSQL/integration tests where semantics matter |
| Database schema | schema + migration | repository/service/API DTO, data model docs, rollback/recovery | forward-safe migration + PostgreSQL tests |
| Authentication/login | mobile auth + transport | backend auth/session/device, SecureStore, logout/reset | cross-repo auth tests + runtime sign-in/out |
| Refresh/session rotation | mobile retry/refresh + backend atomic session logic | concurrent refresh, invalidation, replay | concurrency/adversarial tests |
| Account deletion | UI/action + backend orchestration | sync, Labs, Social, media, learning state, push, local progress-photo cleanup, export/privacy docs | lifecycle integration + local-media cleanup evidence |
| Labs UI only | Labs feature + API DTO | chart/reference presentation if affected | typecheck + focused runtime |
| Labs upload/extraction | Labs import/review + backend document/job contracts | managed storage/provider config, privacy, deletion, raw-doc policy | fail-closed tests + staging/provider/device evidence |
| Labs confirmed result | confirmation API + result repositories | history/compare/Coach evidence, deletion/export | backend integration + mobile readback |
| Social feed/profile UI | Social feature + DTO | relationship/feed state if semantics touched | focused runtime + typecheck |
| Social relationship/visibility | mobile actions + backend authorization | feed, Stories audiences, notifications, privacy | backend integration + multi-account tests |
| Story lifecycle | Stories UI + backend lifecycle | audience, expiry/archive/highlights, replies, notifications/media | lifecycle/privacy tests + device evidence as needed |
| Backend-managed media | picker/upload UI + backend contract | storage/moderation/provider lifecycle, deletion/privacy | fail-closed + provider staging evidence if activated |
| Push permission/token UI | notifications + native capability | backend registration/session cleanup | physical-device permission/token evidence |
| Push enqueue/delivery | backend outbox/worker/transport | preferences, event source, retry/invalid-token cleanup | worker integration + provider/device evidence |
| HealthKit/Health Connect | health feature + native config | privacy copy, capability gating, release/native build | signed physical-device evidence + native build |
| Coach display/history | Coach feature + run DTO | backend if DTO/trust changes | focused runtime/tests |
| Coach deterministic worker | backend worker + orchestrator | findings/proposals, validation, persistence, Knowledge mapping if IDs change | deterministic unit/integration + backend gates |
| Coach model prompt/provider | adapter + strict schema | deterministic validator, minimized evidence, capabilities | provider-disabled/failure tests + staging if activated |
| Coach confirmation | mobile UI + backend apply service | target revision/staleness, before/after provenance | stale-source + explicit-confirmation integration |
| Companion progression | derivation + completed-workout source | no persistence unless separately designed | deterministic derivation tests |
| Knowledge article DTO/UI | Knowledge feature + published DTO | learning state if version semantics change | exact-version tests + reader runtime |
| Knowledge editorial/publication | backend Knowledge module | sources/claims/quizzes/version immutability/admin auth | publication-gate tests + review contract |
| Learning state | UI/retry queue + backend account state | deletion/export/privacy, exact version, path suppression | cross-repo integration + retry/idempotency |
| Coach → Learn mapping | finding identity + registry | Coach detail, Knowledge hydration, learning-state suppression | deterministic allowlist/fail-closed tests |
| Localization copy | resources + affected UI | formatter if semantics change | localization/typecheck + representative runtime |
| Appearance/theme | theme owner + shared consumers | auth/onboarding/global overlays | representative runtime |
| Expo config/plugin | `app.config.ts`, `app.json`, dependency | entitlements/permissions, EAS profile, runtime version | Expo config/Doctor + native build when needed |
| Native dependency | package/config + integration | iOS/Android build, runtime compatibility, release docs | native build/install; OTA insufficient |
| EAS update workflow | workflow + runtime/update config | release gate, channel/branch semantics | workflow/config validation; publication separate |
| Mobile CI workflow | workflow + runner policy | required gates/path filters/concurrency/dedup | exact workflow validation on Hermes runner |
| Release gate | release workflow + docs | build/update artifacts, evidence | exact release-gate validation; activation separate |
| Backend deployment config | deployment docs/config + env contract | migrations, health checks, rollback, DNS/Caddy/Admin boundary | preflight + rollback + deliberate deployment evidence |
| Admin source | backend Admin + authorization | deployment trigger, editorial/ops authority, production impact | source validation; deployment/migration boundary checked separately |
| Provider config/secret | backend capability/config | secret store, readiness/fail-closed behavior | credential-blind preflight + staging evidence; never commit secrets |

## High-fan-out triggers

Treat a diff as high-fan-out when it touches:

- `src/context/AppContext.tsx` or `src/context/appContext/`;
- `src/context/SyncContext.tsx`;
- `src/context/applySyncPullResult.ts`;
- `src/cloud/` queue/recovery code;
- shared `src/api/` transport/auth code;
- `src/app/_layout.tsx` or primary tab layout;
- SecureStore/session/token logic;
- persisted entity IDs/timestamps/revisions;
- `src/features/progressPhotos/` storage/account-cleanup/native intake code;
- backend auth/session/device ownership;
- backend schema/migrations/shared repositories;
- provider capability/adapters;
- `.github/workflows/`, Expo config, native entitlements/plugins.

Inspect callers and tests before editing these areas.

## Cross-repository compatibility check

Before changing an API or persisted contract, answer:

1. Can the current production backend accept the released mobile payload?
2. Can the changed backend still serve the released mobile client?
3. Can the changed mobile tolerate the deployed backend during rollout?
4. Is the migration forward-safe and independently deployable?
5. Is capability activation gated until both sides are compatible?

If any answer is “no,” use a deliberate rollout/migration plan rather than an isolated PR.

## Documentation impact routing

A change may require updates when it alters:

- source-of-truth ownership → `ownership-map.md` + focused architecture;
- cross-module impact expectations → this file;
- validation evidence class → `validation-matrix.md`;
- top-level file/domain location → `PROJECT_MAP.md`;
- stable architecture → `docs/project-context.md` / focused architecture;
- mutable completion/blocker → `docs/current-status.md` / handoff;
- forward sequencing → implementation plan/roadmap;
- release evidence → QA/release docs.

Do not update broad docs for ordinary leaf implementation movement.
