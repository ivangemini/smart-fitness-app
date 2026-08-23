# Template Smart Replace

Updated: 2026-08-23

This is the first source slice in `docs/roadmap/next-product-expansions.md`. It builds on the exact template replacement primitive established by #824 and the reviewed Smart Replace candidate authority already used by exercise detail and active-session flows.

## Product contract

A user may explicitly replace one exercise inside an existing saved custom workout template after inspecting the proposed before/after change.

The flow remains deterministic and fail closed:

- source template must be a current saved custom `Workout`;
- source exercise identity is exact by canonical exercise ID;
- replacement identity must resolve exactly from the existing canonical exercise catalog;
- a replacement cannot collide with another exercise already present in the template;
- reviewed suggestions remain bounded by the existing Smart Replace candidate rules, including reviewed substitution authority and `avoid` filtering;
- manual catalog selection is permitted, but still resolves by exact canonical ID;
- selecting a candidate is read-only;
- preview shows the exact source/replacement identity and affected prescription-row count before mutation;
- Apply is a separate explicit user action;
- Apply rechecks a template fingerprint against current state and returns `applied`, `stale`, or `blocked`;
- stale preview never mutates current state;
- replacement changes only future template exercise identity and matching prescription exercise identity;
- prescription load, reps, target RPE, source-set ID, adjustment and rationale fields are preserved;
- template title, description, duration, coach metadata and unrelated exercises remain unchanged;
- completed `WorkoutSession` history remains immutable;
- existing workout-template persistence/sync authority and ordered AppState mutation queue remain the only mutation path;
- no new backend endpoint, persisted entity family, provider/model call or hidden automatic replacement is introduced.

## Source slices

### T1 — deterministic preview foundation

- pure preview builder over the #824 template editing primitive;
- exact-ID/collision/fail-closed checks;
- explicit affected prescription-row evidence;
- conservative fingerprint for stale detection;
- no mutation.

### T2 — explicit preview UI

- available only from a saved custom template detail surface;
- reviewed suggestions plus manual catalog;
- before → after preview;
- localized RU/EN copy;
- selecting a candidate never mutates the template.

### T3 — stale-safe Apply

- dedicated `WorkoutTemplateReplacementPatch` contract;
- atomic current-state fingerprint recheck immediately before mutation;
- status: `applied | stale | blocked`;
- existing ordered AppState persistence/sync queue owns the applied mutation;
- completed history and program→template references remain unchanged.

## Validation

Required source evidence:

- preview unit tests for exact identity, no-prescription templates, collisions, missing/ambiguous IDs and source immutability;
- fingerprint change tests for identity-relevant template edits;
- patch tests for apply/stale/blocked behavior and preservation of template/prescription fields;
- AppState tests proving completed sessions are unchanged;
- source-contract tests proving the detail UI requires explicit preview and Apply;
- TypeScript, full regression suite and exact-head Mobile CI, including line audit, agent navigation, expanded-model smoke, Expo export and Expo Doctor.

Physical-device verification remains useful for modal layout, keyboard/search interaction and user comprehension, but it is release evidence rather than a substitute for exact-head source CI.
