# Smart Fitness Current Status

Updated: 2026-08-20

Exact source, tests, migrations, CI and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Current `main`: `3a99b017b679da295207e4a8e4d1506681368023` (#793).
- P18-C Knowledge Library/article reader is merged through #793.
- Active P18-E mobile PR: #794 — `feat(knowledge): add account-scoped learning state`.
- #794 is dependency-clean against current mobile `main`; its current exact head is recorded by GitHub on the PR and must pass exact-head Mobile CI before merge.

P18-E mobile currently adds:

- strict `knowledge-learning-state-v1` API contracts and fail-closed parsing;
- authenticated exact-version learning-state/read/quiz calls through the existing auth stack;
- account-partitioned tokenless local state outside revisioned fitness `AppState`;
- a bounded replay-safe pending read queue without optimistic canonical completion;
- backend-only canonical quiz scoring and server-confirmed `understood`;
- exact `userId + articleVersionId` guards for in-flight work;
- account-bound token refresh so stale Knowledge API instances cannot act on a newly selected account;
- quiz submission only after server-confirmed read evidence for the exact currently available version;
- durable account-deletion cleanup for cached learning state and pending reads;
- no Knowledge gamification or automatic cross-domain mutation.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current `main`: `d705457ae36147bb65f110266da2dbceb880cc98` (#295).
- P18-A canonical persistence/published reader is merged through #285.
- P18-B hardened provider-neutral editorial orchestration is merged through #290.
- P18-D exact-version eligible quiz-bank/evaluation authority is merged through #294.
- Active P18-E backend PR: #296 — `feat(knowledge): add account-scoped learning state`.
- #296 is dependency-clean against current backend `main`; required exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI remain mandatory before source merge readiness.

P18-E backend currently adds:

- dedicated account-owned `knowledge_learning_states` persistence outside private fitness sync;
- exact-version authenticated list/get/mark-read/quiz-evaluate routes;
- durable `read`/`understood` evidence and deterministic derived `refresh_useful`;
- exact stable `articleId + locale` current-version resolution instead of a global published-result window;
- backend-authoritative complete canonical quiz-bank evaluation;
- stale/unavailable exact-version write rejection;
- account-deletion cascade while shared canonical Knowledge remains intact;
- subject-access export schema v2 that retains historical exact-version evidence while separately reporting current informational state, including `refresh_useful`;
- same-snapshot export derivation through the canonical learning-state service;
- privacy inventory, migration/replay/deletion and focused regression coverage.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains the user-facing presentation layer over Coach rather than a second assistant.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains threshold-gated.
- **Phase 18 — Knowledge & Learning:** P18-A/B/C/D are merged for their reviewed source boundaries. P18-E is the active runtime gate in backend #296 + mobile #794. P18-F/G/H architecture is reviewed; runtime remains downstream of stable P18-E as defined by the focused contracts.

## Phase 18 permanent authority boundaries

- no Knowledge XP, levels, streaks, badges, leaderboards, competitive ranks, punishment or engagement-reward loops;
- canonical educational content is prepared/reviewed ahead of use; model output alone is never publication authority;
- every material claim remains tied to reviewed source evidence;
- published article versions are immutable evidence boundaries;
- quizzes bind to exact article versions and reviewed claims; hidden answer keys remain backend-only;
- Tier-3 Labs/medical-adjacent content requires human review and remains educational, non-diagnostic and non-prescriptive;
- canonical Knowledge content never contains private account evidence;
- raw Labs documents/extraction drafts remain outside ordinary Knowledge generation/recommendation context;
- learning state is private account activity and remains outside revisioned fitness `AppState` sync;
- reading/quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety;
- later behavior/fitness/health changes are not attributed causally to reading content.

## Current execution order

1. Finish exact-head CI for backend #296 and mobile #794; repair only demonstrated failures.
2. Treat #296 as source-ready only after Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI all pass on its exact head.
3. Treat #794 as source-ready only after final exact-head Mobile CI passes and the backend contract remains compatible.
4. Do not merge #794 before backend P18-E is merged/stable.
5. After P18-E is merged/stable, start P18-F from exact current backend `main`: strict deterministic typed finding → versioned allowlisted rule → currently publication-eligible exact article/version selection. Unknown/deprecated/model-invented finding identities fail closed.
6. Do not attach P18-F to a Coach host under P18-G until a trustworthy backend typed finding identity exists. Local mobile Proactive Coach insight kinds are not silently promoted into backend finding codes.
7. P18-H may begin after stable P18-E because its curriculum contract depends on the canonical reader/quiz/learning-state layers, not on P18-G host integration.
8. Keep remaining Phase 14 external/provider/device evidence independent.

## Production / rollout boundary

Source merge, production deployment and provider/content activation are separate claims.

The backend repository is connected to the `peptonio-admin` Vercel project. Current live deployment history proves that a push to backend `main` can create a Vercel **production** deployment for the admin project, whereas PR branches create preview deployments. Therefore a backend PR that is source-ready must not be mechanically merged when production activation is outside the current authorization boundary; either obtain explicit authorization for that side effect or use a separately reviewed way to prevent production deployment.

No P18-E source completion authorizes backend production deployment, production migration execution, OTA/native publication, provider activation, credential changes or canonical content publication.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.
