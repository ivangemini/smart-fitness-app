# Smart Fitness — Implementation Plan

Updated: 2026-08-22

This file is the canonical **forward sequencing** document. The last verified mutable product/workstream checkpoint belongs in `docs/current-status.md`; **exact live refs, PR state and CI state come from Git/GitHub**; detailed stable architecture belongs in `docs/project-context.md`; focused phase detail belongs under `docs/roadmap/` and `docs/architecture/`.

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
- Phase 17 Goals & Planning: P17-A through P17-D complete; P17-E requirement-gated.
- Phase 18 Knowledge & Learning: P18-A through P18-H complete; there is no approved P18-I.
- Phase 19 Exercise + Training Intelligence: reviewed source/CI scope complete through #803 plus Exercise Intelligence completion #807.
- Phase 20 Progress Photos / Body Composition: P20-A through P20-C complete for reviewed source/CI scope.
- Phase 21 Workout Assistant: P21-A through P21-E implemented on mobile PR #810; backend schema-v2 dependency #332 is merged, while production backend deployment and mobile merge/publication remain separate release actions.

Use Git/GitHub for exact current refs and PR/CI state. Use `docs/current-status.md` for the last verified project checkpoint and known workstream boundaries.

## Active forward work

### 1. Phase 21 deployment and release sequencing

Do not publish schema-v2 workout sessions before the backend that understands them is running in production.

Required order:

1. deploy backend `main` containing merged #332 (`b5a054e49e795a75f19c16ba85f507396e4598b6`) through the normal production VPS backend path;
2. verify `https://api.peptonio.com/health` plus a bounded authenticated workout-session sync-v1/v2 compatibility smoke;
3. re-check exact mobile #810 head and Mobile CI;
4. merge mobile #810 only after the backend deployment is verified;
5. publish OTA/native output only as an explicit separate action;
6. perform a real-device active-workout smoke for Previous/Today, rest timer, warm-ups, set types/supersets and contextual Apply/Ignore behavior.

Backend #332 has no database migration. Source merge is not deployment evidence. The existing `Admin Production Deploy` workflow is scoped to `admin-console/`/compose changes and is not evidence that the Fastify API was redeployed for #332.

### 2. Phase 20 physical-device evidence

Source/CI closure does not prove native camera/photo behavior. Run `docs/qa/progress-photo-device-validation.md` on the intended signed iPhone build and record dated evidence for:

- camera permission and capture;
- photo-library import;
- re-launch persistence;
- per-photo delete and account cleanup;
- same-pose comparison;
- fail-closed overlay behavior and visual quality.

Do not claim this evidence before an actual device run.

### 3. Phase 14 external evidence

Continue only when prerequisites exist:

- Push: staging APNs/FCM material plus signed-device permission/token/delivery/tap evidence;
- Labs: staging HTTPS S3-compatible storage + configured model material plus bounded synthetic lifecycle and physical-device picker evidence;
- Steps: signed HealthKit/Health Connect device evidence;
- Stories: remaining mobile/device runtime evidence.

Do not weaken fail-closed provider or HTTPS boundaries to bypass missing prerequisites.

### 4. Phase 18 content activation

Coach → Learn runtime infrastructure is complete. Production mappings remain a separately reviewed editorial/product action.

A real mapping must reference an approved canonical article and preserve:

- trusted typed finding identity;
- allowlisted `findingCode → articleId` selection;
- publication eligibility;
- exact-version hydration;
- learning-state suppression;
- risk-tier review requirements.

No mapping means no Learn card. Runtime/model code must not synthesize fallback canonical lessons.

### 5. Backend independent workstreams

Backend work is governed by the backend repository’s exact source, `AGENTS.md`, current GitHub state and branch CI.

At the 2026-08-22 Phase 21 checkpoint:

- #324 is merged and establishes impact-aware backend agent tooling;
- #332 is merged and adds additive workout-session schema-v2 set semantics without a database migration;
- #325 remains an independent audited Admin write-plane workstream and must keep its own migration/deployment boundary.

Re-check live GitHub state before acting; this plan does not claim open/closed state indefinitely.

Admin source deployment is VPS/GitHub-Actions based; automatic Vercel Git deployments are disabled. A source merge is still not equivalent to backend deployment or migration execution.

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

### Goals

The canonical fitness profile continues to own existing v1 goal fields. P17-E is not a default next phase.

Revisit richer persisted goal architecture only when an approved requirement needs semantics the current profile cannot safely express, such as multiple independently versioned simultaneous goals, explicit deadlines/status or historical lifecycle records. Design identity, sync, migration, deletion/export/privacy and conflict authority before implementation.

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
- warm-up sets are durable but explicitly excluded from working-set analytics;
- durable set semantics use typed `setType`/`supersetId`, never overloaded UI strings or notes;
- workout-session sync v1 remains backward compatible and schema v2 is additive/fail-closed;
- contextual adjustment requires material deterministic evidence and explicit Apply/Ignore;
- no plate calculator, universal readiness score or per-set interruption loop is authorized by Phase 21.

## Validation policy

Mobile runtime/code PRs require exact-head Mobile CI according to repository policy. Documentation-only changes require source/path/link/agent-navigation integrity; they must not claim provider, device or production evidence that did not run.

Backend source changes require the applicable Backend CI, Backend PostgreSQL CI and account-lifecycle gates for their scope. Database migrations require forward-safe review and PostgreSQL evidence; migration execution remains a separate deployment action.

Native/provider behavior requires the corresponding physical-device or configured-staging evidence class. Source support is not activation evidence.

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
