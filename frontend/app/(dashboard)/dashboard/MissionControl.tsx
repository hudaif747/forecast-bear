"use client";

import {
  AlertTriangle,
  Activity,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageSquare,
  Rocket,
  Settings,
  TrendingUp,
  Users,
  Zap,
  Target,
  ArrowRight,
  Database,
  Cpu,
  Network,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store";
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
  { label: "View All Games", icon: Calendar, href: "/dashboard/games", color: "text-blue-500" },
  { label: "Analytics Dashboard", icon: BarChart3, href: "/dashboard/analytics", color: "text-purple-500" },
  { label: "AI Assistant", icon: MessageSquare, href: "/dashboard/assistant", color: "text-green-500" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings", color: "text-gray-500" },
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

  const avgOccupancy = upcomingGames.length > 0
    ? Math.round(upcomingGames.reduce((sum, g) => sum + g.occupancy, 0) / upcomingGames.length)
    : 0;

  const totalRevenue = upcomingGames.reduce((sum, g) => sum + g.predictedRevenue, 0);
  const totalTickets = upcomingGames.reduce((sum, g) => sum + g.predictedTickets, 0);

  return (
    <div className="h-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-auto">
      {/* Compact Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Rocket className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-foreground">
                  Mission Control
                </h1>
                <p className="text-xs text-muted-foreground">
                  Forecast & Analytics Command Center
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2.5 py-1">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs font-medium text-foreground">Operational</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Live</div>
                <div className="text-xs font-mono text-foreground">
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
                key={system.name}
                className="border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                      <StatusIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-medium text-muted-foreground truncate">
                        {system.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5 text-green-500 shrink-0" />
                        <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
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
              key={kpi.title}
              className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2"
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-muted-foreground truncate">
                      {kpi.title}
                    </div>
                    <div className="text-xl font-bold tracking-tight text-foreground mt-1">
                      {kpi.value}
                    </div>
                    <Badge
                      variant="secondary"
                      className="mt-1.5 h-4 text-[10px] px-1.5 bg-primary/10 text-primary border-primary/20"
                    >
                      {kpi.trend}
                    </Badge>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ml-2 shrink-0">
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
          <Card className="lg:col-span-5 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Critical Alerts
                  </CardTitle>
                </div>
                <Badge variant="outline" className="h-5 text-xs bg-warning/10 text-warning border-warning/20">
                  {criticalAlerts.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {criticalAlerts.length > 0 ? (
                <div className="space-y-2">
                  {criticalAlerts.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between rounded-md border border-warning/30 bg-warning/5 p-2.5 transition-colors hover:bg-warning/10 cursor-pointer"
                      onClick={() => router.push(`/dashboard/games/${game.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {game.opponent}
                          </span>
                          <Badge
                            className={cn(
                              "h-4 text-[10px] px-1.5",
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
                          <span>{game.predictedTickets.toLocaleString()} tix</span>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-2 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mb-1.5" />
                  <p className="text-xs font-medium text-foreground">All Clear</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    No critical issues
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Game & Quick Stats */}
          <div className="lg:col-span-4 space-y-4">
            {nextGame && (
              <Card className="border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold text-foreground">
                      Next Game
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {daysUntilNext !== null ? (
                        <>
                          {daysUntilNext}
                          <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                            {daysUntilNext === 1 ? "day" : "days"}
                          </span>
                        </>
                      ) : (
                        "Today"
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      until next home game
                    </p>
                  </div>
                  <div className="rounded-md border border-border/50 bg-card/50 p-3">
                    <div className="font-semibold text-sm text-foreground">
                      vs {nextGame.opponent}
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{nextGame.weekday}</span>
                      <span>{nextGame.faceoff}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-muted-foreground">Predicted</div>
                        <div className="text-sm font-semibold text-foreground">
                          {nextGame.predictedTickets.toLocaleString()}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "h-4 text-[10px] px-1.5",
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
                <CardTitle className="text-sm font-semibold text-foreground">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Avg Occupancy</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${avgOccupancy}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-10 text-right">
                      {avgOccupancy}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Revenue</span>
                  <span className="text-xs font-semibold text-foreground">
                    €{(totalRevenue / 1_000_000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Tickets</span>
                  <span className="text-xs font-semibold text-foreground">
                    {totalTickets.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Compact */}
          <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1.5">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-8 text-xs hover:bg-muted/50"
                    onClick={() => router.push(action.href)}
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
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Critical Alerts
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
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
                      key={game.id}
                      className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-4 transition-colors hover:bg-warning/10 cursor-pointer"
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
                        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {new Date(game.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>Occupancy: {game.occupancy}%</span>
                          <span>Predicted: {game.predictedTickets.toLocaleString()} tickets</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    No critical alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
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
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Next Game
                  </CardTitle>
                </div>
                <CardDescription>Upcoming match details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {daysUntilNext !== null ? (
                      <>
                        {daysUntilNext}
                        <span className="ml-2 text-lg font-normal text-muted-foreground">
                          {daysUntilNext === 1 ? "day" : "days"}
                        </span>
                      </>
                    ) : (
                      "Today"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    until next home game
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/50 p-4">
                  <div className="font-semibold text-foreground">
                    vs {nextGame.opponent}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{nextGame.weekday}</span>
                    <span>{nextGame.faceoff}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Predicted</div>
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
                  variant="outline"
                  onClick={() => router.push(`/dashboard/games/${nextGame.id}`)}
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
        <Card className="lg:col-span-12 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">
                  Upcoming Games Forecast
                </CardTitle>
                <CardDescription className="text-xs">
                  Click any game for details
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => router.push("/dashboard/games")}
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
                    <TableHead className="h-9 text-xs text-right">Tickets</TableHead>
                    <TableHead className="h-9 text-xs text-right">Revenue</TableHead>
                    <TableHead className="h-9 text-xs text-right">Occupancy</TableHead>
                    <TableHead className="h-9 text-xs text-center">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingGames.slice(0, 8).map((game, index) => (
                    <TableRow
                      className={cn(
                        rowColors[game.confidence as keyof typeof rowColors],
                        "cursor-pointer border-border/50 transition-colors hover:bg-muted/30 h-11"
                      )}
                      key={index}
                      onClick={() => router.push(`/dashboard/games/${game.id}`)}
                    >
                      <TableCell className="text-xs font-medium text-foreground py-2">
                        {new Date(game.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground py-2">
                        {game.opponent}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-2">
                        {game.faceoff}
                      </TableCell>
                      <TableCell className="text-xs text-right font-medium text-foreground py-2">
                        {game.predictedTickets.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-right font-medium text-foreground py-2">
                        €{(game.predictedRevenue / 1000).toFixed(0)}k
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <span className="text-xs font-semibold text-foreground">
                          {game.occupancy}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <Badge
                          className={cn(
                            "h-4 text-[10px] px-1.5",
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
