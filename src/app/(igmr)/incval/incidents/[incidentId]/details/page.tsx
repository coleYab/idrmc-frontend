'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  IconArrowLeft,
  IconActivity
} from '@tabler/icons-react';
import Link from 'next/link';
import type { Incident } from '@/lib/types/incident';
import { incidentService } from '@/services/incidentServices';
import { getIncidentDetailsInfo } from '@/config/incval-infoconfig';

function formatDate(date?: string | null): string {
  if (!date) return 'N/A';
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

function getSeverityColor(severity: string) {
  const s = severity.toLowerCase();
  if (s === 'critical') return 'destructive';
  if (s === 'high') return 'destructive';
  if (s === 'medium') return 'secondary';
  if (s === 'low') return 'outline';
  return 'outline';
}

export default function IncidentDetailsPage() {
  const params = useParams();
  const incidentId = params.incidentId as string;
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    incidentService
      .getById(incidentId)
      .then((data) => {
        if (!cancelled) {
          setIncident(data ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIncident(null);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [incidentId]);

  if (loading) {
    return (
      <PageContainer scrollable={true}>
        <div className='flex items-center justify-center py-20'>
          <p className='text-muted-foreground'>Loading incident details...</p>
        </div>
      </PageContainer>
    );
  }

  if (!incident) {
    return (
      <PageContainer
        scrollable={true}
        pageTitle='Incident Not Found'
        pageDescription='The requested incident could not be found.'
        pageHeaderAction={
          <Button asChild variant='outline'>
            <Link href='/incval/incidents'>
              <IconArrowLeft className='mr-2 size-4' />
              Back to Incidents
            </Link>
          </Button>
        }
      >
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <IconAlertTriangle className='text-muted-foreground mb-4 size-12' />
            <h3 className='mb-2 text-lg font-semibold'>Incident Not Found</h3>
            <p className='text-muted-foreground max-w-md text-center'>
              The incident with ID &quot;{incidentId}&quot; was not found. It
              may have been removed or you may not have access to it.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const infrastructureDamage = incident.infrastructureDamage ?? [];
  const attachments = incident.attachments ?? [];

  return (
    <PageContainer
      scrollable={true}
      pageTitle={`Incident ${incidentId} Details`}
      pageDescription='Comprehensive incident information for response coordination and management.'
      infoContent={getIncidentDetailsInfo(incidentId)}
      pageHeaderAction={
        <Button asChild variant='outline'>
          <Link href='/incval/incidents'>
            <IconArrowLeft className='mr-2 size-4' />
            Back to Incidents
          </Link>
        </Button>
      }
    >
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-2xl'>{incident.title}</CardTitle>
                  <CardDescription className='mt-2'>
                    {incident.description}
                  </CardDescription>
                </div>
                <div className='flex gap-2'>
                  <Badge
                    variant={getSeverityColor(incident.severity)}
                    className='text-sm'
                  >
                    {incident.severity} Severity
                  </Badge>
                  {renderBadge(incident.status, 'default')}
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <IconMapPin className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Location</p>
                      <p className='text-muted-foreground text-sm'>
                        {incident.location}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <IconUsers className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Affected Population</p>
                      <p className='text-muted-foreground text-sm'>
                        {incident.affectedPopulationCount.toLocaleString()}{' '}
                        people
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <IconUser className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Reported By</p>
                      <p className='text-muted-foreground text-sm'>
                        {incident.reportedBy}
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
                        {formatDate(incident.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <IconClock className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Last Updated</p>
                      <p className='text-muted-foreground text-sm'>
                        {formatDate(incident.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <IconActivity className='text-muted-foreground size-5' />
                    <div>
                      <p className='text-sm font-medium'>Incident Type</p>
                      <p className='text-muted-foreground text-sm'>
                        {incident.incidentType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Critical Information</h3>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='flex items-center gap-3 rounded-lg border p-3'>
                    <IconAlertTriangle
                      className={`size-5 ${incident.requiresUrgentMedical ? 'text-red-500' : 'text-green-500'}`}
                    />
                    <div>
                      <p className='text-sm font-medium'>
                        Urgent Medical Attention
                      </p>
                      <p
                        className={`text-sm ${incident.requiresUrgentMedical ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {incident.requiresUrgentMedical
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
                        {infrastructureDamage.length > 0
                          ? `${infrastructureDamage.length} reported`
                          : 'None reported'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {incident.resolvedBy && (
                <>
                  <Separator />
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Resolution Info</h3>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div className='flex items-center gap-3'>
                        <IconUser className='text-muted-foreground size-5' />
                        <div>
                          <p className='text-sm font-medium'>Resolved By</p>
                          <p className='text-muted-foreground text-sm'>
                            {incident.resolvedBy}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <IconClock className='text-muted-foreground size-5' />
                        <div>
                          <p className='text-sm font-medium'>Resolved At</p>
                          <p className='text-muted-foreground text-sm'>
                            {formatDate(incident.resolvedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {infrastructureDamage.length > 0 && (
                <>
                  <Separator />
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>
                      Infrastructure Damage Details
                    </h3>
                    <div className='grid gap-2'>
                      {infrastructureDamage.map((damage, index) => (
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

          <Card>
            <CardHeader>
              <CardTitle>Additional Actions</CardTitle>
              <CardDescription>
                Access additional incident context and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3'>
                <Button asChild variant='outline'>
                  <Link href={`/incval/incidents/${incidentId}/update-status`}>
                    Update Status
                  </Link>
                </Button>
                <Button asChild variant='outline'>
                  <Link href={`/incval/incidents/${incidentId}/map-context`}>
                    View Map Context
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
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
              {attachments.length === 0 ? (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  No attachments uploaded
                </p>
              ) : (
                <div className='grid gap-3'>
                  {attachments.map((src, idx) => (
                    <div key={idx} className='relative'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Incident attachment ${idx + 1}`}
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

          <Card>
            <CardHeader>
              <CardTitle>Incident Status</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Current Status</span>
                {renderBadge(incident.status, 'default')}
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Severity Level</span>
                <Badge variant={getSeverityColor(incident.severity)}>
                  {incident.severity}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Incident Type</span>
                {renderBadge(incident.incidentType)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Incident Data</CardTitle>
              <CardDescription>
                Complete incident payload for audit and technical review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className='bg-muted text-muted-foreground max-h-64 overflow-auto rounded-md border p-3 text-xs'>
                {JSON.stringify(incident, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
