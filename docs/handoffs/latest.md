# Latest Handoff

Updated: 2026-08-18

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current `main` checkpoint is `a890a4b2ac5a7241358a4909f662c4c8eed78a14` (#733).

The recent mobile sequence has moved well beyond the older #682 checkpoint. Shared primitives and broad product surfaces have been converged onto the adaptive Liquid Glass material system; Home consumes real daily steps when the already-authorized native health source is available; Expo SDK 56 patch dependencies and Hermes Mobile CI were hardened; local-persistence recovery semantics were repaired; and the latest focused convergence batches cover Auth/Onboarding selectors, Exercise Detail media, StatChip, miscellaneous owners, RecoveryScorePicker and Workouts creation/detail secondary materials.

#733 records the throughput-first autonomous execution policy and standing operational authorization in `AGENTS.md`.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current backend `main` is `211d1966bcac01a21c047eaf8f844843a764a186` (#265). No backend PR is currently open.

Phase 14 reviewed source/runtime preparation remains complete. Isolated Hermes staging, bounded Labs configured-provider evidence tooling and bounded Stories staging evidence are retained.

## Phase 14 evidence checkpoint

### Isolated staging

Previously verified staging properties remain the accepted evidence baseline unless newer exact evidence supersedes them:

- project `smart-fitness-staging`;
- backend loopback-only at `127.0.0.1:3100`;
- staging PostgreSQL with no host port and dedicated staging state/networking;
- external runner-owned `0600` staging env;
- successful loopback `/health`;
- Labs fail-closed before provider configuration;
- no production Compose/credentials/user data used for that evidence.

### External prerequisite boundary

Configured Labs evidence still requires staging-only HTTPS S3-compatible storage plus Gemini material. Configured Push evidence still requires staging-only APNs/FCM material. Signed native/physical-device evidence remains required for Push, Steps, Labs and the remaining Stories behavior.

These are external/operational evidence gates, not justification for speculative additional Phase 14 source work.

## Active autonomous package — repository-wide Liquid Glass convergence

This is the current broad mobile workstream while Phase 14 external gates are unavailable.

Completed focused sequence includes:

- #711 shared UI primitives;
- #724 broad post-foundation product-surface rollup;
- #726 Auth/Register + Onboarding selectors;
- #727 Exercise Detail media + MuscleMap;
- #728 StatChip;
- #730 miscellaneous demonstrated material owners;
- #731 RecoveryScorePicker;
- #732 Workouts creation/detail secondary materials.

Continue from exact current `main` by refreshing the direct legacy-material inventory and grouping only demonstrated remaining owners into coherent non-overlapping batches. Divider-only or domain-semantic uses must not be mechanically rewritten merely because a legacy token appears. Do not invent refactors to keep the workstream alive.

## Next execution order

1. Refresh the repository-wide direct legacy-material inventory from exact current `main` after #732/#733.
2. Triage remaining hits by actual material ownership and reachability; separate real fills/interaction states from intentional divider/domain semantics.
3. Implement multiple non-overlapping demonstrated owner clusters in parallel where safe, validate each exact head, merge validated work, then rebuild dependent work from the new `main`.
4. Keep `docs/current-status.md`, this handoff and the canonical implementation plan synchronized with material progress and blockers.
5. If staging provider material becomes available, execute the already-prepared bounded Labs/Push evidence without pausing unrelated safe mobile work.
6. If signed-device access becomes available, execute the required Steps/Push/Labs/Stories physical-device evidence under the standing operational authorization.
7. Begin unrelated Phase 15 expansion only after this explicitly prioritized convergence package is exhausted or a new reviewed product priority supersedes it.

## Execution policy

A pass is the largest safe amount of approved roadmap work executable with available access; it is not one PR, one fix or one CI cycle. Keep independent workstreams active while others wait on CI/review/dependencies, prefer coherent batches over micro-PRs, and stop only when executable approved work is exhausted or all remaining work is genuinely blocked.

Operational actions materially necessary for approved roadmap/evidence work are standing-authorized subject to least-privilege, preflight, privacy, evidence, recovery and rollback controls. The authorization does not expand product scope.

## Existing architectural contracts to preserve

Do not change workout/program lifecycle, active-session draft persistence, completed-history immutability, private persistence/sync schemas, Social/Stories authority/privacy, Labs privacy/confirmation semantics, Coach auth/API contracts, active-program owner authority, backend revision/idempotency semantics or privacy/export boundaries as incidental follow-up.
