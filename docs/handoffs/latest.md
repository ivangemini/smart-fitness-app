# Latest Handoff

Updated: 2026-08-19

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `bf302de39c1190f736f17c731f0d2fac2f41e569` (#768).

The reviewed Phase 15 mobile sequence established bounded Coach capabilities/selective retrieval (#749–#751), compact Progress IA and drill-downs (#755–#764), then selector-only Progress → Companion handoffs for exercise, Weight, Measurements, Activity and Highlights (#760, #762, #766, #767, #768).

#768 passed exact-head Mobile CI and closes the current P15-E handoff set. Its Highlights boundary filters source sessions to the 90-day Coach window before analytics; longer-history all-time record evidence remains Progress-only.

Do not reopen completed Progress/Coach source work without a reproduced defect, failed invariant or newly reviewed capability.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

P15-C contains the reviewed read-only question path:

- #266 minimal-scope structured router;
- #267 minimized evidence + strict structured answer boundary;
- #269 authenticated `POST /v1/coach/questions` composition;
- #270 confirmed structured Labs overview/marker-history evidence.

The latest Labs question contract is user-scoped and bounded. It exposes confirmed structured marker facts only and excludes raw documents, extraction drafts, provider payloads, secrets, diagnosis, prescribing/treatment and automatic canonical mutation. #269 and #270 passed authoritative Backend CI before merge.

## Phase 15 closure

P15-A through P15-F are source/CI-complete for the currently reviewed scope. `docs/qa/phase15-closure.md` is the focused evidence matrix.

Preserve these contracts:

- Coach and Companion are one product surface, not separate assistants;
- deterministic calculations and hard guardrails stay outside model prompts;
- model-visible retrieval is purpose-specific, user-scoped and bounded;
- navigation handoffs carry selectors/anchors, never raw private state or prebuilt broad analytics;
- automatic mutation of programs, workouts, nutrition targets, goals and Labs data remains prohibited;
- Labs drafts/raw documents stay outside ordinary Coach question context;
- missing RPE, nutrition, recovery, body and Labs evidence stays missing rather than being inferred.

Source/CI closure is not provider, signed-device, rollout or production-model evidence.

## Next execution order

1. Keep Phase 15 closed unless a reproduced defect or new reviewed capability warrants reopening it.
2. Execute remaining Phase 14 external evidence when prerequisites are available: Labs configured-provider/device, Push provider/device, Steps signed-device, and remaining Stories mobile/device evidence.
3. Phase 16 Proactive Coach is the next planned product source phase; it must reuse the bounded Phase 15 fact layer and preserve frequency/dismissal/anti-compulsion safeguards.
4. Phase 17 Goals & Planning follows under typed ownership/state contracts and no automatic plan mutation.
5. Repair demonstrated defects rather than inventing unrelated cleanup work.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.