# Smart Fitness Roadmap Progress

Updated: 2026-08-21

This is the canonical cross-program roadmap index for mobile `ivangemini/smart-fitness-app` and backend `ivangemini/smart-fitness-backend`. Exact source, tests, migrations, CI and Git history override stale prose.

Focused roadmap references:

- `docs/roadmap/release-and-account.md`;
- `docs/roadmap/localization-settings.md`;
- `docs/roadmap/data-quality-and-scale.md`;
- `docs/roadmap/knowledge-learning.md`.

## Verified phase baseline

- **Phases 1–10:** complete for established source/CI scope.
- **Phase 11 — Liquid Glass + Home:** source/CI-complete for the reviewed convergence scope.
- **Phase 12 — Labs + Settings:** provider-neutral source/runtime preparation complete for reviewed contracts; configured-provider/device evidence remains.
- **Phase 13 — Companion v1:** retained. Companion is the user-facing presentation layer of Coach, not a second assistant authority.
- **Phase 14:** ordinary autonomous source/runtime preparation is exhausted for current contracts; external provider/native/physical-device evidence remains.
- **Phase 15 — Coach Intelligence & Data Access + Progress UX/Analytics:** source/CI-complete for the reviewed scope.
- **Phase 16 — Proactive Coach:** deterministic foreground v1 source/CI-complete.
- **Phase 17 — Goals & Planning:** P17-A through P17-D source/CI-complete; richer P17-E remains requirement-gated.
- **Phase 18 — Knowledge & Learning:** **P18-A through P18-H are source/CI-complete and merged for the reviewed scope.**

There is no approved P18-I.

## Current verified checkpoint

### Mobile

Current `main`: `ea080ecb170d8399fe4d534692dc3ed771121174`.

Recent Phase 18 closure path:

- #793 — Knowledge Library and immutable Reader;
- #794 — account-scoped exact-version learning state;
- #795 — reviewed learning paths;
- #797 — optional Coach → Learn mobile consumer.

#797 exact head `3d88b6b4f28349b6c11c5302e865e156b81c17d5` passed Mobile CI #2680 before merge.

### Backend

Current `main`: `a6179aff35093325f0571139d6ced7e3987a2f10`.

Recent Phase 18 closure path:

- #285 — canonical Knowledge persistence/published reader;
- #290 — provider-neutral editorial orchestration;
- #294 — exact-version quiz authority;
- #296 — account-scoped learning state;
- #306 — deterministic Coach → Learn selector;
- #307 — reviewed learning paths;
- #308 — deterministic trusted Coach finding authority;
- #309 — optional Coach run-detail Learn projection host.

#309 exact head `c4b4da92a926141ad3cea5e898c96177e1c2a49d` passed Backend CI #2243 before merge.

## Phase 15 — closure status

P15-A through P15-F remain source/CI-complete for the reviewed scope. Detailed evidence remains in `docs/qa/phase15-closure.md`.

Permanent Phase 15 invariants remain:

- purpose-specific bounded data access;
- deterministic analytics outside model prompts;
- read-only Coach orchestration unless the user explicitly confirms a separately reviewed mutation flow;
- compact Progress progressive disclosure;
- selector-only Progress ↔ Companion handoffs;
- raw Labs documents/unconfirmed drafts outside ordinary Coach context;
- missing evidence remains missing.

## Phase 16 — foreground closure

The reviewed first Proactive Coach product slice remains source/CI-complete.

Completed boundaries include deterministic bounded triggers, evidence-derived deduplication keys, presentation cooldown, account-scoped dismissal memory, one concise authenticated foreground Companion card, neutral localized copy and evidence-specific Progress navigation.

Not included: background/push generation, provider/model-triggered proactive generation, badges/streak-loss mechanics, automatic workout/program/nutrition/goal/Labs/safety mutation or production/device rollout claims.

## Phase 17 — Goals & Planning

### P17-A — canonical authority and typed goal facts

Existing fitness-profile goal fields remain canonical. Deterministic typed goal facts and neutral Progress presentation are established.

**Status:** source/CI-complete.

### P17-B — Goal context handoff

Progress passes only reviewed intent/time context to Companion; canonical facts are rebuilt from state rather than serialized through navigation.

**Status:** source/CI-complete.

### P17-C — Goal-aware Coach questions

Backend purpose-specific goal retrieval and mobile Ask Coach UI remain read-only, bounded and capability-visible.

**Status:** source/CI-complete for the reviewed first scope.

### P17-D — Planning/proposal preview

Flow remains:

`editable goal form → explicit current→proposed preview → guarded canonical apply → applied | stale`

The proposal is ephemeral, source-snapshot guarded and changes only reviewed goal fields. No second goal store or hidden nutrition/program mutation is introduced.

**Status:** source/CI-complete.

### P17-E — richer goal model threshold

**Inactive.** Revisit only when a reviewed product requirement needs semantics the current profile cannot safely express, such as multiple simultaneous independent goals, deadlines/status or lifecycle history.

Do not create a new goal persistence domain solely because P17-D is complete.

## Phase 18 — Knowledge & Learning

Focused architecture: `docs/architecture/phase18-knowledge-learning-system.md`.
Focused roadmap: `docs/roadmap/knowledge-learning.md`.

Canonical content pipeline:

`topic → curated evidence pack → AI-assisted draft → claim/source verification → validated quiz bank → reviewed published article version`

User loop:

`bounded evidence → deterministic trusted Coach finding → reviewed allowlisted article mapping → exact canonical article version → validated quiz → informational learning state`

No Knowledge XP, levels, streaks, badges, leaderboards, punishment or engagement-reward loops are allowed in the reviewed scope.

### P18-A — Knowledge/content/evidence foundation

Canonical stable identities, immutable versions, reviewed evidence linkage, risk/review state, deterministic publication eligibility, relational persistence and authenticated reader authority.

**Status:** merged through backend #285.

### P18-B — Editorial generation pipeline

Provider-neutral evidence-pack → draft → claims → verification → review-ready/rejected workflow. Generator/provider output cannot publish directly.

**Status:** merged through backend #290.

### P18-C — Library and Reader

Mobile category/concept browse, bounded search, strict versioned parsing, immutable article detail and reviewed source visibility.

**Status:** merged through mobile #793.

### P18-D — Quiz authority

Reviewed exact-version quiz banks and backend-only canonical evaluation with hidden answer-key isolation.

**Status:** merged through backend #294.

### P18-E — Learning state

Private account-owned `unseen | read | understood | refresh_useful` state with exact-version semantics, backend quiz authority, deletion/export/privacy and bounded mobile replay.

**Status:** merged through backend #296 and mobile #794.

### P18-F — Coach → Learn deterministic selector

Strict normalized finding and versioned rule contracts, exact canonical article hydration, publication/risk/version checks, learning-state-aware ranking/suppression and deterministic bounded output.

**Status:** merged through backend #306.

### P18-G — Coach/report integration

Trusted finding provenance is merged through backend #308. Optional run-detail Learn projection is merged through backend #309. Strict optional mobile rendering/exact-version navigation is merged through mobile #797.

The production recommendation-rule registry is intentionally empty because no reviewed canonical `findingCode → articleId` mappings exist. Do not invent mappings or placeholder UUIDs. This is an editorial/content activation gate, not unfinished runtime infrastructure.

**Status:** source/CI-complete and merged for reviewed runtime scope; content activation remains separately reviewed.

### P18-H — Curriculum / learning paths

Stable shared path identity, immutable localized versions, exact ordered article-version steps, fail-closed publication rules and mobile navigation with P18-E-derived step decoration.

No duplicate path-progress/mastery authority or gamification.

**Status:** merged through backend #307 and mobile #795.

## Phase 18 closure boundary

P18-A through P18-H are closed for the reviewed source/CI scope.

Do not reopen Phase 18 merely because:

- the reviewed mapping registry is empty;
- provider-generated content is not activated;
- production publication has not occurred;
- device/OTA evidence is not complete.

Those are separate authority/rollout gates.

A new Phase 18 slice requires an explicit reviewed product requirement. There is no current P18-I.

## Remaining Phase 14 gates

- **Push:** configured APNs/FCM provider plus signed physical-device permission/token/delivery/tap evidence and deliberate rollout controls.
- **Labs / Analyses:** configured private storage/model provider plus bounded lifecycle and physical-device picker/accessibility evidence.
- **Stories:** remaining mobile/physical-device runtime evidence.
- **Steps:** signed native/physical-device support, permission, real aggregate-read and local-day/DST/Home evidence.

## Next execution order

1. Keep P18-A through P18-H closed unless a reproduced defect or newly reviewed requirement appears.
2. Do not invent P18-I.
3. If reviewed canonical articles and Coach finding mappings are approved, add only the reviewed mapping/content-activation delta and run exact-version end-to-end validation.
4. Keep P17-E inactive without a richer-goal requirement.
5. Execute remaining Phase 14 provider/native/device evidence independently when external prerequisites are available.
6. Repair reproduced defects; do not manufacture unrelated cleanup work.

## Authorization / release boundary

Source/CI closure does not relax provider, native/device, production, editorial-publication or medical-safety controls. Production deployment, production migrations, OTA/native publication, provider activation, canonical content publication and physical-device validation remain separately authorized/evidenced claims.
