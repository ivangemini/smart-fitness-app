# Phase 13 — Companion roadmap

Status: source implementation active.

## Goal

Turn the existing global Coach entry into a lightweight Companion that feels persistent and personal without creating a second fitness-data authority. Phase 13 v1 is deterministic and provider-free.

## C13-A — Companion shell

- keep Companion reachable from the floating global entry above the primary tab bar;
- keep the route outside the five primary tabs;
- preserve all existing Coach, Safety and Profile actions;
- use the existing Liquid Glass system and safe-area-aware scrolling.

## C13-B — Deterministic progression

- source: canonical completed workout sessions already present in `WorkoutState`;
- one active local calendar day grants 100 XP regardless of how many sessions were completed that day;
- 500 XP advances one level;
- show total XP, level and seven-day active-day rhythm;
- no separately persisted XP ledger is required because progress is derived from canonical history;
- malformed timestamps do not create progress.

## C13-C — Non-punitive state

Companion mood is presentation-only:

- `starting` when there is no completed history;
- `steady` when history exists but fewer than three of the last seven days were active;
- `active` when at least three of the last seven days were active.

Do not use guilt, streak-loss, punishment, decay, food restriction, weight loss, medical testing or repeated same-day training as progression incentives.

## C13-D — Accessibility and localization

- progress exposes progress-bar semantics and a numeric accessibility value;
- Companion copy is available in English and Russian;
- important labels wrap rather than truncate;
- the screen retains Safe Area handling and scrollability.

## C13-E — Architecture boundary

Phase 13 v1 does not require:

- a backend migration;
- a new synchronization entity;
- an AI/provider call;
- a new native dependency;
- a second Coach orchestration path.

Future naming, cosmetics, unlock selection, richer pet animation, conversational personality or server-synced Companion state require a separately reviewed state/privacy contract. Model-backed behavior must reuse backend provider isolation and cannot receive unrestricted raw Labs documents.

## Validation

Runtime/source changes require exact-head Mobile CI including line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Physical-device animation/VoiceOver evidence remains separately authorization-gated.
