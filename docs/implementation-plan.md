# Smart Fitness — Implementation Plan

Updated: 2026-08-22

This file is the canonical **forward sequencing** document. Exact live refs, PR state and CI state come from Git/GitHub. The mutable checkpoint belongs in `docs/current-status.md`; stable architecture belongs in `docs/project-context.md`; focused phase detail belongs under `docs/roadmap/` and `docs/architecture/`.

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
- Phase 19 Exercise + Training Intelligence: reviewed source/CI scope complete through #803/#807.
- Phase 20 Progress Photos / Body Composition: P20-A through P20-C complete for reviewed source/CI scope; physical-device evidence remains.
- Phase 21 Workout Assistant: P21-A through P21-E are merged and backend schema-v2 compatibility is deployed/verified; OTA publication evidence and real-device smoke remain.

There is no approved P21-F or Phase 22. New numbered phases require a reviewed requirement rather than automatic continuation.

## Active forward work

### 1. Phase 21 OTA + real-device closure

Closed gates:

- backend #332 merged as `b5a054e49e795a75f19c16ba85f507396e4598b6`;
- production backend deployed at `8a2c539ecfbf7842bf37a02491de9f844ec83c81`, with #332 in ancestry;
- production health and bounded workout-session sync v1/v2 compatibility passed;
- mobile #810 exact head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806;
- #810 squash-merged to mobile `main` as `a2abde02e31b5ed1207e67835144e9359aea711e`.

Remaining sequence:

1. confirm the `Publish EAS Update` workflow for `a2abde02...` completed successfully;
2. record EAS update ID/group/runtime `1.0.3` plus production branch/channel evidence;
3. on the intended iPhone run an active-workout smoke for Previous/Today, rest timer, warm-ups, set types/supersets, contextual Apply/Ignore, active-session persistence and sync sanity.

Do not call Phase 21 user-facing release verified until those publication/device checks are recorded.

### 2. Phase 20 physical-device evidence

Run `docs/qa/progress-photo-device-validation.md` on the intended signed iPhone build and record dated evidence for:

- camera permission and capture;
- photo-library import;
- re-launch persistence;
- per-photo delete and account cleanup;
- same-pose comparison;
- fail-closed overlay behavior and visual quality.

Source/CI closure is not native-device evidence.

### 3. Admin production completion

Backend Admin control-plane source through #325/#335/#336/#337 is merged. #325 merge `a3f260aca1089548202eeeee8b96624e931b7efc` is in the ancestry of production backend `8a2c539...`. The production deploy reported the standard migration step completed successfully.

Remaining sequence:

1. explicitly verify the live Admin control plane against production data/permissions, including RBAC/account controls, protected-target rules, feature flags, audit viewer and representative high-impact confirmation flows;
2. confirm migration `0056_admin_control_plane.sql` is present/applied in production migration state if the normal deployment evidence is not considered sufficient;
3. only after successful verification, activate the staged global Administration navigation in a small follow-up source change;
4. validate/deploy that Admin UI change through the existing VPS/GitHub-Actions Admin path.

Do not expose the navigation merely because source and migration code exist.

### 4. Phase 14 external evidence

Continue only when prerequisites exist:

- Push: staging/production APNs/FCM material plus signed-device permission/token/delivery/tap evidence;
- Labs: HTTPS S3-compatible storage + configured model material plus bounded synthetic lifecycle and physical-device picker evidence;
- Steps: signed HealthKit/Health Connect device evidence;
- Stories: remaining mobile/device runtime evidence.

Do not weaken fail-closed provider or HTTPS boundaries to bypass missing prerequisites.

### 5. Phase 18 content activation

Coach → Learn runtime infrastructure is complete. Production mappings remain a separately reviewed editorial/product action.

A real mapping must reference an approved canonical article and preserve:

- trusted typed finding identity;
- allowlisted `findingCode → articleId` selection;
- publication eligibility;
- exact-version hydration;
- learning-state suppression;
- risk-tier review requirements.

No mapping means no Learn card. Runtime/model code must not synthesize fallback canonical lessons.

### 6. Conditional P17-E

P17-E is not ordinary backlog. Revisit richer persisted goal architecture only when an approved requirement needs semantics the current profile cannot safely express, such as multiple independently versioned simultaneous goals, explicit deadlines/status or historical lifecycle records.

## Approved expansion queue after current closure

These directions are approved for roadmap planning, but each needs reviewed requirements before implementation:

- Adaptive Program + Recovery Engine;
- Exercise Preferences + Smart Replace;
- Weekly Training Review;
- Apple Health / Apple Watch expansion;
- Progress Stories / Share Cards;
- Trainer / Coach collaboration layer.

Do not silently convert this queue into Phase 22.

## Permanent architecture boundaries

### Coach and Companion

Coach and Companion are one product surface. Companion is the presentation/character layer over Coach authority, not a second recommendation or conversational-state authority.

Detailed analytics belong primarily in Progress. Coach/Companion consume bounded purpose-specific facts and link to inspectable evidence.

Permanent rules:

- minimum purpose-specific structured facts;
- no unrestricted model access to AppState, AsyncStorage, SecureStore or provider payloads;
- raw Labs documents and unconfirmed extraction drafts excluded from ordinary Coach context;
- deterministic calculations and hard guardrails outside model prompts;
- no pseudo-precision or universal readiness/scoring systems;
- no automatic application of Coach proposals.

### Knowledge & Learning

Reviewed product loop:

`bounded user evidence → deterministic Coach finding → allowlisted content mapping → canonical article → validated quiz → informational learning state`

Permanent rules:

- no XP, levels, streaks, badges, leaderboards, punishment or reward currency;
- canonical educational content is prepared/reviewed ahead of use;
- model/provider output alone is never publication authority;
- published article versions are immutable evidence boundaries;
- material factual claims remain tied to reviewed source evidence;
- quizzes bind to exact article versions and reviewed claims;
- Tier-3 Labs/medical-adjacent content requires human review and remains non-diagnostic/non-prescriptive;
- canonical content never contains private account evidence;
- reading/quiz completion never automatically mutates workouts, nutrition, goals, Labs, recovery or safety.

### Exercise + Training Intelligence

- canonical muscle taxonomy and SVG anatomy are reviewed local authority;
- reviewed Exercise Intelligence metadata is fail closed and is not inferred from names/body-part/muscle labels;
- training analytics are deterministic over completed-session evidence and explicit periods;
- qualitative fatigue cost is not a physiological readiness measurement;
- substitution metadata is read-only and never automatically edits a workout.

### Progress Photos / Body Composition

- photos are private account-owned local media;
- camera/library imports are re-encoded before durable app-owned persistence;
- no cloud/provider/social upload is authorized by Phase 20;
- no AI vision or photo-derived body-fat estimate is authorized;
- visual comparison is an aid, not geometric registration or measurement;
- weight/measurement/body-fat values remain existing stored evidence authorities;
- account cleanup and privacy lifecycle remain mandatory.

### Workout Assistant

- preserve the compact set table and progressive disclosure;
- Previous and Today guidance is deterministic/read-only until explicit user input;
- prescribed load authority comes only from exact `Workout.prescription` rows;
- rest timer state is transient and not workout-set truth;
- warm-up sets are durable but excluded from working-set analytics;
- durable set semantics use typed `setType`/`supersetId`;
- workout-session sync v1 remains backward compatible and schema v2 is additive/fail-closed;
- contextual adjustment requires material deterministic evidence and explicit Apply/Ignore;
- no plate calculator, universal readiness score or per-set interruption loop is authorized by Phase 21.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI according to repository policy. Documentation-only changes require the repository's documentation/agent-navigation gates and must not claim provider, device or production evidence that did not run.

Backend source changes require the applicable Backend CI, Backend PostgreSQL CI and account-lifecycle gates for their scope. Database migrations require forward-safe review and PostgreSQL evidence; migration execution remains a separate deployment claim.

Native/provider behavior requires corresponding physical-device or configured-environment evidence. Source support is not activation evidence.

## Release / deployment boundary

Always name the achieved state precisely:

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
- stable cross-repository context: `docs/project-context.md`;
- latest restart handoff: `docs/handoffs/latest.md`;
- roadmap index: `ROADMAP_PROGRESS.md`;
- training/body-composition roadmap: `docs/roadmap/training-intelligence.md`;
- Knowledge roadmap: `docs/roadmap/knowledge-learning.md`;
- agent routing: `PROJECT_MAP.md` and `docs/agent/README.md`;
- accumulated operational lessons: `PROJECT_LEARNINGS.md`.
