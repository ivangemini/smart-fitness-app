# Latest Handoff

Updated: 2026-08-09

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- Latest runtime merge: `9c9e67a929d10e9f91475c92ba0b579bbadbb805` — PR #505 `Make Home a social-first hybrid`.
- Exact validated PR head: `9f28c198ed75070bcf10484ef09a28a78cbc5571`.
- Mobile CI #1931 passed the full required gate.
- PR #502 is closed unmerged and must not be revived.
- No Liquid Glass runtime package is currently active.

## Approved Home architecture

Home is a **social-first hybrid**, not a large fitness dashboard and not a generic social app.

Live order:

1. Home header/profile action;
2. compact expandable personal daily metrics;
3. future Stories only after real server/privacy/media contracts exist;
4. existing server-authoritative Social Following Feed.

The personal metrics surface remains useful without Social interaction. Collapsed state shows calories, P/F/C, Steps slot, and workout/program state. Expansion reveals calorie/macro progress, weight, recovery, streak, workout action, Add Food, and Log Weight.

Do not fabricate Steps or Stories. There is no approved step provider and no Stories DTO/lifecycle yet. Program-day workout state is real through `getWorkoutProgramSchedule`.

## LG-H1 delivered

- `src/components/home/HomeDailyMetricsPanel.tsx` owns the expandable Liquid Glass daily status.
- `src/features/social/useSocialFollowingFeed.ts` centralizes existing feed auth/cache/loading/pagination behavior.
- `src/features/social/screens/SocialFollowingFeedScreen.tsx` consumes that same hook while retaining the standalone route.
- `src/app/(tabs)/index.tsx` renders a `FlatList` of existing `SocialWorkoutPostCard` items directly below personal metrics.
- Pull refresh, bounded account cache, cursor pagination, auth/error/empty/cached states, safe-area clearance, and floating-tab clearance are preserved.
- Social remains server-authoritative and outside private revisioned `AppState` synchronization.
- Source-contract guards protect the new Home hierarchy, real schedule source, unavailable Steps, and shared feed authority.

## Validation

The first PR run exposed four stale tests that asserted the superseded Home and screen-local feed structure. They were updated without changing the approved runtime architecture.

Exact head `9f28c198ed75070bcf10484ef09a28a78cbc5571` passed Mobile CI #1931:

- repository and changed-file line audits;
- TypeScript;
- full regression suite;
- expanded model smoke;
- Expo export;
- Expo Doctor.

No unresolved review threads remained. PR #505 merged as `9c9e67a929d10e9f91475c92ba0b579bbadbb805`. The merge-triggered EAS Update was skipped; no OTA publication occurred.

## Social boundary

Continue to reuse `docs/roadmap/social-network.md`:

- Social is server-authoritative;
- private fitness state remains revisioned/offline-first and separate;
- Following remains chronological under the current contract;
- block/private-profile/moderation/account-deletion constraints remain authoritative;
- workout posts remain bounded immutable public snapshots created through explicit sharing.

Displaying private daily metrics above Social does not publish those metrics.

## Next planned work

- **LG-H2 — Stories:** first define/review server DTO, expiry, ownership, privacy, media, moderation, viewed-state, retention, and cache contracts; only then add the rail between metrics and feed.
- **LG-H3 — Steps:** connect a real device-health/activity source only after separately approved native dependency/permission work.
- **LG-H4 — feed retention:** improve workout-native posts, PR/milestone hierarchy, and useful social actions without generic engagement optimization.
- Resume remaining primary-tab Liquid Glass migration after Home is stable.

## Prohibited implicit actions

Do not perform backend work, OTA/EAS publication, native build/install, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation, or store submission without direct authorization.
