'use client';

import { useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useActivityLogs } from '@/features/admin/api/admin';
import { queryKeys } from '@/lib/query-keys';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export default function ActivityLogClient() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');

  const { data, isLoading, isError, error } = useActivityLogs();

  const filteredEntries = useMemo(() => {
    if (!data?.items) return [];
    if (!query.trim()) return data.items;
    const lower = query.toLowerCase();
    return data.items.filter(
      (entry) =>
        entry.actionType.toLowerCase().includes(lower) ||
        entry.resourceName.toLowerCase().includes(lower) ||
        entry.details.toLowerCase().includes(lower) ||
        String(entry.performedBy).includes(lower)
    );
  }, [data, query]);

  const totalUsers = useMemo(
    () => new Set((data?.items ?? []).map((entry) => entry.performedBy)).size,
    [data]
  );

  const lastEntry = filteredEntries[0];

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.activity.root });
  }

  function handleExportLog() {
    const headers = ['Date', 'User', 'Action', 'Target', 'Details'];
    const rows = filteredEntries.map((entry) => [
      formatDate(entry.timestamp),
      `User #${entry.performedBy}`,
      entry.actionType,
      entry.resourceName,
      entry.details
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (isError) {
    return (
      <PageContainer
        scrollable={true}
        pageTitle='Activity Log'
        pageDescription='Track every user action, including timestamp, actor, and result.'
      >
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-destructive text-lg font-medium'>
              Failed to load activity log
            </p>
            <p className='text-muted-foreground mt-2 text-sm'>
              {error?.message ?? 'An unexpected error occurred.'}
            </p>
            <Button variant='outline' className='mt-4' onClick={handleRefresh}>
              <IconRefresh /> Retry
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Activity Log'
      pageDescription='Track every user action, including timestamp, actor, and result.'
      pageHeaderAction={
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            size='sm'
            variant='secondary'
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <IconRefresh /> Refresh
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={handleExportLog}
            disabled={filteredEntries.length === 0}
          >
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
                <div className='mt-2 text-2xl font-semibold'>
                  {isLoading ? (
                    <Skeleton className='h-8 w-16' />
                  ) : (
                    (data?.meta?.total ?? filteredEntries.length)
                  )}
                </div>
              </div>
              <div className='border-muted rounded-lg border p-4'>
                <p className='text-muted-foreground text-sm'>Active actors</p>
                <div className='mt-2 text-2xl font-semibold'>
                  {isLoading ? <Skeleton className='h-8 w-16' /> : totalUsers}
                </div>
              </div>
              <div className='border-muted rounded-lg border p-4'>
                <p className='text-muted-foreground text-sm'>Latest event</p>
                <div className='mt-2 text-base font-medium'>
                  {isLoading ? (
                    <Skeleton className='h-6 w-32' />
                  ) : lastEntry ? (
                    formatDate(lastEntry.timestamp)
                  ) : (
                    'No events yet'
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Search activities</p>
              <Input
                placeholder='Filter by action, resource, or user ID'
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
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='border-muted rounded-lg border p-3'>
                    <Skeleton className='mb-2 h-5 w-40' />
                    <Skeleton className='mb-1 h-4 w-32' />
                    <Skeleton className='h-3 w-48' />
                  </div>
                ))
              : filteredEntries.slice(0, 4).map((entry) => (
                  <div
                    key={entry.logID}
                    className='border-muted rounded-lg border p-3'
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <p className='font-medium'>{entry.actionType}</p>
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      {entry.resourceName}
                    </p>
                    <p className='text-muted-foreground mt-2 text-xs'>
                      {formatDate(entry.timestamp)} · User #{entry.performedBy}
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
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className='h-4 w-24' />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.logID}>
                      <TableCell>{formatDate(entry.timestamp)}</TableCell>
                      <TableCell>User #{entry.performedBy}</TableCell>
                      <TableCell>{entry.actionType}</TableCell>
                      <TableCell>{entry.resourceName}</TableCell>
                      <TableCell className='max-w-xs truncate'>
                        {entry.details}
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
