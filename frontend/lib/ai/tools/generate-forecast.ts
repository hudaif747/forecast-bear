import { tool } from "ai";
import { z } from "zod";
import type { Session } from "next-auth";
import type { UIMessageStreamWriter } from "ai";
import type { ChatMessage } from "@/lib/types";
import { documentHandlersByArtifactKind } from "@/lib/artifacts/server";
import { generateUUID } from "@/lib/utils";

type GenerateForecastProps = {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
};

export const generateForecast = ({
  session,
  dataStream,
}: GenerateForecastProps) =>
  tool({
    description:
      "Generate a forecast with predictions and explanations. This tool creates a forecast document that includes: 1) Forecast data for upcoming games, 2) Explanations for each prediction based on factors like opponent strength, historical attendance, revenue trends, weather patterns, and weekday effects, 3) Visual charts showing the forecast. Use this after analyzing store data to create informed predictions.",
    inputSchema: z.object({
      title: z
        .string()
        .describe(
          "The title of the forecast (e.g., '5-Game Attendance Forecast')"
        ),
      explanation: z
        .string()
        .describe(
          "A detailed explanation of the forecast methodology and key factors considered"
        ),
    }),
    execute: async ({ title, explanation }) => {
      const id = generateUUID();

      // Create a forecast artifact
      dataStream.write({
        type: "data-kind",
        data: "forecast",
        transient: true,
      });

      dataStream.write({
        type: "data-id",
        data: id,
        transient: true,
      });

      dataStream.write({
        type: "data-title",
        data: title,
        transient: true,
      });

      dataStream.write({
        type: "data-clear",
        data: null,
        transient: true,
      });

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === "forecast"
      );

      if (!documentHandler) {
        throw new Error("No document handler found for kind: forecast");
      }

      await documentHandler.onCreateDocument({
        id,
        title: `${title} | Explanation: ${explanation}`,
        dataStream,
        session,
      });

      dataStream.write({ type: "data-finish", data: null, transient: true });

      return {
        id,
        title,
        kind: "forecast",
        content: `Forecast document created: ${title}. The forecast includes predictions and explanations based on store data analysis.`,
      };
    },
  });

