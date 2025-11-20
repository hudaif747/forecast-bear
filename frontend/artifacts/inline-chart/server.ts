import { streamObject } from "ai";
import { z } from "zod";
import { myProvider } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

const inlineChartPrompt = `You are a content generator that creates text responses with inline charts embedded within the text. 

Generate content that includes:
1. **Text Content**: Natural language explanation, analysis, or description
2. **Charts**: Visual charts embedded inline with the text to illustrate the data

**IMPORTANT:**
- DO NOT use markdown image syntax (e.g., \`![alt](url)\`) in the text - images are blocked
- ONLY create charts using the chart configuration in the JSON output
- Charts are rendered as interactive React components, not as images

The charts should be displayed inline with the text, not in a separate window. Use charts to visualize:
- Upcoming games data (revenue, tickets, occupancy)
- Seasonal trends
- Opponent comparisons
- Any relevant analytics

Output format:
{
  "text": string (markdown formatted text with explanations - NO image markdown),
  "charts": [
    {
      "type": "bar" | "line" | "area",
      "dataSource": "seasonal" | "opponent" | "weather" | "upcomingGames",
      "xKey": string,
      "yKey": string,
      "title": string
    }
  ]
}

The text should naturally flow and reference the charts. Charts will be rendered inline after the text as interactive components.`;

export const inlineChartDocumentHandler = createDocumentHandler<"inline-chart">(
  {
    kind: "inline-chart",
    onCreateDocument: async ({ title, dataStream }) => {
      let draftContent = "";

      const { fullStream } = streamObject({
        model: myProvider.languageModel("artifact-model"),
        system: inlineChartPrompt,
        prompt: title,
        schema: z.object({
          text: z.string(),
          charts: z.array(
            z.object({
              type: z.enum(["bar", "line", "area"]),
              dataSource: z.enum([
                "seasonal",
                "opponent",
                "weather",
                "upcomingGames",
              ]),
              xKey: z.string(),
              yKey: z.string(),
              title: z.string(),
            })
          ),
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
                type: "data-inlineChartDelta",
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
        system: `${inlineChartPrompt}\n\nCurrent content:\n${document.content}\n\nUpdate based on: ${description}`,
        prompt: description,
        schema: z.object({
          text: z.string(),
          charts: z.array(
            z.object({
              type: z.enum(["bar", "line", "area"]),
              dataSource: z.enum([
                "seasonal",
                "opponent",
                "weather",
                "upcomingGames",
              ]),
              xKey: z.string(),
              yKey: z.string(),
              title: z.string(),
            })
          ),
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
                type: "data-inlineChartDelta",
                data: configJson,
                transient: true,
              });
            }
          }
        }
      }

      return draftContent;
    },
  }
);
