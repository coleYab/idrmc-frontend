import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard: Administration'
};

export default function AdminPage() {
  return (
    <PageContainer
      pageTitle="Administration"
      pageDescription="Manage system users, adjust roles, and review audit logs."
    >
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <h2>Admin Portal Placeholder</h2>
        <p>This section is strictly restricted to system administrators.</p>
      </div>
    </PageContainer>
  );
}
