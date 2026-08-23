# Latest Handoff

Updated: 2026-08-23

Exact source, tests, CI, deployment state and Git history override prose if this handoff becomes stale. **Resolve live refs/open-PR/CI state from Git/GitHub before acting.** Use `docs/current-status.md` for the mutable checkpoint, `ROADMAP_PROGRESS.md` for execution order and `docs/project-context.md` for stable architecture.

## Restart checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Closed reviewed source scope includes:

- Phase 19 Exercise + Training Intelligence;
- Phase 20 P20-A/P20-B/P20-C;
- Phase 21 Workout Assistant P21-A through P21-E;
- Exercise Preferences + Smart Replace active-session scope #816/#818/#819/#820;
- exact custom-template replacement/prescription remapping primitive #824;
- Exercise Intelligence 2.0 #825;
- Training Coverage #826;
- Training Intelligence Loop #828;
- Adaptive Program + Recovery A1–A4 #829/#830/#831/#832;
- Adaptive package closure docs #833.

Most recent Adaptive package merge sequence:

- A1 #829 → `089753636c006c32937188285f33aba1aeac71eb`;
- A2 #830 → `18d2d6de52f36313582e28272c6b36665e261ed7`;
- A3 #831 → `8216903f8c44df5a4109c6d7839bcbd5e0757a03`;
- A4 #832 exact head `23ec7e692b305b1835b6b3e618243a785b5823f5` passed Mobile CI #2877 and merged as `4bf3015b5b911df5ffe4c3634ef6872fce83ecbf`;
- closure docs #833 merged as `9a38b143d892ee80fc6bfda7c6e5127bebfec638`.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Phase 21 sync dependency #332 is merged.
- Admin control-plane/write hardening/navigation/session-v2 repair work through #325/#335/#336/#337/#340/#342/#343 is merged.
- production backend/Admin-console and authorized browser smoke were verified for the reviewed activation scope.
- **Admin production activation is closed** unless a reproduced production defect appears.

## Current authority

### Exercise Preferences + Smart Replace

Delivered:

- `avoid` and notes remain device-local and separate from favorites;
- reviewed candidates originate only from exact canonical Exercise Intelligence substitutions;
- candidate mapping uses exact IDs and fails closed;
- active-session Apply changes only explicitly pending sets;
- completed/legacy history is immutable;
- #824 removed the old custom-template identity blocker by establishing exact source/replacement identity and deterministic `Workout.prescription` remapping while preserving unrelated fields.

**Do not repeat the obsolete claim that custom-template editing lacks a reviewed prescription-remapping primitive.**

The next authorized source package is the user-facing custom-template Smart Replace flow: deterministic preview → explicit selection → confirm → Apply, with stale/collision/unresolved states failing closed and existing template persistence/sync authority reused.

### Exercise + Training Intelligence

- reviewed `exercise-intelligence-v1` metadata remains exact/fail-closed;
- canonical SVG muscle anatomy and deterministic analytics remain separate authorities;
- Training Coverage and Training Intelligence Loop are merged/read-only evidence composition;
- no universal readiness score or hidden mutation authority.

### Adaptive Program + Recovery

A1–A4 are complete.

- deterministic findings map to `progress | maintain | review`;
- fresh stored recovery evidence may conservatively downgrade proposals without generating a weighted readiness score;
- recent exposure evidence is descriptive, not a recovery timer;
- eligible future custom-template prescription changes require explicit preview + Apply, exact identity, idempotency and stale fingerprint validation;
- completed history remains immutable;
- Coach explanation is optional/read-only and cannot calculate or apply the proposal.

Do not silently extend A1–A4; any future adaptive work is a new reviewed unnumbered package.

## Immediate autonomous continuation

1. Keep canonical docs synchronized with the current #824–#833 state and new expansion queue.
2. Implement **Custom-template Smart Replace T1 — deterministic preview model** over #824.
3. Continue T2 explicit template UI, T3 confirm/apply + stale gate, then T4 package closure after exact-head Mobile CI.
4. After template Smart Replace, implement Weekly Training Review.
5. Then Progress Stories / Share Cards.
6. Define Trainer / Coach collaboration authority/privacy contract before implementation.
7. Continue Apple Health / Apple Watch source expansion where device evidence is not required.

Detailed queue: `docs/roadmap/next-product-expansions.md`.

## Independent evidence / release gates

These can run whenever prerequisites exist and must not be confused with source completion:

- relevant production EAS OTA metadata and real-iPhone active-workout smoke;
- Phase 20 signed-iPhone progress-photo validation;
- Phase 14 configured APNs/FCM, Labs storage/model and native Health evidence;
- Coach → Learn production mapping activation from approved canonical content;
- native build/install, provider activation, production rollout/store submission.

## Permanent continuation rules

- Do not invent P21-F or Phase 22.
- Do not reopen closed Phase 18/19/20/21 or Adaptive A1–A4 source scope without a reproduced defect or newly reviewed requirement.
- Completed workout/session history remains immutable.
- Exact exercise/template identity is required for mutation; unknown identity fails closed.
- Coach/model output may explain deterministic decisions but does not become calculation or mutation authority.
- Source merge, deployment, migration, provider activation, OTA/native publication and physical-device validation are separate claims.
