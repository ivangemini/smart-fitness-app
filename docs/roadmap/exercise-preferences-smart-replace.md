# Exercise Preferences + Smart Replace

Status: reviewed expansion contract, not a numbered roadmap phase.

Updated: 2026-08-22

## Product goal

Let a person record exercise-specific preferences and use those preferences together with canonical exercise intelligence to propose transparent replacements.

This expansion must not create a second favorites authority, silently rewrite programs, or introduce opaque model-generated exercise IDs.

## Authority boundaries

- Exercise identity/catalog authority remains `src/features/exercises/repository.ts` and the canonical exercise types/catalog sources it resolves.
- Favorites remain owned by `src/features/exercises/favoritesRepository.ts` and are not a preference flag.
- Exercise preference state is feature-local and device-local until a separately reviewed sync contract exists.
- Existing reviewed exercise-intelligence substitutions are the only eligible starting authority for deterministic replacement candidates. A model must not synthesize or invent canonical exercise IDs.
- Program/workout mutations remain explicit user actions. Marking an exercise as avoided does not mutate a program or active workout.

## Foundation slice — authorized

The first source slice is intentionally narrow:

- per-exercise `avoid: boolean`;
- optional personal note, normalized and capped at 240 characters;
- one versioned/namespaced AsyncStorage record per exercise;
- corrupt/unknown stored data fails closed to a neutral preference;
- neutral preferences remove their storage record rather than accumulating empty state;
- detail-screen card with explicit Save, dirty-state protection, loading/saving disablement and localized status/error copy;
- RU/EN copy explicitly states that preferences do not change the program automatically;
- no backend, sync, AppContext, startup hydration or favorites migration.

## Smart Replace candidate explorer — authorized

The read-only candidate explorer may proceed inside the following bounded contract:

1. Start from reviewed substitutions attached to the current canonical exercise.
2. Resolve every candidate through the exercise repository; unresolved IDs are discarded.
3. Never return the current exercise itself and deduplicate repeated candidate IDs.
4. Exclude candidates explicitly marked `avoid` by the user.
5. Prefer candidates compatible with requested/available equipment only when that equipment context is explicitly supplied and uses canonical equipment values.
6. Without explicit equipment context, preserve reviewed substitution order rather than inferring availability from the current exercise, location or device state.
7. Return at most three ordered candidates plus human-readable reasons derived from deterministic rules.
8. Candidate UI may open the canonical exercise detail only. It must not mutate a program or active workout.
9. If no valid candidate survives or candidate loading fails, fail closed with no replacement rather than inventing one.

The ranking implementation remains a pure function so filtering, ordering and fallback behavior are unit-testable.

## Explicit Apply/Replace mutation — separately gated

Applying a replacement inside a program or active workout is not authorized merely because the candidate explorer exists. A mutation slice must first identify the concrete surrounding program/workout context and prove that it can:

- require an explicit user action;
- preserve the surrounding prescription and unrelated exercise state;
- avoid silently changing completed sets or historical records;
- retain a deterministic canonical exercise ID;
- define persistence/sync behavior for that exact mutation path;
- remain reversible or otherwise provide a clear confirmation boundary where appropriate.

Until that contract is reviewed against the actual mutation surface, Smart Replace remains advisory/read-only.

## Out of scope

- backend preference persistence or cross-device preference sync;
- automatic program rewrites;
- automatic active-session replacement;
- injury/medical suitability claims;
- LLM-generated replacement IDs or free-form canonicalization;
- equipment inference from location without explicit user data;
- preference learning from behavior;
- dislike/favorite migration or semantic merging.

## Validation

Foundation validation requires:

- TypeScript typecheck;
- full Vitest suite;
- repository/source contract coverage for fail-closed storage and favorites separation;
- source contract coverage that the detail UI exposes explicit save and does not claim automatic replacement.

Candidate-explorer validation additionally requires:

- pure ranking tests for reviewed order, unresolved/current/duplicate filtering, `avoid`, explicit equipment prioritization and the three-candidate bound;
- source-contract coverage that candidate IDs resolve through the canonical repository and candidate preferences are loaded before ranking;
- source-contract coverage that the candidate surface opens details only and contains no program/workout mutation authority;
- RU/EN copy that states opening a suggestion does not change the program or active workout.

Physical-device validation remains useful for keyboard layout, preference persistence and candidate presentation, but it is release evidence rather than permission to merge source when exact-head CI is green.
