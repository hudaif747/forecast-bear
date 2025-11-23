import { openai } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": openai("gpt-5.1"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openai("gpt-5.1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openai("gpt-5.1"),
      },
    });
