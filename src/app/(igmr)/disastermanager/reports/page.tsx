'use client';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconAlertTriangle,
  IconMapPin,
  IconUsers,
  IconClock,
  IconChevronRight,
  IconFileReport
} from '@tabler/icons-react';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentSeverityLevel, IncidentStatus } from '@/lib/types/incident';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const severityVariant = (
  severity: IncidentSeverityLevel
): 'destructive' | 'secondary' | 'outline' => {
  switch (severity) {
    case IncidentSeverityLevel.CRITICAL:
    case IncidentSeverityLevel.HIGH:
      return 'destructive';
    case IncidentSeverityLevel.MEDIUM:
      return 'secondary';
    default:
      return 'outline';
  }
};

const statusStyles: Record<string, string> = {
  [IncidentStatus.ACTIVE]: 'bg-red-500/10 text-red-500 border-red-500/30',
  [IncidentStatus.PENDING]:
    'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  [IncidentStatus.VERIFIED]: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  [IncidentStatus.RESOLVED]:
    'bg-green-500/10 text-green-500 border-green-500/30'
};

const severityDot: Record<string, string> = {
  [IncidentSeverityLevel.CRITICAL]: 'bg-red-500',
  [IncidentSeverityLevel.HIGH]: 'bg-orange-500',
  [IncidentSeverityLevel.MEDIUM]: 'bg-yellow-500',
  [IncidentSeverityLevel.LOW]: 'bg-green-500'
};

export default function DisasterReportPage() {
  const router = useRouter();

  const severityOrder: Record<string, number> = {
    [IncidentSeverityLevel.CRITICAL]: 4,
    [IncidentSeverityLevel.HIGH]: 3,
    [IncidentSeverityLevel.MEDIUM]: 2,
    [IncidentSeverityLevel.LOW]: 1
  };

  const sorted = [...mockIncidents].sort((a, b) => {
    if (
      a.status === IncidentStatus.ACTIVE &&
      b.status !== IncidentStatus.ACTIVE
    )
      return -1;
    if (
      b.status === IncidentStatus.ACTIVE &&
      a.status !== IncidentStatus.ACTIVE
    )
      return 1;
    return (severityOrder[b.severity] ?? 0) - (severityOrder[a.severity] ?? 0);
  });

  const handleClick = (id: string) => {
    router.push(`/disastermanager/disasters/${id}/details`);
  };

  const total = mockIncidents.length;
  const active = mockIncidents.filter(
    (i) => i.status === IncidentStatus.ACTIVE
  ).length;
  const resolved = mockIncidents.filter(
    (i) => i.status === IncidentStatus.RESOLVED
  ).length;
  const pending = mockIncidents.filter(
    (i) => i.status === IncidentStatus.PENDING
  ).length;

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Disaster Report'
      pageDescription='Complete list of all reported disasters. Click any entry to view full details.'
    >
      <div className='space-y-6'>
        {/* Summary stats row */}
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {[
            { label: 'Total', value: total, cls: 'text-foreground' },
            { label: 'Active', value: active, cls: 'text-red-500' },
            { label: 'Pending', value: pending, cls: 'text-yellow-500' },
            { label: 'Resolved', value: resolved, cls: 'text-green-500' }
          ].map(({ label, value, cls }) => (
            <Card key={label}>
              <CardHeader className='pb-2'>
                <CardDescription>{label}</CardDescription>
                <CardTitle className={cn('text-3xl font-bold', cls)}>
                  {value}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Disasters list */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconFileReport className='size-5' />
              All Disasters
            </CardTitle>
            <CardDescription>
              {total} total incidents — sorted by status and severity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sorted.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-16'>
                <IconAlertTriangle className='text-muted-foreground mb-4 size-12' />
                <p className='text-muted-foreground'>No disasters recorded</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {sorted.map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => handleClick(incident.id)}
                    className='group bg-card hover:bg-accent/40 flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-sm'
                  >
                    {/* Severity dot */}
                    <div
                      className={cn(
                        'mt-1.5 size-2.5 shrink-0 rounded-full',
                        severityDot[incident.severity]
                      )}
                    />

                    {/* Content */}
                    <div className='min-w-0 flex-1 space-y-1.5'>
                      {/* Title + badges */}
                      <div className='flex flex-wrap items-center gap-2'>
                        <h4 className='text-sm font-semibold'>
                          {incident.title}
                        </h4>
                        <Badge
                          variant={severityVariant(incident.severity)}
                          className='text-xs'
                        >
                          {incident.severity}
                        </Badge>
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 text-xs font-medium',
                            statusStyles[incident.status] ??
                              'bg-muted text-muted-foreground'
                          )}
                        >
                          {incident.status}
                        </span>
                        {incident.requiresUrgentMedical && (
                          <span className='flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500'>
                            <IconAlertTriangle className='size-3' />
                            Urgent Medical
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className='text-muted-foreground line-clamp-1 text-xs'>
                        {incident.description}
                      </p>

                      {/* Meta row */}
                      <div className='text-muted-foreground flex flex-wrap items-center gap-4 text-xs'>
                        <span className='flex items-center gap-1'>
                          <IconMapPin className='size-3' />
                          {incident.location}
                        </span>
                        <span className='flex items-center gap-1'>
                          <IconUsers className='size-3' />
                          {incident.affectedPopulationCount.toLocaleString()}{' '}
                          affected
                        </span>
                        <span className='flex items-center gap-1'>
                          <IconClock className='size-3' />
                          {formatDistanceToNow(new Date(incident.createdAt), {
                            addSuffix: true
                          })}
                        </span>
                        <span className='text-muted-foreground/70'>
                          Type: {incident.incidentType}
                        </span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <IconChevronRight className='text-muted-foreground mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5' />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
