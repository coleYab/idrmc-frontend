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
import { Badge } from '@/components/ui/badge';

const chartData = [
  { type: 'floods', cases: 275, fill: 'var(--color-floods)' },
  { type: 'drought', cases: 200, fill: 'var(--color-drought)' },
  { type: 'conflict', cases: 187, fill: 'var(--color-conflict)' },
  { type: 'landslide', cases: 173, fill: 'var(--color-landslide)' },
  { type: 'epidemic', cases: 90, fill: 'var(--color-epidemic)' }
];

const chartConfig = {
  cases: {
    label: 'Cases'
  },
  floods: {
    label: 'Floods',
    color: 'var(--chart-1)'
  },
  drought: {
    label: 'Drought',
    color: 'var(--chart-2)'
  },
  conflict: {
    label: 'Conflict',
    color: 'var(--chart-3)'
  },
  landslide: {
    label: 'Landslide',
    color: 'var(--chart-4)'
  },
  epidemic: {
    label: 'Epidemic',
    color: 'var(--chart-5)'
  }
} satisfies ChartConfig;

export function PieGraph() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Incident Types Breakdown</CardTitle>
        <CardDescription>January - June 2026</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        <ChartContainer
          config={chartConfig}
          className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px] min-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey='cases' hideLabel />}
            />
            <Pie
              data={chartData}
              innerRadius={30}
              dataKey='cases'
              nameKey='type'
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey='cases'
                stroke='none'
                fontSize={12}
                fontWeight={500}
                fill='currentColor'
                formatter={(value: number) => value.toString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
