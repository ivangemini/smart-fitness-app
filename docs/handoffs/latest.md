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

### Backend

- repository: `ivangemini/smart-fitness-backend`;
- Phase 21 sync dependency #332 is merged to `main` as `b5a054e49e795a75f19c16ba85f507396e4598b6`;
- #332 exact head `1a0bf3319db094aed14b7e397242250f30dc087d` passed Backend CI #2435 and Backend PostgreSQL CI #798;
- #332 has no database migration;
- production backend is deployed from `main` at `8a2c539ecfbf7842bf37a02491de9f844ec83c81`, with `b5a054e49e795a75f19c16ba85f507396e4598b6` in its ancestry;
- backend container and PostgreSQL were reported healthy; `https://api.peptonio.com/health` returned HTTP 200;
- bounded sync smoke passed for legacy v1, v2 `setType: warmup` + `supersetId`, v1 rejection of v2-only fields, and rejection of unknown `setType`;
- startup migration step completed successfully with no reported errors.

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

## Remaining evidence / release gates

The backend deployment, compatibility, exact-head mobile CI and mobile merge gates are closed.

Still required before calling Phase 21 user-facing release fully verified:

1. confirm the `Publish EAS Update` run for merge commit `a2abde02e31b5ed1207e67835144e9359aea711e` succeeded;
2. record EAS update ID/group/runtime (`1.0.3`) and production branch/channel evidence;
3. perform a real-device active-workout smoke covering Previous/Today, rest timer, warm-ups, set types/supersets, contextual Apply/Ignore, session persistence and sync sanity.

Still separate:

- Phase 14 configured-provider/native/device evidence;
- P20-A camera/photo-library lifecycle evidence;
- P20-B real-device comparison/overlay evidence;
- OTA/native publication evidence and physical-device behavior evidence.

Use `docs/qa/progress-photo-device-validation.md` for P20-A/P20-B real-device evidence. A prepared checklist is not proof of a completed run.

## Immediate continuation

1. Verify the EAS OTA publication corresponding to `a2abde02e31b5ed1207e67835144e9359aea711e`.
2. Run the Phase 21 real-iPhone smoke and record dated evidence.
3. Run the Phase 20 signed-iPhone validation checklist when the intended build is available.
4. Continue Phase 14 external evidence only when prerequisites are actually present.
5. Do not invent P21-F/Phase 22 or reopen closed Phase 18/19/20 source slices without a reproduced defect or newly reviewed requirement.
6. Keep the Coach → Learn production mapping registry fail closed until approved canonical mappings exist.
7. Keep source completion, deployment, migration execution, provider activation, OTA/native publication and device validation as separate claims.
