# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge the Smart Fitness mobile UI on the Liquid Glass material language already established by the floating bottom navigation while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization and backend contracts.

The Home product role is now explicitly **social-first hybrid**: personal fitness context stays immediately visible, but the continuously updating Social feed becomes the main scroll surface and retention loop.

## Status

- Phase 10 responsive source hardening is complete for the current source scope.
- VUX secondary-surface cleanup is complete through VUX-7F.
- **LG-1 shared foundation is complete:** PR #501, merge `ca11c1a66495ec71832a0abfd54fa4bbef0391c8`, exact-head Mobile CI #1922 passed.
- **LG-2A original Home Liquid Glass pilot is complete:** PR #503, exact head `e93bbbdfe27b3c6858c3e17402d138751e98e9e5`, Mobile CI #1925 passed, merge `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`.
- **LG-H1 social-first Home redesign is the active priority.** It supersedes the previously queued Progress + Coach migration.
- Stale overlapping PR #502 is closed and must not be revived.
- No OTA/EAS publication, native install/build or physical-device proof is part of autonomous source execution.

## LG-1 — shared foundation

**Status: complete.**

Delivered:

- central adaptive Liquid Glass token contract;
- reusable `LiquidGlassSurface`;
- `AppCard` migration;
- `PrimaryButton` / `SecondaryButton` theme-aware glass states;
- floating tab bar migration from local hardcoded material values to the shared adaptive token system;
- initial Home semantic material migration;
- source-contract guards and blur/performance architecture rules.

The shared foundation deliberately avoids one backdrop blur per card/list row. Content surfaces use translucent material by default; true blur is reserved for bounded elevated/floating roles.

## LG-H — social-first Home

### LG-H1 — expandable daily metrics + existing Social feed

**Status: active.**

Goal: replace the large dashboard stack with one compact expandable personal-status surface followed directly by the existing following feed.

Collapsed Home hierarchy:

1. Home header + Profile action;
2. compact Liquid Glass daily metrics surface;
3. Stories slot only when a real server contract exists;
4. chronological Social workout feed.

Collapsed metrics must prioritize:

- calories consumed / target;
- protein / fat / carbohydrates;
- steps slot;
- active workout or program-scheduled workout/rest-day state.

Expanded metrics reveal more personal context without navigating away from Home:

- macro progress and targets;
- workout action;
- current weight;
- recovery status;
- workout streak;
- lightweight Add Food / Log Weight actions where useful.

Implementation rules:

- use one expandable Liquid Glass owner instead of several stacked dashboard cards;
- preserve explicit 44 pt interaction ownership;
- keep expansion state presentation-only and non-persisted;
- use `getWorkoutProgramSchedule` for real program-day state rather than inventing a schedule;
- do not fabricate step values: render the unavailable state until a real step provider exists;
- reuse the existing server-authoritative following-feed API/cache/contracts and workout-post card;
- keep feed pagination/refresh and block/privacy/moderation enforcement unchanged;
- do not move Social data into private `AppState` synchronization;
- Home remains useful while signed out/offline: personal metrics stay available and Social renders an explicit bounded state;
- Stories are not represented as fake local content.

Exit criteria:

- old Home Summary / Quick Actions / Weekly Snapshot are no longer the primary Home hierarchy;
- compact personal metrics occupy substantially less vertical space when collapsed;
- metrics expand/collapse in place and remain short-screen reachable;
- existing Following Feed is visible directly on Home for authenticated users;
- no duplicate Social privacy or cache architecture is introduced;
- full exact-head Mobile CI is green.

### LG-H2 — Stories contracts and rail

**Status: planned; requires real Social contracts before UI activation.**

Stories belong **between personal metrics and feed**, never above the personal metrics block. The target hierarchy is therefore `personal status → stories → feed`, not `stories → fitness → feed`.

Before implementation define:

- story DTO/schema versions and expiry semantics;
- author/follow/block/private-profile enforcement;
- image/video media state and moderation reuse boundaries;
- viewed/unviewed state and bounded retention;
- create/delete ownership and account-deletion behavior;
- pagination/bounded rail loading;
- privacy-safe cache policy if any.

Do not add story placeholders that look like real user content before these contracts exist.

### LG-H3 — real steps / activity source

**Status: planned.**

The daily metrics component reserves a steps role, but a real value requires a reviewed device-health/activity source. Do not infer steps from workouts or fabricate data. Any HealthKit/Health Connect/native dependency, permission disclosure and native build evidence remain separately approval-gated.

### LG-H4 — feed retention refinement

**Status: planned after Home feed integration is stable.**

Potential work:

- improve workout-native post hierarchy, PR/milestone presentation and reactions/comments visibility;
- discovery/creator content only through explicit server-authoritative contracts;
- keep retention aligned with useful fitness actions rather than generic infinite-scroll engagement;
- preserve chronological Following semantics until a separately reviewed ranking contract exists.

## LG-2 — remaining primary tabs

Resume only after LG-H1 is merged and the Home hierarchy is stable.

### LG-2B — Progress + Coach primary surfaces

Audit/migrate one coherent batch covering direct, visible Progress and Coach surfaces that still bypass the shared Liquid Glass material system.

Rules:

- keep charts, dense metrics and structured Coach output readable rather than placing blur behind every row;
- prefer shared primitives over local `rgba(...)` recipes;
- preserve semantic success/warning/error meaning;
- preserve existing Progress analytics and Coach domain behavior;
- do not reopen already-correct responsive geometry;
- use true blur only for bounded elevated/priority chrome where it materially improves hierarchy.

### LG-2C — Nutrition primary surfaces

After Progress + Coach, migrate diary summaries, section ownership and actions while keeping dense food rows fast and legible. Do not create a blur view per food row.

### LG-2D — Profile primary surfaces

After Nutrition, converge Profile goals/settings/actions onto the proven shared material system while preserving the theme/safe-area work already completed.

## LG-3 — secondary surfaces

**Goal:** converge child routes after the primary visual language is stable.

Targets include Settings/account, Sync & Backup, Social detail surfaces, Progress weight/history detail, Nutrition add/edit/detail, Coach review/proposal/history/recovery/limitations, and exercise detail/library surfaces outside the active workout logger.

Batch adjacent screens that share the same material defect instead of creating one PR per screen.

## LG-4 — Workouts system

**Goal:** migrate the intentionally dense workout experience without sacrificing logger ergonomics.

Order:

1. Workouts hub and program/routine cards;
2. exercise library and program builder;
3. active workout chrome and exercise containers;
4. set table fields/selection/completion states;
5. finish/summary surfaces.

Constraints:

- preserve active-session persistence and save/cancel/finish behavior;
- keep set/kg/reps alignment and dense table readability;
- keep input controls visually stronger than decorative glass;
- do not place expensive blur views behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for sticky action bars, modal/sheet headers, compact floating selectors and other bounded context controls. Reuse spring/haptic language where interaction semantics justify it; do not animate static content gratuitously.

## LG-6 — visual QA and stabilization

Source/CI checks:

- no regression to local duplicated glass token sets in migrated shared surfaces;
- line-limit, TypeScript, full regression, model smoke, Expo export and Expo Doctor green;
- source guards preserve 44 pt ownership and explicit disabled states.

Physical validation when separately authorized:

- iPhone short/tall devices;
- Android inset/blur fallback;
- light/dark/system;
- EN/RU and large Dynamic Type;
- keyboard-open states;
- populated/empty/loading/error/success/disabled states;
- scroll and animation performance on feed/list-heavy screens.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/social integration must reuse existing Social authority rather than duplicate it. Exact current Git history and source contracts override stale roadmap prose.