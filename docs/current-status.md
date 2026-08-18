# Smart Fitness Current Status

Updated: 2026-08-18

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current `main` checkpoint is `a890a4b2ac5a7241358a4909f662c4c8eed78a14` (#733).

Recent completed mobile sequence:

- #711 — shared FormField, ListRow, EmptyState, DestructiveButton and TertiaryButton Liquid Glass convergence;
- #713 — Home reads real daily steps from the already-authorized native health source without prompting from Home;
- #716 — Expo SDK 56 patch dependency alignment;
- #718–#723 — Hermes Mobile CI resilience and exact squash-merge push deduplication;
- #719 — local-persistence recovery keeps Retry available instead of allowing unsafe dismissal;
- #724 — post-foundation Liquid Glass rollup across Settings, Progress, Companion, Labs, Social, Auth, Notifications, Nutrition and Workouts;
- #726 — Auth/Register and Onboarding choice/input controls converged on active Liquid Glass materials;
- #727 — Exercise Detail media preview and MuscleMap material convergence;
- #728 — shared StatChip material convergence;
- #730 — remaining demonstrated miscellaneous material owners converged;
- #731 — RecoveryScorePicker material convergence;
- #732 — Workouts creation/detail secondary materials rebuilt from exact current main and merged after exact-head validation;
- #733 — throughput-first autonomous execution and standing operational-authorization policy recorded in `AGENTS.md`.

The active autonomous mobile package is the repository-wide Liquid Glass convergence audit/remediation. Work is source-demonstrated and grouped by material owner; unrelated refactors must not be manufactured.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current backend `main` is `211d1966bcac01a21c047eaf8f844843a764a186` (#265). No backend PR is currently open.

Phase 14 source/runtime preparation remains complete for the reviewed contracts. The isolated Hermes staging topology, bounded Labs evidence command and bounded Stories evidence command are retained.

## Phase 14 external evidence boundary

The remaining Phase 14 gates are operational/evidence work rather than ordinary source expansion.

### Push

Source/CI complete. Remaining evidence requires usable APNs/FCM staging material and signed physical-device execution: delivery/taps, account/device isolation, offline/reconnect ordering and rollout/scheduling evidence.

### Labs / Analyses

Source/CI, native document/photo import, fail-closed private processing, isolated staging and bounded evidence tooling are complete. Configured-provider evidence requires staging-only HTTPS S3-compatible private storage plus Gemini material, then an exact `ready=true` pass, one synthetic upload/worker lifecycle and privacy-safe device evidence.

Extracted rows remain drafts until explicit user confirmation; source does not diagnose, prescribe, infer missing values or convert units.

### Stories

Source/CI plus isolated backend staging route/auth/account-lifecycle evidence are complete. Remaining work is bounded mobile/physical-device evidence and fixes only for reproduced defects.

### Steps

Read-only HealthKit/Health Connect source/CI and Home consumption are complete. Remaining evidence is signed native/physical-device support detection, permission flow, real aggregate reads, local-day/DST behavior and rendered Home behavior.

## Current remaining roadmap

1. Continue repository-wide Liquid Glass inventory/remediation from exact current `main`, grouping demonstrated owners into coherent non-overlapping batches and validating exact heads before merge.
2. Keep source-of-truth status/handoff documents synchronized as those batches merge.
3. Run configured Labs and Push evidence as soon as the required staging-only provider material is actually available.
4. Run native/physical-device evidence for Steps, Push, Labs and remaining Stories behavior when signing/device access is available.
5. Do not invent additional Phase 14 source work while its remaining gates are external; reopen source only for a reproduced defect or reviewed contract.
6. Do not begin unrelated Phase 15 expansion until the explicitly prioritized Liquid Glass convergence package is exhausted or a new product priority is reviewed.

## Execution boundary

`AGENTS.md` now defines a work pass as the largest safe amount of approved roadmap work executable with available access, rather than one PR or one validation cycle. Independent workstreams should continue while another waits on CI/review/dependencies.

Standing operational authorization covers materially necessary OTA/EAS/native/device, backend deployment/migration, provider configuration, worker scheduling, bounded production diagnostics, credential/DNS changes, HealthKit/Health Connect activation and store-submission work, subject to least-privilege, preflight, privacy, evidence, recovery and rollback controls. This authorization does not expand product scope.
