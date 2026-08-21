# Smart Fitness Roadmap Progress

Updated: 2026-08-22

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI and Git history override stale prose.

Focused roadmap references:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/knowledge-learning.md`;
- `docs/roadmap/training-intelligence.md`.

## Verified phase baseline

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained. Companion is the user-facing presentation layer of Coach, not a second assistant authority.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** P18-A through P18-H are source/CI-complete and merged for the reviewed scope.
- **Phase 19 — Exercise + Training Intelligence:** active; P19-A is the first implementation target.
- **Phase 20 — Progress Photos / Body Composition:** approved roadmap scope, queued after the Phase 19 training-intelligence foundation.

There is no approved P18-I.

## Current verified checkpoint

### Mobile

Current `main`: `d0ea13038d9b46dc8b77b9fe6575689f4c044c1d`.

Recent Phase 18 closure path:

- #793 — Knowledge Library and immutable Reader;
- #794 — account-scoped exact-version learning state;
- #795 — reviewed learning paths;
- #797 — optional Coach → Learn mobile consumer;
- #796 — documentation closure for P18-A through P18-H.

#797 exact head `3d88b6b4f28349b6c11c5302e865e156b81c17d5` passed Mobile CI #2680 before merge.

### Backend

Current `main`: `a6179aff35093325f0571139d6ced7e3987a2f10`.

Recent Phase 18 closure path:

- #285 — canonical Knowledge persistence/published reader;
- #290 — provider-neutral editorial orchestration;
- #294 — exact-version quiz authority;
- #296 — account-scoped learning state;
- #306 — deterministic Coach → Learn selector;
- #307 — reviewed learning paths;
- #308 — deterministic trusted Coach finding authority;
- #309 — optional Coach run-detail Learn projection host.

#309 exact head `c4b4da92a926141ad3cea5e898c96177e1c2a49d` passed Backend CI #2243 before merge.

## Phase 15 — closure status

P15-A through P15-F remain source/CI-complete for the reviewed scope. Detailed evidence remains in `docs/qa/phase15-closure.md`.

Permanent Phase 15 invariants remain:

- purpose-specific bounded data access;
- deterministic analytics outside model prompts;
- read-only Coach orchestration unless the user explicitly confirms a separately reviewed mutation flow;
- compact Progress progressive disclosure;
- selector-only Progress ↔ Companion handoffs;
- raw Labs documents/unconfirmed drafts outside ordinary Coach context;
- missing evidence remains missing.

## Phase 16 — foreground closure

The reviewed first Proactive Coach product slice remains source/CI-complete.

Completed boundaries include deterministic bounded triggers, evidence-derived deduplication keys, presentation cooldown, account-scoped dismissal memory, one concise authenticated foreground Companion card, neutral localized copy and evidence-specific Progress navigation.

Not included: background/push generation, provider/model-triggered proactive generation, badges/streak-loss mechanics, automatic workout/program/nutrition/goal/Labs/safety mutation or production/device rollout claims.

## Phase 17 — Goals & Planning

P17-A through P17-D remain source/CI-complete. Existing profile goal fields remain canonical and P17-E remains inactive until a reviewed requirement genuinely needs richer persisted goal semantics.

## Phase 18 — Knowledge & Learning

Focused roadmap: `docs/roadmap/knowledge-learning.md`.

P18-A through P18-H are closed for the reviewed source/CI scope. The production recommendation-rule registry may remain intentionally empty until reviewed canonical `findingCode → articleId` mappings exist; that content-activation boundary does not reopen Phase 18 runtime work.

Do not invent P18-I merely to continue development.

## Phase 19 — Exercise + Training Intelligence

Focused roadmap: `docs/roadmap/training-intelligence.md`.

Product objective: make exercise anatomy and training history understandable through reusable visual anatomy, deterministic analytics and evidence-backed training findings.

### P19-A — Exercise Intelligence foundation

Approved scope includes:

- canonical reusable muscle taxonomy;
- reusable local SVG anatomy for front/back body views;
- stable muscle IDs;
- primary/secondary muscle highlighting;
- compact SVG muscle thumbnails in exercise-library filters such as `Chest`;
- interactive body-map filtering as a follow-up slice;
- exercise-detail anatomy using the same authority;
- accessible text fallback and no runtime dependency on remote anatomy images.

**Status:** active. First slice is SVG muscle thumbnails in exercise-library filters, reusing the existing taxonomy rather than adding a parallel naming system.

### P19-B — Training analytics foundation

Planned deterministic analytics include exercise performance trends, suitable-input e1RM trends, PR detection, volume, muscle-group exposure and bounded 7/30/90-day comparisons.

Do not introduce a universal fitness/readiness score or represent estimates as measured maxes.

**Status:** queued after P19-A foundation.

### P19-C — Plateau / PR / progression findings

Planned deterministic, versioned findings over trusted workout history include PRs, plateaus, regression, volume spikes, exposure imbalance and long exercise/muscle gaps. Model prose may explain a structured finding but is not finding authority.

**Status:** queued.

### P19-D — Training Intelligence UX

Primary surfaces are Progress and exercise detail, with optional bounded Coach explanation. Planned UX includes exercise drill-downs, SVG muscle heatmaps, PR/plateau history and exact evidence behind each insight.

**Status:** queued.

## Phase 20 — Progress Photos / Body Composition

Focused roadmap: `docs/roadmap/training-intelligence.md`.

Approved scope includes private account-owned standardized front/side/back progress photos, repeatable capture guidance, comparison/overlay tooling, timeline selection and pairing with real stored measurements such as weight and waist.

The product must not present photo-estimated body-fat percentage as exact measurement-grade truth. Any future model/vision estimation requires a separate uncertainty/privacy contract.

**Status:** approved roadmap scope; implementation queued after the Phase 19 foundation unless explicitly reprioritized.

## Remaining Phase 14 gates

- **Push:** configured APNs/FCM provider plus signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** configured private storage/model provider plus bounded lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Implement and validate the P19-A reusable SVG muscle-filter slice.
2. Continue P19-A with interactive front/back anatomy and body-map exercise filtering without duplicating muscle authority.
3. Build P19-B deterministic training analytics over trusted completed-session history.
4. Add P19-C versioned PR/plateau/progression findings and P19-D Progress/Coach presentation.
5. Start Phase 20 standardized private progress photos and comparison UX after the Phase 19 foundation unless explicitly reprioritized.
6. Keep P18-A through P18-H closed unless a reproduced defect or newly reviewed requirement appears; do not invent P18-I.
7. Keep P17-E inactive without a richer-goal requirement.
8. Execute remaining Phase 14 provider/native/device evidence independently when external prerequisites are available.
9. Repair reproduced defects and keep source/CI, deployment, provider activation, OTA/native release and physical-device evidence as separate claims.

## Authorization / release boundary

Source/CI progress does not relax provider, native/device, production, editorial-publication or medical-safety controls. Production deployment, production migrations, OTA/native publication, provider activation, canonical content publication and physical-device validation remain separately authorized/evidenced claims.
