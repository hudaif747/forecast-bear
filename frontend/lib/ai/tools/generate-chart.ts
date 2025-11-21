import { tool } from "ai";
import { z } from "zod";

export const generateChart = () =>
  tool({
    description:
      "Generate a chart to display inline in the chat. Use this when the user asks for visualizations, charts, or graphs. The chart will appear directly in the chat response. IMPORTANT: When you use generateForecast for rankings, top N queries, comparisons, or analysis, you should ALSO use this tool to create complementary visualizations. Always use both tools together to create report-like responses. When the user requests filtered data (e.g., 'games with attendance < 4000'), include filter parameters to show only matching data.",
    inputSchema: z.object({
      title: z
        .string()
        .describe(
          "The title of the chart (e.g., 'Monthly Revenue Trend', 'Upcoming Games Revenue Forecast', 'Games with Low Attendance')"
        ),
      chartType: z
        .enum(["bar", "line", "area"])
        .describe("The type of chart to generate"),
      dataSource: z
        .enum(["seasonal", "opponent", "weather", "upcomingGames"])
        .describe(
          "The data source to use: 'seasonal' for monthly data, 'opponent' for opponent attendance, 'weather' for weather-based attendance, 'upcomingGames' for predicted data from upcoming games (revenue, tickets, occupancy)"
        ),
      xKey: z
        .string()
        .describe(
          "The key for the x-axis (e.g., 'month', 'opponent', 'condition', 'date', 'opponent')"
        ),
      yKey: z
        .string()
        .describe(
          "The key for the y-axis (e.g., 'tickets', 'revenue', 'attendance', 'predictedRevenue', 'predictedTickets', 'occupancy')"
        ),
      filter: z
        .object({
          field: z
            .string()
            .describe(
              "The field to filter on (e.g., 'predictedTickets', 'predictedRevenue', 'occupancy', 'tickets', 'revenue')"
            ),
          operator: z
            .enum(["<", ">", "<=", ">=", "==", "!="])
            .describe("The comparison operator"),
          value: z.number().describe("The value to compare against"),
        })
        .optional()
        .describe(
          "Optional filter to apply to the data. Use this when the user requests filtered data (e.g., 'attendance < 4000', 'revenue > 150000'). If no filter is requested, omit this parameter."
        ),
    }),
    execute: ({ title, chartType, dataSource, xKey, yKey, filter }) => {
      // Return structured data that will be rendered inline
      return {
        type: "chart",
        title,
        chartType,
        dataSource,
        xKey,
        yKey,
        filter: filter || undefined,
      };
    },
  });
