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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  IconDownload,
  IconEye,
  IconPlus,
  IconTrash,
  IconUserCheck,
  IconUserX
} from '@tabler/icons-react';
import { useUsers, useUpdateUser } from '@/features/users/api/users';
import type { User } from '@/features/users/types';
import { Loader2 } from 'lucide-react';

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export default function UsersAdminClient() {
  const { data, isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const [search, setSearch] = useState('');

  const users = data?.items ?? [];

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        [user.name, user.email, user.username, user.role]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [users, search]
  );

  const activeUsers = users.filter((user) => user.active).length;
  const inactiveUsers = users.length - activeUsers;
  const adminUsers = users.filter((user) => user.role === 'Admin').length;

  const handleToggleActive = async (id: string) => {
    try {
      const user = users.find((u) => u.id === id);
      if (!user) return;
      await updateUser.mutateAsync({ id, payload: { active: !user.active } });
      toast.success(
        user.active
          ? 'User has been deactivated.'
          : 'User has been reactivated.'
      );
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleInviteUser = () => {
    toast.info('Invite flow not connected in this demo.');
  };

  const handleExportCsv = () => {
    toast.info('Invite flow not connected in this demo.');
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

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Users Management'
      pageDescription='View all users, their roles, and user management actions.'
      pageHeaderAction={
        <div className='flex flex-wrap items-center gap-2'>
          <Button size='sm' variant='secondary' onClick={handleInviteUser}>
            <IconPlus /> Invite user
          </Button>
          <Button size='sm' variant='outline' onClick={handleExportCsv}>
            <IconDownload /> Export CSV
          </Button>
        </div>
      }
    >
      <div className='grid gap-4 lg:grid-cols-[280px_1fr]'>
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span>Total users</span>
                  <span className='font-semibold'>{users.length}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>Active accounts</span>
                  <Badge variant='secondary'>{activeUsers}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span>Inactive accounts</span>
                  <Badge variant='outline'>{inactiveUsers}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span>Admin users</span>
                  <Badge>{adminUsers}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>User management</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <p>
                Use the actions to review a user, deactivate/reactivate
                accounts, or remove user access.
              </p>
              <ul className='text-muted-foreground list-disc pl-5'>
                <li>Role and status overview</li>
                <li>Direct user detail navigation</li>
                <li>Account deactivation and activation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All users</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <Input
                placeholder='Search users, email, role'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className='max-w-lg'
              />
              <div className='text-muted-foreground text-sm'>
                {filteredUsers.length} of {users.length} users shown
              </div>
            </div>

            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className='flex flex-col gap-1'>
                            <span className='font-medium'>{user.name}</span>
                            <span className='text-muted-foreground text-xs'>
                              {user.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{user.role ?? 'User'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.active ? 'default' : 'outline'}>
                            {user.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className='space-x-2 text-right'>
                          <Link href={`/admin/users/${user.id}`}>
                            <Button size='sm' variant='outline'>
                              <IconEye />
                              View
                            </Button>
                          </Link>
                          <Button
                            size='sm'
                            variant={user.active ? 'secondary' : 'default'}
                            onClick={() => handleToggleActive(user.id)}
                            disabled={updateUser.isPending}
                          >
                            {user.active ? <IconUserX /> : <IconUserCheck />}
                            {user.active ? 'Deactivate' : 'Reactivate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className='h-24 text-center'>
                        No users match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className='text-muted-foreground text-sm'>
            This view shows all users in the system along with status and role.
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
