"use client";

import { useMemo } from "react";
import type { TooltipProps } from "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsStore, useDashboardStore } from "@/lib/store";

type RiskPoint = {
  id: number;
  opponent: string;
  dateLabel: string;
  revenue: number;
  occupancy: number;
  tickets: number;
  confidence: "high" | "medium" | "low";
};

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat("en-US");

const confidenceColors: Record<RiskPoint["confidence"], string> = {
  high: "hsl(var(--success))",
  medium: "hsl(var(--warning))",
  low: "hsl(var(--danger))",
};

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatTickets = (value: number) => integerFormatter.format(value);

function RiskTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }
  const data = payload[0].payload as RiskPoint;
  const confidenceLabel =
    data.confidence.charAt(0).toUpperCase() + data.confidence.slice(1);

  return (
    <div className="rounded-md border border-border bg-card p-3 text-xs shadow-lg">
      <p className="font-semibold text-foreground text-sm">{data.opponent}</p>
      <p className="text-muted-foreground">{data.dateLabel}</p>
      <div className="mt-2 space-y-1 text-foreground">
        <div className="flex items-center justify-between">
          <span>Revenue</span>
          <span>{formatCurrency(data.revenue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tickets</span>
          <span>{formatTickets(data.tickets)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Occupancy</span>
          <span>{data.occupancy}%</span>
        </div>
      </div>
      <Badge className="mt-2" variant="secondary">
        {confidenceLabel} confidence
      </Badge>
    </div>
  );
}

export default function Analytics() {
  const { seasonalData, opponentData, weatherData } = useAnalyticsStore();
  const { upcomingGames } = useDashboardStore();

  const riskPoints = useMemo<RiskPoint[]>(() => {
    return upcomingGames.map((game) => ({
      id: game.id,
      opponent: game.opponent,
      dateLabel: `${game.weekday}, ${new Date(game.date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      )}`,
      revenue: game.predictedRevenue,
      occupancy: game.occupancy,
      tickets: game.predictedTickets,
      confidence: game.confidence,
    }));
  }, [upcomingGames]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="mb-2 font-bold text-2xl text-foreground">
          Historical Performance Analytics
        </h2>
        <p className="text-muted-foreground">
          Analyze past trends to improve future predictions
        </p>
      </div>

      {/* Seasonal Trends */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Seasonal Attendance Trends
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Monthly ticket sales throughout the season
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={350} width="100%">
            <LineChart data={seasonalData}>
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
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
              <Legend />
              <Line
                dataKey="tickets"
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
                name="Tickets Sold"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Opponent Performance */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Attendance by Opponent
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Average attendance for games against different teams
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={350} width="100%">
            <BarChart data={opponentData}>
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis dataKey="opponent" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="attendance"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weather Impact */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Weather Impact Analysis
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            How weather conditions affect game attendance
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={300} width="100%">
            <BarChart data={weatherData} layout="vertical">
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis stroke="hsl(var(--muted-foreground))" type="number" />
              <YAxis
                dataKey="condition"
                stroke="hsl(var(--muted-foreground))"
                type="category"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="avgAttendance"
                fill="hsl(var(--chart-2))"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Spotlight */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Risk Spotlight
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Revenue vs. occupancy for upcoming games (bubble size = tickets)
          </p>
        </CardHeader>
        <CardContent>
          {riskPoints.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No upcoming games available.
            </p>
          ) : (
            <ResponsiveContainer height={360} width="100%">
              <ScatterChart
                margin={{ top: 16, right: 24, bottom: 12, left: 12 }}
              >
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="revenue"
                  name="Predicted Revenue"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value: number) => formatCurrency(value)}
                  type="number"
                />
                <YAxis
                  dataKey="occupancy"
                  name="Occupancy"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value: number) => `${value}%`}
                  type="number"
                />
                <ZAxis
                  dataKey="tickets"
                  name="Predicted Tickets"
                  range={[60, 200]}
                  type="number"
                />
                <Tooltip
                  content={<RiskTooltip />}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Legend />
                <Scatter data={riskPoints} name="Games">
                  {riskPoints.map((point) => (
                    <Cell
                      fill={confidenceColors[point.confidence]}
                      key={point.id}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-border">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Peak Attendance
            </h3>
            <p className="mb-2 font-bold text-3xl text-primary">March</p>
            <p className="text-muted-foreground text-sm">
              Historically strongest month with avg. 4,500 tickets sold
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Top Opponent
            </h3>
            <p className="mb-2 font-bold text-3xl text-primary">München</p>
            <p className="text-muted-foreground text-sm">
              Games against Red Bull München average 4,450 tickets
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Weather Impact
            </h3>
            <p className="mb-2 font-bold text-3xl text-primary">-17%</p>
            <p className="text-muted-foreground text-sm">
              Rainy weather reduces attendance compared to clear conditions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
