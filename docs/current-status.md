# Smart Fitness Current Status

Updated: 2026-08-21

Exact source, tests, migrations, CI and Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Current `main`: `ea080ecb170d8399fe4d534692dc3ed771121174`.
- Phase 18 mobile source is merged through:
  - #793 — Knowledge Library/article reader;
  - #794 — account-scoped exact-version learning state;
  - #795 — reviewed curriculum/learning paths;
  - #797 — optional Coach → Learn recommendation consumer.
- #797 exact head `3d88b6b4f28349b6c11c5302e865e156b81c17d5` passed Mobile CI #2680 before merge.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current `main`: `a6179aff35093325f0571139d6ced7e3987a2f10`.
- Phase 18 backend source is merged through:
  - #285 — canonical Knowledge persistence/published reader;
  - #290 — provider-neutral editorial orchestration;
  - #294 — exact-version quiz authority;
  - #296 — account-scoped learning state;
  - #306 — deterministic Coach → Learn recommendation selector;
  - #307 — reviewed curriculum/learning paths;
  - #308 — trustworthy deterministic Coach finding authority;
  - #309 — optional Coach run-detail Learn projection host.
- #309 exact head `c4b4da92a926141ad3cea5e898c96177e1c2a49d` passed Backend CI #2243 before merge.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation layer over Coach rather than a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** **P18-A through P18-H are source/CI-complete and merged for the reviewed scope.** There is no approved P18-I.

## Phase 18 delivered authority

The merged Phase 18 stack now provides:

- canonical reviewed Knowledge article identity, immutable localized versions, evidence/source linkage and publication eligibility;
- provider-neutral editorial preparation where model output alone cannot publish;
- authenticated Library/Reader UX;
- exact-version reviewed quiz authority with hidden answer keys remaining backend-only;
- private account-owned `unseen | read | understood | refresh_useful` learning evidence outside revisioned fitness state;
- deterministic Coach → Learn selection over strict normalized findings and versioned mapping rules;
- deterministic backend Coach finding provenance from persisted Combined Coach runs only;
- reviewed immutable learning paths with exact article-version steps and no duplicate progress authority;
- optional mobile Coach Learn cards that navigate to the exact recommended article version;
- failure isolation: Knowledge recommendation failure cannot invalidate an otherwise valid Coach run.

## P18-G content activation boundary

The runtime host is merged, but the reviewed production mapping registry is intentionally empty because the repository contains no approved canonical `findingCode → articleId` mappings.

Therefore:

- current Coach behavior remains valid with no Learn card when no reviewed rule exists;
- runtime code does not invent article IDs, mappings or provider-selected fallback lessons;
- adding a real mapping is an editorial/product-authority action and must reference an approved canonical article;
- learning-state suppression, publication eligibility, exact-version selection and risk-tier checks remain mandatory once mappings are added.

This is a deliberate fail-closed content boundary, not unfinished selector/runtime infrastructure.

## Permanent Phase 18 rules

- no Knowledge XP, levels, streaks, badges, leaderboards, punishment, reward currency or daily pressure loops;
- canonical educational content is prepared/reviewed ahead of use; model output alone is never publication authority;
- every material claim remains tied to reviewed source evidence;
- published article versions are immutable evidence boundaries;
- quizzes bind to exact article versions and reviewed claims; hidden answer keys remain backend-only;
- Tier-3 Labs/medical-adjacent content requires human review and remains educational, non-diagnostic and non-prescriptive;
- canonical Knowledge content never contains private account evidence;
- raw Labs documents/extraction drafts remain outside ordinary Knowledge recommendation context;
- learning evidence remains private account-owned state outside revisioned fitness `AppState` sync;
- reading/quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- free-form/model prose is never Coach → Learn selection authority.

## Next execution order

1. Treat P18-A through P18-H as closed for the reviewed source/CI scope; reopen only for a reproduced defect or a newly reviewed requirement.
2. Do not invent P18-I solely to continue Phase 18 work.
3. If product/editorial work supplies reviewed canonical articles and approved finding mappings, add those rules as a separately reviewed P18-G content-activation change and validate exact-version behavior end to end.
4. Keep P17-E inactive until a richer-goal requirement needs new semantics.
5. Continue independent Phase 14 external/provider/device evidence when prerequisites are available.

## Production / rollout boundary

Source merge, production deployment and provider/content activation remain separate claims.

Backend `main` has demonstrated a production deployment relationship with the connected Peptonio Admin project. Merged source does not itself prove or authorize production migration execution, provider activation, canonical content publication, OTA/native publication, medical review completion or physical-device validation.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.
