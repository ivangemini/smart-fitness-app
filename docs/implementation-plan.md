# Smart Fitness — Implementation Plan

Updated: 2026-08-23

This file is the canonical **forward sequencing** document. Exact live refs, PR state and CI state come from Git/GitHub. The mutable checkpoint belongs in `docs/current-status.md`; stable architecture belongs in `docs/project-context.md`; focused detail belongs under `docs/roadmap/` and `docs/architecture/`.

Exact code, tests, migrations, CI and current Git history override stale prose.

Reviewed local-state storage decision remains `docs/architecture/local-state-performance-decision.md`; do not reopen that architecture without new measured evidence or explicit reprioritization.

## Current program state

- Phases 1–10: complete for established source/CI scope.
- Phase 11 Liquid Glass + Home: reviewed convergence scope complete.
- Phase 12 Labs + Settings: provider-neutral source/runtime preparation complete; configured-provider/device evidence remains.
- Phase 13 Companion v1: retained as presentation over Coach.
- Phase 14: ordinary source/runtime preparation exhausted for current contracts; external provider/native/device evidence remains.
- Phase 15 Coach Intelligence & Progress analytics: reviewed source/CI scope complete.
- Phase 16 Proactive Coach foreground v1: complete for reviewed deterministic scope.
- Phase 17 Goals & Planning: P17-A through P17-D complete; P17-E is requirement-gated.
- Phase 18 Knowledge & Learning: P18-A through P18-H complete; production content mappings remain a separate activation action.
- Phase 19 Exercise + Training Intelligence: reviewed source/CI scope complete.
- Phase 20 Progress Photos / Body Composition: P20-A through P20-C source/CI-complete; physical-device evidence remains.
- Phase 21 Workout Assistant: P21-A through P21-E source/CI-complete; backend schema-v2 compatibility is deployed/verified; OTA publication evidence and real-device smoke remain.
- Exercise Preferences + Smart Replace active-session scope: complete through #820.
- Exact template replacement identity/prescription remapping primitive: complete through #824.
- Exercise & Training Intelligence expansion: complete through #825/#826/#828.
- Adaptive Program + Recovery Engine A1–A4: complete through #829/#830/#831/#832, closure #833.
- **Custom-template Smart Replace UI T1–T4: complete through #835, exact-head Mobile CI #2882, merged `1a9c1ca7d9300cbf25c526b69c653a5f82e30d40`.**

There is no approved P21-F or Phase 22. New product work continues as reviewed unnumbered packages.

## Active forward source work

### 1. Weekly Training Review

This is the current implementation target.

Reuse existing deterministic authorities rather than creating another analytics system:

- exact planned-versus-completed identity from `TrainingIntelligenceReview`;
- `training-intelligence-v1` findings;
- Training Coverage;
- existing Adaptive Program proposal actions;
- existing recovery modifier evidence;
- existing workout/session analytics.

Required sequence:

1. **W1 — weekly deterministic review model:** compose the already-derived authorities into one explicit 7-day read-only result; source windows/evidence must match or fail closed.
2. **W2 — Progress presentation + drill-down:** compact main-Progress card with plan completion, coverage, recovery context, adaptive action counts and bounded key findings; drill down to existing 7-day Training Progress detail rather than duplicating analytics.
3. **W3 — optional Coach explanation:** add only if a separate user-facing need is demonstrated; any model call remains read-only over the already-derived review.
4. **W4 — package closure:** exact-head Mobile CI, docs/evidence sync and optional device UX evidence.

Boundaries:

- no second analytics persistence layer;
- no universal readiness/recovery/quality score;
- missing evidence stays unknown;
- no hidden workout/program mutation;
- Coach cannot calculate the canonical review or mutate from it.

Detailed queue: `docs/roadmap/next-product-expansions.md`.

### 2. Progress Stories / Share Cards

Build explicit privacy-aware share/export cards over existing evidence: PRs, completed workout summaries, weekly review highlights, weight/body-measurement milestones and other already-owned Progress facts.

No automatic Social publication, hidden upload or fabricated metric claims.

### 3. Trainer / Coach collaboration layer

Before source implementation, write and review the cross-account authority/privacy contract covering relationship lifecycle, read scopes, proposals/comments, explicit owner confirmation before program mutation, auditability, revocation/deletion and backend isolation.

Then implement as a backend + mobile package rather than adding ad-hoc trainer access to existing private state.

### 4. Apple Health / Apple Watch expansion

Source-side planning and adapters may proceed where device evidence is not required. Any claim about HealthKit/Watch runtime behavior still requires signed native/device evidence.

Do not create a synthetic readiness score or expose raw HealthKit payloads directly to models.

## Recently completed package — Template Smart Replace

#835 delivers the reviewed saved-custom-template flow over #824:

- exact custom-template source/replacement IDs;
- reviewed Smart Replace shortlist with existing `avoid` filtering and explicit manual catalog fallback;
- read-only candidate selection and deterministic before/after preview;
- conservative current-template fingerprint;
- explicit stale-safe Apply with `applied | stale | blocked`;
- matching prescription exercise identity remap while load/reps/RPE and unrelated fields stay unchanged;
- title/description/duration/coach metadata and unrelated exercises stay unchanged;
- completed `WorkoutSession` history and training-program template references remain unchanged;
- existing ordered AppState persistence/sync mutation queue is reused;
- no backend/API/provider/model/native contract added.

Canonical closure: `docs/roadmap/template-smart-replace.md`.

## Independent evidence / activation work

These remain valid but are not blockers for the autonomous source queue above.

### OTA + Phase 21 real-device closure

- verify the relevant production `Publish EAS Update` result and record update ID/group/runtime/channel evidence;
- run the intended real-iPhone active-workout smoke covering Previous/Today, rest timer, warm-ups, set types/supersets, contextual Apply/Ignore, Smart Replace, persistence and sync sanity.

### Phase 20 physical-device evidence

Run `docs/qa/progress-photo-device-validation.md` on the intended signed iPhone build and record dated camera/library, relaunch, deletion/account cleanup, comparison, overlay and visual-quality evidence.

### Phase 14 external/provider evidence

Continue only when prerequisites exist:

- Push: APNs/FCM configuration plus signed-device delivery/tap evidence;
- Labs: HTTPS S3-compatible storage + configured model plus bounded synthetic lifecycle and picker evidence;
- Steps: signed HealthKit/Health Connect evidence;
- Stories: remaining mobile/device runtime evidence.

### Phase 18 content activation

Coach → Learn runtime infrastructure is complete. Production mappings require approved canonical `findingCode → articleId` rules and publication-eligible reviewed content. No mapping means no Learn card.

### Conditional P17-E

P17-E is not ordinary backlog. Revisit richer persisted goal architecture only after an approved requirement needs semantics the current profile cannot safely express.

## Permanent architecture boundaries

### Coach and Companion

Coach and Companion are one product surface. Detailed analytics belong primarily in Progress. Coach consumes bounded purpose-specific facts and links to inspectable evidence.

- no unrestricted model access to AppState, AsyncStorage, SecureStore or provider payloads;
- deterministic calculations and hard guardrails stay outside model prompts;
- no pseudo-precision or universal readiness/scoring system;
- no automatic application of Coach proposals.

### Knowledge & Learning

`bounded user evidence → deterministic Coach finding → allowlisted content mapping → canonical article → validated quiz → informational learning state`

- canonical educational content is reviewed ahead of use;
- model/provider output alone is never publication authority;
- article versions are immutable evidence boundaries;
- Tier-3 medical-adjacent content requires human review and remains non-diagnostic/non-prescriptive;
- reading/quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety.

### Exercise + Training Intelligence

- canonical muscle taxonomy and SVG anatomy are reviewed local authority;
- reviewed Exercise Intelligence metadata fails closed and is never inferred from labels;
- analytics are deterministic over completed-session evidence and explicit periods;
- substitutions never become hidden mutation authority;
- completed workout history remains immutable under future-program/template edits.

### Adaptive Program + Recovery

- proposal action is deterministic before Coach explanation;
- fresh stored recovery evidence may conservatively downgrade proposals but does not create a universal score;
- eligible prescription mutation requires explicit preview/Apply, exact identity, stale fingerprint and bounded target changes;
- Coach explanation is read-only and cannot recalculate or apply the proposal.

### Progress Photos / Body Composition

- photos remain private account-owned local media under the Phase 20 contract;
- no cloud/provider/social upload or AI vision is authorized implicitly;
- visual comparison is an aid, not a measurement authority.

### Workout Assistant

- preserve compact set-table/progressive-disclosure UX;
- prescribed Today guidance comes from exact `Workout.prescription` rows;
- rest timer is transient;
- warm-ups are durable but excluded from working analytics;
- sync v2 is additive/fail-closed;
- contextual adjustment requires deterministic evidence and explicit Apply/Ignore.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI. Documentation-only changes require documentation/agent-navigation gates and must not claim device/provider/production evidence that did not run.

Backend source changes require applicable Backend CI/PostgreSQL/account-lifecycle gates. Native/provider behavior requires corresponding configured-environment or physical-device evidence.

## Release / deployment boundary

Always distinguish:

- source merged;
- backend deployed;
- migration executed;
- provider configured;
- content mapping activated;
- OTA published;
- native binary built/installed;
- physical-device behavior verified.

These states are not interchangeable.

## Reference surfaces

- mutable checkpoint: `docs/current-status.md`;
- stable context: `docs/project-context.md`;
- latest restart handoff: `docs/handoffs/latest.md`;
- roadmap index: `ROADMAP_PROGRESS.md`;
- next product packages: `docs/roadmap/next-product-expansions.md`;
- Smart Replace package: `docs/roadmap/template-smart-replace.md`;
- Adaptive Program package: `docs/roadmap/adaptive-program-recovery.md`;
- agent routing: `PROJECT_MAP.md` and `docs/agent/README.md`;
- accumulated lessons: `PROJECT_LEARNINGS.md`.
