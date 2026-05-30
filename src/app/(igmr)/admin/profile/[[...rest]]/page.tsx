'use client';

import { UserProfile } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminProfilePage() {
  return (
    <PageContainer
      scrollable={true}
      pageTitle='My Profile'
      pageDescription='Manage your admin account and profile settings.'
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden'>
          <UserProfile
            appearance={{
              elements: {
                card: 'shadow-none border-0 p-0',
                navbar: 'hidden',
                pageScrollBox: 'p-0'
              }
            }}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
