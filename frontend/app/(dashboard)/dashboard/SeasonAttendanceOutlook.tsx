"use client";

import {
  Calendar,
  Check,
  CircleDot,
  Clock,
  MapPin,
  Moon,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { TooltipProps } from "recharts";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAnalyticsStore, useDashboardStore } from "@/lib/store";
import type { SeasonalDataPoint } from "@/lib/store/types";
import { cn } from "@/lib/utils";
import featureImportanceData from "@/lib/store/feature_importance_sorted_v7.json";

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
    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
    isActive
      ? "border-primary bg-primary/10 text-primary shadow-sm"
      : "border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
  );

// Map technical feature names to user-friendly labels, icons, and descriptions
function getFeatureInfo(feature: string): {
  label: string;
  icon: typeof Users;
  description: string;
} {
  const featureMap: Record<
    string,
    { label: string; icon: typeof Users; description: string }
  > = {
    is_dec_holiday: {
      label: "December Holidays",
      icon: Calendar,
      description:
        "Games during December holidays (Christmas, New Year) see significantly higher attendance",
    },
    opponent_attendance: {
      label: "Opponent Strength",
      icon: Trophy,
      description:
        "Popular opponents with large fan bases draw more spectators to the arena",
    },
    month_sin: {
      label: "Season Period",
      icon: Moon,
      description:
        "Attendance varies throughout the season, peaking during winter months and playoffs",
    },
    game_progress: {
      label: "Season Progress",
      icon: TrendingUp,
      description:
        "How far into the season the game occurs affects fan engagement and attendance",
    },
    sunday_opp_adj: {
      label: "Sunday + Opponent",
      icon: Sun,
      description:
        "Combined effect of Sunday games and opponent quality on attendance numbers",
    },
    spieltag: {
      label: "Match Day",
      icon: CircleDot,
      description:
        "The specific match day number in the league schedule influences attendance patterns",
    },
    hour: {
      label: "Game Time",
      icon: Clock,
      description:
        "Start time of the game (afternoon vs. evening) impacts attendance significantly",
    },
    weekday_cos: {
      label: "Day of Week",
      icon: Calendar,
      description:
        "Weekend games typically attract more fans than weekday games",
    },
    sunday_boost: {
      label: "Sunday Effect",
      icon: Sun,
      description:
        "Sunday games generally see higher attendance due to weekend availability",
    },
    is_top_opponent: {
      label: "Top Opponent",
      icon: Target,
      description:
        "Facing league-leading teams or traditional rivals increases fan interest",
    },
    weekday_sin: {
      label: "Weekday Pattern",
      icon: Calendar,
      description:
        "Cyclical pattern of attendance based on day of the week throughout the season",
    },
    distance_log: {
      label: "Travel Distance",
      icon: MapPin,
      description:
        "Distance between team cities affects away fan attendance and local interest",
    },
    holiday_score: {
      label: "Holiday Period",
      icon: Zap,
      description:
        "Games near holidays and school breaks benefit from increased leisure time",
    },
    sunday_top: {
      label: "Sunday vs Top Team",
      icon: Trophy,
      description:
        "Premium matchups on Sundays against top teams create maximum attendance draw",
    },
  };

  return (
    featureMap[feature] || {
      label: feature,
      icon: Users,
      description: "Feature importance for attendance prediction",
    }
  );
}

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
  const [selectedMonths, setSelectedMonths] = useState<string[]>(() => [
    ...seasonMonths,
  ]);
  const [seasonOption, setSeasonOption] = useState<string>(
    () => seasonalSeries[0]?.season ?? "Current"
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
            seasonMonths.includes(point.month as (typeof seasonMonths)[number])
          ) {
            const existing = monthAggregates.get(point.month) ?? {
              total: 0,
              count: 0,
            };
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
      (series) => series.season === seasonOption
    );
    const points = baseline ? baseline.points : seasonalData;
    return points.filter((point: SeasonalDataPoint) =>
      seasonMonths.includes(point.month as (typeof seasonMonths)[number])
    );
  }, [seasonOption, seasonalData, seasonalSeries]);

  const performanceData = useMemo(() => {
    const historicalMap = new Map(
      historicalSeason.map((item) => [item.month, item])
    );
    const forecastMap = new Map(
      forecastSeasonalData.map((item) => [item.month, item])
    );

    return seasonMonths.map((month) => ({
      month,
      historical: historicalMap.get(month)?.tickets ?? null,
      forecast: forecastMap.get(month)?.forecastTickets ?? null,
    }));
  }, [forecastSeasonalData, historicalSeason]);

  const filteredPerformanceData = useMemo(
    () => performanceData.filter((item) => selectedMonths.includes(item.month)),
    [performanceData, selectedMonths]
  );

  const weekdayInsightData = useMemo<WeekdayPoint[]>(() => {
    const aggregates = new Map<
      (typeof weekdayOrder)[number],
      { totalTickets: number; games: number }
    >(weekdayOrder.map((weekday) => [weekday, { totalTickets: 0, games: 0 }]));

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
        <p className="text-muted-foreground text-sm">
          Filter the September–March season and compare match-day performance.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Season Selector */}
        <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
          <div>
            <p className="font-medium text-foreground text-sm">
              Compare Historical Season
            </p>
            <p className="text-muted-foreground text-xs">
              Select a past season or view aggregated data across all seasons
            </p>
          </div>
          <Select onValueChange={setSeasonOption} value={seasonOption}>
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
              <p className="font-medium text-foreground text-sm">
                Season months
              </p>
              <p className="text-muted-foreground text-xs">
                Tap to focus on specific stretches of the schedule
              </p>
            </div>
            <Badge className="ml-auto" variant="outline">
              {selectedMonths.length}/{seasonMonths.length} selected
            </Badge>
            <Button
              className="text-muted-foreground"
              onClick={selectAllMonths}
              size="sm"
              variant="ghost"
            >
              Select all
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {seasonMonths.map((month) => {
              const isActive = selectedMonths.includes(month);
              return (
                <button
                  aria-pressed={isActive}
                  className={monthButtonClasses(isActive)}
                  key={month}
                  onClick={() => toggleMonth(month)}
                  type="button"
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
                    x2="0"
                    y1="0"
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
                    x2="0"
                    y1="0"
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
                  fill="url(#historicalGradient)"
                  name={
                    seasonOption === "all"
                      ? "Average Historical Tickets (All Seasons)"
                      : `Historical Tickets (${seasonOption})`
                  }
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  type="monotone"
                />
                <Area
                  dataKey="forecast"
                  fill="url(#forecastGradient)"
                  name="Forecast Tickets"
                  stroke="hsl(var(--chart-2))"
                  strokeDasharray="4 4"
                  strokeWidth={2.5}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">
                  Feature Importance
                </p>
                <p className="text-muted-foreground text-xs">
                  Key factors driving attendance predictions • Hover for details
                </p>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex cursor-help flex-col gap-1">
                    <Badge
                      className="bg-success/10 text-success border-success"
                      variant="outline"
                    >
                      {featureImportanceData.mape}% MAPE
                    </Badge>
                    <span className="text-right text-muted-foreground text-xs">
                      Model Accuracy
                    </span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" side="left">
                  <div className="space-y-3">
                    <div>
                      <h4 className="mb-1 font-semibold text-sm">
                        Model Performance Metrics
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {featureImportanceData.model}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          MAPE (Error Rate)
                        </span>
                        <span className="font-semibold text-success text-sm">
                          {featureImportanceData.mape}%
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        On average, predictions are within {featureImportanceData.mape}% of actual attendance
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          MAE (Avg Error)
                        </span>
                        <span className="font-semibold text-sm">
                          ±{Math.round(featureImportanceData.mae)} tickets
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Average prediction error of {Math.round(featureImportanceData.mae)} tickets per game
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="mt-4 space-y-3">
              {Object.entries(featureImportanceData.feature_importance)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 6)
                .map(([feature, importance]) => {
                  const featureInfo = getFeatureInfo(feature);
                  const importancePercent = Math.round(
                    (importance as number) * 100
                  );
                  return (
                    <HoverCard key={feature}>
                      <HoverCardTrigger asChild>
                        <div className="space-y-2 cursor-help">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <featureInfo.icon className="h-4 w-4 text-primary" />
                              <span className="font-medium text-foreground text-sm">
                                {featureInfo.label}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-sm">
                              {importancePercent}%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary transition-all"
                              style={{ width: `${importancePercent}%` }}
                            />
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80" side="left">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <featureInfo.icon className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold text-sm">
                              {featureInfo.label}
                            </h4>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {featureInfo.description}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
