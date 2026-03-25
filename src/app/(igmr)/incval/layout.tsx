import IncvalHeader from '@/components/layout/incval-header';
import IncvalSidebar from '@/components/layout/incval-sidebar';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'INCVAL Console',
  description: 'Incident manager operational console'
};

export default async function IncvalLayout({
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
        <IncvalSidebar />
        <SidebarInset>
          <IncvalHeader />
          {children}
        </SidebarInset>
        <InfoSidebar side='right' />
      </InfobarProvider>
    </SidebarProvider>
  );
}
