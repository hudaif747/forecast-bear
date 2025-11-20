import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for upcoming games
const upcomingGames = [
  {
    id: 1,
    date: "2025-11-22",
    opponent: "Eisbären Berlin",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 4200,
    predictedRevenue: 168_000,
    occupancy: 93,
    confidence: "high",
  },
  {
    id: 2,
    date: "2025-11-25",
    opponent: "Adler Mannheim",
    weekday: "Tuesday",
    faceoff: "19:30",
    predictedTickets: 3800,
    predictedRevenue: 152_000,
    occupancy: 84,
    confidence: "medium",
  },
  {
    id: 3,
    date: "2025-11-29",
    opponent: "Red Bull München",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 4350,
    predictedRevenue: 174_000,
    occupancy: 96,
    confidence: "high",
  },
  {
    id: 4,
    date: "2025-12-03",
    opponent: "Kölner Haie",
    weekday: "Wednesday",
    faceoff: "19:30",
    predictedTickets: 3200,
    predictedRevenue: 128_000,
    occupancy: 71,
    confidence: "low",
  },
  {
    id: 5,
    date: "2025-12-06",
    opponent: "Straubing Tigers",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 3950,
    predictedRevenue: 158_000,
    occupancy: 87,
    confidence: "medium",
  },
];

const kpis = [
  {
    title: "Forecasted Seasonal Attendance",
    value: "165,400",
    subtitle: "Total tickets",
    icon: Users,
    trend: "+8.2%",
  },
  {
    title: "Forecasted Seasonal Revenue",
    value: "€6.62M",
    subtitle: "Total revenue",
    icon: DollarSign,
    trend: "+12.4%",
  },
  {
    title: "Highest-Risk Game",
    value: "Dec 3 vs Köln",
    subtitle: "71% occupancy",
    icon: AlertTriangle,
    trend: "Needs boost",
  },
  {
    title: "Avg. Confidence Score",
    value: "8.3/10",
    subtitle: "Model reliability",
    icon: TrendingUp,
    trend: "High",
  },
];

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
  const navigate = useNavigate();

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
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Opponent
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                    Day / Time
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground text-sm">
                    Predicted Tickets
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground text-sm">
                    Predicted Revenue
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground text-sm">
                    Occupancy
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground text-sm">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingGames.map((game) => (
                  <tr
                    className={`cursor-pointer border-border border-b transition-colors ${
                      rowColors[game.confidence as keyof typeof rowColors]
                    }`}
                    key={game.id}
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <td className="px-4 py-4 font-medium text-foreground text-sm">
                      {new Date(game.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-foreground text-sm">
                      {game.opponent}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground text-sm">
                      {game.weekday} {game.faceoff}
                    </td>
                    <td className="px-4 py-4 text-right text-foreground text-sm">
                      {game.predictedTickets.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-foreground text-sm">
                      €{game.predictedRevenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-sm">
                      <span className="font-semibold text-foreground">
                        {game.occupancy}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
