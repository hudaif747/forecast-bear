"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  DollarSign,
  MessageSquare,
  Network,
  Rocket,
  Settings,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import SeasonAttendanceOutlook from "./SeasonAttendanceOutlook";

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

const systemStatus = [
  { name: "Forecast Engine", status: "operational", icon: Cpu },
  { name: "Data Pipeline", status: "operational", icon: Database },
  { name: "Analytics API", status: "operational", icon: Network },
  { name: "ML Models", status: "operational", icon: Zap },
];

const quickActions = [
  {
    label: "View All Games",
    icon: Calendar,
    href: "/dashboard/games",
    color: "text-blue-500",
  },
  {
    label: "Analytics Dashboard",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-purple-500",
  },
  {
    label: "AI Assistant",
    icon: MessageSquare,
    href: "/dashboard/assistant",
    color: "text-green-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
];

export default function MissionControl() {
  const router = useRouter();
  const { upcomingGames, kpis } = useDashboardStore();

  const criticalAlerts = upcomingGames.filter(
    (game) => game.confidence === "low" || game.occupancy < 75
  );

  const nextGame = upcomingGames[0];
  const daysUntilNext = nextGame
    ? Math.ceil(
        (new Date(nextGame.date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const avgOccupancy =
    upcomingGames.length > 0
      ? Math.round(
          upcomingGames.reduce((sum, g) => sum + g.occupancy, 0) /
            upcomingGames.length
        )
      : 0;

  const totalRevenue = upcomingGames.reduce(
    (sum, g) => sum + g.predictedRevenue,
    0
  );
  const totalTickets = upcomingGames.reduce(
    (sum, g) => sum + g.predictedTickets,
    0
  );

  return (
    <div className="h-full min-h-screen overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
      {/* Compact Header */}
      <div className="sticky top-0 z-40 border-border/50 border-b bg-card/80 backdrop-blur-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Rocket className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-foreground text-lg tracking-tight">
                  Mission Control
                </h1>
                <p className="text-muted-foreground text-xs">
                  Forecast & Analytics Command Center
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2.5 py-1">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <span className="font-medium text-foreground text-xs">
                  Operational
                </span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Live
                </div>
                <div className="font-mono text-foreground text-xs">
                  {new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Compact System Status & KPIs Grid */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {/* System Status - Compact */}
          {systemStatus.map((system) => {
            const StatusIcon = system.icon;
            return (
              <Card
                className="border-border/50 bg-card/50 backdrop-blur-sm"
                key={system.name}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                      <StatusIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-[10px] text-muted-foreground">
                        {system.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-green-500" />
                        <span className="font-medium text-[10px] text-green-600 dark:text-green-400">
                          OK
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Quick KPIs - Compact */}
          {kpis.slice(0, 2).map((kpi) => (
            <Card
              className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2"
              key={kpi.title}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-[10px] text-muted-foreground">
                      {kpi.title}
                    </div>
                    <div className="mt-1 font-bold text-foreground text-xl tracking-tight">
                      {kpi.value}
                    </div>
                    <Badge
                      className="mt-1.5 h-4 border-primary/20 bg-primary/10 px-1.5 text-[10px] text-primary"
                      variant="secondary"
                    >
                      {kpi.trend}
                    </Badge>
                  </div>
                  <div className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <kpi.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Critical Alerts - Compact */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <CardTitle className="font-semibold text-foreground text-sm">
                    Critical Alerts
                  </CardTitle>
                </div>
                <Badge
                  className="h-5 border-warning/20 bg-warning/10 text-warning text-xs"
                  variant="outline"
                >
                  {criticalAlerts.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {criticalAlerts.length > 0 ? (
                <div className="space-y-2">
                  {criticalAlerts.map((game) => (
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-md border border-warning/30 bg-warning/5 p-2.5 transition-colors hover:bg-warning/10"
                      key={game.id}
                      onClick={() => router.push(`/dashboard/games/${game.id}`)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold text-foreground text-sm">
                            {game.opponent}
                          </span>
                          <Badge
                            className={cn(
                              "h-4 px-1.5 text-[10px]",
                              confidenceColors[
                                game.confidence as keyof typeof confidenceColors
                              ]
                            )}
                            variant="outline"
                          >
                            {game.confidence}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span>
                            {new Date(game.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="font-medium">{game.occupancy}%</span>
                          <span>
                            {game.predictedTickets.toLocaleString()} tix
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="mb-1.5 h-8 w-8 text-green-500" />
                  <p className="font-medium text-foreground text-xs">
                    All Clear
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    No critical issues
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Game & Quick Stats */}
          <div className="space-y-4 lg:col-span-4">
            {nextGame && (
              <Card className="border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <CardTitle className="font-semibold text-foreground text-sm">
                      Next Game
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div>
                    <div className="font-bold text-2xl text-foreground">
                      {daysUntilNext !== null ? (
                        <>
                          {daysUntilNext}
                          <span className="ml-1.5 font-normal text-muted-foreground text-sm">
                            {daysUntilNext === 1 ? "day" : "days"}
                          </span>
                        </>
                      ) : (
                        "Today"
                      )}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      until next home game
                    </p>
                  </div>
                  <div className="rounded-md border border-border/50 bg-card/50 p-3">
                    <div className="font-semibold text-foreground text-sm">
                      vs {nextGame.opponent}
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{nextGame.weekday}</span>
                      <span>{nextGame.faceoff}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-muted-foreground">
                          Predicted
                        </div>
                        <div className="font-semibold text-foreground text-sm">
                          {nextGame.predictedTickets.toLocaleString()}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "h-4 px-1.5 text-[10px]",
                          confidenceColors[
                            nextGame.confidence as keyof typeof confidenceColors
                          ]
                        )}
                        variant="outline"
                      >
                        {nextGame.confidence}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-semibold text-foreground text-sm">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    Avg Occupancy
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${avgOccupancy}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-foreground text-xs">
                      {avgOccupancy}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    Total Revenue
                  </span>
                  <span className="font-semibold text-foreground text-xs">
                    €{(totalRevenue / 1_000_000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    Total Tickets
                  </span>
                  <span className="font-semibold text-foreground text-xs">
                    {totalTickets.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Compact */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-foreground text-sm">
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 pt-0">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    className="h-8 w-full justify-start gap-2 text-xs hover:bg-muted/50"
                    key={action.label}
                    onClick={() => router.push(action.href)}
                    size="sm"
                    variant="ghost"
                  >
                    <ActionIcon className={cn("h-3.5 w-3.5", action.color)} />
                    <span>{action.label}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts & Next Game */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Critical Alerts */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <CardTitle className="font-semibold text-foreground text-lg">
                    Critical Alerts
                  </CardTitle>
                </div>
                <Badge
                  className="border-warning/20 bg-warning/10 text-warning"
                  variant="outline"
                >
                  {criticalAlerts.length} Active
                </Badge>
              </div>
              <CardDescription>
                Games requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalAlerts.length > 0 ? (
                <div className="space-y-3">
                  {criticalAlerts.map((game) => (
                    <div
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-4 transition-colors hover:bg-warning/10"
                      key={game.id}
                      onClick={() => router.push(`/dashboard/games/${game.id}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {game.opponent}
                          </span>
                          <Badge
                            className={cn(
                              confidenceColors[
                                game.confidence as keyof typeof confidenceColors
                              ]
                            )}
                            variant="outline"
                          >
                            {game.confidence}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-muted-foreground text-xs">
                          <span>
                            {new Date(game.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>Occupancy: {game.occupancy}%</span>
                          <span>
                            Predicted: {game.predictedTickets.toLocaleString()}{" "}
                            tickets
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="mb-2 h-12 w-12 text-green-500" />
                  <p className="font-medium text-foreground text-sm">
                    No critical alerts
                  </p>
                  <p className="text-muted-foreground text-xs">
                    All games are performing within expected parameters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Game Countdown */}
          {nextGame && (
            <Card className="border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="font-semibold text-foreground text-lg">
                    Next Game
                  </CardTitle>
                </div>
                <CardDescription>Upcoming match details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-bold text-3xl text-foreground">
                    {daysUntilNext !== null ? (
                      <>
                        {daysUntilNext}
                        <span className="ml-2 font-normal text-lg text-muted-foreground">
                          {daysUntilNext === 1 ? "day" : "days"}
                        </span>
                      </>
                    ) : (
                      "Today"
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    until next home game
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/50 p-4">
                  <div className="font-semibold text-foreground">
                    vs {nextGame.opponent}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
                    <span>{nextGame.weekday}</span>
                    <span>{nextGame.faceoff}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-muted-foreground text-xs">
                        Predicted
                      </div>
                      <div className="font-semibold text-foreground">
                        {nextGame.predictedTickets.toLocaleString()} tickets
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        confidenceColors[
                          nextGame.confidence as keyof typeof confidenceColors
                        ]
                      )}
                      variant="outline"
                    >
                      {nextGame.confidence}
                    </Badge>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => router.push(`/dashboard/games/${nextGame.id}`)}
                  variant="outline"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Season Attendance Outlook - Compact */}
        <div className="lg:col-span-12">
          <SeasonAttendanceOutlook />
        </div>

        {/* Compact Games Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-12">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-semibold text-foreground text-sm">
                  Upcoming Games Forecast
                </CardTitle>
                <CardDescription className="text-xs">
                  Click any game for details
                </CardDescription>
              </div>
              <Button
                className="h-7 text-xs"
                onClick={() => router.push("/dashboard/games")}
                size="sm"
                variant="outline"
              >
                View All
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="h-9 text-xs">Date</TableHead>
                    <TableHead className="h-9 text-xs">Opponent</TableHead>
                    <TableHead className="h-9 text-xs">Time</TableHead>
                    <TableHead className="h-9 text-right text-xs">
                      Tickets
                    </TableHead>
                    <TableHead className="h-9 text-right text-xs">
                      Revenue
                    </TableHead>
                    <TableHead className="h-9 text-right text-xs">
                      Occupancy
                    </TableHead>
                    <TableHead className="h-9 text-center text-xs">
                      Confidence
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingGames.slice(0, 8).map((game, index) => (
                    <TableRow
                      className={cn(
                        rowColors[game.confidence as keyof typeof rowColors],
                        "h-11 cursor-pointer border-border/50 transition-colors hover:bg-muted/30"
                      )}
                      key={index}
                      onClick={() => router.push(`/dashboard/games/${game.id}`)}
                    >
                      <TableCell className="py-2 font-medium text-foreground text-xs">
                        {new Date(game.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="py-2 font-medium text-foreground text-xs">
                        {game.opponent}
                      </TableCell>
                      <TableCell className="py-2 text-muted-foreground text-xs">
                        {game.faceoff}
                      </TableCell>
                      <TableCell className="py-2 text-right font-medium text-foreground text-xs">
                        {game.predictedTickets.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-2 text-right font-medium text-foreground text-xs">
                        €{(game.predictedRevenue / 1000).toFixed(0)}k
                      </TableCell>
                      <TableCell className="py-2 text-right">
                        <span className="font-semibold text-foreground text-xs">
                          {game.occupancy}%
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <Badge
                          className={cn(
                            "h-4 px-1.5 text-[10px]",
                            confidenceColors[
                              game.confidence as keyof typeof confidenceColors
                            ]
                          )}
                          variant="outline"
                        >
                          {game.confidence}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
