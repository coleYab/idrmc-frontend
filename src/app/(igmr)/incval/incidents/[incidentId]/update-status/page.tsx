'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import IncidentStatusUpdateForm from '@/features/incval/components/incident-status-update-form';
import { getIncidentUpdateStatusInfo } from '@/config/incval-infoconfig';
import { incidentService } from '@/services/incidentServices';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import type { Incident } from '@/lib/types/incident';

export default function IncidentUpdateStatusPage() {
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
          <p className='text-muted-foreground'>Loading incident...</p>
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
              The incident with ID &quot;{incidentId}&quot; was not found.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      scrollable={true}
      pageTitle={`Incident ${incidentId} Status Update`}
      pageDescription='Move incidents through operational lifecycle states and capture status notes.'
      infoContent={getIncidentUpdateStatusInfo(incidentId)}
    >
      <IncidentStatusUpdateForm incident={incident} incidentId={incidentId} />
    </PageContainer>
  );
}
