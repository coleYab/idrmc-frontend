import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: Incident Management'
};

export default function IncidentsPage() {
  return (
    <PageContainer
      pageTitle="Incident Management"
      pageDescription="Review pending incidents, update statuses, and escalate issues."
    >
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <h2>Incidents Module Placeholder</h2>
        <p>This module will allow validators and managers to process field reports.</p>
      </div>
    </PageContainer>
  );
}
