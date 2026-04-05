import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: Donation Campaigns'
};

export default function DonationsPage() {
  return (
    <PageContainer
      pageTitle="Donation Campaigns"
      pageDescription="Manage donation drives, track funding goals, and issue digital receipts."
    >
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <h2>Donations Module Placeholder</h2>
        <p>This portal processes financial contributions via payment gateways.</p>
      </div>
    </PageContainer>
  );
}
