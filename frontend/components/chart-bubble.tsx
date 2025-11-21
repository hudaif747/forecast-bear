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

type ChartBubbleProps = {
  chartType: "bar" | "line" | "area";
  dataSource: "seasonal" | "opponent" | "weather" | "upcomingGames";
  xKey: string;
  yKey: string;
  title: string;
  filter?: {
    field: string;
    operator: "<" | ">" | "<=" | ">=" | "==" | "!=";
    value: number;
  };
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

export function ChartBubble({
  chartType,
  dataSource,
  xKey,
  yKey,
  title,
  filter,
}: ChartBubbleProps) {
  const { seasonalData, opponentData, weatherData } = useAnalyticsStore();
  const { upcomingGames } = useDashboardStore();

  const chartData = useMemo(() => {
    let sourceData: unknown[] = [];

    if (dataSource === "seasonal") {
      sourceData = seasonalData;
    } else if (dataSource === "opponent") {
      sourceData = opponentData;
    } else if (dataSource === "weather") {
      sourceData = weatherData;
    } else if (dataSource === "upcomingGames") {
      sourceData = upcomingGames.map((game) => ({
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

    // Apply filter if provided
    if (filter) {
      sourceData = sourceData.filter((item: unknown) => {
        const d = item as Record<string, unknown>;
        const fieldValue = d[filter.field];

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

    return sourceData.map((item: unknown) => {
      const d = item as Record<string, unknown>;
      return {
        [xKey]: d[xKey],
        [yKey]: d[yKey],
      };
    });
  }, [
    dataSource,
    xKey,
    yKey,
    filter,
    seasonalData,
    opponentData,
    weatherData,
    upcomingGames,
  ]);

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <div className="h-64 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (chartType === "line") {
      return (
        <div className="h-64 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                dataKey={yKey}
                stroke={COLORS[0]}
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
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              dataKey={yKey}
              fill={COLORS[0]}
              fillOpacity={0.6}
              stroke={COLORS[0]}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="my-4 rounded-lg border bg-card p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {renderChart()}
    </div>
  );
}
