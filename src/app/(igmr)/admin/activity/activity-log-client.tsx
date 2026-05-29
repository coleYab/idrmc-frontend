'use client';

import { useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { IconActivity, IconDownload, IconRefresh } from '@tabler/icons-react';
import { sampleActivities } from '../admin-mock-data';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export default function ActivityLogClient() {
  const [query, setQuery] = useState('');

  const filteredActivities = useMemo(
    () =>
      sampleActivities.filter((activity) =>
        [activity.user, activity.action, activity.target, activity.details]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  const totalUsers = useMemo(
    () => new Set(sampleActivities.map((activity) => activity.user)).size,
    []
  );

  const lastEvent = filteredActivities[0];

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Activity Log'
      pageDescription='Track every user action, including timestamp, actor, and result.'
      pageHeaderAction={
        <div className='flex flex-wrap items-center gap-2'>
          <Button size='sm' variant='secondary'>
            <IconRefresh /> Refresh
          </Button>
          <Button size='sm' variant='outline'>
            <IconDownload /> Export log
          </Button>
        </div>
      }
    >
      <div className='grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Audit summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <div className='grid gap-3 sm:grid-cols-3'>
              <div className='border-muted rounded-lg border p-4'>
                <p className='text-muted-foreground text-sm'>Total events</p>
                <p className='mt-2 text-2xl font-semibold'>
                  {sampleActivities.length}
                </p>
              </div>
              <div className='border-muted rounded-lg border p-4'>
                <p className='text-muted-foreground text-sm'>Active actors</p>
                <p className='mt-2 text-2xl font-semibold'>{totalUsers}</p>
              </div>
              <div className='border-muted rounded-lg border p-4'>
                <p className='text-muted-foreground text-sm'>Latest event</p>
                <p className='mt-2 text-base font-medium'>
                  {lastEvent
                    ? formatDate(lastEvent.timestamp)
                    : 'No events yet'}
                </p>
              </div>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Search activities</p>
              <Input
                placeholder='Filter by user, action, or target'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent actions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {filteredActivities.slice(0, 4).map((activity) => (
              <div
                key={activity.id}
                className='border-muted rounded-lg border p-3'
              >
                <div className='flex items-center justify-between gap-3'>
                  <p className='font-medium'>{activity.action}</p>
                  <Badge
                    variant={
                      activity.status === 'Success'
                        ? 'default'
                        : activity.status === 'Warning'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className='text-muted-foreground text-sm'>
                  {activity.target}
                </p>
                <p className='text-muted-foreground mt-2 text-xs'>
                  {formatDate(activity.timestamp)} · {activity.user}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity log</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.timestamp)}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.target}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.status === 'Success'
                              ? 'default'
                              : activity.status === 'Warning'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='h-24 text-center'>
                      No activity entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
