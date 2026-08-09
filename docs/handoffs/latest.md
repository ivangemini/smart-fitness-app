# Latest Handoff

Updated: 2026-08-09

## Checkpoint

- Mobile repo: `ivangemini/smart-fitness-app`.
- LG-H1 branch base: `0fa4c0be06247bbbf60359488f67520b4cf0704f`.
- Active branch: `ui/home-social-first-hybrid`.
- Stale PR #502 is closed unmerged and must not be revived.
- Backend baseline checked at task start: `1d10bbbfcfe4974121d5c7e9bf1b7de4f0bad068`; backend has no open PR and remains out of scope.

## Approved Home architecture

Home is a **social-first hybrid**, not a large fitness dashboard and not a generic social app.

Target order:

1. Home header/profile action;
2. compact expandable personal daily metrics;
3. future Stories only after real server/privacy/media contracts exist;
4. existing server-authoritative Social Following Feed.

The personal metrics surface must stay immediately useful and must not require Social interaction. Its collapsed state prioritizes calories, P/F/C, Steps, and workout/scheduled-workout state. Expansion reveals more daily detail and actions in place.

Do not fabricate Steps or Stories. The codebase currently has no approved step provider and no Stories API/DTO lifecycle. Program-day workout state is real and available through `getWorkoutProgramSchedule`.

## Current LG-H1 implementation

- `src/components/home/HomeDailyMetricsPanel.tsx`
  - one expandable Liquid Glass owner;
  - local non-persisted expand/collapse state;
  - calorie/macro summary and progress;
  - steps unavailable state;
  - active/scheduled/rest/next workout context;
  - weight, recovery, streak and workout/Add Food/Log Weight actions;
  - 44 pt interaction ownership.
- `src/features/social/useSocialFollowingFeed.ts`
  - shared existing Following Feed auth/cache/load/pagination behavior;
  - reuses the account-scoped bounded cache and current Social API;
  - no second feed authority/store.
- `src/features/social/screens/SocialFollowingFeedScreen.tsx`
  - now consumes the shared feed hook while retaining its standalone route.
- `src/app/(tabs)/index.tsx`
  - replaces old Summary/Quick Actions/Weekly Snapshot live hierarchy;
  - uses a `FlatList` of existing `SocialWorkoutPostCard` items below the expandable metrics;
  - keeps pull refresh, empty/auth/error/cached/pagination states;
  - preserves safe-area and floating-tab clearance.
- `tests/homeSocialFirst.source.test.ts` and updated Home shell guards protect the approved hierarchy.
- `docs/roadmap/liquid-glass.md`, `AGENTS.md`, `docs/project-context.md`, and `docs/current-status.md` are synchronized to the new direction.

## Social boundary

Reuse `docs/roadmap/social-network.md`:

- Social is server-authoritative;
- private fitness state remains revisioned/offline-first and separate;
- following feed remains chronological under the current contract;
- existing block/private-profile/moderation/account-deletion constraints remain authoritative;
- workout posts are bounded immutable public snapshots created only through explicit sharing.

Displaying private daily metrics above Social does not publish those metrics.

## Required next steps

1. Inspect the exact branch diff and line counts; keep every hand-written source/architecture file <=500 physical lines.
2. Run/fix source-contract and TypeScript issues before opening the final PR where possible.
3. Open one bounded LG-H1 PR against exact current `main`.
4. Run one exact-head Mobile CI gate: line audits, TypeScript, full regression, expanded model smoke, Expo export, Expo Doctor.
5. Fix only concrete failures and revalidate the exact head if required.
6. Check unresolved review threads.
7. Merge only the exact validated head.
8. Mark LG-H1 complete in a docs-only follow-up if the runtime PR should remain stable after validation.

## Planned follow-up

- LG-H2: Stories server/privacy/media/expiry/view-state contracts, then rail between metrics and feed.
- LG-H3: real device steps/activity source after separately approved native/permission work.
- LG-H4: workout-native feed retention refinement.
- Resume remaining primary-tab Liquid Glass work only after Home hierarchy is stable.

## Prohibited implicit actions

Do not perform backend work, OTA/EAS publication, native build/install, production/provider activation, credentials/DNS changes, destructive production cleanup, HealthKit/Health Connect activation, or store submission without direct authorization.
