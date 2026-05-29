'use client';

import { LabelList, Pie, PieChart } from 'recharts';

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
  { name: 'Medical Supplies', value: 320, fill: 'var(--color-medical)' },
  { name: 'Food & Water', value: 280, fill: 'var(--color-food)' },
  { name: 'Shelter Materials', value: 190, fill: 'var(--color-shelter)' },
  { name: 'Equipment', value: 180, fill: 'var(--color-equipment)' },
  { name: 'Other', value: 150, fill: 'var(--color-other)' }
];

const chartConfig = {
  value: {
    label: 'Units'
  },
  medical: {
    label: 'Medical Supplies',
    color: 'var(--chart-1)'
  },
  food: {
    label: 'Food & Water',
    color: 'var(--chart-2)'
  },
  shelter: {
    label: 'Shelter Materials',
    color: 'var(--chart-3)'
  },
  equipment: {
    label: 'Equipment',
    color: 'var(--chart-4)'
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)'
  }
} satisfies ChartConfig;

export function ResourceDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Distribution</CardTitle>
        <CardDescription>Current deployment breakdown by type</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
