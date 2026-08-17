# Autonomous Throughput Policy

Updated: 2026-08-17

This document defines the execution policy for long autonomous roadmap passes. It supplements `AGENTS.md`; safety, architecture, privacy, deployment and exact-head validation rules remain unchanged.

## Objective

Maximize useful, reviewable roadmap completion per autonomous pass. Elapsed time alone is never a reason to stop. A pass ends only when executable approved work is exhausted or a genuine blocker is reached.

## Workstream queue

At the beginning of a substantial pass, derive a queue of independent executable workstreams from current `main`, open PRs, the canonical implementation plan, current status, handoff and demonstrated source defects.

- Keep multiple non-overlapping workstreams available whenever the roadmap supports them.
- Separate the implementation queue from the merge queue. A PR waiting for CI remains in the merge queue while implementation continues elsewhere.
- Prefer coherent feature/remediation batches over micro-PRs. Closely related fixes sharing the same UI, state, API or validation contract should normally land together.
- Do not create artificial work solely to fill the queue.

## CI is a merge barrier, not a development barrier

A queued or running authoritative CI job blocks only merge of that exact head.

- Do not repeatedly poll a running workflow while another independent workstream can be inspected, implemented, tested or prepared.
- Check CI at meaningful boundaries: after completing another workstream, before merge, when a failure notification/status transition is expected, or when the queue is otherwise exhausted.
- A single Hermes runner may serialize authoritative validation; it must not serialize development.
- If multiple independent PRs are ready, allow them to queue. Continue source work rather than waiting for the runner to become idle.
- When a CI failure occurs, repair the demonstrated failure, push one coherent correction, then return to independent work instead of polling the rerun continuously.

## Batch validation

Use validation at meaningful boundaries rather than after microscopic edits.

- During implementation, run focused checks when they materially reduce risk.
- Run required full local/authoritative validation for the coherent batch before claiming completion or merging.
- Avoid repeated full-suite runs for every small edit inside the same coherent workstream when no boundary has been crossed.
- Preserve exact-head Mobile CI before merge where required by `AGENTS.md`.

## Autonomous continuation rule

Do not end a pass merely because one or more of these occurred:

- a PR was opened;
- a PR entered CI;
- one PR merged;
- a progress update was sent;
- one workstream hit an external blocker;
- the active Hermes runner became busy;
- a convenient small milestone was reached.

Instead, immediately select the next independent executable workstream.

## Completion criterion

Before ending a substantial autonomous pass, perform a work-exhaustion check:

1. Re-read the active roadmap/status continuation point if it may have changed.
2. Inspect open PRs and identify which are implementation-ready, CI-only, merge-ready, failed or externally blocked.
3. Check whether another non-overlapping approved workstream can be executed from current source.
4. Continue if such work exists.
5. End only when all remaining work is blocked by authorization, product decision, unavailable credentials/device/provider/runtime, dependency/conflict, exact-head merge ordering, or a hard tool/environment limit.

The final report should distinguish completed/merged work, ready-but-CI-queued work, failed work requiring repair, and genuine external blockers. It should not treat ordinary CI latency as exhaustion of autonomous work.

## Cross-repository parallelism

Mobile and backend work should proceed concurrently when contracts and changed files are independent.

- Do not wait for mobile CI before starting an unrelated backend roadmap workstream.
- Do not wait for backend CI before starting an unrelated mobile workstream.
- Coordinated API/schema changes remain dependency-aware and must preserve compatibility and migration discipline.

## Documentation cadence

Do not rewrite status/handoff documents after every microscopic fix. Update canonical documentation when a coherent batch materially changes supported scope, architecture, blockers, roadmap state or continuation state.

## Safety and release boundaries

This throughput policy does not authorize OTA/EAS publication, native build/install, backend deployment, production migration, provider activation, credential/DNS changes, worker scheduling, store submission, production-data access or any other action prohibited by `AGENTS.md` without the required explicit authorization.
