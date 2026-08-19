# Proactive Coach Companion Card Contract

Updated: 2026-08-19

This package is the first foreground presentation surface for the reviewed Phase 16 Proactive Coach selector and account-scoped presentation state.

## Surface boundary

- The insight may render only inside the existing authenticated Companion/Coach screen.
- At most one card is visible.
- Home, push notifications, background delivery, badges, streaks and lock-screen surfaces remain out of scope.
- The card does not call a model/provider and does not create a new Coach-history authority.
- The card cannot mutate workouts, programs, goals, nutrition targets, Labs data, safety state or Companion progression.

## Presentation gate

1. Read the account-scoped proactive presentation record.
2. Run the deterministic selector over its bounded workout-session input.
3. If no eligible insight exists, render nothing.
4. If an insight exists, persist `lastShownAt` before exposing the card.
5. If the read or cooldown write fails, fail closed and render nothing.
6. A successful dismissal persists the stable evidence-derived insight key before hiding the card. A failed dismissal leaves the card visible.

This preserves the global seven-day cooldown across screen reopen/restart and prevents storage failure from becoming repeated presentation spam.

## Evidence handoff

- `strength_progress` and `strength_stagnation` open Training Progress with the selected exercise identity supplied as route context.
- Training Progress prefers the requested canonical `exerciseId`; legacy records may fall back to the normalized exercise name.
- Once the user manually selects another exercise, route context must not keep overriding that choice.
- `consistency_up` opens Activity Progress.

No new analytics screen or duplicate derived-fact implementation is introduced.

## Copy boundary

English and Russian copy must remain observational and evidence-specific. It may state bounded counts and comparable estimated-1RM trends. It must not imply diagnosis, guaranteed causality, punishment, a broken program, an obligation to train, or an automatically applied recommendation.

Negative consistency framing remains prohibited in v1.

## Validation

Runtime/source changes require exact-head Mobile CI before merge. Regression coverage must include persistence-before-display, storage failure fail-closed behavior, cooldown suppression, localized neutral copy and canonical/legacy exercise route selection.
