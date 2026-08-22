# Exercise Preferences + Smart Replace

Status: reviewed expansion contract, not a numbered roadmap phase.

Updated: 2026-08-22

## Product goal

Let a person record exercise-specific preferences and, in a later bounded slice, use those preferences together with canonical exercise intelligence to propose transparent replacements.

This expansion must not create a second favorites authority, silently rewrite programs, or introduce opaque model-generated exercise IDs.

## Authority boundaries

- Exercise identity/catalog authority remains `src/features/exercises/repository.ts` and the canonical exercise types/catalog sources it resolves.
- Favorites remain owned by `src/features/exercises/favoritesRepository.ts` and are not a preference flag.
- Exercise preference state is feature-local and device-local until a separately reviewed sync contract exists.
- Existing reviewed exercise-intelligence substitutions are the only eligible starting authority for future deterministic replacement candidates. A model must not synthesize or invent canonical exercise IDs.
- Program/workout mutations remain explicit user actions. Marking an exercise as avoided does not mutate a program or active workout.

## Foundation slice — authorized

The first source slice is intentionally narrow:

- per-exercise `avoid: boolean`;
- optional personal note, normalized and capped at 240 characters;
- one versioned/namespaced AsyncStorage record per exercise;
- corrupt/unknown stored data fails closed to a neutral preference;
- neutral preferences remove their storage record rather than accumulating empty state;
- detail-screen card with explicit Save, dirty-state protection, loading/saving disablement and localized status/error copy;
- RU/EN copy explicitly states that preferences do not yet change the program automatically;
- no backend, sync, AppContext, startup hydration or favorites migration.

## Smart Replace follow-up contract

A Smart Replace implementation may proceed only if it can stay deterministic and explainable over existing canonical data. The minimum contract is:

1. Start from reviewed substitutions attached to the current canonical exercise.
2. Resolve every candidate through the exercise repository; unresolved IDs are discarded.
3. Never return the current exercise itself.
4. Exclude candidates explicitly marked `avoid` by the user.
5. Prefer candidates compatible with the requested/available equipment only when that equipment context is explicit and canonical.
6. Return a bounded ordered candidate list plus human-readable reasons derived from deterministic rules.
7. Applying a replacement must require an explicit user action and preserve the surrounding workout/program prescription unless a separate mutation contract says otherwise.
8. If no valid candidate survives, fail closed with no replacement rather than inventing one.

A ranking implementation should remain a pure function where possible so rule ordering and fallback behavior are unit-testable.

## Not in the foundation slice

- backend persistence or cross-device sync;
- automatic program rewrites;
- automatic active-session replacement;
- injury/medical suitability claims;
- LLM-generated replacement IDs or free-form canonicalization;
- equipment inference from location without explicit user data;
- preference learning from behavior;
- dislike/favorite migration or semantic merging.

## Validation

Source validation for the foundation requires:

- TypeScript typecheck;
- full Vitest suite;
- repository/source contract coverage for fail-closed storage and favorites separation;
- source contract coverage that the detail UI exposes explicit save and does not claim automatic replacement.

Physical-device validation remains useful for keyboard layout, switch behavior and persistence across relaunch, but it is release evidence rather than permission to merge the source slice when CI is green.
