import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { getIncidentVerifyInfo } from '@/config/incval-infoconfig';

interface IncidentVerifyPageProps {
  params: Promise<{ incidentId: string }>;
}

export default async function IncidentVerifyPage(props: IncidentVerifyPageProps) {
  const { incidentId } = await props.params;

  return (
    <IncvalPlaceholderPage
      title={`Incident ${incidentId} Verification`}
      description='Formal verification and rejection workflow interface.'
      infoContent={getIncidentVerifyInfo(incidentId)}
      dummyText='This page will include validation forms for data integrity checks, severity assessment fields, and explicit Verify or Reject outcomes with reason codes.'
    />
  );
}
