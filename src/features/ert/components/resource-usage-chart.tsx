'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useResources } from '@/features/ert/api/resources';
import { mockErtResources } from '@/lib/mock/ert';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  utilized: {
    label: 'Quantity',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function ResourceUsageChart() {
  const { data, isLoading, isError } = useResources();
  const apiResources = data?.items ?? [];
  const resources =
    isError || apiResources.length === 0 ? mockErtResources : apiResources;

  const chartData = resources.map((r) => ({
    name: r.name,
    utilized: r.quantity
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Utilization Trend</CardTitle>
        <CardDescription>Available quantity by resource type</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-48 w-full' />
        ) : chartData.length === 0 ? (
          <div className='text-muted-foreground flex h-48 items-center justify-center text-sm'>
            No resource data available.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData} accessibilityLayer>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type='monotone'
                dataKey='utilized'
                stroke='var(--color-utilized)'
                fill='var(--color-utilized)'
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
