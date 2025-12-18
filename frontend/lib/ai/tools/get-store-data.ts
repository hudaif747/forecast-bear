import { tool } from "ai";
import { z } from "zod";
import { getStoreSnapshot } from "@/lib/store/server-data";
import { formatImportancePercent, getFeatureInfo } from "@/lib/ai/feature-importance";

const storeSnapshot = getStoreSnapshot();

const DATA_TYPES = [
  "seasonal",
  "seasonalSeries",
  "forecastSeasonal",
  "opponent",
  "weather",
  "featureImportance",
  "upcomingGames",
  "kpis",
  "historicalGames",
  "predictions",
  "all",
] as const;

export const getStoreData = () =>
  tool({
    description:
      "Access the Grizzlys data lake. Specify which dataset you need (e.g. 'upcomingGames', 'seasonalSeries', 'opponent'). Use the smallest subset to reduce usage. Use this before forecasting so you cite real data.",
    inputSchema: z.object({
      dataType: z
        .enum(DATA_TYPES)
        .describe(
          "What you need: 'seasonal' (latest month-level stats), 'seasonalSeries' (all seasons), 'forecastSeasonal' (future monthly projections), 'opponent', 'weather', 'featureImportance' (global model drivers + MAE/MAPE), 'upcomingGames', 'kpis', 'historicalGames' (raw history), 'predictions' (raw model output) or 'all'."
        ),
    }),
    execute: ({ dataType }) => {
      let data: unknown;

      switch (dataType) {
        case "seasonal":
          data = storeSnapshot.analytics.seasonalData;
          break;
        case "seasonalSeries":
          data = storeSnapshot.analytics.seasonalSeries;
          break;
        case "forecastSeasonal":
          data = storeSnapshot.analytics.forecastSeasonalData;
          break;
        case "opponent":
          data = storeSnapshot.analytics.opponentData;
          break;
        case "weather":
          data = storeSnapshot.analytics.weatherData;
          break;
        case "featureImportance":
          {
            const raw = storeSnapshot.analytics.featureImportance as any;
            const entries: Array<[string, unknown]> = Object.entries(
              raw?.feature_importance ?? {}
            );
            const topDrivers = entries
              .sort(([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0))
              .slice(0, 8)
              .map(([key, value]) => {
                const info = getFeatureInfo(key);
                return {
                  label: info.label,
                  description: info.description,
                  importancePercent: formatImportancePercent(value),
                };
              });

            data = {
              model: raw?.model,
              mae: raw?.mae,
              mape: raw?.mape,
              topDrivers,
              // Keep raw keys available for debugging, but the assistant should not show them to execs.
              rawFeatureImportance: raw?.feature_importance ?? {},
            };
          }
          break;
        case "upcomingGames":
          data = storeSnapshot.dashboard.upcomingGames;
          break;
        case "kpis":
          data = storeSnapshot.dashboard.kpis;
          break;
        case "historicalGames":
          data = storeSnapshot.historicalGames;
          break;
        case "predictions":
          data = storeSnapshot.predictions;
          break;
        case "all":
        default:
          data = storeSnapshot;
          break;
      }

      return {
        dataType,
        data,
        message: `Retrieved ${dataType} data from the live store snapshot. Request only what you need to keep usage low.`,
      };
    },
  });
