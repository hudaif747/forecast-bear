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
import { toast } from "sonner";
import { Artifact } from "@/components/create-artifact";
import { CopyIcon } from "@/components/icons";

type ForecastData = {
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

type ForecastConfig = {
  forecasts: ForecastData[];
  summary: string;
  charts: Array<{
    type: "bar" | "line" | "area";
    dataSource: "forecast";
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

export const forecastArtifact = new Artifact<"forecast", never>({
  kind: "forecast",
  description:
    "Useful for creating forecasts with predictions, explanations, and visualizations based on store data analysis.",
  initialize: () => {
    // No metadata needed
  },
  toolbar: [],
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "data-forecastDelta") {
      setArtifact((draftArtifact) => {
        try {
          const streamData = streamPart.data as string;
          let newContent = streamData;
          try {
            JSON.parse(newContent);
          } catch {
            newContent = draftArtifact.content + streamData;
          }

          return {
            ...draftArtifact,
            content: newContent,
            isVisible:
              draftArtifact.status === "streaming" &&
              newContent.length > 100 &&
              newContent.length < 300
                ? true
                : draftArtifact.isVisible,
            status: "streaming",
          };
        } catch {
          return draftArtifact;
        }
      });
    }
  },
  content: ({ content, isLoading }) => {
    const forecastData = useMemo(() => {
      if (!content) {
        return null;
      }

      try {
        const parsedConfig: ForecastConfig = JSON.parse(content);
        // Ensure required arrays exist with defaults
        const forecasts = parsedConfig.forecasts || [];
        const charts = parsedConfig.charts || [];

        // If no charts provided, generate default charts for executive insights
        const defaultCharts =
          charts.length === 0 && forecasts.length > 0
            ? [
                {
                  type: "bar" as const,
                  dataSource: "forecast" as const,
                  xKey: "opponent",
                  yKey: "predictedTickets",
                  title: "Predicted Attendance by Opponent",
                },
                {
                  type: "line" as const,
                  dataSource: "forecast" as const,
                  xKey: "date",
                  yKey: "predictedRevenue",
                  title: "Revenue Forecast Trend",
                },
                {
                  type: "bar" as const,
                  dataSource: "forecast" as const,
                  xKey: "opponent",
                  yKey: "occupancy",
                  title: "Occupancy Rate by Game",
                },
              ]
            : charts;

        return {
          forecasts,
          summary: parsedConfig.summary || "",
          charts: defaultCharts,
        };
      } catch {
        return null;
      }
    }, [content]);

    if (isLoading || !forecastData) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="text-muted-foreground">Loading forecast...</div>
        </div>
      );
    }

    const renderChart = (
      chartConfig: ForecastConfig["charts"][number],
      data: ForecastData[]
    ) => {
      const chartData = data.map((f) => ({
        opponent: f.opponent,
        date: f.date,
        predictedTickets: f.predictedTickets,
        predictedRevenue: f.predictedRevenue,
        occupancy: f.occupancy,
        confidence: f.confidence,
      }));

      switch (chartConfig.type) {
        case "bar": {
          return (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartConfig.yKey} fill="#8884d8" />
            </BarChart>
          );
        }

        case "line": {
          return (
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                dataKey={chartConfig.yKey}
                stroke="#8884d8"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          );
        }

        case "area": {
          return (
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                dataKey={chartConfig.yKey}
                fill="#8884d8"
                fillOpacity={0.6}
                stroke="#8884d8"
                type="monotone"
              />
            </AreaChart>
          );
        }

        default:
          return (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartConfig.yKey} fill="#8884d8" />
            </BarChart>
          );
      }
    };

    return (
      <div className="flex h-full flex-col overflow-y-auto p-8">
        <h2 className="mb-6 font-semibold text-2xl">Forecast Analysis</h2>

        {forecastData.summary && (
          <div className="mb-6 rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">Summary</h3>
            <p className="text-sm">{forecastData.summary}</p>
          </div>
        )}

        {forecastData.charts && forecastData.charts.length > 0 && (
          <div className="mb-8 space-y-8">
            <h3 className="mb-4 font-semibold text-lg">
              Executive Insights - Visual Analytics
            </h3>
            {forecastData.charts.map((chartConfig) => (
              <div
                className="h-80 rounded-lg border bg-card p-4 shadow-sm"
                key={`chart-${chartConfig.title}-${chartConfig.yKey}`}
              >
                <h3 className="mb-4 font-semibold">{chartConfig.title}</h3>
                <ResponsiveContainer height="100%" width="100%">
                  {renderChart(chartConfig, forecastData.forecasts)}
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Game Predictions & Explanations</h3>
          {forecastData.forecasts && forecastData.forecasts.length > 0 ? (
            forecastData.forecasts.map((forecast) => (
              <div className="rounded-lg border p-4" key={forecast.gameId}>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">
                      {forecast.opponent} - {forecast.date}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Predicted: {forecast.predictedTickets.toLocaleString()}{" "}
                      tickets • {forecast.occupancy}% occupancy • €
                      {forecast.predictedRevenue.toLocaleString()} revenue
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 font-medium text-xs"
                    style={{
                      backgroundColor: `${COLORS[forecast.confidence]}20`,
                      color: COLORS[forecast.confidence],
                    }}
                  >
                    {forecast.confidence.toUpperCase()} confidence
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Overall: </span>
                    <span>{forecast.explanations.overall}</span>
                  </div>
                  <div>
                    <span className="font-medium">Opponent Factor: </span>
                    <span>{forecast.explanations.opponent}</span>
                  </div>
                  <div>
                    <span className="font-medium">Revenue Trend: </span>
                    <span>{forecast.explanations.revenue}</span>
                  </div>
                  <div>
                    <span className="font-medium">Weekday Effect: </span>
                    <span>{forecast.explanations.weekday}</span>
                  </div>
                  {forecast.explanations.weather && (
                    <div>
                      <span className="font-medium">Weather Impact: </span>
                      <span>{forecast.explanations.weather}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">
              No forecast data available yet.
            </div>
          )}
        </div>
      </div>
    );
  },
  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: "Copy forecast data to clipboard",
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success("Forecast data copied to clipboard!");
      },
    },
  ],
});
