# Phase 11 — Liquid Glass migration roadmap

Updated: 2026-08-09

Architecture contract: `docs/architecture/liquid-glass-ui.md`.

## Objective

Converge Smart Fitness on Liquid Glass while preserving responsive/safe-area rules, accessibility, localization, business logic, persistence, synchronization, Social authority/privacy and backend contracts.

Home remains a social-first hybrid: compact personal metrics → server-authoritative Stories → chronological Following Feed.

## Status

- Phase 10 responsive source hardening: complete for current source scope.
- LG-1 foundation through LG-3I approved packages: complete.
- LG-H1 social-first Home: complete.
- **LG-H2 Stories backend foundation:** complete via backend PR #214 (`2339f6ce…`).
- **LG-H2 Home read/view package:** complete via mobile PR #533 / exact head `6fde319be2c932620ecec177e3c7e4b7e7e0032a` / Mobile CI #1984 / merge `89bae8d1085ffd72131142700c1d625d6fa91f40`.
- **Active LG-H2 package:** managed `story_image` upload/approval/create/owner-delete authoring.
- Coach material remains explicitly deferred.
- LG-H3 Steps remains blocked by real native capability/permissions and must not be faked.
- No OTA/EAS publication, native install/build, backend deployment, migration execution, or physical-device proof is implied by source/CI completion.

## LG-H2 — Stories

### Complete server contract

The merged backend owns Story lifecycle and privacy:

- image-only v1, one approved owned `story_image`;
- strict DTOs/errors and authenticated ownership;
- idempotent creation;
- 24-hour server expiry and active-only reads;
- owner delete and account-deletion cascade;
- Following/self, private-profile, symmetric block and moderation restriction enforcement;
- existing managed-media upload/moderation/delivery/cleanup authority;
- idempotent viewed state;
- bounded ordering/pagination;
- retention cleanup and Social export/privacy inventory.

### Complete mobile read/view package

PR #533 provides:

- strict mobile parsing/API error mapping;
- bounded account-scoped first-page cache with immediate backend revalidation and expiry filtering;
- separate Story state from Following feed state;
- Home horizontal strip between metrics and Following;
- server `viewed` seen/unseen state;
- safe-area/content-driven viewer;
- idempotent viewed acknowledgement;
- exact-head regression/type/export/doctor validation.

No placeholder/demo Story data is authorized.

### Active authoring package

Implement next:

- extend the **existing** mobile managed-media contracts/parsers to accept `story_image`;
- reuse signed upload, private storage, finalization and moderation/delivery polling;
- create a Story only from an owned `approved` asset using the exact current `stateVersion`;
- expose upload/processing/review/rejected/failed states with localized UI;
- refresh authoritative Home Stories after success;
- expose owner delete;
- keep v1 image-only — no caption/text overlay/video/arbitrary URL;
- no repeated native blur in dense/repeated controls; use shared adaptive material primitives.

LG-H2 is complete only when this owner authoring/deletion loop is merged and exact-head green.

## LG-H3 — Steps

**Blocked.** Require a reviewed native health/activity source, permission disclosure/dependencies and separately authorized physical runtime evidence. Do not infer steps from workouts.

## LG-H4 — feed retention

Planned after Stories stability. Preserve chronological Following semantics unless a separately reviewed ranking contract exists.

## Deferred secondary material

Remaining Progress/exercise secondary material can resume after Stories. Coach recovery/input/lookback/history/domain material remains deferred unless explicitly reprioritized.

## Later execution

1. Finish LG-H2 Story authoring/deletion.
2. Reassess remaining Progress/exercise secondary material.
3. LG-4 Workouts material convergence.
4. LG-5 bounded elevated chrome/motion.
5. LG-6 visual QA/stabilization; physical evidence only when separately authorized.
6. LG-H3 Steps only after native capability review/authorization.

## Execution rule

Prefer coherent packages over micro-PRs. Home/Social integration must reuse existing Social and managed-media authority rather than duplicate it. Exact code, tests, current Git history and explicit product priority override stale roadmap prose.
