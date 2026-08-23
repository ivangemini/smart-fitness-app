# Next Product Expansions

Updated: 2026-08-23

This file defines the reviewed queue after completion of the Exercise & Training Intelligence and Adaptive Program + Recovery packages. It does **not** create P21-F or Phase 22. Each item is an unnumbered package and must preserve existing data, privacy, sync, Coach and completed-history authority unless a separate reviewed contract changes that boundary.

## Execution order

1. Custom-template Smart Replace UI — **delivered by #835; source/CI package closed**.
2. Weekly Training Review — **delivered by #837/#838; source/CI package closed**.
3. Progress Stories / Share Cards — **current active source package**.
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

## 2. Weekly Training Review — delivered

### Delivery evidence

W1/W2 were delivered by #837:

- exact validated head `39a133550607de1f79aa005f693dc9f201f5e9ff`;
- Mobile CI #2885, run `32648145266`, job `97215495481`, fully green;
- merged squash `447236cecacc17b26d1bf88774e7785ac2121dfe`.

W3 was delivered by #838:

- exact validated head `eb034c796adfdb9b5aba6d96462700201709d5af`;
- Mobile CI #2887, run `32648944883`, job `97217437867`, fully green;
- merged squash `7a9fd9b8c734a6b2cd9354d12432a2d99715d43e`.

W4 is documentation/evidence closure. No additional runtime authority is introduced by closure, and optional physical-device UX observation remains separate from source completion.

### Delivered contract

The package now provides one explicit 7-day read-only review composed from existing deterministic authorities:

- exact planned-versus-completed identity from Training Intelligence Review;
- `training-intelligence-v1` findings;
- Training Coverage;
- Adaptive Program proposals and recovery modifier evidence;
- existing workout/session analytics.

The main Progress surface shows compact plan completion, coverage, recovery context, adaptive action counts and bounded key findings. The detail action opens the existing Training Progress surface with an explicit 7-day period rather than creating duplicate analytics.

Missing program or recovery evidence stays unavailable/unknown. Source-window or recovery-evidence disagreement fails closed. There is no second analytics persistence layer, universal readiness/recovery/quality score, automatic program mutation or completed-history rewrite.

The optional W3 Coach explanation is user-triggered and read-only. It uses the existing structured question capability only when `readOnly=true` and `automaticApplication=false`, sends bounded already-derived weekly aggregates/signals rather than arbitrary raw evidence or mutation data, and cannot recalculate the canonical review or apply workout/program changes.

## 3. Progress Stories / Share Cards — current active package

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
- progress photos require a separate explicit inclusion decision and must preserve Phase 20 privacy boundaries;
- existing Social workout/story publishing is not implicit authorization for native share/export or for publishing a generated card.

### Execution slices

- **S1 — deterministic share-card view models:** pure deterministic composition over already-owned facts; no renderer, native share dependency, persistence layer or publication side effect. S1 must preserve source dates/units/identity and fail closed when required evidence is unresolved.
- **S2 — reusable visual card renderer:** presentation only; it must render the S1 model rather than recalculate claims. The renderer/export technology choice is reviewed here, not smuggled into S1.
- **S3 — explicit native share/export surface:** platform share/export only after explicit user action; no hidden upload or Social publication.
- **S4 — optional Social post handoff:** implement only after separate review and explicit confirmation, reusing existing Social authority rather than bypassing it.

Current dependency audit: the app already includes `@shopify/react-native-skia`, while `expo-sharing` and `react-native-view-shot` are not current dependencies. Therefore S1 adds no native dependency; image capture/export dependency decisions belong to S2/S3.

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
