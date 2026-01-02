'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardToolbar } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Area, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import TimedStatsDTO from '@/app/types/TimedStatsDTO';
import { formatElapsedTime } from '@/utils/formatter';
import { GraphComponentProps } from './GraphComponent';


const chartConfig = {
  speed: {
    label: 'Speed',
    color: 'hsl(264, 82%, 70%)',
  },
  altitude: {
    label: 'Altitude',
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
    unit?: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    // Filter to unique dataKeys to avoid duplicates from Area + Line components
    const uniquePayload = payload.filter(
      (entry, index, self) => index === self.findIndex((item) => item.dataKey === entry.dataKey),
    );

    return (
      <div className="rounded-lg bg-zinc-800 border border-zinc-700 text-white p-3 shadow-lg">
        <div className="text-xs text-zinc-400 mb-2">{formatElapsedTime(Number(label) / 1000)}</div>
        {uniquePayload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-zinc-300">
              {entry.dataKey === 'speed' ? 'Speed' : 'Elevation'}:
            </span>
            <span className="font-semibold">{entry.value.toFixed(2)} {entry.dataKey === 'speed' ? 'km/h' : 'm'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Period configuration
// const PERIODS = {
//   day: { key: 'day', label: 'Day' },
//   week: { key: 'week', label: 'Week' },
//   month: { key: 'month', label: 'Month' },
// } as const;

// type PeriodKey = keyof typeof PERIODS;

export default function AreaChartElevationSpeed({timedStats} : GraphComponentProps) {
  // const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('month');

  // Get data for selected period
  // const currentData = financeData[selectedPeriod];

  // Calculate total values
  // const latestData = currentData[currentData.length - 1];
  // const totalValueLocked = latestData.totalDeposits + latestData.totalBorrowed;

  console.log("Chart data:", timedStats?.slice(0, 3)); // Debug: check data structure

  // Transform data to flatten altitude from position.altitude
  const chartData = timedStats?.map(stat => ({
    time: stat.time,
    speed: stat.speed,
    altitude: stat.position?.altitude
  })) || [];

  const nrOfPoints = chartData.length;

  return (
    <div className="flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full rounded-3xl lg:max-w-4xl bg-zinc-950 border-zinc-800 text-white">
        <CardHeader className="min-h-auto gap-5 p-8 border-0">
          <CardHeading className="flex flex-wrap items-end gap-5">
            <div className="min-w-40 space-y-0.5 me-2.5">
              <div className="text-3xl leading-none font-bold">Speed and Elevation per Time</div>
            </div>
            <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
              <div className="space-y-0.5 pe-10">
                <div
                  className="text-[11px] font-normal flex items-center gap-1.5"
                  style={{ color: chartConfig.speed.color }}
                >
                  <div
                    className="size-1.5 rounded-full "
                    style={{ backgroundColor: chartConfig.speed.color }}
                  />
                  Speed
                </div>
                {/* <div className="text-xl font-bold leading-none">
                  ${(latestData.totalDeposits * 1000).toLocaleString()}.43
                </div> */}
              </div>

              <div className="space-y-0.5">
                <div
                  className="text-[11px] font-normal flex items-center gap-1.5"
                  style={{ color: chartConfig.altitude.color }}
                >
                  <div
                    className="size-1.5 rounded-full "
                    style={{ backgroundColor: chartConfig.altitude.color }}
                  />
                  Elevation
                </div>
                {/* <div className="text-xl font-bold leading-none">
                  ${(latestData.totalBorrowed * 1000).toLocaleString()}.15
                </div> */}
              </div>
            </div>
          </CardHeading>
          {/* <CardToolbar>
            <ToggleGroup
              type="single"
              value={selectedPeriod}
              onValueChange={(value) => value && setSelectedPeriod(value as PeriodKey)}
              className="bg-zinc-800 p-1 rounded-full"
            >
              {Object.values(PERIODS).map((period) => (
                <ToggleGroupItem
                  key={period.key}
                  value={period.key}
                  className="px-4 py-2 text-sm data-[state=on]:bg-zinc-700 data-[state=on]:text-white text-zinc-400 hover:bg-zinc-700 hover:text-white rounded-full"
                >
                  {period.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardToolbar> */}
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

                  {/* Linear gradients for areas */}
                  <linearGradient id="speedAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartConfig.speed.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={chartConfig.speed.color} stopOpacity="0.02" />
                  </linearGradient>

                  <linearGradient id="altitudeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartConfig.altitude.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={chartConfig.altitude.color} stopOpacity="0.02" />
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
                  dataKey="time"
                  axisLine={false}
                  domain={["dataMin", "dataMax"]}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(148 163 184)' }}
                  tickMargin={15}
                  minTickGap={40}
                  tickFormatter={(value) => {
                    const totalSeconds = Math.floor(Number(value) / 1000);
                    if (totalSeconds < 3600) {
                      const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
                      const ss = String(totalSeconds % 60).padStart(2, "0");
                      return `${mm}:${ss}`;
                    } else {
                      const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
                      const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
                      return `${hh}:${mm}`;
                    }
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  yAxisId={"right"}
                  tick={{ fontSize: 12, fill: 'rgb(148 163 184)' }}
                  tickFormatter={(value) => `${value.toFixed(1)} m`}
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tickMargin={15}
                  orientation='right'
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  yAxisId={"left"}
                  tick={{ fontSize: 12, fill: 'rgb(148 163 184)' }}
                  tickFormatter={(value) => `${value.toFixed(1)} km/h`}
                  domain={['dataMin - 0.2', 'dataMax + 0.2']}
                  tickMargin={15}
                  orientation='left'
                />

                <ChartTooltip content={<CustomTooltip />} />

                {/* Area fills with gradients */}
                <Area
                  type="monotone"
                  yAxisId={"left"}
                  dataKey="speed"
                  stroke="transparent"
                  fill="url(#speedAreaGradient)"
                  strokeWidth={0}
                  dot={false}
                />

                <Area
                  type="monotone"
                  yAxisId={"right"}
                  dataKey="altitude"
                  stroke="transparent"
                  fill="url(#altitudeAreaGradient)"
                  strokeWidth={0}
                  dot={false}
                />

                {/* Line strokes on top */}
                <Line
                  type="monotone"
                  yAxisId={"left"}
                  dataKey="speed"
                  stroke={chartConfig.speed.color}
                  strokeWidth={2}
                  dot={nrOfPoints > 30 ? false : {
                    r: 4,
                    fill: chartConfig.speed.color,
                    stroke: 'white',
                    strokeWidth: 2,
                    filter: 'url(#dotShadow)',
                  }}
                  activeDot={{
                    r: 6,
                    fill: chartConfig.speed.color,
                    strokeWidth: 2,
                    stroke: 'white',
                    filter: 'url(#activeDotShadow)',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="altitude"
                  yAxisId={"right"}
                  stroke={chartConfig.altitude.color}
                  strokeWidth={2}
                  dot={ nrOfPoints > 30 ? false : {
                    r: 4,
                    fill: chartConfig.altitude.color,
                    stroke: 'white',
                    strokeWidth: 2,
                    filter: 'url(#dotShadow)',
                  }}
                  activeDot={{
                    r: 6,
                    fill: chartConfig.altitude.color,
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
