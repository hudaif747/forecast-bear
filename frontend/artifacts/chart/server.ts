import { streamObject } from "ai";
import { z } from "zod";
import { myProvider } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

const chartPrompt = `You are a chart configuration generator. Generate a JSON configuration for a chart based on the user's request.

The title may contain chart configuration in the format: "Title | Type: chartType | Data: dataSource | X: xKey | Y: yKey | Y2: y2Key"

The configuration should be a valid JSON object with the following structure:
{
  "type": "bar" | "line" | "area" | "pie",
  "dataSource": "seasonal" | "opponent" | "weather",
  "xKey": string (e.g., "month", "opponent", "condition"),
  "yKey": string (e.g., "tickets", "revenue", "attendance"),
  "y2Key": string | undefined (optional second y-axis),
  "title": string (just the chart title, without configuration)
}

Available data sources:
- "seasonal": { month: string, tickets: number, revenue: number }
- "opponent": { opponent: string, attendance: number }
- "weather": { condition: string, avgAttendance: number }

Parse the title to extract chart configuration, or infer from the user's request.`;

export const chartDocumentHandler = createDocumentHandler<"chart">({
  kind: "chart",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: chartPrompt,
      prompt: title,
      schema: z.object({
        type: z.enum(["bar", "line", "area", "pie"]),
        dataSource: z.enum(["seasonal", "opponent", "weather"]),
        xKey: z.string(),
        yKey: z.string(),
        y2Key: z.string().optional(),
        title: z.string(),
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
              type: "data-chartDelta",
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
      system: `${chartPrompt}\n\nCurrent configuration:\n${document.content}\n\nUpdate based on: ${description}`,
      prompt: description,
      schema: z.object({
        type: z.enum(["bar", "line", "area", "pie"]),
        dataSource: z.enum(["seasonal", "opponent", "weather"]),
        xKey: z.string(),
        yKey: z.string(),
        y2Key: z.string().optional(),
        title: z.string(),
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
              type: "data-chartDelta",
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
