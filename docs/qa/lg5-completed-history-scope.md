# LG-5 completed-history scope evidence

Updated: 2026-08-10

## Question

The LG-5 validation matrix previously named `completed-history read/edit/delete` and the Liquid Glass roadmap described `editable-history save/delete semantics`. Before treating that wording as runtime work, the current source and history were checked to determine whether completed-history mutation is an existing product contract or stale roadmap prose.

## Current source evidence

- `src/features/workouts/screens/WorkoutHistoryScreen.tsx` is a virtualized history list. Its session rows navigate to detail; the screen exposes no completed-session edit, delete, swipe, long-press or contextual mutation action.
- `src/features/workouts/screens/WorkoutHistoryDetailScreen.tsx` reads completed sessions and presents the stored record. It does not consume workout mutation actions and exposes no edit/delete controls.
- `src/app/workout-history/[sessionId].tsx` is only the route wrapper for that detail screen; it does not add a mutation flow.
- `src/context/appContext/useWorkoutStateActions.ts` exposes generic workout-session update/delete actions to application code, but availability of state actions does not establish a completed-history UI contract when no completed-history surface consumes them.

## Historical evidence

Commit `b91bd6f1dc3166f6bdc95838cae254c9af63d2ed` introduced the completed workout history/detail surfaces with an explicit contract: display immutable Safety & Recovery context, logged sets, volume and RPE **without modifying training data**. Subsequent history-screen work localized, scaled, themed and refactored those read surfaces without establishing a completed-history mutation UI.

## LG-5 decision

Completed-history validation in the current product scope means:

- history retention and stable record identity;
- list/detail navigation;
- faithful read-only presentation of logged session data and immutable historical Safety & Recovery context;
- responsive/theme/safe-area/accessibility behavior of those read surfaces.

LG-5 must not invent edit/delete controls merely to satisfy stale matrix wording. A completed-history mutation workflow would be new product behavior and requires explicit prioritization plus its own data/sync/audit semantics review.

No runtime source change is warranted by this audit.