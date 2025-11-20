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

export interface SeasonalDataPoint {
  month: string;
  tickets: number;
  revenue: number;
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
  seasonalData: SeasonalDataPoint[];
  opponentData: OpponentDataPoint[];
  weatherData: WeatherDataPoint[];
  // Actions to update analytics data
  setSeasonalData: (data: SeasonalDataPoint[]) => void;
  setOpponentData: (data: OpponentDataPoint[]) => void;
  setWeatherData: (data: WeatherDataPoint[]) => void;
}

// Mock historical data
const initialSeasonalData: SeasonalDataPoint[] = [
  { month: "Sep", tickets: 3200, revenue: 128_000 },
  { month: "Oct", tickets: 3800, revenue: 152_000 },
  { month: "Nov", tickets: 4100, revenue: 164_000 },
  { month: "Dec", tickets: 4350, revenue: 174_000 },
  { month: "Jan", tickets: 3900, revenue: 156_000 },
  { month: "Feb", tickets: 4200, revenue: 168_000 },
  { month: "Mar", tickets: 4500, revenue: 180_000 },
];

const initialOpponentData: OpponentDataPoint[] = [
  { opponent: "Berlin", attendance: 4300 },
  { opponent: "München", attendance: 4450 },
  { opponent: "Mannheim", attendance: 3900 },
  { opponent: "Köln", attendance: 3200 },
  { opponent: "Ingolstadt", attendance: 3600 },
  { opponent: "Augsburg", attendance: 3450 },
  { opponent: "Straubing", attendance: 3850 },
];

const initialWeatherData: WeatherDataPoint[] = [
  { condition: "Clear", avgAttendance: 4100 },
  { condition: "Cloudy", avgAttendance: 3900 },
  { condition: "Rainy", avgAttendance: 3400 },
  { condition: "Snow", avgAttendance: 3600 },
];

export const useAnalyticsStore = create<AnalyticsStoreState>()(
  devtools(
    (set) => ({
      seasonalData: initialSeasonalData,
      opponentData: initialOpponentData,
      weatherData: initialWeatherData,
      setSeasonalData: (data) => set({ seasonalData: data }),
      setOpponentData: (data) => set({ opponentData: data }),
      setWeatherData: (data) => set({ weatherData: data }),
    }),
    {
      name: "analytics-store", // Name for Redux DevTools
    },
  ),
);

