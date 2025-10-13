'use client';

import { use } from 'react';
import DatasetViewer from '@/components/sections/DatasetViewerSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DatasetPage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  return <DatasetViewer datasetId={resolvedParams.id} />;
}
