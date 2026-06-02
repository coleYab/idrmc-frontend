'use client';

import { Card } from '@/components/ui/card';
import { IncidentMapView } from './incident-map-view';
import type { Incident } from '../../types';

interface IncidentMapExplorerProps {
  incidents: Incident[];
}

export function IncidentMapExplorer({ incidents }: IncidentMapExplorerProps) {
  return (
    <Card className='p-4'>
      <IncidentMapView incidents={incidents} />
    </Card>
  );
}
