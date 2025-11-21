"use client";

/**
 * Dashboard Store
 *
 * ⚠️ CLIENT-ONLY: This file must have "use client" directive.
 * Only import the hook from "@/lib/store", not this file directly.
 * For types, import from "@/lib/store/types".
 */

import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Import predictions data
// @ts-expect-error
import predictionsDataRaw from "./2025-26_predictions.json" with {
  type: "json",
};

interface PredictionData {
  date: string;
  predicted_attendance: number;
  predicted_revenue: number;
  occupancy_rate: number;
  season_included_occupancy_rate: number;
}

const predictionsData = predictionsDataRaw as PredictionData[];

export interface UpcomingGame {
  id: number;
  date: string;
  opponent: string;
  weekday: string;
  faceoff: string;
  predictedTickets: number;
  predictedRevenue: number;
  occupancy: number;
  confidence: "high" | "medium" | "low";
}

export interface KPI {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Users;
  trend: string;
}

export interface DashboardStoreState {
  // Dashboard data
  upcomingGames: UpcomingGame[];
  kpis: KPI[];
  // Actions to update dashboard data
  setUpcomingGames: (games: UpcomingGame[]) => void;
  setKPIs: (kpis: KPI[]) => void;
}

// Schedule data mapping for home games only
const scheduleMap: Record<
  string,
  { opponent: string; weekday: string; time: string }
> = {
  "2025-09-14": {
    opponent: "Nürnberg Ice Tigers",
    weekday: "Sunday",
    time: "16:30",
  },
  "2025-09-26": {
    opponent: "Schwenninger Wild Wings",
    weekday: "Friday",
    time: "19:30",
  },
  "2025-10-05": {
    opponent: "Pinguins Bremerhaven",
    weekday: "Sunday",
    time: "14:00",
  },
  "2025-10-12": {
    opponent: "Straubing Tigers",
    weekday: "Sunday",
    time: "16:30",
  },
  "2025-10-19": {
    opponent: "Adler Mannheim",
    weekday: "Sunday",
    time: "14:00",
  },
  "2025-10-24": {
    opponent: "Iserlohn Roosters",
    weekday: "Friday",
    time: "19:30",
  },
  "2025-10-28": {
    opponent: "EHC Red Bull München",
    weekday: "Tuesday",
    time: "19:30",
  },
  "2025-10-30": {
    opponent: "Augsburger Panther",
    weekday: "Thursday",
    time: "19:30",
  },
  "2025-11-14": { opponent: "Kölner Haie", weekday: "Friday", time: "19:30" },
  "2025-11-21": {
    opponent: "ERC Ingolstadt",
    weekday: "Friday",
    time: "19:30",
  },
  "2025-11-28": {
    opponent: "Eisbären Berlin",
    weekday: "Friday",
    time: "19:30",
  },
  "2025-12-05": {
    opponent: "Löwen Frankfurt",
    weekday: "Friday",
    time: "19:30",
  },
  "2025-12-12": {
    opponent: "Pinguins Bremerhaven",
    weekday: "Friday",
    time: "19:30",
  },
  "2025-12-21": {
    opponent: "Adler Mannheim",
    weekday: "Sunday",
    time: "14:00",
  },
  "2025-12-23": {
    opponent: "Iserlohn Roosters",
    weekday: "Tuesday",
    time: "19:30",
  },
  "2025-12-30": {
    opponent: "Straubing Tigers",
    weekday: "Tuesday",
    time: "19:30",
  },
  "2026-01-02": {
    opponent: "EHC Red Bull München",
    weekday: "Friday",
    time: "19:30",
  },
  "2026-01-09": {
    opponent: "Augsburger Panther",
    weekday: "Friday",
    time: "19:30",
  },
  "2026-01-11": {
    opponent: "Löwen Frankfurt",
    weekday: "Sunday",
    time: "14:00",
  },
  "2026-01-18": {
    opponent: "Eisbären Berlin",
    weekday: "Sunday",
    time: "14:00",
  },
  "2026-02-25": {
    opponent: "Schwenninger Wild Wings",
    weekday: "Wednesday",
    time: "19:30",
  },
  "2026-03-04": {
    opponent: "ERC Ingolstadt",
    weekday: "Wednesday",
    time: "19:30",
  },
  "2026-03-08": {
    opponent: "Nürnberg Ice Tigers",
    weekday: "Sunday",
    time: "16:30",
  },
  "2026-03-13": { opponent: "Kölner Haie", weekday: "Friday", time: "19:30" },
};

// Helper function to convert DD.MM.YYYY to YYYY-MM-DD
function convertDateFormat(dateStr: string): string {
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month}-${day}`;
}

// Helper function to determine confidence based on occupancy rate (including season tickets)
function getConfidence(occupancy: number): "high" | "medium" | "low" {
  if (occupancy >= 0.65) return "high"; // 65%+ with season tickets
  if (occupancy >= 0.5) return "medium"; // 50-64% with season tickets
  return "low"; // <50% with season tickets
}

// Transform predictions data to match UpcomingGame interface
const initialUpcomingGames: UpcomingGame[] = predictionsData
  .map((prediction: PredictionData, index: number) => {
    const dateISO = convertDateFormat(prediction.date);
    const scheduleInfo = scheduleMap[dateISO];

    // Only include home games that have schedule information
    if (!scheduleInfo) return null;

    return {
      id: index + 1,
      date: dateISO,
      opponent: scheduleInfo.opponent,
      weekday: scheduleInfo.weekday,
      faceoff: scheduleInfo.time,
      predictedTickets: Math.round(prediction.predicted_attendance),
      predictedRevenue: Math.round(prediction.predicted_revenue),
      occupancy: Math.round(prediction.season_included_occupancy_rate * 100),
      confidence: getConfidence(prediction.season_included_occupancy_rate),
    };
  })
  .filter((game: UpcomingGame | null): game is UpcomingGame => game !== null);

// Calculate KPIs from real data
const totalAttendance = predictionsData.reduce(
  (sum: number, pred: PredictionData) => sum + pred.predicted_attendance,
  0
);
const totalRevenue = predictionsData.reduce(
  (sum: number, pred: PredictionData) => sum + pred.predicted_revenue,
  0
);

// Find lowest occupancy home game
const lowestOccupancyGame = initialUpcomingGames.reduce(
  (lowest: UpcomingGame, game: UpcomingGame) =>
    game.occupancy < lowest.occupancy ? game : lowest
);

// Calculate average occupancy for confidence (including season tickets)
const avgOccupancy =
  predictionsData.reduce(
    (sum: number, pred: PredictionData) =>
      sum + pred.season_included_occupancy_rate,
    0
  ) / predictionsData.length;

const initialKPIs: KPI[] = [
  {
    title: "Forecasted Seasonal Attendance",
    value: Math.round(totalAttendance).toLocaleString("en-US"),
    subtitle: "Day tickets (season tickets counted separately)",
    icon: Users,
    trend: `${initialUpcomingGames.length} home games`,
  },
  {
    title: "Forecasted Seasonal Revenue",
    value: `€${(totalRevenue / 1000).toFixed(1)}K`,
    subtitle: "Day tickets revenue",
    icon: DollarSign,
    trend: `€${Math.round(totalRevenue / initialUpcomingGames.length).toLocaleString("en-US")} avg/game`,
  },
  {
    title: "Lowest Expected Occupancy",
    value: `${lowestOccupancyGame.occupancy}%`,
    subtitle: `${new Date(lowestOccupancyGame.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} vs ${lowestOccupancyGame.opponent}`,
    icon: AlertTriangle,
    trend:
      lowestOccupancyGame.occupancy < 50
        ? "Critical"
        : lowestOccupancyGame.occupancy < 65
          ? "Needs attention"
          : "Monitor",
  },
  {
    title: "Avg. Occupancy Rate",
    value: `${Math.round(avgOccupancy * 100)}%`,
    subtitle: "Season average (incl. season tickets)",
    icon: TrendingUp,
    trend:
      avgOccupancy >= 0.6
        ? "Excellent"
        : avgOccupancy >= 0.5
          ? "Good"
          : "Needs improvement",
  },
];

export const useDashboardStore = create<DashboardStoreState>()(
  devtools(
    (set) => ({
      upcomingGames: initialUpcomingGames,
      kpis: initialKPIs,
      setUpcomingGames: (games) => set({ upcomingGames: games }),
      setKPIs: (kpis) => set({ kpis }),
    }),
    {
      name: "dashboard-store", // Name for Redux DevTools
    }
  )
);
