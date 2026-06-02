'use client';

import { Bar, BarChart, XAxis } from 'recharts';
import { useResourceNeeds } from '@/features/ert/api/resources';
import { mockErtResourceNeeds } from '@/lib/mock/ert';

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
  allocated: {
    label: 'Required',
    color: 'var(--chart-1)'
  },
  deployed: {
    label: 'Fulfilled',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function ResourceAllocationChart() {
  const { data, isLoading, isError } = useResourceNeeds();
  const apiNeeds = data?.items ?? [];
  const needs =
    isError || apiNeeds.length === 0 ? mockErtResourceNeeds : apiNeeds;

  const byResource = new Map<string, { required: number; fulfilled: number }>();

  for (const need of needs) {
    const entry = byResource.get(need.resourceID) ?? {
      required: 0,
      fulfilled: 0
    };
    entry.required += need.quantityRequired;
    entry.fulfilled += need.quantityFulfilled ?? 0;
    byResource.set(need.resourceID, entry);
  }

  const chartData = Array.from(byResource.entries()).map(
    ([resourceID, vals]) => ({
      category: resourceID.slice(0, 8),
      allocated: vals.required,
      deployed: vals.fulfilled
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation & Deployment</CardTitle>
        <CardDescription>
          Required vs fulfilled resources by need
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-48 w-full' />
        ) : chartData.length === 0 ? (
          <div className='text-muted-foreground flex h-48 items-center justify-center text-sm'>
            No resource needs have been created yet.
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis dataKey='category' />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey='allocated'
                fill='var(--color-allocated)'
                radius={8}
              />
              <Bar dataKey='deployed' fill='var(--color-deployed)' radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
