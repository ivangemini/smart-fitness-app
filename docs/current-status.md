# Smart Fitness Current Status

Updated: 2026-08-09

## Verified mobile baseline

- Mobile repo: `ivangemini/smart-fitness-app`.
- Current `main`: `97d497ccda6bcc756d808190e4d84ce1de3f849f`.
- Latest runtime merge: `97d497ccda6bcc756d808190e4d84ce1de3f849f` (PR #521 — LG-3D Social shell + notification controls, batch 1).
- PR #521 exact validated head: `290f19513e1871f705cd87a3a78838e6ed27b609`; Mobile CI #1957 passed the full required gate.
- Previous LG-3C: PR #519 / Mobile CI #1955 / merge `7a9274d910c0e2dfc8bd270d0d1dc332989d6863`.
- Backend dependency-awareness baseline: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend remains out of scope.
- Active autonomous UI package: **LG-3E Social Share Workout material**.

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

## Home boundaries

Home remains social-first hybrid: compact personal daily metrics → Stories only after real contracts → existing server-authoritative Following Feed. LG-H2 Stories remains blocked on real DTO/lifecycle/privacy/media/moderation/view-state/cache contracts. LG-H3 Steps remains blocked on a reviewed native health/activity source and permissions. Do not fake either.

Focused roadmap: `docs/roadmap/liquid-glass.md`.
Social authority/privacy roadmap: `docs/roadmap/social-network.md`.

## LG-3D batch 1 complete — Social Notifications + Profile Lookup

PR #521 delivered:

- shared 44 pt `LiquidGlassIconButton` for Social Notification back navigation;
- notification cards on adaptive `cardFill/cardBorder` material with explicit `controlPressedFill` feedback rather than legacy selected-background + opacity ownership;
- shared back control for Social Profile Lookup;
- guards preserving notification optimistic-read/mark-read behavior and Profile Lookup validation/navigation contracts.

Preserved: notification pagination/request sequencing, missing-notification rollback/removal, profile/post routing, Profile Lookup safe-area/keyboard behavior, username validation/normalization, sign-in/profile routes, localization/accessibility, and Social API authority. No native blur was added per notification card or shell control.

One LG-3D residual remains: `SocialCommunityGuidelinesScreen` still uses a local bordered back Pressable. Its `AppCard` content does not need material churn.

## Validation state

PR #521 exact head `290f19513e1871f705cd87a3a78838e6ed27b609` passed Mobile CI #1957:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

Source/CI validation is not physical-device or release proof.

## Active LG-3E — Social Share Workout material

Read-only audit isolated a coherent presentation-only publishing package:

- replace Share Workout's local back control with shared `LiquidGlassIconButton`;
- migrate caption input, visibility toggle, preview shell/rows and material-owning controls to adaptive card/control/accent tokens with explicit pressed states;
- preserve publish/idempotency behavior, media release/cleanup, moderation errors, request sequencing, preview semantics, localization/accessibility, safe-area/keyboard behavior and Social API authority;
- keep inputs/preview rows blur-free;
- update the existing Share Workout source guard and add one focused material/no-blur guard.

After LG-3E, continue remaining LG-3 secondary batches by shared defect and revisit the single Guidelines back-control residual when it can be landed safely.

## Planned follow-up

- Complete LG-3E and remaining LG-3 secondary packages.
- **LG-4:** staged Workouts Liquid Glass migration.
- **LG-5:** bounded elevated chrome/motion.
- **LG-6:** visual QA/stabilization.
- **LG-H2/H3:** only after blockers are resolved; LG-H4 after the base Home feed is stable.

## Release / provider boundary

Do not perform or claim OTA/EAS publication, native build/install, production/provider activation, backend deployment/migrations, credentials/DNS changes, store submission, or HealthKit/Health Connect activation without explicit authorization.
