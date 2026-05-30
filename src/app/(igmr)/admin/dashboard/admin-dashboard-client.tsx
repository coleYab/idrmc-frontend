'use client';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconServer,
  IconBolt,
  IconShieldCheck,
  IconSettings,
  IconActivity
} from '@tabler/icons-react';
import { AdminMetricsCards } from '@/features/admin/components/admin-metrics-cards';
import { IncidentsStatusChart } from '@/features/admin/components/incidents-status-chart';
import { IncidentsTypeChart } from '@/features/admin/components/incidents-type-chart';
import { ErtUnitStatusChart } from '@/features/admin/components/ert-unit-status-chart';
import { useSystemHealth } from '@/features/admin/api/admin';
import { useActivityLogs } from '@/features/admin/api/admin';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export default function AdminDashboardClient() {
  const { data: healthData, isLoading: healthLoading } = useSystemHealth();
  const { data: activityData, isLoading: activityLoading } = useActivityLogs({
    limit: 5,
    sortOrder: 'DESC'
  });

  const health = healthData?.health;
  const metrics = healthData?.metrics;
  const activities = activityData?.items ?? [];

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Admin Dashboard'
      pageDescription='System overview, incidents, disasters, and recent admin activity.'
    >
      <AdminMetricsCards />

      <div className='grid gap-4 pt-5 md:grid-cols-2 lg:grid-cols-3'>
        <IncidentsStatusChart />
        <IncidentsTypeChart />
        <ErtUnitStatusChart />
      </div>

      <div className='grid gap-4 pt-5 lg:grid-cols-[1.2fr_0.8fr]'>
        <Card>
          <CardHeader>
            <CardTitle>System status</CardTitle>
            <CardDescription>
              Configuration, audit, and platform health.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            {healthLoading ? (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='border-muted rounded-lg border p-4'>
                    <Skeleton className='h-4 w-28' />
                    <Skeleton className='mt-2 h-4 w-20' />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className='border-muted space-y-3 rounded-lg border p-4'>
                  <div className='flex items-center gap-2'>
                    <IconServer />
                    <p className='font-medium'>Uptime</p>
                  </div>
                  <p>{health?.uptime ?? 'Unknown'}</p>
                </div>
                <div className='border-muted space-y-3 rounded-lg border p-4'>
                  <div className='flex items-center gap-2'>
                    <IconServer />
                    <p className='font-medium'>Config version</p>
                  </div>
                  <p>{health?.configVersion ?? 'Unknown'}</p>
                </div>
                <div className='border-muted space-y-3 rounded-lg border p-4'>
                  <div className='flex items-center gap-2'>
                    <IconBolt />
                    <p className='font-medium'>Last deploy</p>
                  </div>
                  <p>{health?.lastDeploy ?? 'Unknown'}</p>
                </div>
                <div className='border-muted space-y-3 rounded-lg border p-4'>
                  <div className='flex items-center gap-2'>
                    <IconShieldCheck />
                    <p className='font-medium'>Audit logging</p>
                  </div>
                  <p>{health?.auditLogging ?? 'Unknown'}</p>
                </div>
                <div className='border-muted space-y-3 rounded-lg border p-4'>
                  <div className='flex items-center gap-2'>
                    <IconSettings />
                    <p className='font-medium'>Backup schedule</p>
                  </div>
                  <p>{health?.backupSchedule ?? 'Unknown'}</p>
                </div>
                <div className='border-muted space-y-3 rounded-lg border p-4'>
                  <div className='flex items-center gap-2'>
                    <IconServer />
                    <p className='font-medium'>Nodes online</p>
                  </div>
                  <p>{health?.nodesOnline ?? 'Unknown'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System health</CardTitle>
            <CardDescription>Quick status and key alerts.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {healthLoading ? (
              <>
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-20 w-full' />
              </>
            ) : (
              <>
                <div className='border-muted rounded-lg border p-4'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-medium'>Failures today</p>
                    <Badge
                      variant={
                        (health?.failuresToday ?? 0) > 0
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {(health?.failuresToday ?? 0) > 0
                        ? 'Attention'
                        : 'Stable'}
                    </Badge>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {health?.failuresToday ?? 0} failures recorded today.
                  </p>
                </div>
                <div className='border-muted rounded-lg border p-4'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-medium'>Last health check</p>
                    <Badge variant='secondary'>
                      {metrics?.lastHealthCheck
                        ? new Date(metrics.lastHealthCheck).toLocaleDateString()
                        : 'Pending'}
                    </Badge>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {metrics?.activeSessions != null
                      ? `${metrics.activeSessions} active sessions`
                      : 'No session data'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 pt-5 lg:grid-cols-[1.2fr_0.8fr]'>
        <Card>
          <CardHeader>
            <CardTitle>System metrics</CardTitle>
            <CardDescription>Performance and resource usage.</CardDescription>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='border-muted rounded-lg border p-4'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='mt-2 h-8 w-16' />
                  </div>
                ))}
              </div>
            ) : metrics ? (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {metrics.apiResponseTime && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      API Response
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.apiResponseTime.value}
                      <span className='text-muted-foreground ml-1 text-sm'>
                        {metrics.apiResponseTime.unit ?? 'ms'}
                      </span>
                    </p>
                    <Badge
                      variant={
                        metrics.apiResponseTime.status === 'normal'
                          ? 'secondary'
                          : 'default'
                      }
                      className='mt-2'
                    >
                      {metrics.apiResponseTime.status}
                    </Badge>
                  </div>
                )}
                {metrics.cpuUsage && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      CPU Usage
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.cpuUsage.value}%
                    </p>
                    <Badge
                      variant={
                        metrics.cpuUsage.status === 'normal'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className='mt-2'
                    >
                      {metrics.cpuUsage.status}
                    </Badge>
                  </div>
                )}
                {metrics.memoryUsage && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      Memory
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.memoryUsage.value}
                      <span className='text-muted-foreground ml-1 text-sm'>
                        /{metrics.memoryUsage.total}GB
                      </span>
                    </p>
                    <Badge
                      variant={
                        metrics.memoryUsage.status === 'normal'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className='mt-2'
                    >
                      {metrics.memoryUsage.status}
                    </Badge>
                  </div>
                )}
                {metrics.errorRate && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      Error Rate
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.errorRate.value}%
                    </p>
                    <Badge className='mt-2'>{metrics.errorRate.status}</Badge>
                  </div>
                )}
                {metrics.cacheHitRate != null && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      Cache Hit Rate
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.cacheHitRate}%
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      Cache efficiency metric
                    </p>
                  </div>
                )}
                {metrics.databaseConnections && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      DB Connections
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.databaseConnections.value}/
                      {metrics.databaseConnections.total ?? '—'}
                    </p>
                    <Badge variant='secondary' className='mt-2'>
                      {metrics.databaseConnections.status}
                    </Badge>
                  </div>
                )}
                {metrics.activeSessions != null && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      Active Sessions
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.activeSessions}
                    </p>
                  </div>
                )}
                {metrics.requestVolume && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      Requests/sec
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.requestVolume.perSecond ?? '—'}
                    </p>
                    {metrics.requestVolume.trend && (
                      <Badge
                        variant={
                          metrics.requestVolume.trend === 'up'
                            ? 'default'
                            : 'secondary'
                        }
                        className='mt-2'
                      >
                        {metrics.requestVolume.trend}
                      </Badge>
                    )}
                  </div>
                )}
                {metrics.diskUsage && (
                  <div className='border-muted rounded-lg border p-4'>
                    <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                      Disk Usage
                    </p>
                    <p className='mt-1 text-2xl font-bold'>
                      {metrics.diskUsage.value}/{metrics.diskUsage.total}GB
                    </p>
                    <Badge variant='secondary' className='mt-2'>
                      {metrics.diskUsage.status}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>
                No system metrics available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent admin activity</CardTitle>
            <CardDescription>Latest audit trail entries</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {activityLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-20 w-full' />
              ))
            ) : activities.length === 0 ? (
              <p className='text-muted-foreground px-2 text-sm'>
                No activity recorded yet.
              </p>
            ) : (
              activities.map((entry) => (
                <div
                  key={entry.logID}
                  className='border-muted rounded-lg border p-4'
                >
                  <div className='flex items-center gap-2'>
                    <IconActivity />
                    <p className='font-medium'>{entry.actionType}</p>
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {entry.details}
                  </p>
                  <p className='text-muted-foreground mt-2 text-xs'>
                    {formatDate(entry.timestamp)} · {entry.performedBy}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
