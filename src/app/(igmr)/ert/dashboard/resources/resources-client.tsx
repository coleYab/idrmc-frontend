'use client';

import { useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { useErtStore } from '@/features/ert/utils/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconBox, IconTruck, IconUsers } from '@tabler/icons-react';

export default function ResourcesClient() {
  const resources = useErtStore((state) => state.resources);
  const allocations = useErtStore((state) => state.allocations);
  const alerts = useErtStore((state) => state.alerts);

  const allocationTotals = useMemo(
    () =>
      resources.map((resource) => ({
        resource,
        allocated: allocations
          .filter((allocation) => allocation.resourceId === resource.id)
          .reduce((total, allocation) => total + allocation.quantity, 0)
      })),
    [allocations, resources]
  );

  const alertsWithAllocations = useMemo(
    () =>
      alerts.map((alert) => ({
        alert,
        allocations: allocations.filter(
          (allocation) => allocation.alertId === alert.id
        )
      })),
    [alerts, allocations]
  );

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Resource Inventory'
      pageDescription='See available food, vehicles, volunteers and other emergency resources currently ready for deployment.'
    >
      <div className='grid gap-4 lg:grid-cols-2'>
        {allocationTotals.map(({ resource, allocated }) => (
          <Card key={resource.id}>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle>{resource.name}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </div>
                <Badge variant={allocated === 0 ? 'secondary' : 'default'}>
                  {allocated === 0 ? 'Ready' : 'Assigned'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='grid gap-2 sm:grid-cols-2'>
                <div>
                  <p className='text-muted-foreground text-sm'>Available</p>
                  <p className='text-lg font-semibold'>
                    {resource.available.toLocaleString()} {resource.unit}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Allocated</p>
                  <p className='text-lg font-semibold'>
                    {allocated.toLocaleString()} {resource.unit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Current Allocations</CardTitle>
            <CardDescription>
              Active resource assignments by incident alert.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {alertsWithAllocations.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                No allocations have been created yet.
              </p>
            ) : (
              alertsWithAllocations.map(({ alert, allocations }) => (
                <div key={alert.id} className='rounded-2xl border p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='text-sm font-semibold'>{alert.title}</p>
                      <p className='text-muted-foreground text-xs'>
                        {alert.location}
                      </p>
                    </div>
                    <Badge>{allocations.length} items</Badge>
                  </div>
                  <div className='mt-3 space-y-2'>
                    {allocations.map((allocation) => {
                      const resource = resources.find(
                        (item) => item.id === allocation.resourceId
                      );
                      return (
                        <div
                          key={allocation.id}
                          className='bg-muted flex items-center justify-between rounded-lg p-3'
                        >
                          <div>
                            <p className='text-sm'>
                              {resource?.name ?? 'Unknown resource'}
                            </p>
                            <p className='text-muted-foreground text-xs'>
                              {resource?.unit}
                            </p>
                          </div>
                          <p className='text-sm font-semibold'>
                            {allocation.quantity}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Health</CardTitle>
            <CardDescription>
              Summary of resource readiness and deployment status.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4'>
              <div className='rounded-2xl border p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <IconBox className='size-5' />
                    <div>
                      <p className='text-sm font-medium'>Food & Supplies</p>
                      <p className='text-muted-foreground text-xs'>
                        Stock levels and dispatch readiness.
                      </p>
                    </div>
                  </div>
                  <Badge variant='secondary'>Healthy</Badge>
                </div>
              </div>
              <div className='rounded-2xl border p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <IconTruck className='size-5' />
                    <div>
                      <p className='text-sm font-medium'>Vehicles</p>
                      <p className='text-muted-foreground text-xs'>
                        Deployment-ready vehicles and logistics support.
                      </p>
                    </div>
                  </div>
                  <Badge variant='default'>Stable</Badge>
                </div>
              </div>
              <div className='rounded-2xl border p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <IconUsers className='size-5' />
                    <div>
                      <p className='text-sm font-medium'>Volunteers</p>
                      <p className='text-muted-foreground text-xs'>
                        Personnel ready to support operations.
                      </p>
                    </div>
                  </div>
                  <Badge variant='outline'>Available</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
