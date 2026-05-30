'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIncidents } from '@/features/incidents/api/incidents';
import { useDisasters } from '@/features/disasters/api/disasters';
import { useClerkUsers } from '@/features/admin/api/clerk-users';
import { useErtUnits } from '@/features/ert/api/ert';
import { useResources } from '@/features/ert/api/resources';

export function AdminMetricsCards() {
  const { data: incidentsData, isLoading: incidentsLoading } = useIncidents();
  const { data: disastersData, isLoading: disastersLoading } = useDisasters();
  const { data: usersData, isLoading: usersLoading } = useClerkUsers();
  const { data: unitsData, isLoading: unitsLoading } = useErtUnits();
  const { data: resourcesData, isLoading: resourcesLoading } = useResources();

  const isLoading =
    incidentsLoading ||
    disastersLoading ||
    usersLoading ||
    unitsLoading ||
    resourcesLoading;

  const incidents = incidentsData?.items ?? [];
  const disasters = disastersData ?? [];
  const users = usersData?.items ?? [];
  const units = unitsData?.items ?? [];
  const resources = resourcesData?.items ?? [];

  const activeIncidents = incidents.filter(
    (i) => i.status === 'Active' || i.status === 'Verified'
  ).length;
  const activeDisasters = disasters.length;
  const adminUsers = users.filter((u) => u.roles.includes('admin')).length;
  const deployedUnits = units.filter((u) => u.status === 'DEPLOYED').length;
  const totalResources = resources.reduce(
    (sum, r) => sum + (r.quantity ?? 0),
    0
  );

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='pb-2'>
              <Skeleton className='h-4 w-20' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-12' />
              <Skeleton className='mt-1 h-3 w-24' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-6'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium'>
            Active Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{activeIncidents}</div>
          <p className='text-muted-foreground mt-1 text-xs'>
            {incidents.length} total incidents
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium'>
            Active Disasters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{activeDisasters}</div>
          <p className='text-muted-foreground mt-1 text-xs'>
            Declared emergencies
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium'>Clerk Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{users.length}</div>
          <p className='text-muted-foreground mt-1 text-xs'>
            {adminUsers} admin{adminUsers !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium'>ERT Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{deployedUnits}</div>
          <p className='text-muted-foreground mt-1 text-xs'>
            {units.length - deployedUnits} idle
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium'>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{resources.length}</div>
          <p className='text-muted-foreground mt-1 text-xs'>
            {totalResources.toLocaleString()} total quantity
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium'>Pending Needs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>—</div>
          <p className='text-muted-foreground mt-1 text-xs'>
            Resource requests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
