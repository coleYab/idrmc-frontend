import PageContainer from '@/components/layout/page-container';
import IncidentVerificationForm from '@/features/incval/components/incident-verification-form';
import { incidentService } from '@/services/incidentServices';
import { IncidentSeverityLevel } from '@/lib/types/incident';
import { getIncidentVerifyInfo } from '@/config/incval-infoconfig';
import { redirect } from 'next/navigation';

interface IncidentVerifyPageProps {
  params: Promise<{ incidentId: string }>;
}

export const metadata = {
  title: 'Verify Incident Report'
};

async function verifyIncidentAction(
  incidentId: string,
  data: {
    dataIntegrityConfirmed: boolean;
    disasterTypeAccurate: boolean;
    coordinatesAccurate: boolean;
    severityLevel: IncidentSeverityLevel;
    assessmentNotes: string;
    action: 'verify' | 'reject';
    rejectionReason?: string;
  }
) {
  'use server';

  if (data.action === 'verify') {
    await incidentService.verifyIncident(
      incidentId,
      data.severityLevel,
      data.assessmentNotes
    );
  } else {
    await incidentService.rejectIncident(
      incidentId,
      data.rejectionReason || 'No reason provided',
      data.assessmentNotes
    );
  }
}

export default async function IncidentVerifyPage(
  props: IncidentVerifyPageProps
) {
  const { incidentId } = await props.params;

  const incident = await incidentService.getById(incidentId);

  if (!incident) {
    redirect('/incval/dashboard');
  }

  // Only allow verification of pending incidents
  if (incident.status !== 'Pending') {
    redirect(`/incval/incidents/${incidentId}/details`);
  }

  return (
    <PageContainer
      pageTitle={`Verify Incident ${incidentId}`}
      pageDescription='Review and validate incident report data, assess severity, and make verification decision.'
      infoContent={getIncidentVerifyInfo(incidentId)}
    >
      <IncidentVerificationForm
        incident={incident}
        incidentId={incidentId}
        onSubmit={verifyIncidentAction}
      />
    </PageContainer>
  );
}
