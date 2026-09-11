# DrawCloud

**Pro AI takeover:** start with [handover/README.md](handover/README.md) for actual progress, unresolved defects, test evidence and remaining product outcomes.

Draw.io-first cloud architecture workbench.

## Product boundary

DrawCloud does **not** implement another diagram engine. Draw.io owns visual editing, layout, connectors, routing and export. DrawCloud adds:

- a searchable cloud architecture template catalog;
- GitHub-backed editable `.drawio` sources;
- direct `Open in Draw.io` links;
- semantic JSON export for copy/paste AI workflows;
- safe AI patch import that updates stable node/edge IDs without regenerating the whole diagram;
- local `.drawio` import and download.

No backend, database, API key or MCP server is required.

## Development coordination

Architecture, sprint scope, implementation instructions, independent QA and technical review live in [projectmanagement/README.md](projectmanagement/README.md). Agents start with [AGENTS.md](AGENTS.md) and [the current status](projectmanagement/STATUS.md). The management documents distinguish the current prototype from planned behavior.

## Canonical format

Native uncompressed `.drawio` XML is the source of truth. This keeps diagrams editable in diagrams.net and makes Git diffs readable.

```text
GitHub .drawio XML
      |
      +--> Draw.io visual editing
      |
      +--> DrawCloud semantic JSON --> ChatGPT
                                      |
                                      +--> drawcloud-patch-v1
                                              |
                                              +--> apply to existing XML
```

## AI round-trip

1. Open a template in DrawCloud.
2. Click **Copy JSON**.
3. Paste the JSON into ChatGPT with the requested architecture change.
4. Ask ChatGPT to return a `drawcloud-patch-v1` JSON object.
5. Paste the patch into DrawCloud and click **Apply changes**.
6. Download the updated `.drawio` or continue editing visually in Draw.io.

Supported patch operations:

- `updateNode`
- `addNode`
- `deleteNode`
- `connect`
- `deleteEdge`

Example:

```json
{
  "format": "drawcloud-patch-v1",
  "operations": [
    { "op": "updateNode", "id": "source", "label": "Salesforce" },
    { "op": "addNode", "id": "eventstream", "label": "Fabric Eventstream", "x": 360, "y": 360 },
    { "op": "connect", "id": "e-salesforce-eventstream", "source": "source", "target": "eventstream" }
  ]
}
```

## Initial templates

- Fabric Medallion
- Azure Streaming
- AWS Serverless API
- GCP Data Pipeline
- Generic CDC to Analytics

These are starter patterns with stable semantic IDs. Provider-official icon libraries can be layered in without changing the storage or AI-patch model.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Repository layout

```text
src/
  data/templates.ts
  lib/drawio.ts
  App.tsx

templates/
  fabric/
  azure/
  aws/
  gcp/
  generic/
```

## Design rules

- Draw.io remains the editor.
- GitHub remains the archive/version history.
- `.drawio` XML remains canonical.
- AI uses stable semantic IDs, not DOM selectors or screenshot interpretation.
- Existing geometry and styling are preserved unless a patch explicitly changes them.
- MCP may be added later as an optional automation path, never as a requirement.
