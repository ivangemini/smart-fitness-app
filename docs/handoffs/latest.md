# Latest Handoff

Updated: 2026-08-20

Exact source, tests, migrations, CI and Git history override prose if this handoff becomes stale.

## Repository checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

- current `main`: `3a99b017b679da295207e4a8e4d1506681368023` (#793);
- P18-C Library/article reader is merged;
- active P18-E PR: #794, branch `codex/phase18-learning-state-mobile-2026-08-20`;
- #794 remains cleanly ahead of current mobile `main` and must pass Mobile CI on its final exact head before source readiness.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

- current `main`: `d705457ae36147bb65f110266da2dbceb880cc98` (#295);
- P18-A persistence/published reader merged through #285;
- P18-B editorial orchestration merged through #290;
- P18-D hardened quiz authority merged through #294;
- active P18-E PR: #296, branch `codex/phase18-learning-state-v2-2026-08-20`;
- #296 remains cleanly ahead of current backend `main` and requires exact-head Backend CI, Backend PostgreSQL CI and Account Deletion Receipt CI.

## P18-E backend package

Backend #296 provides:

- dedicated account-owned exact-version Knowledge learning evidence;
- authenticated list/get/read/quiz-evaluate routes scoped from the authenticated account;
- durable `read`/`understood` evidence and deterministic `refresh_useful` when a newer publication-eligible version exists;
- exact stable `articleId + locale` current-version resolution, avoiding correctness dependence on a global top-N library scan;
- complete canonical quiz-bank evaluation on the backend with no hidden answer-key exposure;
- replay-safe read evidence and monotonic understood evidence;
- fail-closed stale/unavailable content writes;
- account deletion cascade without deletion of shared Knowledge content;
- subject-access Knowledge learning export schema v2 preserving historical exact-version evidence plus current state/refresh metadata;
- same repeatable-read snapshot for export evidence and current-state derivation;
- privacy inventory and PostgreSQL migration/replay/deletion coverage.

A TypeScript nullable eligible-bank closure bug and stale export-contract gaps were repaired before merge readiness. Regression coverage also verifies exact-ID refresh resolution rather than a global published scan.

## P18-E mobile package

Mobile #794 provides:

- strict `knowledge-learning-state-v1` contracts/parsers;
- authenticated exact-version list/get/read/quiz evaluation through the existing token/refresh stack;
- tokenless account-partitioned AsyncStorage cache outside private fitness `AppState`;
- bounded pending-read retry queue with duplicate compaction and no optimistic canonical completion;
- server-only quiz scoring;
- explicit read completion and reviewed quiz feedback in the article Reader;
- `userId + articleVersionId` guards preventing stale in-flight results from mutating a newly selected account/article view;
- account-bound access-token/refresh checks so stale Knowledge API instances cannot rotate or reuse another account's session;
- quiz interaction only after server-confirmed read evidence for the exact currently available version; queued read transport never unlocks quiz authority;
- Knowledge cache/pending-read storage included in the existing recovery-safe confirmed account-deletion cleanup path;
- EN/RU user-facing copy and focused auth/queue/parser/policy/deletion regression coverage.

## P18-E invariants

- backend owns canonical durable learning state and quiz correctness;
- mobile never stores or infers hidden canonical answer keys;
- pending read transport is not canonical `read`/`understood` state;
- quiz attempts are not generically queued or scored offline;
- exact article-version identity is preserved;
- account switch cannot display/deliver another account's learning activity;
- confirmed account deletion clears the local private Knowledge partition;
- learning state remains outside revisioned private fitness sync;
- no Knowledge gamification;
- reading/quiz completion never mutates workouts, nutrition, goals, Labs, recovery or safety.

## CI and merge boundary

Backend #296 required exact-head gates are still the source-merge authority. Mobile #794 likewise requires a final exact-head Mobile CI after its lifecycle/race fixes.

Do not bypass those gates.

A separate operational constraint now matters: the backend repository is connected to the Vercel `peptonio-admin` project, and live deployment history shows that backend `main` pushes can create `target: production` deployments while PR branches create previews. Therefore backend source readiness does not automatically authorize merging when production activation is outside the active authorization boundary.

Do not change Vercel Git/deployment settings merely to bypass that boundary without a separately reviewed operational action.

## After P18-E is merged/stable

### P18-F first runtime package

Start from exact current backend `main`. Keep the first package deterministic/provider-neutral and independent of a host surface:

- strict versioned finding/mapping/recommendation contracts;
- caller-supplied trusted typed finding identities rather than free-form/model labels;
- versioned active/deprecated allowlisted mapping rules targeting stable `articleId`;
- exact `articleId + locale` hydration through the canonical Knowledge repository;
- re-run publication eligibility, including Tier-3 human-review requirements;
- deterministic ranking, tie-break and exact-version dedupe;
- P18-E suppression/revisit semantics (`understood` suppress, `read` deprioritize, historical `refresh_useful` permit the newer exact version);
- explicit frequency/cooldown policy and delivery-history input rather than hidden magic timing;
- unknown/deprecated/incompatible/model-invented finding identities fail closed;
- no model selection authority, DB table, route or cross-domain mutation in the first selector package unless later source evidence requires one.

Do not integrate this into P18-G until a trustworthy backend finding identity exists. Current mobile Proactive Coach insight kinds are presentation identities, not silently trusted backend finding codes.

### P18-H independent downstream package

P18-H may proceed after stable P18-E without waiting for P18-G because its reviewed dependency chain is reader + quiz + learning state.

First backend path package should use shared immutable curriculum identities and exact article-version steps. A published path version is eligible only if every required exact step still matches the currently publication-eligible candidate for its stable article identity/locale. A material article update therefore makes an old path version fail closed until a newly reviewed path version is published; do not silently rewrite immutable curriculum.

P18-H must reuse P18-E state for step decoration and must not create duplicate `pathProgress`/mastery truth, content locks or gamification.

## Remaining independent external evidence

Phase 14 configured-provider/native/device evidence remains separate:

- Labs configured provider + physical device;
- Push provider + physical device;
- Steps signed native/physical device;
- Stories remaining mobile/physical-device evidence.

No source/CI result implies production deployment, production migration execution, provider activation, canonical content publication or device validation.
