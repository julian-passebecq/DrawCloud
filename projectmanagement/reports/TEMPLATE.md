# Handoff report templates

Copy the relevant section into `S001-development.md`, `S001-qa.md` or `S001-lead-review.md`. For another sprint, replace the ID. Use `Not run`, `Unknown` or `Blocked` when appropriate; do not leave a placeholder looking like a result. Keep reports concise enough for the next actor to read, with links to detailed evidence.

## Development report

- Sprint / author / date:
- State and next actor:
- Branch / workspace / base revision / candidate revision:
- Working-tree changes outside the candidate commit:
- Milestones M1/M2/M3: completed items, evidence and remaining items:
- Behavior delivered and why:
- Implementation map: changed modules, responsibilities and important logic entry points:
- Contract decisions: ADR references; local implementation choices; any deviation requiring lead decision:
- Test commands, environment, exit codes and result counts:
- Baseline findings addressed: A01–A08 with regression test references:
- Known limitations, failures and tests not run:
- Dependencies/configuration changes and rationale:
- QA focus: likely weak points, fixture locations and reproduction instructions:
- Resume checkpoint if interrupted: exact next action, relevant files and current failure:

End: `NEXT: LIGHT — full S001 candidate ready for independent verification`, or the documented escalation state. Do not declare the sprint accepted.

## Independent QA report

- Sprint / author / date / recommendation:
- Product revision / base / branch / workspace:
- QA test/report additions and their revision or diff:
- Dirty-tree snapshot and whether the tested candidate changed during the run:
- Node/npm/browser/OS versions and install method:
- Commands and individual exit codes; logs/artifact paths:

| Test-plan ID | PASS / FAIL / BLOCKED / NOT_RUN | Evidence and tested case details | Defect / follow-up |
| --- | --- | --- | --- |
| T01–T16: expand into one row per ID | NOT_RUN | Supply actual result | Supply if needed |

- Independent adversarial cases added, why they matter and results:
- Defects: ID, severity, source/patch/action, expected/actual, reproducibility, candidate revision, suspected code location and regression case:
- Preservation/interoperability artifact inspection:
- Baseline A01–A08 verification summary:
- Branch/PR/worktree inventory freshness and ledger updates:
- Backlog updates and remaining risks:
- Decision needed from medium/lead/user, if any:

End: `NEXT: MEDIUM` for concrete defects, `NEXT: TECH LEAD` for a complete review package or architecture decision, or `NEXT: USER` for a necessary environment/access action. Distinguish “all gates passed” from “partial audit, gates blocked.”

## Tech-lead review report

- Sprint / date / exact reviewed candidate and QA additions:
- Decision: ACCEPTED or CHANGES_REQUESTED; rationale:
- Diff scope and affected modules/callers directly reviewed:
- Invariants traced: XML preservation, exact IDs, atomicity, support boundaries, state races, review binding, undo and external IO:
- Test evidence trusted, evidence independently checked and missing counterexamples:
- Findings: priority, file/line, concrete failure scenario, required fix and verification:
- Residual risks / deferred features / any explicitly waived test gate and reason:
- Backlog/status/ADR updates:
- Next sprint scope and rationale if accepted, or correction batch if not:
- Pass sizing feedback: unnecessary user continuations, interruptions, coherent milestone size:

Acceptance is technical approval of the reviewed candidate, not evidence of merge or deployment. Record those separately only when performed and verified.
