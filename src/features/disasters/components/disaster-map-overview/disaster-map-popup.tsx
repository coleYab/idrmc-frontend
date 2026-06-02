'use client';

import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Disaster } from '../../types';

const severityColors: Record<string, string> = {
  Critical: 'bg-red-600 text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-yellow-500 text-black',
  Low: 'bg-green-500 text-white'
};

export function DisasterMapPopupContent({ disaster }: { disaster: Disaster }) {
  return (
    <div className='flex min-w-[220px] flex-col gap-2'>
      <h3 className='text-sm leading-tight font-semibold'>{disaster.title}</h3>
      <p className='text-muted-foreground line-clamp-2 text-xs'>
        {disaster.description}
      </p>
      <div className='flex flex-wrap gap-1'>
        <Badge
          className={`text-[10px] ${
            disaster.incidentType === 'Flood'
              ? 'bg-cyan-600'
              : disaster.incidentType === 'Drought'
                ? 'bg-amber-700'
                : disaster.incidentType === 'Landslide'
                  ? 'bg-stone-600'
                  : disaster.incidentType === 'Locust'
                    ? 'bg-lime-700'
                    : disaster.incidentType === 'Conflict'
                      ? 'bg-purple-700'
                      : 'bg-red-700'
          } text-white`}
        >
          {disaster.incidentType}
        </Badge>
        <Badge
          className={`text-[10px] ${severityColors[disaster.severity] ?? ''}`}
        >
          {disaster.severity}
        </Badge>
        <Badge className='bg-blue-600 text-[10px] text-white'>
          {disaster.status}
        </Badge>
      </div>
      <p className='text-muted-foreground text-[10px]'>{disaster.location}</p>
      <Button variant='outline' size='sm' className='h-7 text-xs' asChild>
        <Link href={`/disastermanager/disasters/${disaster.id}/details`}>
          <IconExternalLink className='mr-1 h-3 w-3' />
          View Details
        </Link>
      </Button>
    </div>
  );
}
