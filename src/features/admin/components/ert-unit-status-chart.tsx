'use client';

import { Bar, BarChart, XAxis } from 'recharts';
import { useErtUnits } from '@/features/ert/api/ert';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'Units',
    color: 'var(--chart-1)'
  }
};

export function ErtUnitStatusChart() {
  const { data, isLoading } = useErtUnits();
  const units = data?.items ?? [];

  const byStatus = new Map<string, number>();
  for (const u of units) {
    const status = u.status ?? 'Unknown';
    byStatus.set(status, (byStatus.get(status) ?? 0) + 1);
  }

  const chartData = Array.from(byStatus.entries()).map(([name, count]) => ({
    status: name,
    count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ERT Unit Status</CardTitle>
        <CardDescription>Deployed vs idle units</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-48 w-full' />
        ) : chartData.length === 0 ? (
          <div className='text-muted-foreground flex h-48 items-center justify-center text-sm'>
            No ERT units registered.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis dataKey='status' />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='count' fill='var(--color-count)' radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
