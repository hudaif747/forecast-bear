"use client";

import { tool } from "ai";
import { z } from "zod";

// Mock store data - in a real app, this would come from an API or database
const mockSeasonalData = [
  { month: "Sep", tickets: 3200, revenue: 128_000 },
  { month: "Oct", tickets: 3800, revenue: 152_000 },
  { month: "Nov", tickets: 4100, revenue: 164_000 },
  { month: "Dec", tickets: 4350, revenue: 174_000 },
  { month: "Jan", tickets: 3900, revenue: 156_000 },
  { month: "Feb", tickets: 4200, revenue: 168_000 },
  { month: "Mar", tickets: 4500, revenue: 180_000 },
];

const mockOpponentData = [
  { opponent: "Berlin", attendance: 4300 },
  { opponent: "München", attendance: 4450 },
  { opponent: "Mannheim", attendance: 3900 },
  { opponent: "Köln", attendance: 3200 },
  { opponent: "Ingolstadt", attendance: 3600 },
  { opponent: "Augsburg", attendance: 3450 },
  { opponent: "Straubing", attendance: 3850 },
];

const mockWeatherData = [
  { condition: "Clear", avgAttendance: 4100 },
  { condition: "Cloudy", avgAttendance: 3900 },
  { condition: "Rainy", avgAttendance: 3400 },
  { condition: "Snow", avgAttendance: 3600 },
];

const mockUpcomingGames = [
  {
    id: 1,
    date: "2025-11-22",
    opponent: "Eisbären Berlin",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 4200,
    predictedRevenue: 168_000,
    occupancy: 93,
    confidence: "high" as const,
  },
  {
    id: 2,
    date: "2025-11-25",
    opponent: "Adler Mannheim",
    weekday: "Tuesday",
    faceoff: "19:30",
    predictedTickets: 3800,
    predictedRevenue: 152_000,
    occupancy: 84,
    confidence: "medium" as const,
  },
  {
    id: 3,
    date: "2025-11-29",
    opponent: "Red Bull München",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 4350,
    predictedRevenue: 174_000,
    occupancy: 96,
    confidence: "high" as const,
  },
  {
    id: 4,
    date: "2025-12-03",
    opponent: "Kölner Haie",
    weekday: "Wednesday",
    faceoff: "19:30",
    predictedTickets: 3200,
    predictedRevenue: 128_000,
    occupancy: 71,
    confidence: "low" as const,
  },
  {
    id: 5,
    date: "2025-12-06",
    opponent: "Straubing Tigers",
    weekday: "Saturday",
    faceoff: "19:30",
    predictedTickets: 3950,
    predictedRevenue: 158_000,
    occupancy: 87,
    confidence: "medium" as const,
  },
];

export const getStoreData = () =>
  tool({
    description:
      "Access store data including analytics (seasonal trends, opponent attendance, weather impact) and dashboard data (upcoming games with predictions). Use this to understand historical patterns before generating forecasts.",
    inputSchema: z.object({
      dataType: z
        .enum(["seasonal", "opponent", "weather", "upcomingGames", "all"])
        .describe(
          "The type of data to retrieve: 'seasonal' for monthly trends, 'opponent' for opponent attendance, 'weather' for weather impact, 'upcomingGames' for current predictions, or 'all' for everything"
        ),
    }),
    execute: ({ dataType }) => {
      let data: unknown;

      if (dataType === "seasonal") {
        data = mockSeasonalData;
      } else if (dataType === "opponent") {
        data = mockOpponentData;
      } else if (dataType === "weather") {
        data = mockWeatherData;
      } else if (dataType === "upcomingGames") {
        data = mockUpcomingGames;
      } else {
        data = {
          seasonal: mockSeasonalData,
          opponent: mockOpponentData,
          weather: mockWeatherData,
          upcomingGames: mockUpcomingGames,
        };
      }

      return {
        dataType,
        data,
        message: `Retrieved ${dataType} data from store. Use this data to understand patterns and generate informed forecasts.`,
      };
    },
  });
