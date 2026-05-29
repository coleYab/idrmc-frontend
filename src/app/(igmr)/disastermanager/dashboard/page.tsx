import { MetricsCards } from '@/components/dashboard/MetricsCards';
// import { DisasterSummary } from '@/components/dashboard/DisasterSummary';

export const metadata = {
  title: 'IDRMC - Disaster Management Dashboard'
};

export default function DisasterManagerDashboardPage() {
  return (
    <div className='@container/main flex flex-1 flex-col gap-4 py-4'>
      <MetricsCards />

      {/* <DisasterSummary /> */}

      <div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6'>
        {/* Graphs and recent incidents rendered by layout */}
      </div>
    </div>
  );
}
