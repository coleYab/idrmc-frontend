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
  { name: 'Critical', value: 12, fill: 'var(--color-critical)' },
  { name: 'High', value: 18, fill: 'var(--color-high)' },
  { name: 'Medium', value: 9, fill: 'var(--color-medium)' },
  { name: 'Low', value: 5, fill: 'var(--color-low)' }
];

const chartConfig = {
  value: {
    label: 'Count'
  },
  critical: {
    label: 'Critical',
    color: 'var(--chart-1)'
  },
  high: {
    label: 'High',
    color: 'var(--chart-2)'
  },
  medium: {
    label: 'Medium',
    color: 'var(--chart-3)'
  },
  low: {
    label: 'Low',
    color: 'var(--chart-4)'
  }
} satisfies ChartConfig;

export function DisasterSeverityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disaster Severity Distribution</CardTitle>
        <CardDescription>Current disasters by severity level</CardDescription>
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
