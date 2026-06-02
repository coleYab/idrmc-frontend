'use client';

import { Card } from '@/components/ui/card';
import { ErtMapView } from './ert-map-view';
import type { ErtUnit } from '../../types';

interface ErtMapExplorerProps {
  units: ErtUnit[];
}

export function ErtMapExplorer({ units }: ErtMapExplorerProps) {
  return (
    <Card className='p-4'>
      <ErtMapView units={units} />
    </Card>
  );
}
