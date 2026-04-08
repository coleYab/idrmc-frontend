import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus, IncidentSeverityLevel } from '@/lib/types/incident';

export const metadata = { title: 'ERT - Assignments' };

const severityVariant = (s: IncidentSeverityLevel) =>
  s === IncidentSeverityLevel.CRITICAL || s === IncidentSeverityLevel.HIGH
    ? 'destructive'
    : s === IncidentSeverityLevel.MEDIUM
      ? 'secondary'
      : 'outline';

export default function AssignmentsPage() {
  const assigned = mockIncidents.filter(
    (i) => i.status === IncidentStatus.ACTIVE
  );

  return (
    <div className='@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6'>
      <div>
        <h2 className='text-xl font-semibold'>Current Assignments</h2>
        <p className='text-muted-foreground text-sm'>
          Active incidents assigned to ERT units
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {assigned.length === 0 ? (
          <p className='text-muted-foreground'>No active assignments.</p>
        ) : (
          assigned.map((incident) => (
            <Card key={incident.id}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>{incident.title}</CardTitle>
                  <Badge variant={severityVariant(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>
                <CardDescription>{incident.location}</CardDescription>
              </CardHeader>
              <CardContent className='text-sm'>
                <p className='text-muted-foreground'>{incident.description}</p>
                <p className='mt-2'>
                  Affected:{' '}
                  <span className='font-medium'>
                    {incident.affectedPopulationCount.toLocaleString()} people
                  </span>
                </p>
                {incident.requiresUrgentMedical && (
                  <Badge variant='destructive' className='mt-2'>
                    Urgent Medical Required
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
