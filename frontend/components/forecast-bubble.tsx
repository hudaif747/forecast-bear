"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalyticsStore, useDashboardStore } from "@/lib/store";

type ForecastGame = {
  gameId: number;
  date: string;
  opponent: string;
  predictedTickets: number;
  predictedRevenue: number;
  occupancy: number;
  confidence: "high" | "medium" | "low";
  explanations?: {
    opponent?: string;
    revenue?: string;
    weather?: string;
    weekday?: string;
    overall?: string;
  };
};

type ChartDataset =
  | "forecast"
  | "upcoming"
  | "seasonal"
  | "seasonalSeries"
  | "forecastSeasonal"
  | "opponent"
  | "weather";

type ForecastBubbleProps = {
  title: string;
  summary: string;
  forecasts: ForecastGame[];
  charts?: Array<{
    type: "bar" | "line" | "area";
    xKey: string;
    yKey: string;
    title: string;
    dataset?: ChartDataset;
    season?: string;
    filter?: {
      field: string;
      operator: "<" | ">" | "<=" | ">=" | "==" | "!=";
      value: number;
    };
  }>;
  historicalInsights?: Array<{
    title: string;
    insight: string;
    source:
      | "seasonal"
      | "seasonalSeries"
      | "opponent"
      | "historicalGames"
      | "weather";
  }>;
};

const CHART_COLORS = ["#eb6911", "#b5866e", "#fff7f1", "#dfe0df"];

const COLORS = {
  high: "#22c55e",
  medium: "#eab308",
  low: "#ef4444",
};

export function ForecastBubble({
  title,
  summary,
  forecasts,
  charts = [],
  historicalInsights = [],
}: ForecastBubbleProps) {
  const { upcomingGames } = useDashboardStore();
  const {
    seasonalSeries,
    seasonalData,
    forecastSeasonalData,
    opponentData,
    weatherData,
  } = useAnalyticsStore();

  // Merge forecast data with upcoming games data for charting
  const forecastData = useMemo(() => {
    return forecasts.map((forecast) => {
      const game = upcomingGames.find((g) => g.id === forecast.gameId);
      return {
        ...forecast,
        date: new Date(forecast.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        weekday: game?.weekday || "",
      };
    });
  }, [forecasts, upcomingGames]);

  // Default charts if none provided
  const defaultCharts =
    charts.length === 0 && forecasts.length > 0
      ? [
          {
            type: "bar" as const,
            xKey: "opponent",
            yKey: "predictedTickets",
            title: "Predicted Attendance by Opponent",
          },
          {
            type: "area" as const,
            xKey: "date",
            yKey: "predictedRevenue",
            title: "Revenue Forecast Trend",
          },
          {
            type: "bar" as const,
            xKey: "opponent",
            yKey: "occupancy",
            title: "Occupancy Rate by Game",
          },
        ]
      : charts;

  const getDataset = (
    datasetName: ChartDataset | undefined,
    seasonLabel?: string
  ): unknown[] => {
    const targetDataset = datasetName ?? "forecast";

    switch (targetDataset) {
      case "upcoming":
        return upcomingGames;
      case "seasonal":
        return seasonalData;
      case "seasonalSeries": {
        const seriesEntry =
          seasonalSeries.find(
            (seasonEntry) => seasonEntry.season === seasonLabel
          ) ?? seasonalSeries[0];
        return seriesEntry ? seriesEntry.points : [];
      }
      case "forecastSeasonal":
        return forecastSeasonalData;
      case "opponent":
        return opponentData;
      case "weather":
        return weatherData;
      case "forecast":
        return forecastData;
      default:
        return forecastData;
    }
  };

  const renderChart = (
    chart: {
      type: "bar" | "line" | "area";
      xKey: string;
      yKey: string;
      title: string;
      dataset?:
        | "forecast"
        | "upcoming"
        | "seasonal"
        | "seasonalSeries"
        | "forecastSeasonal"
        | "opponent"
        | "weather";
      season?: string;
      filter?: {
        field: string;
        operator: "<" | ">" | "<=" | ">=" | "==" | "!=";
        value: number;
      };
    },
    index: number
  ) => {
    const dataSource = getDataset(chart.dataset, chart.season);

    let data = dataSource.map((item) => {
      const record = item as Record<string, unknown>;
      return {
        [chart.xKey]: record[chart.xKey],
        [chart.yKey]: record[chart.yKey],
      };
    });

    // Apply filter if provided
    if (chart.filter) {
      const filter = chart.filter;
      data = data.filter((item) => {
        const fieldValue = item[filter.field as keyof typeof item];
        if (typeof fieldValue !== "number") {
          return false;
        }
        switch (filter.operator) {
          case "<":
            return fieldValue < filter.value;
          case ">":
            return fieldValue > filter.value;
          case "<=":
            return fieldValue <= filter.value;
          case ">=":
            return fieldValue >= filter.value;
          case "==":
            return fieldValue === filter.value;
          case "!=":
            return fieldValue !== filter.value;
          default:
            return true;
        }
      });
    }

    const color = CHART_COLORS[index % CHART_COLORS.length];
    const gradientId = `gradient-${index}`;

    if (chart.type === "bar") {
      return (
        <div className="h-80 min-h-80 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="hsl(var(--muted-foreground) / 0.1)"
                vertical={false}
              />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Bar dataKey={chart.yKey} fill={`url(#${gradientId})`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Treat "line" as "area" - always use area charts
    if (chart.type === "line" || chart.type === "area") {
      return (
        <div className="h-80 min-h-80 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="hsl(var(--muted-foreground) / 0.1)"
                vertical={false}
              />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Area
                dataKey={chart.yKey}
                fill={`url(#${gradientId})`}
                stroke={color}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="h-80 min-h-80 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="hsl(var(--muted-foreground) / 0.1)"
              vertical={false}
            />
            <XAxis dataKey={chart.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              dataKey={chart.yKey}
              fill={`url(#${gradientId})`}
              stroke={color}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="my-4 rounded-lg border bg-card p-6">
      <h2 className="mb-4 font-bold text-xl">{title}</h2>
      {summary && <div className="mb-6 text-muted-foreground">{summary}</div>}

      {historicalInsights.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="font-semibold">Historical context</h3>
          <ul className="space-y-1 text-muted-foreground text-sm">
            {historicalInsights.map((insight) => (
              <li key={`${insight.title}-${insight.source}`}>
                <strong className="text-foreground">{insight.title}:</strong>{" "}
                {insight.insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {defaultCharts.length > 0 && (
        <div className="mb-6 space-y-6">
          {defaultCharts.map((chart, index) => (
            <div key={chart.title}>
              <h3 className="mb-3 font-semibold">{chart.title}</h3>
              {renderChart(chart, index)}
            </div>
          ))}
        </div>
      )}

      {forecasts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Game-by-Game Forecast</h3>
          {forecasts.map((forecast) => (
            <div
              className="rounded-lg border bg-muted/50 p-4"
              key={forecast.gameId}
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{forecast.opponent}</div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(forecast.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div
                  className="rounded-full px-3 py-1 font-medium text-xs"
                  style={{
                    backgroundColor: `${COLORS[forecast.confidence]}20`,
                    color: COLORS[forecast.confidence],
                  }}
                >
                  {forecast.confidence} confidence
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Predicted Tickets</div>
                  <div className="font-semibold">
                    {forecast.predictedTickets.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Predicted Revenue</div>
                  <div className="font-semibold">
                    €{forecast.predictedRevenue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Occupancy</div>
                  <div className="font-semibold">{forecast.occupancy}%</div>
                </div>
              </div>
              {forecast.explanations?.overall && (
                <div className="mt-4 border-t pt-4">
                  <div className="text-muted-foreground text-sm">
                    <strong>Explanation:</strong>{" "}
                    {forecast.explanations.overall}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
