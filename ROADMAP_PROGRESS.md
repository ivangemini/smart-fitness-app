# Smart Fitness Roadmap Progress

Updated: 2026-08-22

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI and Git history override stale prose. **Do not treat a SHA copied into roadmap prose as live Git state; query Git/GitHub for current refs.**

Focused roadmap references:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/knowledge-learning.md`;
- `docs/roadmap/training-intelligence.md`.

## Verified phase baseline

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains presentation over Coach, not a second assistant authority.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged. There is no approved P18-I.
- **Phase 19 — Exercise + Training Intelligence:** P19-A through P19-D merged through #803; reviewed Exercise Intelligence completion merged through #807.
- **Phase 20 — Progress Photos / Body Composition:** P20-A/P20-B/P20-C merged through #804/#805/#806 and source/CI-complete for reviewed scope.

## Current checkpoints

### Mobile

Checkpoint observed after #808, a documentation-only sync. Reviewed runtime/product closure remains the #807 merge commit `371e1cdfc09aeffd93f4664cabbb4a777f19e1b0` plus the already merged Phase 20 sequence.

Phase 19 reviewed scope is complete, including canonical SVG muscle anatomy, deterministic training analytics and reviewed `exercise-intelligence-v1` metadata. Phase 20 source scope is complete through #806.

### Backend

Checkpoint observed after #330.

Admin v5-v12 #305 is merged. PR #330 disabled automatic Vercel Git deployments; the VPS/GitHub Actions Admin path is authoritative. #324 and #325 were open at this checkpoint and are not roadmap completion evidence until merged; re-check their current GitHub state before acting.

## Phase 18 activation boundary

The reviewed Coach → Learn runtime is complete, but production content mappings remain editorial/product authority. No Learn recommendation is expected when no approved `findingCode → articleId` rule exists. Runtime code must not invent mappings, article IDs or provider-selected fallback lessons.

## Phase 19 stable authority

Reviewed scope includes:

- canonical muscle taxonomy and reusable local SVG anatomy;
- exact/fail-closed muscle mapping, filtering and drill-downs;
- deterministic completed-session 7/30/90-day analytics;
- explicit load/reps/e1RM/session-volume PR types and evidence-backed findings;
- reviewed movement pattern, technique cues, common errors, ROM, qualitative fatigue cost and substitutions for 15 canonical local exercises;
- EN/RU presentation and fail-closed behavior for unknown/remote-only records.

## Phase 20 stable authority

- private standardized front/side/back progress photos with app-owned local storage;
- camera/library intake with re-encoding before persistence;
- durable deletion/account cleanup and privacy coverage;
- deterministic same-pose comparison with non-cropping rendering and fail-closed overlay;
- nearby stored weight/waist only as separate evidence;
- read-only 30/90-day body-composition progress using existing calculation authorities;
- no cloud/provider/social photo upload, AI vision or photo-derived body-fat estimate.

## Remaining independent evidence

- Phase 14 configured-provider/native/device evidence;
- Phase 20 P20-A real-device camera/photo-library lifecycle evidence;
- Phase 20 P20-B real-device side-by-side/overlay rendering evidence.

Use `docs/qa/progress-photo-device-validation.md` for the Phase 20 run. The checklist itself is preparation, not proof.

## Next execution order

1. Query exact current Git/GitHub state before using this roadmap operationally.
2. Run Phase 20 physical-device validation on the intended signed iPhone build.
3. Continue Phase 14 external/provider/device evidence when prerequisites are available.
4. Activate Coach → Learn mappings only from reviewed canonical content authority.
5. Keep P17-E inactive until a richer-goal requirement crosses its documented threshold.
6. Do not create P20-D or Phase 21 without a reviewed requirement or reproduced defect.
7. Keep source/CI, deployment, migration execution, provider/content activation, OTA/native publication and physical-device evidence as separate claims.
