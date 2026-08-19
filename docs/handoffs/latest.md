# Latest Handoff

Updated: 2026-08-19

Exact Git history, source, tests and CI override prose if this handoff becomes stale.

## Current verified checkpoint

### Mobile

Repository: `ivangemini/smart-fitness-app`.

Current `main`: `bb48f0452690f0b33e824eea18aae8fb61a7fc2d` (#764).

The current Phase 15 mobile sequence has completed the reviewed Progress information architecture and drill-down set through #764:

- #755 compact Progress overview;
- #756 bounded weight details;
- #758 bounded deterministic exercise progress series;
- #759 Strength & Training drill-down;
- #760 selected-exercise Progress → Companion context;
- #761 Activity drill-down;
- #762 weight-only Progress → Companion context;
- #763 Highlights drill-down;
- #764 Body measurement drill-down.

Do not reopen completed Liquid Glass convergence work or duplicate these Progress views without a demonstrated defect/new reviewed contract.

### Backend

Repository: `ivangemini/smart-fitness-backend`.

Current verified `main`: `92fbf47d3bf10725e11ee43ccf61eba042abcba1` (#267).

P15-C backend foundation now contains:

- #266 minimal-scope structured question routing;
- #267 minimized question evidence and strict structured answer boundary.

#267 exact-head Backend CI passed lint, Prettier, build, production configuration validation, isolated staging topology validation and tests before merge.

The new question pipeline remains read-only and is not yet exposed as a complete public authenticated question endpoint.

## Next execution order

1. Continue P15-C by composing authenticated question handling end to end: question router → only required user-scoped contexts → minimized evidence → structured answer.
2. Keep the endpoint read-only and fail closed for unsupported scopes, missing context, provider unavailability and model/output validation failures.
3. Do not expose raw Labs documents, unconfirmed extraction drafts, secrets, provider payloads or unrestricted application state to the answer model.
4. Extend P15-E beyond existing exercise/weight handoffs only with an equivalent minimal metric/exercise/period contract.
5. After P15-C/P15-E stabilize, run P15-F accessibility/performance/regression and canonical docs closure.
6. Execute Phase 14 external provider/device evidence when its prerequisites become available; it remains independent from Phase 15 source work.

## Existing contracts to preserve

- Coach and Companion are one product surface, not separate assistants.
- Deterministic calculations and hard guardrails stay outside model prompts.
- Automatic mutation of programs, workouts, nutrition targets, goals and Labs data remains prohibited.
- User-owned reads remain authenticated and user-scoped.
- Raw provider/model/storage internals stay out of public DTOs.
- Existing workout/program lifecycle, active-session persistence, sync/revision/idempotency, Social/Stories privacy, Labs confirmation semantics and export/privacy boundaries remain unchanged unless explicitly included in a reviewed package.

## External Phase 14 gates still outstanding

- Labs configured-provider + physical-device evidence;
- Push provider + physical-device evidence;
- Steps signed native/physical-device evidence;
- Stories remaining mobile/physical-device runtime evidence.

These gates do not justify unrelated source refactors while prerequisites are absent.
