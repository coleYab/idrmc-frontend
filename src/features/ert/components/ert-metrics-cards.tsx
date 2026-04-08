import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconFirstAidKit,
  IconUsers
} from '@tabler/icons-react';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus } from '@/lib/types/incident';

// Mock ERT team data
const mockTeam = [
  { id: '1', name: 'Alpha Unit', status: 'deployed' },
  { id: '2', name: 'Bravo Unit', status: 'available' },
  { id: '3', name: 'Charlie Unit', status: 'deployed' },
  { id: '4', name: 'Delta Unit', status: 'off-duty' },
  { id: '5', name: 'Echo Unit', status: 'available' }
];

export function ErtMetricsCards() {
  const activeIncidents = mockIncidents.filter(
    (i) => i.status === IncidentStatus.ACTIVE
  ).length;
  const urgentMedical = mockIncidents.filter(
    (i) => i.requiresUrgentMedical
  ).length;
  const deployedUnits = mockTeam.filter((t) => t.status === 'deployed').length;
  const availableUnits = mockTeam.filter(
    (t) => t.status === 'available'
  ).length;

  return (
    <div className='grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Incidents</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {activeIncidents}
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
            {urgentMedical}
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
            {deployedUnits}
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
            {availableUnits}
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
