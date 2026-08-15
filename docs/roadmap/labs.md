# Labs roadmap

Updated: 2026-08-15

Status: **Phase 12 source foundation, Phase 14 provider-neutral interpretation composition and the internal confirmed-structured-facts-only Labs → Coach/model exposure policy are source-complete; provider/native/runtime activation remains gated.**

This focused roadmap defines the Labs / Analyses product boundary. `docs/implementation-plan.md` remains the canonical forward roadmap. Exact code, tests and Git history override stale prose. Detailed backend source behavior lives in backend `docs/project-context.md` rather than being copied here.

## Product goal

Turn private laboratory documents into a reviewable longitudinal biomarker history. Data integrity is more important than automation: extraction/OCR/model output is draft data until the user verifies it, and interpretation uses confirmed structured facts rather than raw document text.

## Merged source baseline

Backend Phase 12 PR #230 and mobile Labs/Settings PR #644 established the owner-private document, review, confirmation, history, trends, comparison, privacy and provider-neutral processing foundation.

Phase 14 mobile source subsequently merged:

- #648 — authenticated interpretation repository/capability boundary;
- #653 — fail-closed interpretation state controller;
- #654 — interpretation capability/state composition through `LabsContext` with stale async run protection;
- #657 — confirmed-result interpretation presentation.

Backend #241 subsequently hardens the private/provider boundary:

- public storage-unavailable errors no longer expose object-storage/provider diagnostics;
- Labs → Coach/model tool schemas are strict rather than silently stripping unknown fields;
- the explicit policy is `confirmed_structured_facts_only`;
- raw document bytes, OCR/full extracted text and provider payloads are prohibited at that boundary;
- treatment mutation remains prohibited;
- regression tests reject private/raw extras at the tool contract.

The latest merged backend source checkpoint is `2b73f34e168d7a6a1dd4087df1a1992e44137d54` (#241). Mobile documentation-only merges may advance `main` without changing the latest runtime/source behavior.

## Current source-complete interpretation path

Backend provides:

- confirmed-data minimum-context builder;
- bounded previous-panel comparison facts;
- strict per-panel context limits;
- descriptive movement codes without health-outcome claims;
- bounded structured findings with confidence/provenance;
- provider-neutral StructuredModel adapter seam;
- orchestration and minimum-metadata audit trail;
- authenticated fail-closed interpretation route unless an explicit Labs provider is injected;
- a read-only Labs tool/service contract whose allowed model-facing shape is confirmed structured facts only.

Mobile provides:

- authenticated capability/run repository;
- typed interpretation state controller;
- `LabsContext` composition;
- request-generation invalidation so stale async runs cannot overwrite a newer document/reset/logout state;
- execution only for the selected confirmed document through the reviewed boundary;
- confirmed-result presentation of bounded `reference_context`, `trend_context` and `data_quality_context` findings;
- provider/model provenance display without raw provider payload exposure;
- EN/RU informational copy that separates context from diagnosis or treatment instructions;
- fail-closed behavior that preserves confirmed source data when interpretation is unavailable or fails.

This source completion does **not** imply that a production OCR/model/storage provider is configured or active, or that ordinary Coach/Companion runtime is automatically allowed to invoke Labs tools.

## Safety and integrity contract

These constraints remain authoritative:

- Labs data is private and owner-scoped; it must not become Social-visible.
- Raw extraction output never becomes canonical history automatically.
- The user can correct marker, value, unit and reference interval before confirmation.
- Preserve original source value/unit/reference alongside normalized representation.
- Alias mapping and unit conversion must be deterministic and auditable.
- Source-laboratory reference interval is authoritative for that result's primary display context.
- `in_range`, `borderline`, `out_of_range` and `significantly_out_of_range` are presentation classifications, not diagnoses.
- Generic range excursions are not labelled clinically urgent without a separately reviewed medical rule.
- `toward_reference` / `away_from_reference` describe stored movement only and do not claim health improved or worsened.
- Provider output may cite only identities present in the exact confirmed context supplied to that run.
- Unknown/malformed provenance fails closed.
- Provider/model audit identity comes from transport metadata, not generated content.
- Raw provider payloads and generated interpretation text are not persisted in the minimum audit table.
- Labs → Coach/model access is minimum-context, confirmed-structured-facts-only and read-only by default.
- Raw uploaded documents, object keys/signed URLs, OCR/full extracted text, unreviewed drafts and provider payloads are prohibited model/tool inputs.
- Unknown fields at the model/tool contract are rejected rather than silently stripped.
- No treatment mutation is authorized by interpretation or internal tool source completion.

## Package status

### L12-A through L12-J

**Merged/source-complete for the reviewed scope.** This includes product/Settings IA, mobile shell, backend domain, provider-neutral ingestion seam, extraction seam, deterministic normalization, review/confirmation, history/charts, panel comparison and attention surfaces.

### L12-K — AI interpretation

**Provider-neutral source-complete through mobile #657.** Backend orchestration, mobile repository/state/context and confirmed-result presentation are merged. Production model-provider activation remains separate.

### L12-L — Coach tools

**Internal service + exposure policy source-complete; ordinary runtime wiring gated.** The owner-scoped read-only service exists and backend #241 fixes the allowed model/tool shape to confirmed structured facts only. Ordinary Coach/Companion runtime must not gain access merely because that contract exists; wiring/capability authorization remains a separate reviewed decision.

### L12-M — Privacy lifecycle

**Source-complete for current schema.** Private objects require cleanup before account database cascade; export excludes object keys/raw bytes/raw provider payloads/generated interpretation text/processing internals.

### L12-N — QA / Liquid Glass / responsive

**Source/CI substantially complete; physical-device evidence gated.** Safe-area, scrolling, keyboard, Dynamic Type, accessibility semantics, chart summaries and Reduce Transparency are implemented.

### L12-O — Provider/native/release evidence

**Authorization-gated only.** No source-completion label opens this gate automatically.

## Remaining Labs roadmap

There is no currently identified missing provider-neutral interpretation or model-exposure-policy source layer after backend #241.

Remaining work is:

1. choose/review production private object storage, OCR/extraction and interpretation provider(s);
2. define provider retention/training/region/credential policy;
3. configure provider/runtime only under explicit authorization;
4. deploy backend changes and execute production migrations only under explicit authorization;
5. separately review and authorize any ordinary Coach/Companion runtime wiring to the already-bounded read-only Labs tools;
6. add a mobile PDF picker only after explicit native dependency review;
7. collect small-screen, Dynamic Type, VoiceOver, provider failure, physical-device and release evidence;
8. fix only reproduced product/runtime defects instead of reopening already-complete source layers.

## Provider/native/runtime gates still closed

Without direct authorization, Labs work must not:

- deploy the backend;
- execute production migrations;
- activate object-storage/OCR/model providers;
- add/rotate provider credentials;
- access production Labs data;
- wire Labs tools into ordinary Coach/Companion model runtime;
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
