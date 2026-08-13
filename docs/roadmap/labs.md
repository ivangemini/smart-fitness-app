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
- Latest-two confirmed panel comparison is implemented end-to-end. Comparison describes only movement in stored laboratory-reference classification; changed units, unknown classifications or changed reference intervals are reported as not comparable.
- Labs structured document/draft/result data is included in the dedicated `laboratory_results_and_documents` data-access-export surface; private object keys, raw bytes and processing internals are excluded.
- Account deletion now removes dedicated private Labs objects before database cascade and fails closed if required Labs storage cleanup is unavailable.
- Backend privacy inventory includes the private laboratory data group and its raw-object lifecycle.
- Labs import capabilities remain fail-closed: source code does not activate production storage, worker, OCR provider, deployment, migration execution or native release work.

Next implementation focus:

1. biomarker history windows (3M / 6M / 1Y / All);
2. user-selected multi-marker charting with compatible units/axes;
3. normalized relative-to-reference visualization mode;
4. arbitrary two-panel selection UX beyond latest-two convenience comparison;
5. stronger route-level integration tests where the existing harness supports them;
6. PDF native picker only after an explicit native dependency gate.

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
- AI interpretation consumes structured confirmed data where possible and returns structured, confidence-bearing explanatory output. It must not silently mutate lab facts.
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
- owner-scoped documents, panels, results and processing jobs;
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
- biomarker detail timeline;
- 3M / 6M / 1Y / All windows;
- user-selected multi-marker graphs with compatible axes;
- normalized `relative to reference interval` comparison mode.

### L12-J — Panel comparison and attention surfaces
- compare two panels;
- improved / worsened / stable / new summaries without causal claims;
- attention markers based on stored result classification.

### L12-K — AI interpretation
- structured explanation layer over confirmed data;
- changed-since-last-test summary;
- confidence and provenance;
- no diagnosis or autonomous treatment mutation.

### L12-L — Coach tools
Candidate tool contracts:
- `get_lab_results`
- `get_biomarker_history`
- `get_abnormal_biomarkers`
- `compare_lab_panels`

Coach receives only the minimum structured context required for the request.

### L12-M — Privacy lifecycle
- include Labs structured data in user data export;
- include raw private objects and database rows in account deletion cleanup;
- test cross-user denial and deletion completeness.

### L12-N — QA / Liquid Glass / responsive
- small-screen, Dynamic Island/notch, home-indicator and keyboard reachability;
- reduced-transparency fallback;
- no nested decorative glass;
- accessibility labels and Dynamic Type where applicable.

### L12-O — provider/native/release evidence
Authorization-gated only. This package does not itself authorize OCR/AI provider activation, PDF native dependency rollout, native build/install, backend deployment, production migrations, OTA/EAS publication or production data access.

## Future inventory, not initial implementation

- personal baseline / usual range after enough confirmed history;
- panel checklists and presets;
- timeline annotations such as illness or plan changes;
- correlation overlays with weight/training/nutrition with explicit non-causal language;
- richer Companion/pet progression.
