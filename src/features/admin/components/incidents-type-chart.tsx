'use client';

import { Bar, BarChart, XAxis } from 'recharts';
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

const chartConfig = {
  count: {
    label: 'Incidents',
    color: 'var(--chart-1)'
  }
};

export function IncidentsTypeChart() {
  const { data, isLoading } = useIncidents();
  const incidents = data?.items ?? [];

  const byType = new Map<string, number>();
  for (const i of incidents) {
    const type = i.incidentType ?? 'Unknown';
    byType.set(type, (byType.get(type) ?? 0) + 1);
  }

  const entries = Array.from(byType.entries());
  const chartData = entries.map(([name, count]) => ({
    type: name,
    count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidents by Type</CardTitle>
        <CardDescription>
          Breakdown of incidents by disaster type
        </CardDescription>
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
            <BarChart accessibilityLayer data={chartData}>
              <XAxis dataKey='type' />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='count' fill='var(--color-count)' radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
