'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconUserCheck, IconUserX } from '@tabler/icons-react';
import { useUser, useUpdateUser } from '@/features/users/api/users';
import { Loader2 } from 'lucide-react';

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export default function UserDetailClient({ id }: { id: string }) {
  const { data: user, isLoading } = useUser(id);
  const updateUser = useUpdateUser();

  const handleToggleActive = async () => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        payload: { active: !user.active }
      });
      toast.success(
        user.active
          ? `${user.name} has been deactivated.`
          : `${user.name} has been reactivated.`
      );
    } catch {
      toast.error('Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <PageContainer scrollable={true}>
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer
        scrollable={true}
        pageTitle='User Details'
        pageDescription='View and update user profile information.'
      >
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground text-sm'>
            The requested user does not exist.
          </CardContent>
          <CardFooter className='flex items-center justify-between'>
            <Link href='/admin/users'>
              <Button size='sm' variant='outline'>
                <IconArrowLeft /> Back to users
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      scrollable={true}
      pageTitle='User Details'
      pageDescription='View full user profile, system access, and activity history.'
      pageHeaderAction={
        <Link href='/admin/users'>
          <Button size='sm' variant='outline'>
            <IconArrowLeft /> Back to users
          </Button>
        </Link>
      }
    >
      <div className='grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm'>Username</p>
                  <p className='font-medium'>{user.username}</p>
                  <p className='text-muted-foreground text-sm'>Email</p>
                  <p className='font-medium'>{user.email}</p>
                </div>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm'>Role</p>
                  <p className='font-medium'>{user.role ?? 'User'}</p>
                  <p className='text-muted-foreground text-sm'>Status</p>
                  <Badge variant={user.active ? 'default' : 'outline'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <p className='text-muted-foreground text-sm'>Joined</p>
                  <p className='font-medium'>{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Last Updated</p>
                  <p className='font-medium'>{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-wrap items-center gap-2'>
              <Button
                size='sm'
                variant={user.active ? 'secondary' : 'default'}
                onClick={handleToggleActive}
                disabled={updateUser.isPending}
              >
                {user.active ? <IconUserX /> : <IconUserCheck />}
                {user.active ? 'Deactivate account' : 'Reactivate account'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
