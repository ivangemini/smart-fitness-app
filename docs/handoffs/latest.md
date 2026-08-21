# Latest Handoff

Updated: 2026-08-21

Exact source, tests, migrations, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- current `main`: `ea080ecb170d8399fe4d534692dc3ed771121174`;
- P18-C Library/Reader merged through #793;
- P18-E account learning state merged through #794;
- P18-H reviewed learning paths merged through #795;
- P18-G optional Coach Learn consumer merged through #797;
- #797 exact head `3d88b6b4f28349b6c11c5302e865e156b81c17d5` passed Mobile CI #2680 before merge.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- current `main`: `a6179aff35093325f0571139d6ced7e3987a2f10`;
- P18-A persistence/reader merged through #285;
- P18-B editorial orchestration merged through #290;
- P18-D quiz authority merged through #294;
- P18-E learning state merged through #296;
- P18-F deterministic recommendation selector merged through #306;
- P18-H learning paths merged through #307;
- P18-G finding authority merged through #308;
- P18-G runtime Learn host merged through #309;
- #309 exact head `c4b4da92a926141ad3cea5e898c96177e1c2a49d` passed Backend CI #2243 before merge.

## Phase 18 handoff state

P18-A through P18-H are merged for the reviewed source/CI scope. Do not resume the old dependency sequence from P18-E/F/G/H; those checkpoints are historical.

There is no approved P18-I.

### Stable Knowledge stack

The merged system now has:

- stable canonical article identities and immutable localized versions;
- reviewed claim/source evidence and deterministic publication eligibility;
- provider-neutral draft/verification orchestration without provider publication authority;
- authenticated Library and exact-version Reader;
- reviewed exact-version quiz banks with backend-only answer authority;
- private account-owned learning evidence with `unseen`, `read`, `understood` and `refresh_useful` semantics;
- reviewed immutable curriculum paths with ordered exact article-version steps;
- strict deterministic recommendation rules and selectors;
- audited deterministic Coach finding provenance;
- optional Coach run-detail Learn projection and mobile presentation.

## P18-G runtime/content boundary

The host and consumer are complete, but the reviewed recommendation-rule registry is intentionally empty.

No approved canonical `findingCode → articleId` mappings currently exist in repository authority. The runtime therefore behaves as follows:

1. persisted Combined Coach output is normalized only through the reviewed finding authority;
2. unknown/model-invented/stale/tampered findings fail closed;
3. if no reviewed mapping exists, no Knowledge recommendation is attached;
4. if a reviewed mapping is later added, selection still re-checks exact article identity, publication eligibility, locale/risk/version constraints and account learning state;
5. Knowledge projection failure never invalidates the underlying Coach run;
6. mobile opens only the exact article version returned by the selector.

Do not fill the registry with placeholder UUIDs or convenient existing articles merely to make cards appear.

## Permanent Phase 18 invariants

- backend owns canonical durable learning evidence and quiz correctness;
- mobile never stores or infers hidden answer keys;
- exact article-version identity is preserved through paths, recommendations and Reader navigation;
- account switch/deletion boundaries apply to private learning evidence;
- Knowledge remains educational and non-gamified;
- reading/quiz completion never mutates workouts, nutrition, goals, Labs, recovery or safety;
- free-form model/provider prose is never recommendation-selection authority;
- Tier-3 medical-adjacent content remains human-reviewed, educational, non-diagnostic and non-prescriptive.

## What to do next

- Keep Phase 18 closed unless a reproduced defect appears or a new reviewed requirement is accepted.
- If reviewed canonical content and approved finding mappings are supplied, implement only the mapping/content-activation delta and rerun end-to-end exact-version recommendation tests.
- Do not manufacture P18-I.
- Keep richer P17-E goal persistence requirement-gated.
- Continue the remaining independent Phase 14 provider/native/device evidence when external prerequisites are available.

## Remaining independent external evidence

Phase 14 configured-provider/native/device evidence remains separate:

- Labs configured provider + physical device;
- Push provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device evidence.

No source/CI result implies production migration execution, provider activation, canonical content publication, OTA/native publication or physical-device validation.
