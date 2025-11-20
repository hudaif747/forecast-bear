"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Artifact } from "@/components/create-artifact";
import { CopyIcon } from "@/components/icons";
import { useAnalyticsStore, useDashboardStore } from "@/lib/store";

type ChartConfig = {
  type: "bar" | "line" | "area" | "pie";
  dataSource: "seasonal" | "opponent" | "weather" | "upcomingGames";
  xKey: string;
  yKey: string;
  y2Key?: string;
  title: string;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
];

export const chartArtifact = new Artifact<"chart", never>({
  kind: "chart",
  description:
    "Useful for creating visual charts and graphs based on analytics data from the store.",
  initialize: () => {
    // No metadata needed
  },
  toolbar: [],
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "data-chartDelta") {
      setArtifact((draftArtifact) => {
        try {
          // Try to parse as complete JSON, if not, append
          const streamData = streamPart.data as string;
          let newContent = streamData;
          try {
            JSON.parse(newContent);
            // Valid JSON, use it directly
          } catch {
            // Not valid JSON yet, might be streaming
            newContent = draftArtifact.content + streamData;
          }

          return {
            ...draftArtifact,
            content: newContent,
            isVisible:
              draftArtifact.status === "streaming" &&
              newContent.length > 50 &&
              newContent.length < 200
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

    const chartData = useMemo(() => {
      if (!content) {
        return null;
      }

      try {
        const parsedConfig: ChartConfig = JSON.parse(content);

        let chartDataArray: unknown[] = [];
        if (parsedConfig.dataSource === "seasonal") {
          chartDataArray = seasonalData;
        } else if (parsedConfig.dataSource === "opponent") {
          chartDataArray = opponentData;
        } else if (parsedConfig.dataSource === "weather") {
          chartDataArray = weatherData;
        } else if (parsedConfig.dataSource === "upcomingGames") {
          // Transform upcoming games data to chart format
          chartDataArray = upcomingGames.map((game) => ({
            opponent: game.opponent,
            date: new Date(game.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            predictedTickets: game.predictedTickets,
            predictedRevenue: game.predictedRevenue,
            occupancy: game.occupancy,
            confidence: game.confidence,
            weekday: game.weekday,
          }));
        } else {
          return null;
        }

        return { config: parsedConfig, data: chartDataArray };
      } catch {
        return null;
      }
    }, [content, seasonalData, opponentData, weatherData, upcomingGames]);

    if (isLoading || !chartData || !chartData.config) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <div className="text-muted-foreground">Loading chart...</div>
        </div>
      );
    }

    const { config, data } = chartData;

    const renderChart = () => {
      switch (config.type) {
        case "bar": {
          return (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xKey} />
              <YAxis />
              {config.y2Key && <YAxis orientation="right" yAxisId="right" />}
              <Tooltip />
              <Legend />
              <Bar dataKey={config.yKey} fill={COLORS[0]} />
              {config.y2Key && (
                <Bar dataKey={config.y2Key} fill={COLORS[1]} yAxisId="right" />
              )}
            </BarChart>
          );
        }

        case "line": {
          return (
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xKey} />
              <YAxis />
              {config.y2Key && <YAxis orientation="right" yAxisId="right" />}
              <Tooltip />
              <Legend />
              <Line
                dataKey={config.yKey}
                stroke={COLORS[0]}
                strokeWidth={2}
                type="monotone"
              />
              {config.y2Key && (
                <Line
                  dataKey={config.y2Key}
                  stroke={COLORS[1]}
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="right"
                />
              )}
            </LineChart>
          );
        }

        case "area": {
          return (
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xKey} />
              <YAxis />
              {config.y2Key && <YAxis orientation="right" yAxisId="right" />}
              <Tooltip />
              <Legend />
              <Area
                dataKey={config.yKey}
                fill={COLORS[0]}
                fillOpacity={0.6}
                stroke={COLORS[0]}
                type="monotone"
              />
              {config.y2Key && (
                <Area
                  dataKey={config.y2Key}
                  fill={COLORS[1]}
                  fillOpacity={0.6}
                  stroke={COLORS[1]}
                  type="monotone"
                  yAxisId="right"
                />
              )}
            </AreaChart>
          );
        }

        case "pie": {
          return (
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey={config.yKey}
                label
                nameKey={config.xKey}
                outerRadius={120}
              >
                {data.map((item) => {
                  const itemKey =
                    typeof item === "object" &&
                    item !== null &&
                    "opponent" in item
                      ? String(item.opponent)
                      : typeof item === "object" &&
                        item !== null &&
                        "month" in item
                      ? String(item.month)
                      : typeof item === "object" &&
                        item !== null &&
                        "condition" in item
                      ? String(item.condition)
                      : `item-${Math.random()}`;
                  const colorIndex = data.indexOf(item) % COLORS.length;
                  return (
                    <Cell fill={COLORS[colorIndex]} key={`cell-${itemKey}`} />
                  );
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          );
        }

        default:
          return <div>Unsupported chart type</div>;
      }
    };

    return (
      <div className="flex h-full flex-col p-8">
        <h2 className="mb-4 font-semibold text-2xl">{config.title}</h2>
        <div className="flex-1">
          <ResponsiveContainer height="100%" width="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    );
  },
  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: "Copy chart configuration to clipboard",
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success("Chart configuration copied to clipboard!");
      },
    },
  ],
});
