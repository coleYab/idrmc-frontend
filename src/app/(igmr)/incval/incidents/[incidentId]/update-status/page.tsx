import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import IncidentStatusUpdateForm from '@/features/incval/components/incident-status-update-form';
import { getIncidentUpdateStatusInfo } from '@/config/incval-infoconfig';
import { fetchClient } from '@/lib/fetch-client';
import { IncidentSchema, type Incident } from '@/features/incidents/types';

interface IncidentUpdateStatusPageProps {
  params: Promise<{ incidentId: string }>;
}

export default async function IncidentUpdateStatusPage(
  props: IncidentUpdateStatusPageProps
) {
  const { incidentId } = await props.params;

  const incidentResponse = await fetchClient<unknown>(
    `/incidents/${incidentId}`,
    { cache: 'no-store' }
  ).catch(() => undefined);

  const incident: Incident | undefined = incidentResponse
    ? IncidentSchema.safeParse(incidentResponse).data
    : undefined;

  if (!incident) {
    notFound();
  }

  return (
    <PageContainer
      pageTitle={`Incident ${incidentId} Status Update`}
      pageDescription='Move incidents through operational lifecycle states and capture status notes.'
      infoContent={getIncidentUpdateStatusInfo(incidentId)}
    >
      <IncidentStatusUpdateForm incident={incident} incidentId={incidentId} />
    </PageContainer>
  );
}
