# Initial tech-lead audit — 2026-09-08

Reviewed code revision: `409d82415f17cfe899267bd981c317067a798d59` on `main`. Reviewer: tech lead. Outcome: prototype is suitable for hardening, but its advertised safe AI round-trip is not yet supported by sufficiently strict logic or tests. S001 is ready for development; this is not product acceptance.

## Scope and evidence

Read all application source files, all five templates, README, package/TypeScript configuration, CI and Netlify configuration. Inspected local branches/worktrees and recent commit history. No existing AGENTS.md or projectmanagement folder was found in the repo; no applicable AGENTS.md was found at `D:/` or `D:/PROJ/`.

Ran `npm run build` using preexisting dependencies. TypeScript and Vite build completed successfully; Vite reported `built in 23.68s`. Output: JS 436.73 kB (gzip 125.10 kB), CSS 3.40 kB. These are baseline observations, not performance budgets.

Runtime was Node `21.7.1`, npm `10.5.0`. Vite warned it requires Node `20.19+` or `22.12+`. Installed versions included Vite `7.3.6`, TypeScript `5.9.3`, React/React DOM `19.2.8`, Fluent UI `9.74.7`. Many Fluent UI/Griffel dependency `use client` directives were ignored by the bundler. The unsupported runtime and uncommitted dependency resolution prevent claiming a reproducible supported-environment baseline.

There is no test script, test suite or committed lockfile in the reviewed tree. CI runs `npm install` then `npm run build`. No browser interaction, patch execution, actual download or Draw.io interoperability test was performed during this audit. Reproducers below are derived by tracing the source; independent runtime reproduction is explicitly assigned to S001. Build success is not evidence that those behaviors work.

The build created an untracked `tsconfig.app.tsbuildinfo`; it was removed after inspection. Build output is ignored. The initial login shell also printed a preexisting Conda/Python initialization error; subsequent commands used a non-login PowerShell and worked. No global environment repair was attempted.

## Findings

### A01 — P1: automatic ID renaming can connect to the wrong node

Location: `src/lib/drawio.ts:92`, `:123`, `:141` (`uniqueId`, `addNode`, `connect`).

When a requested new ID already exists, addNode creates a suffixed ID. Later operations still refer to the original requested ID, so a connection can silently target the old vertex rather than the added one. This contradicts stable semantic IDs. Edge collisions also silently create an extra edge.

Reproducer: on Fabric Medallion, stage `addNode(id="source", label="New source")` followed by `connect(id="new-edge", source="source", target="ingest")`. The current path creates `source-2` but connects existing `source` to `ingest`. Expected under S001: reject the duplicate ID and leave the original unchanged.

Fix direction: reject ID collisions across all cells; index exact IDs. Coverage: T05/T06. Backlog: DC-002.

### A02 — P1: patch input is not runtime-validated; unknown operations succeed silently

Location: `src/lib/drawio.ts:99–165`; `src/App.tsx:73`.

The patch boundary checks only format and whether operations is an array. TypeScript's `as AiPatch` does not validate JSON. Independent `if` statements ignore unrecognized operation names. Incorrect field types can reach XML attribute setters; dimensions may be invalid. Null/primitive cases may throw incidental errors instead of a deliberate input diagnostic. A known operation followed by an unknown operation can return a partially fulfilled request as success.

Reproducer: `{ "format": "drawcloud-patch-v1", "operations": [{ "op": "renameNode", "id": "source", "label": "Changed" }] }` reaches serialization without reporting unsupported operation. Expected: reject the entire patch. Also test numeric label, null operation and negative width.

Fix direction: validate unknown input and every field/op before commitment; ordered exhaustive dispatch and useful errors. Coverage: T04/T07/T14. Backlog: DC-002.

### A03 — P1: unsupported XML can look like a successfully loaded empty diagram

Location: `src/lib/drawio.ts:40–84`; `src/App.tsx:83–93`.

The parser checks XML syntax but not the Draw.io envelope/support profile. `drawioToAi` scans for mxCell and accepts `<hello/>` as empty nodes/edges. A compressed diagram payload also contains no visible mxCell elements and can yield an empty semantic document. Wrapped cell IDs/labels are not handled correctly.

Reproducer: import `<hello/>`, or a syntactically valid mxfile whose diagram holds a compressed payload. Expected: distinguish unsupported/not-Draw.io input and preserve the previous workspace. A legitimate empty supported graph should still work.

Fix direction: explicit structural/profile validation shared by load, export and patching; explain recovery for unsupported formats. Coverage: T01–T03. Backlog: DC-001.

### A04 — P1: graph scope and parent assumptions can invalidate imported diagrams

Location: `src/lib/drawio.ts:53`, `:86`, `:108–161`.

Semantic export scans all mxCell elements across a document, while rootLayer chooses the first graph root. Patch selectors operate globally. Multiple pages can reuse IDs, so semantic identity and mutation scope are inconsistent. New cells hardcode `parent="1"` even if that layer is absent. Deleting a group removes the group and incident edges but leaves child cells referring to a removed parent. Input duplicates and dangling references are not rejected.

Reproducers: two pages both containing `source`; a flat graph with layer ID `layer-a`; a group with a child vertex. Expected for S001: reject multipage/groups, accept valid nonstandard structural IDs, validate references and parent new cells correctly.

Fix direction: deliberately narrow supported profile now; page/group support needs later design. Coverage: T02/T03/T05. Backlog: DC-001/DC-002; future DC-011/DC-012.

### A05 — P1: asynchronous load failures and races can leave inconsistent working state

Location: `src/App.tsx:52–67`, `:83–93`, `:166`.

loadTemplate has no catch or request ordering. It sets active template and XML before computing semantic JSON; a parse failure can leave new XML/provenance alongside old JSON. A slow earlier request can overwrite a newer template/import. Clipboard rejection also has no user-facing catch. Local import validates before its state writes, which is a good pattern, but it shares no ordering guard with template loads.

Reproducers: delay template A until after B finishes; load malformed template XML after a valid current file; deny clipboard access. Expected: latest user intent wins, failed candidates never replace the current snapshot, useful error status is shown. There is also no protection against replacing a modified draft.

Fix direction: validate before a single workspace commit, unify operation ordering and error handling, add cancelable modified replacement. Coverage: T09/T12. Backlog: DC-003/DC-006.

### A06 — P2: template content is tied to moving remote main, not the app build

Location: `src/App.tsx:29`, `:54`; `src/data/templates.ts`.

The catalog metadata is compiled locally but template XML is fetched from raw GitHub main at runtime. A branch's template fixes are therefore not used by its own app, metadata/XML can diverge, and template use depends on external network availability.

Reproducer: change a template in a local branch and use its card, or block raw.githubusercontent.com. Expected: built-in templates correspond to the checkout/build and work without that external request.

Fix direction: build-associated raw XML assets with separate provenance/repository links. Coverage: T13. Backlog: DC-005.

### A07 — P2: current-draft workflow lacks review, recovery and clear handoff

Location: `src/App.tsx:70–77`, `:98`, `:181–185`; `src/lib/drawio.ts:179`.

Apply commits immediately with no effect summary or undo. Imported filenames are discarded for download. The workbench's “Edit source in Draw.io” link opens the repository source, not the locally patched XML. The wording does refer to source, but the overall journey needs explicit guidance so users do not expect local changes there. The download helper revokes its object URL immediately; browser verification is needed before calling download reliable, not a confirmed cross-browser failure.

Fix direction: stage/review/apply, bounded undo, preserve filenames, clarify repository-original versus working-file actions, test actual downloaded artifacts. Coverage: T10–T12/T16. Backlog: DC-004/DC-006.

### A08 — P1: no repeatable behavior gate or supported baseline environment

Location: `package.json`, `.github/workflows/ci.yml`, `.gitignore`.

Only compilation/build is tested. Dependency resolution is not locked; the existing local Node version is unsupported by the installed Vite. Generated TypeScript build info is not ignored. This does not prove every behavior is broken, but it leaves the integrity claims unverified and development/QA environments potentially different.

Fix direction: supported scoped Node runtime, committed lockfile, domain/browser tests, production journeys and CI. Coverage: T15 plus the full matrix. Backlog: DC-007.

## What the current design gets right

XML remains canonical; patches edit a newly parsed document rather than rebuilding XML from AI JSON. For errors that actually throw inside applyAiPatch, no returned result means the caller retains its old XML string; preserve and extend that transaction boundary. Existing label updates change only the requested attributes. Template IDs are readable and stable. The static app/product boundary is appropriate for the stated workflow.

## Review decision

Prioritize integrity, predictable local state and executable tests before catalog expansion. S001 specifies the exact restricted profile rather than asking the developer to improvise broad Draw.io compatibility. Legacy v1 patches still lack source identity/revision binding; DC-008 is the next protocol priority. No findings are marked fixed at planning time.
