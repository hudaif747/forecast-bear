"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
    yKey: string | string[];
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
  streamStatus?: string | null;
};

const CHART_COLORS = ["#eb6911", "#b5866e", "#fff7f1", "#dfe0df"];

const COLORS = {
  high: "#22c55e",
  medium: "#eab308",
  low: "#ef4444",
};

// Regex patterns for formatting field names
const predictedTicketsRegex = /predictedTickets/g;
const predictedRevenueRegex = /predictedRevenue/g;
const occupancyRegex = /occupancy/g;
const opponentRegex = /opponent/g;
const dateRegex = /date/g;
const monthRegex = /month/g;
const ticketsRegex = /tickets/g;
const revenueRegex = /revenue/g;
const attendanceRegex = /attendance/g;
const conditionRegex = /condition/g;
const avgAttendanceRegex = /avgAttendance/g;
const forecastTicketsRegex = /forecastTickets/g;

function formatFieldName(name: string): string {
  return name
    .replace(predictedTicketsRegex, "Predicted Tickets")
    .replace(predictedRevenueRegex, "Predicted Revenue")
    .replace(occupancyRegex, "Occupancy")
    .replace(opponentRegex, "Opponent")
    .replace(dateRegex, "Date")
    .replace(monthRegex, "Month")
    .replace(ticketsRegex, "Tickets")
    .replace(revenueRegex, "Revenue")
    .replace(attendanceRegex, "Attendance")
    .replace(conditionRegex, "Condition")
    .replace(avgAttendanceRegex, "Avg. Attendance")
    .replace(forecastTicketsRegex, "Forecast Tickets");
}

export function ForecastBubble({
  title,
  summary,
  forecasts,
  charts = [],
  historicalInsights = [],
  streamStatus = null,
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
      yKey: string | string[];
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

    // Validate data source is not empty
    if (!dataSource || dataSource.length === 0) {
      return (
        <div className="flex h-80 min-h-80 items-center justify-center text-muted-foreground">
          No data available for this chart
        </div>
      );
    }

    // Handle multiple yKeys for comparison charts
    const yKeys = Array.isArray(chart.yKey) ? chart.yKey : [chart.yKey];

    const mappedData: Array<Record<string, unknown> | null> = dataSource.map(
      (item) => {
        const record = item as Record<string, unknown>;
        const xValue = record[chart.xKey];

        // Skip items where xKey is missing
        if (xValue === undefined || xValue === null) {
          return null;
        }

        // Build data object with xKey and all yKeys
        const dataPoint: Record<string, unknown> = {
          [chart.xKey]: xValue,
        };

        // Add all yKeys to the data point
        for (const yKey of yKeys) {
          const yValue = record[yKey];
          if (yValue !== undefined && yValue !== null) {
            dataPoint[yKey] = yValue;
          }
        }

        // Only include if at least one yKey has a value
        const hasAnyYValue = yKeys.some(
          (yKey) => dataPoint[yKey] !== undefined && dataPoint[yKey] !== null
        );

        return hasAnyYValue ? dataPoint : null;
      }
    );

    let data = mappedData.filter(
      (item): item is Record<string, unknown> => item !== null
    );

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

    // Guard against empty data after filtering
    if (data.length === 0) {
      return (
        <div className="flex h-80 min-h-80 items-center justify-center text-muted-foreground">
          No data matches the filter criteria
        </div>
      );
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
                {yKeys.map((_, i) => {
                  const barColor = CHART_COLORS[(index + i) % CHART_COLORS.length];
                  const barGradientId = `${gradientId}-${i}`;
                  return (
                    <linearGradient
                      id={barGradientId}
                      key={barGradientId}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={barColor} stopOpacity={1} />
                      <stop offset="100%" stopColor={barColor} stopOpacity={0.3} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid
                stroke="hsl(var(--muted-foreground) / 0.1)"
                vertical={false}
              />
              <XAxis
                dataKey={chart.xKey}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value, name) => {
                  const nameStr = String(name);
                  if (typeof value === "number") {
                    return [value.toLocaleString(), formatFieldName(nameStr)];
                  }
                  return [value, formatFieldName(nameStr)];
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              {yKeys.map((yKey, i) => {
                const barColor = CHART_COLORS[(index + i) % CHART_COLORS.length];
                const barGradientId = `${gradientId}-${i}`;
                return (
                  <Bar
                    dataKey={yKey}
                    fill={`url(#${barGradientId})`}
                    key={yKey}
                    name={formatFieldName(yKey)}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Render line charts with multiple lines for comparison
    if (chart.type === "line") {
      return (
        <div className="h-80 min-h-80 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                stroke="hsl(var(--muted-foreground) / 0.1)"
                vertical={false}
              />
              <XAxis
                dataKey={chart.xKey}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value, name) => {
                  const nameStr = String(name);
                  if (typeof value === "number") {
                    return [value.toLocaleString(), formatFieldName(nameStr)];
                  }
                  return [value, formatFieldName(nameStr)];
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              {yKeys.map((yKey, i) => {
                const lineColor = CHART_COLORS[(index + i) % CHART_COLORS.length];
                return (
                  <Line
                    dataKey={yKey}
                    key={yKey}
                    name={formatFieldName(yKey)}
                    stroke={lineColor}
                    strokeWidth={2}
                    type="monotone"
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Render area charts (can also have multiple areas for comparison)
    if (chart.type === "area") {
      return (
        <div className="h-80 min-h-80 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                {yKeys.map((_, i) => {
                  const areaColor = CHART_COLORS[(index + i) % CHART_COLORS.length];
                  const areaGradientId = `${gradientId}-${i}`;
                  return (
                    <linearGradient
                      id={areaGradientId}
                      key={areaGradientId}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={areaColor} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={areaColor} stopOpacity={0.2} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid
                stroke="hsl(var(--muted-foreground) / 0.1)"
                vertical={false}
              />
              <XAxis
                dataKey={chart.xKey}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value, name) => {
                  const nameStr = String(name);
                  if (typeof value === "number") {
                    return [value.toLocaleString(), formatFieldName(nameStr)];
                  }
                  return [value, formatFieldName(nameStr)];
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              {yKeys.map((yKey, i) => {
                const areaColor = CHART_COLORS[(index + i) % CHART_COLORS.length];
                const areaGradientId = `${gradientId}-${i}`;
                return (
                  <Area
                    dataKey={yKey}
                    fill={`url(#${areaGradientId})`}
                    key={yKey}
                    name={formatFieldName(yKey)}
                    stroke={areaColor}
                    type="monotone"
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  const isStreaming = streamStatus !== null && streamStatus.trim() !== "";

  return (
    <div className="my-4 rounded-lg border bg-card p-6">
      <h2 className="mb-4 font-bold text-xl">{title}</h2>
      {summary && <div className="mb-6 text-muted-foreground">{summary}</div>}

      {/* Streaming status banner */}
      {isStreaming && (
        <div className="mb-4 animate-pulse text-muted-foreground text-sm">
          {streamStatus}
        </div>
      )}

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
          {isStreaming ? (
            // Show skeleton charts while streaming
            defaultCharts.map((chart, index) => (
              <div key={chart.title}>
                <h3 className="mb-3 font-semibold">{chart.title}</h3>
                <div className="h-80 w-full animate-pulse rounded-lg bg-muted" />
              </div>
            ))
          ) : (
            // Render real charts when not streaming
            defaultCharts.map((chart, index) => (
              <div key={chart.title}>
                <h3 className="mb-3 font-semibold">{chart.title}</h3>
                {renderChart(chart, index)}
              </div>
            ))
          )}
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
