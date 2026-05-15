import DisasterManagerHeader from '@/components/layout/disastermanager-header';
import DisasterManagerSidebar from '@/components/layout/disastermanager-sidebar';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disaster Manager Console',
  description: 'Disaster response coordination and management console'
};

export default async function DisasterManagerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/sign-in');
  }

  return (
    <SidebarProvider defaultOpen>
      <InfobarProvider defaultOpen={false}>
        <DisasterManagerSidebar />
        <SidebarInset>
          <DisasterManagerHeader />
          {children}
        </SidebarInset>
        <InfoSidebar side='right' />
      </InfobarProvider>
    </SidebarProvider>
  );
}
