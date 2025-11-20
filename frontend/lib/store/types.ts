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
export type { StoreState } from "./use-store";
export type {
  AnalyticsStoreState,
  SeasonalDataPoint,
  OpponentDataPoint,
  WeatherDataPoint,
} from "./use-analytics-store";
export type {
  DashboardStoreState,
  UpcomingGame,
  KPI,
} from "./use-dashboard-store";

