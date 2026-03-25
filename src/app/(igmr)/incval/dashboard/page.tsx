import IncvalPlaceholderPage from '@/features/incval/components/incval-placeholder-page';
import { incvalInfo } from '@/config/incval-infoconfig';

export default function IncvalDashboardPage() {
  return (
    <IncvalPlaceholderPage
      title='Incident Command Dashboard'
      description='Central command center for incident management operations.'
      infoContent={incvalInfo.dashboard}
      dummyText='This dashboard will show high-level incident metrics, real-time incoming report notifications, and regional disaster level summaries for rapid decision making.'
    />
  );
}
