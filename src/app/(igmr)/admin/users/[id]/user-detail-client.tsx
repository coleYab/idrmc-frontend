'use client';

import { useMemo, useState } from 'react';
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
import {
  IconArrowLeft,
  IconTrash,
  IconUserCheck,
  IconUserX
} from '@tabler/icons-react';
import {
  getAdminUserById,
  getUserActivityEntries,
  type AdminUser
} from '../../admin-mock-data';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export default function UserDetailClient({ id }: { id: string }) {
  const [user, setUser] = useState<AdminUser | undefined>(() =>
    getAdminUserById(id)
  );

  const recentActivity = useMemo(
    () => (user ? getUserActivityEntries(user.name) : []),
    [user]
  );

  const handleToggleActive = () => {
    if (!user) return;
    setUser({ ...user, active: !user.active });
    toast.success(
      user.active
        ? `${user.name} has been deactivated.`
        : `${user.name} has been reactivated.`
    );
  };

  const handleDeleteUser = () => {
    if (!user) return;
    setUser(undefined);
    toast.success(`${user.name} has been removed from the user registry.`);
  };

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
            The requested user does not exist in the current registry.
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
                  <p className='text-muted-foreground text-sm'>Phone</p>
                  <p className='font-medium'>{user.phone}</p>
                </div>
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-sm'>Role</p>
                  <p className='font-medium'>{user.role}</p>
                  <p className='text-muted-foreground text-sm'>Status</p>
                  <Badge variant={user.active ? 'default' : 'outline'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <p className='text-muted-foreground text-sm'>Manager</p>
                  <p className='font-medium'>{user.manager}</p>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <p className='text-muted-foreground text-sm'>Joined</p>
                  <p className='font-medium'>
                    {formatDate(user.createdAt ?? '')}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Last login</p>
                  <p className='font-medium'>{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-wrap items-center gap-2'>
              <Button
                size='sm'
                variant={user.active ? 'secondary' : 'default'}
                onClick={handleToggleActive}
              >
                {user.active ? <IconUserX /> : <IconUserCheck />}
                {user.active ? 'Deactivate account' : 'Reactivate account'}
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={handleDeleteUser}
              >
                <IconTrash /> Delete user
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions & access</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <p className='text-muted-foreground'>Department</p>
              <p className='font-medium'>{user.department}</p>
              <p className='text-muted-foreground'>Location</p>
              <p className='font-medium'>{user.location}</p>
              <p className='text-muted-foreground'>Granted permissions</p>
              <ul className='list-disc pl-5'>
                {user.permissions.map((permission) => (
                  <li key={permission}>{permission}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            {recentActivity.length > 0 ? (
              recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className='border-muted rounded-lg border p-3'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-medium'>{entry.action}</p>
                    <Badge
                      variant={
                        entry.status === 'Success'
                          ? 'default'
                          : entry.status === 'Warning'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {entry.status}
                    </Badge>
                  </div>
                  <p className='text-muted-foreground'>{entry.target}</p>
                  <p className='text-muted-foreground mt-2 text-xs'>
                    {formatDate(entry.timestamp)}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-sm'>
                No recent activity recorded for this user.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
