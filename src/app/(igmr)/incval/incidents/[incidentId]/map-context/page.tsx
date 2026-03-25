import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { getIncidentMapContextInfo } from '@/config/incval-infoconfig';

interface IncidentMapContextPageProps {
  params: Promise<{ incidentId: string }>;
}

export default async function IncidentMapContextPage(
  props: IncidentMapContextPageProps
) {
  const { incidentId } = await props.params;

  return (
    <IncvalPlaceholderPage
      title={`Incident ${incidentId} Map Context`}
      description='Focused GIS context view for geographic verification.'
      infoContent={getIncidentMapContextInfo(incidentId)}
      dummyText='This page will present a focused map with hazard overlays and administrative boundaries to validate spatial accuracy of the incident report.'
    />
  );
}
