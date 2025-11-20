"use client";

/**
 * Zustand Store Hooks
 *
 * ⚠️ CLIENT-ONLY: These hooks can only be used in client components.
 * Add "use client" directive to your component file when using these hooks.
 *
 * For type imports in server components, use "@/lib/store/types" instead.
 *
 * @example
 * ```tsx
 * "use client";
 * import { useAnalyticsStore } from "@/lib/store";
 * ```
 */
export { useStore } from "./use-store";
export { useAnalyticsStore } from "./use-analytics-store";
export { useDashboardStore } from "./use-dashboard-store";

