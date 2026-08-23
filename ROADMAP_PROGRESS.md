# Smart Fitness Roadmap Progress

Updated: 2026-08-23

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI, deployments and live Git history override stale prose.

Focused roadmap references:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/knowledge-learning.md`;
- `docs/roadmap/training-intelligence.md`;
- `docs/roadmap/exercise-preferences-smart-replace.md`;
- `docs/roadmap/exercise-training-intelligence-expansion.md`;
- `docs/roadmap/adaptive-program-recovery.md`;
- `docs/roadmap/next-product-expansions.md`.

## Verified phase baseline

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** complete for reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained as presentation over Coach.
- **Phase 14:** ordinary autonomous source/runtime preparation exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Progress Analytics:** source/CI-complete for reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D complete; P17-E is requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete; Coach → Learn production mappings remain a separate editorial/product activation gate.
- **Phase 19 — Exercise + Training Intelligence:** reviewed scope source/CI-complete.
- **Phase 20 — Progress Photos / Body Composition:** P20-A/P20-B/P20-C source/CI-complete; physical-device evidence remains.
- **Phase 21 — Workout Assistant:** P21-A through P21-E source/CI-complete; backend schema-v2 compatibility is deployed and verified; OTA/device evidence remains separate.

There is no approved P21-F or Phase 22. New product work continues as reviewed unnumbered packages unless a numbered phase is explicitly approved.

## Completed unnumbered packages

### Exercise Preferences + Smart Replace foundation

Delivered through #816/#818/#819/#820, with exact template identity/prescription remapping primitive added by #824.

Stable boundaries:

- preference state remains separate from favorites;
- candidate ranking begins only from reviewed substitutions and exact canonical IDs;
- active-session replacement changes only explicitly pending sets;
- completed/legacy session evidence remains immutable;
- #824 provides exact source/replacement template identity and deterministic `Workout.prescription` remapping while preserving unrelated fields;
- no automatic active-session or template replacement is authorized.

The remaining product work is a user-facing custom-template Smart Replace preview/confirm/apply surface over the #824 primitive. See `docs/roadmap/exercise-preferences-smart-replace.md`.

### Exercise & Training Intelligence expansion

Delivered through #825/#826/#828:

- Exercise Intelligence 2.0;
- deterministic Training Coverage;
- Training Intelligence Loop periodic review foundation.

See `docs/roadmap/exercise-training-intelligence-expansion.md`.

### Adaptive Program + Recovery Engine

A1–A4 are complete through #829/#830/#831/#832; package closure docs merged by #833.

Delivered authority includes:

- deterministic `progress | maintain | review` proposals over exact program/template/exercise identity;
- conservative recovery modifier using fresh stored check-in evidence without a universal readiness score;
- inspectable recovery/exposure evidence;
- explicit bounded prescription preview + Apply for eligible future custom templates;
- stale fingerprint/idempotency guards and completed-history immutability;
- optional read-only Coach explanation over the already-derived deterministic proposal, with no mutation authority.

See `docs/roadmap/adaptive-program-recovery.md`.

## Current autonomous source work

### 1. Custom-template Smart Replace UI — active next package

Build the explicit user-facing template replacement flow over the #824 exact-ID primitive.

Required contract:

- custom/editable workout template only;
- exact source and replacement canonical IDs;
- reviewed Smart Replace shortlist plus manual catalog remains available;
- preview exact exercise/prescription identity changes before mutation;
- explicit confirmation before Apply;
- deterministic prescription-row remapping and preservation of unrelated workout metadata;
- collision/unresolved/stale identity fails closed;
- completed `WorkoutSession` history is never rewritten;
- existing template persistence/sync authority is reused;
- no automatic program rewrite.

### 2. Weekly Training Review — approved after template Smart Replace

Package a weekly read-only review over existing deterministic authorities: planned-versus-completed identity, Training Intelligence findings, Coverage, Adaptive Program state and recovery evidence.

Do not introduce a second analytics store, universal score or model calculation authority. Coach may explain bounded deterministic results only.

### 3. Progress Stories / Share Cards

Create privacy-aware explicit share/export surfaces from existing deterministic progress evidence such as PRs, weekly training summaries, weight/body-measurement milestones and completed workouts.

Private source data must remain private until explicit share/export. No implicit social publication or photo-cloud migration is authorized.

### 4. Trainer / Coach collaboration layer

Requires a reviewed backend/mobile authority contract before writes. Expected direction: explicit trainer/client relationship, bounded read scopes, proposals/comments, owner confirmation before program mutation, auditability and revocation.

### 5. Apple Health / Apple Watch expansion

Source planning may expand native health adapters and Watch-facing architecture, but signed-device/HealthKit/Watch evidence remains a separate release gate. Do not infer device behavior from source tests.

## Independent activation / evidence gates

These are real remaining work but are not ordinary autonomous source backlog:

1. **OTA + Phase 21 device evidence:** confirm the latest relevant production EAS update metadata and run the real-iPhone active-workout smoke.
2. **Phase 20 device evidence:** run `docs/qa/progress-photo-device-validation.md` on the intended signed iPhone build.
3. **Phase 14 provider/native evidence:** APNs/FCM, Labs HTTPS S3-compatible storage + model configuration, HealthKit/Health Connect and remaining Stories device/runtime evidence require external prerequisites.
4. **Phase 18 content activation:** activate Coach → Learn only from approved canonical `findingCode → articleId` mappings and publication-eligible reviewed content.
5. **P17-E:** remains requirement-gated; do not implement richer persisted goal lifecycle without an approved product requirement.

## Execution order

1. Keep canonical docs synchronized with exact merged state and current unnumbered-package queue.
2. Implement custom-template Smart Replace preview/confirm/apply.
3. Implement Weekly Training Review.
4. Implement Progress Stories / Share Cards.
5. Define and then implement the Trainer / Coach collaboration package.
6. Define and implement source-side Apple Health / Apple Watch expansion where it does not require unavailable device/provider evidence.
7. Execute OTA/device/provider/content-activation gates when their prerequisites are actually available.
8. Do not create P21-F/Phase 22 or reopen closed source scopes without a reproduced defect or newly reviewed requirement.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native binary build/install and physical-device validation are separate claims and must not be conflated.
