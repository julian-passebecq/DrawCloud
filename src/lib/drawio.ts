export type AiNode = {
  id: string;
  label: string;
  style?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export type AiEdge = {
  id: string;
  label?: string;
  source?: string;
  target?: string;
  style?: string;
};

export type AiDocument = {
  format: 'drawcloud-ai-v1';
  nodes: AiNode[];
  edges: AiEdge[];
};

export type AiPatchOperation =
  | { op: 'updateNode'; id: string; label?: string; style?: string }
  | { op: 'addNode'; id: string; label: string; style?: string; x?: number; y?: number; width?: number; height?: number }
  | { op: 'deleteNode'; id: string }
  | { op: 'connect'; id: string; source: string; target: string; label?: string; style?: string }
  | { op: 'deleteEdge'; id: string };

export type AiPatch = {
  format: 'drawcloud-patch-v1';
  operations: AiPatchOperation[];
};

const parser = new DOMParser();
const serializer = new XMLSerializer();

function parseXml(xml: string) {
  const doc = parser.parseFromString(xml, 'application/xml');
  const error = doc.querySelector('parsererror');
  if (error) throw new Error('Invalid Draw.io XML.');
  return doc;
}

function cellLabel(cell: Element) {
  return cell.getAttribute('value') ?? '';
}

export function drawioToAi(xml: string): AiDocument {
  const doc = parseXml(xml);
  const cells = Array.from(doc.querySelectorAll('mxCell'));
  const nodes: AiNode[] = [];
  const edges: AiEdge[] = [];

  for (const cell of cells) {
    const id = cell.getAttribute('id');
    if (!id) continue;

    if (cell.getAttribute('vertex') === '1') {
      const g = cell.querySelector(':scope > mxGeometry');
      nodes.push({
        id,
        label: cellLabel(cell),
        style: cell.getAttribute('style') ?? undefined,
        x: Number(g?.getAttribute('x') ?? 0),
        y: Number(g?.getAttribute('y') ?? 0),
        width: Number(g?.getAttribute('width') ?? 120),
        height: Number(g?.getAttribute('height') ?? 60),
      });
    } else if (cell.getAttribute('edge') === '1') {
      edges.push({
        id,
        label: cellLabel(cell) || undefined,
        source: cell.getAttribute('source') ?? undefined,
        target: cell.getAttribute('target') ?? undefined,
        style: cell.getAttribute('style') ?? undefined,
      });
    }
  }

  return { format: 'drawcloud-ai-v1', nodes, edges };
}

function rootLayer(doc: XMLDocument) {
  const root = doc.querySelector('mxGraphModel > root');
  if (!root) throw new Error('No mxGraphModel/root found.');
  return root;
}

function uniqueId(doc: XMLDocument, preferred: string) {
  if (!doc.getElementById(preferred) && !doc.querySelector(`mxCell[id="${CSS.escape(preferred)}"]`)) return preferred;
  let i = 2;
  while (doc.querySelector(`mxCell[id="${CSS.escape(`${preferred}-${i}`)}"]`)) i += 1;
  return `${preferred}-${i}`;
}

export function applyAiPatch(xml: string, patch: AiPatch): string {
  if (patch.format !== 'drawcloud-patch-v1' || !Array.isArray(patch.operations)) {
    throw new Error('Unsupported AI patch format.');
  }

  const doc = parseXml(xml);
  const root = rootLayer(doc);

  for (const operation of patch.operations) {
    if (operation.op === 'updateNode') {
      const cell = doc.querySelector(`mxCell[id="${CSS.escape(operation.id)}"][vertex="1"]`);
      if (!cell) throw new Error(`Node not found: ${operation.id}`);
      if (operation.label !== undefined) cell.setAttribute('value', operation.label);
      if (operation.style !== undefined) cell.setAttribute('style', operation.style);
    }

    if (operation.op === 'deleteNode') {
      const cell = doc.querySelector(`mxCell[id="${CSS.escape(operation.id)}"][vertex="1"]`);
      if (!cell) throw new Error(`Node not found: ${operation.id}`);
      const attached = Array.from(doc.querySelectorAll(`mxCell[edge="1"][source="${CSS.escape(operation.id)}"], mxCell[edge="1"][target="${CSS.escape(operation.id)}"]`));
      attached.forEach(edge => edge.remove());
      cell.remove();
    }

    if (operation.op === 'addNode') {
      const id = uniqueId(doc, operation.id);
      const cell = doc.createElement('mxCell');
      cell.setAttribute('id', id);
      cell.setAttribute('value', operation.label);
      cell.setAttribute('vertex', '1');
      cell.setAttribute('parent', '1');
      cell.setAttribute('style', operation.style ?? 'rounded=1;whiteSpace=wrap;html=1;');
      const geometry = doc.createElement('mxGeometry');
      geometry.setAttribute('x', String(operation.x ?? 80));
      geometry.setAttribute('y', String(operation.y ?? 80));
      geometry.setAttribute('width', String(operation.width ?? 160));
      geometry.setAttribute('height', String(operation.height ?? 64));
      geometry.setAttribute('as', 'geometry');
      cell.appendChild(geometry);
      root.appendChild(cell);
    }

    if (operation.op === 'connect') {
      const source = doc.querySelector(`mxCell[id="${CSS.escape(operation.source)}"][vertex="1"]`);
      const target = doc.querySelector(`mxCell[id="${CSS.escape(operation.target)}"][vertex="1"]`);
      if (!source || !target) throw new Error(`Cannot connect missing nodes: ${operation.source} -> ${operation.target}`);
      const cell = doc.createElement('mxCell');
      cell.setAttribute('id', uniqueId(doc, operation.id));
      cell.setAttribute('value', operation.label ?? '');
      cell.setAttribute('edge', '1');
      cell.setAttribute('parent', '1');
      cell.setAttribute('source', operation.source);
      cell.setAttribute('target', operation.target);
      cell.setAttribute('style', operation.style ?? 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;');
      const geometry = doc.createElement('mxGeometry');
      geometry.setAttribute('relative', '1');
      geometry.setAttribute('as', 'geometry');
      cell.appendChild(geometry);
      root.appendChild(cell);
    }

    if (operation.op === 'deleteEdge') {
      const cell = doc.querySelector(`mxCell[id="${CSS.escape(operation.id)}"][edge="1"]`);
      if (!cell) throw new Error(`Edge not found: ${operation.id}`);
      cell.remove();
    }
  }

  return serializer.serializeToString(doc);
}

export function githubDrawioUrl(path: string) {
  const location = `julian-passebecq/DrawCloud/main/${path}`;
  return `https://app.diagrams.net/?mode=github#H${encodeURIComponent(location)}`;
}

export function githubFileUrl(path: string) {
  return `https://github.com/julian-passebecq/DrawCloud/blob/main/${path}`;
}

export function downloadText(filename: string, content: string, type = 'application/xml') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
