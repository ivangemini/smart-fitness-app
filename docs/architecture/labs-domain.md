# Labs domain contract

## Purpose

Labs is a private longitudinal health-data domain for laboratory documents and biomarkers. It is not part of revisioned private `AppState` sync and must not share Social media authority.

## Source-of-truth model

The backend owns canonical account Labs data. Mobile may hold transient drafts/cache but cannot treat OCR output or a local import draft as confirmed history.

Initial persisted/conceptual entities:

- **LabDocument** — owner, private source object metadata, original filename/media type, acquisition/collection time, processing state and provenance.
- **LabResultDraft** — extracted/reviewable source representation before confirmation.
- **LabResult** — confirmed canonical biomarker ID plus preserved source value/unit/reference representation and deterministic normalized representation where supported.
- **BiomarkerDefinition** — stable ID, display names/aliases, category, compatible units and reviewed conversions.
- **LabProcessingJob** — bounded asynchronous extraction/normalization state.
- **Panel comparison read model** — a derived comparison of two confirmed documents; a separate mutable panel entity is not required by the initial implementation.
- **LabInterpretation** — future derived explanatory artifact with version/provenance/confidence; never source truth for result values.

## Processing state

Document-level lifecycle implemented by the source contract:

`pending_upload → uploaded → processing → review_required → confirmed`

Failure is explicit:

`uploaded|processing → failed`

A failed document can be manually re-queued only through the owner-scoped retry path when processing capability is explicitly available. There is no automatic retry loop in the initial product boundary. A failed job never deletes the private source automatically unless a separately defined retention/cleanup rule applies.

## Draft result contract

Extraction can produce draft fields:

- source marker label;
- parsed value;
- source unit;
- source reference low/high or textual interval;
- marker confidence;
- value confidence;
- unit confidence;
- reference confidence;
- source index/provenance supported by the provider contract.

Draft data is not included in trend calculations as confirmed history. Data-access export may include the account-owned reviewed/extracted draft rows, but raw provider payloads and raw source bytes are not part of the structured export surface.

## Confirmation contract

The user review step explicitly accepts, corrects or excludes extracted fields. Confirmation writes canonical LabResult facts only when at least one included row remains safely normalized, while retaining:

- final reviewed source value and unit;
- source laboratory interval/text where represented by the schema;
- canonical biomarker ID;
- normalized value/unit only when conversion is deterministic and supported;
- collection and confirmation/provenance state.

Reprocessing a document must not silently overwrite a previously confirmed result.

## Reference intervals and classifications

Reference intervals are result-specific. Display classification is derived against the stored source interval when numeric comparison is valid.

Allowed initial semantic states:

- `unknown`
- `in_range`
- `borderline`
- `out_of_range`
- `significantly_out_of_range`

These are attention/presentation states, not clinical diagnoses. No `urgent` state is authorized by this contract.

Panel comparison is deliberately narrower than health interpretation. Classification movement is comparable only when the marker/unit and stored laboratory reference interval are compatible between the two confirmed results. Unit changes, unknown classification, or changed reference boundaries yield `not_comparable`; the comparison must not state that the user's health improved or worsened.

Relative-to-reference trend mode is a visualization transform for results with a valid two-sided laboratory interval. It maps the lower reference bound to 0% and the upper bound to 100%; values may plot outside that band. This is not a universal clinical normalization score and does not replace the underlying absolute result.

## History and chart read models

Only confirmed results feed longitudinal charts.

- Single-marker history supports 3M / 6M / 1Y / All windows.
- Windows are anchored to the latest confirmed result rather than wall-clock `today`, preserving usefulness for archival histories.
- Multi-marker absolute charts require compatible units/axis semantics.
- Multi-marker relative-to-reference charts require a valid two-sided source-laboratory interval for each plotted point.
- Missing/incompatible results are not silently coerced into a shared axis.

## Private object storage

Reuse the backend's `PrivateObjectStorageProvider` boundary rather than introducing a second object-storage engine.

Requirements:

- owner-scoped private object keys under the dedicated Labs namespace;
- short-lived signed upload/read operations only when needed;
- no public object URL persisted as product data;
- declared media type/size plus authoritative server-side validation;
- bounded upload TTL and stale-upload cleanup;
- object deletion coordinated with account deletion before database cascade can orphan the key.

The existing Social upload service is an implementation pattern, not a domain to reuse directly: Labs has its own schemas/repository/service and does not inherit Social visibility or moderation semantics.

## Extraction / AI provider boundary

Use provider-neutral interfaces, including:

- `LabDocumentExtractionProvider`
- `LabInterpretationProvider`

Safe default when provider configuration is absent is `disabled/unavailable`; never silently fall back to fabricated data.

Provider input should be minimized. Interpretation should consume confirmed structured values where possible rather than the raw document. Provider activation requires separate review of retention/training/logging/data-region behavior and explicit credentials/runtime authorization.

The deterministic extraction provider/composition seam is suitable for tests and development composition; its existence does not authorize a production OCR/model provider.

## Worker semantics

Document processing is asynchronous. HTTP upload completion must not remain open for OCR/LLM work.

Jobs need:

- stable job ID;
- owner/document ID;
- operation kind;
- bounded attempts;
- status and timestamps;
- provider/version provenance;
- sanitized error code, not raw health content in logs;
- idempotent claiming/completion behavior.

## Coach boundary

Coach may receive owner-authorized structured summaries through narrow read-only tools. It must not get unrestricted raw-object access.

Implemented internal tool contracts/service:

- `get_lab_results`
- `get_biomarker_history`
- `get_abnormal_biomarkers`
- `compare_lab_panels`

The service is owner-scoped and bounded. Output contains confirmed structured facts required by the tool contract and excludes private object keys, source draft IDs and raw documents. These internal contracts are not automatically exposed to an LLM/provider runtime; model-tool exposure, minimum-context selection and audit/provenance require a separate integration decision.

## Privacy lifecycle

Labs participates in:

- the structured account data-access export through a dedicated laboratory surface;
- account deletion database cleanup;
- mandatory private Labs object cleanup before database account deletion.

The structured export may contain account-owned document metadata, review drafts and confirmed results. It excludes raw private document bytes, storage object keys and processing-job/provider internals.

Source-level cross-owner protections and cleanup services exist, but release completion still requires the appropriate integration/runtime evidence; database cascade alone cannot prove external object deletion.

## Mobile accessibility and responsive contract

Labs screens use safe-area-aware scroll containers and dynamic bottom/top inset clearance rather than fixed key-element positioning. Review forms are keyboard-aware. Selection controls expose checked/selected semantics, and actionable failures should use alert semantics. Broader Dynamic Type, reduced-transparency and physical-device evidence remains a QA requirement rather than an assumption.

## Logging

Never log raw document bytes, full OCR text, biomarker values, medical free text, signed URLs or provider prompts/responses containing health data in routine logs. Operational logs use IDs, state transitions, durations and sanitized error codes.
