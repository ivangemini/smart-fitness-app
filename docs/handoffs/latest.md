# Latest Handoff

Updated: 2026-08-22

Exact source, tests, CI and Git history override prose if this handoff becomes stale. **Resolve live refs/open-PR/CI state from Git/GitHub before acting.** Use `docs/current-status.md` for the last verified mutable checkpoint and `docs/project-context.md` for stable architecture.

## Restart checkpoint

### Mobile

- repository: `ivangemini/smart-fitness-app`;
- checkpoint observed after documentation-only #808;
- #807 is merged at `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0` and completes the reviewed Exercise Intelligence metadata without creating a new phase;
- Phase 20 P20-A/P20-B/P20-C is merged through #804/#805/#806 and source/CI-complete for reviewed scope.

### Backend

- repository: `ivangemini/smart-fitness-backend`;
- checkpoint observed after #330;
- Admin v5-v12 #305 is merged;
- #330 makes VPS/GitHub Actions the authoritative Admin deployment path and disables automatic Vercel Git deployments;
- #324 (backend impact-aware agent tooling) and #325 (audited Admin write-plane) were open at this checkpoint; re-check GitHub before acting.

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

## Remaining evidence

Use `docs/qa/progress-photo-device-validation.md` for P20-A/P20-B real-device evidence. A prepared checklist is not proof of a completed run.

Still separate:

- Phase 14 configured-provider/native/device evidence;
- P20-A camera/photo-library lifecycle evidence;
- P20-B real-device comparison/overlay evidence;
- OTA/native publication and production deployment evidence.

## Immediate continuation

1. Resolve exact current refs/open PRs/CI from GitHub before continuing this handoff.
2. Run the Phase 20 signed-iPhone validation checklist when the intended build is available.
3. Continue Phase 14 external evidence only when its prerequisites are actually present.
4. Do not reopen closed Phase 18/19/20 source slices without a reproduced defect or newly reviewed requirement.
5. Keep the Coach → Learn production mapping registry fail closed until approved canonical mappings exist.
6. Keep source completion, deployment, migration execution, provider activation, OTA/native publication and device validation as separate claims.
