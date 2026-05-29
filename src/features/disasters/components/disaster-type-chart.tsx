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
  { type: 'Floods', active: 8, resolved: 12 },
  { type: 'Drought', active: 5, resolved: 7 },
  { type: 'Conflict', active: 3, resolved: 4 },
  { type: 'Landslide', active: 4, resolved: 6 },
  { type: 'Epidemic', active: 2, resolved: 3 }
];

const chartConfig = {
  active: {
    label: 'Active',
    color: 'var(--chart-1)'
  },
  resolved: {
    label: 'Resolved',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function DisasterTypeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disasters by Type</CardTitle>
        <CardDescription>
          Active and resolved disasters by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis dataKey='type' />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='active' fill='var(--color-active)' radius={8} />
            <Bar dataKey='resolved' fill='var(--color-resolved)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
