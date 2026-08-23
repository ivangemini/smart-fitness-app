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
- Adaptive package closure docs #833;
- Custom-template Smart Replace T1–T4 #835, docs closure #836;
- **Weekly Training Review W1–W3 #837/#838; W4 is documentation/evidence closure.**

Most recent Weekly Training Review evidence:

- #837 exact head `39a133550607de1f79aa005f693dc9f201f5e9ff`;
- Mobile CI #2885 / run `32648145266` / job `97215495481` fully green;
- #837 merged squash `447236cecacc17b26d1bf88774e7785ac2121dfe`;
- #838 exact head `eb034c796adfdb9b5aba6d96462700201709d5af`;
- Mobile CI #2887 / run `32648944883` / job `97217437867` fully green;
- #838 merged squash `7a9fd9b8c734a6b2cd9354d12432a2d99715d43e`.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Phase 21 sync dependency #332 is merged.
- Admin control-plane/write hardening/navigation/session-v2 repair work through #325/#335/#336/#337/#340/#342/#343 is merged.
- production backend/Admin-console and authorized browser smoke were verified for the reviewed activation scope.
- **Admin production activation is closed** unless a reproduced production defect appears.

## Current authority

### Exercise Preferences + Smart Replace

Delivered source scope covers both active sessions and saved custom templates:

- `avoid` and notes remain device-local and separate from favorites;
- reviewed candidates originate only from exact canonical Exercise Intelligence substitutions;
- candidate mapping uses exact IDs and fails closed;
- active-session Apply changes only explicitly pending sets;
- #824 established exact source/replacement custom-template identity and deterministic prescription remapping;
- #835 exposes that primitive through an explicit saved-template preview/Apply flow;
- manual catalog selection resolves exact canonical IDs;
- preview is read-only;
- Apply rechecks current template fingerprint and returns `applied | stale | blocked`;
- unrelated template/prescription fields and completed history remain unchanged.

Do not repeat the obsolete claim that custom-template Smart Replace is blocked or lacks a reviewed prescription-remapping/apply contract.

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

### Weekly Training Review

Weekly is now a completed read-only composition package:

- exact explicit 7-day window;
- planned/completed comparison reuses existing exact Training Intelligence identity;
- Training Coverage, deterministic findings, recovery modifier and Adaptive Program proposals remain their own authorities;
- compact Progress presentation links to existing 7-day Training Progress detail;
- missing data remains unknown/unavailable and evidence mismatch fails closed;
- no second analytics persistence layer or universal weekly/readiness score;
- W3 Coach explanation is explicit user-triggered, bounded and read-only;
- Coach cannot recalculate the canonical review or mutate workouts/programs;
- completed history is unchanged.

## Immediate autonomous continuation

1. Start **Progress Stories / Share Cards S1** as pure deterministic share-card view models over existing exact Progress evidence.
2. Keep S1 free of renderer/native share dependencies, persistence, upload and Social publication side effects. Preserve source dates, units and identities; unresolved required evidence fails closed.
3. Continue **S2** with a reusable visual renderer that consumes the S1 model without recalculating claims. Review renderer/capture technology separately; current app has Skia but not `expo-sharing` or `react-native-view-shot`.
4. Continue **S3** with explicit native share/export only after a deliberate dependency/implementation decision; no hidden upload or automatic Social publication.
5. Add **S4 Social handoff** only if separately reviewed and explicitly confirmed, reusing existing Social authority.
6. Define Trainer / Coach collaboration authority/privacy contract before collaboration implementation.
7. Continue Apple Health / Apple Watch source expansion where device evidence is not required.

Detailed queue: `docs/roadmap/next-product-expansions.md`.

## Independent evidence / release gates

These can run whenever prerequisites exist and must not be confused with source completion:

- relevant production EAS OTA metadata and real-iPhone active-workout smoke;
- optional custom-template Smart Replace physical-device modal/search UX check;
- optional Weekly Review physical-device UX observation;
- Phase 20 signed-iPhone progress-photo validation;
- Phase 14 configured APNs/FCM, Labs storage/model and native Health evidence;
- Coach → Learn production mapping activation from approved canonical content;
- native build/install, provider activation, production rollout/store submission.

## Permanent continuation rules

- Do not invent P21-F or Phase 22.
- Do not reopen closed Phase 18/19/20/21, Adaptive A1–A4, Template Smart Replace or Weekly Training Review source scope without a reproduced defect or newly reviewed requirement.
- Completed workout/session history remains immutable.
- Exact exercise/template identity is required for mutation; unknown identity fails closed.
- Coach/model output may explain deterministic decisions but does not become calculation or mutation authority.
- Existing Social publishing flows do not implicitly authorize native share/export or card publication.
- Progress photos require separate explicit inclusion and remain under Phase 20 privacy boundaries.
- Source merge, deployment, migration, provider activation, OTA/native publication and physical-device validation are separate claims.
