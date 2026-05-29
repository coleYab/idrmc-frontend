'use client';

import { Bar, BarChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { category: 'Medical', allocated: 450, deployed: 320 },
  { category: 'Food', allocated: 380, deployed: 280 },
  { category: 'Water', allocated: 320, deployed: 240 },
  { category: 'Shelter', allocated: 290, deployed: 190 },
  { category: 'Equipment', allocated: 260, deployed: 180 }
];

const chartConfig = {
  allocated: {
    label: 'Allocated',
    color: 'var(--chart-1)'
  },
  deployed: {
    label: 'Deployed',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function ResourceAllocationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation & Deployment</CardTitle>
        <CardDescription>
          Allocated vs deployed resources by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis dataKey='category' />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='allocated' fill='var(--color-allocated)' radius={8} />
            <Bar dataKey='deployed' fill='var(--color-deployed)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
