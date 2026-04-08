import ErtHeader from '@/components/layout/ert-header';
import ErtSidebar from '@/components/layout/ert-sidebar';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ERT Console',
  description: 'Emergency Response Team operational console'
};

export default async function ErtLayout({
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
        <ErtSidebar />
        <SidebarInset>
          <ErtHeader />
          {children}
        </SidebarInset>
        <InfoSidebar side='right' />
      </InfobarProvider>
    </SidebarProvider>
  );
}
