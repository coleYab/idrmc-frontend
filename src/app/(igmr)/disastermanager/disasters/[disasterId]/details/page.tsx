import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  IconAlertTriangle,
  IconMapPin,
  IconUsers,
  IconClock,
  IconUser,
  IconBuilding,
  IconCamera,
  IconArrowLeft
} from '@tabler/icons-react';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus, IncidentSeverityLevel } from '@/lib/types/incident';
import Link from 'next/link';
import { StatusUpdater } from '../../status-updater';

interface DisasterDetailsPageProps {
  params: Promise<{ disasterId: string }>;
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

function renderBadge(
  value: string,
  variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
) {
  return (
    <Badge variant={variant} className='capitalize'>
      {value}
    </Badge>
  );
}

function getSeverityColor(severity: IncidentSeverityLevel) {
  switch (severity) {
    case IncidentSeverityLevel.CRITICAL:
      return 'destructive';
    case IncidentSeverityLevel.HIGH:
      return 'destructive';
    case IncidentSeverityLevel.MEDIUM:
      return 'secondary';
    case IncidentSeverityLevel.LOW:
      return 'outline';
    default:
      return 'outline';
  }
}

export default async function DisasterDetailsPage(
  props: DisasterDetailsPageProps
) {
  const { disasterId } = await props.params;

  // Find the disaster (active incident) by ID
  const disaster = mockIncidents.find((incident) => incident.id === disasterId);

  if (!disaster) {
    notFound();
  }

  return (
    <PageContainer
      scrollable={true}
      pageTitle={`Disaster ${disasterId} Details`}
      pageDescription='Comprehensive disaster information for response coordination and management.'
      pageHeaderAction={
        <Button asChild variant='outline'>
          <Link href='/disastermanager/disasters/active'>
            <IconArrowLeft className='mr-2 size-4' />
            Back to Active Disasters
          </Link>
        </Button>
      }
    >
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main Disaster Information */}
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-2xl'>{disaster.title}</CardTitle>
                  <CardDescription className='mt-2'>
                    {disaster.description}
                  </CardDescription>
                </div>
                <div className='flex gap-2'>
                  <Badge
                    variant={getSeverityColor(disaster.severity)}
                    className='text-sm'
                  >
                    {disaster.severity} Severity
                  </Badge>
                  {renderBadge(disaster.status, 'default')}
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Key Details Grid */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <IconMapPin className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Location</p>
                      <p className='text-muted-foreground text-sm'>
                        {disaster.location}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <IconUsers className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Affected Population</p>
                      <p className='text-muted-foreground text-sm'>
                        {disaster.affectedPopulationCount.toLocaleString()}{' '}
                        people
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <IconUser className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Reported By</p>
                      <p className='text-muted-foreground text-sm'>
                        {disaster.reportedBy}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <IconClock className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Created</p>
                      <p className='text-muted-foreground text-sm'>
                        {formatDate(disaster.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <IconClock className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Last Updated</p>
                      <p className='text-muted-foreground text-sm'>
                        {formatDate(disaster.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='size-5' /> {/* Spacer */}
                    <div>
                      <p className='text-sm font-medium'>Incident Type</p>
                      <p className='text-muted-foreground text-sm'>
                        {disaster.incidentType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Critical Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Critical Information</h3>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='flex items-center gap-3 rounded-lg border p-3'>
                    <IconAlertTriangle
                      className={`size-5 ${disaster.requiresUrgentMedical ? 'text-red-500' : 'text-green-500'}`}
                    />
                    <div>
                      <p className='text-sm font-medium'>
                        Urgent Medical Attention
                      </p>
                      <p
                        className={`text-sm ${disaster.requiresUrgentMedical ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {disaster.requiresUrgentMedical
                          ? 'Required'
                          : 'Not Required'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 rounded-lg border p-3'>
                    <IconBuilding className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>
                        Infrastructure Damage
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {disaster.infrastructureDamage.length > 0
                          ? `${disaster.infrastructureDamage.length} reported`
                          : 'None reported'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infrastructure Damage Details */}
              {disaster.infrastructureDamage.length > 0 && (
                <>
                  <Separator />
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>
                      Infrastructure Damage Details
                    </h3>
                    <div className='grid gap-2'>
                      {disaster.infrastructureDamage.map((damage, index) => (
                        <div
                          key={index}
                          className='bg-muted/50 flex items-center gap-3 rounded-lg p-3'
                        >
                          <div className='h-2 w-2 rounded-full bg-red-500' />
                          <p className='text-sm'>{damage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Access additional disaster context and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3'>
                <Button asChild variant='outline'>
                  <Link
                    href={`/disastermanager/disasters/${disasterId}/map-context`}
                  >
                    View Map Context
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className='space-y-6'>
          {/* Attachments/Media */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconCamera className='size-5' />
                Attachments & Media
              </CardTitle>
              <CardDescription>
                Photos, videos, and evidence files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {disaster.attachments.length === 0 ? (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  No attachments uploaded
                </p>
              ) : (
                <div className='grid gap-3'>
                  {disaster.attachments.map((src, idx) => (
                    <div key={idx} className='relative'>
                      <img
                        src={src}
                        alt={`Disaster attachment ${idx + 1}`}
                        className='h-32 w-full rounded-md border object-cover'
                        loading='lazy'
                      />
                      <div className='absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white'>
                        Attachment {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disaster Status */}
          <Card>
            <CardHeader>
              <CardTitle>Disaster Status</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Current Status</span>
                {renderBadge(disaster.status, 'default')}
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Severity Level</span>
                <Badge variant={getSeverityColor(disaster.severity)}>
                  {disaster.severity}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Incident Type</span>
                {renderBadge(disaster.incidentType)}
              </div>
              <Separator className='my-2' />
              <div className='space-y-2 pt-1'>
                <span className='text-sm font-medium'>Update Status</span>
                <StatusUpdater
                  disasterId={disaster.id}
                  currentStatus={disaster.status}
                />
              </div>
            </CardContent>
          </Card>

          {/* Raw Data (for debugging/admin purposes) */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Disaster Data</CardTitle>
              <CardDescription>
                Complete incident payload for audit and technical review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className='bg-muted text-muted-foreground max-h-64 overflow-auto rounded-md border p-3 text-xs'>
                {JSON.stringify(disaster, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
