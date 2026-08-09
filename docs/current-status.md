# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `32447156ece5b777b574a52288809f2025328147`.
- Latest runtime merge: `32447156ece5b777b574a52288809f2025328147` (PR #523 — LG-3E Social Share Workout material).
- PR #523 exact validated head: `6efd2e3e13222b037da8180d3fddddc13561a12e`; Mobile CI #1960 passed the full required gate.
- Previous LG-3D batch 1: PR #521 / Mobile CI #1957 / merge `97d497ccda6bcc756d808190e4d84ce1de3f849f`.
- Backend dependency-awareness baseline: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3D Community Guidelines residual**.

Exact code, tests, and current Git history override this checkpoint if it becomes stale.

## Completed UI foundation

Responsive mobile source hardening is complete for the current source scope. Safe-area, keyboard, reflow, touch-target, floating-tab clearance and secondary-surface theme work are established and must not be regressed.

Liquid Glass milestones:

- PR #501 shared foundation / Mobile CI #1922.
- PR #503 initial Home pilot / Mobile CI #1925.
- PR #505 LG-H1 social-first Home / Mobile CI #1931.
- PR #507 + #509 LG-2B Progress + Coach primary / Mobile CI #1937 + #1943.
- PR #511 LG-2C Nutrition primary / Mobile CI #1947.
- PR #513 LG-2D Profile primary / Mobile CI #1949.
- PR #515 LG-3A Settings controls/disclosures / Mobile CI #1951.
- PR #517 LG-3B Nutrition secondary / Mobile CI #1953.
- PR #519 LG-3C Social interaction controls / Mobile CI #1955.
- PR #521 LG-3D batch 1 / exact head `290f19513e1871f705cd87a3a78838e6ed27b609` / Mobile CI #1957 / merge `97d497ccda6bcc756d808190e4d84ce1de3f849f`.
- PR #523 LG-3E Share Workout / exact head `6efd2e3e13222b037da8180d3fddddc13561a12e` / Mobile CI #1960 / merge `32447156ece5b777b574a52288809f2025328147`.

## Home boundaries

Home remains social-first hybrid: compact personal daily metrics → Stories only after real contracts → existing server-authoritative Following Feed. LG-H2 Stories remains blocked on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains blocked on a reviewed native health/activity source and permissions. Do not fake either.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-3E complete — Social Share Workout material

PR #523 delivered a presentation-only migration:

- Share Workout back navigation now uses shared 44 pt `LiquidGlassIconButton`;
- caption input, managed-media preview, workout preview metrics and progress track use adaptive `controlFill/controlBorder` material;
- the final patch deliberately preserved the pre-existing typography, spacing, preview-grid geometry, success styling and native Switch sizing rather than coupling unrelated redesign churn to the material migration;
- focused guards cover shared back ownership, adaptive/no-blur material and publish/idempotency/media-release contracts.

Preserved: publish state machine, `syncNow()` sequencing, idempotency key semantics, managed-media release/cleanup, moderation/rate-limit errors, preview/share-control semantics, native Switch behavior, localization/accessibility and safe-area/keyboard ownership. No native blur was added behind publishing inputs or preview rows.

## Validation state

PR #523 exact head `6efd2e3e13222b037da8180d3fddddc13561a12e` passed Mobile CI #1960:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Active residual — Social Community Guidelines back control

`SocialCommunityGuidelinesScreen` is the only explicit LG-3D residual. Its content already uses shared `AppCard`, so the bounded task is only to replace the local 44 pt bordered back `Pressable` with `LiquidGlassIconButton` and remove the obsolete local back/opacity styles. Preserve copy, cards, warning note, routing, localization, accessibility and safe-area geometry.

After that residual lands, continue remaining LG-3 secondary surfaces by shared material defect: Settings/account, Sync & Backup, Social profile/detail, Progress detail, Coach detail and exercise detail/library.

## Planned follow-up

- Close the Guidelines residual, then continue remaining LG-3 secondary packages.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
