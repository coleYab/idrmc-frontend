import PageContainer from '@/components/layout/page-container';
import IncidentVerificationForm from '@/features/incval/components/incident-verification-form';
import { getIncidentVerifyInfo } from '@/config/incval-infoconfig';
import { redirect } from 'next/navigation';
import { fetchClient } from '@/lib/fetch-client';
import { IncidentSchema } from '@/features/incidents/types';

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
    severityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    assessmentNotes: string;
    action: 'verify' | 'reject';
    rejectionReason?: string;
  }
) {
  'use server';

  if (data.action === 'verify') {
    await fetchClient(`/incidents/${incidentId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'VERIFIED' })
    });

    await fetchClient(`/incidents/${incidentId}`, {
      method: 'PUT',
      body: JSON.stringify({ severity: data.severityLevel })
    }).catch(() => undefined);
  } else {
    await fetchClient(`/incidents/${incidentId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'REJECTED' })
    });
  }
}

export default async function IncidentVerifyPage(
  props: IncidentVerifyPageProps
) {
  const { incidentId } = await props.params;

  const incidentResponse = await fetchClient<unknown>(
    `/incidents/${incidentId}`,
    {
      cache: 'no-store'
    }
  ).catch(() => undefined);

  const incident = incidentResponse
    ? IncidentSchema.safeParse(incidentResponse).data
    : undefined;

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
