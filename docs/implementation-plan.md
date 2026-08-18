# Smart Fitness — Implementation Plan

Updated: 2026-08-18

This file is the canonical forward roadmap. Exact code, tests, migrations, current Git history and repository `AGENTS.md` override stale prose.

Reviewed local-state storage decision remains `docs/architecture/local-state-performance-decision.md`; do not reopen that architecture without new measured evidence or explicit reprioritization.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified runtime `main`: `cf4af93344b9b7645a839af46ac29866cc7ea218` (#746).

The repository-wide Liquid Glass convergence priority is source/CI-complete for the current reviewed scope. #746 merged the final workout-builder, Social and workout-finish residual material owners after exact-head Mobile CI passed line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

Evidence-only #747 reran the repository-wide direct legacy-material inventory from exact post-#746 `main`. The 21 remaining hits are all intentional structural dividers previously inspected in source; no unmatched material owner remains. #747 was intentionally closed without merge.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current known backend `main`: `211d1966bcac01a21c047eaf8f844843a764a186` (#265).

Phase 14 provider/runtime source preparation remains complete for the reviewed contracts. Existing isolated Hermes staging and bounded Labs/Stories evidence tooling remain the execution foundation for external evidence work.

## Phase status

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete for the current reviewed scope; the later repository-wide convergence audit is also closed by #746/#747 evidence.
- Stories S10: source/CI plus basic isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained; richer progression/cosmetics remain deferred unless reprioritized.
- Phase 14: ordinary autonomous source/runtime-preparation work is exhausted for the currently reviewed contracts. Remaining work is external provider material, signed native/physical-device evidence, deliberate rollout, or bounded repair of a reproduced defect.
- Phase 15/general successor: no unrelated expansion should begin until a successor product priority is explicitly reviewed.

## P14-A — Push

Source/CI complete. Remaining work:

1. provide staging-only APNs and/or FCM provider material;
2. run privacy-safe readiness preflight before enabling delivery;
3. execute bounded staging sends covering success/transient/permanent/timeout/restart/redaction behavior;
4. collect physical-device permission/token/delivery/tap/deep-link evidence;
5. verify device/account isolation and offline/reconnect ordering;
6. keep production scheduling/rollout a deliberate action with rollback evidence.

Do not invent another Push source package without a reproduced defect or reviewed contract.

## P14-B — Labs / Analyses

Source/CI, isolated staging and bounded configured-provider evidence tooling are complete. Remaining work:

1. provide a staging-only **HTTPS S3-compatible** private-storage namespace and credentials;
2. provide a staging-only Gemini credential/model;
3. require exact configured readiness before processing;
4. upload one synthetic document through the normal staging flow;
5. run exactly one bounded worker/evidence lifecycle;
6. capture privacy-safe provider/output/error/redaction/lifecycle evidence;
7. collect physical-device PDF/photo picker and accessibility evidence.

Do not weaken the HTTPS storage boundary to bypass the external prerequisite. Extracted data remains confirmation-gated and must not infer diagnosis, treatment or missing values.

## P14-C — Stories

Source/CI plus basic isolated backend staging route/auth/account-lifecycle evidence are complete. Remaining work is mobile/physical-device/runtime evidence outside the server probe. Continue source work only for a concrete reproduced defect or newly reviewed contract.

## P14-D — Steps

Source/CI includes reviewed read-only HealthKit and Health Connect adapters and Home consumption. Remaining work is signed native/physical-device evidence for support detection, user-initiated permissions, real aggregate reads, unsupported/no-data states, local-day/DST behavior and Home presentation.

## Liquid Glass closure contract

The source-convergence priority is complete at #746/#747. The final inventory retains 21 direct `colors.border` / `colors.borderSubtle` hits because they are structural dividers, not material surfaces.

Do not mechanically replace those tokens. Reopen the priority only if:

- a reachable screen demonstrates a partial/legacy material owner;
- a future refactor turns a retained divider into a card/control/material owner;
- a newly reviewed UI contract expands the intended scope.

The detailed final inventory is recorded in `docs/architecture/liquid-glass-residual-inventory.md`.

## Current execution order

1. Execute Phase 14 provider/device evidence immediately when its required external prerequisites are available.
2. If evidence or normal use reproduces a defect, repair it in a coherent bounded package and validate exact head.
3. Otherwise, await/implement the next explicitly reviewed product priority rather than manufacturing cleanup work.
4. Keep `docs/current-status.md`, `docs/handoffs/latest.md`, `ROADMAP_PROGRESS.md` and this plan synchronized with verified Git/evidence.
5. Preserve existing lifecycle, persistence, privacy, authority and API contracts unless a reviewed change explicitly modifies them.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI: repository/changed-file audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

A source-contract failure must be distinguished from a runtime/type failure. When a reviewed migration intentionally changes a source invariant, update the stale contract to require the new invariant rather than reverting valid runtime code; behavioral/accessibility/compatibility invariants must still remain protected.

Backend source/operations changes require the applicable backend/PostgreSQL/account-lifecycle gates for their scope.

Evidence-only diagnostics may intentionally fail after printing the requested evidence and should be closed without merge when their purpose is complete.

Documentation-only synchronization must never claim provider, physical-device or production evidence that did not run.

## Activation boundary

Provider configuration, native/device execution and rollout actions remain governed by the current repository authorization, least-privilege, privacy, preflight, evidence, recovery and rollback controls in `AGENTS.md` and the relevant operational docs. Closing Liquid Glass source convergence does not change those boundaries.
