# Latest Handoff

Updated: 2026-08-22

Exact source, tests, CI and Git history override prose if this handoff becomes stale. **Resolve live refs/open-PR/CI state from Git/GitHub before acting.** Use `docs/current-status.md` for the last verified mutable checkpoint and `docs/project-context.md` for stable architecture.

## Restart checkpoint

### Mobile

- repository: `ivangemini/smart-fitness-app`;
- Phase 19 reviewed Exercise + Training Intelligence scope is merged through #803/#807;
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and source/CI-complete for reviewed scope;
- CI guard repair #812 is merged and long-lived PR validation uses the live remote base branch;
- Phase 21 mobile implementation is PR #810 on `phase-21-workout-assistant-p21a`;
- pre-documentation Phase 21 code head at this checkpoint is `2b4afbab5c071fa7d692b11c59fc651860bd3565`; query GitHub for the final head and exact-head Mobile CI before merge.

### Backend

- repository: `ivangemini/smart-fitness-backend`;
- Phase 21 sync dependency #332 is merged to `main` as `b5a054e49e795a75f19c16ba85f507396e4598b6`;
- #332 exact head `1a0bf3319db094aed14b7e397242250f30dc087d` passed Backend CI #2435 and Backend PostgreSQL CI #798;
- #332 has no database migration;
- source merge is **not** production API deployment evidence;
- the automatic Admin deploy workflow is scoped to Admin/compose changes and does not prove the Fastify API was rebuilt with #332.

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

P21-A through P21-E are implemented in #810:

- Previous + Today guidance is row-aligned, exact-ID based and read-only until user input;
- rest timer starts only on explicit set completion and uses configured `restSeconds`;
- warm-up proposal is deterministic from prescribed working load and persists as `setType: warmup` only after Add;
- warm-ups do not pollute working Previous, live totals, PR/e1RM/volume, exercise progress or weekly muscle analytics;
- durable set semantics are `working | warmup | backoff | drop | amrap` plus optional `supersetId`;
- workout sync remains v1 for legacy sessions and uses additive v2 only when set semantics exist;
- invalid v1/v2 semantic envelopes fail closed instead of silently losing fields;
- contextual adjustment requires material deterministic RPE/reps divergence and explicit Apply/Ignore;
- no silent remaining-set rewrite, plate calculator or universal readiness score was added.

## Remaining evidence / release gates

Immediate Phase 21 gate:

1. deploy backend `main` containing `b5a054e49e795a75f19c16ba85f507396e4598b6` to production VPS;
2. verify `api.peptonio.com/health` and bounded authenticated workout-session sync v1/v2 compatibility;
3. re-check #810 exact head + Mobile CI;
4. merge #810 only after production backend evidence exists;
5. keep OTA/native publication separate;
6. perform a real-device active-workout smoke after publication/build installation.

Still separate:

- Phase 14 configured-provider/native/device evidence;
- P20-A camera/photo-library lifecycle evidence;
- P20-B real-device comparison/overlay evidence;
- backend production deployment evidence;
- OTA/native publication and physical-device behavior evidence.

Use `docs/qa/progress-photo-device-validation.md` for P20-A/P20-B real-device evidence. A prepared checklist is not proof of a completed run.

## Immediate continuation

1. Resolve exact mobile #810 head and current CI state from GitHub.
2. Deploy merged backend #332 to the production VPS using the normal backend production process; do not substitute Admin deploy evidence.
3. Verify production backend health + workout-session sync compatibility.
4. Merge/publish mobile #810 only after that backend evidence exists, then run the Phase 21 real-device smoke.
5. Run the Phase 20 signed-iPhone validation checklist when the intended build is available.
6. Continue Phase 14 external evidence only when prerequisites are actually present.
7. Do not invent P21-F/Phase 22 or reopen closed Phase 18/19/20 source slices without a reproduced defect or newly reviewed requirement.
8. Keep the Coach → Learn production mapping registry fail closed until approved canonical mappings exist.
9. Keep source completion, deployment, migration execution, provider activation, OTA/native publication and device validation as separate claims.
