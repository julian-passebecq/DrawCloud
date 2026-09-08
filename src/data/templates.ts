export type CloudProvider = 'Fabric' | 'Azure' | 'AWS' | 'GCP' | 'Generic';

export type DiagramTemplate = {
  id: string;
  title: string;
  provider: CloudProvider;
  category: string;
  description: string;
  tags: string[];
  path: string;
  source: string;
};

export const templates: DiagramTemplate[] = [
  {
    id: 'fabric-medallion',
    title: 'Fabric Medallion',
    provider: 'Fabric',
    category: 'Lakehouse',
    description: 'Source to Bronze, Silver, Gold, semantic model and Power BI.',
    tags: ['medallion', 'lakehouse', 'power bi', 'data engineering'],
    path: 'templates/fabric/medallion.drawio',
    source: 'Curated DrawCloud starter',
  },
  {
    id: 'azure-streaming',
    title: 'Azure Streaming',
    provider: 'Azure',
    category: 'Streaming',
    description: 'Event ingestion, stream processing, storage and serving.',
    tags: ['event hubs', 'streaming', 'realtime'],
    path: 'templates/azure/streaming.drawio',
    source: 'Curated DrawCloud starter',
  },
  {
    id: 'aws-serverless',
    title: 'AWS Serverless API',
    provider: 'AWS',
    category: 'Application',
    description: 'Client, API gateway, functions, persistence and observability.',
    tags: ['serverless', 'api', 'lambda'],
    path: 'templates/aws/serverless.drawio',
    source: 'Curated DrawCloud starter',
  },
  {
    id: 'gcp-data-pipeline',
    title: 'GCP Data Pipeline',
    provider: 'GCP',
    category: 'Data',
    description: 'Ingest, process, warehouse and BI serving pattern.',
    tags: ['bigquery', 'pipeline', 'analytics'],
    path: 'templates/gcp/data-pipeline.drawio',
    source: 'Curated DrawCloud starter',
  },
  {
    id: 'generic-cdc',
    title: 'CDC to Analytics',
    provider: 'Generic',
    category: 'Data',
    description: 'Portable change-data-capture pattern independent of provider.',
    tags: ['cdc', 'stream', 'warehouse'],
    path: 'templates/generic/cdc.drawio',
    source: 'Curated DrawCloud starter',
  },
];

export const providers: Array<'All' | CloudProvider> = ['All', 'Fabric', 'Azure', 'AWS', 'GCP', 'Generic'];
