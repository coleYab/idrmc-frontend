'use client';

import PageContainer from '@/components/layout/page-container';
import { useErtUnits } from '@/features/ert/api/ert';
import { useResources } from '@/features/ert/api/resources';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { IconMapPin } from '@tabler/icons-react';

export default function MapResourcesClient() {
  const { data: unitsData, isLoading: unitsLoading } = useErtUnits();
  const { data: resourcesData, isLoading: resourcesLoading } = useResources();

  const isLoading = unitsLoading || resourcesLoading;
  const units = unitsData?.items ?? [];
  const resources = resourcesData?.items ?? [];

  const deployedUnits = units.filter((u) => u.status === 'DEPLOYED');

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Map Resources'
      pageDescription='Track which resources are deployed across incident locations and review available support on the map.'
    >
      <div className='grid gap-4 lg:grid-cols-[1.5fr_0.85fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Resource Map</CardTitle>
            <CardDescription>
              Geographic context for incident response and support.
            </CardDescription>
          </CardHeader>
          <CardContent className='bg-muted border-border flex h-105 flex-col items-center justify-center rounded-3xl border border-dashed text-center'>
            <IconMapPin className='text-muted-foreground size-12' />
            <p className='text-muted-foreground mt-4 max-w-xl text-sm'>
              This space shows deployed units and resources.
              {deployedUnits.length > 0
                ? ` ${deployedUnits.length} unit(s) currently deployed.`
                : ''}
            </p>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Deployed Units</CardTitle>
              <CardDescription>
                ERT units currently in the field.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {isLoading ? (
                <Skeleton className='h-20 w-full' />
              ) : deployedUnits.length === 0 ? (
                <p className='text-muted-foreground text-sm'>
                  No units currently deployed.
                </p>
              ) : (
                deployedUnits.map((unit) => (
                  <div key={unit.unitID} className='rounded-2xl border p-4'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-sm font-semibold'>{unit.name}</p>
                        <p className='text-muted-foreground text-xs'>
                          {unit.region ?? 'No region'}
                        </p>
                      </div>
                      <Badge>{unit.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
              <CardDescription>
                Resource types ready for deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {isLoading ? (
                <Skeleton className='h-20 w-full' />
              ) : resources.length === 0 ? (
                <p className='text-muted-foreground py-6 text-center text-sm'>
                  No resources available.
                </p>
              ) : (
                resources.map((resource) => (
                  <div key={resource.id} className='rounded-2xl border p-4'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-sm font-semibold'>{resource.name}</p>
                        <p className='text-muted-foreground text-xs'>
                          {resource.category}
                        </p>
                      </div>
                      <Badge>
                        {resource.quantity.toLocaleString()} available
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
