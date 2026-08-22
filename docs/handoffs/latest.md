# Latest Handoff

Updated: 2026-08-22

Exact source, tests, CI and Git history override prose if this handoff becomes stale. **Resolve live refs/open-PR/CI state from Git/GitHub before acting.** Use `docs/current-status.md` for the mutable checkpoint and `docs/project-context.md` for stable architecture.

## Restart checkpoint

### Mobile

- repository: `ivangemini/smart-fitness-app`;
- Phase 19 reviewed Exercise + Training Intelligence scope is merged through #803/#807;
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and source/CI-complete for reviewed scope;
- CI guard repair #812 is merged and long-lived PR validation uses the live remote base branch;
- Phase 21 Workout Assistant P21-A through P21-E exact PR head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806;
- PR #810 was squash-merged to `main` as `a2abde02e31b5ed1207e67835144e9359aea711e` after the production backend compatibility gate was cleared;
- merge commit message contains `[ota]`, so the existing `Publish EAS Update` workflow is eligible to publish iOS to the production branch/channel; actual workflow success/update metadata still needs explicit evidence.

### Backend / Admin

- repository: `ivangemini/smart-fitness-backend`;
- Phase 21 sync dependency #332 is merged as `b5a054e49e795a75f19c16ba85f507396e4598b6` and requires no database migration;
- Admin write-plane #325 is merged as `a3f260aca1089548202eeeee8b96624e931b7efc`; its exact head passed Backend CI #2422, PostgreSQL CI #791 and Account Deletion Receipt CI #699;
- follow-up Admin hardening #335/#336/#337 is merged;
- #340 Administration navigation activation merged as `75c47a2a8973e41146c98d78cab07baa007f1274` after Backend CI #2453;
- #342 Admin session-v2 repair passed Backend CI #2458 and merged as `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c`;
- #343 browser-login session-v2 repair passed Backend CI #2461 and merged as `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50`;
- production backend is deployed at exact SHA `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c`;
- production Admin-console is deployed at exact SHA `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50`;
- backend container/PostgreSQL health and `/health` HTTP 200 are verified;
- migration `0056_admin_control_plane.sql` is applied and expected Admin tables/constraints exist;
- authorized Admin session is schema v2 with resolved `owner / bootstrap` principal and permissions;
- account search, roles, feature flags, audit reads and ordinary-user 403 gating were verified;
- no safe reversible production mutation target existed, so destructive/live write smoke was intentionally not performed;
- final browser smoke passed for authorized login, global Administration navigation, `/administration`, `/administration/audit`, refresh persistence and direct-navigation persistence with 0 browser JS exceptions;
- **Admin production activation is closed.**

## Current authority

### Exercise + Training Intelligence

- `src/features/exercises/exerciseIntelligence.ts` owns reviewed `exercise-intelligence-v1` metadata for the 15 canonical local exercise identities.
- Unknown/remote-only IDs fail closed.
- OSS rows gain reviewed intelligence only when existing normalization reuses a reviewed canonical identity.
- Fatigue cost is qualitative programming guidance, not a readiness measurement.
- Substitutions are read-only reviewed alternatives and never mutate a workout automatically.
- Canonical SVG muscle anatomy and deterministic training analytics remain separate reviewed authorities.

### Progress Photos / Body Composition

- Progress photos are private, account-owned local media; no cloud/provider/social upload is authorized.
- Import re-encoding prevents imported EXIF/location metadata from becoming durable app metadata.
- P20-B comparison is deterministic/read-only and does not infer body fat from images.
- P20-C composes existing weight/measurement/photo authorities rather than creating another persistence or calculation authority.

### Phase 21 Workout Assistant

P21-A through P21-E are merged:

- Previous + Today guidance is row-aligned, exact-ID based and read-only until user input;
- rest timer starts only on explicit set completion and uses configured `restSeconds`;
- warm-up proposal is deterministic from prescribed working load and persists as `setType: warmup` only after Add;
- warm-ups do not pollute working Previous, live totals, PR/e1RM/volume, exercise progress or weekly muscle analytics;
- durable set semantics are `working | warmup | backoff | drop | amrap` plus optional `supersetId`;
- workout sync remains v1 for legacy sessions and uses additive v2 only when set semantics exist;
- invalid v1/v2 semantic envelopes fail closed instead of silently losing fields;
- contextual adjustment requires material deterministic RPE/reps divergence and explicit Apply/Ignore;
- no silent remaining-set rewrite, plate calculator or universal readiness score was added.

### Admin control plane

Production activation is closed for the reviewed scope:

- migration `0056_admin_control_plane.sql` applied;
- backend exact SHA `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c`;
- Admin-console exact SHA `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50`;
- global `Администрирование` navigation is production-active;
- `/administration` and `/administration/audit` work under authorized browser access;
- authenticated session survives refresh and direct navigation;
- browser JS exceptions: 0.

Do not reopen this activation gate unless a reproduced production defect appears.

## Remaining evidence / release gates

### Phase 21

The backend deployment, compatibility, exact-head mobile CI and mobile merge gates are closed.

Still required before calling the user-facing release fully verified:

1. confirm the `Publish EAS Update` run for merge commit `a2abde02e31b5ed1207e67835144e9359aea711e` succeeded;
2. record EAS update ID/group/runtime (`1.0.3`) and production branch/channel evidence;
3. perform a real-device active-workout smoke covering Previous/Today, rest timer, warm-ups, set types/supersets, contextual Apply/Ignore, session persistence and sync sanity.

### Admin

No remaining activation gate. Keep closed unless a reproduced production defect appears.

### Other independent evidence

- Phase 14 configured-provider/native/device evidence;
- P20-A camera/photo-library lifecycle evidence;
- P20-B real-device comparison/overlay evidence;
- Coach → Learn production mapping activation from approved canonical content only.

Use `docs/qa/progress-photo-device-validation.md` for P20-A/P20-B real-device evidence. A prepared checklist is not proof of a completed run.

## Immediate continuation

1. Verify the EAS OTA publication corresponding to `a2abde02e31b5ed1207e67835144e9359aea711e`.
2. Run the Phase 21 real-iPhone smoke and record dated evidence.
3. Run the Phase 20 signed-iPhone validation checklist.
4. Continue Phase 14 external evidence only when prerequisites are actually present.
5. Keep Admin production activation closed unless a reproduced defect appears.
6. Do not invent P21-F/Phase 22 or reopen closed Phase 18/19/20/21 source slices without a reproduced defect or newly reviewed requirement.
7. Keep the Coach → Learn production mapping registry fail closed until approved canonical mappings exist.
8. Keep source completion, deployment, migration execution, provider activation, OTA/native publication and device validation as separate claims.
