'use client';

import { Badge } from '@/components/ui/badge';
import type { ErtUnit } from '../../types';

interface ErtMapPopupContentProps {
  unit: ErtUnit;
}

const statusColors: Record<string, string> = {
  IDLE: 'bg-green-500 text-white',
  DEPLOYED: 'bg-blue-500 text-white',
  MAINTENANCE: 'bg-yellow-500 text-black'
};

export function ErtMapPopupContent({ unit }: ErtMapPopupContentProps) {
  return (
    <div className='flex min-w-[200px] flex-col gap-2'>
      <h3 className='text-sm leading-tight font-semibold'>{unit.name}</h3>
      <div className='flex flex-wrap gap-1'>
        <Badge className={`text-[10px] ${statusColors[unit.status] ?? ''}`}>
          {unit.status}
        </Badge>
      </div>
      <p className='text-muted-foreground text-[10px]'>
        {unit.region ?? 'Region not specified'}
      </p>
      {unit.location && (
        <p className='text-muted-foreground text-[10px]'>
          {unit.location.latitude.toFixed(4)},{' '}
          {unit.location.longitude.toFixed(4)}
        </p>
      )}
    </div>
  );
}
