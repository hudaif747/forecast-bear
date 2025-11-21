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

// Mock historical data
const initialSeasonalSeries: SeasonalSeries[] = [
  {
    season: "2023-24",
    points: [
      { month: "Sep", tickets: 3100, revenue: 124_000 },
      { month: "Oct", tickets: 3600, revenue: 144_000 },
      { month: "Nov", tickets: 4000, revenue: 160_000 },
      { month: "Dec", tickets: 4200, revenue: 168_000 },
      { month: "Jan", tickets: 3800, revenue: 152_000 },
      { month: "Feb", tickets: 4100, revenue: 164_000 },
      { month: "Mar", tickets: 4400, revenue: 176_000 },
    ],
  },
  {
    season: "2022-23",
    points: [
      { month: "Sep", tickets: 2950, revenue: 118_000 },
      { month: "Oct", tickets: 3400, revenue: 136_000 },
      { month: "Nov", tickets: 3650, revenue: 146_000 },
      { month: "Dec", tickets: 3900, revenue: 156_000 },
      { month: "Jan", tickets: 3600, revenue: 144_000 },
      { month: "Feb", tickets: 3850, revenue: 154_000 },
      { month: "Mar", tickets: 4050, revenue: 162_000 },
    ],
  },
];

const initialSeasonalData: SeasonalDataPoint[] = initialSeasonalSeries[0].points;

const initialForecastSeasonalData: SeasonalForecastPoint[] = [
  { month: "Sep", forecastTickets: 3350 },
  { month: "Oct", forecastTickets: 3950 },
  { month: "Nov", forecastTickets: 4250 },
  { month: "Dec", forecastTickets: 4400 },
  { month: "Jan", forecastTickets: 4050 },
  { month: "Feb", forecastTickets: 4325 },
  { month: "Mar", forecastTickets: 4625 },
  { month: "Apr", forecastTickets: 4700 },
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
