# Training Intelligence & Body Composition Roadmap

Updated: 2026-08-22

This roadmap defines the reviewed work for Exercise Intelligence, Personal Training Intelligence, and Progress Photos / Body Composition. Existing Coach, Progress, Workouts, privacy, sync, safety and Liquid Glass authority remain in force.

## Product objective

Help the user answer three questions without creating duplicate authority or false precision:

1. What muscle and movement does this exercise train?
2. How is my training performance changing over time?
3. How is my physique/body-composition progress changing visually and through real stored measurements?

## Phase 19 — Exercise + Training Intelligence

P19-A through P19-D are implemented and merged through PR #803 for the reviewed mobile source/CI scope.

Stable Phase 19 authority:

- one canonical muscle taxonomy and reusable local SVG anatomy authority;
- exact/fail-closed muscle mapping;
- deterministic completed-session analytics under explicit 7/30/90-day windows;
- explicit load/reps/e1RM/session-volume PR types;
- `training-intelligence-v1` deterministic progression/plateau/regression/volume/gap findings with exact evidence;
- Progress heatmaps and evidence drill-downs;
- no universal readiness score, hidden state mutation, or model-owned deterministic finding authority.

## Phase 20 — Progress Photos / Body Composition

### P20-A — Standardized private progress photos

Implemented and merged through PR #804:

- private account-owned front / side / back photos;
- camera and photo-library input with repeatable pose/framing/lighting guidance;
- explicit added-at timestamp identity;
- image re-encoding before app-owned persistence so imported EXIF/location metadata is not copied;
- deterministic account-owned local document storage and strict metadata parsing;
- durable per-photo deletion recovery;
- account-deletion/resume cleanup covers metadata and deterministic photo files;
- virtualized history, privacy inventory and blocked export-contract coverage;
- no cloud/provider/social upload and no photo-derived body-fat estimate.

Native/physical-device permission, capture, import, persistence and deletion evidence remains a separate release gate.

### P20-B — Visual comparison

Implemented and merged through PR #805:

- deterministic same-pose Before/After selection;
- latest chronological pair default with user-controlled selection;
- same-photo, pose-mismatch and invalid chronology fail closed;
- non-cropping side-by-side comparison;
- 50/50 ghost overlay only for standardized 3:4 pairs within reviewed tolerance;
- explicit disclosure that overlay is a visual aid, not body registration or measurement;
- visible date and camera/library source identity;
- nearest stored weight within ±7 days and canonical waist length within ±14 days as separate evidence;
- malformed/non-length waist records fail closed;
- no comparison persistence, AI vision, photo-derived body-fat estimate or hidden state mutation.

Real-device comparison rendering/visual-quality evidence remains a separate release gate.

### P20-C — Body-composition progress surface

Implemented reviewed source scope in PR #806:

- read-only 30/90-day body-composition view under one explicit `endAt`/period boundary;
- existing `getWeightAnalytics` remains weight summary authority;
- existing `getWeightTrendEntries` remains weight-trend selection/dedup authority;
- existing `buildBodyMeasurementProgressAnalytics` remains measurement-series authority;
- canonical waist summary and other stored measurements are presented as user-entered evidence;
- a user-entered body-fat value remains a stored measurement and is never relabeled as a photo estimate;
- private ready progress photos are period-bounded and presented as visual timeline evidence with pose/date/source identity;
- photo timeline is bounded/virtualized and links read-only to P20-A photos and P20-B comparison;
- no new persistence, sync, provider upload, AI vision or photo-derived body-fat estimate is introduced.

The code head `54cf667c5280e089ca81bb1c8c4335fbda43e8ec` is the P20-C implementation head. Its Mobile CI #2726 is code-head validation authority; final closure-documentation head and PR #806 merge history are final source/CI closure authority.

## Shared constraints

- Existing data ownership, account deletion/export and sync boundaries remain authoritative.
- No hidden mutation of workouts, nutrition, goals, Labs, recovery or safety state.
- Do not create a second Coach, storage, taxonomy or calculation authority.
- Deterministic analytics precede model explanation.
- Progress photos remain private by default and are not silently uploaded.
- User-entered measurements and visual evidence must remain explicitly distinct.
- Do not present photo-estimated body-fat percentage as exact or measurement-grade truth.
- Physical-device evidence is required for camera/photo workflows before release-ready claims.

## Execution order / current state

1. P19-A through P19-D — implemented and merged in #803.
2. P20-A private standardized progress photos — implemented and merged in #804.
3. P20-B deterministic comparison — implemented and merged in #805.
4. P20-C combined body-composition progress — source implementation complete in #806; final exact-head CI/merge history is authority.

After P20-C closure, Phase 20 is source/CI-complete for the reviewed scope. There is no approved Phase 21 in this roadmap; do not invent one merely to continue development. Remaining native/physical-device evidence for P20-A/P20-B stays a separate release workstream.
