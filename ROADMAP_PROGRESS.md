# Smart Fitness Roadmap Progress

Updated: 2026-08-22

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI and live Git history override stale prose.

Focused roadmap references:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/knowledge-learning.md`;
- `docs/roadmap/training-intelligence.md`.

## Verified phase baseline

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** complete for reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained as presentation over Coach.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Progress Analytics:** source/CI-complete for reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D complete; P17-E remains requirement-gated rather than unfinished default work.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged; production Coach → Learn mappings remain a separate editorial/product activation.
- **Phase 19 — Exercise + Training Intelligence:** reviewed scope merged through #803 and #807.
- **Phase 20 — Progress Photos / Body Composition:** P20-A/P20-B/P20-C merged through #804/#805/#806 and source/CI-complete; physical-device evidence remains.
- **Phase 21 — Workout Assistant:** P21-A through P21-E are source/CI-complete and merged through #810; backend schema-v2 compatibility is deployed and verified in production. OTA publication evidence and real-device smoke remain.

There is no approved P21-F or Phase 22. Do not invent a new numbered phase merely to continue development.

## Current verified checkpoints

### Mobile

- Phase 21 exact PR head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806.
- PR #810 was squash-merged to `main` as `a2abde02e31b5ed1207e67835144e9359aea711e`.
- The merge message contains `[ota]`; the repository `Publish EAS Update` workflow is therefore eligible to publish iOS to production.
- Actual EAS workflow success/update ID/group/runtime remains a separate evidence item until observed.

### Backend

- Phase 21 sync dependency #332 is merged as `b5a054e49e795a75f19c16ba85f507396e4598b6`.
- Production backend was deployed from `main` at `8a2c539ecfbf7842bf37a02491de9f844ec83c81`; `b5a054e49e795a75f19c16ba85f507396e4598b6` is in its ancestry.
- Production verification reported backend healthy, PostgreSQL healthy, `/health` HTTP 200 and successful bounded workout-session sync compatibility for schema v1/v2, including fail-closed invalid cases.
- Admin write-plane PR #325 is merged as `a3f260aca1089548202eeeee8b96624e931b7efc`; that merge is also in the ancestry of deployed backend `8a2c539...`.
- The deployment reported the standard migration step completed successfully. Admin control-plane production behavior and global Administration navigation still require explicit verification/activation evidence before being called released.

## Stable delivered authority

### Phase 18 — Knowledge & Learning

The runtime path is complete. Production Learn recommendations remain fail-closed unless an approved canonical `findingCode → articleId` mapping exists. Models/runtime must not synthesize article IDs or fallback canonical lessons.

### Phase 19 — Exercise + Training Intelligence

Delivered authority includes:

- canonical muscle taxonomy and reusable SVG anatomy;
- exact/fail-closed muscle mapping, filtering and drill-downs;
- deterministic 7/30/90-day completed-session analytics;
- explicit load/reps/e1RM/session-volume PR types and evidence-backed findings;
- reviewed movement pattern, EN/RU technique cues, common errors, ROM guidance, qualitative fatigue cost and substitutions for 15 canonical local exercises.

### Phase 20 — Progress Photos / Body Composition

Delivered source includes:

- private standardized front/side/back progress photos with app-owned local storage;
- camera/library intake with re-encoding before persistence;
- durable deletion/account cleanup and privacy coverage;
- deterministic same-pose Before/After comparison and fail-closed overlay;
- nearby stored weight/waist only as separate evidence;
- read-only 30/90-day body-composition progress using existing calculation authorities;
- no cloud/provider/social photo upload, AI vision or photo-derived body-fat estimate.

### Phase 21 — Workout Assistant

Delivered source includes:

- row-aligned Previous load/reps/RPE and exact prescribed Today guidance;
- automatic rest timer only after explicit completion, using configured `restSeconds`;
- deterministic prescribed-load warm-up proposal with explicit Add/Skip;
- warm-up exclusion from working-set indexing and working analytics;
- typed `setType` (`working | warmup | backoff | drop | amrap`) plus optional `supersetId`;
- additive workout-session schema v2 while legacy sessions remain v1 and malformed envelopes fail closed;
- rare deterministic contextual adjustment with explicit Apply/Ignore and no silent rewrite.

## Remaining executable work

### 1. Phase 21 release evidence

- confirm the `Publish EAS Update` run for `a2abde02e31b5ed1207e67835144e9359aea711e` succeeded;
- record EAS update ID/group/runtime `1.0.3` and production branch/channel evidence;
- run a real-iPhone active-workout smoke covering Previous/Today, rest timer, warm-ups, set types/supersets, Apply/Ignore, active-session persistence and sync sanity.

### 2. Phase 20 physical-device evidence

Run `docs/qa/progress-photo-device-validation.md` on the intended signed iPhone build and record dated evidence for:

- camera permission/capture;
- photo-library import;
- re-launch persistence;
- per-photo delete and account cleanup;
- side-by-side comparison;
- overlay/fail-closed aspect behavior and visual quality.

### 3. Phase 14 external/provider evidence

Continue only when the external prerequisites exist:

- Push: APNs/FCM configuration plus signed-device permission/token/delivery/tap evidence;
- Labs: configured HTTPS S3-compatible storage/model plus bounded lifecycle and picker evidence;
- Steps: signed HealthKit/Health Connect evidence;
- Stories: remaining mobile/device runtime evidence.

### 4. Admin production completion

Backend source through #325/#335/#336/#337 is merged. The deployed backend SHA is a descendant of #325 and the deployment migration step completed successfully. Remaining release evidence is explicit live verification of the Admin control plane and, only after that verification, activation of the staged global Administration navigation in a small follow-up change.

### 5. Phase 18 content activation

Activate Coach → Learn mappings only from approved canonical content authority. This is editorial/product activation, not missing runtime infrastructure.

## Approved future expansion queue

The following directions are approved for planning but are not automatically authorized as a new numbered phase:

- Adaptive Program + Recovery Engine;
- Exercise Preferences + Smart Replace;
- Weekly Training Review;
- Apple Health / Apple Watch expansion;
- Progress Stories / Share Cards;
- Trainer / Coach collaboration layer.

Each requires its own reviewed requirements/authority boundaries before implementation.

## Execution order

1. Confirm Phase 21 OTA publication metadata.
2. Run Phase 21 real-iPhone smoke.
3. Run Phase 20 signed-iPhone validation.
4. Verify live Admin control-plane behavior; then activate staged Administration navigation if verification passes.
5. Continue Phase 14 external/provider/device evidence when prerequisites are available.
6. Activate Coach → Learn mappings only when approved content mappings exist.
7. Do not create P21-F/Phase 22 or reopen closed source scopes without a reproduced defect or newly reviewed requirement.

## Release boundary

Source merge, backend deployment, database migration execution, provider/content activation, OTA publication, native build/install and physical-device validation are separate claims and must not be conflated.
