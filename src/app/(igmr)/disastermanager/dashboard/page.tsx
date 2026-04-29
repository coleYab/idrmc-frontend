import PageContainer from '@/components/layout/page-container';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { NotificationFeed } from '@/components/dashboard/NotificationFeed';
import { DisasterSummary } from '@/components/dashboard/DisasterSummary';
import { VerifiedIncidents } from '@/components/dashboard/VerifiedIncidents';
import { disastermanagerInfo } from '@/config/disastermanager-infoconfig';

export const metadata = {
  title: 'IDRMC - Disaster Management Dashboard'
};

export default function DisasterManagerDashboardPage() {
  return (
    <PageContainer
      scrollable={false}
      pageTitle='Disaster Management Dashboard'
      pageDescription='Central command center for disaster response coordination and management.'
      infoContent={disastermanagerInfo.dashboard}
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

        {/* Verified incidents section */}
        <VerifiedIncidents />
      </div>
    </PageContainer>
  );
}
