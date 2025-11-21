import { tool } from "ai";
import { z } from "zod";

export const generateForecast = () =>
  tool({
    description:
      "Generate a forecast with predictions and explanations for upcoming games. This tool returns structured forecast data that will be displayed inline in the chat. Use this when the user asks for predictions, forecasts, or analysis of upcoming games. The forecast includes: 1) Forecast data for upcoming games, 2) Explanations for each prediction based on factors like opponent strength, historical attendance, revenue trends, weather patterns, and weekday effects, 3) Visual charts showing the forecast.",
    inputSchema: z.object({
      title: z
        .string()
        .describe(
          "The title of the forecast (e.g., '5-Game Attendance Forecast')"
        ),
      summary: z
        .string()
        .describe("A summary of the overall forecast and key insights"),
      forecasts: z
        .array(
          z.object({
            gameId: z.number(),
            date: z.string(),
            opponent: z.string(),
            predictedTickets: z.number(),
            predictedRevenue: z.number(),
            occupancy: z.number(),
            confidence: z.enum(["high", "medium", "low"]),
            explanations: z.object({
              opponent: z.string(),
              revenue: z.string(),
              weather: z.string().optional(),
              weekday: z.string(),
              overall: z.string(),
            }),
          })
        )
        .describe("Array of forecast predictions for each upcoming game"),
      charts: z
        .array(
          z.object({
            type: z.enum(["bar", "line", "area"]),
            xKey: z.string(),
            yKey: z.string(),
            title: z.string(),
          })
        )
        .optional()
        .describe(
          "Optional array of chart configurations to visualize the forecast"
        ),
    }),
    execute: ({ title, summary, forecasts, charts }) => {
      // Return structured data that will be rendered inline
      return {
        type: "forecast",
        title,
        summary,
        forecasts,
        charts: charts || [],
      };
    },
  });
