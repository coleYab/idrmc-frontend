import { ErtMetricsCards } from '@/features/ert/components/ert-metrics-cards';

export const metadata = { title: 'ERT - Dashboard' };

export default function ErtDashboardPage() {
  return (
    <div className='@container/main flex flex-1 flex-col gap-6 py-4'>
      <ErtMetricsCards />
    </div>
  );
}
