> Current user direction (2026-09-11): the multi-model role/handoff process below is retired for this takeover. Read [Pro handover](../handover/README.md) first. One Pro AI owns subsequent reasoning, implementation and verification; no automatic agent dispatch or repeated role gates. Historical acceptance criteria and preservation rules remain useful.

# DrawCloud project management

This folder is the shared operating record for the tech lead, medium developer and light QA/project coordinator. Start with [STATUS.md](STATUS.md). The user should normally need one instruction for development, one for independent QA and one for the lead review per sprint, with additional handoffs only when defects or decisions require them.

## Reading order

| File | Purpose | Maintainer |
| --- | --- | --- |
| [STATUS.md](STATUS.md) | Current sprint, next actor, checkpoints and blockers | Actor handing off |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Product destination, boundaries, invariants and decisions | Tech lead |
| [BACKLOG.md](BACKLOG.md) | Feature order, rationale, dependencies and acceptance | Lead prioritizes; light updates evidence/status |
| [WORKFLOW.md](WORKFLOW.md) | Roles, autonomous passes, escalation and Git rules | Tech lead |
| [sprints/S001.md](sprints/S001.md) | Authorized implementation scope and three development passes | Tech lead |
| [TEST-PLAN.md](TEST-PLAN.md) | Independent test cases and release evidence | Lead defines; medium implements; light verifies |
| [BRANCHES.md](BRANCHES.md) | Branch/worktree/PR inventory and tested revisions | Light; medium records its branch |
| [reports/2026-09-08-baseline-audit.md](reports/2026-09-08-baseline-audit.md) | Initial code audit and verified baseline | Tech lead |
| [reports/TEMPLATE.md](reports/TEMPLATE.md) | Development, QA and lead report forms | Copy for each handoff |

## Copy/paste instructions

**Medium developer:**

> Act as the medium developer for DrawCloud. Read AGENTS.md and projectmanagement/README.md, STATUS.md, WORKFLOW.md, ARCHITECTURE.md, sprints/S001.md and TEST-PLAN.md. Implement every remaining authorized pass of S001 in order in one sustained run. Continue automatically at internal milestones. Write regression tests as you develop, complete integration checks, and repair in-scope failures. Preserve unrelated work. Update the development report and status at checkpoints. When the full sprint is ready, tell me NEXT: LIGHT and give the QA handoff. Escalate only under the documented rules; do not start S002.

**Light QA and coordinator:**

> Act as independent QA and project coordinator for DrawCloud. Read AGENTS.md and projectmanagement/README.md, STATUS.md, WORKFLOW.md, the active sprint, TEST-PLAN.md and the developer report. Verify the exact delivered revision, run the required checks, add independent regression cases where useful, and investigate failures without changing product behavior. Maintain BACKLOG.md and BRANCHES.md with evidence. Write the QA report. Tell me NEXT: MEDIUM for clear defects, NEXT: TECH LEAD for architecture questions or a completed sprint ready for logic audit, or NEXT: USER for an environment/access action only I can perform. Do all applicable checks in one run.

**Tech lead at review:**

> Resume as DrawCloud tech lead. Read projectmanagement/STATUS.md and the active sprint, developer and QA reports. Verify the code revision and inspect all sprint changes and affected logic directly; use reports as evidence, not as a substitute for code review. Decide whether to accept or return the sprint, record the reasoning and residual risks, and prepare the next complete sprint only after acceptance. Keep the architecture, feature priorities and handoff instructions consistent.

After S001, replace its ID in the development prompt with the active sprint ID in STATUS.md. These prompts do not schedule or launch other models. A runtime interruption may still require a resume message; the saved checkpoint must make that resume sufficient without replanning.
