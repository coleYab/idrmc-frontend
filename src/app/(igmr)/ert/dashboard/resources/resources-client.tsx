'use client';

import { useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { useResources, useResourceNeeds } from '@/features/ert/api/resources';
import { useErtUnits } from '@/features/ert/api/ert';
import {
  mockErtResources,
  mockErtResourceNeeds,
  mockErtUnits
} from '@/lib/mock/ert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBox, IconTruck, IconUsers } from '@tabler/icons-react';

export default function ResourcesClient() {
  const {
    data: resourcesData,
    isLoading: resourcesLoading,
    isError: resourcesError
  } = useResources();
  const {
    data: needsData,
    isLoading: needsLoading,
    isError: needsError
  } = useResourceNeeds();
  const { data: unitsData } = useErtUnits();

  const isLoading = resourcesLoading || needsLoading;
  const apiResources = resourcesData?.items ?? [];
  const apiNeeds = needsData?.items ?? [];
  const resources =
    resourcesError || apiResources.length === 0
      ? mockErtResources
      : apiResources;
  const needs =
    needsError || apiNeeds.length === 0 ? mockErtResourceNeeds : apiNeeds;

  const allocationTotals = useMemo(
    () =>
      resources.map((resource) => {
        const allocated = needs
          .filter((need) => need.resourceID === resource.id)
          .reduce((sum, need) => sum + need.quantityRequired, 0);

        return {
          resource,
          allocated,
          total: resource.quantity + allocated
        };
      }),
    [resources, needs]
  );

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Resource Inventory'
      pageDescription='See available food, vehicles, volunteers and other emergency resources currently ready for deployment.'
    >
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-4 w-48' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-16 w-full' />
              </CardContent>
            </Card>
          ))
        ) : allocationTotals.length === 0 ? (
          <div className='border-muted text-muted-foreground col-span-full flex flex-col items-center gap-2 rounded-2xl border border-dashed p-12 text-center'>
            <IconBox className='size-10' />
            <p className='text-sm font-medium'>No resources registered</p>
            <p className='text-xs'>
              Resources will appear here once they are added to the system.
            </p>
          </div>
        ) : (
          allocationTotals.map(({ resource, allocated, total }) => (
            <Card key={resource.id}>
              <CardHeader>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <CardTitle>{resource.name}</CardTitle>
                    <CardDescription>{resource.category}</CardDescription>
                  </div>
                  <Badge variant={allocated === 0 ? 'secondary' : 'default'}>
                    {allocated === 0 ? 'Ready' : 'Assigned'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='grid gap-2 sm:grid-cols-3'>
                  <div>
                    <p className='text-muted-foreground text-sm'>Total</p>
                    <p className='text-lg font-semibold'>
                      {total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm'>Available</p>
                    <p className='text-lg font-semibold'>
                      {resource.quantity.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm'>Allocated</p>
                    <p className='text-lg font-semibold'>
                      {allocated.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className='grid gap-4 lg:grid-cols-[1.4fr_0.95fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Current Needs</CardTitle>
            <CardDescription>
              Active resource requirements by priority.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className='rounded-2xl border p-4'>
                  <Skeleton className='mb-2 h-5 w-40' />
                  <Skeleton className='h-4 w-24' />
                </div>
              ))
            ) : needs.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                No resource needs have been created yet.
              </p>
            ) : (
              needs.map((need) => {
                const resource = resources.find(
                  (r) => r.id === need.resourceID
                );
                return (
                  <div key={need.id} className='rounded-2xl border p-4'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-sm font-semibold'>
                          {resource?.name ?? 'Unknown resource'}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          Priority: {need.priority}
                        </p>
                      </div>
                      <Badge
                        variant={
                          need.status === 'satisfied'
                            ? 'default'
                            : need.status === 'in_progress'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {need.status === 'in_progress'
                          ? 'In Progress'
                          : need.status === 'satisfied'
                            ? 'Satisfied'
                            : 'Pending'}
                      </Badge>
                    </div>
                    <div className='mt-2 text-sm'>
                      Required: {need.quantityRequired}
                    </div>
                  </div>
                );
              })
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
                      <p className='text-sm font-medium'>Supplies</p>
                      <p className='text-muted-foreground text-xs'>
                        {resources.length} resource types registered
                      </p>
                    </div>
                  </div>
                  <Badge variant='secondary'>Ready</Badge>
                </div>
              </div>
              <div className='rounded-2xl border p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <IconUsers className='size-5' />
                    <div>
                      <p className='text-sm font-medium'>Units</p>
                      <p className='text-muted-foreground text-xs'>
                        {(unitsData?.items ?? mockErtUnits).length} ERT units
                        registered
                      </p>
                    </div>
                  </div>
                  <Badge variant='default'>Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
