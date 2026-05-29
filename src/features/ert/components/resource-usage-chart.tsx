'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
  { day: 'Mon', utilized: 210, available: 340 },
  { day: 'Tue', utilized: 280, available: 270 },
  { day: 'Wed', utilized: 320, available: 230 },
  { day: 'Thu', utilized: 290, available: 260 },
  { day: 'Fri', utilized: 350, available: 200 },
  { day: 'Sat', utilized: 310, available: 240 },
  { day: 'Sun', utilized: 300, available: 250 }
];

const chartConfig = {
  utilized: {
    label: 'Utilized',
    color: 'var(--chart-1)'
  },
  available: {
    label: 'Available',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function ResourceUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Utilization Trend</CardTitle>
        <CardDescription>
          Weekly resource usage and availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} accessibilityLayer>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='day' />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type='monotone'
              dataKey='utilized'
              stackId='a'
              stroke='var(--color-utilized)'
              fill='var(--color-utilized)'
              fillOpacity={0.4}
            />
            <Area
              type='monotone'
              dataKey='available'
              stackId='a'
              stroke='var(--color-available)'
              fill='var(--color-available)'
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
