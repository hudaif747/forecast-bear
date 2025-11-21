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
import { useDashboardStore } from "@/lib/store";

type ForecastGame = {
  gameId: number;
  date: string;
  opponent: string;
  predictedTickets: number;
  predictedRevenue: number;
  occupancy: number;
  confidence: "high" | "medium" | "low";
  explanations: {
    opponent: string;
    revenue: string;
    weather?: string;
    weekday: string;
    overall: string;
  };
};

type ForecastBubbleProps = {
  title: string;
  summary: string;
  forecasts: ForecastGame[];
  charts?: Array<{
    type: "bar" | "line" | "area";
    xKey: string;
    yKey: string;
    title: string;
  }>;
};

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
}: ForecastBubbleProps) {
  const { upcomingGames } = useDashboardStore();

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
            type: "line" as const,
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

  const renderChart = (chart: {
    type: "bar" | "line" | "area";
    xKey: string;
    yKey: string;
    title: string;
  }) => {
    const data = forecastData.map((f) => ({
      [chart.xKey]: f[chart.xKey as keyof typeof f],
      [chart.yKey]: f[chart.yKey as keyof typeof f],
    }));

    if (chart.type === "bar") {
      return (
        <div className="h-64 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chart.yKey} fill={COLORS.high} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (chart.type === "line") {
      return (
        <div className="h-64 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chart.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                dataKey={chart.yKey}
                stroke={COLORS.high}
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="h-64 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              dataKey={chart.yKey}
              fill={COLORS.high}
              fillOpacity={0.6}
              stroke={COLORS.high}
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

      {defaultCharts.length > 0 && (
        <div className="mb-6 space-y-6">
          {defaultCharts.map((chart, index) => (
            <div key={`chart-${index}`}>
              <h3 className="mb-3 font-semibold">{chart.title}</h3>
              {renderChart(chart)}
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
              {forecast.explanations && (
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
