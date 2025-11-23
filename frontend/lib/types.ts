import type { InferUITool, UIMessage } from "ai";
import { z } from "zod";
import type { generateForecast } from "./ai/tools/generate-forecast";
import type { getStoreData } from "./ai/tools/get-store-data";
import type { getWeather } from "./ai/tools/get-weather";
import type { AppUsage } from "./usage";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type getStoreDataTool = InferUITool<ReturnType<typeof getStoreData>>;
type generateForecastTool = InferUITool<ReturnType<typeof generateForecast>>;

export type ChatTools = {
  getWeather: weatherTool;
  getStoreData: getStoreDataTool;
  generateForecast: generateForecastTool;
};

export type CustomUIDataTypes = {
  appendMessage: string;
  usage: AppUsage;
  info: { status: string };
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
