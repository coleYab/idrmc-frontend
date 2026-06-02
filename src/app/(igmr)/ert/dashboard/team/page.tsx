'use client';

import { useErtUnits } from '@/features/ert/api/ert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { IconUsers, IconMapPin, IconClock } from '@tabler/icons-react';
import { mockErtUnits } from '@/lib/mock/ert';

const statusVariant = (s: string) =>
  s === 'DEPLOYED' ? 'destructive' : s === 'IDLE' ? 'outline' : 'secondary';

const statusLabel = (s: string) =>
  s === 'IDLE'
    ? 'Available'
    : s === 'DEPLOYED'
      ? 'Deployed'
      : s === 'MAINTENANCE'
        ? 'Maintenance'
        : s;

export default function TeamPage() {
  const { data, isLoading, isError } = useErtUnits();

  const apiUnits = data?.items ?? [];
  const units = isError || apiUnits.length === 0 ? mockErtUnits : apiUnits;

  const deployedCount = units.filter((u) => u.status === 'DEPLOYED').length;
  const idleCount = units.filter((u) => u.status === 'IDLE').length;
  const maintenanceCount = units.filter(
    (u) => u.status === 'MAINTENANCE'
  ).length;

  return (
    <div className='@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Team Status</h2>
          <p className='text-muted-foreground text-sm'>
            Current status of all ERT units
          </p>
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <Badge variant='destructive'>{deployedCount} deployed</Badge>
          <Badge variant='outline'>{idleCount} idle</Badge>
          {maintenanceCount > 0 && (
            <Badge variant='secondary'>{maintenanceCount} maintenance</Badge>
          )}
          <Badge variant='outline' className='text-muted-foreground'>
            {units.length} total
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
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
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
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
                <CardDescription className='flex items-center gap-1 pt-1'>
                  <IconMapPin className='size-3' />
                  {unit.region ?? 'Not assigned'}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm'>
                {unit.location && (
                  <div className='text-muted-foreground flex items-center gap-1'>
                    <IconMapPin className='size-3' />
                    <span>
                      {unit.location.latitude.toFixed(4)},{' '}
                      {unit.location.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
                {unit.updatedAt && (
                  <div className='text-muted-foreground flex items-center gap-1'>
                    <IconClock className='size-3' />
                    <span>
                      Updated {new Date(unit.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className='pt-1'>
                  <Badge variant='secondary' className='text-xs'>
                    {unit.status === 'DEPLOYED'
                      ? '🟢 Active'
                      : unit.status === 'IDLE'
                        ? '⏸️ Standby'
                        : '🔧 Service'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
