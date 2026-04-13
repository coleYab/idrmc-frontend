import { ErtMetricsCards } from '@/features/ert/components/ert-metrics-cards';
import { DisasterSummary } from '@/components/dashboard/DisasterSummary';
import { NotificationFeed } from '@/components/dashboard/NotificationFeed';

export const metadata = { title: 'ERT - Dashboard' };

export default function ErtDashboardPage() {
  return (
    <div className='@container/main flex flex-1 flex-col gap-4 py-4'>
      <ErtMetricsCards />
      <div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6'>
        <NotificationFeed />
        <DisasterSummary />
      </div>
    </div>
  );
}
