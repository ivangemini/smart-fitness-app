# Liquid Glass residual inventory

Updated: 2026-08-18

This document records the final repository-wide direct legacy-material inventory for the current reviewed Liquid Glass source scope.

## Final runtime baseline

Mobile runtime `main`: `cf4af93344b9b7645a839af46ac29866cc7ea218` (#746).

#746 merged the final residual runtime rollup after exact-head Mobile CI passed repository and changed-file line audits, TypeScript, the full regression suite, expanded-model smoke, Expo export and Expo Doctor. It superseded the earlier standalone #739, #742 and #743 residual PRs.

## Fresh inventory evidence

Evidence-only #747 was created directly from `cf4af93344b9b7645a839af46ac29866cc7ea218` and reran the same recursive scanner used by #734 across every `src/**/*.tsx` file.

The scanner reported 21 direct legacy-token hits. All 21 match previously inspected structural-divider ownership; there were no unmatched card, surface, control, selected, pressed, disabled or semantic material owners.

Exact residual hits:

- `src/app/sync-backup.tsx:152` — `colors.borderSubtle`;
- `src/components/auth/AuthGateCard.tsx:201` — `colors.border`;
- `src/components/profile/ProfileRuntimeInfoCard.tsx:84` — `colors.border`;
- `src/components/workouts/WorkoutHistorySessionCard.tsx:231` — `colors.borderSubtle`;
- `src/features/coach/components/CoachAppliedChangeCard.tsx:291` — `colors.borderSubtle`;
- `src/features/coach/components/CoachAppliedChangeCard.tsx:297` — `colors.borderSubtle`;
- `src/features/coach/components/CoachInputSummaryCard.tsx:271` — `colors.borderSubtle`;
- `src/features/coach/components/CoachRunTrustCard.tsx:83` — `colors.borderSubtle`;
- `src/features/coach/screens/CoachRunHistoryDetailScreen.tsx:279` — `colors.borderSubtle`;
- `src/features/coach/screens/CoachRunHistoryDetailScreen.tsx:318` — `colors.borderSubtle`;
- `src/features/settings/LocalPerformanceDiagnosticsCard.tsx:114` — `colors.borderSubtle`;
- `src/features/settings/LocalPerformanceDiagnosticsCard.tsx:154` — `colors.borderSubtle`;
- `src/features/settings/PrivacyAboutCards.tsx:14` — `colors.borderSubtle`;
- `src/features/settings/PrivacyAboutCards.tsx:24` — `colors.borderSubtle`;
- `src/features/settings/SupportDiagnosticsCard.tsx:16` — `colors.borderSubtle`;
- `src/features/settings/SyncConflictReviewCard.tsx:24` — `colors.borderSubtle`;
- `src/features/settings/SyncConflictReviewCard.tsx:81` — `colors.borderSubtle`;
- `src/features/settings/SyncSettingsCard.tsx:33` — `colors.borderSubtle`;
- `src/features/workouts/screens/WorkoutBuilderScreen.tsx:267` — `colors.borderSubtle`;
- `src/features/workouts/screens/WorkoutExerciseLibraryScreen.tsx:353` — `colors.borderSubtle`;
- `src/features/workouts/screens/WorkoutSessionFinishScreen.tsx:362` — `colors.borderSubtle`.

## Classification

These hits are intentional structural separators: metadata-row boundaries, section dividers, provenance/history separators, draft-row separators, header/footer boundaries and sticky-footer top borders. They do not own card/control material and therefore should not be mechanically replaced merely to make a token search return zero.

Native switches that previously owned legacy control colors were migrated in #746 to active Liquid Glass palette values while preserving native behavior. Coach semantic/status owners, shared shell owners, builder owners, Social warning/control owners and workout-finish integration controls are now covered by the merged convergence sequence.

## Closure result

Repository-wide Liquid Glass source convergence is **closed for the current reviewed scope**.

Reopen this priority only when one of the following occurs:

- a reachable screen demonstrates a partial/legacy material owner not represented by the intentional-divider set above;
- a refactor changes one of the retained divider owners into a card/control/material surface;
- a newly reviewed UI contract expands the convergence scope.

Evidence-only #747 was closed without merge after extracting the final inventory, as intended.
