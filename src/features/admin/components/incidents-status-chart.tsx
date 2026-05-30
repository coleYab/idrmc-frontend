'use client';

import { LabelList, Pie, PieChart } from 'recharts';
import { useIncidents } from '@/features/incidents/api/incidents';

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

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
];

export function IncidentsStatusChart() {
  const { data, isLoading } = useIncidents();
  const incidents = data?.items ?? [];

  const byStatus = new Map<string, number>();
  for (const i of incidents) {
    const status = i.status ?? 'Unknown';
    byStatus.set(status, (byStatus.get(status) ?? 0) + 1);
  }

  const entries = Array.from(byStatus.entries());
  const chartData = entries.map(([name, value], i) => ({
    name,
    value,
    fill: COLORS[i % COLORS.length]
  }));

  const chartConfig = Object.fromEntries(
    entries.map(([name], i) => [
      name.toLowerCase(),
      { label: name, color: COLORS[i % COLORS.length] }
    ])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidents by Status</CardTitle>
        <CardDescription>Current breakdown of all incidents</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-48 w-full' />
        ) : chartData.length === 0 ? (
          <div className='text-muted-foreground flex h-48 items-center justify-center text-sm'>
            No incidents recorded.
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
