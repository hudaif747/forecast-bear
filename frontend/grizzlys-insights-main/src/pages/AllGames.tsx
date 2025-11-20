import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Filter } from "lucide-react";

// Extended mock data for all games
const allGames = [
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
  {
    id: 6,
    date: "2025-12-10",
    opponent: "ERC Ingolstadt",
    weekday: "Wednesday",
    faceoff: "19:30",
    predictedTickets: 3450,
    predictedRevenue: 138000,
    occupancy: 76,
    confidence: "medium",
  },
  {
    id: 7,
    date: "2025-12-13",
    opponent: "Düsseldorfer EG",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 3900,
    predictedRevenue: 156000,
    occupancy: 86,
    confidence: "high",
  },
  {
    id: 8,
    date: "2025-12-17",
    opponent: "Nürnberg Ice Tigers",
    weekday: "Wednesday",
    faceoff: "19:30",
    predictedTickets: 3350,
    predictedRevenue: 134000,
    occupancy: 74,
    confidence: "medium",
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

export default function AllGames() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">All Home Games</h2>
          <p className="text-muted-foreground">
            Complete forecast overview for all upcoming home games
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Games</p>
            <p className="text-3xl font-bold text-foreground">{allGames.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Avg. Occupancy</p>
            <p className="text-3xl font-bold text-foreground">83%</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">High Confidence</p>
            <p className="text-3xl font-bold text-success">3</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Low Confidence</p>
            <p className="text-3xl font-bold text-danger">1</p>
          </CardContent>
        </Card>
      </div>

      {/* Games Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Detailed Game Forecasts</CardTitle>
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
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allGames.map((game) => (
                  <tr
                    key={game.id}
                    className={`border-b border-border transition-colors ${
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
                    <td className="py-4 px-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/game/${game.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
