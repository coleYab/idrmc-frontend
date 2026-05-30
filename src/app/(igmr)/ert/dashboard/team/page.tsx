'use client';

import { useErtUnits } from '@/features/ert/api/ert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { IconUsers } from '@tabler/icons-react';

const statusVariant = (s: string) =>
  s === 'DEPLOYED' ? 'destructive' : s === 'IDLE' ? 'outline' : 'secondary';

const statusLabel = (s: string) =>
  s === 'IDLE' ? 'Available' : s === 'DEPLOYED' ? 'Deployed' : s;

export default function TeamPage() {
  const { data, isLoading } = useErtUnits();

  const units = data?.items ?? [];

  return (
    <div className='@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6'>
      <div>
        <h2 className='text-xl font-semibold'>Team Status</h2>
        <p className='text-muted-foreground text-sm'>
          Current status of all ERT units
        </p>
      </div>
      {isLoading ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className='pb-2'>
                <Skeleton className='h-5 w-24' />
              </CardHeader>
              <CardContent className='space-y-1'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-36' />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : units.length === 0 ? (
        <div className='border-muted text-muted-foreground flex flex-col items-center gap-2 rounded-2xl border border-dashed p-12 text-center'>
          <IconUsers className='size-10' />
          <p className='text-sm font-medium'>No ERT units registered</p>
          <p className='text-xs'>
            Units will appear here once they are created and deployed.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {units.map((unit) => (
            <Card key={unit.unitID}>
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>{unit.name}</CardTitle>
                  <Badge
                    variant={statusVariant(unit.status)}
                    className='capitalize'
                  >
                    {statusLabel(unit.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-1 text-sm'>
                <p>
                  Region:{' '}
                  <span className='font-medium'>
                    {unit.region ?? 'Not assigned'}
                  </span>
                </p>
                <p>
                  Status:{' '}
                  <span className='font-medium'>
                    {statusLabel(unit.status)}
                  </span>
                </p>
                {unit.location && (
                  <p>
                    Location:{' '}
                    <span className='font-medium'>
                      {unit.location.latitude.toFixed(4)},{' '}
                      {unit.location.longitude.toFixed(4)}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
