import { tool } from "ai";
import { z } from "zod";
import { getStoreSnapshot } from "@/lib/store/server-data";

const storeSnapshot = getStoreSnapshot();

const DATA_TYPES = [
  "seasonal",
  "seasonalSeries",
  "forecastSeasonal",
  "opponent",
  "weather",
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
          "What you need: 'seasonal' (latest month-level stats), 'seasonalSeries' (all seasons), 'forecastSeasonal' (future monthly projections), 'opponent', 'weather', 'upcomingGames', 'kpis', 'historicalGames' (raw history), 'predictions' (raw model output) or 'all'."
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
