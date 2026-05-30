'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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
import {
  IconDownload,
  IconEye,
  IconPlus,
  IconTrash,
  IconRotate
} from '@tabler/icons-react';
import {
  useClerkUsers,
  useCreateClerkUser,
  useUpdateClerkUserRoles,
  useDeleteClerkUser
} from '@/features/admin/api/clerk-users';
import { ROLE_OPTIONS, type Role } from '@/features/admin/types/clerk-user';

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
          className='text-xs'
        >
          {role.replace(/_/g, ' ')}
        </Badge>
      ))}
    </div>
  );
}

export default function UsersAdminClient() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useClerkUsers(search || undefined);
  const createUser = useCreateClerkUser();
  const updateRoles = useUpdateClerkUserRoles();
  const deleteUser = useDeleteClerkUser();

  const users = data?.items ?? [];

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('user');

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleInviteUser = async () => {
    if (
      !inviteEmail.trim() ||
      !inviteFirstName.trim() ||
      !inviteLastName.trim()
    ) {
      toast.error('All fields are required.');
      return;
    }

    try {
      await createUser.mutateAsync({
        emailAddress: inviteEmail.trim(),
        firstName: inviteFirstName.trim(),
        lastName: inviteLastName.trim(),
        roles: [inviteRole]
      });
      setInviteEmail('');
      setInviteFirstName('');
      setInviteLastName('');
      setInviteRole('user');
      setInviteOpen(false);
      toast.success('User created and invited.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleRemoveRole = async (
    userId: string,
    currentRoles: string[],
    roleToRemove: string
  ) => {
    const updated = currentRoles.filter((r) => r !== roleToRemove);
    try {
      await updateRoles.mutateAsync({ id: userId, roles: updated });
      toast.success(`Removed role ${roleToRemove.replace(/_/g, ' ')}.`);
    } catch {
      toast.error('Failed to update roles.');
    }
  };

  const handleAddRole = async (
    userId: string,
    currentRoles: string[],
    newRole: string
  ) => {
    if (currentRoles.includes(newRole)) {
      toast.info('User already has this role.');
      return;
    }
    const updated = [...currentRoles, newRole];
    try {
      await updateRoles.mutateAsync({ id: userId, roles: updated });
      toast.success(`Added role ${newRole.replace(/_/g, ' ')}.`);
    } catch {
      toast.error('Failed to update roles.');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser.mutateAsync(deleteTarget);
      setDeleteTarget(null);
      toast.success('User deleted successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleExportCsv = () => {
    if (users.length === 0) {
      toast.error('No users to export.');
      return;
    }
    const header = 'ID,First Name,Last Name,Email,Roles,Banned,Created At\n';
    const rows = users
      .map(
        (u) =>
          `${u.id},${u.firstName ?? ''},${u.lastName ?? ''},${u.emailAddress},"${u.roles.join('; ')}",${u.banned},${u.createdAt}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clerk-users.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported.');
  };

  const activeUsers = users.filter((u) => !u.banned).length;
  const adminUsers = users.filter((u) => u.roles.includes('admin')).length;

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Users Management'
      pageDescription='Manage Clerk users, roles, and account access.'
      pageHeaderAction={
        <div className='flex flex-wrap items-center gap-2'>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size='sm' variant='secondary'>
                <IconPlus /> Invite user
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite User</DialogTitle>
                <DialogDescription>
                  Create a new Clerk user with an initial role.
                </DialogDescription>
              </DialogHeader>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-2'>
                    <Label htmlFor='first-name'>First name</Label>
                    <Input
                      id='first-name'
                      value={inviteFirstName}
                      onChange={(e) => setInviteFirstName(e.target.value)}
                      placeholder='John'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='last-name'>Last name</Label>
                    <Input
                      id='last-name'
                      value={inviteLastName}
                      onChange={(e) => setInviteLastName(e.target.value)}
                      placeholder='Doe'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email address</Label>
                  <Input
                    id='email'
                    type='email'
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder='john@example.com'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='role'>Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(v) => setInviteRole(v as Role)}
                  >
                    <SelectTrigger id='role'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleInviteUser}
                  disabled={createUser.isPending}
                >
                  {createUser.isPending ? 'Creating...' : 'Create & Invite'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <span>Admins</span>
                  <Badge variant='destructive'>{adminUsers}</Badge>
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
                Users are managed directly in Clerk. Add, update roles, or
                remove users from the list below.
              </p>
              <ul className='text-muted-foreground list-disc pl-5'>
                <li>Role and status overview</li>
                <li>Direct user detail navigation</li>
                <li>Add or remove individual roles</li>
                <li>Permanently delete users</li>
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
                placeholder='Search by name, email...'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className='max-w-lg'
              />
              <div className='text-muted-foreground text-sm'>
                {users.length} user{users.length !== 1 ? 's' : ''} found
              </div>
            </div>
            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='h-24 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          <IconRotate className='h-4 w-4 animate-spin' />
                          Loading users...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            {user.imageUrl ? (
                              <img
                                src={user.imageUrl}
                                alt=''
                                className='h-8 w-8 rounded-full object-cover'
                              />
                            ) : (
                              <div className='bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium'>
                                {(user.firstName?.[0] ?? '?').toUpperCase()}
                              </div>
                            )}
                            <div className='flex flex-col'>
                              <span className='font-medium'>
                                {user.firstName ?? ''} {user.lastName ?? ''}
                              </span>
                              <span className='text-muted-foreground text-xs'>
                                {user.id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RoleBadges roles={user.roles} />
                        </TableCell>
                        <TableCell>{user.emailAddress}</TableCell>
                        <TableCell>
                          <Badge variant={user.banned ? 'outline' : 'default'}>
                            {user.banned ? 'Banned' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            <Link href={`/admin/users/${user.id}`}>
                              <Button size='sm' variant='outline'>
                                <IconEye />
                                View
                              </Button>
                            </Link>
                            <div className='relative'>
                              <Select
                                onValueChange={(value) =>
                                  handleAddRole(user.id, user.roles, value)
                                }
                              >
                                <SelectTrigger className='h-8 w-32 text-xs'>
                                  <SelectValue placeholder='+ Add role' />
                                </SelectTrigger>
                                <SelectContent>
                                  {ROLE_OPTIONS.filter(
                                    (r) => !user.roles.includes(r)
                                  ).map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role.replace(/_/g, ' ')}
                                    </SelectItem>
                                  ))}
                                  {ROLE_OPTIONS.every((r) =>
                                    user.roles.includes(r)
                                  ) && (
                                    <SelectItem value='__none__' disabled>
                                      All roles assigned
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            {user.roles.length > 0 && (
                              <div className='relative hidden sm:inline-flex'>
                                <Select
                                  onValueChange={(value) =>
                                    handleRemoveRole(user.id, user.roles, value)
                                  }
                                >
                                  <SelectTrigger className='h-8 w-32 text-xs'>
                                    <SelectValue placeholder='− Remove role' />
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
                            <AlertDialog
                              open={deleteTarget === user.id}
                              onOpenChange={(open) => {
                                if (!open) setDeleteTarget(null);
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  size='sm'
                                  variant='destructive'
                                  onClick={() => setDeleteTarget(user.id)}
                                >
                                  <IconTrash />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete user?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This permanently removes{' '}
                                    {user.firstName ?? user.emailAddress} from
                                    Clerk. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteUser}
                                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className='h-24 text-center'>
                        <div className='text-muted-foreground flex flex-col items-center gap-1'>
                          <span>No users found.</span>
                          <span className='text-xs'>
                            {search
                              ? 'Try a different search term.'
                              : 'Invite a user to get started.'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className='text-muted-foreground text-sm'>
            Users are fetched directly from Clerk. Roles are managed via
            publicMetadata.
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
