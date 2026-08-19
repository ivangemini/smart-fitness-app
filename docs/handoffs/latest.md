# Latest Handoff

Updated: 2026-08-19

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- `main`: `b8de527f435319be9b7d70ec3c698b03945e21f9` (#787).
- Runtime baseline remains #783; the Phase 18 commits currently following it on `main` are documentation/architecture only.
- #785 activated/indexed Phase 18 Knowledge & Learning.
- #787 defined the P18-E learning-state ownership, exact-version, privacy, deletion/export and offline/replay contract. It intentionally did not add persistence.
- Open #786 implements the P18-C mobile Knowledge Library/article reader. Its previous head passed Mobile CI, but it must not merge until backend #275 is merged and the mobile branch is rebuilt/revalidated from exact current `main`.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- `main`: `ace6149e5795fbeb8308d6c2eea44bbf70e00cbc` (#273).
- #272 merged the P18-A provider-neutral Knowledge contracts/publication gate.
- #273 independently merged the fail-closed read-only admin-console foundation.
- Open #275 adds relational canonical Knowledge persistence, migration 0053 and authenticated publication-eligible reader routes. Exact head: `e76ec127de1c297c7ebf6bb1a68bfbda99584cf1`.
- #275 Account Deletion Receipt CI passed; required Backend CI and Backend PostgreSQL CI are still pending on the self-hosted Hermes queue. Exact-head validation remains mandatory before merge.
- Open #276 is the stacked P18-B provider-neutral editorial orchestration package. After #275 merges it must be rebuilt/retargeted from exact current backend `main` and revalidated.
- The prepared P18-D quiz-bank foundation existed as #279 on top of #276. #279 is currently closed/unmerged; rebuild/reopen or replace it only after #276 is merged/stable.

## Phase 18 product contract

Canonical Knowledge content is shared backend authority. User learning state is separate private account-owned activity data.

Reviewed editorial pipeline:

`topic → curated evidence pack → AI-assisted draft → claim/source verification → validated quiz bank → reviewed published article version`

Reviewed user loop:

`bounded evidence → deterministic Coach finding → allowlisted content mapping → canonical article → validated quiz → informational learning state`

Preserve these invariants:

- no Knowledge gamification: no XP, levels, streaks, badges, leaderboards, ranks, punishment or engagement-reward loops;
- canonical scientific/educational articles are prepared ahead of end-user consumption;
- model output alone is never publication authority;
- material claims require reviewed source linkage;
- published article versions remain immutable evidence boundaries;
- quizzes bind to exact article versions and reviewed claims;
- hidden answer keys/feedback remain backend-controlled before answer evaluation;
- Tier-3 Labs/medical-adjacent content requires human review and remains non-diagnostic/non-prescriptive;
- canonical Knowledge records never contain private user evidence;
- raw Labs documents/extraction drafts stay outside ordinary Knowledge generation/recommendation context;
- reading/quiz completion cannot automatically mutate workouts, nutrition, goals, Labs, recovery or safety;
- later behavior/fitness/health changes are not attributed causally to reading content.

## P18-E learning-state gate

The reviewed semantic states are:

- `unseen` — no positive persisted evidence for the exact article version;
- `read` — explicit reviewed reading-completion evidence for the exact published version;
- `understood` — successful server-authoritative reviewed quiz evidence for the same exact version;
- `refresh_useful` — deterministic version-aware revisit signal, never punishment or loss mechanics.

Do not implement P18-E persistence until the canonical reader/article-version identities and quiz identities are merged/stable. When persistence ships, the same package must define authenticated ownership, retry/replay semantics, stale/deprecated handling, two-device behavior, account deletion, export/privacy treatment and mobile account-switch/logout cleanup.

## Immediate execution order

1. Wait only for required exact-head CI on backend #275; do not bypass the self-hosted gate.
2. As soon as #275 passes, merge it and immediately rebuild/retarget #276 from exact backend `main`; run all required exact-head backend validation.
3. In parallel after #275 merge, rebuild #786 from exact mobile `main` against the merged reader contract; run exact-head Mobile CI and merge only that validated head.
4. After #276 merges, rebuild the P18-D quiz-bank package from exact current backend `main`; preserve exact article-version/claim linkage and backend-only answer-key authority.
5. After P18-A/P18-D identities are stable, implement P18-E persistence/API/mobile integration according to `docs/architecture/phase18-learning-state-contract.md`.
6. Only then continue P18-F deterministic Coach finding → approved content mapping and bounded recommendation logic.
7. Keep Phase 14 external provider/device evidence independent and opportunistic when prerequisites exist.

## Do not reopen closed scope without evidence

- Phase 15 remains source/CI-complete for its reviewed scope.
- Phase 16 foreground proactive v1 remains closed unless a new reviewed delivery/purpose contract exists.
- Phase 17 P17-A through P17-D remain closed; do not manufacture richer P17-E goal persistence without a threshold-crossing requirement.
- Do not add live arbitrary scientific publication, new provider authority, diagnosis/prescribing, payments, new Social domains or automatic cross-domain mutations without a separately reviewed contract.

## Remaining external Phase 14 evidence

- Labs configured provider + physical device;
- Push provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device runtime evidence.

Source/CI closure is not production rollout, provider activation, publication-quality approval or signed-device evidence.