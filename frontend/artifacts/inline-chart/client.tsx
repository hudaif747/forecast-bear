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
import { Response } from "@/components/elements/response";
import { CopyIcon } from "@/components/icons";
import { useAnalyticsStore, useDashboardStore } from "@/lib/store";

type ChartConfig = {
  type: "bar" | "line" | "area";
  dataSource: "seasonal" | "opponent" | "weather" | "upcomingGames";
  xKey: string;
  yKey: string;
  title: string;
};

type InlineChartContent = {
  text: string;
  charts: ChartConfig[];
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

export const inlineChartArtifact = new Artifact<"inline-chart", never>({
  kind: "inline-chart",
  description:
    "Useful for creating text responses with inline charts embedded within the text. Charts are displayed inline with the text content, not in a separate window.",
  initialize: () => {
    // No metadata needed
  },
  toolbar: [],
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "data-inlineChartDelta") {
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
    const { seasonalData, opponentData, weatherData } = useAnalyticsStore();
    const { upcomingGames } = useDashboardStore();

    const parsedContent = useMemo(() => {
      if (!content) {
        return null;
      }

      try {
        const parsed: InlineChartContent = JSON.parse(content);
        return {
          text: parsed.text || "",
          charts: parsed.charts || [],
        };
      } catch {
        // If parsing fails, treat as plain text with no charts
        return {
          text: content,
          charts: [],
        };
      }
    }, [content]);

    if (isLoading || !parsedContent) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      );
    }

    const getChartData = (config: ChartConfig) => {
      if (config.dataSource === "seasonal") {
        return seasonalData;
      }
      if (config.dataSource === "opponent") {
        return opponentData;
      }
      if (config.dataSource === "weather") {
        return weatherData;
      }
      if (config.dataSource === "upcomingGames") {
        return upcomingGames.map((game) => ({
          opponent: game.opponent,
          date: new Date(game.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          predictedTickets: game.predictedTickets,
          predictedRevenue: game.predictedRevenue,
          occupancy: game.occupancy,
          confidence: game.confidence,
        }));
      }
      return [];
    };

    const renderChart = (config: ChartConfig) => {
      const data = getChartData(config);
      const chartData = data.map((item: unknown) => {
        const d = item as Record<string, unknown>;
        return {
          [config.xKey]: d[config.xKey],
          [config.yKey]: d[config.yKey],
        };
      });

      if (config.type === "bar") {
        return (
          <div className="my-6 w-full">
            <h3 className="mb-3 font-semibold">{config.title}</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer height="100%" width="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={config.xKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={config.yKey} fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      if (config.type === "line") {
        return (
          <div className="my-6 w-full">
            <h3 className="mb-3 font-semibold">{config.title}</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={config.xKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    dataKey={config.yKey}
                    stroke={COLORS[0]}
                    strokeWidth={2}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      return (
        <div className="my-6 w-full">
          <h3 className="mb-3 font-semibold">{config.title}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={config.xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  dataKey={config.yKey}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                  stroke={COLORS[0]}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    };

    // Split text by chart placeholders and render charts inline
    const renderContent = () => {
      if (parsedContent.charts.length === 0) {
        return <Response>{parsedContent.text}</Response>;
      }

      // For now, render text first, then charts below
      // In the future, we could support chart placeholders in text like [CHART:0]
      return (
        <div className="flex flex-col">
          <Response>{parsedContent.text}</Response>
          {parsedContent.charts.map((chart) => (
            <div key={`chart-${chart.title}-${chart.yKey}`}>
              {renderChart(chart)}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="flex flex-row px-4 py-8 md:p-20">
        <div className="w-full">{renderContent()}</div>
      </div>
    );
  },
  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: "Copy content to clipboard",
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success("Content copied to clipboard!");
      },
    },
  ],
});
