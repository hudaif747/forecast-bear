import { Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Extended mock data for all games
const allGames = [
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
  {
    id: 6,
    date: "2025-12-10",
    opponent: "ERC Ingolstadt",
    weekday: "Wednesday",
    faceoff: "19:30",
    predictedTickets: 3450,
    predictedRevenue: 138_000,
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
    predictedRevenue: 156_000,
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
    predictedRevenue: 134_000,
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
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 font-bold text-2xl text-foreground">
            All Home Games
          </h2>
          <p className="text-muted-foreground">
            Complete forecast overview for all upcoming home games
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="mb-1 text-muted-foreground text-sm">Total Games</p>
            <p className="font-bold text-3xl text-foreground">
              {allGames.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="mb-1 text-muted-foreground text-sm">Avg. Occupancy</p>
            <p className="font-bold text-3xl text-foreground">83%</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="mb-1 text-muted-foreground text-sm">
              High Confidence
            </p>
            <p className="font-bold text-3xl text-success">3</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="mb-1 text-muted-foreground text-sm">Low Confidence</p>
            <p className="font-bold text-3xl text-danger">1</p>
          </CardContent>
        </Card>
      </div>

      {/* Games Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Detailed Game Forecasts
          </CardTitle>
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
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-b">
                {allGames.map((game) => (
                  <tr
                    className={`border-border border-b transition-colors ${
                      rowColors[game.confidence as keyof typeof rowColors]
                    }`}
                    key={game.id}
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
                    <td className="px-4 py-4 text-center">
                      <Link href={`/dashboard/games/${game.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
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
