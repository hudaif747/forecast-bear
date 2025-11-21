/**
 * Zustand Store Types
 *
 * ✅ SAFE FOR SERVER COMPONENTS: These are type-only exports.
 * Use these in server components, API routes, and server actions.
 *
 * For hooks (client components only), use "@/lib/store" instead.
 *
 * @example
 * ```tsx
 * import type { AnalyticsStoreState } from "@/lib/store/types";
 * ```
 */

export type {
  AnalyticsStoreState,
  OpponentDataPoint,
  SeasonalDataPoint,
  WeatherDataPoint,
} from "./use-analytics-store";
export type {
  DashboardStoreState,
  KPI,
  UpcomingGame,
} from "./use-dashboard-store";
export type { StoreState } from "./use-store";
