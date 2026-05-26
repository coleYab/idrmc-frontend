'use client';

import { useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconAlertTriangle,
  IconBolt,
  IconServer,
  IconShieldCheck,
  IconSettings,
  IconUsers,
  IconActivity,
  IconDatabase,
  IconCpu,
  IconTrendingUp,
  IconClock
} from '@tabler/icons-react';
import {
  sampleActivities,
  sampleUsers,
  systemStatus,
  systemMetrics
} from '../admin-mock-data';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateString));
}

export default function AdminDashboardClient() {
  const activeUsers = sampleUsers.filter((user) => user.active).length;
  const inactiveUsers = sampleUsers.length - activeUsers;
  const recentActivity = sampleActivities.slice(0, 4);
  const failureCount = sampleActivities.filter(
    (item) => item.status === 'Failed'
  ).length;
  const lastActivity = recentActivity[0];

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Admin Dashboard'
      pageDescription='System overview, uptime, failures, configuration, and recent admin activity.'
    >
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{systemStatus.uptime}</div>
            <p className='text-muted-foreground mt-1 text-xs'>
              Continuous service availability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {systemStatus.failuresToday}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              Service incidents recorded today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Active nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{systemStatus.nodesOnline}</div>
            <p className='text-muted-foreground mt-1 text-xs'>
              Nodes currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Admin users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeUsers}</div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {inactiveUsers} inactive accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-5 pt-5 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>API Response</CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex items-center gap-3'>
              <IconBolt className='h-8 w-8 text-green-500' />
              <div>
                <div className='text-2xl font-bold'>
                  {systemMetrics.apiResponseTime.value}
                  <span className='text-muted-foreground ml-1 text-sm'>
                    {systemMetrics.apiResponseTime.unit}
                  </span>
                </div>
                <Badge variant='default' className='mt-2'>
                  {systemMetrics.apiResponseTime.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex items-center gap-3'>
              <IconCpu className='h-8 w-8 text-blue-500' />
              <div>
                <div className='text-2xl font-bold'>
                  {systemMetrics.cpuUsage.value}
                  <span className='text-muted-foreground ml-1 text-sm'>%</span>
                </div>
                <Badge
                  variant={
                    systemMetrics.cpuUsage.status === 'normal'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className='mt-2'
                >
                  {systemMetrics.cpuUsage.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Memory</CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex items-center gap-3'>
              <IconDatabase className='h-8 w-8 text-purple-500' />
              <div>
                <div className='text-2xl font-bold'>
                  {systemMetrics.memoryUsage.value}
                  <span className='text-muted-foreground ml-1 text-sm'>
                    /{systemMetrics.memoryUsage.total}GB
                  </span>
                </div>
                <Badge
                  variant={
                    systemMetrics.memoryUsage.status === 'normal'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className='mt-2'
                >
                  {systemMetrics.memoryUsage.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-3'>
              <IconAlertTriangle className='h-8 w-8 text-orange-500' />
              <div>
                <div className='text-2xl font-bold'>
                  {systemMetrics.errorRate.value}
                  <span className='text-muted-foreground ml-1 text-sm'>%</span>
                </div>
                <Badge variant='default' className='mt-2'>
                  {systemMetrics.errorRate.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-3'>
              <IconTrendingUp className='h-8 w-8 text-green-600' />
              <div>
                <div className='text-2xl font-bold'>
                  {systemMetrics.cacheHitRate}
                  <span className='text-muted-foreground ml-1 text-sm'>%</span>
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Excellent cache performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Database Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold'>
                  {systemMetrics.databaseConnections.active}/
                  {systemMetrics.databaseConnections.max}
                </span>
              </div>
              <div className='bg-muted h-2 w-full rounded-full'>
                <div
                  className='h-2 rounded-full bg-green-500'
                  style={{
                    width: `${(systemMetrics.databaseConnections.active / systemMetrics.databaseConnections.max) * 100}%`
                  }}
                />
              </div>
              <Badge variant='secondary'>
                {systemMetrics.databaseConnections.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className='pb-10'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Disk Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold'>
                  {systemMetrics.diskUsage.used}/{systemMetrics.diskUsage.total}
                  GB
                </span>
              </div>
              <div className='bg-muted h-2 w-full rounded-full'>
                <div
                  className='h-2 rounded-full bg-blue-500'
                  style={{
                    width: `${(systemMetrics.diskUsage.used / systemMetrics.diskUsage.total) * 100}%`
                  }}
                />
              </div>
              <Badge variant='secondary'>
                {systemMetrics.diskUsage.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>System Load</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm'>Active sessions</p>
              <span className='font-semibold'>
                {systemMetrics.activeSessions}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm'>Requests/sec</p>
              <span className='font-semibold'>
                {systemMetrics.requestVolume.perSecond}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm'>Trend</p>
              <Badge
                variant={
                  systemMetrics.requestVolume.trend === 'up'
                    ? 'default'
                    : 'secondary'
                }
              >
                {systemMetrics.requestVolume.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
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
            <div className='border-muted space-y-3 rounded-lg border p-4'>
              <div className='flex items-center gap-2'>
                <IconServer />
                <p className='font-medium'>Config version</p>
              </div>
              <p>{systemStatus.configVersion}</p>
            </div>
            <div className='border-muted space-y-3 rounded-lg border p-4'>
              <div className='flex items-center gap-2'>
                <IconBolt />
                <p className='font-medium'>Last deploy</p>
              </div>
              <p>{systemStatus.lastDeploy}</p>
            </div>
            <div className='border-muted space-y-3 rounded-lg border p-4'>
              <div className='flex items-center gap-2'>
                <IconShieldCheck />
                <p className='font-medium'>Audit logging</p>
              </div>
              <p>{systemStatus.auditLogging}</p>
            </div>
            <div className='border-muted space-y-3 rounded-lg border p-4'>
              <div className='flex items-center gap-2'>
                <IconSettings />
                <p className='font-medium'>Backup schedule</p>
              </div>
              <p>{systemStatus.backupSchedule}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System health</CardTitle>
            <CardDescription>Quick status and key alerts.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='border-muted rounded-lg border p-4'>
              <div className='flex items-center justify-between gap-2'>
                <p className='font-medium'>Critical failures</p>
                <Badge variant={failureCount > 0 ? 'destructive' : 'default'}>
                  {failureCount > 0 ? 'Attention' : 'Stable'}
                </Badge>
              </div>
              <p className='text-muted-foreground text-sm'>
                {failureCount} admin actions requiring review.
              </p>
            </div>
            <div className='border-muted rounded-lg border p-4'>
              <div className='flex items-center justify-between gap-2'>
                <p className='font-medium'>Recent action</p>
                <Badge variant='secondary'>Latest</Badge>
              </div>
              {lastActivity ? (
                <>
                  <p className='font-medium'>{lastActivity.action}</p>
                  <p className='text-muted-foreground text-sm'>
                    {formatDate(lastActivity.timestamp)}
                  </p>
                </>
              ) : (
                <p className='text-muted-foreground text-sm'>
                  No activity recorded yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 pt-5 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Configuration summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div className='grid gap-3'>
              <div className='border-muted rounded-lg border p-4'>
                <p className='font-medium'>Alert sensitivity</p>
                <p className='text-muted-foreground'>
                  Set to 60% for disaster triggers.
                </p>
              </div>
              <div className='border-muted rounded-lg border p-4'>
                <p className='font-medium'>Backup retention</p>
                <p className='text-muted-foreground'>
                  90 days with daily snapshots.
                </p>
              </div>
              <div className='border-muted rounded-lg border p-4'>
                <p className='font-medium'>Audit retention</p>
                <p className='text-muted-foreground'>
                  180 days with export support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent admin activity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className='border-muted rounded-lg border p-4'
              >
                <div className='flex items-center gap-2'>
                  <IconActivity />
                  <p className='font-medium'>{activity.action}</p>
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
    </PageContainer>
  );
}
