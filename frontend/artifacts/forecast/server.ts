import { streamObject } from "ai";
import { z } from "zod";
import { myProvider } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

const forecastPrompt = `You are a forecast generator for sports attendance predictions. Generate a comprehensive forecast document that includes:

1. **Forecast Data**: Predictions for upcoming games with:
   - Game date and opponent
   - Predicted tickets/attendance
   - Predicted revenue
   - Occupancy percentage
   - Confidence level (high/medium/low)

2. **Explanations**: For each game prediction, explain WHY it's predicted that way based on:
   - Opponent strength (historical attendance against this opponent)
   - Revenue trends (seasonal patterns)
   - Weather patterns (if applicable)
   - Weekday effects (weekends vs weekdays)
   - Historical patterns from the store data

3. **Chart Configuration (REQUIRED)**: You MUST include at least 2-3 charts to visualize the forecast data for business executives:
   - A bar chart showing predicted tickets/attendance by opponent (xKey: "opponent", yKey: "predictedTickets", title: "Predicted Attendance by Opponent")
   - A line or area chart showing predicted revenue over time (xKey: "date", yKey: "predictedRevenue", title: "Revenue Forecast Trend")
   - Optionally: A bar chart showing occupancy percentage (xKey: "opponent", yKey: "occupancy", title: "Occupancy Rate by Game")
   
   Charts are essential for executive insights - ALWAYS include them in your response.

The title may contain explanation context. Parse it and generate a comprehensive forecast JSON with predictions, explanations, and charts.

Output format:
{
  "forecasts": [
    {
      "gameId": number,
      "date": string,
      "opponent": string,
      "predictedTickets": number,
      "predictedRevenue": number,
      "occupancy": number,
      "confidence": "high" | "medium" | "low",
      "explanations": {
        "opponent": string (explanation based on opponent data),
        "revenue": string (explanation based on revenue trends),
        "weather": string (explanation based on weather patterns if applicable),
        "weekday": string (explanation based on day of week),
        "overall": string (summary explanation)
      }
    }
  ],
  "summary": string (overall forecast summary),
  "charts": [
    {
      "type": "bar" | "line" | "area",
      "dataSource": "forecast",
      "xKey": string,
      "yKey": string,
      "title": string
    }
  ]
}`;

export const forecastDocumentHandler = createDocumentHandler<"forecast">({
  kind: "forecast",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: forecastPrompt,
      prompt: title,
      schema: z.object({
        forecasts: z.array(
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
        ),
        summary: z.string(),
        charts: z
          .array(
            z.object({
              type: z.enum(["bar", "line", "area"]),
              dataSource: z.literal("forecast"),
              xKey: z.string(),
              yKey: z.string(),
              title: z.string(),
            })
          )
          .min(1, "At least one chart is required for executive insights"),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;

        if (object) {
          const configJson = JSON.stringify(object, null, 2);

          if (configJson !== draftContent) {
            draftContent = configJson;

            dataStream.write({
              type: "data-forecastDelta",
              data: configJson,
              transient: true,
            });
          }
        }
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: `${forecastPrompt}\n\nCurrent forecast:\n${document.content}\n\nUpdate based on: ${description}`,
      prompt: description,
      schema: z.object({
        forecasts: z.array(
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
        ),
        summary: z.string(),
        charts: z
          .array(
            z.object({
              type: z.enum(["bar", "line", "area"]),
              dataSource: z.literal("forecast"),
              xKey: z.string(),
              yKey: z.string(),
              title: z.string(),
            })
          )
          .min(1, "At least one chart is required for executive insights"),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;

        if (object) {
          const configJson = JSON.stringify(object, null, 2);

          if (configJson !== draftContent) {
            draftContent = configJson;

            dataStream.write({
              type: "data-forecastDelta",
              data: configJson,
              transient: true,
            });
          }
        }
      }
    }

    return draftContent;
  },
});
