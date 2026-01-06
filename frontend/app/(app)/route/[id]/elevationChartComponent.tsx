'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardHeading } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Area, ComposedChart, Line, XAxis, YAxis } from 'recharts';

interface ElevationChartProps {
  elevationForDistanceArray: {
    distance: number;
    elevation: number
  }[];
}

const chartConfig = {
  elevation: {
    label: 'Elevation',
    color: 'hsl(172, 82%, 60%)',
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-zinc-800 border border-zinc-700 text-white p-3 shadow-lg">
        <div className="text-xs text-zinc-400 mb-2">Point {label}</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
          <span className="text-sm text-zinc-300">Elevation:</span>
          <span className="font-semibold">{payload[0].value.toFixed(2)} m</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ElevationChart({ elevationForDistanceArray }: ElevationChartProps) {
  // Transform elevation array to chart data format
  const chartData = elevationForDistanceArray.map(({ distance, elevation }) => ({
    distance,
    elevation,
  }));

  const nrOfPoints = chartData.length;

  return (
    <div className="flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full rounded-3xl lg:max-w-4xl bg-zinc-950 border-zinc-800 text-white">
        <CardHeader className="min-h-auto gap-5 p-8 border-0">
          <CardHeading className="flex flex-wrap items-end gap-5">
            <div className="min-w-40 space-y-0.5 me-2.5">
              <div className="text-3xl leading-none font-bold">Elevation Profile</div>
            </div>
            <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
              <div className="space-y-0.5">
                <div
                  className="text-[11px] font-normal flex items-center gap-1.5"
                  style={{ color: chartConfig.elevation.color }}
                >
                  <div
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: chartConfig.elevation.color }}
                  />
                  Elevation
                </div>
              </div>
            </div>
          </CardHeading>
        </CardHeader>

        <CardContent className="ps-2.5 pe-4.5">
          <div className="h-[400px] w-full">
            <ChartContainer
              config={chartConfig}
              className="h-full w-full overflow-visible [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
            >
              <ComposedChart
                data={chartData}
                margin={{
                  top: 25,
                  right: 25,
                  left: 15,
                  bottom: 25,
                }}
                style={{ overflow: 'visible' }}
              >
                <defs>
                  {/* Grid pattern */}
                  <pattern id="gridPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path
                      d="M 30 0 L 0 0 0 30"
                      fill="none"
                      stroke="rgb(51 65 85)"
                      strokeWidth="0.5"
                      strokeOpacity="0.3"
                    />
                  </pattern>

                  {/* Linear gradient for area */}
                  <linearGradient id="elevationAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartConfig.elevation.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={chartConfig.elevation.color} stopOpacity="0.02" />
                  </linearGradient>

                  {/* Shadow filters for dots */}
                  <filter id="dotShadow" x="-100%" y="-100%" width="300%" height="300%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
                  </filter>
                  <filter id="activeDotShadow" x="-100%" y="-100%" width="300%" height="300%">
                    <feDropShadow dx="3" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.6)" />
                  </filter>
                </defs>

                {/* Background grid */}
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#gridPattern)"
                  style={{ pointerEvents: 'none' }}
                />

                <XAxis
                  dataKey="distance"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(148 163 184)' }}
                  tickMargin={15}
                  minTickGap={40}
                  label={{ value: 'Distance Points', position: 'insideBottom', offset: -10, fill: 'rgb(148 163 184)' }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(148 163 184)' }}
                  tickFormatter={(value) => `${value.toFixed(0)} m`}
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tickMargin={15}
                />

                <ChartTooltip content={<CustomTooltip />} />

                {/* Area fill with gradient */}
                <Area
                  type="monotone"
                  dataKey="elevation"
                  stroke="transparent"
                  fill="url(#elevationAreaGradient)"
                  strokeWidth={0}
                  dot={false}
                />

                {/* Line stroke on top */}
                <Line
                  type="monotone"
                  dataKey="elevation"
                  stroke={chartConfig.elevation.color}
                  strokeWidth={2}
                  dot={nrOfPoints > 30 ? false : {
                    r: 4,
                    fill: chartConfig.elevation.color,
                    stroke: 'white',
                    strokeWidth: 2,
                    filter: 'url(#dotShadow)',
                  }}
                  activeDot={{
                    r: 6,
                    fill: chartConfig.elevation.color,
                    strokeWidth: 2,
                    stroke: 'white',
                    filter: 'url(#activeDotShadow)',
                  }}
                />
              </ComposedChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
