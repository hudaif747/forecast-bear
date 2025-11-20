"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  CloudRain,
  Zap,
  TrendingDown,
  Activity,
} from "lucide-react";

// Mock game data (in real app, fetch by ID from database)
const allGamesData = [
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
    predictedRevenue: 152000,
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
    predictedRevenue: 174000,
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
    predictedRevenue: 128000,
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
    predictedRevenue: 158000,
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
    predictedRevenue: 138000,
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
    predictedRevenue: 156000,
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
    predictedRevenue: 134000,
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
              <p className="text-muted-foreground mt-1">
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
              variant="outline"
              className={
                gameData.confidence === "high"
                  ? "bg-success/20 text-success border-success"
                  : "bg-warning/20 text-warning border-warning"
              }
            >
              {gameData.confidence} confidence
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-6 w-6 text-primary" />
              <Badge variant="secondary">5th-95th percentile</Badge>
            </div>
            <div className="text-4xl font-bold text-foreground mb-1">
              {gameData.predictedTickets.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Predicted Tickets
            </p>
            <div className="text-xs text-muted-foreground">
              Range: {gameData.percentile5.toLocaleString()} -{" "}
              {gameData.percentile95.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <Badge variant="secondary">±€8,000</Badge>
            </div>
            <div className="text-4xl font-bold text-foreground mb-1">
              €{gameData.predictedRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Predicted Revenue
            </p>
            <div className="text-xs text-muted-foreground">
              Confidence band: €156K - €180K
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Percent className="h-6 w-6 text-primary" />
              <Badge variant="secondary">Arena capacity</Badge>
            </div>
            <div className="text-4xl font-bold text-foreground mb-1">
              {gameData.occupancy}%
            </div>
            <p className="text-sm text-muted-foreground mb-2">Occupancy Rate</p>
            <div className="text-xs text-muted-foreground">
              {4500 - gameData.predictedTickets} seats remaining
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Simulation */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            Scenario Simulation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Adjust factors to see how predictions change dynamically
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Team Form
                </label>
                <span className="text-sm text-muted-foreground">
                  {teamForm[0]}%
                </span>
              </div>
              <Slider
                value={teamForm}
                onValueChange={setTeamForm}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Weather Condition
                </label>
                <span className="text-sm text-muted-foreground">
                  {weather[0] < 40
                    ? "Rainy"
                    : weather[0] < 60
                    ? "Cloudy"
                    : "Clear"}
                </span>
              </div>
              <Slider
                value={weather}
                onValueChange={setWeather}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Ticket Price Change
                </label>
                <span className="text-sm text-muted-foreground">
                  {priceChange[0] > 0 ? "+" : ""}
                  {priceChange[0]}%
                </span>
              </div>
              <Slider
                value={priceChange}
                onValueChange={setPriceChange}
                min={-20}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Marketing Boost
                </label>
                <span className="text-sm text-muted-foreground">
                  {marketing[0]}%
                </span>
              </div>
              <Slider
                value={marketing}
                onValueChange={setMarketing}
                max={100}
                step={1}
              />
            </div>
          </div>

          {/* Dynamic Recalculation Card */}
          <Card className="bg-muted border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Updated Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tickets</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(adjustedTickets).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {adjustedTickets > baseTickets ? (
                      <span className="text-success flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />+
                        {Math.round(adjustedTickets - baseTickets)}
                      </span>
                    ) : (
                      <span className="text-danger flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {Math.round(adjustedTickets - baseTickets)}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-foreground">
                    €{Math.round(adjustedRevenue).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Occupancy
                  </p>
                  <p className="text-2xl font-bold text-foreground">
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
          <CardTitle className="text-xl text-foreground">
            Why This Prediction?
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Feature importance - factors driving this forecast
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureImportance.map((item) => (
              <div key={item.feature} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {item.feature}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.importance}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
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
