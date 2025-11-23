"use client";

/**
 * Analytics Store
 *
 * ⚠️ CLIENT-ONLY: This file must have "use client" directive.
 * Only import the hook from "@/lib/store", not this file directly.
 * For types, import from "@/lib/store/types".
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import predictionsDataRaw from "./2025-26_predictions.json" with {
  type: "json",
};
import historicalDataRaw from "./historical-data.json" with { type: "json" };
import mockPredictionsDataRaw from "./mock-2025-26_predictions.json" with {
  type: "json",
};
import mockHistoricalDataRaw from "./mock-historical-data.json" with {
  type: "json",
};

// Toggle to use mock data (set via environment variable or localStorage)
// Priority: localStorage > NEXT_PUBLIC_USE_MOCK_DATA
const getUseMockData = () => {
  if (typeof window !== "undefined") {
    // Client-side: check localStorage first, then env variable
    const localStorageValue = localStorage.getItem("USE_MOCK_DATA");
    if (localStorageValue !== null) {
      return localStorageValue === "true";
    }
    // Check NEXT_PUBLIC env variable (available on client)
    return process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
  }
  // Server-side: check env variables
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
    process.env.USE_MOCK_DATA === "true"
  );
};

const USE_MOCK_DATA = getUseMockData();

// Debug helper (only in development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("[Mock Data] USE_MOCK_DATA:", USE_MOCK_DATA);
  console.log("[Mock Data] NEXT_PUBLIC_USE_MOCK_DATA:", process.env.NEXT_PUBLIC_USE_MOCK_DATA);
  console.log("[Mock Data] localStorage:", localStorage.getItem("USE_MOCK_DATA"));
}

interface HistoricalGame {
  date: string;
  season: string;
  away_team: string;
  ticket_count: number;
  gross_revenue: number;
}

interface PredictionData {
  date: string;
  predicted_attendance: number;
  predicted_revenue: number;
  occupancy_rate: number;
}

const historicalData = (
  USE_MOCK_DATA ? mockHistoricalDataRaw : historicalDataRaw
) as HistoricalGame[];
const predictionsData = (
  USE_MOCK_DATA ? mockPredictionsDataRaw : predictionsDataRaw
) as PredictionData[];

export interface SeasonalDataPoint {
  month: string;
  tickets: number;
  revenue: number;
}

export interface SeasonalSeries {
  season: string;
  points: SeasonalDataPoint[];
}

export interface SeasonalForecastPoint {
  month: string;
  forecastTickets: number;
}

export interface OpponentDataPoint {
  opponent: string;
  attendance: number;
}

export interface WeatherDataPoint {
  condition: string;
  avgAttendance: number;
}

export interface AnalyticsStoreState {
  // Analytics data
  seasonalSeries: SeasonalSeries[];
  seasonalData: SeasonalDataPoint[];
  forecastSeasonalData: SeasonalForecastPoint[];
  opponentData: OpponentDataPoint[];
  weatherData: WeatherDataPoint[];
  // Actions to update analytics data
  setSeasonalSeries: (series: SeasonalSeries[]) => void;
  setSeasonalData: (data: SeasonalDataPoint[]) => void;
  setForecastSeasonalData: (data: SeasonalForecastPoint[]) => void;
  setOpponentData: (data: OpponentDataPoint[]) => void;
  setWeatherData: (data: WeatherDataPoint[]) => void;
}

// Helper function to get month abbreviation
function getMonthAbbr(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short" });
}

// Helper function to normalize opponent names
function normalizeOpponentName(opponent: string): string {
  // Remove "(GER)" and "Grizzlys Wolfsburg" prefix, get first significant word
  return opponent
    .replace(/\(GER\)/g, "")
    .replace(/Grizzlys Wolfsburg/g, "")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .join(" ");
}

// Process historical data by season and month
function processSeasonalData(): SeasonalSeries[] {
  const seasonMap: Record<
    string,
    Record<string, { tickets: number; revenue: number }>
  > = {};

  for (const game of historicalData) {
    const month = getMonthAbbr(game.date);
    const season = game.season;

    if (!seasonMap[season]) {
      seasonMap[season] = {};
    }

    if (!seasonMap[season][month]) {
      seasonMap[season][month] = { tickets: 0, revenue: 0 };
    }

    seasonMap[season][month].tickets += game.ticket_count;
    seasonMap[season][month].revenue += game.gross_revenue;
  }

  // Convert to array format and sort by season (most recent first)
  const seasons = Object.keys(seasonMap).sort().reverse();
  return seasons.map((season) => ({
    season: `20${season}`,
    points: Object.entries(seasonMap[season])
      .map(([month, data]) => ({
        month,
        tickets: Math.round(data.tickets),
        revenue: Math.round(data.revenue),
      }))
      .sort((a, b) => {
        const monthOrder = [
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
        ];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      }),
  }));
}

// Process opponent attendance averages
function processOpponentData(): OpponentDataPoint[] {
  const opponentMap: Record<string, { total: number; count: number }> = {};

  for (const game of historicalData) {
    const opponent = normalizeOpponentName(game.away_team);

    if (!opponentMap[opponent]) {
      opponentMap[opponent] = { total: 0, count: 0 };
    }

    opponentMap[opponent].total += game.ticket_count;
    opponentMap[opponent].count += 1;
  }

  return Object.entries(opponentMap)
    .map(([opponent, data]) => ({
      opponent,
      attendance: Math.round(data.total / data.count),
    }))
    .sort((a, b) => b.attendance - a.attendance);
}

// Process forecast data from predictions
function processForecastData(): SeasonalForecastPoint[] {
  const monthMap: Record<string, { total: number; count: number }> = {};

  for (const prediction of predictionsData) {
    const [day, month] = prediction.date.split(".");
    const monthAbbr = new Date(`2025-${month}-${day}`).toLocaleDateString(
      "en-US",
      { month: "short" }
    );

    if (!monthMap[monthAbbr]) {
      monthMap[monthAbbr] = { total: 0, count: 0 };
    }

    monthMap[monthAbbr].total += prediction.predicted_attendance;
    monthMap[monthAbbr].count += 1;
  }

  return Object.entries(monthMap)
    .map(([month, data]) => ({
      month,
      forecastTickets: Math.round(data.total),
    }))
    .sort((a, b) => {
      const monthOrder = [
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
      ];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
}

// Generate initial data from real historical data
const initialSeasonalSeries: SeasonalSeries[] = processSeasonalData();
const initialSeasonalData: SeasonalDataPoint[] =
  initialSeasonalSeries[0]?.points || [];
const initialForecastSeasonalData: SeasonalForecastPoint[] =
  processForecastData();
const initialOpponentData: OpponentDataPoint[] = processOpponentData();

// Weather data placeholder (not available in historical data)
const initialWeatherData: WeatherDataPoint[] = [
  { condition: "Clear", avgAttendance: 0 },
  { condition: "Cloudy", avgAttendance: 0 },
  { condition: "Rainy", avgAttendance: 0 },
  { condition: "Snow", avgAttendance: 0 },
];

export const useAnalyticsStore = create<AnalyticsStoreState>()(
  devtools(
    (set) => ({
      seasonalSeries: initialSeasonalSeries,
      seasonalData: initialSeasonalData,
      forecastSeasonalData: initialForecastSeasonalData,
      opponentData: initialOpponentData,
      weatherData: initialWeatherData,
      setSeasonalSeries: (series) => set({ seasonalSeries: series }),
      setSeasonalData: (data) => set({ seasonalData: data }),
      setForecastSeasonalData: (data) => set({ forecastSeasonalData: data }),
      setOpponentData: (data) => set({ opponentData: data }),
      setWeatherData: (data) => set({ weatherData: data }),
    }),
    {
      name: "analytics-store", // Name for Redux DevTools
    }
  )
);
