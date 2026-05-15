import { cn } from '@/lib/utils';
import { mockIncidents } from '@/lib/mock/incidents';
import { IncidentStatus } from '@/lib/types/incident';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconCircleCheck,
  IconReportAnalytics
} from '@tabler/icons-react';

interface MetricsCardsProps {
  className?: string;
}

interface MetricCardProps {
  label: string;
  value: number | string;
  badge: string;
  badgeTrend: 'up' | 'down' | 'neutral';
  trendLabel: string;
  subtitle: string;
}

function MetricCard({
  label,
  value,
  badge,
  badgeTrend,
  trendLabel,
  subtitle
}: MetricCardProps) {
  const TrendIcon =
    badgeTrend === 'up'
      ? IconTrendingUp
      : badgeTrend === 'down'
        ? IconTrendingDown
        : IconReportAnalytics;

  const trendColor =
    badgeTrend === 'up'
      ? 'text-emerald-400'
      : badgeTrend === 'down'
        ? 'text-rose-400'
        : 'text-sky-400';

  return (
    <div className='bg-card flex flex-1 flex-col justify-between gap-3 rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md'>
      {/* Top row: label + badge */}
      <div className='flex items-start justify-between gap-2'>
        <span className='text-muted-foreground text-sm font-medium'>
          {label}
        </span>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold',
            badgeTrend === 'up' &&
              'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
            badgeTrend === 'down' &&
              'border-rose-500/30 bg-rose-500/10 text-rose-400',
            badgeTrend === 'neutral' &&
              'border-sky-500/30 bg-sky-500/10 text-sky-400'
          )}
        >
          <TrendIcon className='size-3' />
          {badge}
        </span>
      </div>

      {/* Big number */}
      <p className='text-foreground text-3xl font-bold tracking-tight tabular-nums'>
        {value}
      </p>

      {/* Bottom: trend label + subtitle */}
      <div className='space-y-0.5'>
        <p
          className={cn(
            'flex items-center gap-1 text-sm font-semibold',
            trendColor
          )}
        >
          {trendLabel}
          <TrendIcon className='size-4' />
        </p>
        <p className='text-muted-foreground text-xs'>{subtitle}</p>
      </div>
    </div>
  );
}

export function MetricsCards({ className }: MetricsCardsProps) {
  const pendingReports = mockIncidents.filter(
    (i) => i.status === IncidentStatus.PENDING
  ).length;
  const activeIncidents = mockIncidents.filter(
    (i) => i.status === IncidentStatus.ACTIVE
  ).length;
  const resolvedIncidents = mockIncidents.filter(
    (i) => i.status === IncidentStatus.RESOLVED
  ).length;
  const totalIncidents = mockIncidents.length;

  const pct = (n: number) =>
    totalIncidents > 0 ? `+${Math.round((n / totalIncidents) * 100)}%` : '0%';

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6',
        className
      )}
    >
      <MetricCard
        label='Pending Reports'
        value={pendingReports}
        badge={pct(pendingReports)}
        badgeTrend='down'
        trendLabel='Awaiting verification'
        subtitle='Reports requiring immediate attention'
      />
      <MetricCard
        label='Active Incidents'
        value={activeIncidents}
        badge={pct(activeIncidents)}
        badgeTrend='up'
        trendLabel='Currently being managed'
        subtitle='Incidents under active response'
      />
      <MetricCard
        label='Resolved Incidents'
        value={resolvedIncidents}
        badge={pct(resolvedIncidents)}
        badgeTrend='up'
        trendLabel='Successfully handled'
        subtitle='Completed incident responses'
      />
      <MetricCard
        label='Total Incidents'
        value={totalIncidents}
        badge='All time'
        badgeTrend='neutral'
        trendLabel='Total reported incidents'
        subtitle='Cumulative incident count'
      />
    </div>
  );
}
