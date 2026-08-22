# Smart Fitness Current Status

Updated: 2026-08-22

Exact source, tests, migrations, CI and Git history override this checkpoint if it becomes stale.

## Current verified checkpoint

### Mobile repository

Repository: `ivangemini/smart-fitness-app`.

- Phase 18 Knowledge & Learning remains closed for P18-A through P18-H.
- Phase 19 Exercise + Training Intelligence is merged through PR #803.
- Phase 20 P20-A private standardized progress photos is merged through PR #804.
- Phase 20 P20-B visual comparison source implementation is complete in PR #805.
- P20-B code head: `44231980f4bbfd6a40e9e89510c42ab411b83db4`.
- Mobile CI #2724 passed repository line audits, agent navigation integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor on that code head.
- Exact final documentation head and Git merge history remain authoritative for P20-B closure evidence.

### Backend repository

Repository: `ivangemini/smart-fitness-backend`.

- Current known Phase 18 baseline: `a6179aff35093325f0571139d6ced7e3987a2f10`.
- Phase 20 P20-A/P20-B add no backend schema/provider/upload authority.

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
- **Phase 20 — Progress Photos / Body Composition:** P20-A merged through #804; P20-B source implementation complete in #805; P20-C is next.

## Phase 20 stable delivered scope

### P20-A

- private account-owned progress-photo records with `front`, `side` and `back` pose identity;
- camera capture and photo-library import from the dedicated Progress surface;
- repeatable pose, framing and lighting guidance;
- explicit added-at timestamp semantics instead of trusting imported EXIF time;
- image re-encoding before persistence so embedded EXIF/geolocation metadata is not copied into app-owned media;
- deterministic account-owned local document storage rather than picker/cache URI persistence;
- stable metadata identity, pose, source, lifecycle state and app-owned URI;
- durable two-phase per-photo deletion with recovery on the next repository read;
- account deletion/resume cleanup for both metadata and the deterministic photo directory;
- latest front/side/back presentation plus virtualized history;
- privacy data inventory and blocked export-contract coverage;
- no cloud/provider/social upload;
- no AI/vision body-fat estimation.

### P20-B

- private ready photos are selected deterministically for Before/After comparison;
- direct comparison requires the same pose and strictly increasing chronology;
- side-by-side uses non-cropping `contain` semantics;
- ghost overlay is enabled only for standardized 3:4 pairs within the reviewed aspect tolerance;
- overlay is a visual aid only, not body registration or a measurement;
- date and camera/library source identity stay visible;
- nearby stored weight (±7 days) and canonical waist length (±14 days) remain separate evidence;
- malformed/non-length waist values fail closed;
- the surface is read-only and creates no comparison persistence;
- no AI vision/photo-derived body-fat estimate exists.

## Permanent Phase 20 rules

- progress photos are private by default;
- app metadata must not retain imported EXIF/location metadata;
- local picker/cache URIs are not durable storage authority;
- deletion must cover the actual app-owned file, not metadata only;
- confirmed account deletion must clear both metadata and deterministic account-owned photo storage before the recovery marker can be considered complete;
- data export remains blocked until the existing reviewed export controls are implemented;
- visual comparison must fail closed rather than fabricate alignment or measurement precision;
- user-entered weight/body measurements must remain distinct from visual evidence;
- no source/CI claim implies physical-device permission/capture/import/comparison behavior is validated.

## Next execution order

1. Finalize #805 closure documentation and exact-head CI, then merge P20-B.
2. Begin P20-C from the merged P20-B baseline.
3. Compose existing weight analytics, canonical measurement-series analytics and private ready-photo timeline under one explicit period/end boundary.
4. Keep P20-C read-only and link to existing photo/measurement drill-downs rather than creating duplicate persistence.
5. Keep user-entered body-fat measurements explicitly stored evidence; do not add photo-derived body-fat precision or AI vision inference.
6. Keep independent Phase 14 external/provider/device evidence separate.

## Production / rollout boundary

Source merge, production deployment, OTA/native publication, provider activation and physical-device validation remain separate claims. P20-A camera/media lifecycle and P20-B visual comparison still require native/physical-device evidence before release-ready claims.
