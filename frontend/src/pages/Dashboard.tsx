import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for upcoming games
const upcomingGames = [
  {
    id: 1,
    date: "2025-11-22",
    opponent: "Eisbären Berlin",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 4200,
    predictedRevenue: 168000,
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
    predictedRevenue: 152000,
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
    predictedRevenue: 174000,
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
    predictedRevenue: 128000,
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
    predictedRevenue: 158000,
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
              <Badge variant="secondary" className="mt-2">
                {kpi.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Games Forecast Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Upcoming Home Games Forecast</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on any game to view detailed predictions and scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Opponent
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Day / Time
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Predicted Tickets
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Predicted Revenue
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Occupancy
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingGames.map((game) => (
                  <tr
                    key={game.id}
                    onClick={() => navigate(`/game/${game.id}`)}
                    className={`border-b border-border cursor-pointer transition-colors ${
                      rowColors[game.confidence as keyof typeof rowColors]
                    }`}
                  >
                    <td className="py-4 px-4 text-sm text-foreground font-medium">
                      {new Date(game.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">{game.opponent}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {game.weekday} {game.faceoff}
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground text-right">
                      {game.predictedTickets.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground text-right">
                      €{game.predictedRevenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-right">
                      <span className="font-semibold text-foreground">{game.occupancy}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge
                        variant="outline"
                        className={confidenceColors[game.confidence as keyof typeof confidenceColors]}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border cursor-pointer hover:border-primary transition-colors">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Find Low-Performing Games
            </h3>
            <p className="text-sm text-muted-foreground">
              Identify games with occupancy below 75% for targeted marketing
            </p>
          </CardContent>
        </Card>
        <Card className="border-border cursor-pointer hover:border-primary transition-colors">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Optimize Marketing Allocation
            </h3>
            <p className="text-sm text-muted-foreground">
              Get AI-driven recommendations on which games need promotion boost
            </p>
          </CardContent>
        </Card>
        <Card className="border-border cursor-pointer hover:border-primary transition-colors">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Run Scenario Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Simulate best-case, worst-case, and expected outcomes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
