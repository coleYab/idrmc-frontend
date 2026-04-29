'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
import React from 'react';

const chartData = [
  { month: 'January', reported: 342, validated: 245 },
  { month: 'February', reported: 876, validated: 654 },
  { month: 'March', reported: 512, validated: 387 },
  { month: 'April', reported: 629, validated: 521 },
  { month: 'May', reported: 458, validated: 412 },
  { month: 'June', reported: 781, validated: 598 }
];

const chartConfig = {
  reported: {
    label: 'Reported',
    color: 'var(--chart-1)'
  },
  validated: {
    label: 'Validated',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Reports vs Validated Incidents</CardTitle>
        <CardDescription>
          Showing incoming noise compared to official validated alarms over the
          last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <DottedBackgroundPattern config={chartConfig} />
            </defs>
            <Area
              dataKey='validated'
              type='natural'
              fill='url(#dotted-background-pattern-validated)'
              fillOpacity={0.4}
              stroke='var(--color-validated)'
              stackId='a'
              strokeWidth={0.8}
            />
            <Area
              dataKey='reported'
              type='natural'
              fill='url(#dotted-background-pattern-reported)'
              fillOpacity={0.4}
              stroke='var(--color-reported)'
              stackId='a'
              strokeWidth={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, value.color])
  );
  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <pattern
          key={key}
          id={`dotted-background-pattern-${key}`}
          x='0'
          y='0'
          width='7'
          height='7'
          patternUnits='userSpaceOnUse'
        >
          <circle cx='5' cy='5' r='1.5' fill={value} opacity={0.5}></circle>
        </pattern>
      ))}
    </>
  );
};
