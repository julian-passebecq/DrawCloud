# DrawCloud: Pro AI takeover

Snapshot: 2026-09-11. Branch: `codex/pro-ai-handover-2026-09-11`.

## Start here

DrawCloud is an early working prototype, not a finished or accepted app. All product code is still revision `409d82415f17cfe899267bd981c317067a798d59`, already on GitHub main. The subsequent Codex work was testing and planning, not S001 implementation. This branch preserves that previously uncommitted planning and this handover. See [Git and evidence](GIT-AND-EVIDENCE.md) for the inventory and test limits.

The user stopped the multi-model workflow because token cost and coordination were unsustainable. One Pro AI now takes over architecture, implementation and verification. Do not restart medium/light/lead handoffs, dispatch agents, or require the user to initiate each milestone. The historical workflow is reference material; its role gates are superseded. This handover does not itself begin development or authorize deployment.

Read this file first, then inspect the actual source relevant to the work. Read [the S001 acceptance contract](../projectmanagement/sprints/S001.md) and [test matrix](../projectmanagement/TEST-PLAN.md) when hardening the round-trip. Consult the [audit](../projectmanagement/reports/2026-09-08-baseline-audit.md) for reproducers and the [backlog](../projectmanagement/BACKLOG.md) for later detail. No need to ingest every report or old chat up front. Historical proposed module names and implementation approaches are suggestions; the Pro model decides how to code.

## Original product and current implementation

A local-first cloud architecture workbench: find a template, open/edit it in Draw.io, export semantic JSON for an external AI, paste precise changes back, and retain an editable diagram. GitHub archives the canonical uncompressed Draw.io XML. Draw.io remains the diagram editor; there is no custom diagram engine, backend, database, required AI account or API key.

Implemented: static React/TypeScript/Vite app with Fluent UI; searchable/provider-filtered catalog; five templates (Fabric medallion, Azure streaming, AWS serverless, GCP pipeline, generic CDC); GitHub/Draw.io source links; local file import; semantic JSON copy; five v1 patch operations; XML download; build-only CI and Netlify configuration. Configuration is not evidence of a live deployment.

Source map: `src/App.tsx` owns the UI and workspace state; `src/lib/drawio.ts` owns XML export, patching and browser helpers; `src/data/templates.ts` owns catalog metadata; `templates/` holds the five canonical diagrams. There is no automated test suite or root lockfile. No S001 development branch, development report, independent S001 QA or lead acceptance exists.

## Broken or unsafe today

These remain unresolved in the unchanged source. The completed earlier smoke test confirmed the unknown-operation defect; the other audit findings are principally source analysis, not a comprehensive runtime certification.

- Unknown patch operations silently succeed; field types and values lack strict runtime validation.
- Duplicate requested IDs are silently renamed. Later connections can target the original node instead of the newly added node.
- Non-Draw.io XML and compressed payloads can appear to load as empty graphs. Global cell selection and hardcoded parent `1` make multipage, groups, alternate layers and duplicate IDs unsafe.
- Template loads lack error/race protection and update related state separately. Clipboard failures are not handled. Replacing modified work has no guard.
- Patches apply immediately with no review or undo. Imported filenames are lost. Editing the repository source in Draw.io does not transfer local changes.
- Templates are fetched from moving GitHub main, so a local/branch build does not necessarily use its own templates and needs external network access.
- v1 AI responses carry no source/revision binding. Work is lost on refresh. Download/browser interoperability and broad accessibility remain insufficiently qualified.

## Remaining outcomes for the app

1. **Trustworthy basic round-trip (unfinished S001):** explicitly accept the supported single-page, uncompressed, flat graph profile and reject unsupported files without losing the current document; strict ordered patch validation; exact IDs; all-or-nothing changes; preservation of untouched XML; consistent workspace/load behavior; review before apply; undo; filename retention; clear current-file download/editor guidance; templates tied to the app build. Reproducible installation, behavioral tests, real browser journeys and CI must establish these guarantees. None is complete merely because it appears in a sprint document.
2. **Reliable continued use:** source-bound AI responses that refuse stale/wrong-document patches; complete copy/paste AI instructions; local draft recovery with understandable restore/discard and storage-failure behavior.
3. **Ordinary Draw.io compatibility:** compressed files, multiple pages/layers, groups/containers and wrapped metadata, preserving inactive content and meaningful identities. The Pro model must determine supported limits before claiming broad compatibility.
4. **Useful finished catalog:** accurate architecture guidance, assumptions, tradeoffs and provenance; previews reflecting actual diagrams; effective discovery; reviewed provider assets where useful.
5. **Release readiness:** prove download/edit/reimport behavior, agreed browser support, keyboard/accessibility tasks, error recovery and reasonable large-document limits; document actual limitations and verify the chosen release environment.

An embedded editor, direct Git writes, direct AI calls and MCP are optional extensions, not prerequisites for the core app. “Full app” has no further user-approved release specification; the destination above is the recorded vision. Do not silently expand it into collaboration, provisioning or a paid service. The Pro model can revise sequencing and engineering choices; preserve canonical XML and stable IDs unless the user agrees to a product change.

## Resume prompt

> Take over DrawCloud from branch codex/pro-ai-handover-2026-09-11. Read handover/README.md and handover/GIT-AND-EVIDENCE.md first. Own architecture, coding and verification in this task; avoid multi-agent coordination and repeated planning. Inspect the real source, finish the integrity and recovery outcomes before expanding features, and use the existing acceptance/test requirements where applicable. Decide implementation yourself. Record concise progress and honest test evidence; do not treat historical plans or smoke tests as completed development. Do not publish, merge or deploy without my authorization.
