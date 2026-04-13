import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getIncidentDetailsInfo } from '@/config/incval-infoconfig';
import { incidentService } from '@/services/incidentServices';
import type { Incident } from '@/lib/types/incident';
import { IncidentAttachmentItem } from '@/components/incident/incident-attachment-item';

interface IncidentDetailsPageProps {
  params: Promise<{ incidentId: string }>;
}

function formatDate(date?: string | null): string {
  if (!date) {
    return 'N/A';
  }

  return new Date(date).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function renderBadge(value: string) {
  return (
    <Badge variant='outline' className='capitalize'>
      {value}
    </Badge>
  );
}

export default async function IncidentDetailsPage(
  props: IncidentDetailsPageProps
) {
  const { incidentId } = await props.params;

  const incident: Incident | undefined =
    await incidentService.getById(incidentId);

  if (!incident) {
    notFound();
  }

  return (
    <PageContainer
      pageTitle={`Incident ${incidentId} Details`}
      pageDescription='Comprehensive incident data view for review and validation.'
      infoContent={getIncidentDetailsInfo(incidentId)}
    >
      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Incident Overview</CardTitle>
            <CardDescription>
              Key metadata and incident summary.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-sm'>Title</p>
              <p className='font-medium'>{incident.title}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-sm'>Description</p>
              <p>{incident.description}</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {renderBadge(incident.incidentType)}
              {renderBadge(incident.status)}
              {renderBadge(incident.severity)}
            </div>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-sm'>Location</p>
              <p>{incident.location}</p>
            </div>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <div>
                <p className='text-muted-foreground text-sm'>Reported By</p>
                <p>{incident.reportedBy}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>
                  Affected Population
                </p>
                <p>{incident.affectedPopulationCount.toLocaleString()}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Urgent Medical</p>
                <p>{incident.requiresUrgentMedical ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>
                  Infrastructure Damage
                </p>
                <p>
                  {incident.infrastructureDamage.length > 0
                    ? incident.infrastructureDamage.join(', ')
                    : 'None reported'}
                </p>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
              <div>
                <p className='text-muted-foreground text-sm'>Created At</p>
                <p>{formatDate(incident.createdAt)}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Updated At</p>
                <p>{formatDate(incident.updatedAt)}</p>
              </div>
            </div>
            {incident.resolvedBy && (
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                <div>
                  <p className='text-muted-foreground text-sm'>Resolved By</p>
                  <p>{incident.resolvedBy}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Resolved At</p>
                  <p>{formatDate(incident.resolvedAt)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attached Media</CardTitle>
            <CardDescription>
              Uploaded photos, screenshots, or evidence files.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!incident.attachments || incident.attachments.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                No attachments uploaded.
              </p>
            ) : (
              <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                {incident.attachments.map((src, idx) => {
                  if (!src) return null;
                  return (
                    <IncidentAttachmentItem
                      key={idx}
                      src={src}
                      index={idx}
                      alt={`Incident attachment ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw Incident Payload</CardTitle>
          <CardDescription>
            All collected fields for audit and debugging.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className='bg-muted text-muted-foreground overflow-auto rounded-md border p-3 text-xs'>
            {JSON.stringify(incident, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
