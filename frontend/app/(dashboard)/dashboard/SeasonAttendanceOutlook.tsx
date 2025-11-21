"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAnalyticsStore, useDashboardStore } from "@/lib/store";
import type { SeasonalDataPoint } from "@/lib/store/types";

const seasonMonths = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] as const;

const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type WeekdayPoint = {
  weekday: (typeof weekdayOrder)[number];
  avgTickets: number;
  games: number;
};

const formatMonth = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", { month: "short" });

const monthButtonClasses = (isActive: boolean) =>
  cn(
    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
    isActive
      ? "border-primary bg-primary/10 text-primary shadow-sm"
      : "border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground",
  );

function WeekdayTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }
  const data = payload[0].payload as WeekdayPoint;

  return (
    <div className="rounded-md border border-border bg-card p-3 text-xs shadow-lg">
      <p className="font-semibold text-foreground text-sm">{data.weekday}</p>
      <div className="mt-2 space-y-1 text-foreground">
        <div className="flex items-center justify-between">
          <span>Avg. tickets</span>
          <span>{data.avgTickets.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Games</span>
          <span>{data.games}</span>
        </div>
      </div>
    </div>
  );
}

export default function SeasonAttendanceOutlook() {
  const { upcomingGames } = useDashboardStore();
  const { seasonalSeries, seasonalData, forecastSeasonalData } =
    useAnalyticsStore();
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    () => [...seasonMonths],
  );
  const [seasonOption, setSeasonOption] = useState<string>(
    () => (seasonalSeries[0]?.season ?? "Current"),
  );

  const historicalSeason = useMemo(() => {
    if (seasonOption === "all") {
      // Aggregate all seasons by averaging tickets per month
      const monthAggregates = new Map<
        string,
        { total: number; count: number }
      >();

      for (const series of seasonalSeries) {
        for (const point of series.points) {
          if (
            seasonMonths.includes(
              point.month as (typeof seasonMonths)[number],
            )
          ) {
            const existing =
              monthAggregates.get(point.month) ?? { total: 0, count: 0 };
            monthAggregates.set(point.month, {
              total: existing.total + point.tickets,
              count: existing.count + 1,
            });
          }
        }
      }

      return Array.from(monthAggregates.entries()).map(([month, agg]) => ({
        month,
        tickets: Math.round(agg.total / agg.count),
        revenue: 0, // Revenue aggregation not needed for this view
      }));
    }

    const baseline = seasonalSeries.find(
      (series) => series.season === seasonOption,
    );
    const points = baseline ? baseline.points : seasonalData;
    return points.filter((point: SeasonalDataPoint) =>
      seasonMonths.includes(point.month as (typeof seasonMonths)[number]),
    );
  }, [seasonOption, seasonalData, seasonalSeries]);

  const performanceData = useMemo(() => {
    const historicalMap = new Map(
      historicalSeason.map((item) => [item.month, item]),
    );
    const forecastMap = new Map(
      forecastSeasonalData.map((item) => [item.month, item]),
    );

    return seasonMonths.map((month) => ({
      month,
      historical: historicalMap.get(month)?.tickets ?? null,
      forecast: forecastMap.get(month)?.forecastTickets ?? null,
    }));
  }, [forecastSeasonalData, historicalSeason]);

  const filteredPerformanceData = useMemo(
    () =>
      performanceData.filter((item) =>
        selectedMonths.includes(item.month),
      ),
    [performanceData, selectedMonths],
  );

  const weekdayInsightData = useMemo<WeekdayPoint[]>(() => {
    const aggregates = new Map<
      (typeof weekdayOrder)[number],
      { totalTickets: number; games: number }
    >(
      weekdayOrder.map((weekday) => [weekday, { totalTickets: 0, games: 0 }]),
    );

    for (const game of upcomingGames) {
      const monthLabel = formatMonth(game.date);
      if (!selectedMonths.includes(monthLabel)) {
        continue;
      }
      const weekday = game.weekday as (typeof weekdayOrder)[number];
      const entry = aggregates.get(weekday);
      if (!entry) {
        continue;
      }
      entry.totalTickets += game.predictedTickets;
      entry.games += 1;
    }

    return weekdayOrder
      .map((weekday) => {
        const entry = aggregates.get(weekday);
        if (!entry || entry.games === 0) {
          return null;
        }
        return {
          weekday,
          avgTickets: Math.round(entry.totalTickets / entry.games),
          games: entry.games,
        };
      })
      .filter((item): item is WeekdayPoint => Boolean(item));
  }, [selectedMonths, upcomingGames]);

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((item) => item !== month);
      }
      const next = [...prev, month];
      return seasonMonths.filter((item) => next.includes(item));
    });
  };

  const selectAllMonths = () => setSelectedMonths([...seasonMonths]);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">
          Season Attendance Outlook
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Filter the September–March season and compare match-day performance.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Season Selector */}
        <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Compare Historical Season
            </p>
            <p className="text-xs text-muted-foreground">
              Select a past season or view aggregated data across all seasons
            </p>
          </div>
          <Select value={seasonOption} onValueChange={setSeasonOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons (Average)</SelectItem>
              {seasonalSeries.map((series) => (
                <SelectItem key={series.season} value={series.season}>
                  {series.season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Selector */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Season months
              </p>
              <p className="text-xs text-muted-foreground">
                Tap to focus on specific stretches of the schedule
              </p>
            </div>
            <Badge className="ml-auto" variant="outline">
              {selectedMonths.length}/{seasonMonths.length} selected
            </Badge>
            <Button
              onClick={selectAllMonths}
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
            >
              Select all
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {seasonMonths.map((month) => {
              const isActive = selectedMonths.includes(month);
              return (
                <button
                  key={month}
                  type="button"
                  aria-pressed={isActive}
                  className={monthButtonClasses(isActive)}
                  onClick={() => toggleMonth(month)}
                >
                  {isActive && <Check className="h-3.5 w-3.5" />}
                  {month}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="h-[320px]">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart
                data={filteredPerformanceData}
                margin={{ left: 4, right: 12 }}
              >
                <defs>
                  <linearGradient
                    id="historicalGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="forecastGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  dataKey="historical"
                  name={
                    seasonOption === "all"
                      ? "Average Historical Tickets (All Seasons)"
                      : `Historical Tickets (${seasonOption})`
                  }
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#historicalGradient)"
                  type="monotone"
                />
                <Area
                  dataKey="forecast"
                  name="Forecast Tickets"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  fill="url(#forecastGradient)"
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Match Day Insights
              </p>
              <p className="text-xs text-muted-foreground">
                Avg. predicted tickets by weekday
              </p>
            </div>
            {weekdayInsightData.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                No games scheduled for the selected months.
              </p>
            ) : (
              <div className="mt-4 h-[220px]">
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart
                    data={weekdayInsightData}
                    layout="vertical"
                    margin={{ left: 0, right: 8 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="hsl(var(--border))"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      stroke="hsl(var(--muted-foreground))"
                      type="number"
                    />
                    <YAxis
                      dataKey="weekday"
                      stroke="hsl(var(--muted-foreground))"
                      type="category"
                      width={80}
                    />
                    <Tooltip content={<WeekdayTooltip />} />
                    <Bar
                      dataKey="avgTickets"
                      fill="hsl(var(--chart-2))"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

