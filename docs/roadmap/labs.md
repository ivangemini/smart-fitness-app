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
- A minimum-context interpretation builder exists for confirmed structured facts only. It selects the nearest previous confirmed panel, includes comparison facts and explicitly forbids raw-document inclusion or treatment mutation.
- Interpretation context is fail-closed at 200 confirmed results per current/previous panel; a 201st sentinel result rejects the request instead of expanding provider context.
- A deterministic changed-since-last summary maps panel changes to neutral `toward_reference`, `away_from_reference`, `stable`, `new` and `not_comparable` codes without health-outcome or causal claims.
- A structured interpretation output contract validates runtime shape, confidence, bounded finding counts/lengths and exact document/marker provenance against the confirmed input context.
- A `StructuredModelClient` adapter seam exists, but provider/model provenance is taken from the transport response rather than model-generated fields.
- An interpretation orchestrator now performs context build → audit start → provider execution → output/provenance validation → terminal audit success/failure.
- The authenticated interpretation route is fail-closed by default and exists only when an explicit `labInterpretationProvider` dependency is supplied; the normal Coach model client does not activate it implicitly.
- Interpretation audit persistence stores only bounded run metadata (versions, provider/model IDs, counts, latency/token usage and terminal error code), not raw documents, raw provider payloads or generated finding text.
- Labs structured document/draft/result data plus bounded interpretation-run metadata are included in the dedicated `laboratory_results_and_documents` data-access-export surface; private object keys, raw bytes, provider payloads and processing internals are excluded.
- Account deletion removes dedicated private Labs objects before database cascade and fails closed if required Labs storage cleanup is unavailable; interpretation audit rows cascade with the account-owned Labs graph.
- Backend privacy inventory and operational-retention registry include the private laboratory data/object lifecycle. Private Labs source objects are an explicit account-scoped cleanup surface.
- New Labs selection/review surfaces use safe-area-aware scroll layouts; shared buttons expose selected accessibility state, comparison/trend selectors expose selection semantics, and load/review/trend errors use alert semantics.
- The primary Labs tab now explicitly consumes the top safe-area inset and delegates bottom clearance to the floating-tab layout helper.
- Canvas trend charts expose localized assistive-technology summaries instead of being visual-only. Comparison rows, biomarker/document cards and trend legends wrap for Dynamic Type rather than truncating important labels.
- Liquid Glass surfaces respect the iOS Reduce Transparency setting by disabling blur while retaining their non-blur surface fallback.
- Labs import and interpretation capabilities remain fail-closed: source code does not activate production storage, worker, OCR provider, interpretation provider, deployment, migration execution or native release work.

Validation status:

- Unit/contract tests have been authored for normalization, classification, review, processing, storage, comparison, interpretation context/output/orchestration/provider adapter, changed-since-last summary, history windows, multi-marker normalization, privacy export and Coach/Labs read tools.
- PostgreSQL integration coverage exercises repository owner isolation, Labs HTTP owner/capability boundaries, retry lifecycle semantics and interpretation audit persistence when `DATABASE_URL` is available.
- HTTP interpretation coverage verifies disabled-provider `503`, successful confirmed-owner execution/audit and cross-owner rejection before provider execution.
- Privacy/account-deletion registry coverage requires the private Labs object surface through the existing cross-surface plan test, while the technical inventory must cover the interpretation audit table exactly once.
- Mobile source-contract tests enforce scrolling/flex-grow layouts, no fixed primary layout heights/absolute positioning, explicit safe-area handling, Dynamic Type wrapping on comparison rows and Reduce Transparency behavior at the Liquid Glass primitive boundary.
- A fresh exact-head CI/native/device run is still required before this source state may be described as a green release baseline.

Next implementation focus:

1. exact-head typecheck/test/schema-migration CI and repair of any resulting regressions;
2. physical small-screen/Dynamic Type/VoiceOver device evidence when native validation is authorized;
3. explicit product decision for when/how user-facing interpretation is surfaced; external provider remains disabled until retention/training/region/credential review is authorized;
4. model-tool exposure policy for the implemented Coach/Labs read service; no automatic tool exposure in this phase;
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
- Deterministic changed-since-last output is descriptive metadata only; `toward_reference` and `away_from_reference` are not statements that health improved or worsened.
- Provider interpretation output must cite only document/marker identities that exist in the exact confirmed context supplied to that run. Unknown or malformed provenance fails closed.
- Provider/model audit identity comes from the transport adapter, not from generated model fields.
- Generated interpretation text and raw provider payloads are not persisted in the minimum audit table.
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
- normalized `relative to reference interval` visualization mode for valid two-sided intervals;
- localized non-clinical accessibility summaries for Canvas charts.

### L12-J — Panel comparison and attention surfaces
Implemented source scope:
- latest-two convenience comparison and arbitrary two-panel selection;
- classification-improved / classification-worsened / stable / new / not-comparable summaries without causal or health-outcome claims;
- attention markers based on stored result classification;
- changed reference ranges fail closed to not-comparable.

### L12-K — AI interpretation
Implemented source foundation:
- owner-scoped minimum-context builder over confirmed structured facts only;
- nearest previous confirmed panel selection and deterministic comparison facts;
- hard 200-result-per-panel context bound;
- deterministic changed-since-last structured summary;
- runtime-validated bounded provider output with confidence and document/marker provenance;
- explicit StructuredModel adapter seam using transport-owned provider/model provenance;
- orchestration with terminal success/failure audit metadata;
- explicit fail-closed authenticated route that requires an injected Labs interpretation provider;
- data-access export and account-deletion coverage for bounded audit metadata;
- explicit guardrails: no diagnosis inference from classification, no health-outcome claim from comparison, no raw source document, no treatment mutation.

Still gated:
- external provider selection/credentials/retention/training/region authorization;
- automatic production runtime composition;
- user-facing explanatory interpretation UI/product activation.

### L12-L — Coach tools
Implemented internal read-only contracts/service:
- `get_lab_results`
- `get_biomarker_history`
- `get_abnormal_biomarkers`
- `compare_lab_panels`

The service is owner-scoped and bounded, returns confirmed structured facts only, and is not automatically wired into the model/provider runtime. Coach must receive only the minimum structured context required for the request.

### L12-M — Privacy lifecycle
Implemented source scope:
- Labs structured data and bounded interpretation audit metadata included in the user data export surface;
- raw private Labs objects cleaned before database account deletion;
- Labs database rows cascade with account deletion;
- privacy inventory documents the laboratory domain and interpretation-run metadata;
- operational-retention registry treats private Labs source documents as an explicit account-scoped cleanup surface;
- export excludes object keys, raw bytes, generated interpretation text, raw provider payloads and processing internals.

Further exact-head integration evidence remains required for release-level completion.

### L12-N — QA / Liquid Glass / responsive
Source-complete audit scope:
- safe-area-aware scrolling and home-indicator clearance on Labs routes;
- keyboard-aware review form behavior;
- selected/checked accessibility state on time-window, panel and trend selectors;
- alert semantics for load/review/trend/comparison failures;
- chart accessibility summaries for visual-only Skia surfaces;
- correction form labels and wrapping behavior for smaller/Dynamic Type layouts;
- comparison, biomarker/document card and chart-legend wrapping for large text;
- iOS Reduce Transparency disables Liquid Glass blur through the shared primitive;
- PostgreSQL repository/HTTP/audit owner-isolation coverage;
- no fixed absolute positioning introduced by the Labs screens.

Still requires physical device-size/VoiceOver evidence and exact-head CI.

### L12-O — provider/native/release evidence
Authorization-gated only. This package does not itself authorize OCR/AI provider activation, PDF native dependency rollout, native build/install, backend deployment, production migrations, OTA/EAS publication or production data access.

## Future inventory, not initial implementation

- personal baseline / usual range after enough confirmed history;
- panel checklists and presets;
- timeline annotations such as illness or plan changes;
- correlation overlays with weight/training/nutrition with explicit non-causal language;
- richer Companion/pet progression.
