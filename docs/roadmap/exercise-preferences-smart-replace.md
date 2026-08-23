# Exercise Preferences + Smart Replace

Status: reviewed unnumbered expansion; active-session scope delivered, custom-template UI is the active next package.

Updated: 2026-08-23

## Product goal

Let a person record exercise-specific preferences and use those preferences together with canonical exercise intelligence to propose transparent replacements in exercise detail, active workouts and explicitly edited custom workout templates.

This expansion must not create a second favorites authority, silently rewrite programs, rewrite completed history or introduce opaque model-generated exercise IDs.

## Authority boundaries

- Exercise identity/catalog authority remains `src/features/exercises/repository.ts` and reviewed canonical exercise sources.
- Favorites remain owned by `src/features/exercises/favoritesRepository.ts` and are not a preference flag.
- Exercise preference state remains feature-local/device-local until a separately reviewed sync contract exists.
- Existing reviewed Exercise Intelligence substitutions are the only starting authority for deterministic Smart Replace candidates.
- Candidate mapping and mutation use exact canonical IDs; no name/fuzzy fallback.
- Marking an exercise `avoid` never mutates a workout/template by itself.
- Any active-session or template mutation requires explicit user action.
- Completed `WorkoutSession` history is immutable.

## Delivered checkpoints

- **Foundation #816** merged as `99427b189792489c1977d96959a366bac05962b9`.
- **Read-only candidate explorer #818** merged as `d396fc343019b96578f09fa2041dc6893bc5da9e`.
- **Active-session replacement safety #819** merged as `c52277f580b5255d801a8cc045b0d2d4d708dc54`; exact PR head `438ae2946abf58eec3dc8bd2da371b937a126cb2` passed Mobile CI #2823.
- **Active-session reviewed Apply #820** exact PR head `fb70be57fe735e835494e6895a5016d35fe962bd` passed Mobile CI #2830 and merged as `872d0a677d85b0d856a9ab6df6e08d655e949739` with `[ota]`.
- **Exact template identity/prescription remapping #824** established the safe template-editing primitive: explicit source/replacement IDs, exact catalog resolution and deterministic prescription identity remapping while preserving existing prescription fields.

Source merge is not OTA or physical-device evidence; publication/device smoke remain separate claims.

## Preference foundation — delivered

- per-exercise `avoid: boolean`;
- optional personal note, normalized and capped at 240 characters;
- versioned/namespaced AsyncStorage record per exercise;
- corrupt/unknown stored data fails closed to neutral;
- neutral preferences remove their storage record;
- detail-screen card with explicit Save and RU/EN copy;
- no backend/sync/AppContext/favorites migration.

## Smart Replace candidate explorer — delivered

Deterministic candidate authority:

1. Start from reviewed substitutions for the exact canonical source exercise.
2. Resolve every candidate through the exercise repository; unresolved IDs are discarded.
3. Exclude current exercise and deduplicate repeated IDs.
4. Exclude candidates explicitly marked `avoid` from the reviewed shortlist.
5. Prefer compatible equipment only when explicit canonical equipment context exists.
6. Otherwise preserve reviewed substitution order.
7. Return at most three reviewed candidates with deterministic reasons.
8. Fail closed when no valid reviewed candidate survives.

Manual exercise selection remains separate and available where the product already provides the full catalog.

## Active-session Apply — delivered

- suggestions appear only when the exact source exercise has at least one `completed === false` set;
- reviewed candidates map to workout catalog by exact canonical ID only;
- manual catalog remains available;
- explicit selection changes only pending sets;
- completed and legacy-completion evidence keeps source identity;
- set ID, load, reps, target/actual RPE, set type and superset membership are preserved;
- active draft persistence remains the existing authority;
- no automatic replacement.

## Template identity / prescription primitive — delivered by #824

The previous blocker is resolved at the template-editing primitive.

The primitive provides:

- explicit source and replacement exercise IDs;
- replacement metadata resolved by exact catalog identity;
- deterministic exercise identity replacement in the custom template;
- deterministic `Workout.prescription` exercise identity remapping;
- preservation of existing prescription fields and unrelated workout metadata;
- fail-closed behavior when exact identity cannot be established.

This primitive does **not** itself authorize automatic replacement or constitute the user-facing Smart Replace product flow.

## Custom-template Smart Replace UI — active package

### T1 — deterministic preview model — active first slice

Build a pure/read-only preview over the exact current custom template and #824 primitive.

Preview must expose:

- exact template ID/title;
- exact source/replacement exercise IDs and display names;
- affected exercise position/identity;
- affected prescription row identities/count;
- preserved/unaffected state summary;
- explicit unavailable reason for non-custom, missing source, replacement collision, unresolved replacement or unsafe remap.

Preview must not persist or mutate.

### T2 — explicit template UI

Add a Smart Replace entry point to the existing custom-template editing/detail surface.

- reviewed shortlist first;
- manual catalog fallback remains available;
- `avoid` filters only the reviewed shortlist;
- no automatic selection;
- no hidden model-generated candidates.

### T3 — confirm/apply + stale gate

- preview and Apply are separate user actions;
- Apply revalidates exact current template state before mutation;
- stale/unresolved/collision state writes nothing;
- reuse existing template/AppContext persistence/sync authority;
- unrelated workout/prescription fields stay unchanged;
- completed sessions/history stay unchanged;
- tests cover reorder/removal/replacement and prescription-row identity safety.

### T4 — package closure

Record exact-head Mobile CI evidence and update roadmap/current-status. Physical-device UX evidence remains release evidence, not source authority.

## Out of scope

- backend preference persistence/cross-device preference sync;
- automatic program/template rewrites;
- automatic active-session replacement;
- completed-session/history rewriting;
- injury/medical suitability claims;
- LLM-generated replacement IDs/free-form canonicalization;
- location-based equipment inference without explicit user data;
- preference learning from behavior;
- dislike/favorite semantic merging.

## Validation policy

Each runtime slice requires exact-head Mobile CI according to repository policy, including applicable line audits, agent navigation integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.
