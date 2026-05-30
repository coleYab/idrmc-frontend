'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  IconArrowLeft,
  IconTrash,
  IconCalendar,
  IconMail,
  IconShield,
  IconActivity
} from '@tabler/icons-react';
import {
  useClerkUser,
  useUpdateClerkUserRoles,
  useDeleteClerkUser
} from '@/features/admin/api/clerk-users';
import { ROLE_OPTIONS, type Role } from '@/features/admin/types/clerk-user';
import { useActivityLogs } from '@/features/admin/api/admin';

const roleColors: Record<string, string> = {
  admin: 'destructive',
  incident_validator: 'secondary',
  disaster_response_team: 'default',
  emergency_response_team: 'default',
  user: 'outline'
};

function RoleBadges({ roles }: { roles: string[] }) {
  if (roles.length === 0) {
    return <span className='text-muted-foreground text-sm'>None</span>;
  }
  return (
    <div className='flex flex-wrap gap-1'>
      {roles.map((role) => (
        <Badge
          key={role}
          variant={
            (roleColors[role] as
              | 'default'
              | 'secondary'
              | 'destructive'
              | 'outline') ?? 'outline'
          }
        >
          {role.replace(/_/g, ' ')}
        </Badge>
      ))}
    </div>
  );
}

export default function UserDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: user, isLoading } = useClerkUser(id);
  const updateRoles = useUpdateClerkUserRoles();
  const deleteUser = useDeleteClerkUser();
  const { data: activityData } = useActivityLogs({
    performedBy: 0
  });

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAddRole = async (role: string) => {
    if (!user) return;
    if (user.roles.includes(role as Role)) {
      toast.info('User already has this role.');
      return;
    }
    try {
      await updateRoles.mutateAsync({
        id,
        roles: [...user.roles, role]
      });
      toast.success(`Added role ${role.replace(/_/g, ' ')}.`);
    } catch {
      toast.error('Failed to add role.');
    }
  };

  const handleRemoveRole = async (role: string) => {
    if (!user) return;
    const updated = user.roles.filter((r) => r !== role);
    try {
      await updateRoles.mutateAsync({ id, roles: updated });
      toast.success(`Removed role ${role.replace(/_/g, ' ')}.`);
    } catch {
      toast.error('Failed to remove role.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(id);
      toast.success('User deleted.');
      router.push('/admin/users');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <PageContainer scrollable={true}>
        <div className='space-y-4'>
          <Skeleton className='h-8 w-48' />
          <div className='grid gap-4 lg:grid-cols-[1fr_360px]'>
            <Skeleton className='h-48 w-full' />
            <Skeleton className='h-48 w-full' />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer scrollable={true}>
        <div className='text-muted-foreground flex flex-col items-center gap-2 py-20'>
          <span className='text-lg font-medium'>User not found</span>
          <Button variant='outline' onClick={() => router.push('/admin/users')}>
            <IconArrowLeft /> Back to users
          </Button>
        </div>
      </PageContainer>
    );
  }

  const activityLogs = activityData?.items ?? [];

  return (
    <PageContainer
      scrollable={true}
      pageTitle={
        `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
        'User Details'
      }
      pageDescription={`Clerk user · ${user.id.slice(0, 12)}...`}
      pageHeaderAction={
        <Button variant='outline' onClick={() => router.push('/admin/users')}>
          <IconArrowLeft /> Back
        </Button>
      }
    >
      <div className='grid gap-4 lg:grid-cols-[1fr_360px]'>
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>User information from Clerk</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center gap-4'>
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt=''
                    className='h-16 w-16 rounded-full object-cover'
                  />
                ) : (
                  <div className='bg-muted flex h-16 w-16 items-center justify-center rounded-full text-2xl font-medium'>
                    {(user.firstName?.[0] ?? '?').toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className='text-lg font-semibold'>
                    {user.firstName ?? ''} {user.lastName ?? ''}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {user.emailAddress}
                  </p>
                </div>
              </div>

              <Separator />

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex items-center gap-2'>
                  <IconMail className='text-muted-foreground size-4' />
                  <div>
                    <p className='text-muted-foreground text-xs'>Email</p>
                    <p className='text-sm font-medium'>{user.emailAddress}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <IconCalendar className='text-muted-foreground size-4' />
                  <div>
                    <p className='text-muted-foreground text-xs'>Created</p>
                    <p className='text-sm font-medium'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <IconShield className='text-muted-foreground size-4' />
                  <div>
                    <p className='text-muted-foreground text-xs'>Status</p>
                    <Badge variant={user.banned ? 'outline' : 'default'}>
                      {user.banned ? 'Banned' : 'Active'}
                    </Badge>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <IconActivity className='text-muted-foreground size-4' />
                  <div>
                    <p className='text-muted-foreground text-xs'>
                      Last sign in
                    </p>
                    <p className='text-sm font-medium'>
                      {user.lastSignInAt
                        ? new Date(user.lastSignInAt).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent audit trail entries</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {activityLogs.length === 0 ? (
                <p className='text-muted-foreground text-sm'>
                  No activity logged for this user yet.
                </p>
              ) : (
                activityLogs.slice(0, 10).map((entry) => (
                  <div
                    key={entry.logID}
                    className='rounded-2xl border p-3 text-sm'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-medium'>{entry.actionType}</span>
                      <span className='text-muted-foreground text-xs'>
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {entry.details}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Manage assigned roles</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <RoleBadges roles={user.roles} />

              <Separator />

              <div className='space-y-3'>
                <p className='text-sm font-medium'>Add a role</p>
                <Select
                  onValueChange={(value) => {
                    if (value) handleAddRole(value);
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select role...' />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.filter((r) => !user.roles.includes(r)).map(
                      (role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace(/_/g, ' ')}
                        </SelectItem>
                      )
                    )}
                    {ROLE_OPTIONS.every((r) => user.roles.includes(r)) && (
                      <SelectItem value='__none__' disabled>
                        All roles assigned
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {user.roles.length > 0 && (
                <div className='space-y-3'>
                  <p className='text-sm font-medium'>Remove a role</p>
                  <Select
                    onValueChange={(value) => {
                      if (value) handleRemoveRole(value);
                    }}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select role...' />
                    </SelectTrigger>
                    <SelectContent>
                      {user.roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='border-destructive/30'>
            <CardHeader>
              <CardTitle className='text-destructive'>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive' className='w-full'>
                    <IconTrash /> Delete User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Permanently delete this user?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action removes {user.firstName ?? user.emailAddress}{' '}
                      from Clerk permanently. All data will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
