# Training Intelligence & Body Composition Roadmap

Updated: 2026-08-22

This roadmap defines the next reviewed product work after Phase 18. It intentionally focuses on three approved directions: Exercise Intelligence, Personal Training Intelligence, and Progress Photos / Body Composition. Existing Coach, Progress, Workouts, privacy, sync, safety and Liquid Glass authority remain in force.

## Product objective

Turn the existing workout/exercise data into a clearer visual and analytical training system without creating a second Coach authority, pseudo-precision scores, or hidden automatic mutations.

The product should help a user answer three questions:

1. What muscle and movement does this exercise train?
2. How is my training performance changing over time?
3. How is my physique/body-composition progress changing visually and through real measurements?

## Phase 19 — Exercise + Training Intelligence

### P19-A — Exercise Intelligence foundation

Build a canonical reusable exercise anatomy layer.

Scope:

- retain and extend the canonical muscle taxonomy in `src/features/exercises/muscleTaxonomy.ts`;
- provide one reusable SVG anatomy system for front/back body views;
- every supported muscle region has a stable canonical ID;
- support primary and secondary muscle highlighting with distinct visual emphasis;
- use the same SVG authority at full-size and thumbnail sizes;
- add compact muscle thumbnails to exercise-library muscle/body-part filters (for example `Chest` + a body silhouette with chest highlighted);
- support exercise detail anatomy using the same canonical mapping;
- preserve text labels and accessibility labels; SVG is additive, not the only source of meaning;
- do not fetch remote anatomy images at runtime;
- do not create one-off PNG/JPEG assets per muscle;
- unknown provider muscle names must fail to an unhighlighted/text fallback rather than guessing.

Follow-up P19-A slices:

- interactive front/back body-map exercise filtering;
- tap a muscle region to filter exercises;
- muscle detail surface with relevant exercises and user history;
- richer movement metadata: movement pattern, equipment, primary/secondary muscles, substitutions and technique metadata where reviewed data exists.

### P19-B — Training analytics foundation

Use existing completed workout/session history as the authority for deterministic analytics.

Scope:

- exercise performance trend;
- estimated 1RM trend where the input set is suitable;
- rep-strength trend without pretending estimates are measured maxes;
- personal-record detection with explicit PR type;
- session and rolling training volume;
- muscle-group volume derived from reviewed exercise-to-muscle mappings;
- frequency and recent exposure by muscle group;
- stable 7/30/90-day comparisons;
- clear insufficient-data states.

Do not create a universal fitness/readiness score.

### P19-C — Plateau and progression signals

Provide deterministic training findings over trusted workout history.

Possible findings include:

- repeated performance plateau;
- stable load with rising reps;
- load/reps regression across multiple comparable exposures;
- unusually large volume increase;
- muscle-group exposure imbalance;
- new PR;
- long gap since a muscle/exercise was trained.

Rules must be versioned/tested and should use bounded evidence. Free-form model text is presentation/explanation only and is never finding authority.

### P19-D — Training Intelligence UX

Integrate the deterministic analytics primarily into Progress and exercise detail, with bounded Coach handoff where useful.

Scope:

- exercise analytics drill-down;
- muscle heatmap using the P19-A SVG map;
- 7/30/90-day muscle-load visualization;
- PR and plateau history;
- exact evidence behind each insight;
- optional Coach explanation over already-derived structured findings.

Reading an insight must never automatically modify a workout, program or goal.

## Phase 20 — Progress Photos / Body Composition

### P20-A — Standardized progress photos

Add private account-owned progress-photo capture/import and comparison.

Scope:

- front / side / back slots;
- capture/import guidance for repeatable pose, framing and lighting;
- date/time identity;
- private ownership and deletion/export semantics;
- no public/social exposure by default;
- no silent cloud/provider upload outside the reviewed storage contract.

### P20-B — Visual comparison

Scope:

- side-by-side comparison;
- overlay/ghost comparison where technically reliable;
- consistent crop/scale controls;
- timeline selection;
- pair photos with nearby weight and body measurements when available;
- clearly distinguish user-entered measurements from visual comparison.

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
- SVG anatomy must remain reusable, local, accessible and theme-compatible.
- Physical-device evidence is required for camera/photo workflows before release claims.

## Execution order

1. P19-A first slice: reusable SVG muscle thumbnail + exercise-library visual muscle filters.
2. P19-A full interactive anatomy/body-map filtering.
3. P19-B deterministic training analytics.
4. P19-C plateau/PR/progression findings.
5. P19-D Progress + Coach presentation and muscle heatmaps.
6. P20-A private standardized progress photos.
7. P20-B comparison/overlay UX.
8. P20-C combined body-composition progress surface.

## Current state

P19-A is active. The repository already contains a canonical muscle taxonomy and a full-size `MuscleMap`; the first implementation slice should reuse that authority rather than create a parallel muscle naming system.
