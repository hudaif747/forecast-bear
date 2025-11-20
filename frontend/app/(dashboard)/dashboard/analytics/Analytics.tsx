"use client";

import {
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsStore } from "@/lib/store";

export default function Analytics() {
  const { seasonalData, opponentData, weatherData } = useAnalyticsStore();
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
