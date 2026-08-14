# Stories S10 runtime evidence matrix

Updated: 2026-08-14

Status: source contract merged; runtime evidence collection remains authorization-gated under Phase 14.

This matrix is the canonical checklist for Stories S10 runtime completion. A scenario is complete only when its required environment was actually exercised. Source tests and CI do not substitute for physical-device or deployed-environment evidence.

## Evidence levels

- **Source/CI** — deterministic automated contract evidence in the repository.
- **Backend runtime** — API + migrated database behavior in an authorized non-destructive environment.
- **Physical device** — standalone/development native app on a real supported device.
- **Second device/account** — cross-device or actor/owner behavior with independent authenticated clients.

## Backend runtime

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Apply S10 migration chain to a clean supported PostgreSQL database | migration succeeds and schema matches source contract | pending runtime evidence |
| Re-apply migration validation path | idempotency/forward-safe validation remains green | pending runtime evidence |
| Legacy Story create without `audience` | accepted as `following` | pending runtime evidence |
| Story create with `following` | owner sees created Story; eligible follower can read | pending runtime evidence |
| Story create with `close_friends` | only eligible Close Friends followers can read | pending runtime evidence |
| Close Friends add without follow edge | rejected | pending runtime evidence |
| Unfollow cleanup | membership removed and does not resurrect on re-follow | pending runtime evidence |
| Block cleanup | membership/read authority removed in both required directions | pending runtime evidence |
| Owner viewer list | only owner can enumerate authoritative views | pending runtime evidence |
| Reply idempotency | replay of same key/body creates one reply | pending runtime evidence |
| Reply changed-body replay | rejected | pending runtime evidence |
| Reply after expiry/delete/access loss | rejected without stale persistence | pending runtime evidence |
| Story expiry | leaves active feed and enters owner Archive lifecycle | pending runtime evidence |
| Highlight membership | expired archived Story can be managed without becoming active again | pending runtime evidence |
| Account deletion | S10 data follows reviewed cascade/export/privacy contract | pending runtime evidence |

## Physical-device authoring and viewing

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Direct camera capture | still image reaches existing Story pipeline | pending physical-device evidence |
| Library picker | selected image reaches existing Story pipeline | pending physical-device evidence |
| Upload/finalize | progress completes and Story becomes readable | pending physical-device evidence |
| Interrupted upload + app restart | recoverable draft resumes or fails with explicit bounded recovery | pending physical-device evidence |
| Caption + overlay | visible after publish without clipping on supported device size | pending physical-device evidence |
| Following audience selector | selected audience persists through publish | pending physical-device evidence |
| Close Friends audience selector | selected audience persists through publish | pending physical-device evidence |
| Viewer list | owner can open; non-owner has no identity-list surface | pending physical-device evidence |
| Reply send/retry | response-loss retry does not duplicate the reply | pending physical-device evidence |
| Archive | expired owned Story is reachable only from owner Archive | pending physical-device evidence |
| Highlight add/remove/order | owner actions persist across screen reload | pending physical-device evidence |
| Push preference while provider unavailable | UI does not imply real delivery | pending physical-device evidence |

## Cross-device / privacy

| Scenario | Required evidence | Status |
| --- | --- | --- |
| Owner device A + follower device B | publish/read/viewer state converges | pending second-device evidence |
| Close Friends add/remove | visibility changes converge without app restart ambiguity | pending second-device evidence |
| Unfollow/block after Story publication | already-published Story access is revoked by current authority | pending second-device evidence |
| Reply received by owner | in-app notification center reflects one bounded event | pending second-device evidence |
| Like/reaction privacy | identity lists remain unavailable outside reviewed owner-viewer surface | pending second-device evidence |

## Regression rules

- Fix only reproduced defects discovered by this matrix; do not reopen S10 scope during runtime QA.
- Preserve chronological Following ordering.
- Do not activate external push as part of Stories evidence collection; real push delivery is a separate provider/native package.
- Do not treat Expo Go as native camera/push/health release evidence.
- Do not mark a row complete from source inspection alone when its evidence level requires runtime or physical hardware.

## Completion rule

Stories S10 may be called runtime-complete only when all required rows have concrete evidence references or an explicitly accepted platform/environment exclusion. Production rollout remains a separate controlled action.
