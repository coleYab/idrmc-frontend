import PageContainer from '@/components/layout/page-container';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { NotificationFeed } from '@/components/dashboard/NotificationFeed';
import { DisasterSummary } from '@/components/dashboard/DisasterSummary';
import { incvalInfo } from '@/config/incval-infoconfig';

export const metadata = {
  title: 'IDRMC - Incident Command Dashboard'
};

export default function IncvalDashboardPage() {
  return (
    <PageContainer
      scrollable={false}
      pageTitle='Incident Command Dashboard'
      pageDescription='Central command center for all incident-related activities.'
      infoContent={incvalInfo.dashboard}
    >
      <div className='flex flex-1 flex-col space-y-6'>
        {/* High-level metrics */}
        <MetricsCards />

        {/* Main content grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Real-time notification feed */}
          <NotificationFeed />

          {/* Regional disaster summary */}
          <DisasterSummary />
        </div>
      </div>
    </PageContainer>
  );
}
