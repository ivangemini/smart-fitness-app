# Smart Fitness Current Status

Updated: 2026-08-18

Exact code, tests, migrations and current Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

Current repository `main`: `2027566349026af0a209ceb57a330101259e330e` (#745 docs checkpoint).

Current runtime baseline: `cf4af93344b9b7645a839af46ac29866cc7ea218` (#746).

The August 18 Liquid Glass closure sequence is complete for the current reviewed source scope. #746 passed exact-head Mobile CI; evidence-only #747 then reran the repository-wide direct legacy-material scanner from exact post-#746 runtime state and found only 21 previously inspected structural dividers. No unmatched material owner remains.

Liquid Glass repository-wide source convergence is therefore closed for the current reviewed scope. Intentional divider tokens remain by design and must not be mechanically rewritten.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

Current known backend `main`: `211d1966bcac01a21c047eaf8f844843a764a186` (#265). Phase 14 source/runtime preparation remains complete for the reviewed contracts.

## Newly reviewed product priority

**Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics** is now approved as the next autonomous source priority.

Product decisions:

- Coach and Companion are the same product surface; Companion is the user-facing embodiment of the existing Coach, not a second assistant.
- Companion development now prioritizes useful information retrieval, analysis and explanation. Cosmetic progression/gamification is deferred.
- Detailed graphs and analytics belong primarily in Progress and should use progressive disclosure rather than a dense dashboard.
- Home remains concise and contextual.
- Coach explains relevant deterministic facts and may link users to Progress for evidence/detail.
- A separate Program Intelligence/linting feature is explicitly excluded. Program questions are handled through the general Coach data-access/analysis layer.

Phase 15 execution starts with bounded typed data-access capabilities and shared deterministic analytics, while Progress information architecture can be designed independently in parallel. Coach orchestration and detailed Progress views should consume those shared contracts rather than duplicate calculations.

Planned successors:

- Phase 16 — Proactive Coach: bounded contextual insights using Phase 15 deterministic facts.
- Phase 17 — Goals & Planning: canonical user goals as context for Coach and Progress, without automatic plan mutation or punitive mechanics.

See `docs/implementation-plan.md` for the detailed contracts and execution order.

## Phase 14 external evidence boundary

Phase 14 remains independently actionable when external prerequisites are available. It does not block Phase 15 source work.

### Push

Source/CI is complete. Remaining evidence requires usable staging-only APNs/FCM material plus signed physical-device execution for delivery/taps, device/account isolation, offline/reconnect ordering and deliberate rollout evidence.

### Labs / Analyses

Source/CI, native document/photo import, private fail-closed processing, isolated staging and bounded evidence tooling are complete. Configured-provider evidence still requires staging-only HTTPS S3-compatible private storage plus Gemini material, then exact readiness, one synthetic upload/worker lifecycle and privacy-safe evidence. Physical-device picker/accessibility evidence also remains.

Extracted rows remain confirmation-gated drafts; the source contract does not diagnose, prescribe, infer missing values or silently convert units.

### Stories

Source/CI plus isolated backend staging route/auth/account-lifecycle evidence are complete. Remaining work is bounded mobile/physical-device evidence and fixes only for reproduced defects.

### Steps

Read-only HealthKit/Health Connect source/CI and Home consumption are complete. Remaining evidence is signed native/physical-device support detection, permission flow, real aggregate reads, local-day/DST behavior and rendered Home verification.

## Current execution order

1. Start Phase 15 data contracts/selectors and deterministic analytics.
2. In parallel, redesign Progress information architecture around compact summaries and deliberate drill-down.
3. Integrate Coach/Companion retrieval after capability contracts are bounded and tested.
4. Build detailed Progress analytics on the same deterministic layer.
5. Add Coach ↔ Progress contextual linking after both sides stabilize.
6. Execute Phase 14 external evidence whenever its prerequisites become available.
7. Repair concrete reproduced defects without manufacturing unrelated cleanup work.
8. Keep canonical docs synchronized with verified Git/runtime evidence.

## Execution boundary

`AGENTS.md` remains the operational authority. Ordinary inspect/edit/test/PR/merge work should be executed in the largest safe coherent pass, with independent workstreams parallelized. Production-sensitive actions remain subject to the repository's current authorization, preflight, privacy, recovery and rollback controls.
