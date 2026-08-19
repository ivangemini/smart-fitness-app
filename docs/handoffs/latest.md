# Latest Handoff

Updated: 2026-08-19

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `e086f6795b0ea5f07ad00c3d03283759a1889780` (#777).

Phase 15 remains source/CI-complete for its reviewed Coach Intelligence + Progress scope. Phase 16 foreground v1 is source/CI-complete through #770–#772.

Phase 17 is active:

- #773 — canonical fitness-profile goal authority, deterministic typed goal facts and neutral Progress Goals context;
- #776 — selector-only Goals → Companion handoff with canonical fact rebuilding at the destination;
- #777 — authenticated read-only Ask Coach UI, strict response parsing, capability-aware availability and mobile Coach capabilities compatibility through v13.

#777 passed exact-head Mobile CI including line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified `main`: `eebca930893f3b2a5bcc4e2293873695d1bbb3c6` (#271).

The reviewed read-only question path now consists of:

- #266 minimal-scope structured router;
- #267 minimized evidence + strict structured answer boundary;
- #269 authenticated `POST /v1/coach/questions` composition;
- #270 confirmed structured Labs overview/marker-history evidence;
- #271 dedicated bounded `goal_progress` scope and capabilities v13.

#271 passed exact-head Backend CI including lint, Prettier, build, production-configuration validation, isolated staging topology validation and full tests.

## Contracts to preserve

- Coach and Companion are one product surface, not separate assistants.
- Deterministic calculations and hard guardrails stay outside model prompts.
- Model-visible retrieval is purpose-specific, user-scoped and bounded.
- Navigation handoffs carry selectors/anchors, never raw private state or prebuilt broad analytics.
- Generic Ask Coach sends question text only; backend routing determines the minimum approved user-data scope before retrieval.
- Goal-only backend evidence uses the existing fitness profile, bounded weight history and recent completed sessions; it does not read food logs/workout sets or expose notes/session payloads.
- Backend goal training-day evidence v1 is UTC-day-bucketed; do not claim local-calendar parity until server-side timezone authority exists.
- Proactive foreground presentation remains frequency-capped, dismissible and non-punitive.
- Automatic mutation of programs, workouts, nutrition targets, goals and Labs data remains prohibited outside separately reviewed explicit confirmation flows.
- Labs drafts/raw documents stay outside ordinary Coach question context.
- Missing RPE, nutrition, recovery, body, goal and Labs evidence stays missing rather than being inferred.

Source/CI closure is not provider, signed-device, rollout or production-model evidence.

## Phase 17 authority

Goals & Planning continues from the fields already owned by the fitness profile:

- `goalType`;
- `targetWeight`;
- `weeklyWeightChangeGoal`;
- `trainingDaysPerWeek`.

The existing Profile goals editor remains the canonical mutation surface through `updateProfileGoals`, with the existing explicit confirmation around related nutrition-target recalculation.

Do not add a second persisted goal source merely for goal-aware Progress/Coach/planning behavior. A new persisted entity requires a reviewed need that the current authority cannot represent and must define ownership, migration, sync/revision, conflict and deletion semantics first.

## Next execution order

1. Treat the reviewed P17-A/B/C slices as source/CI-complete through mobile #777 and backend #271.
2. Start P17-D as a planning/proposal **preview** contract over current goal authority: proposals remain non-canonical until explicit confirmation and must define stale-source handling before mutation.
3. Keep Phase 15 and reviewed Phase 16 foreground v1 closed unless a reproduced defect or newly reviewed purpose warrants expansion.
4. Execute remaining Phase 14 external evidence when prerequisites are available: Labs configured-provider/device, Push provider/device, Steps signed-device and remaining Stories mobile/device evidence.
5. Repair reproduced defects before inventing unrelated cleanup work.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.
