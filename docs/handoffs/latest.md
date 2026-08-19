# Latest Handoff

Updated: 2026-08-20

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- `main`: `3a99b017b679da295207e4a8e4d1506681368023` (#793).
- #793 merged P18-C Knowledge Library/article reader after exact-head Mobile CI passed.
- Reviewed Phase 18 architecture through P18-H is on `main`; P18-E/F/G/H runtime remains dependency-gated and must not be inferred from architecture-only documents.
- There is no open mobile Phase 18 runtime PR at this checkpoint.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- Phase 18 baseline on `main`: `e0ae0e4506674a533903bb046fd2ff16b2cf44a3` (#285).
- #272 merged the P18-A provider-neutral Knowledge contracts/publication gate.
- #285 merged relational canonical Knowledge persistence, migration 0053 and authenticated fail-closed publication-eligible reader routes after exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI passed.
- #290 is the clean P18-B editorial-orchestration PR. Exact head: `8d14c54159128b71f42b6b01cb28c9e5adad36d9`. It is one commit from exact #285 `main`, mergeable, and awaiting required Hermes Backend CI.
- P18-D is privately prepared at `ce0843909d0572ee2169cc2988964f4c8a880e48`, exactly one five-file commit above #290. It is intentionally not open as a PR while #290 owns the dependency/CI lane. The package includes the architecture-index update, hides parsed/frozen answer-bearing snapshots in a module-private `WeakMap`, exposes only an opaque frozen bank token with no `.items`, rejects structural/reflected-brand reconstruction, returns presentation-safe assembly DTOs, and keeps answer evaluation backend-only. Before merge it must be rebuilt from the exact backend `main` produced by #290.

Peptonio admin work remains outside the Phase 18 dependency chain. Do not let concurrent admin heads alter the exact-main/rebuild discipline for Knowledge.

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
- quiz assembly/presentation must return presentation-safe DTOs rather than raw canonical answer-bearing items;
- runtime eligible-bank authority must require module-private object-identity membership, not only a reflectable symbol/structural shape;
- the public eligible-bank token must not expose answer-bearing item snapshots as properties;
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

Do not implement P18-E persistence until P18-D quiz identity/evaluation is merged/stable alongside already-merged P18-A reader/article-version identity. When persistence ships, the same package must define authenticated ownership, retry/replay semantics, stale/deprecated handling, two-device behavior, account deletion, export/privacy treatment and mobile account-switch/logout cleanup.

## Immediate execution order

1. Wait only for required exact-head Hermes Backend CI on #290; fetch exact failure evidence if it fails, fix only the reproduced issue, and merge only the validated unchanged head against the expected backend `main`.
2. After #290 merges, rebuild the prepared hardened P18-D five-file package from exact new backend `main`, exact-head validate and merge if clean.
3. After P18-A/P18-D identities are merged/stable, implement P18-E dedicated server-authoritative account-scoped state plus bounded mobile offline retry/replay under `docs/architecture/phase18-learning-state-authority.md`.
4. Continue P18-F deterministic Coach finding → approved content mapping/selection only after enough P18-E state exists for suppression/revisit semantics.
5. Integrate P18-F only into an already-authoritative typed Coach/report host under P18-G; do not create a duplicate scheduler or silently promote local presentation kinds into backend finding codes.
6. Implement P18-H immutable reviewed learning paths only after reader/quiz/learning-state layers are stable.
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
