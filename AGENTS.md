> Current user direction (2026-09-11): the multi-model role/handoff process below is retired for this takeover. Read [Pro handover](handover/README.md) first. One Pro AI owns subsequent reasoning, implementation and verification; no automatic agent dispatch or repeated role gates. Historical acceptance criteria and preservation rules remain useful.

# DrawCloud agent instructions

Read `projectmanagement/README.md` and `projectmanagement/STATUS.md` before starting work. Follow the active sprint and the instructions for your assigned role in `projectmanagement/WORKFLOW.md`.

- The tech lead owns architecture, scope, code-logic acceptance and sprint selection. The medium model develops; the light model independently tests and maintains project records. Do not infer a specific model identifier from these role names.
- Execute all authorized development passes in the active sprint without asking the user to start each pass. Milestones are internal checkpoints. Do not start a later sprint before tech-lead acceptance.
- Keep canonical Draw.io XML and stable IDs. Do not build a diagram engine or introduce a backend without a recorded lead decision.
- Read the actual code and Git state; management notes describe intent and may be stale. Never claim an unrun test passed.
- Preserve unrelated work. Do not reset, clean, delete or reuse an occupied worktree. Record the exact tested revision and any uncommitted changes.
- Developers write regression tests with changes. QA owns independent verification, not all testing. QA does not silently fix product code or weaken assertions.
- At a role handoff or unavoidable interruption, update `projectmanagement/STATUS.md` and the appropriate report. State `NEXT: MEDIUM`, `NEXT: LIGHT`, `NEXT: TECH LEAD`, or `NEXT: USER`, with the reason and report path.
- The user will initiate model handoffs unless they explicitly request dispatch. Do not create other tasks or send messages to them merely because a handoff is ready.

These instructions organize the user's workflow; they do not authorize publishing, pushing, merging, deploying or discarding work.
