# LG-5 — Create Program keyboard safety

Date: 2026-08-10

## Demonstrated source defect

The Workouts `CreateProgramModal` auto-focused its name input while rendering the form in a centered non-scrollable modal container. The boundary had no keyboard avoidance and no modal safe-area ownership, so short-height / increased-text configurations could make the action row unreachable while the keyboard was open.

## Bounded correction

- Wrap the modal content in `KeyboardAvoidingView`.
- Keep the form in a vertically scrollable container with `keyboardShouldPersistTaps="handled"`.
- Derive top/bottom modal clearance from `useSafeAreaInsets()` plus shared spacing.
- Preserve auto-focus, validation, submit, cancel and create semantics.
- Add a source guard for the keyboard/safe-area contract.

No workout/program persistence, routing, synchronization or backend contract changes are included.
