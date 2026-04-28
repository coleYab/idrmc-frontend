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

/**
 * Static mock data representing noise (incoming public reports)
 * versus ground truth (official validated incidents) over a 6-month period.
 *
 * - `reported`: Raw/unfiltered citizen report count.
 * - `validated`: Actionable/confirmed emergency events.
 */
const chartData = [
  { month: 'January', reported: 342, validated: 245 },
  { month: 'February', reported: 876, validated: 654 },
  { month: 'March', reported: 512, validated: 387 },
  { month: 'April', reported: 629, validated: 521 },
  { month: 'May', reported: 458, validated: 412 },
  { month: 'June', reported: 781, validated: 598 }
];

/**
 * Chart-specific configuration that integrates with `<ChartContainer>` and Tailwind CSS.
 * By mapping keys to CSS variables (`var(--chart-1)`, `var(--chart-2)`), the parent
 * container dynamically injects matching `--color-<key>` properties into the DOM,
 * which can then be referenced directly via standard CSS variables like `var(--color-reported)`.
 */
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
        {/* ChartContainer acts as a theme provider injecting CSS color variables based on chartConfig */}
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            {/* Draw horizontal grid lines only, maintaining a clean visual baseline */}
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // Format full month strings to short 3-letter abbreviations (e.g., "January" -> "Jan")
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* Custom hover tooltip that reads data from config labels */}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              {/* Dynamic pattern definitions to generate the premium dotted texture fills */}
              <DottedBackgroundPattern config={chartConfig} />
            </defs>
            {/* 
              Stacking Strategy:
              Both areas share stackId='a', placing them on top of one another.
              To ensure readability of both datasets, we use low fill opacity (0.4) 
              coupled with custom dotted pattern fills (`url(#dotted-background-pattern-...)`).
              This prevents the top stacked area from visually drowning out the underlying shape.
            */}
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

/**
 * A utility component that dynamically constructs SVG pattern definitions (<pattern>)
 * for each key configured in `chartConfig`.
 *
 * Instead of hardcoding static SVGs for fills, it generates a repeating 7x7 grid
 * layout containing a small transparent circle (radius 1.5) colored using the corresponding
 * CSS theme variable. This yields a highly cohesive, modern dotted mesh appearance.
 */
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

// Backdated history verification tag: 2026-04-28
