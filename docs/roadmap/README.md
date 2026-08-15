# Roadmap maintenance

`ROADMAP_PROGRESS.md` is the canonical roadmap index. Current cross-repository sequencing belongs in `../implementation-plan.md`; the short live checkpoint belongs in `../current-status.md`.

Focused files in this directory may serve one of two roles:

- **active focused roadmap** — current remaining work for that domain/phase;
- **historical readiness evidence** — preserved phase-specific decisions, PR evidence and external-gate contracts whose dated baseline is not the current repository checkpoint.

Exact source, tests and Git history override stale prose. A dated `Current baseline` inside an older readiness-evidence file must not override `../current-status.md`, `../implementation-plan.md` or the active Phase 14 roadmap.

Update rules:

- edit only the relevant active phase file for ordinary status changes;
- update the index when priorities, phase ownership or file structure changes;
- record completed PR numbers and merge SHAs in the relevant active phase file when they materially change its boundary;
- do not copy the detailed backend source baseline into mobile roadmap files; link to backend `docs/project-context.md`;
- do not copy full historical implementation logs into the index;
- Git history remains the archive for superseded roadmap wording.
