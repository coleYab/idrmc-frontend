'use client';

import { LabelList, Pie, PieChart } from 'recharts';
import { useResources } from '@/features/ert/api/resources';

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
  value: {
    label: 'Quantity'
  }
} satisfies ChartConfig;

export function ResourceDistributionChart() {
  const { data, isLoading } = useResources();
  const resources = data?.items ?? [];

  const byCategory = new Map<string, number>();
  for (const r of resources) {
    const category = r.category ?? 'Uncategorized';
    byCategory.set(category, (byCategory.get(category) ?? 0) + r.quantity);
  }

  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)'
  ];

  const chartData = Array.from(byCategory.entries()).map(
    ([name, value], i) => ({
      name,
      value,
      fill: colors[i % colors.length]
    })
  );

  for (const entry of chartData) {
    const key = entry.name.toLowerCase().replace(/\s+/g, '-');
    chartConfig[key] = { label: entry.name, color: entry.fill };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Distribution</CardTitle>
        <CardDescription>Current deployment breakdown by type</CardDescription>
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
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={chartData} dataKey='value' label>
                <LabelList
                  dataKey='name'
                  position='outside'
                  offset={8}
                  fontSize={12}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
