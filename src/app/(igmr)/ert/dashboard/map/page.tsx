import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconMapPin } from '@tabler/icons-react';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus, IncidentSeverityLevel } from '@/lib/types/incident';

export const metadata = { title: 'ERT - Map View' };

const severityVariant = (s: IncidentSeverityLevel) =>
  s === IncidentSeverityLevel.CRITICAL || s === IncidentSeverityLevel.HIGH
    ? 'destructive'
    : s === IncidentSeverityLevel.MEDIUM
      ? 'secondary'
      : 'outline';

export default function MapPage() {
  const activeIncidents = mockIncidents.filter(
    (i) =>
      i.status === IncidentStatus.ACTIVE || i.status === IncidentStatus.PENDING
  );

  return (
    <div className='@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6'>
      <div>
        <h2 className='text-xl font-semibold'>Map View</h2>
        <p className='text-muted-foreground text-sm'>
          Geographic overview of active and pending incidents
        </p>
      </div>

      {/* Map placeholder */}
      <Card>
        <CardContent className='bg-muted flex h-64 items-center justify-center rounded-lg'>
          <div className='text-center'>
            <IconMapPin className='text-muted-foreground mx-auto mb-2 size-10' />
            <p className='text-muted-foreground text-sm'>
              Interactive map integration coming soon
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Incident location list */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Incident Locations</CardTitle>
          <CardDescription>
            Active and pending incidents by location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {activeIncidents.map((incident) => (
              <div
                key={incident.id}
                className='flex items-start justify-between rounded-lg border p-3'
              >
                <div className='flex items-start gap-2'>
                  <IconMapPin className='text-muted-foreground mt-0.5 size-4 shrink-0' />
                  <div>
                    <p className='text-sm font-medium'>{incident.title}</p>
                    <p className='text-muted-foreground text-xs'>
                      {incident.location}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {incident.affectedPopulationCount.toLocaleString()}{' '}
                      affected
                    </p>
                  </div>
                </div>
                <div className='flex flex-col items-end gap-1'>
                  <Badge variant={severityVariant(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    {incident.status}
                  </Badge>
                </div>
              </div>
            ))}
            {activeIncidents.length === 0 && (
              <p className='text-muted-foreground text-sm'>
                No active incidents to display.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
