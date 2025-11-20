import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock historical data
const seasonalData = [
  { month: "Sep", tickets: 3200, revenue: 128000 },
  { month: "Oct", tickets: 3800, revenue: 152000 },
  { month: "Nov", tickets: 4100, revenue: 164000 },
  { month: "Dec", tickets: 4350, revenue: 174000 },
  { month: "Jan", tickets: 3900, revenue: 156000 },
  { month: "Feb", tickets: 4200, revenue: 168000 },
  { month: "Mar", tickets: 4500, revenue: 180000 },
];

const opponentData = [
  { opponent: "Berlin", attendance: 4300 },
  { opponent: "München", attendance: 4450 },
  { opponent: "Mannheim", attendance: 3900 },
  { opponent: "Köln", attendance: 3200 },
  { opponent: "Ingolstadt", attendance: 3600 },
  { opponent: "Augsburg", attendance: 3450 },
  { opponent: "Straubing", attendance: 3850 },
];

const weatherData = [
  { condition: "Clear", avgAttendance: 4100 },
  { condition: "Cloudy", avgAttendance: 3900 },
  { condition: "Rainy", avgAttendance: 3400 },
  { condition: "Snow", avgAttendance: 3600 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Historical Performance Analytics</h2>
        <p className="text-muted-foreground">
          Analyze past trends to improve future predictions
        </p>
      </div>

      {/* Seasonal Trends */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Seasonal Attendance Trends</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly ticket sales throughout the season
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                type="monotone"
                dataKey="tickets"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
                name="Tickets Sold"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Opponent Performance */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Attendance by Opponent</CardTitle>
          <p className="text-sm text-muted-foreground">
            Average attendance for games against different teams
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={opponentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="opponent" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weather Impact */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Weather Impact Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            How weather conditions affect game attendance
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weatherData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="condition" stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="avgAttendance" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Peak Attendance</h3>
            <p className="text-3xl font-bold text-primary mb-2">March</p>
            <p className="text-sm text-muted-foreground">
              Historically strongest month with avg. 4,500 tickets sold
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Top Opponent</h3>
            <p className="text-3xl font-bold text-primary mb-2">München</p>
            <p className="text-sm text-muted-foreground">
              Games against Red Bull München average 4,450 tickets
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Weather Impact</h3>
            <p className="text-3xl font-bold text-primary mb-2">-17%</p>
            <p className="text-sm text-muted-foreground">
              Rainy weather reduces attendance compared to clear conditions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
