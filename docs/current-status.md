# Smart Fitness Current Status

Updated: 2026-08-20

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Current `main`: `3a99b017b679da295207e4a8e4d1506681368023` (#793).
- #793 merged P18-C Knowledge Library + article reader after exact-head Mobile CI passed. It adds strict `knowledge-v1` parsing/client boundaries, category/concept/bounded-search discovery, immutable article reading, reviewed source/evidence presentation, EN/RU copy and deterministic bounded Markdown rendering.
- Phase 15 Coach Intelligence + Progress, Phase 16 foreground Proactive Coach v1 and the reviewed first Phase 17 Goals & Planning scope remain source/CI-complete.
- Phase 18 architecture through P18-H is reviewed on `main`: learning-state authority, Coach → Learn recommendation authority, surface-integration authority and immutable reviewed learning-path authority are documentation contracts only until their runtime prerequisites are stable.

There is no open mobile P18 runtime dependency at this checkpoint. P18-E mobile work intentionally remains blocked until backend P18-D quiz identity/evaluation is merged and stable.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current Phase 18 baseline on `main`: `e0ae0e4506674a533903bb046fd2ff16b2cf44a3` (#285).
- #272 merged the provider-neutral Knowledge contracts/publication gate.
- #285 merged P18-A relational canonical Knowledge persistence + authenticated fail-closed published-reader API after exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI passed.
- #290 is the current clean P18-B editorial-orchestration PR. Its exact head is `8d14c54159128b71f42b6b01cb28c9e5adad36d9`, one commit from `e0ae0e45…`. It includes bounded provider-neutral evidence-pack orchestration, deterministic preflight/readiness, independent claim verification/quiz validation, Tier-3 human-review handling, provider-output consistency hardening, tests and architecture indexing. Merge remains exact-head Hermes CI gated.
- P18-D is privately prepared one dependency step above #290 at `ce0843909d0572ee2169cc2988964f4c8a880e48`; it is deliberately not opened as a PR while #290 owns the dependency/CI lane. The prep diff is exactly five files, including the required architecture index update. It composes full publication eligibility with quiz-specific eligibility, stores parsed/frozen answer-bearing snapshots only in a module-private `WeakMap`, exposes a frozen opaque bank token with no `.items`, rejects structural/reflected-brand reconstruction, returns presentation-safe assembly DTOs without answer keys/feedback, and keeps answer evaluation backend-only.

Peptonio admin work remains outside this Phase 18 dependency chain and must not weaken exact-head Knowledge validation discipline.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation of Coach, not a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the currently reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground Companion-card v1 source/CI-complete through #770–#772.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete through #783; richer P17-E remains threshold-gated.
- **Phase 18 — Knowledge & Learning:** active. P18-A and P18-C runtime are merged. P18-B is exact-head CI gated in #290. Hardened P18-D is prepared privately and will be rebuilt from merged P18-B `main` before validation/merge. P18-E/F/G/H runtime remains dependency-gated behind those canonical identities.

## Phase 18 authority and boundaries

Reviewed pipeline:

`topic → curated evidence pack → AI-assisted draft → claim/source verification → validated quiz bank → reviewed published article version`

Reviewed user loop:

`bounded user evidence → deterministic Coach finding → allowlisted article mapping → canonical article → validated quiz → informational learning state`

Permanent rules:

- no Knowledge XP, levels, streaks, badges, leaderboards, competitive ranks, punishment or engagement-reward loops;
- canonical educational articles are generated/reviewed ahead of use; end-user requests do not publish live-generated scientific content;
- model output is never publication authority;
- every material claim must remain traceable to reviewed source records;
- published article versions are immutable evidence boundaries;
- quizzes bind to exact article versions and reviewed claim identities; ambiguous answer keys fail closed;
- normal quiz assembly/presentation must not expose hidden answer keys, feedback-before-answer or review authority;
- Tier-3 Labs/medical-adjacent educational content requires human review and remains non-diagnostic/non-prescriptive;
- canonical content never contains private user evidence;
- raw Labs documents/extraction drafts remain outside ordinary Knowledge generation/recommendation context;
- reading or quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- later fitness/health outcomes must not be attributed causally to reading an article.

Learning state is private account-owned informational data. The reviewed states are `unseen`, `read`, `understood` and `refresh_useful`. Positive evidence is tied to exact canonical article/article-version identities; reading alone cannot produce `understood`, hidden answer keys remain backend-only, and account deletion/export/privacy/account-switch/replay/two-device semantics must ship with the persistence authority rather than later.

Focused architecture:

- `docs/architecture/phase18-knowledge-learning-system.md`
- `docs/architecture/phase18-learning-state-contract.md`
- `docs/architecture/phase18-learning-state-authority.md`
- `docs/architecture/phase18-coach-learn-recommendation-contract.md`
- `docs/architecture/phase18-coach-learn-surface-integration.md`
- `docs/architecture/phase18-learning-paths-contract.md`

Focused execution roadmap:

- `docs/roadmap/knowledge-learning.md`

## Current execution order

1. Get #290 P18-B exact head green on Hermes; fix only reproducible failures and merge only if backend `main` is still the expected base.
2. Rebuild the privately prepared hardened P18-D five-file package from the exact new backend `main`, exact-head validate it on Hermes, and merge if clean.
3. Only after merged/stable P18-A + P18-D identities, implement P18-E server-authoritative account-scoped learning state plus bounded mobile retry/replay under the reviewed ownership/deletion/export contract.
4. Implement deterministic P18-F finding → Learn mapping/selection only after enough P18-E state exists for suppression/revisit semantics.
5. Integrate P18-F only into an existing trustworthy typed Coach/report host under P18-G; do not create a second scheduler or treat local presentation labels as backend finding authority.
6. Implement P18-H reviewed immutable learning paths only after reader/quiz/learning-state layers are stable.
7. Execute remaining Phase 14 provider/device evidence independently whenever its external prerequisites are available.
8. Repair demonstrated defects before unrelated cleanup work.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.

## Closure boundary

Source/CI completion does not imply provider activation, production deployment, content publication quality approval, signed-device evidence, diagnosis/prescribing authority, automatic cross-domain mutation or production rollout. Operational activation remains separately evidence-gated under `AGENTS.md`.
