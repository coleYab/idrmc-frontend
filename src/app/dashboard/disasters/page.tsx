import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: Disaster Declarations'
};

export default function DisastersPage() {
  return (
    <PageContainer
      pageTitle="Disaster Declarations"
      pageDescription="Approve, activate, and manage official disaster declarations."
    >
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <h2>Disaster Module Placeholder</h2>
        <p>This module is responsible for managing major disaster states and official declarations.</p>
      </div>
    </PageContainer>
  );
}
