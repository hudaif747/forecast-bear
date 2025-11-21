import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

// API Routes
export const API_BASE_PATH = "/dashboard/assistant/chat/api";
export const API_ROUTES = {
  chat: `${API_BASE_PATH}/chat`,
  document: `${API_BASE_PATH}/document`,
  vote: `${API_BASE_PATH}/vote`,
  history: `${API_BASE_PATH}/history`,
  files: {
    upload: `${API_BASE_PATH}/files/upload`,
  },
  suggestions: `${API_BASE_PATH}/suggestions`,
} as const;

// Page Routes
export const PAGE_ROUTES = {
  assistant: "/dashboard/assistant",
  chat: (id: string) => `/dashboard/assistant/chat/${id}`,
} as const;
