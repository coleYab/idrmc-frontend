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
  { date: 'Jan', new: 12, ongoing: 8 },
  { date: 'Feb', new: 15, ongoing: 18 },
  { date: 'Mar', new: 10, ongoing: 22 },
  { date: 'Apr', new: 18, ongoing: 28 },
  { date: 'May', new: 14, ongoing: 32 },
  { date: 'Jun', new: 11, ongoing: 28 }
];

const chartConfig = {
  new: {
    label: 'New Disasters',
    color: 'var(--chart-1)'
  },
  ongoing: {
    label: 'Ongoing',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function DisasterTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disaster Trends</CardTitle>
        <CardDescription>New and ongoing disasters over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} accessibilityLayer>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type='monotone'
              dataKey='new'
              stackId='a'
              stroke='var(--color-new)'
              fill='var(--color-new)'
              fillOpacity={0.4}
            />
            <Area
              type='monotone'
              dataKey='ongoing'
              stackId='a'
              stroke='var(--color-ongoing)'
              fill='var(--color-ongoing)'
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
