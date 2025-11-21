import { tool } from "ai";
import { z } from "zod";

export const generateForecast = () =>
  tool({
    description:
      "Generate a forecast with predictions and explanations for upcoming games. This tool returns structured forecast data that will be displayed inline in the chat. Use this when the user asks for predictions, forecasts, rankings, top N matches, analysis, or visualizations of upcoming games. The forecast includes: 1) Forecast data for upcoming games (filtered if requested), 2) Explanations for each prediction based on factors like opponent strength, historical attendance, revenue trends, weather patterns, and weekday effects, 3) Charts to visualize the data. IMPORTANT: Always include charts when the user asks for visualizations, rankings, or comparisons. When the user requests filtered data (e.g., 'attendance < 4000'), you MUST filter the forecasts array to only include matching games.",
    inputSchema: z.object({
      title: z
        .string()
        .describe(
          "The title of the forecast (e.g., '5-Game Attendance Forecast', 'Games with Low Attendance')"
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
        .describe(
          "Array of forecast predictions for each upcoming game. IMPORTANT: If the user requests filtered data (e.g., 'attendance < 4000'), only include games that match the filter criteria in this array."
        ),
      charts: z
        .array(
          z.object({
            type: z.enum(["bar", "line", "area"]),
            xKey: z.string(),
            yKey: z.string(),
            title: z.string(),
            filter: z
              .object({
                field: z
                  .string()
                  .describe(
                    "The field to filter on (e.g., 'predictedTickets', 'predictedRevenue', 'occupancy')"
                  ),
                operator: z
                  .enum(["<", ">", "<=", ">=", "==", "!="])
                  .describe("The comparison operator"),
                value: z.number().describe("The value to compare against"),
              })
              .optional()
              .describe(
                "Optional filter for chart data. Use this when the user requests filtered visualizations (e.g., 'show me games with attendance < 4000'). The filter should match the filter applied to the forecasts array."
              ),
          })
        )
        .optional()
        .describe(
          "Array of chart configurations to visualize the forecast. Always include charts when the user asks for visualizations, rankings, or comparisons. When the user requests filtered data, include the same filter in the chart configuration."
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
