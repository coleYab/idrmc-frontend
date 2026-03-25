import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { incvalInfo } from '@/config/incval-infoconfig';

export default function IncidentsPendingPage() {
  return (
    <IncvalPlaceholderPage
      title='Pending Incidents'
      description='Inbox of unverified incident reports awaiting validation.'
      infoContent={incvalInfo.incidentsPending}
      dummyText='This page will provide a filterable queue of new incident reports for validator triage, prioritization, and entry into the formal verification workflow.'
    />
  );
}
