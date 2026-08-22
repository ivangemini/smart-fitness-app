# Exercise Preferences + Smart Replace

Status: reviewed unnumbered expansion; source delivered through bounded active-session Apply.

Updated: 2026-08-22

## Product goal

Let a person record exercise-specific preferences and use those preferences together with canonical exercise intelligence to propose transparent replacements.

This expansion must not create a second favorites authority, silently rewrite programs, or introduce opaque model-generated exercise IDs.

## Authority boundaries

- Exercise identity/catalog authority remains `src/features/exercises/repository.ts` and the canonical exercise types/catalog sources it resolves.
- Favorites remain owned by `src/features/exercises/favoritesRepository.ts` and are not a preference flag.
- Exercise preference state is feature-local and device-local until a separately reviewed sync contract exists.
- Existing reviewed exercise-intelligence substitutions are the only eligible starting authority for deterministic replacement candidates. A model must not synthesize or invent canonical exercise IDs.
- Program/workout mutations require explicit user action. Marking an exercise as avoided never mutates a program or active workout by itself.

## Delivered checkpoints

- **Foundation #816** merged as `99427b189792489c1977d96959a366bac05962b9`.
- **Read-only candidate explorer #818** merged as `d396fc343019b96578f09fa2041dc6893bc5da9e`.
- **Active-session replacement safety #819** merged as `c52277f580b5255d801a8cc045b0d2d4d708dc54`; exact PR head `438ae2946abf58eec3dc8bd2da371b937a126cb2` passed Mobile CI #2823.
- **Active-session reviewed Apply #820** exact PR head `fb70be57fe735e835494e6895a5016d35fe962bd` passed Mobile CI #2830 and squash-merged as `872d0a677d85b0d856a9ab6df6e08d655e949739` with `[ota]`.

Source merge is not OTA or physical-device evidence; publication and device smoke remain separate claims.

## Preference foundation — delivered

- per-exercise `avoid: boolean`;
- optional personal note, normalized and capped at 240 characters;
- one versioned/namespaced AsyncStorage record per exercise;
- corrupt/unknown stored data fails closed to a neutral preference;
- neutral preferences remove their storage record rather than accumulating empty state;
- detail-screen card with explicit Save, dirty-state protection, loading/saving disablement and localized status/error copy;
- RU/EN copy states that preferences do not change programs automatically;
- no backend, sync, AppContext, startup hydration or favorites migration.

## Smart Replace candidate explorer — delivered

The deterministic candidate authority is:

1. Start from reviewed substitutions attached to the current canonical exercise.
2. Resolve every candidate through the exercise repository; unresolved IDs are discarded.
3. Never return the current exercise itself and deduplicate repeated candidate IDs.
4. Exclude candidates explicitly marked `avoid` by the user.
5. Prefer compatible equipment only when explicit canonical equipment context is supplied.
6. Without explicit equipment context, preserve reviewed substitution order rather than inferring availability.
7. Return at most three ordered candidates plus deterministic human-readable reasons.
8. Fail closed if no valid candidate survives or candidate loading fails.

The detail-screen candidate explorer remains read-only and opens canonical exercise detail without mutating a program or active workout.

## Active-session Smart Replace Apply — delivered

The active-session mutation contract is intentionally narrower than program/template replacement:

- Smart Replace suggestions are offered only when the selected source exercise has at least one explicitly pending set (`completed === false`).
- Reviewed candidates still flow through the same canonical repository resolution, preference filtering and deterministic ranking authority as the read-only explorer.
- Candidate mapping into the workout catalog uses exact canonical exercise ID only. There is no name-based fallback or fuzzy canonicalization.
- Candidates that cannot be resolved to an exact workout-catalog identity are dropped.
- The reviewed shortlist appears first in the existing explicit replacement selector; the ordinary manual exercise catalog remains available after it.
- Saved `avoid` removes an exercise only from the Smart Replace shortlist; it does not prohibit explicit manual selection.
- Selecting any replacement is an explicit user action.
- The mutation changes only source sets with `completed === false`.
- Completed sets and legacy sets whose completion field is absent retain their original exercise identity.
- Set ID, load, reps, target/actual RPE, set type and superset membership are preserved when a pending set is relabeled.
- If there is no pending source set, replacement fails closed and does not hide or rewrite the source exercise.
- If completed/legacy source sets remain after pending sets move, the source exercise remains visible in the active session.
- Active-draft persistence continues through the existing workout-session draft authority; no new sync/schema field was introduced.
- No automatic replacement is performed.

## Program/template Apply — still gated

Do not generalize the active-session behavior into persisted workout/program templates yet.

The current custom-template update path rebuilds exercise entries from names/indexes and does not provide a reviewed mapping for `workout.prescription`. Therefore a safe program/template Smart Replace implementation still requires a separate contract covering:

- stable source/replacement exercise identity across template editing;
- deterministic remapping of prescription rows to the replacement identity;
- preservation of unrelated prescription and workout metadata;
- persistence/sync consequences for the exact mutation path;
- explicit confirmation and reversal behavior;
- tests proving reorder/removal/replacement cannot orphan or silently misassign prescription rows.

Until that contract exists, program/template Smart Replace Apply remains unauthorized.

## Out of scope

- backend preference persistence or cross-device preference sync;
- automatic program rewrites;
- automatic active-session replacement;
- completed-session/history rewriting;
- injury/medical suitability claims;
- LLM-generated replacement IDs or free-form canonicalization;
- equipment inference from location without explicit user data;
- preference learning from behavior;
- dislike/favorite migration or semantic merging.

## Validation

Delivered source validation includes:

- TypeScript typecheck;
- full Vitest regression suite;
- repository/source contract coverage for fail-closed preference storage and favorites separation;
- pure ranking tests for reviewed order, unresolved/current/duplicate filtering, `avoid`, explicit equipment prioritization and three-candidate bound;
- exact-ID active-session adapter tests, including no name fallback;
- replacement regression tests proving only explicitly pending sets change and completed/legacy evidence plus prescription fields remain unchanged;
- repository line gates, Expo export and Expo Doctor on the exact #820 PR head through Mobile CI #2830.

Physical-device validation remains useful for preference persistence, candidate presentation and active-session replacement UX. It is release evidence rather than source-merge authority.
