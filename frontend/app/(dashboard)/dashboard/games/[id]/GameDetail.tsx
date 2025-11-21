"use client";

import {
  Activity,
  CloudRain,
  DollarSign,
  Percent,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

// Mock game data (in real app, fetch by ID from database)
const allGamesData = [
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
    confidenceRange: [3900, 4500],
    percentile5: 3900,
    percentile95: 4500,
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
    confidenceRange: [3500, 4100],
    percentile5: 3500,
    percentile95: 4100,
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
    confidenceRange: [4000, 4500],
    percentile5: 4000,
    percentile95: 4500,
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
    confidenceRange: [2900, 3500],
    percentile5: 2900,
    percentile95: 3500,
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
    confidenceRange: [3600, 4300],
    percentile5: 3600,
    percentile95: 4300,
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
    confidenceRange: [3100, 3800],
    percentile5: 3100,
    percentile95: 3800,
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
    confidenceRange: [3600, 4200],
    percentile5: 3600,
    percentile95: 4200,
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
    confidenceRange: [3000, 3700],
    percentile5: 3000,
    percentile95: 3700,
  },
];

export default function PureGameDetail({ id }: { id: string }) {
  // Find game by ID (in real app, fetch from database)
  const gameData = allGamesData.find(
    (game) => game.id === Number.parseInt(id, 10)
  );

  // If game not found, show error or redirect
  if (!gameData) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-2xl text-foreground">
            Game Not Found
          </h2>
          <p className="text-muted-foreground">
            The game with ID {id} could not be found.
          </p>
        </div>
      </div>
    );
  }
  const [teamForm, setTeamForm] = useState([50]);
  const [weather, setWeather] = useState([50]);
  const [priceChange, setPriceChange] = useState([0]);
  const [marketing, setMarketing] = useState([50]);

  // Simulate dynamic recalculation based on sliders
  const baseTickets = gameData.predictedTickets;
  const adjustment =
    (teamForm[0] - 50) * 10 +
    (weather[0] - 50) * 5 -
    priceChange[0] * 8 +
    (marketing[0] - 50) * 6;
  const adjustedTickets = Math.max(2000, baseTickets + adjustment);
  const adjustedRevenue = adjustedTickets * 40; // €40 avg ticket price
  const adjustedOccupancy = Math.round((adjustedTickets / 4500) * 100);

  const featureImportance = [
    { feature: "Opponent Strength", importance: 32, icon: Activity },
    { feature: "Day of Week", importance: 24, icon: TrendingUp },
    { feature: "Team Form", importance: 18, icon: Zap },
    { feature: "Weather", importance: 14, icon: CloudRain },
    { feature: "Ticket Price", importance: 12, icon: DollarSign },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Game Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground">
                {gameData.opponent} vs Grizzlys Wolfsburg
              </CardTitle>
              <p className="mt-1 text-muted-foreground">
                {new Date(gameData.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {gameData.faceoff}
              </p>
            </div>
            <Badge
              className={
                gameData.confidence === "high"
                  ? "border-success bg-success/20 text-success"
                  : "border-warning bg-warning/20 text-warning"
              }
              variant="outline"
            >
              {gameData.confidence} confidence
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <Users className="h-6 w-6 text-primary" />
              <Badge variant="secondary">5th-95th percentile</Badge>
            </div>
            <div className="mb-1 font-bold text-4xl text-foreground">
              {gameData.predictedTickets.toLocaleString()}
            </div>
            <p className="mb-2 text-muted-foreground text-sm">
              Predicted Tickets
            </p>
            <div className="text-muted-foreground text-xs">
              Range: {gameData.percentile5.toLocaleString()} -{" "}
              {gameData.percentile95.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <DollarSign className="h-6 w-6 text-primary" />
              <Badge variant="secondary">±€8,000</Badge>
            </div>
            <div className="mb-1 font-bold text-4xl text-foreground">
              €{gameData.predictedRevenue.toLocaleString()}
            </div>
            <p className="mb-2 text-muted-foreground text-sm">
              Predicted Revenue
            </p>
            <div className="text-muted-foreground text-xs">
              Confidence band: €156K - €180K
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <Percent className="h-6 w-6 text-primary" />
              <Badge variant="secondary">Arena capacity</Badge>
            </div>
            <div className="mb-1 font-bold text-4xl text-foreground">
              {gameData.occupancy}%
            </div>
            <p className="mb-2 text-muted-foreground text-sm">Occupancy Rate</p>
            <div className="text-muted-foreground text-xs">
              {4500 - gameData.predictedTickets} seats remaining
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Simulation */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Scenario Simulation
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Adjust factors to see how predictions change dynamically
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground text-sm">
                  Team Form
                </label>
                <span className="text-muted-foreground text-sm">
                  {teamForm[0]}%
                </span>
              </div>
              <Slider
                max={100}
                onValueChange={setTeamForm}
                step={1}
                value={teamForm}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground text-sm">
                  Weather Condition
                </label>
                <span className="text-muted-foreground text-sm">
                  {weather[0] < 40
                    ? "Rainy"
                    : weather[0] < 60
                      ? "Cloudy"
                      : "Clear"}
                </span>
              </div>
              <Slider
                max={100}
                onValueChange={setWeather}
                step={1}
                value={weather}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground text-sm">
                  Ticket Price Change
                </label>
                <span className="text-muted-foreground text-sm">
                  {priceChange[0] > 0 ? "+" : ""}
                  {priceChange[0]}%
                </span>
              </div>
              <Slider
                max={20}
                min={-20}
                onValueChange={setPriceChange}
                step={1}
                value={priceChange}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground text-sm">
                  Marketing Boost
                </label>
                <span className="text-muted-foreground text-sm">
                  {marketing[0]}%
                </span>
              </div>
              <Slider
                max={100}
                onValueChange={setMarketing}
                step={1}
                value={marketing}
              />
            </div>
          </div>

          {/* Dynamic Recalculation Card */}
          <Card className="border-primary/50 bg-muted">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">
                Updated Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="mb-1 text-muted-foreground text-sm">Tickets</p>
                  <p className="font-bold text-2xl text-foreground">
                    {Math.round(adjustedTickets).toLocaleString()}
                  </p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {adjustedTickets > baseTickets ? (
                      <span className="flex items-center gap-1 text-success">
                        <TrendingUp className="h-3 w-3" />+
                        {Math.round(adjustedTickets - baseTickets)}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-danger">
                        <TrendingDown className="h-3 w-3" />
                        {Math.round(adjustedTickets - baseTickets)}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground text-sm">Revenue</p>
                  <p className="font-bold text-2xl text-foreground">
                    €{Math.round(adjustedRevenue).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-muted-foreground text-sm">
                    Occupancy
                  </p>
                  <p className="font-bold text-2xl text-foreground">
                    {adjustedOccupancy}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline">Reset to Baseline</Button>
            <Button>Apply Scenario</Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Why This Prediction?
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Feature importance - factors driving this forecast
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureImportance.map((item) => (
              <div className="space-y-2" key={item.feature}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">
                      {item.feature}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {item.importance}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${item.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
