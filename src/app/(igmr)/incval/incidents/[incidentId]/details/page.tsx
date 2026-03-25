import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { getIncidentDetailsInfo } from '@/config/incval-infoconfig';

interface IncidentDetailsPageProps {
  params: Promise<{ incidentId: string }>;
}

export default async function IncidentDetailsPage(props: IncidentDetailsPageProps) {
  const { incidentId } = await props.params;

  return (
    <IncvalPlaceholderPage
      title={`Incident ${incidentId} Details`}
      description='Comprehensive incident data view for review and validation.'
      infoContent={getIncidentDetailsInfo(incidentId)}
      dummyText='This page will display complete raw incident submission data including disaster type, coordinates, timestamp, narrative details, and attached media for verification review.'
    />
  );
}
