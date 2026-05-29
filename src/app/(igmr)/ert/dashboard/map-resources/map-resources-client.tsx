'use client';

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
import { IconMapPin } from '@tabler/icons-react';

export default function MapResourcesClient() {
  const alerts = useErtStore((state) => state.alerts);
  const allocations = useErtStore((state) => state.allocations);
  const resources = useErtStore((state) => state.resources);

  const alertResourceCounts = alerts.map((alert) => ({
    alert,
    count: allocations.filter((allocation) => allocation.alertId === alert.id)
      .length
  }));

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
              This space shows deployed resources and incident locations.
              Resource allocation changes update in real time across alert and
              inventory pages.
            </p>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Incident Resource Summary</CardTitle>
              <CardDescription>
                Active alerts with assigned resources.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {alertResourceCounts.length === 0 ? (
                <p className='text-muted-foreground text-sm'>
                  No active incidents are assigned resources yet.
                </p>
              ) : (
                alertResourceCounts.map(({ alert, count }) => (
                  <div key={alert.id} className='rounded-2xl border p-4'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-sm font-semibold'>{alert.title}</p>
                        <p className='text-muted-foreground text-xs'>
                          {alert.location}
                        </p>
                      </div>
                      <Badge>{count} resources</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
              <CardDescription>Inventory ready for deployment.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {resources.map((resource) => (
                <div key={resource.id} className='rounded-2xl border p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='text-sm font-semibold'>{resource.name}</p>
                      <p className='text-muted-foreground text-xs'>
                        {resource.unit}
                      </p>
                    </div>
                    <Badge>
                      {resource.available.toLocaleString()} available
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
