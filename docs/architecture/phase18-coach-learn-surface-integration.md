# Phase 18 Coach → Learn Surface Integration

Updated: 2026-08-19

Status: reviewed P18-G architecture contract. Runtime implementation remains dependency-gated on P18-F recommendation authority and on an existing eligible Coach/report surface with a trustworthy finding identity.

## Decision

P18-G does **not** create a new daily-report scheduler, background job, notification stream or parallel Coach product merely to carry Knowledge recommendations.

Knowledge is an optional augmentation of an already-valid Coach/report surface:

```text
existing reviewed Coach surface
→ already-valid typed finding / recommendation projection
→ optional approved Knowledge attachment
→ canonical article navigation
```

If the Knowledge attachment cannot be produced safely, the underlying Coach surface remains valid and renders without it.

## Current product reality

The current foreground Proactive Coach v1 is a mobile deterministic selector with its own reviewed source window, presentation state and seven-day cooldown. It is not a backend Coach finding authority and it is not a daily-report scheduler.

Therefore:

- `ProactiveInsight.kind` must not be silently reinterpreted as a backend P18-F finding code;
- mobile-computed evidence must not be promoted to server-authoritative recommendation input merely because the semantic labels look similar;
- P18-G must not add a second local content selector that bypasses P18-F publication/learning-state authority;
- a future bridge from local Proactive Coach to Knowledge requires an explicit reviewed provenance/validation contract or a server-derived equivalent finding.

Existing Phase 16 behavior remains unchanged until such a bridge is implemented.

## Eligible host surfaces

A host surface may attach Knowledge only when it already has a reviewed authority for the underlying finding/recommendation context.

Examples may include:

- a future backend-generated daily/periodic Coach report;
- a persisted Coach run result containing a typed reviewed finding;
- another reviewed Coach output with an exact P18-F-compatible finding identity.

A surface is not eligible solely because it contains free-form recommendation text.

The first implementation should consume whichever eligible host already exists when P18-F becomes runtime-ready. Do not manufacture a new report subsystem just to satisfy the roadmap label.

## Attachment contract

The host surface receives a strict versioned Knowledge attachment produced by P18-F, not raw mapping state.

Minimum logical fields:

- recommendation/attachment schema version;
- stable recommendation identity;
- exact article ID;
- exact article-version ID;
- optional concept IDs;
- reviewed reason/finding code suitable for presentation;
- bounded relevance copy when available;
- navigation/presentation metadata already permitted by the canonical reader DTO.

The attachment never contains:

- hidden quiz answer keys;
- raw Labs documents/OCR;
- unrestricted user evidence snapshots;
- provider prompts/payloads;
- editorial review notes;
- mapping administration fields;
- cross-domain mutation instructions.

## Failure isolation

Knowledge is optional context.

If recommendation selection, learning-state lookup, article resolution or optional relevance explanation fails:

- do not fail the underlying Coach report/run/card;
- do not replace the underlying finding with model prose;
- do not fall back to arbitrary article search;
- do not invent a generic lesson;
- render the host without a Knowledge attachment or with an explicit unavailable state only where the product surface needs it.

This preserves Coach reliability when Knowledge is unavailable, offline, stale or intentionally suppressed.

## Frequency and deduplication

P18-G does not invent a second engagement cadence.

The host surface retains its own reviewed presentation policy. P18-F owns Knowledge-specific deterministic deduplication/suppression over exact article/version identities and learning state.

When multiple findings in one host output resolve to the same article/version, render one Knowledge attachment according to the P18-F deterministic winner/tie-break policy.

When a host surface already has a cooldown, Knowledge must not bypass that cooldown by rendering as a separate unsolicited card.

Knowledge-specific delivery history, if persisted, remains private account-owned state and follows the P18-F/P18-E privacy contract.

## Proactive Coach boundary

Existing Proactive Coach v1 must continue to obey:

- at most one foreground insight card;
- its reviewed deterministic evidence thresholds;
- account-scoped local presentation state;
- seven-day cooldown;
- dismissed-key behavior;
- no notification/background delivery;
- no automatic plan mutation.

A future approved Proactive→Learn bridge should normally augment the existing card with one bounded educational affordance such as `Learn why`, rather than create a second competing proactive card.

However that UI is authorized only after the finding provenance bridge is reviewed. Until then, Proactive Coach and P18-F remain separate trust domains.

## Navigation

An accepted attachment navigates by exact canonical article identity/version through the P18-C Knowledge reader boundary.

Do not navigate by mutable title text or infer a replacement article on mobile.

If the exact recommended version is no longer reader-eligible, fail closed according to the canonical reader/recommendation contract. A replacement/newer version must be resolved by backend authority, not by the mobile route.

## Learning-state interaction

Opening the article from a Coach surface does not itself mark the article `read` or `understood`.

P18-E owns learning evidence:

- explicit reviewed completion may produce `read`;
- backend-authoritative quiz evidence may produce `understood`;
- deterministic version-aware policy may produce `refresh_useful`.

Host-surface impression/click telemetry is not learning-state authority.

## Copy and safety

The attachment may explain why reviewed education is relevant to an existing finding. It must remain optional and informational.

Do not frame the article as:

- medically necessary;
- a punishment for poor adherence;
- proof the user's program is broken;
- a guaranteed cause of future progress;
- an obligation required to preserve a streak/reward.

Tier-3/Labs-adjacent education preserves P18-F human-review and structured-evidence boundaries and remains non-diagnostic/non-prescriptive.

## No cross-domain mutation

The host and attachment remain read-only educational presentation unless another already-reviewed Coach proposal flow explicitly offers a separate confirmation action.

Reading, dismissing or completing a quiz does not automatically change workouts, nutrition, goals, Labs, recovery, safety or Social state.

## Daily/periodic report threshold

There is no requirement to create a new daily/periodic report engine as part of P18-G when none is otherwise product-approved.

If a future report feature is separately justified, it should:

1. use existing Coach deterministic/context authority rather than a new monolithic model prompt;
2. produce stable typed findings before Knowledge selection;
3. call the same P18-F selector used by other eligible surfaces;
4. remain useful with zero Knowledge recommendations;
5. define its own cadence, persistence, account ownership, dismissal and delivery contract;
6. not introduce push/background delivery without separate review.

## Implementation gate

P18-G runtime work may begin only when:

1. P18-F mapping/selection is merged and stable;
2. the chosen host surface exposes a trustworthy compatible typed finding identity;
3. P18-C exact-version navigation and P18-E learning-state behavior required by the surface are stable;
4. implementation starts from exact current `main`.

The first runtime package must test:

- host renders unchanged when Knowledge is absent/unavailable;
- only P18-F-approved attachments render;
- exact article/version navigation;
- duplicate article/version collapse;
- host cooldown cannot be bypassed by a Knowledge attachment;
- local Proactive kinds cannot masquerade as backend finding codes;
- learning-state writes are not inferred from impressions/navigation alone;
- Tier-3/Labs boundaries;
- no cross-domain mutation;
- no background/push side effect.

## Non-goals

This contract does not authorize:

- a new daily scheduler solely for Knowledge;
- push notifications or background delivery;
- arbitrary model-selected articles;
- treating mobile Proactive insight kinds as trusted backend findings;
- live scientific article generation;
- gamification;
- diagnosis/prescribing;
- automatic workout/nutrition/goal/Labs mutation;
- provider activation or production rollout.