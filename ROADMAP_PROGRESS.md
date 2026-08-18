# Smart Fitness Roadmap Progress

Updated: 2026-08-18

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations and Git history override stale prose.

Focused roadmap references retained as stable contracts:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`.

## Verified phase baseline

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: source/CI-complete, including repository-wide convergence closure.
- Stories S10: source/CI plus isolated backend route/auth/account-lifecycle staging evidence complete; mobile/device evidence remains.
- Phase 12 Labs + Settings: provider-neutral source composition, native import, private-processing runtime, isolated staging and bounded evidence tooling complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: baseline retained. Companion is the presentation/character of the existing Coach, not a separate assistant.
- Phase 14: autonomous source/runtime preparation is complete for current contracts; external provider and physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics: approved and active next source priority.**
- **Phase 16 — Proactive Coach: planned successor.**
- **Phase 17 — Goals & Planning: planned successor.**

## Current verified checkpoint

### Mobile

Repository `main`: `2027566349026af0a209ceb57a330101259e330e` (#745 docs checkpoint).

Runtime baseline: `cf4af93344b9b7645a839af46ac29866cc7ea218` (#746).

#746 closed the final runtime Liquid Glass residual owners after exact-head Mobile CI passed all required validation gates. Evidence-only #747 reran the repository-wide inventory and found only 21 previously inspected structural-divider hits. No unmatched material owner remains.

### Backend

Current known backend `main`: `211d1966bcac01a21c047eaf8f844843a764a186` (#265).

Phase 14 preparation remains complete for reviewed source/runtime contracts.

## Phase 15 — Coach Intelligence & Progress

### Product direction

Coach/Companion becomes the primary interpretation and information-retrieval surface. Development focuses on usefulness before cosmetics.

Progress becomes the primary destination for detailed visual analytics. It should expose a compact first-level summary and progressively disclose detailed charts/data only when requested.

Home remains concise. Do not duplicate a dense analytics dashboard there.

No standalone Program Intelligence/linting product is planned. Coach can inspect and discuss the user's current program through the general bounded data-access layer.

### Workstreams

1. **Coach data access** — typed bounded retrieval for workouts, exercises, current program, progress, nutrition summaries and confirmed Labs marker facts.
2. **Deterministic analytics** — reusable tested calculations for training consistency, progression, PRs, meaningful e1RM/volume/RPE trends, conservative stagnation signals, body trends and nutrition averages where data is sufficient.
3. **Coach orchestration** — request only the data relevant to the user's question and explain validated facts without silently changing plans or records.
4. **Progress IA** — user-friendly first-level Body / Strength & Training / Activity / Highlights summaries.
5. **Progress drill-down** — period/exercise selection, charts and comparisons behind intentional navigation rather than all at once.
6. **Coach ↔ Progress** — Coach can link to supporting Progress detail; Progress can open Coach with bounded selected context.
7. **Closure** — accessibility, performance, regression contracts, exact-head CI and canonical docs.

### Explicit non-goals

- separate second AI assistant;
- Companion cosmetics/progression systems in Phase 15;
- standalone program scoring/linting feature;
- walls of graphs on Home or top-level Progress;
- model access to raw Labs documents, unconfirmed drafts, secrets or unrestricted application state;
- automatic mutation of programs, workouts, nutrition targets, goals or medical data.

## Phase 16 — Proactive Coach

After Phase 15 contracts stabilize, allow Coach to surface a small number of high-value contextual observations based on deterministic facts. This must remain bounded, dismissible and non-compulsive rather than becoming an alert feed.

## Phase 17 — Goals & Planning

Introduce canonical user-owned goals as context for Coach and Progress. Planning/recommendations remain explainable and confirmation-gated; no automatic plan mutation or punitive streak mechanics.

## Remaining Phase 14 gates

### Push

Provider/device evidence still requires staging-only APNs/FCM material, bounded provider sends, signed physical-device permission/token/delivery/tap evidence, device/account isolation and deliberate rollout controls.

### Labs / Analyses

Configured-provider evidence still requires staging-only HTTPS S3-compatible private storage plus Gemini material, exact readiness, one bounded synthetic processing lifecycle and privacy-safe evidence. Physical-device PDF/photo picker and accessibility evidence also remains.

### Stories

Remaining work is mobile/physical-device/runtime evidence beyond the already completed basic backend staging route/auth/account-lifecycle probe.

### Steps

Remaining work is signed native/physical-device support/permission/real aggregate-read/local-day/DST/Home evidence.

## Current execution order

1. Start Phase 15 bounded data contracts/selectors and deterministic analytics.
2. Design Progress IA in parallel against existing canonical data and Liquid Glass UI contracts.
3. Integrate Coach retrieval after bounded capability contracts exist.
4. Implement Progress summary and drill-down surfaces on shared analytics.
5. Add contextual Coach ↔ Progress navigation.
6. Execute Phase 14 provider/device evidence independently whenever prerequisites become available.
7. Repair reproduced defects; do not manufacture unrelated cleanup work.
8. Keep canonical documentation aligned with verified Git/runtime evidence.

## Authorization / release boundary

The new Phase 15 priority does not relax provider, native/device or production controls. Those remain governed by current `AGENTS.md`, least-privilege, preflight, privacy, evidence, recovery and rollback requirements.
