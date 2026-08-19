# Latest Handoff

Updated: 2026-08-19

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current verified `main`: `11282c8d65d15c60c27f27aa41806b374101dbd5` (#772).

Phase 15 remains source/CI-complete for its reviewed Coach Intelligence + Progress scope. `docs/qa/phase15-closure.md` remains the focused closure evidence.

The first reviewed Phase 16 Proactive Coach foreground sequence is also complete:

- #770 — bounded deterministic proactive insight selection with stable evidence-derived keys;
- #771 — account-scoped seven-day cooldown/dismissal presentation memory plus privacy/account-cleanup integration;
- #772 — one authenticated foreground Companion insight card with persistence-before-display, fail-closed storage behavior, neutral EN/RU copy and targeted Progress evidence handoff.

#772 passed exact-head Mobile CI including line audits, TypeScript, full regression, expanded-model smoke, Expo export and Expo Doctor. `docs/qa/phase16-foreground-closure.md` records the reviewed closure boundary.

Do not reopen Phase 15 or the reviewed Phase 16 foreground slice without a reproduced defect, failed invariant or newly reviewed capability/delivery contract.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified `main`: `a4b1e51b7e3a2b1e388a17454ee86482a273ab94` (#270).

P15-C remains the reviewed read-only question path:

- #266 minimal-scope structured router;
- #267 minimized evidence + strict structured answer boundary;
- #269 authenticated `POST /v1/coach/questions` composition;
- #270 confirmed structured Labs overview/marker-history evidence.

No backend change was required for the completed Phase 16 foreground slice.

## Contracts to preserve

- Coach and Companion are one product surface, not separate assistants.
- Deterministic calculations and hard guardrails stay outside model prompts.
- Model-visible retrieval is purpose-specific, user-scoped and bounded.
- Navigation handoffs carry selectors/anchors, never raw private state or prebuilt broad analytics.
- Proactive foreground presentation remains frequency-capped, dismissible and non-punitive.
- Automatic mutation of programs, workouts, nutrition targets, goals and Labs data remains prohibited.
- Labs drafts/raw documents stay outside ordinary Coach question context.
- Missing RPE, nutrition, recovery, body and Labs evidence stays missing rather than being inferred.

Source/CI closure is not provider, signed-device, rollout or production-model evidence.

## Phase 17 starting authority

Goals & Planning must begin from the goal fields already owned by the fitness profile: `goalType`, `targetWeight`, `weeklyWeightChangeGoal` and `trainingDaysPerWeek`. They already participate in the established local AppState and fitness-profile synchronization path.

Do not add a second persisted goal source merely for goal-aware Progress/Coach behavior. Start with typed deterministic goal facts over the existing authority; add new goal persistence only if a reviewed requirement cannot be represented by the existing profile contract.

## Next execution order

1. Keep Phase 15 closed unless a reproduced defect or new reviewed capability warrants reopening it.
2. Treat Phase 16 foreground v1 as source/CI-complete for the reviewed Companion-card scope; push/background/model-triggered expansion needs a separate contract.
3. Advance Phase 17 Goals & Planning with typed goal facts, goal-relative Progress context and minimum bounded Coach context over the existing fitness-profile authority.
4. Execute remaining Phase 14 external evidence when prerequisites are available: Labs configured-provider/device, Push provider/device, Steps signed-device and remaining Stories mobile/device evidence.
5. Repair demonstrated defects rather than inventing unrelated cleanup work.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.