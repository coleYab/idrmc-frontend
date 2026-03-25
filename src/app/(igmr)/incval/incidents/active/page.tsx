import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { incvalInfo } from '@/config/incval-infoconfig';

export default function IncidentsActivePage() {
  return (
    <IncvalPlaceholderPage
      title='Active Incidents'
      description='Monitor currently verified incidents that are still in progress.'
      infoContent={incvalInfo.incidentsActive}
      dummyText='This page will track all active incidents, showing lifecycle state, assigned teams, and operational updates to support continuous incident monitoring.'
    />
  );
}
