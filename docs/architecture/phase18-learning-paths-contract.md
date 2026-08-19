# Phase 18 Learning Paths / Curriculum Contract

Updated: 2026-08-19

Status: reviewed P18-H architecture contract. Runtime implementation remains downstream of stable canonical Knowledge reading, quiz and learning-state boundaries.

## Decision

Learning paths are **reviewed curriculum/navigation**, not a second learning-state system and not gamified progression.

The v1 authority chain is:

```text
reviewed curriculum definition
→ immutable path version
→ ordered exact canonical article-version steps
→ publication eligibility check
→ mobile navigation
→ existing P18-E informational learning state
```

A path may recommend an order. It does not lock later lessons, award progress currency, punish skipped steps or create a separate mastery truth.

## Shared curriculum authority

Canonical path definitions are shared backend-authoritative content, alongside canonical Knowledge articles.

Conceptual entities:

- `KnowledgePath` — stable curriculum identity such as `training_fundamentals`;
- `KnowledgePathVersion` — immutable reviewed curriculum version;
- `KnowledgePathStep` — ordered reference from one path version to one exact canonical article version plus optional reviewed step metadata.

Do not store private user evidence, quiz attempts, account IDs or learning history in shared path records.

Path editorial mutation/publication remains an admin/editorial authority, not a mobile or model authority.

## Why exact article versions

A published path version references exact `articleVersionId` identities rather than only mutable slugs/titles or a floating “latest” pointer.

This preserves:

- reproducible curriculum meaning;
- exact source/claim/quiz evidence boundaries;
- compatibility with P18-E exact-version learning state;
- deterministic review when an article materially changes.

If a material article update should replace a curriculum step, review and publish a new path version. Do not silently rewrite an already-published path version.

## Path publication eligibility

A path version is reader-eligible only when:

1. the path version itself is reviewed/approved;
2. every required step references an existing exact article version;
3. every referenced article version is currently publication-eligible under P18-A/P18-C authority;
4. step order is valid, unique and bounded;
5. referenced locale/content requirements can be satisfied;
6. Tier-3/medical-adjacent material retains the required human-review boundary;
7. no step points to editorial-only, withdrawn, rejected or otherwise non-reader content.

Fail closed when any required step cannot be validated. Do not silently replace an unavailable step with arbitrary search/model-selected content.

## Sequence semantics

Step order communicates a reviewed recommended sequence, not access control.

Users may:

- open any visible step;
- revisit earlier steps;
- skip ahead;
- leave and return later;
- consume the same article outside the path.

Do not require `read` or `understood` before opening the next step.

Do not introduce locked lessons, lives, streak preservation, rank, XP, levels, badges or penalties.

## Learning-state reuse

P18-H does not persist a duplicate `pathProgress` or `completedStepIds` authority when the same fact is derivable from P18-E exact-version evidence.

For each path step, presentation derives state from the referenced exact article version:

- no positive evidence → `unseen`;
- reviewed completion evidence → `read`;
- reviewed quiz evidence → `understood`;
- deterministic revisit signal → `refresh_useful`.

A path summary may count or group those informational states for navigation, but the count is not a score/reward and must not become a separate canonical completion record.

If a future product requirement needs account-owned path enrollment, preferences or resume-position state, that requires an explicit minimal ownership/privacy contract. It must not redefine article learning truth.

## New path versions

Publishing a new path version does not rewrite historical article learning evidence.

When the new path references:

- the same exact article version, existing P18-E state remains applicable;
- a newer article version, the newer exact version starts under normal P18-E semantics rather than inheriting `understood` from the old version;
- reordered existing exact versions, their individual learning states remain unchanged.

The UI may explain that a curriculum was updated, but must not portray a new path version as lost progress or punishment.

## Initial curriculum direction

Reviewed examples from the roadmap may include:

- Training fundamentals;
- Nutrition fundamentals;
- Build your first program;
- Fat-loss fundamentals;
- Muscle-gain fundamentals;
- Recovery fundamentals;
- Understanding Labs.

These names are product directions, not authorization to publish unreviewed content. Each actual path requires a reviewed canonical step set.

## Path metadata

A strict versioned end-user projection may include:

- stable path ID;
- exact path-version ID/version;
- localized title/summary;
- optional reviewed audience/prerequisite guidance that is informational only;
- bounded ordered steps;
- each step's exact article ID/article-version ID;
- step title/summary/presentation metadata already allowed by P18-C;
- optional concept IDs;
- derived account learning state when requested through the appropriate private boundary.

Do not expose:

- hidden quiz answer keys;
- editorial review notes;
- provider metadata/prompts;
- source allowlist internals;
- raw private evidence;
- arbitrary path-edit authority.

## Personalization boundary

Canonical curriculum order is reviewed shared content. A model does not rewrite canonical step order per user.

Later personalization may:

- recommend which approved path is relevant through a reviewed deterministic mapping;
- explain why a path may be useful;
- suggest a resume point based on existing P18-E state.

It may not fabricate steps, insert unpublished articles, skip safety/review boundaries or mutate canonical path definitions.

Any Coach→Path recommendation follows the same deterministic/fail-closed principles as P18-F.

## Labs / medical-adjacent curriculum

An `Understanding Labs` path remains educational only.

Its shared curriculum must reference human-reviewed eligible Tier-3 content where applicable. Private raw Labs documents/OCR/provider payloads do not enter canonical path records.

A user's private Labs evidence may later motivate a reviewed educational recommendation through an approved Coach boundary, but it does not rewrite the curriculum or create diagnosis/prescribing authority.

## Mobile experience

The first mobile surface should be ordinary Knowledge navigation:

- path list/detail;
- ordered step list;
- exact-version article navigation through P18-C;
- informational P18-E state per step;
- optional previous/next navigation that never locks content.

Do not create a separate “game” shell or duplicated article renderer.

Offline behavior should reuse canonical Knowledge caching/reader semantics. Cached path metadata must never become publication authority for content that the backend has withdrawn; stale handling must follow the same explicit offline contract as the reader.

## Privacy and deletion

Shared path definitions are service-shared canonical content and are not deleted when one account is deleted.

Any user-specific state shown inside a path is sourced from P18-E account-owned learning data and follows its deletion/export/account-switch rules.

Do not infer or persist sensitive interests merely because a path was viewed unless a separately reviewed product need requires minimal private history.

## Failure behavior

A malformed/unpublished path or invalid required step fails closed.

Knowledge remains usable outside paths if curriculum loading fails. Path failure must not make the standalone Library/article reader unavailable.

If private learning state cannot load, an otherwise valid path may render without account progress decoration when that behavior is safe and clearly non-authoritative; it must not fabricate completion.

## Implementation gate

P18-H runtime work may begin only after:

1. P18-A/P18-C exact article/version reader identity is merged/stable;
2. P18-D quiz identity/evaluation is stable where `understood` is displayed;
3. P18-E learning-state authority is merged/stable;
4. the implementation branch starts from exact current backend/mobile `main`.

The first runtime package must cover:

- immutable path-version identity;
- exact article-version step linkage;
- duplicate/invalid/unpublished step fail-closed behavior;
- Tier-3 review preservation;
- free navigation without mastery locks;
- derived P18-E state without duplicate path-progress authority;
- new-path-version behavior;
- account isolation for any private projection;
- no model publication/reordering authority;
- no gamification;
- no cross-domain mutation.

## Non-goals

This contract does not authorize:

- XP, levels, streaks, badges, leaderboards, ranks or reward currency;
- locked lessons based on quiz performance;
- duplicate path completion truth;
- arbitrary model-personalized canonical curricula;
- live unreviewed scientific content;
- public learning history;
- diagnosis/prescribing;
- automatic workout/nutrition/goal/Labs mutation;
- provider activation or production rollout.