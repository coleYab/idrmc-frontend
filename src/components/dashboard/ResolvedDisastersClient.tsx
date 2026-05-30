'use client';

import { useDisasters } from '@/features/disasters/api/disasters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IconMapPin,
  IconUsers,
  IconClock,
  IconUser,
  IconCheck
} from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const getSeverityColor = (severity: string) => {
  const s = severity.toLowerCase();
  if (s === 'critical') return 'destructive';
  if (s === 'high') return 'destructive';
  if (s === 'medium') return 'secondary';
  if (s === 'low') return 'outline';
  return 'outline';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function ResolvedDisastersClient() {
  const router = useRouter();
  const { data: disasters } = useDisasters();
  const allDisasters = disasters ?? [];
  const resolvedDisasters = allDisasters.filter(
    (incident) =>
      incident.status === 'Resolved' || incident.status === 'resolved'
  );

  return (
    <div className='space-y-6'>
      {resolvedDisasters.length > 0 ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {resolvedDisasters.map((disaster) => (
            <Card
              key={disaster.id}
              className='hover:bg-muted/30 pointer-events-auto cursor-pointer opacity-80 transition-shadow hover:shadow-lg'
              onClick={() =>
                router.push(`/disastermanager/disasters/${disaster.id}/details`)
              }
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>{disaster.title}</CardTitle>
                    <CardDescription>{disaster.description}</CardDescription>
                  </div>
                  <Badge
                    variant={getSeverityColor(disaster.severity)}
                    className='ml-2'
                  >
                    {disaster.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='flex items-center gap-2'>
                    <IconMapPin className='text-muted-foreground size-4' />
                    <span className='truncate'>{disaster.location}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconUsers className='text-muted-foreground size-4' />
                    <span>
                      {disaster.affectedPopulationCount.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconUser className='text-muted-foreground size-4' />
                    <span className='truncate'>
                      {(disaster as any).reportedBy ?? 'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconClock className='text-muted-foreground size-4' />
                    <span>{formatDate(disaster.createdAt ?? '')}</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Incident Type:
                    </span>
                    <Badge variant='outline'>{disaster.incidentType}</Badge>
                  </div>
                  {(disaster as any).resolvedAt && (
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        Resolved At:
                      </span>
                      <span className='text-xs font-medium'>
                        {formatDate((disaster as any).resolvedAt)}
                      </span>
                    </div>
                  )}
                  {(disaster as any).resolvedBy && (
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        Resolved By:
                      </span>
                      <span className='text-xs font-medium'>
                        {(disaster as any).resolvedBy}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className='flex gap-2 pt-2'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    asChild
                    size='sm'
                    className='flex-1'
                    variant='outline'
                  >
                    <Link
                      href={`/disastermanager/disasters/${disaster.id}/details`}
                    >
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <IconCheck className='text-muted-foreground mb-4 size-12' />
            <h3 className='mb-2 text-lg font-semibold'>No result found</h3>
            <p className='text-muted-foreground max-w-md text-center'>
              There are currently no resolved disasters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
