import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: Emergency Alerts'
};

export default function AlertsPage() {
  return (
    <PageContainer
      pageTitle="Emergency Alerts"
      pageDescription="Draft, authorize, and broadcast public emergency alerts."
    >
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <h2>Alerts Module Placeholder</h2>
        <p>This module handles SMS, Email, and Push notification broadcasts for emergencies.</p>
      </div>
    </PageContainer>
  );
}
