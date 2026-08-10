# LG-5 — Workouts resilience batch

Date: 2026-08-10

## Scope

Validation-first follow-up across Workouts creation/editing surfaces for short-height layouts, increased text size, long localized copy, keyboard-open forms and interaction sizing.

## Demonstrated defects corrected

### Program Add Workout choice mode

The picker panel was capped at 92% height with overflow hidden, while the initial choice mode rendered localized header/copy and two action cards in a non-scrollable View. On short-height or increased-text configurations, the lower choice could become clipped or unreachable.

Correction:

- keep the existing safe-area-aware overlay;
- make choice mode vertically scrollable;
- allow the choice scroll viewport to shrink inside the bounded panel;
- allow choice titles/subtitles to shrink and wrap instead of overflowing narrow layouts;
- preserve the virtualized FlatList path for existing workouts and all selection/add semantics.

### New Routine expanded exercise notes

The expanded exercise notes TextInput had a 42 px minimum height, below the established 44 px direct-interaction minimum.

Correction:

- raise only the notes input minimum height to 44 px;
- preserve the existing keyboard-aware ScrollView, exercise editing semantics and table layout.

## Reassessed neighboring boundaries

The main Workout Builder screen already owns KeyboardAvoidingView, automaticallyAdjustKeyboardInsets, handled keyboard taps and dynamic bottom safe-area padding. The Workout Editor overlay already owns top/bottom safe-area clearance plus a keyboard-aware scroll boundary. The Finish screen already uses keyboard avoidance, measured footer clearance and safe-area padding. No broad rewrites were introduced where the current source contract already met this LG-5 pass.

No persistence, synchronization, routing, workout/program lifecycle, backend, native, deployment or release changes are included.
