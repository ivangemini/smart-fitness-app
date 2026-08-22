# Training Intelligence & Body Composition Roadmap

Updated: 2026-08-22

This roadmap defines the reviewed product work after Phase 18. It focuses on Exercise Intelligence, Personal Training Intelligence, and Progress Photos / Body Composition. Existing Coach, Progress, Workouts, privacy, sync, safety and Liquid Glass authority remain in force.

## Product objective

Turn existing workout/exercise data into a clearer visual and analytical training system without creating a second Coach authority, pseudo-precision scores, or hidden automatic mutations.

The product should help a user answer three questions:

1. What muscle and movement does this exercise train?
2. How is my training performance changing over time?
3. How is my physique/body-composition progress changing visually and through real measurements?

## Phase 19 — Exercise + Training Intelligence

### P19-A — Exercise Intelligence foundation

Delivered reviewed scope:

- canonical muscle taxonomy remains in `src/features/exercises/muscleTaxonomy.ts`;
- one reusable local SVG anatomy geometry authority drives front/back body views;
- supported muscle regions use stable canonical IDs;
- primary/secondary highlights remain visually distinct;
- full-size anatomy, exercise-detail anatomy, thumbnails, interactive filtering and Progress heatmaps reuse the same SVG renderer;
- exercise-library muscle filters retain text labels while adding compact highlighted body thumbnails;
- front/back body regions can be tapped to set the existing exercise-library muscle filter;
- muscle detail drill-downs show exactly mapped exercises plus completed user training history;
- unknown provider muscle names fail closed to text/unmapped behavior instead of being guessed;
- no remote runtime anatomy images or one-off muscle PNG/JPEG assets are required.

Richer movement-pattern/substitution metadata remains data-authority-dependent: it should be added only when reviewed canonical data exists rather than inferred from exercise names.

### P19-B — Training analytics foundation

Delivered reviewed scope:

- completed workout/session history remains analytics authority;
- existing exercise performance and comparable estimated-1RM trends remain reusable;
- explicit PR types distinguish load, reps, estimated 1RM and session volume;
- mapped primary-muscle working sets/volume, secondary exposure, frequency and last exposure are derived from reviewed exercise metadata;
- current and immediately preceding equal 7/30/90-day windows are compared deterministically;
- calculations take an explicit `endAt` boundary rather than hidden wall-clock state;
- ambiguous exercise-name fallback and unknown muscle mappings fail closed;
- insufficient/unmapped evidence stays visible rather than being silently fabricated.

No universal fitness/readiness score is introduced, and estimated 1RM is never represented as a measured max.

### P19-C — Plateau and progression signals

Delivered reviewed scope uses `training-intelligence-v1` deterministic rules with explicit evidence for:

- new load/reps/e1RM/session-volume PRs;
- repeated comparable-performance plateau;
- stable load with rising reps;
- bounded comparable e1RM regression;
- unusually large recent volume increase;
- concentrated muscle-group exposure;
- long gap since a mapped muscle was trained;
- long gap since an exercise was trained.

Findings are bounded to the selected analysis window, preserve their underlying evidence, and remain deterministic. Free-form/model text is presentation/explanation only and is never finding authority.

### P19-D — Training Intelligence UX

Delivered reviewed scope:

- Training Progress uses shared 7/30/90-day period selection;
- reusable SVG front/back muscle heatmaps visualize mapped primary-muscle load intensity;
- primary/secondary set counts, exposure sessions, mapped volume and previous-window change remain inspectable as facts;
- progression findings display exact evidence rather than opaque scores;
- tapping a mapped heatmap region opens the canonical muscle detail drill-down;
- exercise progress retains conservative comparable-e1RM chart behavior and raw workout-history access;
- Coach handoff remains optional/read-only and does not become finding authority.

Reading an insight never automatically modifies a workout, program, goal, nutrition, Labs, recovery or safety state.

## Phase 20 — Progress Photos / Body Composition

### P20-A — Standardized private progress photos

Implemented reviewed source/CI scope in PR #804:

- private account-owned front / side / back photo slots;
- camera capture and photo-library import;
- repeatable pose, framing and lighting guidance;
- explicit added-at date/time identity rather than inferred EXIF capture time;
- imported/captured images are re-encoded before persistence so embedded EXIF/location metadata is not copied into the app-owned asset;
- media is copied into deterministic app-owned document storage under the owning account rather than persisting picker/cache URIs;
- metadata remains account-scoped and contains stable photo identity, pose, source, added-at time, lifecycle status and app-owned local URI;
- per-photo deletion uses a durable deleting state so interrupted file deletion can be recovered on the next read;
- account deletion/resume cleanup removes both progress-photo metadata and the deterministic account-owned photo directory before the cleanup marker is cleared;
- Progress exposes the photo surface and a virtualized history;
- privacy inventory and blocked data-access/export contracts explicitly include progress-photo metadata/lifecycle semantics;
- no cloud/provider/social upload is added;
- no photo-derived body-fat estimate is added.

Source/config CI passing does not constitute physical-device camera/photo evidence. P20-A must not be called release-ready until native build/runtime and real-device permission/capture/import/delete/account-cleanup behavior are separately evidenced.

### P20-B — Visual comparison

Next implementation scope:

- side-by-side comparison for two selected photos of the same pose;
- overlay/ghost comparison only where technically reliable;
- deterministic timeline selection;
- stable crop/scale semantics so visual differences are not created by arbitrary fit behavior;
- clear before/after date labels and source identity;
- pair each comparison endpoint with nearby stored weight/body measurements when available, while keeping those measurements distinct from visual evidence;
- fail closed when the two images cannot be meaningfully aligned rather than fabricating a precise comparison.

P20-B does not introduce AI vision analysis or body-fat estimation.

### P20-C — Body-composition progress surface

Combine reliable longitudinal signals without fabricating precision.

Scope:

- weight trend;
- waist and other stored measurements;
- progress-photo timeline;
- optional derived trends that can be reproduced from stored inputs.

Do not present photo-estimated body-fat percentage as an exact measurement. Any future vision/model estimate requires a separately reviewed uncertainty and privacy contract and must not be represented as clinical or measurement-grade truth.

## Shared constraints

- Existing data ownership, account deletion/export and sync boundaries remain authoritative.
- No hidden mutation of workouts, nutrition, goals, Labs, recovery or safety state.
- Do not create a second Coach or recommendation authority.
- Deterministic analytics precede model explanation.
- Preserve offline/local behavior where current architecture requires it.
- SVG anatomy remains reusable, local, accessible and theme-compatible.
- Progress photos remain private by default and are not silently uploaded.
- Physical-device evidence is required for camera/photo workflows before release claims.

## Execution order

1. P19-A reusable anatomy/thumbnails/filtering — implemented and merged in #803.
2. P19-B deterministic training analytics — implemented and merged in #803.
3. P19-C versioned PR/plateau/progression findings — implemented and merged in #803.
4. P19-D Progress presentation, heatmaps and evidence drill-downs — implemented and merged in #803.
5. P20-A private standardized progress photos — implementation complete in PR #804; exact-head CI/merge history is closure authority.
6. P20-B comparison/overlay UX — next.
7. P20-C combined body-composition progress surface — after stable comparison semantics.

## Current state

Phase 19 is merged on `main` through PR #803.

P20-A implementation is complete for the reviewed mobile source/CI scope in PR #804. The code head before closure documentation is `8d20cb49d227f85c24fe37109b15c021997100d4`; Mobile CI #2716 passed repository line audits, agent navigation integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor on that head. The final documentation head and merge history remain authoritative for closure.

P20-B is the next normal source implementation step. Native/physical-device evidence for P20-A remains a separate release gate and does not block beginning deterministic P20-B source work.