# Exercise & Training Intelligence Expansion

Updated: 2026-08-23

This is an approved unnumbered expansion package after the reviewed Phase 19/21 foundations. It does **not** create P21-F or Phase 22. Existing exercise identity, completed-history immutability, workout-session semantics, Coach authority, privacy and synchronization boundaries remain authoritative.

## Execution sequence

1. Exercise Preferences + Smart Replace.
2. Exercise Intelligence 2.0.
3. Training Coverage.
4. Training Intelligence Loop.

Exercise Preferences and active-session Smart Replace are delivered through #816/#818/#819/#820. Exact template replacement identity and deterministic prescription remapping are established by #824. Template/program replacement UI remains a separate explicit action surface; no automatic replacement is authorized.

## Exercise Intelligence 2.0

Objective: make an exercise detail answer how recent performance changed without creating a second analytics authority or assigning unsupported meaning to ordinary variation.

Reviewed contract:

- exact canonical exercise ID remains the history join authority;
- only completed stored sets are eligible evidence;
- `warmup` sets are excluded from exercise progress calculations and trend series;
- working/backoff/drop/amrap evidence may contribute when it is stored as completed exercise evidence;
- per-session summaries are deterministic: volume, best load, best reps, estimated 1RM, actual-RPE average when recorded, and one deterministic top set;
- latest-versus-previous comparison is derived only from the two most recent eligible sessions;
- load, estimated-1RM and volume trends use at most the six most recent eligible sessions and are displayed chronologically;
- missing previous-session or actual-RPE evidence stays explicitly unknown rather than inferred;
- percentage deltas are descriptive arithmetic only and must not be labelled automatically as improvement, regression, readiness or recovery;
- estimated 1RM remains an estimate from the existing calculation authority, not a tested max;
- no new persistence, backend endpoint, sync schema, provider/model call or hidden workout mutation is introduced.

## Training Coverage — next slice

Objective: show what the user has actually trained over an explicit recent window, using existing canonical muscle and reviewed movement-pattern authorities.

Contract to implement:

- derive only from completed, non-warm-up workout evidence;
- reuse the canonical muscle taxonomy; do not create a parallel body-part taxonomy;
- reuse reviewed `exercise-intelligence-v1` movement patterns by exact canonical exercise ID;
- unknown/custom/remote-only identities fail closed for movement-pattern coverage unless a reviewed mapping exists;
- support explicit recent windows such as 7 and 30 days rather than a timeless score;
- present muscle exposure and movement-pattern counts/volume as evidence, not as an "optimality", readiness or recovery score;
- expose evidence drill-down to contributing exercises/sessions where practical;
- no automatic program edits from a coverage gap.

## Training Intelligence Loop — after Coverage

Objective: turn existing deterministic exercise/training findings and coverage into one compact periodic review.

Contract direction:

- summarize completed versus planned training only where a canonical plan exists;
- surface material PR/performance direction, muscle exposure/gaps and reviewed movement-pattern coverage;
- suppress low-value repetition and keep missing evidence unknown;
- every finding must retain deterministic evidence and drill-down;
- Coach may explain deterministic findings but does not become their calculation authority;
- any future plan adjustment remains a proposal requiring explicit user action;
- no universal readiness score and no silent workout/program mutation.

## Smart Replace template boundary

#824 removes the prior identity/prescription-remapping blocker at the template editing primitive: source and replacement IDs are explicit, replacement metadata resolves by exact catalog ID, and prescription identity is remapped while preserving the existing prescription fields.

This does not authorize automatic template replacement. A user-facing template/program Smart Replace flow must still preserve explicit confirmation, collision/fail-closed behavior, sync consequences and the ability to inspect the proposed replacement before applying it.
