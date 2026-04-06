import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { incidentService } from '@/services/incidentServices';
import IncidentStatusUpdateForm from '@/features/incval/components/incident-status-update-form';
import { getIncidentUpdateStatusInfo } from '@/config/incval-infoconfig';
import type { Incident } from '@/lib/types/incident';

interface IncidentUpdateStatusPageProps {
  params: Promise<{ incidentId: string }>;
}

export default async function IncidentUpdateStatusPage(
  props: IncidentUpdateStatusPageProps
) {
  const { incidentId } = await props.params;

  const incident: Incident | undefined =
    await incidentService.getById(incidentId);

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
