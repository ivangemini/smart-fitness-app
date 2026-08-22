# Smart Fitness Current Status

Updated: 2026-08-22

Exact source, tests, migrations, CI and Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Phase 18 Knowledge & Learning remains closed for P18-A through P18-H.
- Phase 19 Exercise + Training Intelligence is merged through PR #803.
- Phase 20 P20-A private standardized progress photos is merged through PR #804.
- Phase 20 P20-B deterministic visual comparison is merged through PR #805; merge commit `c5074f006fd67cdaf5a485a8c4b8a4b78b1340a7`.
- Phase 20 P20-C body-composition progress source implementation is in PR #806.
- P20-C code head: `54cf667c5280e089ca81bb1c8c4335fbda43e8ec`.
- Mobile CI #2726 passed repository line audits, agent navigation integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor on that code head.
- Exact final documentation head and #806 merge history remain authoritative for Phase 20 source/CI closure.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.
- Phase 20 adds no backend schema/provider/upload authority.

## Phase status

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained; Companion remains presentation over Coach rather than a second assistant.
- **Phase 14:** ordinary source/runtime preparation is exhausted for current contracts; external provider/native/device evidence remains.
- **Phase 15:** source/CI-complete for reviewed Coach/Data Access + Progress scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H source/CI-complete and merged. There is no approved P18-I.
- **Phase 19 — Exercise + Training Intelligence:** merged through #803.
- **Phase 20 — Progress Photos / Body Composition:** P20-A merged through #804, P20-B merged through #805, P20-C source implementation complete in #806 pending closure-head CI/merge.

## Phase 20 stable delivered scope

### P20-A

- private account-owned `front`, `side` and `back` progress photos;
- camera/photo-library input with repeatable pose/framing/lighting guidance;
- explicit added-at timestamp instead of trusting EXIF capture time;
- image re-encoding before persistence so embedded EXIF/location metadata is not copied;
- deterministic account-owned local document storage and account-scoped metadata;
- durable two-phase deletion/recovery and account cleanup;
- latest pose presentation plus virtualized history;
- privacy inventory and blocked export-contract coverage;
- no cloud/provider/social upload or AI/vision body-fat estimation.

### P20-B

- deterministic private same-pose Before/After comparison;
- strict chronological validation and fail-closed invalid states;
- side-by-side `contain` rendering;
- 3:4-only ghost overlay as a visual aid, not registration/measurement;
- visible date and camera/library source identity;
- nearby stored weight (±7 days) and canonical waist length (±14 days) as separate evidence;
- malformed/non-length waist records fail closed;
- no derived comparison persistence, AI vision or photo-derived body-fat estimate.

### P20-C

- read-only 30/90-day body-composition progress surface;
- explicit stable `endAt`/period boundary;
- existing `getWeightAnalytics` and `getWeightTrendEntries` reused as weight authorities;
- existing `buildBodyMeasurementProgressAnalytics` reused as measurement-series authority;
- canonical waist summary plus other stored measurement values/deltas;
- user-entered body-fat remains stored measurement evidence and is never relabeled as image inference;
- private ready-photo timeline is bounded to the selected period and keeps pose/date/source identity;
- existing measurement, progress-photo and photo-comparison drill-downs are reused;
- no new persistence/sync/provider upload, hidden mutation, AI vision or photo-derived body-fat estimate.

## Permanent Phase 20 rules

- progress photos are private by default;
- imported EXIF/location metadata is not durable app metadata authority;
- picker/cache URIs are not durable storage authority;
- deletion must cover actual app-owned files as well as metadata;
- user-entered weight/body measurements and visual evidence remain explicitly distinct;
- visual comparison fails closed rather than fabricating alignment or measurement precision;
- body-composition summaries compose existing calculation authorities rather than duplicating them;
- no source/CI claim implies physical-device permission/capture/import/comparison behavior is validated.

## Next execution order

1. Finalize #806 documentation and final exact-head Mobile CI, then merge P20-C.
2. After #806 merge, treat Phase 20 as source/CI-complete for the reviewed roadmap scope.
3. Do not create P20-D or Phase 21 without a reviewed requirement or reproduced defect.
4. Keep Phase 14 configured-provider/native/device evidence independent.
5. Keep P20-A/P20-B real-device photo workflow and comparison-quality evidence as separate release work.

## Production / rollout boundary

Source merge, production deployment, OTA/native publication, provider activation and physical-device validation remain separate claims. Phase 20 source/CI completion does not make the camera/photo workflow release-ready without native/physical-device evidence.