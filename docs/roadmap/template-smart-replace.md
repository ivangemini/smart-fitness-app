# Template Smart Replace

Updated: 2026-08-23

This was the first source package in `docs/roadmap/next-product-expansions.md`. It builds on the exact template replacement primitive established by #824 and the reviewed Smart Replace candidate authority already used by exercise detail and active-session flows.

## Delivery status

**T1–T4 are complete. The package is source/CI-closed.**

Delivery evidence:

- PR: #835 `feat(workouts): add stale-safe template Smart Replace`;
- exact validated head: `d915ed60cad9e59fe3966e34fab16d80c9c1f430`;
- authoritative Mobile CI: #2882, run `32646591600`, job `97211677598`;
- all required gates passed: repository/changed-file line audits, agent navigation, TypeScript, full regression suite, expanded-model smoke, Expo export and Expo Doctor;
- merged squash SHA: `1a9c1ca7d9300cbf25c526b69c653a5f82e30d40`.

The first CI attempt #2881 failed only on an unsupported React Native style token (`StyleSheet.absoluteFillObject`). The exact source fix switched to the supported `StyleSheet.absoluteFill`; #2882 then passed completely. No Smart Replace product logic changed in that fix.

No separate Coach explanation was added because the delivered flow already exposes deterministic reviewed substitution rationale and an explicit before/after preview. Adding another model surface without demonstrated product need would duplicate explanation authority rather than improve the mutation contract.

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

## Delivered slices

### T1 — deterministic preview foundation

Delivered in #835:

- pure preview builder over the #824 template editing primitive;
- exact-ID/collision/fail-closed checks;
- explicit affected prescription-row evidence;
- conservative fingerprint for stale detection;
- no mutation during selection/preview;
- Smart Replace projection preserves the original template duration rather than inheriting the generic template editor's duration recalculation side effect.

### T2 — explicit preview UI

Delivered in #835:

- available only from a saved custom template detail surface;
- reviewed suggestions plus manual catalog;
- before → after preview;
- localized RU/EN copy;
- selecting a candidate never mutates the template;
- reviewed shortlist respects the existing saved `avoid` preference while explicit manual catalog selection remains a deliberate user action.

### T3 — stale-safe Apply

Delivered in #835:

- dedicated `WorkoutTemplateReplacementPatch` contract;
- atomic current-state fingerprint recheck immediately before mutation;
- status: `applied | stale | blocked`;
- existing ordered AppState persistence/sync queue owns the applied mutation;
- completed history remains unchanged;
- existing training-program references keep the same workout-template ID and remain valid.

### T4 — package closure

- exact-head source validation completed by Mobile CI #2882;
- package docs closed after merge;
- next executable product package is Weekly Training Review;
- device/runtime visual confirmation remains optional release evidence and does not reopen source scope.

## Validation

Delivered source evidence includes:

- preview unit tests for exact identity, no-prescription templates, collisions, missing/ambiguous IDs and source immutability;
- fingerprint change tests for identity-relevant template edits;
- patch tests for apply/stale/blocked behavior and preservation of template/prescription fields;
- AppState tests proving completed sessions are unchanged and training-program links stay intact;
- source-contract tests proving the detail UI requires explicit preview and Apply;
- exact-head Mobile CI #2882 with TypeScript, full regression suite, line audits, agent navigation, expanded-model smoke, Expo export and Expo Doctor.

Physical-device verification remains useful for modal layout, keyboard/search interaction and user comprehension, but it is release evidence rather than a substitute for the completed source contract.
