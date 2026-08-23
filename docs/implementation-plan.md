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
- Custom-template Smart Replace UI T1–T4: complete through #835, exact-head Mobile CI #2882, merged `1a9c1ca7d9300cbf25c526b69c653a5f82e30d40`, docs closure #836.
- **Weekly Training Review W1–W3: complete through #837/#838; exact-head Mobile CI #2885/#2887; latest merged source `7a9fd9b8c734a6b2cd9354d12432a2d99715d43e`. W4 is documentation/evidence closure.**

There is no approved P21-F or Phase 22. New product work continues as reviewed unnumbered packages.

## Active forward source work

### 1. Progress Stories / Share Cards

This is the current implementation target.

Build explicit privacy-aware share/export cards over existing deterministic evidence: PRs, completed workout summaries, Weekly Training Review highlights, weight/body-measurement milestones and other already-owned Progress facts.

Required sequence:

1. **S1 — deterministic share-card view models.** Implement pure deterministic view models only. Reuse existing source authorities and preserve source dates, units and stable identities. Required evidence that cannot be resolved must fail closed. S1 adds no persistence layer, renderer, native share dependency, upload or Social publication action.
2. **S2 — reusable visual card renderer.** Render an S1 view model without recalculating metric claims. The rendering technology must remain presentation-only. The app already has `@shopify/react-native-skia`; `expo-sharing` and `react-native-view-shot` are not current dependencies, so capture/render dependency decisions belong here or in S3 rather than S1.
3. **S3 — explicit native share/export surface.** Export/share only after direct user action. No hidden cloud upload, no background publication and no implicit Social post.
4. **S4 — optional Social handoff.** Implement only after separate review and explicit confirmation. Reuse existing Social publishing authority rather than bypassing it.

Boundaries:

- private evidence remains private until explicit output;
- no fabricated/AI-generated metric claims;
- rendering cannot become analytics authority;
- dates, units and source identity remain visible/traceable;
- existing `/social/share-workout/[sessionId]` and story/post flows are separate Social authorities, not blanket authorization for native share/export;
- progress photos are excluded by default and require a separate explicit inclusion decision preserving the Phase 20 privacy contract;
- completed workout/session history remains immutable.

Detailed queue: `docs/roadmap/next-product-expansions.md`.

### 2. Trainer / Coach collaboration layer

Before source implementation, write and review the cross-account authority/privacy contract covering relationship lifecycle, read scopes, proposals/comments, explicit owner confirmation before program mutation, auditability, revocation/deletion and backend isolation.

Then implement as a backend + mobile package rather than adding ad-hoc trainer access to existing private state.

### 3. Apple Health / Apple Watch expansion

Source-side planning and adapters may proceed where device evidence is not required. Any claim about HealthKit/Watch runtime behavior still requires signed native/device evidence.

Do not create a synthetic readiness score or expose raw HealthKit payloads directly to models.

## Recently completed package — Weekly Training Review

W1/W2 #837:

- exact validated head `39a133550607de1f79aa005f693dc9f201f5e9ff`;
- Mobile CI #2885 / run `32648145266` / job `97215495481` fully green;
- merged `447236cecacc17b26d1bf88774e7785ac2121dfe`.

W3 #838:

- exact validated head `eb034c796adfdb9b5aba6d96462700201709d5af`;
- Mobile CI #2887 / run `32648944883` / job `97217437867` fully green;
- merged `7a9fd9b8c734a6b2cd9354d12432a2d99715d43e`.

Delivered behavior:

- deterministic explicit 7-day composition over existing Training Intelligence Review, Coverage, recovery and Adaptive Program authorities;
- compact Progress presentation plus drill-down into existing 7-day Training Progress;
- missing/mismatched evidence remains unknown/unavailable or fails closed;
- optional user-triggered read-only Coach explanation over bounded already-derived facts;
- no second analytics store, universal readiness score, hidden mutation or completed-history rewrite.

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
