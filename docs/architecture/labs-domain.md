# Labs domain contract

## Purpose

Labs is a private longitudinal health-data domain for laboratory documents and biomarkers. It is not part of revisioned private `AppState` sync and must not share Social media authority.

## Source-of-truth model

The backend owns canonical account Labs data. Mobile may hold transient drafts/cache but cannot treat OCR output or a local import draft as confirmed history.

Recommended conceptual entities:

- **LabDocument** — owner, source object, original filename/media type, acquisition time, processing state, provenance.
- **LabPanel** — one dated laboratory event/report, laboratory/source metadata, optional fasting context, confirmed/review state.
- **LabResult** — canonical biomarker ID plus immutable source representation and optional normalized representation.
- **BiomarkerDefinition** — stable ID, display names/aliases, category, compatible units and reviewed conversions.
- **LabProcessingJob** — bounded asynchronous extraction/normalization/interpretation state.
- **LabInterpretation** — derived explanatory artifact with version/provenance/confidence; never source truth for result values.

## Processing state

Document-level lifecycle:

`uploaded → processing → needs_review → ready`

Failure is explicit:

`uploaded|processing → failed`

A failed job never deletes the private source automatically unless a separately defined retention/cleanup rule applies.

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
- page/source coordinates or other provenance when supported.

Draft data is not included in trend calculations as confirmed history.

## Confirmation contract

The user review step explicitly confirms or edits extracted fields. Confirmation creates/updates canonical LabResult facts while retaining:

- original extracted/source text where permitted;
- final user-confirmed source value and unit;
- source laboratory interval;
- canonical biomarker ID;
- normalized value/unit only when conversion is deterministic and supported;
- confirmation timestamp and processing/provenance version.

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

## Private object storage

Reuse the backend's `PrivateObjectStorageProvider` boundary rather than introducing a second object-storage engine.

Requirements:

- owner-scoped private object keys;
- short-lived signed upload/read operations only when needed;
- no public object URL persisted as product data;
- declared media type/size plus authoritative server-side validation;
- bounded upload TTL and stale-upload cleanup;
- object deletion coordinated with document deletion/account deletion.

The existing Social upload service is an implementation pattern, not a domain to reuse directly: Labs must have its own schemas/repository/service and must not inherit Social visibility or moderation semantics.

## Extraction / AI provider boundary

Use provider-neutral interfaces, for example:

- `LabDocumentExtractionProvider`
- `LabInterpretationProvider`

Safe default when provider configuration is absent is `disabled/unavailable`; never silently fall back to fabricated data.

Provider input should be minimized. Interpretation should consume confirmed structured values where possible rather than the raw document. Provider activation requires separate review of retention/training/logging/data-region behavior and explicit credentials/runtime authorization.

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

Coach may receive owner-authorized structured summaries through narrow tools. It must not get unrestricted raw-object access. Initial candidate read tools are defined in `docs/roadmap/labs.md`.

## Privacy lifecycle

Labs must be included in:

- account data access/export;
- account deletion database cleanup;
- private object cleanup/deletion receipts where the backend contract requires them.

Tests must prove cross-user document/result access denial and deletion completeness before product/release completion can be claimed.

## Logging

Never log raw document bytes, full OCR text, biomarker values, medical free text, signed URLs or provider prompts/responses containing health data in routine logs. Operational logs use IDs, state transitions, durations and sanitized error codes.
