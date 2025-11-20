import type { UIMessageStreamWriter } from "ai";
import { tool } from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import { documentHandlersByArtifactKind } from "@/lib/artifacts/server";
import type { ChatMessage } from "@/lib/types";
import { generateUUID } from "@/lib/utils";

type GenerateChartProps = {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
};

export const generateChart = ({ session, dataStream }: GenerateChartProps) =>
  tool({
    description:
      "Generate charts inline with text explanations. This tool creates an inline-chart document that displays charts embedded within text content. Available data sources: 'seasonal' (monthly tickets and revenue), 'opponent' (attendance by opponent), 'weather' (average attendance by weather condition), 'upcomingGames' (predicted revenue, tickets, and occupancy for upcoming games). Chart types: 'bar', 'line', 'area'. Charts will be displayed inline with the text explanation, not in a separate window.",
    inputSchema: z.object({
      title: z
        .string()
        .describe(
          "The title/description for the content (e.g., 'Revenue Overview for Upcoming Games')"
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
        .optional()
        .describe(
          "The key for the x-axis (e.g., 'month', 'opponent', 'condition', 'date')"
        ),
      yKey: z
        .string()
        .optional()
        .describe(
          "The key for the y-axis (e.g., 'tickets', 'revenue', 'attendance', 'predictedRevenue', 'predictedTickets', 'occupancy')"
        ),
    }),
    execute: async ({ title, chartType, dataSource, xKey, yKey }) => {
      const id = generateUUID();

      // Create a descriptive title that includes chart configuration
      // The server-side inline-chart handler will parse this and generate the appropriate config
      const chartTitle = `${title} | Chart: ${chartType} | Data: ${dataSource} | X: ${xKey || "auto"} | Y: ${yKey || "auto"}`;

      dataStream.write({
        type: "data-kind",
        data: "inline-chart",
        transient: true,
      });

      dataStream.write({
        type: "data-id",
        data: id,
        transient: true,
      });

      dataStream.write({
        type: "data-title",
        data: chartTitle,
        transient: true,
      });

      dataStream.write({
        type: "data-clear",
        data: null,
        transient: true,
      });

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === "inline-chart"
      );

      if (!documentHandler) {
        throw new Error("No document handler found for kind: inline-chart");
      }

      await documentHandler.onCreateDocument({
        id,
        title: chartTitle,
        dataStream,
        session,
      });

      dataStream.write({ type: "data-finish", data: null, transient: true });

      return {
        id,
        title: chartTitle,
        kind: "inline-chart",
        content: `Inline chart document created for ${title}. The chart will display ${dataSource} data as a ${chartType} chart, embedded inline with text explanations.`,
      };
    },
  });
