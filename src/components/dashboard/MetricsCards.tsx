import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconCircleCheck
} from '@tabler/icons-react';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus } from '@/lib/types/incident';

interface MetricsCardsProps {
  className?: string;
}

export function MetricsCards({ className }: MetricsCardsProps) {
  // Calculate metrics from mock data
  const pendingReports = mockIncidents.filter(
    (incident) => incident.status === IncidentStatus.PENDING
  ).length;
  const activeIncidents = mockIncidents.filter(
    (incident) => incident.status === IncidentStatus.ACTIVE
  ).length;
  const resolvedIncidents = mockIncidents.filter(
    (incident) => incident.status === IncidentStatus.RESOLVED
  ).length;
  const totalIncidents = mockIncidents.length;

  const pendingPercentage =
    totalIncidents > 0
      ? Math.round((pendingReports / totalIncidents) * 100)
      : 0;
  const activePercentage =
    totalIncidents > 0
      ? Math.round((activeIncidents / totalIncidents) * 100)
      : 0;
  const resolvedPercentage =
    totalIncidents > 0
      ? Math.round((resolvedIncidents / totalIncidents) * 100)
      : 0;

  return (
    <div
      className={`grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 ${className || ''}`}
    >
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Pending Reports</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {pendingReports}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconAlertTriangle className='size-4' />
              {pendingPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardAction className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Awaiting verification <IconAlertTriangle className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Reports requiring immediate attention
          </div>
        </CardAction>
      </Card>

      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Incidents</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {activeIncidents}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp className='size-4' />
              {activePercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardAction className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Currently being managed <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Incidents under active response
          </div>
        </CardAction>
      </Card>

      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Resolved Incidents</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {resolvedIncidents}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconCircleCheck className='size-4' />
              {resolvedPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardAction className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Successfully handled <IconCircleCheck className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Completed incident responses
          </div>
        </CardAction>
      </Card>

      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Incidents</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {totalIncidents}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp className='size-4' />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardAction className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Total reported incidents <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Cumulative incident count</div>
        </CardAction>
      </Card>
    </div>
  );
}
