'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconFirstAidKit,
  IconUsers
} from '@tabler/icons-react';
import { useIncidents } from '@/features/incidents/api/incidents';
import { useErtUnits } from '@/features/ert/api/ert';

export function ErtMetricsCards() {
  const { data: incidentsData, isLoading: incidentsLoading } = useIncidents();
  const { data: unitsData, isLoading: unitsLoading } = useErtUnits();

  const isLoading = incidentsLoading || unitsLoading;

  const activeIncidents =
    incidentsData?.items?.filter(
      (i) => i.status === 'Active' || i.status === 'Verified'
    ).length ?? 0;
  const urgentMedical =
    incidentsData?.items?.filter((i) => i.requiresUrgentMedical).length ?? 0;
  const deployedUnits =
    unitsData?.items?.filter((u) => u.status === 'DEPLOYED').length ?? 0;
  const availableUnits =
    unitsData?.items?.filter((u) => u.status === 'IDLE').length ?? 0;

  return (
    <div className='grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Incidents</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? <Skeleton className='h-8 w-12' /> : activeIncidents}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconAlertTriangle className='size-4' />
              Live
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Urgent Medical</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? <Skeleton className='h-8 w-12' /> : urgentMedical}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconFirstAidKit className='size-4' />
              Requires attention
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Deployed Units</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? <Skeleton className='h-8 w-12' /> : deployedUnits}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconUsers className='size-4' />
              In field
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Available Units</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {isLoading ? <Skeleton className='h-8 w-12' /> : availableUnits}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconCircleCheck className='size-4' />
              Ready
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
