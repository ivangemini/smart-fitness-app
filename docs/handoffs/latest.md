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
- **Custom-template Smart Replace T1–T4 #835**.

Most recent Smart Replace package evidence:

- #835 exact head `d915ed60cad9e59fe3966e34fab16d80c9c1f430`;
- Mobile CI #2882 / run `32646591600` / job `97211677598` fully green;
- merged squash `1a9c1ca7d9300cbf25c526b69c653a5f82e30d40`;
- exact saved-template source/replacement IDs, reviewed suggestions plus explicit manual catalog fallback;
- deterministic before/after preview;
- stale/collision/unresolved states fail closed;
- explicit Apply uses existing AppState persistence/sync authority;
- completed history remains immutable.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Phase 21 sync dependency #332 is merged.
- Admin control-plane/write hardening/navigation/session-v2 repair work through #325/#335/#336/#337/#340/#342/#343 is merged.
- production backend/Admin-console and authorized browser smoke were verified for the reviewed activation scope.
- **Admin production activation is closed** unless a reproduced production defect appears.

## Current authority

### Exercise Preferences + Smart Replace

Delivered source scope now covers both active sessions and saved custom templates:

- `avoid` and notes remain device-local and separate from favorites;
- reviewed candidates originate only from exact canonical Exercise Intelligence substitutions;
- candidate mapping uses exact IDs and fails closed;
- active-session Apply changes only explicitly pending sets;
- #824 established exact source/replacement custom-template identity and deterministic prescription remapping;
- #835 exposes that primitive through an explicit saved-template preview/Apply flow;
- manual catalog selection still resolves exact canonical IDs;
- preview is read-only;
- Apply rechecks current template fingerprint and returns `applied | stale | blocked`;
- unrelated template/prescription fields and completed history remain unchanged.

**Do not repeat the obsolete claim that custom-template Smart Replace is blocked or lacks a reviewed prescription-remapping/apply contract.**

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

1. Keep Template Smart Replace closure docs synchronized with #835 evidence.
2. Implement **Weekly Training Review W1** as a 7-day read-only composition over existing Training Intelligence Review, Coverage and recovery/Adaptive evidence; do not create a second analytics truth.
3. Continue **W2** with a compact Progress presentation and drill-down to existing 7-day training detail.
4. Add W3 Coach explanation only if a separate product need is demonstrated; do not add model surface by default.
5. Close the Weekly package after exact-head Mobile CI.
6. Then implement Progress Stories / Share Cards.
7. Define Trainer / Coach collaboration authority/privacy contract before collaboration implementation.
8. Continue Apple Health / Apple Watch source expansion where device evidence is not required.

Detailed queue: `docs/roadmap/next-product-expansions.md`.

## Independent evidence / release gates

These can run whenever prerequisites exist and must not be confused with source completion:

- relevant production EAS OTA metadata and real-iPhone active-workout smoke;
- optional custom-template Smart Replace physical-device modal/search UX check;
- Phase 20 signed-iPhone progress-photo validation;
- Phase 14 configured APNs/FCM, Labs storage/model and native Health evidence;
- Coach → Learn production mapping activation from approved canonical content;
- native build/install, provider activation, production rollout/store submission.

## Permanent continuation rules

- Do not invent P21-F or Phase 22.
- Do not reopen closed Phase 18/19/20/21, Adaptive A1–A4 or Template Smart Replace source scope without a reproduced defect or newly reviewed requirement.
- Completed workout/session history remains immutable.
- Exact exercise/template identity is required for mutation; unknown identity fails closed.
- Coach/model output may explain deterministic decisions but does not become calculation or mutation authority.
- Source merge, deployment, migration, provider activation, OTA/native publication and physical-device validation are separate claims.
