# Latest Handoff

Updated: 2026-08-22

Exact source, tests, CI, deployment state and Git history override prose if this handoff becomes stale. **Resolve live refs/open-PR/CI state from Git/GitHub before acting.** Use `docs/current-status.md` for the mutable checkpoint, `ROADMAP_PROGRESS.md` for execution order and `docs/project-context.md` for stable architecture.

## Restart checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- Phase 19 reviewed Exercise + Training Intelligence scope is merged through #803/#807.
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and source/CI-complete for reviewed scope.
- CI guard repair #812 is merged and long-lived PR validation uses the live remote base branch.
- Phase 21 Workout Assistant P21-A through P21-E exact PR head `94f70355fe4b4b22240d2c90f1bd861f5bc6d068` passed Mobile CI #2806; #810 merged as `a2abde02e31b5ed1207e67835144e9359aea711e`.
- Exercise Preferences foundation #816 merged as `99427b189792489c1977d96959a366bac05962b9`.
- Read-only Smart Replace explorer #818 merged as `d396fc343019b96578f09fa2041dc6893bc5da9e`.
- Active-session replacement safety #819 exact head `438ae2946abf58eec3dc8bd2da371b937a126cb2` passed Mobile CI #2823 and merged as `c52277f580b5255d801a8cc045b0d2d4d708dc54`.
- Active-session reviewed Smart Replace Apply #820 exact head `fb70be57fe735e835494e6895a5016d35fe962bd` passed Mobile CI #2830 and merged as `872d0a677d85b0d856a9ab6df6e08d655e949739` with `[ota]`.
- Latest `[ota]` source therefore includes Phase 21 plus the Exercise Preferences/Smart Replace active-session work. Actual EAS publication metadata is still a separate evidence item until observed.

### Backend / Admin

Repository: `ivangemini/smart-fitness-backend`.

- Phase 21 sync dependency #332 is merged as `b5a054e49e795a75f19c16ba85f507396e4598b6` and requires no database migration.
- Admin write-plane #325 and follow-up hardening #335/#336/#337 are merged.
- #340 Administration navigation activation merged as `75c47a2a8973e41146c98d78cab07baa007f1274` after Backend CI #2453.
- #342 Admin session-v2 repair passed Backend CI #2458 and merged as `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c`.
- #343 browser-login session-v2 repair passed Backend CI #2461 and merged as `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50`.
- Production backend is deployed at exact SHA `62cb9846b3ba644b8f5e2a7ffcc520d7bfc9058c`.
- Production Admin-console is deployed at exact SHA `5a2ff9bb0bb006522576ff2eb3c588bf3d08fd50`.
- Migration `0056_admin_control_plane.sql` is applied; backend/PostgreSQL health, authorized schema-v2 `owner / bootstrap` session, account search, roles, feature flags, audit reads and ordinary-user 403 gating are verified.
- Final browser smoke passed for authorized login, global Administration navigation, `/administration`, `/administration/audit`, refresh persistence and direct-navigation persistence with 0 browser JS exceptions.
- **Admin production activation is closed.**

## Current authority

### Exercise + Training Intelligence

- `src/features/exercises/exerciseIntelligence.ts` owns reviewed `exercise-intelligence-v1` metadata for the 15 canonical local exercise identities.
- Unknown/remote-only IDs fail closed.
- OSS rows gain reviewed intelligence only when existing normalization reuses a reviewed canonical identity.
- Fatigue cost is qualitative programming guidance, not a readiness measurement.
- Reviewed substitutions are the only authority used to seed Smart Replace candidates.
- Canonical SVG muscle anatomy and deterministic training analytics remain separate reviewed authorities.

### Exercise Preferences + Smart Replace

Delivered source boundaries:

- per-exercise `avoid` and notes are device-local and separate from favorites;
- candidate ranking uses only reviewed substitutions, exact repository resolution and fail-closed filtering;
- `avoid` removes a candidate from the reviewed shortlist but does not prohibit manual explicit selection;
- detail-screen candidate explorer is read-only;
- active-session reviewed candidates map to the workout catalog only by exact canonical ID;
- active-session Apply requires explicit user selection and at least one source set with `completed === false`;
- only pending sets change exercise ID/name;
- completed sets and legacy completion evidence remain under the source exercise;
- set ID, load, reps, target/actual RPE, set type and superset membership are preserved;
- no new backend/sync schema was introduced.

Do not wire Smart Replace into persisted program/workout-template updates yet. Current custom-template editing rebuilds exercise identities from names/indexes and lacks a reviewed `workout.prescription` remapping contract.

### Phase 21 Workout Assistant

P21-A through P21-E remain merged and source/CI-complete:

- Previous + Today guidance is row-aligned, exact-ID based and read-only until user input;
- rest timer starts only on explicit set completion and uses configured `restSeconds`;
- warm-up proposal is deterministic from prescribed working load and persists as `setType: warmup` only after Add;
- warm-ups do not pollute working Previous, live totals, PR/e1RM/volume, exercise progress or weekly muscle analytics;
- durable set semantics are `working | warmup | backoff | drop | amrap` plus optional `supersetId`;
- workout sync remains v1 for legacy sessions and uses additive v2 only when set semantics exist;
- invalid v1/v2 semantic envelopes fail closed instead of silently losing fields;
- contextual adjustment requires material deterministic RPE/reps divergence and explicit Apply/Ignore.

### Admin control plane

Production activation is closed for the reviewed scope. Do not reopen this activation gate unless a reproduced production defect appears.

## Remaining evidence / release gates

### Current OTA / active workout

1. Confirm the `Publish EAS Update` run for latest `[ota]` merge `872d0a677d85b0d856a9ab6df6e08d655e949739` succeeded.
2. Record EAS update ID/group/runtime (`1.0.3`) plus production branch/channel evidence.
3. Perform a real-device active-workout smoke covering Previous/Today, rest timer, warm-ups, set types/supersets, contextual Apply/Ignore, reviewed Smart Replace shortlist, manual replacement fallback, completed-set preservation, session persistence and sync sanity.

The old #810/a2ab OTA run remains an historical audit item if exact old-run metadata is needed; a successful current OTA from `872d0a677...` is the preferred user-facing release checkpoint because it contains that source ancestry.

### Admin

No remaining activation gate. Keep closed unless a reproduced production defect appears.

### Other independent evidence

- Phase 14 configured-provider/native/device evidence;
- P20-A camera/photo-library lifecycle evidence;
- P20-B real-device comparison/overlay evidence;
- Coach → Learn production mapping activation from approved canonical content only.

Use `docs/qa/progress-photo-device-validation.md` for P20-A/P20-B real-device evidence. A prepared checklist is not proof of a completed run.

## Immediate continuation

1. Verify the EAS OTA publication corresponding to `872d0a677d85b0d856a9ab6df6e08d655e949739` when workflow evidence is available.
2. Run the current real-iPhone active-workout smoke and record dated evidence.
3. Run the Phase 20 signed-iPhone validation checklist.
4. Continue Phase 14 external evidence only when prerequisites are actually present.
5. Keep Admin production activation closed unless a reproduced defect appears.
6. Keep active-session Smart Replace source scope closed unless a reproduced defect appears; keep program/template Apply gated by stable identity/prescription-remapping requirements.
7. Do not invent P21-F/Phase 22 or reopen closed Phase 18/19/20/21 source slices without a reproduced defect or newly reviewed requirement.
8. Keep the Coach → Learn production mapping registry fail closed until approved canonical mappings exist.
9. Keep source completion, deployment, migration execution, provider activation, OTA/native publication and device validation as separate claims.
