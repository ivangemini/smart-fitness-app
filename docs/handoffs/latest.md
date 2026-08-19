# Latest Handoff

Updated: 2026-08-19

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current merged `main` while final P15-E validation runs: `ff9e71af8a306e4e8802fc50a67da730dbc8e689` (#767).

The reviewed Phase 15 mobile sequence has established:

- bounded Coach data capabilities and selective retrieval (#749–#751);
- compact Progress IA (#755);
- Weight, Strength & Training, Activity, Highlights and Body-measurement drill-downs (#756, #759, #761, #763, #764; shared exercise series #758);
- selected-exercise, Weight, Measurements and Activity Progress → Companion handoffs (#760, #762, #766, #767).

PR #768 is the remaining current-set Highlights → Companion handoff. It deliberately sends only source/intent/metric/period/anchor selectors, rebuilds trend facts inside Companion and physically filters session input to the 90-day Coach window before shared analytics. All-time record evidence remains Progress-only because its source calculation uses longer history.

Do not reopen completed Progress drill-downs or create parallel Coach state paths without a reproduced defect or newly reviewed contract.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

P15-C now contains the complete reviewed read-only question path:

- #266 minimal-scope structured router;
- #267 minimized evidence + strict structured answer boundary;
- #269 authenticated `POST /v1/coach/questions` composition;
- #270 confirmed structured Labs overview/marker-history evidence.

The latest Labs question contract is user-scoped and bounded. It exposes only confirmed structured marker facts and forbids raw documents, extraction drafts, provider payloads, diagnosis, treatment/prescribing and automatic canonical mutation.

#269 and #270 passed authoritative Backend CI before merge.

## Immediate execution order

1. Let exact-head Mobile CI finish for #768 and merge only the exact validated head if green.
2. Finish the P15-F closure checkpoint in `docs/qa/phase15-closure.md` and synchronize `docs/current-status.md`, this handoff, `ROADMAP_PROGRESS.md` and `docs/implementation-plan.md` to the final mobile/backend SHAs.
3. Classify P15-A through P15-E source/CI-complete for the currently reviewed scope after #768 merges; keep P15-F explicit about source CI versus physical/provider/release evidence.
4. Do not create additional Phase 15 source work merely to stay busy. Reopen it only for a reproduced defect, failed closure invariant or new reviewed capability.
5. Phase 14 external provider/device evidence remains independent and may execute when its prerequisites exist.
6. Phase 16 Proactive Coach and Phase 17 Goals & Planning are successors and must preserve their own review/safety requirements before runtime expansion.

## Existing contracts to preserve

- Coach and Companion are one product surface, not separate assistants.
- Deterministic calculations and hard guardrails stay outside model prompts.
- Model-visible retrieval is purpose-specific and bounded; unrestricted `AppState`/raw-provider access is prohibited.
- Automatic mutation of programs, workouts, nutrition targets, goals and Labs data remains prohibited.
- User-owned server reads remain authenticated and user-scoped.
- Labs drafts/raw documents stay outside ordinary Coach question context.
- Missing RPE, nutrition, recovery, body and Labs evidence stays missing rather than being inferred.
- Existing workout/program lifecycle, active-session persistence, sync/revision/idempotency, Social/Stories privacy, Labs confirmation semantics and export/privacy boundaries remain unchanged unless explicitly included in a reviewed package.

## P15-F closure evidence

Use `docs/qa/phase15-closure.md` as the focused source/CI closure evidence matrix. The repository's Mobile CI is the authority for line limits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. Backend question changes require their separate backend gates.

Do not convert successful source CI into claims about:

- production model/provider activation;
- signed native/physical-device testing;
- Phase 14 provider evidence;
- production rollout;
- medical diagnosis/prescribing behavior.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.

These gates do not justify unrelated source refactors while prerequisites are absent.
