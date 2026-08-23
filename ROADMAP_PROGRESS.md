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

### Exercise Preferences + Smart Replace

Foundation delivered through #816/#818/#819/#820, exact template identity/prescription remapping primitive by #824, and saved custom-template UI by #835 with docs closure #836.

Stable boundaries:

- preference state remains separate from favorites;
- candidate ranking begins only from reviewed substitutions and exact canonical IDs;
- active-session replacement changes only explicitly pending sets;
- saved custom-template replacement is read-only until deterministic preview and explicit Apply;
- collision/unresolved/stale identity fails closed;
- matching prescription identity remaps while unrelated targets/metadata remain unchanged;
- completed/legacy session evidence remains immutable;
- existing persistence/sync authority is reused;
- no automatic active-session, template or program replacement is authorized.

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

### Weekly Training Review

W1/W2 delivered by #837:

- exact head `39a133550607de1f79aa005f693dc9f201f5e9ff`;
- Mobile CI #2885 / run `32648145266` / job `97215495481` fully green;
- merged `447236cecacc17b26d1bf88774e7785ac2121dfe`.

W3 delivered by #838:

- exact head `eb034c796adfdb9b5aba6d96462700201709d5af`;
- Mobile CI #2887 / run `32648944883` / job `97217437867` fully green;
- merged `7a9fd9b8c734a6b2cd9354d12432a2d99715d43e`.

Delivered contract:

- explicit deterministic 7-day review over existing planned/completed identity, findings, Coverage, recovery and Adaptive authorities;
- compact Progress presentation and drill-down to existing 7-day Training Progress;
- missing/mismatched evidence remains unknown/unavailable or fails closed;
- no second analytics store or universal weekly/readiness score;
- optional explicit read-only Coach explanation uses bounded already-derived evidence only;
- no automatic workout/program mutation and no completed-history rewrite.

W4 is documentation/evidence closure; optional device UX observation remains an independent evidence task rather than a source blocker.

## Current autonomous source work

### 1. Progress Stories / Share Cards — active package

Create privacy-aware explicit share/export surfaces from existing deterministic progress evidence such as PRs, Weekly Training Review highlights, weight/body-measurement milestones and completed workouts.

Immediate S1 contract:

- pure deterministic share-card view models only;
- reuse existing source authorities; do not create a second progress analytics truth;
- preserve source date, unit and identity provenance;
- unresolved required evidence fails closed;
- no new persistence, renderer, upload, native share dependency or Social publication action in S1;
- progress photos remain excluded unless separately and explicitly included under the Phase 20 privacy contract.

Then continue with S2 renderer, S3 explicit native share/export and only a separately reviewed S4 Social handoff.

### 2. Trainer / Coach collaboration layer

Requires a reviewed backend/mobile authority contract before writes. Expected direction: explicit trainer/client relationship, bounded read scopes, proposals/comments, owner confirmation before program mutation, auditability and revocation.

### 3. Apple Health / Apple Watch expansion

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
2. Implement Progress Stories / Share Cards S1 deterministic view models.
3. Implement S2 visual rendering without granting the renderer metric authority.
4. Implement S3 explicit native share/export after reviewing the capture/share dependency path.
5. Add S4 Social handoff only if separately reviewed and explicitly confirmed.
6. Define and then implement the Trainer / Coach collaboration package.
7. Define and implement source-side Apple Health / Apple Watch expansion where it does not require unavailable device/provider evidence.
8. Execute OTA/device/provider/content-activation gates when their prerequisites are actually available.
9. Do not create P21-F/Phase 22 or reopen closed source scopes without a reproduced defect or newly reviewed requirement.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native binary build/install and physical-device validation are separate claims and must not be conflated.
