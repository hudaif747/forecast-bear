"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardStore } from "@/lib/store";

const confidenceColors = {
  high: "bg-success/20 text-success border-success",
  medium: "bg-warning/20 text-warning border-warning",
  low: "bg-danger/20 text-danger border-danger",
};

const rowColors = {
  high: "border-l-4 border-l-success hover:bg-success/5",
  medium: "border-l-4 border-l-warning hover:bg-warning/5",
  low: "border-l-4 border-l-danger hover:bg-danger/5",
};

export default function Dashboard() {
  const { upcomingGames, kpis } = useDashboardStore();
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card className="border-border" key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl text-foreground">
                {kpi.value}
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                {kpi.subtitle}
              </p>
              <Badge className="mt-2" variant="secondary">
                {kpi.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Games Forecast Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Upcoming Home Games Forecast
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Click on any game to view detailed predictions and scenarios
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Date</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Day / Time</TableHead>
                <TableHead className="text-right">Predicted Tickets</TableHead>
                <TableHead className="text-right">Predicted Revenue</TableHead>
                <TableHead className="text-right">Occupancy</TableHead>
                <TableHead className="text-center">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingGames.map((game) => (
                <TableRow
                  className={
                    rowColors[game.confidence as keyof typeof rowColors]
                  }
                  key={game.id}
                >
                  <TableCell className="font-medium text-foreground">
                    <Link
                      className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
                      href={`/dashboard/game/${game.id}`}
                    >
                      {new Date(game.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Link>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {game.opponent}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {game.weekday} {game.faceoff}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {game.predictedTickets.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    €{game.predictedRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-foreground">
                      {game.occupancy}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        confidenceColors[
                          game.confidence as keyof typeof confidenceColors
                        ]
                      }
                      variant="outline"
                    >
                      {game.confidence}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="cursor-pointer border-border transition-colors hover:border-primary">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Find Low-Performing Games
            </h3>
            <p className="text-muted-foreground text-sm">
              Identify games with occupancy below 75% for targeted marketing
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border transition-colors hover:border-primary">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Optimize Marketing Allocation
            </h3>
            <p className="text-muted-foreground text-sm">
              Get AI-driven recommendations on which games need promotion boost
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border transition-colors hover:border-primary">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              Run Scenario Analysis
            </h3>
            <p className="text-muted-foreground text-sm">
              Simulate best-case, worst-case, and expected outcomes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
