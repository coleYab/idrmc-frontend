'use client';

import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Incident } from '../../types';

const severityColors: Record<string, string> = {
  Critical: 'bg-red-600 text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-yellow-500 text-black',
  Low: 'bg-green-500 text-white'
};

const statusColors: Record<string, string> = {
  Pending: 'bg-gray-500 text-white',
  Verified: 'bg-blue-500 text-white',
  Active: 'bg-red-500 text-white',
  Resolved: 'bg-green-600 text-white',
  Rejected: 'bg-slate-400 text-white'
};

export function IncidentMapPopupContent({ incident }: { incident: Incident }) {
  return (
    <div className='flex min-w-[220px] flex-col gap-2'>
      <h3 className='text-sm leading-tight font-semibold'>{incident.title}</h3>
      <p className='text-muted-foreground line-clamp-2 text-xs'>
        {incident.description}
      </p>
      <div className='flex flex-wrap gap-1'>
        <Badge
          className={`text-[10px] ${incident.incidentType === 'Flood' ? 'bg-cyan-600' : incident.incidentType === 'Drought' ? 'bg-amber-700' : incident.incidentType === 'Landslide' ? 'bg-stone-600' : incident.incidentType === 'Locust' ? 'bg-lime-700' : incident.incidentType === 'Conflict' ? 'bg-purple-700' : incident.incidentType === 'Fire' ? 'bg-red-700' : ''} text-white`}
        >
          {incident.incidentType}
        </Badge>
        <Badge
          className={`text-[10px] ${severityColors[incident.severity] ?? ''}`}
        >
          {incident.severity}
        </Badge>
        <Badge className={`text-[10px] ${statusColors[incident.status] ?? ''}`}>
          {incident.status}
        </Badge>
      </div>
      <p className='text-muted-foreground text-[10px]'>{incident.location}</p>
      <Button variant='outline' size='sm' className='h-7 text-xs' asChild>
        <Link href={`/incval/incidents/${incident.id}/details`}>
          <IconExternalLink className='mr-1 h-3 w-3' />
          View Details
        </Link>
      </Button>
    </div>
  );
}
