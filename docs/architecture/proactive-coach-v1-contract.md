# Proactive Coach v1 Contract

Updated: 2026-08-19

This document defines the first reviewed Phase 16 decision boundary. It authorizes a deterministic **insight selector foundation only**. It does not authorize notifications, background delivery, persisted proactive state, model-generated triggers, automatic plan changes, or production rollout.

## Product intent

Proactive Coach may surface at most one concise, evidence-backed observation when a sufficiently meaningful fitness signal exists. It reuses the bounded deterministic facts established in Phase 15 and remains part of the existing Coach/Companion product surface.

The feature is not a streak system, engagement loop, notification firehose, or autonomous trainer.

## Reviewed initial insight kinds

### Strength progress

May surface when a comparable exercise e1RM signal improves by at least 5% across the two halves of a bounded 28-day analysis period and there is sufficient evidence:

- at least 4 matching sessions;
- at least 8 working sets;
- valid comparable estimated-1RM evidence in both halves.

The selector ranks stronger relative improvements first.

### Strength stagnation

May surface only under a more conservative evidence threshold:

- deterministic e1RM trend is `stable` under the shared Phase 15 threshold;
- at least 6 matching sessions;
- at least 12 working sets;
- valid comparable estimated-1RM evidence in both halves.

A stagnation signal is an observed training pattern, not a diagnosis and not proof that a program is wrong.

### Consistency up

May surface only for a positive change in unique active training days across the two halves of the 28-day period:

- previous half has at least 1 active day;
- recent half has at least 4 active days;
- recent half exceeds the previous half by at least 2 unique active days.

Multiple workouts on the same **local calendar day** count as one active day, matching the existing Companion progression day semantics.

**Negative consistency changes are intentionally excluded from v1** to avoid guilt, punishment, streak-loss framing or pressure to train.

## Selection and frequency

- Return at most one insight.
- Priority is strength progress → strength stagnation → positive consistency change.
- A global seven-day presentation cooldown suppresses all insights after one was shown.
- A future or malformed `lastShownAt` fails closed and suppresses presentation rather than risking spam.
- Each insight has a stable evidence-derived key.
- A dismissed key is suppressed while present in the supplied dismissal set.

The selector accepts presentation state as an input. This package does **not** define persistence authority for `lastShownAt` or dismissed keys. Persistence, account/device ownership, retention and synchronization semantics require a separate reviewed package before UI integration relies on them.

## Data and computation boundary

- Source facts are canonical completed workout sessions/sets already available to the app.
- Deterministic shared Phase 15 analytics own comparable e1RM/trend calculations.
- No model call is involved in trigger selection.
- No raw Labs, nutrition, safety notes, Social data, provider payloads or unrestricted `AppState` dump enters this selector.
- Missing or insufficient evidence produces no insight.
- The selector does not mutate workouts, programs, goals, nutrition targets, Labs data or Companion progression.

## Presentation boundary for later packages

A future UI package may render the selected fact in Companion/Home only after separately reviewing:

- localized neutral copy;
- dismissal/snooze interaction;
- persistence ownership and account isolation;
- accessibility and Dynamic Type behavior;
- whether the insight links to the relevant Progress evidence;
- analytics/telemetry privacy, if any;
- no notification/background delivery unless explicitly reviewed.

The presentation must not imply diagnosis, guaranteed causality, failure, punishment, obligation to train, or an automatically applied recommendation.

## Validation

The selector requires pure regression coverage for:

- evidence thresholds;
- one-insight priority;
- local unique-day consistency counting;
- seven-day cooldown;
- dismissed-key suppression;
- no negative-consistency insight;
- invalid timestamp fail-closed behavior.

Runtime/source changes require exact-head Mobile CI before merge.