# Next Product Expansions

Updated: 2026-08-23

This file defines the reviewed queue after completion of the Exercise & Training Intelligence and Adaptive Program + Recovery packages. It does **not** create P21-F or Phase 22. Each item is an unnumbered package and must preserve existing data, privacy, sync, Coach and completed-history authority unless a separate reviewed contract changes that boundary.

## Execution order

1. Custom-template Smart Replace UI — **delivered by #835; source/CI package closed**.
2. Weekly Training Review — **current active source package**.
3. Progress Stories / Share Cards.
4. Trainer / Coach collaboration layer.
5. Apple Health / Apple Watch expansion.

Independent OTA/device/provider/content-activation gates remain outside this source queue and may run whenever prerequisites exist.

## 1. Custom-template Smart Replace UI — delivered

Delivered by #835 on exact validated head `d915ed60cad9e59fe3966e34fab16d80c9c1f430`, Mobile CI #2882, merged as `1a9c1ca7d9300cbf25c526b69c653a5f82e30d40`.

The final contract is documented in `docs/roadmap/template-smart-replace.md` and includes:

- custom/editable templates only;
- exact source/replacement canonical IDs;
- reviewed candidates with existing `avoid` filtering plus explicit manual catalog fallback;
- read-only selection and before/after preview;
- separate explicit Apply;
- stale/collision/unresolved identity fail closed;
- matching prescription identity remaps while load/reps/RPE and unrelated fields stay unchanged;
- title/description/duration/coach metadata and unrelated exercises stay unchanged;
- completed history remains immutable;
- existing template persistence/sync authority remains the only mutation path;
- no automatic program/template rewrite and no model mutation authority.

## 2. Weekly Training Review

### Objective

Provide one compact weekly read-only review of what was planned, what was completed, what changed and what deserves attention next.

### Input authority

Reuse existing deterministic sources only:

- exact planned-versus-completed identity from Training Intelligence Loop;
- `training-intelligence-v1` findings;
- Training Coverage;
- Adaptive Program proposals and recovery modifier evidence;
- existing workout/session analytics.

### Boundaries

- no second analytics persistence layer;
- no universal readiness, recovery or quality score;
- missing evidence stays unknown;
- Coach may explain an already-derived review but cannot calculate the canonical review or mutate workouts/programs;
- links should open inspectable evidence surfaces rather than duplicate detailed analytics.

### Candidate slices

- **W1 — weekly deterministic review model**;
- **W2 — Progress presentation + drill-down links**;
- **W3 — optional read-only Coach explanation**;
- **W4 — package closure and device UX evidence where useful**.

## 3. Progress Stories / Share Cards

### Objective

Let users explicitly create attractive, privacy-aware shareable cards from existing progress evidence.

### Eligible evidence examples

- PRs;
- completed workout summaries;
- weekly training review highlights;
- weight/body-measurement milestones;
- deterministic progress trends already owned by Progress.

### Boundaries

- private evidence remains private until explicit share/export;
- no automatic Social publication;
- no hidden cloud upload;
- no AI-generated metric claims or fabricated before/after facts;
- source dates, units and identities remain visible/traceable;
- progress photos require a separate explicit inclusion decision and must preserve Phase 20 privacy boundaries.

### Candidate slices

- **S1 — deterministic share-card view models**;
- **S2 — reusable visual card renderer**;
- **S3 — explicit native share/export surface**;
- **S4 — optional Social post handoff with explicit confirmation, if reviewed**.

## 4. Trainer / Coach Collaboration

### Objective

Support a deliberate human trainer/client relationship without turning a trainer or model into silent mutation authority.

### Contract required before implementation

- explicit relationship invitation/acceptance/revocation;
- bounded read scopes;
- private-data minimization by purpose;
- trainer comments/proposals stored with provenance;
- client/owner confirmation before workout/program mutations;
- audit history for high-impact changes;
- account deletion/revocation semantics;
- backend authorization and cross-account isolation tests;
- no access to raw secrets/provider payloads;
- Coach AI remains separate from human trainer identity/authority.

### Expected package shape

Backend relationship/permission foundation → mobile collaboration surfaces → proposal/review flow → explicit client Apply → audit/privacy hardening.

## 5. Apple Health / Apple Watch Expansion

### Objective

Build on the existing read-only HealthKit/Health Connect daily-step integration and add useful Apple-native fitness context without creating a parallel health truth model.

### Potential reviewed source directions

- broader read-only activity facts where product value is clear;
- workout handoff/surface integration with stable app workout identity;
- Watch companion experience for active workout controls/status;
- bounded synchronization of app-owned workout state rather than arbitrary HealthKit state mutation;
- purpose-specific Coach/Progress facts derived from reviewed health adapters.

### Boundaries

- signed-device/native evidence is mandatory for claims about HealthKit/Watch behavior;
- permissions remain user initiated;
- unavailable/denied/no-data states fail honestly;
- no invented readiness score from heterogeneous health signals;
- no direct model access to raw HealthKit payloads;
- write-back to HealthKit/Watch requires a separately reviewed contract.

## Independent gates

The following work is not blocked by this queue but cannot be truthfully closed without external evidence:

- current EAS OTA publication metadata and real-iPhone Phase 21 smoke;
- Phase 20 progress-photo physical-device validation;
- Phase 14 APNs/FCM, Labs provider/storage/model and native Health evidence;
- Coach → Learn production content mapping activation;
- any production rollout, store submission or secret/provider configuration requiring deliberate operational authorization.
