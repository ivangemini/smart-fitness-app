# Phase 12 — Labs roadmap

Status: approved product direction; implementation in progress.

This focused roadmap defines the Labs / Analyses product boundary. `docs/implementation-plan.md` remains the canonical forward roadmap and should be synchronized after the currently open Stories S10 documentation branch lands, to avoid parallel edits to shared canonical files.

## Implementation snapshot — 2026-08-13

Completed in the current isolated Phase 12 branches:

- Labs replaces Coach as the fifth primary tab; Coach remains a hidden route with a small global Companion entry.
- Settings root is grouped and child-route based; Account/security is separated from Profile/personal data.
- Labs server-authoritative mobile state is isolated from legacy local `AppState` sync.
- Labs document states are modeled as `pending_upload → uploaded → processing → review_required → confirmed`, with explicit `failed` handling.
- Private object namespace `private/labs/v1/` and signed upload source boundary exist.
- Image upload client path is implemented for JPEG/PNG/HEIC, but is capability-gated and remains disabled until both private Labs storage and processing worker runtime are activated.
- PDF remains contract-supported on the backend but has no mobile picker/native dependency yet.
- Provider-neutral extraction contracts, confidence/provenance handling, deterministic normalization and laboratory-reference classification exist.
- A deterministic extraction provider and fail-closed processing composition seam exist for test/development integration without production provider activation.
- Review UI supports accept, exclude and manual correction; canonical history is written only after confirmation.
- Empty extraction and all-excluded confirmation are rejected.
- Failed extraction can be manually re-queued only by the document owner and only when processing is explicitly available; no automatic retry loop is enabled.
- Confirmed marker read models, attention surfaces and marker history charts are implemented.
- Biomarker history supports 3M / 6M / 1Y / All windows anchored to the latest confirmed result so archival data does not disappear merely because it is old.
- Multi-marker trends support up to three selected biomarkers. Absolute mode is restricted to compatible units; relative-to-reference mode is dimensionless and requires a valid two-sided laboratory reference interval per plotted result.
- Latest-two and arbitrary two-panel comparison are implemented end-to-end. Comparison describes only movement in stored laboratory-reference classification; changed units, unknown classifications or changed reference intervals are reported as not comparable.
- Internal read-only Coach/Labs contracts and a bounded owner-scoped service exist for `get_lab_results`, `get_biomarker_history`, `get_abnormal_biomarkers` and `compare_lab_panels`. They are not automatically exposed to a model/provider runtime.
- Labs structured document/draft/result data is included in the dedicated `laboratory_results_and_documents` data-access-export surface; private object keys, raw bytes and processing internals are excluded.
- Account deletion removes dedicated private Labs objects before database cascade and fails closed if required Labs storage cleanup is unavailable.
- Backend privacy inventory includes the private laboratory data group and its raw-object lifecycle.
- New Labs selection/review surfaces use safe-area-aware scroll layouts; shared buttons expose selected accessibility state, comparison/trend selectors expose selection semantics, and review errors use alert semantics.
- Labs import capabilities remain fail-closed: source code does not activate production storage, worker, OCR provider, deployment, migration execution or native release work.

Validation status:

- Unit/contract tests have been authored for normalization, classification, review, processing, storage, comparison, history windows, multi-marker normalization, privacy export and Coach/Labs read tools.
- The current implementation pass has not produced a fresh local/native test run or device runtime evidence; source completion must not be described as a green release baseline yet.

Next implementation focus:

1. stronger HTTP/repository integration coverage for Labs ownership, capability gating and comparison boundaries where the existing PostgreSQL test harness supports it;
2. remaining Dynamic Type/reduced-transparency/small-screen audit across Labs cards and charts;
3. structured AI interpretation contract over confirmed facts, without provider activation or autonomous treatment mutation;
4. explicit model-tool exposure policy for the implemented Coach/Labs read service, including minimum-context selection and audit/provenance;
5. PDF native picker only after an explicit native dependency gate;
6. native/device/release evidence only under the existing authorization gates.

## Product goal

Turn laboratory documents into a private, reviewable longitudinal biomarker history. The product must prioritize data integrity over automation: OCR/AI output is a draft until the user verifies it.

## Navigation

Primary tabs target:

**Home → Workouts → Nutrition → Progress → Labs**

Coach remains available as a hidden route and is intended to move toward a small global companion entry. Companion progression, XP, streaks, cosmetics and pet mechanics are explicitly out of scope for the initial Phase 12 packages.

## Safety and integrity contract

- Labs are private, owner-scoped health data.
- No uploaded document or derived result may be public or Social-visible.
- Raw OCR/vision output never becomes canonical history automatically.
- Imported results enter a review state; the user can correct marker, value, unit and reference interval before confirmation.
- Preserve the laboratory's original value, unit and reference interval alongside any normalized representation.
- Biomarker aliases map to stable canonical IDs; normalization must be deterministic and auditable.
- Unit conversion occurs only for reviewed compatible units and retains the source representation.
- A laboratory-specific reference interval is authoritative for display of that result. A knowledge-base interval may provide secondary context only.
- `in_range`, `borderline`, `out_of_range` and `significantly_out_of_range` are presentation classifications, not diagnoses.
- No generic range excursion is labelled clinically urgent. Any future urgent rule requires a separately reviewed medical rule with required context.
- Panel comparison may describe category movement only when units and the applicable laboratory reference interval are comparable; it must not label the user's health as improved or worsened.
- Relative-to-reference charts are visualization transforms, not universal clinical normalization. They require a valid two-sided source-laboratory interval and preserve access to the underlying absolute result.
- AI interpretation consumes structured confirmed data where possible and returns structured, confidence-bearing explanatory output. It must not silently mutate lab facts.
- Coach/model access is minimum-context and read-only by default; raw Labs object access is not part of the Coach contract.
- Provider activation, credentials, production migration/deployment and native runtime evidence remain separately gated.

## Planned packages

### L12-A — Contract and information architecture
- focused Labs roadmap and domain contract;
- Settings information architecture contract;
- navigation target and Companion non-goals.

### L12-B — Settings IA
- compact grouped Settings home;
- child screens for profile/account, appearance, language, units, data/sync, privacy, about and developer diagnostics;
- preserve existing persistence, auth, sync and privacy behavior.

### L12-C — Labs mobile shell
- visible Labs primary tab;
- empty state with no seeded personal data;
- Add Results entry;
- history/biomarker/trend information architecture;
- existing Coach route remains reachable but is no longer a primary tab.

### L12-D — Backend Labs domain
- owner-scoped documents, results and processing jobs;
- immutable source metadata and explicit result confirmation state;
- idempotent mutations and bounded reads.

### L12-E — Private document ingestion
- signed/private upload flow using the existing private object-storage boundary;
- image input first on the already-installed mobile stack;
- PDF import requires a reviewed native dependency/runtime gate before activation;
- source file validation, size/type limits and cleanup.

### L12-F — Extraction worker
- provider-neutral document extraction interface;
- disabled safe default when provider configuration is absent;
- asynchronous processing state machine;
- per-field confidence and explicit failure/needs-review outcomes.

### L12-G — Biomarker normalization
- canonical biomarker registry and aliases;
- source + canonical units;
- safe conversion registry;
- laboratory reference interval preservation.

### L12-H — Review and confirmation
- review detected markers before durable confirmation;
- low-confidence fields visibly require verification;
- edits are attributable to the user confirmation step.

### L12-I — History and charts
Implemented source scope:
- biomarker detail timeline;
- 3M / 6M / 1Y / All windows;
- user-selected multi-marker graphs with compatible absolute axes;
- normalized `relative to reference interval` visualization mode for valid two-sided intervals.

### L12-J — Panel comparison and attention surfaces
Implemented source scope:
- latest-two convenience comparison and arbitrary two-panel selection;
- classification-improved / classification-worsened / stable / new / not-comparable summaries without causal or health-outcome claims;
- attention markers based on stored result classification;
- changed reference ranges fail closed to not-comparable.

### L12-K — AI interpretation
Pending beyond provider-neutral base contracts:
- structured explanation layer over confirmed data;
- changed-since-last-test summary;
- confidence and provenance;
- no diagnosis or autonomous treatment mutation.

### L12-L — Coach tools
Implemented internal read-only contracts/service:
- `get_lab_results`
- `get_biomarker_history`
- `get_abnormal_biomarkers`
- `compare_lab_panels`

The service is owner-scoped and bounded, returns confirmed structured facts only, and is not automatically wired into the model/provider runtime. Coach must receive only the minimum structured context required for the request.

### L12-M — Privacy lifecycle
Implemented source scope:
- Labs structured data included in the user data export surface;
- raw private Labs objects cleaned before database account deletion;
- Labs database rows cascade with account deletion;
- privacy inventory documents the laboratory domain;
- export excludes object keys, raw bytes and processing internals.

Further integration evidence remains required for release-level completion.

### L12-N — QA / Liquid Glass / responsive
In progress:
- safe-area-aware scrolling and home-indicator clearance on Labs routes;
- keyboard-aware review form behavior;
- selected/checked accessibility state on time-window, panel and trend selectors;
- alert semantics for review/trend failures;
- no fixed absolute positioning introduced by the Labs screens.

Still requires broader Dynamic Type, reduced-transparency and device-size evidence.

### L12-O — provider/native/release evidence
Authorization-gated only. This package does not itself authorize OCR/AI provider activation, PDF native dependency rollout, native build/install, backend deployment, production migrations, OTA/EAS publication or production data access.

## Future inventory, not initial implementation

- personal baseline / usual range after enough confirmed history;
- panel checklists and presets;
- timeline annotations such as illness or plan changes;
- correlation overlays with weight/training/nutrition with explicit non-causal language;
- richer Companion/pet progression.
