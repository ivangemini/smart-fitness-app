# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge Smart Fitness on the Liquid Glass material language while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, and backend contracts.

Home is explicitly **social-first hybrid**: personal fitness context stays immediately visible while the continuously updating Social feed is the main scroll surface and retention loop.

## Status

- Phase 10 responsive source hardening is complete for the current source scope.
- VUX secondary-surface cleanup is complete through VUX-7F.
- **LG-1 shared foundation complete:** PR #501, merge `ca11c1a66495ec71832a0abfd54fa4bbef0391c8`, Mobile CI #1922.
- **LG-2A original Home Liquid Glass pilot complete:** PR #503, merge `5ad7bd047b89878243d8cf7923c70d3fe7b7787e`, Mobile CI #1925.
- **LG-H1 social-first Home complete:** PR #505, exact green head `9f28c198ed75070bcf10484ef09a28a78cbc5571`, Mobile CI #1931, merge `9c9e67a929d10e9f91475c92ba0b579bbadbb805`.
- **LG-2B Progress + Coach primary surfaces is active:** first bounded Progress batch on `ui/lg2b-progress-coach-primary`; Coach primary audit found existing shared primitives already compliant.
- LG-H2 Stories and LG-H3 Steps remain blocked by required server/native contracts and must not be faked to unblock UI work.
- Stale overlapping PR #502 was closed unmerged and must not be revived.
- No OTA/EAS publication, native install/build, or physical-device proof is implied by these source changes.

## LG-1 — shared foundation

**Status: complete.**

Delivered adaptive Liquid Glass tokens, reusable `LiquidGlassSurface`, shared card/buttons, adaptive floating navigation, semantic Home material states, source guards, and blur/performance rules.

Content glass remains translucent without one native blur per card/list row. True backdrop blur is reserved for bounded elevated/floating roles.

## LG-H — social-first Home

### LG-H1 — expandable daily metrics + existing Social feed

**Status: complete.**

Delivered one compact expandable Liquid Glass daily-metrics owner, real workout/program schedule context, unavailable Steps rather than fabricated data, and the existing server-authoritative chronological Following Feed directly on Home. The shared `useSocialFollowingFeed` hook preserves auth, bounded account cache, pull refresh, cursor pagination, block/private-profile/moderation boundaries, and immutable workout-post rendering. Social remains separate from private revisioned `AppState` synchronization.

Exact head `9f28c198ed75070bcf10484ef09a28a78cbc5571` passed repository/changed-file line audits, TypeScript, full regression, expanded model smoke, Expo export, and Expo Doctor in Mobile CI #1931. PR #505 merged as `9c9e67a929d10e9f91475c92ba0b579bbadbb805`; merge-triggered EAS Update was skipped.

### LG-H2 — Stories contracts and rail

**Status: planned; blocked on real Social contracts.**

Stories belong **between personal metrics and feed**, so the target hierarchy remains `personal status → stories → feed`.

Before implementation define and review:

- story DTO/schema versions and expiry semantics;
- create/delete ownership;
- author/follow/block/private-profile enforcement;
- image/video media lifecycle and moderation reuse boundaries;
- viewed/unviewed state;
- bounded retention and account-deletion behavior;
- rail pagination/loading;
- privacy-safe cache policy.

Do not add story placeholders that look like real user content before these contracts exist.

### LG-H3 — real steps / activity source

**Status: planned; blocked on reviewed native source/permissions.**

The daily metrics panel reserves a Steps role, but a real value requires a reviewed device-health/activity source. Do not infer steps from workouts or fabricate values. HealthKit/Health Connect/native dependency, permission disclosure, and physical runtime evidence remain separately approval-gated.

### LG-H4 — feed retention refinement

**Status: planned after the base Home feed is stable.**

Potential work:

- strengthen workout-native post hierarchy, PR/milestone presentation, reactions, and comments visibility;
- add discovery/creator content only through explicit server-authoritative contracts;
- optimize retention toward useful fitness actions rather than generic infinite-scroll engagement;
- preserve chronological Following semantics until a separately reviewed ranking contract exists.

## LG-2 — remaining primary tabs

### LG-2B — Progress + Coach primary surfaces

**Status: active; first bounded Progress batch in progress.**

Audit result:

- Coach primary already uses shared `AppCard` and `AppButton` primitives, so no artificial runtime diff is required there;
- Progress still contains direct local material recipes and is being migrated in coherent batches.

First bounded batch:

- migrate the 7D/30D/90D Progress weight-range selector to shared `LiquidGlassSurface` plus adaptive selected/pressed glass tokens;
- migrate body-measurement metric/unit controls and text inputs to adaptive control tokens;
- migrate the reusable Progress trend-chart shell to shared `LiquidGlassSurface` without per-chart native blur;
- add a source-contract regression guard for these surfaces and already-compliant Coach primary usage.

Preserve 44 pt interaction ownership, analytics, navigation, persistence, localization, accessibility states, chart data, and Coach domain behavior.

This batch does **not** complete LG-2B. Remaining Progress debt includes nested Safety/Recovery filters/detail summary surfaces that still use local material recipes. Continue them as a coherent follow-up after the first batch passes exact-head CI and merges.

### LG-2C — Nutrition primary surfaces

Migrate diary summaries, section ownership, and actions while keeping dense food rows fast and legible. Do not create a blur view per food row.

### LG-2D — Profile primary surfaces

Converge Profile goals/settings/actions onto the shared material system while preserving completed theme/safe-area work.

## LG-3 — secondary surfaces

Converge Settings/account, Sync & Backup, Social detail, Progress detail, Nutrition add/edit/detail, Coach detail, and exercise detail/library surfaces. Batch adjacent surfaces sharing the same material defect rather than creating one PR per screen.

## LG-4 — Workouts system

Migrate deliberately in this order:

1. Workouts hub and program/routine cards;
2. exercise library and program builder;
3. active workout chrome and exercise containers;
4. set-table fields/selection/completion states;
5. finish/summary surfaces.

Preserve active-session persistence, save/cancel/finish behavior, set/kg/reps alignment, dense table readability, and strong input controls. Do not place expensive blur views behind every set row.

## LG-5 — elevated chrome and motion

Use true blur selectively for sticky action bars, modal/sheet headers, compact floating selectors, and other bounded context controls. Reuse spring/haptic language where interaction semantics justify it.

## LG-6 — visual QA and stabilization

Source/CI checks:

- no regression to duplicated local glass token sets;
- line limits, TypeScript, full regression, model smoke, Expo export, and Expo Doctor green;
- source guards preserve 44 pt ownership and explicit disabled states.

Physical validation when separately authorized:

- short/tall iPhones;
- Android inset/blur fallback;
- light/dark/system;
- EN/RU and large Dynamic Type;
- keyboard-open states;
- populated/empty/loading/error/success/disabled states;
- feed/list scroll and animation performance.

## Execution rule

Prefer coherent migration batches over one-screen micro-PRs. Home/Social integration must reuse existing Social authority rather than duplicate it. Exact code, tests, and current Git history override stale roadmap prose.
