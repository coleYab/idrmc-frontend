import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { getIncidentUpdateStatusInfo } from '@/config/incval-infoconfig';

interface IncidentUpdateStatusPageProps {
  params: Promise<{ incidentId: string }>;
}

export default async function IncidentUpdateStatusPage(
  props: IncidentUpdateStatusPageProps
) {
  const { incidentId } = await props.params;

  return (
    <IncvalPlaceholderPage
      title={`Incident ${incidentId} Status Management`}
      description='Lifecycle transitions and operational work-log tracking.'
      infoContent={getIncidentUpdateStatusInfo(incidentId)}
      dummyText='This page will support status transitions such as Verified, In-Progress, and Resolved, along with timestamped notes for an auditable work log.'
    />
  );
}
