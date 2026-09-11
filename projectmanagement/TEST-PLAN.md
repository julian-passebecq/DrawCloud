# Test strategy and S001 acceptance matrix

Owner: tech lead; implementation: medium; independent execution/challenge: light. These commands and tests are **required deliverables**, not existing capabilities at the baseline. The baseline only has `npm run build`.

## Layers and oracles

- Real-browser domain tests: XML parsing/classification, strict patch validation, graph invariants and preservation. Vitest Browser Mode with Chromium via Playwright avoids relying on incomplete Node DOM shims.
- Focused workspace/component tests: transitions, error handling, revision invalidation, request order and history. Use controlled promises for races; avoid sleeps.
- Playwright production-app journeys: buttons, text, import/export, actual downloaded file and responsive keyboard flow. Use the built app rather than only the Vite development server.
- External interoperability smoke: open the resulting artifact in Draw.io and inspect editability. Keep this separate from deterministic CI because it depends on an external editor/environment.

Assertions must prove behavior. Compare parsed XML structure/attributes/geometry rather than global serialized whitespace. Also assert exact original XML remains unchanged on rejection and undo restores an exact saved snapshot. Check correct endpoints, unique IDs, layer parent, metadata and untouched geometry; counts alone miss wrong-node changes. A test helper must not merely call the same production validator and declare its output correct.

## Required matrix

All rows are mandatory for S001 unless a row explicitly identifies an informational observation. Parameterized cases may share fixtures; do not omit subcases to obtain a green report.

| ID | Cases and required result | Layer / primary author |
| --- | --- | --- |
| T01 | Parse all five templates; verify known IDs/labels/endpoints, node counts Fabric 7 / others 5 and edge counts Fabric 6 / others 4. Export format remains `drawcloud-ai-v1`. Accept a bare graph and valid empty graph with preserved envelope. | Domain / medium |
| T02 | Malformed/unrelated/empty XML, compressed payload, two pages with overlapping cell IDs, wrappers, groups, multiple layers, DTD/entity declaration: reject with the correct diagnostic category; never return a fake empty success. | Domain + import journey / medium; light adds variants |
| T03 | Missing/duplicate IDs (including structural IDs), missing parent, wrong parent, cycles, ambiguous cell types, dangling edge and invalid/duplicate geometry: reject. Valid nonstandard root/layer IDs remain valid; new cells use the discovered layer. | Domain / medium |
| T04 | Null/scalar/array envelope, wrong format, missing operations, unknown envelope/operation keys, null/primitive operation, unknown op, missing fields, whitespace-only ID, wrong field types, null optionals, nonfinite numbers, nonpositive dimensions: reject without coercion. Empty labels allowed; punctuation/Unicode IDs match exactly. Include programmatic NaN/Infinity and JSON overflow `1e999`. | Domain / medium; light adversarial checks |
| T05 | Each of the five valid operations; add then connect/update works; reference-before-add fails; node deletion removes all incident edges, including a self-loop; unrelated edges survive. Distinct-ID parallel edges/self-loop allowed; missing/wrong-kind targets fail; deletion followed by reusing the ID obeys sequential semantics. | Domain / medium |
| T06 | Existing node/edge/structural ID collisions all reject. Demonstrate baseline collision example from A01. Repeated same creation patch fails; no hidden suffix. `deleteNode` then explicit deletion of its already-removed edge fails transactionally. | Domain / medium |
| T07 | A valid operation followed by a failing last operation returns no candidate; original XML, workspace JSON and undo history unchanged. Unknown final op is an error, not ignored. Empty patch and update with no effective change do not create undo history. | Domain + workspace / medium |
| T08 | Update one label with metadata, HTML-like label text, style, geometry, waypoints and unrelated cells in fixture: preserve everything outside the requested attribute. Explicit style replacement changes only the target style. XML escaping survives quotes/ampersands/Unicode. Apply→serialize→reparse yields same intended graph. | Domain / medium; light independently compares fixture/result |
| T09 | Import valid local file with original filename; invalid/unsupported next import preserves current file and JSON. Failed read also preserves state. Older template/template, import/import and template/import completions cannot replace newer intent; edits during pending replacement cannot be silently lost. Modified replacement cancel/confirm and failed confirmed replacement preserve/reset history correctly. | Workspace + journey / medium |
| T10 | Review leaves original untouched and shows operation fields/IDs plus implicit edge deletions. Apply produces the reviewed candidate exactly. Patch edit/document change invalidates staged review. Double apply cannot repeat creation/deletion. No active file means apply unavailable. Render HTML-like input as text in app. | Component + journey / medium |
| T11 | Undo after successive patches restores exact earlier XML/semantics and modified state; failure/no-op does not add history. More than 10 snapshots or 25 MiB evicts oldest with visible notice. Successful replacement resets history. Empty history is disabled. | Workspace / medium |
| T12 | Actual downloaded artifact contains current edits and expected filename/MIME; reimport shows same graph; post-undo download reflects restored graph. Clipboard success and denial produce truthful status; fallback text selectable. Repository-original link never claims local patches were saved/opened there. | Journey / medium; light inspects artifact |
| T13 | Every template loads from production output with external GitHub requests blocked; matches checkout fixture. Search/filter/select works. Empty search, disabled actions, labeled controls, visible error status, keyboard tab order and 375px/desktop layouts usable without obstructed primary controls. | Journey / medium; light independent UI pass |
| T14 | Exactly-at/over XML, patch, cell and operation limits, including post-patch growth: accept valid boundary inputs or reject excess deterministically before workspace replacement. Resource errors are visible. On a documented ordinary fixture (1,000 vertices + 999 edges, 100 label updates), measure timing and note UI responsiveness; pathological delay is investigated. Timing is informational until a reproducible threshold is agreed, while limit behavior is mandatory. | Domain + workspace / medium; light records environment |
| T15 | Supported Node, fresh lockfile install, domain/component tests, build, production E2E, CI script alignment and no accidentally tracked generated artifacts. Validate documented example against its fixture. New dependencies recorded with purpose. | Integration / medium; light reruns independently |
| T16 | Download a modified shipped template, open it in Draw.io, inspect label change/new connection and preserved layout, make a small visual edit, export uncompressed XML and reimport successfully. Record browser/editor date and artifact hash; if the editor emits an unsupported structure, report the precise incompatibility. | External smoke / light, medium may supply preliminary evidence |

Light adds at least one independently chosen mixed-operation transaction and one unexpected-input or workspace-ordering case. These should target plausible faults, not inflate test counts. New discovered defects receive a reproducer and backlog/audit reference.

## Execution contract after implementation

From the candidate workspace on a supported Node 22 release (at least 22.12), with the lockfile committed:

```text
node --version
npm --version
git rev-parse HEAD
git status --short
npm ci
npx playwright install chromium
npm test
npm run build
npm run test:e2e
```

On Linux CI the browser install may require `npx playwright install --with-deps chromium`. Medium documents the exact supported command/config for the pinned dependencies. The E2E script must start/stop its preview server or clearly document its lifecycle; do not silently test an old server. Use shell commands appropriate to the host and capture each exit code separately so a later successful command cannot hide an earlier failure.

## QA evidence and gate

Use [reports/TEMPLATE.md](reports/TEMPLATE.md). Record product commit, QA additions, dirty-tree state, runtime/browser versions, commands/exit codes, T01–T16 disposition and artifact locations. Preserve failing minimal input, patch, output and expected result. Avoid committing large generated logs/traces; provide durable artifact location and salient log excerpts. Do not include private diagrams in reports without user direction.

`PASS` requires executed evidence; `FAIL` requires observed mismatch; `BLOCKED` identifies unavailable prerequisite; `NOT_RUN` means not attempted. Skips and environment blockers are never converted to PASS. Light may send a partial packet to the lead with unresolved gates clearly marked; it is not a completion recommendation. The lead must explicitly record any waived gate and why, or return the sprint for completion.
