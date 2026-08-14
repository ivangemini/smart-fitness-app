# Labs roadmap

Updated: 2026-08-14

Status: **Phase 12 source foundation merged; Phase 14 interpretation composition active; provider/native/runtime activation still gated.**

This focused roadmap defines the Labs / Analyses product boundary. `docs/implementation-plan.md` remains the canonical forward roadmap and must be synchronized from final merged Phase 14 SHAs. Exact code, tests and Git history override stale prose.

## Product goal

Turn private laboratory documents into a reviewable longitudinal biomarker history. Data integrity is more important than automation: extracted/OCR/model output is a draft until the user verifies it, and interpretation uses confirmed structured facts rather than raw document text.

## Merged Phase 12 baseline

Phase 12 mobile PR #644 and backend PR #230 are merged.

The merged source baseline provides:

- Labs as the fifth primary tab while Coach remains a hidden/global-companion route;
- grouped Settings information architecture with Account/security separated from Profile/personal data;
- server-authoritative Labs state isolated from legacy local `AppState` sync;
- owner-scoped document lifecycle `pending_upload → uploaded → processing → review_required → confirmed`, plus explicit `failed` state;
- private `private/labs/v1/` object-storage boundary and signed upload seam;
- image ingestion contract for JPEG/PNG/HEIC, capability-gated until private storage/processing runtime exists;
- backend PDF contract without a mobile native picker dependency;
- provider-neutral extraction, confidence/provenance and deterministic normalization contracts;
- review-before-confirmation with accept/correct/exclude actions;
- rejection of empty extraction and all-excluded confirmation;
- owner-scoped retry of failed processing only when processing capability is explicitly available;
- confirmed biomarker read models, history, attention surfaces and charts;
- 3M / 6M / 1Y / All history windows anchored to latest confirmed data;
- multi-marker trends for up to three biomarkers, with absolute mode limited to compatible units and relative-to-reference mode requiring a valid two-sided source-lab interval;
- latest-two and arbitrary two-panel comparison;
- read-only bounded Coach/Labs service contracts for confirmed structured facts;
- private Labs data export/account-deletion/inventory lifecycle;
- safe-area, Dynamic Type, accessibility-state, chart-summary and Reduce Transparency hardening.

This merged source baseline does **not** claim production object storage, OCR/model provider, migration execution, deployment, PDF native picker, device validation or release activation.

## Interpretation foundation

Backend Phase 12 established:

- confirmed-data minimum-context builder;
- nearest previous confirmed panel selection;
- deterministic comparison facts;
- hard 200-result-per-panel context bound;
- descriptive changed-since-last codes such as `toward_reference`, `away_from_reference`, `stable`, `new` and `not_comparable` without health-outcome claims;
- bounded structured finding contract with confidence and exact document/marker provenance;
- StructuredModel adapter seam where provider/model identity comes from the transport response;
- orchestration `context → audit start → provider → validation → terminal audit`;
- authenticated interpretation route that is fail-closed unless an explicit Labs interpretation provider is injected;
- bounded audit metadata without raw documents, raw provider payloads or generated finding text.

Mobile completion already merged:

- PR #648 — authenticated repository capability/run boundary;
- PR #653 — fail-closed interpretation state controller.

Active Phase 14 mobile PR #654 composes this foundation into `LabsContext`:

- capability loads alongside Labs documents/markers;
- typed interpretation state is available to Labs consumers;
- unauthenticated refresh clears interpretation state;
- failed capability checks remain unavailable rather than guessing provider readiness;
- execution occurs only when capability is available;
- previous output is retained only for its originating document ID so interpretation state cannot bleed across documents.

User-facing confirmed-result interpretation presentation is not yet claimed as merged source. A future presentation package must consume only confirmed structured data and preserve the same fail-closed provider boundary.

## Safety and integrity contract

These constraints remain authoritative:

- Labs data is private and owner-scoped; it must not become Social-visible.
- Raw extraction output never becomes canonical history automatically.
- The user can correct marker, value, unit and reference interval before confirmation.
- Preserve original source value/unit/reference alongside normalized representation.
- Alias mapping and unit conversion must be deterministic and auditable.
- Unit conversion is limited to reviewed compatible units.
- Source-laboratory reference interval is authoritative for that result's primary display context.
- `in_range`, `borderline`, `out_of_range` and `significantly_out_of_range` are presentation classifications, not diagnoses.
- Generic range excursions are not labelled clinically urgent without a separately reviewed medical rule.
- Panel comparison may describe stored classification movement only when unit/reference context is comparable.
- `toward_reference` / `away_from_reference` are descriptive movement labels, not statements that health improved or worsened.
- Relative-to-reference charts are visualization transforms, not universal clinical normalization.
- Provider output may cite only document/marker identities contained in the exact confirmed context supplied to that run.
- Unknown/malformed provenance fails closed.
- Provider/model audit identity comes from transport metadata, not generated content.
- Raw provider payloads and generated interpretation text are not persisted in the minimum audit table.
- Coach/model access is minimum-context and read-only by default.
- No treatment mutation is authorized by interpretation source completion.

## Current package status

### L12-A — Contract and information architecture
**Merged/source-complete.**

### L12-B — Settings IA
**Merged/source-complete.** Grouped Settings home and child routes preserve existing auth/persistence/sync/privacy contracts.

### L12-C — Labs mobile shell
**Merged/source-complete.** Visible Labs tab, empty state, history/biomarker/trend information architecture and no seeded personal health data.

### L12-D — Backend Labs domain
**Merged/source-complete.** Owner-scoped documents/results/jobs and bounded reads.

### L12-E — Private document ingestion
**Source-complete seam; runtime gated.** Signed/private image upload source exists. PDF mobile picker/native dependency remains gated.

### L12-F — Extraction worker
**Source-complete seam; provider/runtime gated.** Provider-neutral extraction and disabled-safe composition exist.

### L12-G — Biomarker normalization
**Merged/source-complete.** Canonical IDs/aliases, source/canonical units, safe conversion and laboratory reference preservation.

### L12-H — Review and confirmation
**Merged/source-complete.** Extraction remains draft until explicit user review/confirmation.

### L12-I — History and charts
**Merged/source-complete for current product scope.** Includes history windows, bounded multi-marker graphs, relative-to-reference mode and accessibility summaries.

### L12-J — Panel comparison and attention surfaces
**Merged/source-complete for current product scope.** Changed units/reference contexts fail closed to not-comparable.

### L12-K — AI interpretation
**Backend/mobile source foundation substantially complete; Phase 14 composition active.** PR #654 is the current source step. External provider and user-facing activation remain separate.

### L12-L — Coach tools
**Internal source-complete; model exposure gated.** Read-only owner-scoped service exists and is not automatically exposed to a model runtime.

### L12-M — Privacy lifecycle
**Source-complete for current schema.** Private objects require cleanup before account database cascade; export excludes object keys/raw bytes/raw provider payloads/generated interpretation text/processing internals.

### L12-N — QA / Liquid Glass / responsive
**Source/CI substantially complete; physical-device evidence gated.** Safe-area, scrolling, keyboard, Dynamic Type, selection/alert semantics, chart summaries and Reduce Transparency are implemented.

### L12-O — Provider/native/release evidence
**Authorization-gated only.** No source-completion label opens this gate automatically.

## Phase 14 completion focus

Current order:

1. finish exact-head CI and merge Labs context PR #654;
2. after source composition is stable, design/validate a confirmed-result presentation surface without exposing raw OCR or treatment mutation;
3. synchronize canonical roadmap/current-status/handoff from final merged SHAs;
4. define product decision for external interpretation provider, retention/training/region/credential policy;
5. decide model-tool exposure policy for the internal Coach/Labs read service;
6. add PDF mobile picker only after an explicit native dependency gate;
7. collect small-screen/Dynamic Type/VoiceOver/provider/device/release evidence only when those runtime gates are explicitly authorized.

## Provider/native/runtime gates still closed

Without direct authorization, Labs work must not:

- deploy the backend;
- execute production migrations;
- activate object-storage/OCR/model providers;
- add/rotate provider credentials;
- access production Labs data;
- add a PDF native picker dependency;
- publish OTA/EAS;
- build/install a native release on a device;
- submit to an app store.

## Future inventory, not implicit authorization

- personal baseline/usual range after sufficient confirmed history;
- panel presets/checklists;
- timeline annotations such as illness or plan changes;
- correlation overlays with weight/training/nutrition using explicit non-causal language;
- richer Companion/pet progression;
- additional clinical rules or urgent flags only under separately reviewed medical contracts.
