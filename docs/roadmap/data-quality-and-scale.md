# Data, quality and scale roadmap

Updated: 2026-08-15

Status: **core source architecture is established; remaining work is mainly physical-device/multi-device evidence, privacy-gated analytics, and bounded future scale decisions triggered by measurements.**

This file is an active focused roadmap, not an implementation log. Use `../implementation-plan.md` for cross-repository sequencing and `../current-status.md` for the current checkpoint. Exact source/tests/Git history override stale prose.

## Synchronization quality

Current source contracts include:

- visible localized Data & Sync status/retry/conflict surfaces;
- revisioned ownership-safe synchronization across the currently supported private fitness entities;
- durable mutation/outbox recovery and idempotent replay;
- explicit tombstones and persisted conflicts;
- authenticated backend conflict-resolution API;
- deterministic stale-revision/replay/concurrency coverage;
- privacy-safe support diagnostics without user payload content;
- account/anonymous isolation for synchronized Nutrition library state.

Remaining evidence/work:

1. physical-device offline edit → termination → restart → reconnect → eventual-sync evidence;
2. matching standalone second-device conflict/reconciliation matrix;
3. repair only reproduced restart/reconciliation defects rather than redesigning the sync model speculatively.

Do not add destructive conflict controls that bypass backend ownership/revision/idempotency/audit rules.

## Local storage and performance

The measurement phase is **complete**. The current reviewed decision is to retain the single AsyncStorage-backed private `AppState` snapshot.

Canonical evidence:

- `../architecture/local-state-performance-decision.md`;
- `../architecture/persistence-measurement-results.md`;
- privacy-safe support diagnostics already present in the app.

Current reviewed budgets include representative/stress serialized-size gates, and measured CPU/repository restore costs remain inside the accepted source thresholds. Completed workout history and food-entry history are the dominant growth domains.

Reopen storage architecture only when the criteria in `local-state-performance-decision.md` are actually observed, for example repeated supported-device snapshots above the reviewed size trigger, repeated load/save duration trigger, size-correlated failures, or a product requirement that truly needs indexed/partial loading or archival.

Do **not** start SQLite/domain partitioning merely because the project or source files are large.

## Visual regression and release-device matrix

Source CI already covers TypeScript, regression tests, expanded sync-model smoke, Expo export and Expo Doctor on ordinary mobile PRs.

Remaining release evidence:

- smallest/standard/large iPhones and representative Android sizes;
- Light/Dark, EN/RU, large text, keyboard-open, loading/empty/error/offline states;
- Safe Area, Dynamic Island/notch, Home Indicator and floating navigation clearance;
- primary-tab and critical-child-flow screenshots;
- standalone launch without Metro;
- force-close recovery and local-data preservation;
- authorized camera/barcode/native-permission checks;
- OTA/native rollback evidence only when those release gates are explicitly opened.

Use `../architecture/responsive-mobile-ui.md` as the layout contract.

## Coach history and trust

Backend/mobile source already provides ownership-safe bounded Coach history, immutable run details, source/provenance/trust metadata and explicit confirmation boundaries without exposing raw context snapshots or hidden reasoning.

A future user-facing compensating revert must use a new backend-owned revisioned mutation contract. Do not rewrite immutable Coach history or invent a client-only rollback.

## Privacy-safe product analytics

Still blocked until an explicit privacy/product contract is approved.

Required before implementation:

- minimal event taxonomy tied to a concrete product question;
- explicit consent/withdrawal/settings behavior where required;
- analytics identity separated from auth credentials;
- retention/deletion/account-deletion rules;
- schema/version ownership;
- hard prohibition on sending private fitness/Labs content, email, auth tokens, raw record IDs or free text unless separately reviewed and strictly necessary.

Do not add an analytics SDK merely for generic usage tracking.

## Social, Labs and provider-backed domains

Social/Stories and Labs are **not deferred product areas** anymore. They are approved server-authoritative domains with their own privacy/provider/runtime gates.

- Social/Stories current work is tracked through the active Phase 14 roadmap and focused QA matrices.
- Labs current work is tracked in `labs.md` and the backend canonical baseline.
- provider/native/deployment completion must not be inferred from source CI.

Do not move these domains back into a generic deferred bucket just because external activation is still gated.

## Future scale triggers

Consider new scale architecture only from measured pressure or a reviewed product requirement. Likely candidates, if the gate ever reopens:

- bounded history retention/archival before a full persistence rewrite;
- completed workout history partitioning;
- consumed-food history partitioning;
- indexed local querying only for proven UX/performance needs;
- server pagination/index changes backed by query evidence;
- cache policies with explicit freshness and ownership semantics.

Any migration requires versioning, restart recovery, mixed-app-version behavior and rollback planning before implementation.

## Deferred scope

Do not begin without explicit reprioritization/review:

- trainer marketplace and paid coaching;
- subscriptions/payments;
- user-to-user chat/DMs/groups;
- broad new autonomous AI product areas;
- public exposure of private body, nutrition, Labs or Coach data;
- broad redesigns or storage rewrites without a demonstrated product/performance reason.

Pharmacology, medication dosing, hormone/SARM protocols, diagnosis and emergency-triage inference remain outside the approved Labs/Coach contracts unless separately reviewed.
