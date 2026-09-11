# Roles, autonomous work and handoffs

## Responsibilities

| Role | Owns | Does not decide alone |
| --- | --- | --- |
| Tech lead | Product architecture, priorities, sprint scope, difficult logic decisions, final code audit and acceptance | User business priorities or publishing authorization |
| Medium developer | Implementation, maintainable design within the contract, regression tests, integration fixes, developer evidence | Protocol changes, scope expansion, own final acceptance |
| Light QA/coordinator | Independent tests, reproductions, coverage gaps, branch/test/backlog records, concise review packet | Product fixes, architecture acceptance, dropping mandatory tests |
| User | Product steering, starting role sessions, access actions unavailable to agents | Routine implementation choices already covered here |

Medium must understand and test the code it writes. Independent light QA starts after several development passes, not after every component. The lead may assign light a bounded audit-support task (reproduce a bug, inventory affected callers, compare fixtures); the lead still reasons about correctness.

## Normal sprint loop

`READY_FOR_DEV → IN_DEV (M1 → M2 → M3) → READY_FOR_QA → IN_QA → READY_FOR_LEAD → ACCEPTED`

Clear QA failures return to `CHANGES_REQUESTED → IN_DEV → READY_FOR_QA`. A contract ambiguity or evidence of a wrong architecture goes to the lead instead. The lead can return further corrections after QA passes. Only ACCEPTED permits the lead to authorize the next sprint. Acceptance and merging are distinct events.

### Sustained development

One user instruction authorizes all passes listed in the active sprint, including reasonable in-scope repair work. Continue automatically after a milestone. Milestones provide recovery and evidence; they are not prompts for another user instruction. A pass can be long and span multiple context windows. Do not pad work to occupy hours or promise unattended runtime the environment cannot provide.

At each milestone, save a short checkpoint with changed responsibilities, checks and next action. Continue working immediately. Keep user-facing progress concise. If interrupted, the next session reads the checkpoint, inspects the diff and resumes the next unfinished item instead of repeating completed work.

Stop only for the final role handoff, an actual blocker, a lead decision, a user-requested pause, or a runtime constraint. If constrained by runtime, say it is an interruption, not a completed pass or sprint. Do not ask “shall I continue?” while authorized work remains.

Scope discoveries go into BACKLOG.md with rationale. Fix in-scope defects needed for acceptance; do not pull unrelated roadmap features into the sprint to make a pass longer. Tell the lead when a milestone's acceptance criteria cannot be met within the selected architecture.

### Independent QA

Read the sprint requirements before relying on the developer summary. Verify the delivered revision and working tree, install from its lockfile in a safe workspace, run the complete mandatory suite once, then investigate failures. Independently add boundary/adversarial examples that test the contract instead of copying implementation branches.

Run checks that are independent of a blocker. A missing browser installation is BLOCKED, not a product FAIL; a reproducible corruption is FAIL, not an environment issue. Test failures do not authorize changing expected behavior. Light can edit tests, fixtures and management reports; product fixes go to medium.

Record a disposition for every mandatory test-plan row. Link logs/artifacts, command, exit code, environment, expected/actual result and tested revision. After fixes, rerun affected tests and the required final suite. If code changes during QA, freeze a new candidate and rerun relevant checks; do not certify a moving workspace.

### Lead review

Read the developer and QA packets, verify their revision, then inspect the entire sprint diff and affected callers. Trace successful and failing paths, transaction boundaries, object identity/ID rules, serialization preservation, state transitions, asynchronous races and history behavior. Inspect tests for meaningful assertions and missing counterexamples. Passing tests are supporting evidence.

Record ACCEPTED or CHANGES_REQUESTED with file/line evidence, severity and required fixes. If accepted, update backlog and status, record residual risks, then publish the next sprint's complete scope/test/handoff plan. Do not declare the project done because the first sprint passes.

## Escalation rules

| Situation | Next actor | Required packet |
| --- | --- | --- |
| Clear implementation defect under an unambiguous contract | MEDIUM | Small reproducer, expected/actual, revision, failing test and severity |
| Ambiguous patch semantics, file integrity tradeoff, protocol or persistence change, need to broaden scope | TECH LEAD | Decision question, affected code, evidence, options and recommendation |
| Apparent data corruption or unintended change outside requested operations | TECH LEAD | Preserve source/patch/result; isolate affected path; continue unrelated checks |
| Repeated defect after two distinct attempted fixes, or no new evidence after focused investigation | TECH LEAD | Attempts and why each failed; do not loop through speculative rewrites |
| QA done, sprint candidate coherent, no unresolved mandatory failures | TECH LEAD | Complete QA/developer reports, diff range, risks and ledger |
| Authentication, inaccessible required resource or environment installation the agent cannot perform | USER | Exact needed action, checks already attempted, work still possible |

Routine dependency installation, local branch creation, naming, decomposition, tests and reversible fixes within scope do not require the lead. An agent can perform supported environment setup itself when possible. Do not make global machine changes casually; prefer a scoped runtime. Do not hide a material blocker behind a passing subset of tests.

## Git and record keeping

- Start by inspecting status, branch, worktrees and existing instructions. Planning files may still be uncommitted; preserve and carry them into the development branch. Ask no permission merely to create the planned local branch when it is free.
- Default to one feature branch for the sprint: `codex/s001-safe-roundtrip`. If occupied, inspect ownership and create a distinct branch/worktree instead of switching or resetting another session's work.
- Checkpoint commits are allowed for task-owned files after review. Never sweep unrelated files into a commit. No force push, merge, deployment, worktree deletion or pruning follows automatically from this workflow.
- Prefer an immutable code commit for QA. Record `git rev-parse HEAD`, `git status --short`, base commit and changed-file list. If commits are unavailable, record the exact patch artifact plus hashes of untracked source/tests; HEAD alone does not identify uncommitted code.
- A QA commit adding only tests/reports is recorded separately from the tested product commit. A later product-code change invalidates prior certification for the changed behavior. The lead reviews the final candidate, including QA additions.
- Light maintains BRANCHES.md from local branches/worktrees and remote/PR information it can actually access. Record observation time and freshness. Remote-tracking refs are not proof that the remote has no other branches. Do not invent PRs or fetch/publish claims.
- Backlog states: `READY`, `IN_PROGRESS`, `READY_FOR_QA`, `VERIFIED`, `ACCEPTED`, `BLOCKED`, `PLANNED`, `DEFERRED`. Light can set VERIFIED; only the lead sets ACCEPTED or authorizes a new sprint. Bug severity and roadmap priority are different fields.

## Handoff message format

Keep the user message short: `NEXT: <role> — <reason>. Sprint <ID>, candidate <revision>. Report: <path>.` Include one copy/paste instruction if it saves user effort. Put detailed evidence in the repo, not a long chat transcript. When blocked, state the exact unresolved decision. Agents do not automatically launch or message other tasks under this process.
