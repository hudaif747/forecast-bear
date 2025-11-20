"use client";

/**
 * Dashboard Store
 *
 * ⚠️ CLIENT-ONLY: This file must have "use client" directive.
 * Only import the hook from "@/lib/store", not this file directly.
 * For types, import from "@/lib/store/types".
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";

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

// Mock data for upcoming games
const initialUpcomingGames: UpcomingGame[] = [
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

const initialKPIs: KPI[] = [
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
    },
  ),
);

