# Smart Fitness Current Status

Updated: 2026-08-19

Exact code, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Current `main`: `b8de527f435319be9b7d70ec3c698b03945e21f9` (#787).
- Current verified runtime baseline remains `b2531e2122d6d7357129c76c48554b3a915d2e6c` (#783); the Phase 18 commits currently on `main` after that point are documentation-only.
- Phase 15 Coach Intelligence + Progress, Phase 16 foreground Proactive Coach v1 and the reviewed first Phase 17 Goals & Planning scope remain source/CI-complete.
- #785 activated and indexed the reviewed Phase 18 Knowledge & Learning architecture and roadmap.
- #787 added the reviewed P18-E learning-state ownership/privacy/versioning contract. It is architecture-only and does not authorize persistence before the prerequisite reader/quiz identities are stable.

Active mobile Phase 18 work:

- #786 — P18-C Knowledge Library + article reader. The branch adds strict `knowledge-v1` parsing/client boundaries, category/concept/bounded-search discovery, immutable article reading, reviewed source/evidence presentation, EN/RU copy and deterministic bounded Markdown rendering. Its previous exact head passed Mobile CI, but the PR deliberately depends on backend #275 and must be rebuilt/revalidated from exact current mobile `main` after that server contract merges.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current `main`: `ace6149e5795fbeb8308d6c2eea44bbf70e00cbc` (#273).
- #272 merged the first P18-A provider-neutral Knowledge foundation: versioned canonical content/source/claim/quiz contracts plus deterministic publication gating.
- #273 independently added the fail-closed read-only Peptonio admin-console foundation; it does not change Knowledge ownership or publication authority.

Active backend Phase 18 dependency chain:

1. #275 — P18-A relational canonical Knowledge persistence + authenticated published-reader API. Exact head `e76ec127de1c297c7ebf6bb1a68bfbda99584cf1`; required Backend CI and Backend PostgreSQL CI are pending on the self-hosted Hermes queue. Account Deletion Receipt CI already passed for that head. Do not merge until all required exact-head gates pass.
2. #276 — P18-B provider-neutral editorial orchestration foundation, stacked on the P18-A persistence branch. It must be rebuilt/retargeted to exact current `main` after #275 merges and then revalidated before merge.
3. P18-D quiz-bank foundation was prepared as #279 on top of #276, but #279 is currently closed/unmerged. Rebuild/reopen or replace it from exact current `main` only after #276 is merged and stable.

Independent read-only admin branches #277/#278 remain outside the Phase 18 dependency chain and must not be allowed to weaken Knowledge migration or exact-head validation discipline.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation of Coach, not a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the currently reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground Companion-card v1 source/CI-complete through #770–#772.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete through #783; richer P17-E remains threshold-gated.
- **Phase 18 — Knowledge & Learning:** active. P18-A contracts are merged; P18-A persistence/reader is awaiting exact-head CI; P18-B and P18-C are prepared behind that dependency; P18-D must be rebuilt after P18-B; P18-E ownership architecture is reviewed but persistence remains dependency-gated.

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
- Tier-3 Labs/medical-adjacent educational content requires human review and remains non-diagnostic/non-prescriptive;
- canonical content never contains private user evidence;
- raw Labs documents/extraction drafts remain outside ordinary Knowledge generation/recommendation context;
- reading or quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- later fitness/health outcomes must not be attributed causally to reading an article.

Learning state is private account-owned informational data. The reviewed states are `unseen`, `read`, `understood` and `refresh_useful`. Positive evidence is tied to exact canonical article/article-version identities; reading alone cannot produce `understood`, hidden answer keys remain backend-only, and account deletion/export/privacy/account-switch/replay/two-device semantics must ship with the persistence authority rather than later.

Focused architecture:

- `docs/architecture/phase18-knowledge-learning-system.md`
- `docs/architecture/phase18-learning-state-contract.md`

Focused execution roadmap:

- `docs/roadmap/knowledge-learning.md`

## Current execution order

1. Finish #275 only after required exact-head Backend CI + Backend PostgreSQL CI pass.
2. Immediately rebuild/retarget #276 from exact backend `main`, revalidate, and merge if clean.
3. Rebuild #786 from exact mobile `main` against the merged backend reader contract, run exact-head Mobile CI, and merge if clean.
4. Rebuild the P18-D quiz-bank package from the merged P18-B baseline, preserving backend-only answer-key authority and exact article-version/claim linkage.
5. Only after the reader and quiz identities are merged/stable, implement P18-E learning-state persistence/API/mobile integration under the #787 ownership/deletion/export/offline-replay contract.
6. Continue P18-F Coach → Learn deterministic finding-to-content mappings only after the canonical article and bounded learning-state boundaries are stable enough to consume safely.
7. Execute remaining Phase 14 provider/device evidence independently whenever its external prerequisites are available.
8. Repair demonstrated defects before unrelated cleanup work.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.

## Closure boundary

Source/CI completion does not imply provider activation, production deployment, content publication quality approval, signed-device evidence, diagnosis/prescribing authority, automatic cross-domain mutation or production rollout. Operational activation remains separately evidence-gated under `AGENTS.md`.