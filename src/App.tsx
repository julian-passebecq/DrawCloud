import { useMemo, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider,
  Field,
  Input,
  Label,
  MessageBar,
  MessageBarBody,
  Select,
  Textarea,
  Title1,
  Title3,
} from '@fluentui/react-components';
import { providers, templates, type DiagramTemplate } from './data/templates';
import {
  applyAiPatch,
  downloadText,
  drawioToAi,
  githubDrawioUrl,
  githubFileUrl,
  type AiPatch,
} from './lib/drawio';

const RAW_ROOT = 'https://raw.githubusercontent.com/julian-passebecq/DrawCloud/main/';

export default function App() {
  const [provider, setProvider] = useState('All');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<DiagramTemplate | null>(null);
  const [xml, setXml] = useState('');
  const [aiJson, setAiJson] = useState('');
  const [patchText, setPatchText] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter(template => {
      const providerMatch = provider === 'All' || template.provider === provider;
      const haystack = [template.title, template.provider, template.category, template.description, ...template.tags]
        .join(' ')
        .toLowerCase();
      return providerMatch && (!q || haystack.includes(q));
    });
  }, [provider, query]);

  async function loadTemplate(template: DiagramTemplate) {
    setStatus(null);
    const response = await fetch(`${RAW_ROOT}${template.path}`);
    if (!response.ok) throw new Error(`Could not load ${template.path}`);
    const source = await response.text();
    setActive(template);
    setXml(source);
    setAiJson(JSON.stringify(drawioToAi(source), null, 2));
    setPatchText('');
    setStatus(`Loaded ${template.title}. The .drawio XML remains the source of truth.`);
  }

  async function copyAi() {
    if (!aiJson) return;
    await navigator.clipboard.writeText(aiJson);
    setStatus('AI JSON copied. Paste it into ChatGPT and ask for a drawcloud-patch-v1 response.');
  }

  function applyPatch() {
    try {
      if (!xml) throw new Error('Load a template or local .drawio file first.');
      const patch = JSON.parse(patchText) as AiPatch;
      const updated = applyAiPatch(xml, patch);
      setXml(updated);
      setAiJson(JSON.stringify(drawioToAi(updated), null, 2));
      setStatus('Patch applied locally. Existing node geometry and styles are preserved unless explicitly changed.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not apply patch.');
    }
  }

  async function importLocal(file: File) {
    try {
      const source = await file.text();
      const semantic = drawioToAi(source);
      setActive(null);
      setXml(source);
      setAiJson(JSON.stringify(semantic, null, 2));
      setPatchText('');
      setStatus(`Loaded local file: ${file.name}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not read file.');
    }
  }

  const filename = active ? active.path.split('/').pop() ?? 'diagram.drawio' : 'diagram.drawio';

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">DRAW.IO-FIRST CLOUD ARCHITECTURE</div>
          <Title1>DrawCloud</Title1>
          <p className="subtitle">Templates, Git history and a copy/paste AI bridge. Draw.io remains the editor.</p>
        </div>
        <div className="top-actions">
          <Button appearance="secondary" onClick={() => fileRef.current?.click()}>Open local .drawio</Button>
          <input
            ref={fileRef}
            type="file"
            accept=".drawio,.xml"
            hidden
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) void importLocal(file);
              event.currentTarget.value = '';
            }}
          />
          <Button as="a" appearance="primary" href="https://app.diagrams.net/?mode=github" target="_blank">New in Draw.io</Button>
        </div>
      </header>

      <Divider />

      <main className="workspace">
        <aside className="sidebar">
          <Label weight="semibold">Provider</Label>
          <Select value={provider} onChange={(_, data) => setProvider(data.value)}>
            {providers.map(item => <option key={item}>{item}</option>)}
          </Select>

          <Field label="Search templates">
            <Input value={query} onChange={(_, data) => setQuery(data.value)} placeholder="medallion, CDC, serverless…" />
          </Field>

          <div className="side-note">
            <strong>Storage model</strong>
            <span>GitHub stores editable `.drawio` XML. No database and no MCP dependency.</span>
          </div>
        </aside>

        <section className="catalog">
          <div className="section-heading">
            <Title3>Architecture templates</Title3>
            <span>{filtered.length} available</span>
          </div>

          <div className="card-grid">
            {filtered.map(template => (
              <Card key={template.id} className="template-card">
                <CardHeader
                  header={<strong>{template.title}</strong>}
                  description={`${template.provider} · ${template.category}`}
                />
                <div className={`diagram-preview provider-${template.provider.toLowerCase()}`}>
                  <span>{template.provider}</span>
                  <div className="flow-line" />
                  <span>{template.category}</span>
                </div>
                <p>{template.description}</p>
                <div className="tags">
                  {template.tags.slice(0, 3).map(tag => <Badge key={tag} appearance="tint">{tag}</Badge>)}
                </div>
                <CardFooter>
                  <Button appearance="primary" onClick={() => void loadTemplate(template)}>Use template</Button>
                  <Button as="a" href={githubDrawioUrl(template.path)} target="_blank">Open in Draw.io</Button>
                  <Button as="a" href={githubFileUrl(template.path)} target="_blank">Git</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <section className="ai-workbench">
        <div className="workbench-heading">
          <div>
            <div className="eyebrow">AI ROUND-TRIP</div>
            <Title3>{active ? active.title : 'Local diagram workspace'}</Title3>
          </div>
          <div className="top-actions">
            <Button disabled={!xml} onClick={() => downloadText(filename, xml)}>Download .drawio</Button>
            {active && <Button as="a" appearance="primary" href={githubDrawioUrl(active.path)} target="_blank">Edit source in Draw.io</Button>}
          </div>
        </div>

        {status && <MessageBar><MessageBarBody>{status}</MessageBarBody></MessageBar>}

        <div className="ai-columns">
          <div className="panel">
            <div className="panel-title">
              <strong>1. Copy for ChatGPT</strong>
              <Button size="small" disabled={!aiJson} onClick={() => void copyAi()}>Copy JSON</Button>
            </div>
            <p>Ask ChatGPT to return only a <code>drawcloud-patch-v1</code> object. IDs are stable so layout is not regenerated.</p>
            <Textarea resize="vertical" value={aiJson} readOnly placeholder="Load a template first." />
          </div>

          <div className="panel">
            <div className="panel-title">
              <strong>2. Paste AI patch</strong>
              <Button size="small" appearance="primary" disabled={!patchText.trim()} onClick={applyPatch}>Apply changes</Button>
            </div>
            <p>Supported operations: <code>updateNode</code>, <code>addNode</code>, <code>deleteNode</code>, <code>connect</code>, <code>deleteEdge</code>.</p>
            <Textarea
              resize="vertical"
              value={patchText}
              onChange={(_, data) => setPatchText(data.value)}
              placeholder={'{\n  "format": "drawcloud-patch-v1",\n  "operations": []\n}'}
            />
          </div>
        </div>
      </section>

      <footer>
        Native Draw.io XML is canonical · GitHub is the archive · AI is an optional copy/paste transformation layer
      </footer>
    </div>
  );
}
