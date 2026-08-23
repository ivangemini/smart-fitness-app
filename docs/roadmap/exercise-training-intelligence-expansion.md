# Exercise & Training Intelligence Expansion

Updated: 2026-08-23

This is a completed reviewed unnumbered expansion after the Phase 19/21 foundations. It does **not** create P21-F or Phase 22. Existing exercise identity, completed-history immutability, workout-session semantics, Coach authority, privacy and synchronization boundaries remain authoritative.

## Execution sequence — delivered

1. Exercise Preferences + Smart Replace active-session scope — delivered through #816/#818/#819/#820.
2. Exact custom-template replacement identity/prescription remapping primitive — delivered by #824.
3. Exercise Intelligence 2.0 — delivered by #825.
4. Training Coverage — delivered by #826.
5. Training Intelligence Loop — delivered by #828.

The reviewed Exercise & Training Intelligence expansion is source/CI-complete. User-facing custom-template Smart Replace is a separate explicit package over #824; no automatic replacement is authorized.

## Exercise Intelligence 2.0 — delivered

Objective: make exercise detail answer how recent performance changed without creating a second analytics authority or assigning unsupported meaning to ordinary variation.

Reviewed contract:

- exact canonical exercise ID remains history join authority;
- only completed stored sets are eligible evidence;
- warm-ups are excluded from exercise progress calculations/trend series;
- working/backoff/drop/amrap evidence may contribute when stored as completed exercise evidence;
- per-session summaries are deterministic: volume, best load, best reps, estimated 1RM, actual-RPE average when recorded and one deterministic top set;
- latest-versus-previous comparison uses only the two most recent eligible sessions;
- load, estimated-1RM and volume trends use bounded recent eligible sessions;
- missing previous-session/RPE evidence stays unknown;
- percentage deltas remain descriptive arithmetic rather than automatic improvement/regression/readiness labels;
- no new persistence, backend endpoint, sync schema, provider/model call or hidden workout mutation.

## Training Coverage — delivered

Objective: show what the user actually trained over explicit recent windows using existing canonical muscle and movement-pattern authorities.

Delivered contract:

- derives only from completed, non-warm-up workout evidence;
- reuses canonical muscle taxonomy;
- reuses reviewed `exercise-intelligence-v1` movement patterns by exact canonical exercise ID;
- unknown/custom/remote-only identities fail closed unless a reviewed mapping exists;
- supports explicit 7/30/90-day windows;
- presents sets/volume/session counts as evidence, not an optimality/readiness/recovery score;
- exposes contributing exercises/session counts for drill-down;
- introduces no persistence, backend/sync schema, provider/model call or automatic program edit.

Delivery evidence:

- implementation #826;
- exact PR head passed Mobile CI #2864 including line audits, agent integrity, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor;
- merged as `96606bbd4ada9545eec6532f338cc5ab687b2ed7`.

## Training Intelligence Loop — delivered

Objective: turn existing deterministic findings and Coverage into one compact periodic review foundation.

Delivered contract:

- completed-versus-planned comparison uses exact `TrainingProgramDay.workoutTemplateId` → `WorkoutSession.workoutId` identity only;
- name-only planned days fail closed and are shown as partial plan evidence;
- review composes existing deterministic findings and Training Coverage rather than persisting a second analytics authority;
- meaningful findings are bounded and repeated scopes suppressed deterministically;
- Coach is not calculation authority;
- no universal readiness score and no silent workout/program mutation.

Delivery evidence:

- implementation #828;
- exact PR head `518a9c2f796ffa01d34a39fad14c9612f984c141` passed Mobile CI #2867 including TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor;
- merged as `19abbd3af5e755be40ee9f3158ef71b957d71d7c`.

## Smart Replace template boundary after #824

#824 removed the earlier low-level identity/prescription-remapping blocker:

- source/replacement IDs are explicit;
- replacement metadata resolves by exact catalog ID;
- template exercise identity is replaced deterministically;
- `Workout.prescription` exercise identity is remapped while existing prescription fields and unrelated workout metadata are preserved.

This primitive does not authorize automatic replacement. The next user-facing custom-template Smart Replace package must still provide preview, explicit confirmation, stale/collision fail-closed behavior and reuse existing persistence/sync authority.

See `docs/roadmap/exercise-preferences-smart-replace.md`.

## Downstream packages

The Adaptive Program + Recovery Engine that originally followed this expansion is now complete through #829–#832 and closed by #833.

The current forward queue is owned by `docs/roadmap/next-product-expansions.md`:

1. custom-template Smart Replace UI;
2. Weekly Training Review;
3. Progress Stories / Share Cards;
4. Trainer / Coach collaboration;
5. Apple Health / Apple Watch expansion.
