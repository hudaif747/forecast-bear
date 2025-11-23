import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";
import type {
  KPI,
  OpponentDataPoint,
  SeasonalDataPoint,
  SeasonalForecastPoint,
  SeasonalSeries,
  UpcomingGame,
  WeatherDataPoint,
} from "@/lib/store/types";
import predictionsDataRaw from "./2025-26_predictions.json" with {
  type: "json",
};
import historicalDataRaw from "./historical-data.json" with { type: "json" };
import mockPredictionsDataRaw from "./mock-2025-26_predictions.json" with {
  type: "json",
};
import mockHistoricalDataRaw from "./mock-historical-data.json" with {
  type: "json",
};

// Toggle to use mock data (set via environment variable)
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  process.env.USE_MOCK_DATA === "true";

// Debug helper (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("[Mock Data Server] USE_MOCK_DATA:", USE_MOCK_DATA);
  console.log("[Mock Data Server] NEXT_PUBLIC_USE_MOCK_DATA:", process.env.NEXT_PUBLIC_USE_MOCK_DATA);
  console.log("[Mock Data Server] USE_MOCK_DATA:", process.env.USE_MOCK_DATA);
}

type HistoricalGame = {
  date: string;
  season: string;
  away_team: string;
  ticket_count: number;
  gross_revenue: number;
};

type PredictionData = {
  date: string;
  predicted_attendance: number;
  predicted_revenue: number;
  occupancy_rate: number;
  season_included_occupancy_rate: number;
};

const historicalGames = (
  USE_MOCK_DATA ? mockHistoricalDataRaw : historicalDataRaw
) as HistoricalGame[];
const predictionGames = (
  USE_MOCK_DATA ? mockPredictionsDataRaw : predictionsDataRaw
) as PredictionData[];

const monthOrder = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

function getMonthAbbr(dateStr: string): string {
  // Handle DD.MM.YYYY format
  if (dateStr.includes(".")) {
    const parts = dateStr.split(".");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const date = new Date(iso);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", { month: "short" });
      }
    }
  }
  // Fallback: try parsing as-is
  const date = new Date(dateStr);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("en-US", { month: "short" });
  }
  // Last resort: return "Unknown"
  return "Unknown";
}

function normalizeOpponentName(opponent: string): string {
  return opponent
    .replace(/\(GER\)/g, "")
    .replace(/Grizzlys Wolfsburg/g, "")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .join(" ");
}

function sortByMonth(a: SeasonalDataPoint, b: SeasonalDataPoint): number {
  return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
}

function processSeasonalSeries(): SeasonalSeries[] {
  const seasonMap: Record<
    string,
    Record<string, { tickets: number; revenue: number }>
  > = {};

  for (const game of historicalGames) {
    if (!game.date || !game.season) {
      continue;
    }
    const season = game.season;
    const month = getMonthAbbr(game.date);

    // Skip invalid months
    if (month === "Unknown") {
      continue;
    }

    if (!seasonMap[season]) {
      seasonMap[season] = {};
    }

    if (!seasonMap[season][month]) {
      seasonMap[season][month] = { tickets: 0, revenue: 0 };
    }

    seasonMap[season][month].tickets += game.ticket_count;
    seasonMap[season][month].revenue += game.gross_revenue;
  }

  const seasons = Object.keys(seasonMap).sort().reverse();

  return seasons.map((season) => ({
    season: `20${season}`,
    points: Object.entries(seasonMap[season])
      .map(([month, totals]) => ({
        month,
        tickets: Math.round(totals.tickets),
        revenue: Math.round(totals.revenue),
      }))
      .sort(sortByMonth),
  }));
}

function processOpponentData(): OpponentDataPoint[] {
  const opponentMap: Record<string, { total: number; count: number }> = {};

  for (const game of historicalGames) {
    if (!game.away_team) {
      continue;
    }
    const opponent = normalizeOpponentName(game.away_team);

    // Skip empty opponent names
    if (!opponent || opponent.trim().length === 0) {
      continue;
    }

    if (!opponentMap[opponent]) {
      opponentMap[opponent] = { total: 0, count: 0 };
    }

    opponentMap[opponent].total += game.ticket_count;
    opponentMap[opponent].count += 1;
  }

  return Object.entries(opponentMap)
    .map(([opponent, data]) => ({
      opponent,
      attendance: Math.round(data.total / data.count),
    }))
    .sort((a, b) => b.attendance - a.attendance);
}

function processForecastSeasonalData(): SeasonalForecastPoint[] {
  const monthTotals: Record<string, number> = {};

  for (const prediction of predictionGames) {
    if (!prediction.date) {
      continue;
    }
    const iso = convertDateFormat(prediction.date);
    if (!iso) {
      continue;
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      continue;
    }
    const monthAbbr = date.toLocaleDateString("en-US", {
      month: "short",
    });
    if (monthAbbr === "Invalid Date") {
      continue;
    }

    monthTotals[monthAbbr] =
      (monthTotals[monthAbbr] ?? 0) + prediction.predicted_attendance;
  }

  return Object.entries(monthTotals)
    .map(([month, total]) => ({
      month,
      forecastTickets: Math.round(total),
    }))
    .sort((a, b) => {
      const indexA = monthOrder.indexOf(a.month);
      const indexB = monthOrder.indexOf(b.month);
      // Handle unknown months by putting them at the end
      if (indexA === -1 && indexB === -1) {
        return 0;
      }
      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }
      return indexA - indexB;
    });
}

function processWeatherData(): WeatherDataPoint[] {
  // Placeholder buckets – weather data not yet tracked historically
  return [
    { condition: "Clear", avgAttendance: 0 },
    { condition: "Cloudy", avgAttendance: 0 },
    { condition: "Rainy", avgAttendance: 0 },
    { condition: "Snow", avgAttendance: 0 },
  ];
}

function convertDateFormat(dateStr: string): string {
  // Validate and convert DD.MM.YYYY to YYYY-MM-DD
  if (!dateStr || typeof dateStr !== "string") {
    return "";
  }
  const parts = dateStr.split(".");
  if (parts.length !== 3) {
    return "";
  }
  const [day, month, year] = parts;
  if (!day || !month || !year) {
    return "";
  }
  // Pad with zeros to ensure proper format
  const paddedDay = day.padStart(2, "0");
  const paddedMonth = month.padStart(2, "0");
  const iso = `${year}-${paddedMonth}-${paddedDay}`;
  // Validate the resulting date
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return iso;
}

function buildUpcomingGames(): UpcomingGame[] {
  const scheduleMap: Record<
    string,
    { opponent: string; weekday: string; time: string }
  > = USE_MOCK_DATA
    ? {
        "2025-09-14": {
          opponent: "Team Alpha",
          weekday: "Sunday",
          time: "16:30",
        },
        "2025-09-26": {
          opponent: "Team Beta",
          weekday: "Friday",
          time: "19:30",
        },
        "2025-10-05": {
          opponent: "Team Gamma",
          weekday: "Sunday",
          time: "14:00",
        },
        "2025-10-12": {
          opponent: "Team Delta",
          weekday: "Sunday",
          time: "16:30",
        },
        "2025-10-19": {
          opponent: "Team Epsilon",
          weekday: "Sunday",
          time: "14:00",
        },
        "2025-10-24": {
          opponent: "Team Zeta",
          weekday: "Friday",
          time: "19:30",
        },
        "2025-10-28": {
          opponent: "Team Eta",
          weekday: "Tuesday",
          time: "19:30",
        },
        "2025-10-30": {
          opponent: "Team Theta",
          weekday: "Thursday",
          time: "19:30",
        },
        "2025-11-14": {
          opponent: "Team Iota",
          weekday: "Friday",
          time: "19:30",
        },
        "2025-11-21": {
          opponent: "Team Kappa",
          weekday: "Friday",
          time: "19:30",
        },
        "2025-11-28": {
          opponent: "Team Lambda",
          weekday: "Friday",
          time: "19:30",
        },
        "2025-12-05": {
          opponent: "Team Mu",
          weekday: "Friday",
          time: "19:30",
        },
        "2025-12-12": {
          opponent: "Team Nu",
          weekday: "Friday",
          time: "19:30",
        },
        "2025-12-21": {
          opponent: "Team Xi",
          weekday: "Sunday",
          time: "14:00",
        },
        "2025-12-23": {
          opponent: "Team Omicron",
          weekday: "Tuesday",
          time: "19:30",
        },
        "2025-12-30": {
          opponent: "Team Pi",
          weekday: "Tuesday",
          time: "19:30",
        },
        "2026-01-02": {
          opponent: "Team Rho",
          weekday: "Friday",
          time: "19:30",
        },
        "2026-01-09": {
          opponent: "Team Sigma",
          weekday: "Friday",
          time: "19:30",
        },
        "2026-01-11": {
          opponent: "Team Tau",
          weekday: "Sunday",
          time: "14:00",
        },
        "2026-01-18": {
          opponent: "Team Upsilon",
          weekday: "Sunday",
          time: "14:00",
        },
        "2026-02-25": {
          opponent: "Team Phi",
          weekday: "Wednesday",
          time: "19:30",
        },
        "2026-03-04": {
          opponent: "Team Chi",
          weekday: "Wednesday",
          time: "19:30",
        },
        "2026-03-08": {
          opponent: "Team Psi",
          weekday: "Sunday",
          time: "16:30",
        },
        "2026-03-13": {
          opponent: "Team Omega",
          weekday: "Friday",
          time: "19:30",
        },
      }
    : {
    "2025-09-14": {
      opponent: "Nürnberg Ice Tigers",
      weekday: "Sunday",
      time: "16:30",
    },
    "2025-09-26": {
      opponent: "Schwenninger Wild Wings",
      weekday: "Friday",
      time: "19:30",
    },
    "2025-10-05": {
      opponent: "Pinguins Bremerhaven",
      weekday: "Sunday",
      time: "14:00",
    },
    "2025-10-12": {
      opponent: "Straubing Tigers",
      weekday: "Sunday",
      time: "16:30",
    },
    "2025-10-19": {
      opponent: "Adler Mannheim",
      weekday: "Sunday",
      time: "14:00",
    },
    "2025-10-24": {
      opponent: "Iserlohn Roosters",
      weekday: "Friday",
      time: "19:30",
    },
    "2025-10-28": {
      opponent: "EHC Red Bull München",
      weekday: "Tuesday",
      time: "19:30",
    },
    "2025-10-30": {
      opponent: "Augsburger Panther",
      weekday: "Thursday",
      time: "19:30",
    },
    "2025-11-14": { opponent: "Kölner Haie", weekday: "Friday", time: "19:30" },
    "2025-11-21": {
      opponent: "ERC Ingolstadt",
      weekday: "Friday",
      time: "19:30",
    },
    "2025-11-28": {
      opponent: "Eisbären Berlin",
      weekday: "Friday",
      time: "19:30",
    },
    "2025-12-05": {
      opponent: "Löwen Frankfurt",
      weekday: "Friday",
      time: "19:30",
    },
    "2025-12-12": {
      opponent: "Pinguins Bremerhaven",
      weekday: "Friday",
      time: "19:30",
    },
    "2025-12-21": {
      opponent: "Adler Mannheim",
      weekday: "Sunday",
      time: "14:00",
    },
    "2025-12-23": {
      opponent: "Iserlohn Roosters",
      weekday: "Tuesday",
      time: "19:30",
    },
    "2025-12-30": {
      opponent: "Straubing Tigers",
      weekday: "Tuesday",
      time: "19:30",
    },
    "2026-01-02": {
      opponent: "EHC Red Bull München",
      weekday: "Friday",
      time: "19:30",
    },
    "2026-01-09": {
      opponent: "Augsburger Panther",
      weekday: "Friday",
      time: "19:30",
    },
    "2026-01-11": {
      opponent: "Löwen Frankfurt",
      weekday: "Sunday",
      time: "14:00",
    },
    "2026-01-18": {
      opponent: "Eisbären Berlin",
      weekday: "Sunday",
      time: "14:00",
    },
    "2026-02-25": {
      opponent: "Schwenninger Wild Wings",
      weekday: "Wednesday",
      time: "19:30",
    },
    "2026-03-04": {
      opponent: "ERC Ingolstadt",
      weekday: "Wednesday",
      time: "19:30",
    },
    "2026-03-08": {
      opponent: "Nürnberg Ice Tigers",
      weekday: "Sunday",
      time: "16:30",
    },
    "2026-03-13": { opponent: "Kölner Haie", weekday: "Friday", time: "19:30" },
  };

  return predictionGames
    .map((prediction, index) => {
      if (!prediction.date) {
        return null;
      }
      const dateISO = convertDateFormat(prediction.date);
      if (!dateISO) {
        return null;
      }
      const scheduleInfo = scheduleMap[dateISO];

      if (!scheduleInfo) {
        // If no schedule match, try to find opponent from historical data
        // by matching the date pattern or using a fallback
        const date = new Date(dateISO);
        if (Number.isNaN(date.getTime())) {
          return null;
        }
        // Fallback: use "Unknown Opponent" if schedule doesn't match
        // This ensures we don't lose data due to schedule mismatches
        const occupancyPercent = Math.round(
          (prediction.season_included_occupancy_rate ??
            prediction.occupancy_rate) * 100
        );
        const seasonOccupancy =
          prediction.season_included_occupancy_rate ??
          prediction.occupancy_rate;
        return {
          id: index + 1,
          date: dateISO,
          opponent: "Unknown Opponent",
          weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
          faceoff: "TBD",
          predictedTickets: Math.round(prediction.predicted_attendance),
          predictedRevenue: Math.round(prediction.predicted_revenue),
          occupancy: occupancyPercent,
          confidence:
            seasonOccupancy >= 0.65
              ? "high"
              : seasonOccupancy >= 0.5
                ? "medium"
                : "low",
        } as UpcomingGame;
      }

      const occupancyPercent = Math.round(
        (prediction.season_included_occupancy_rate ??
          prediction.occupancy_rate) * 100
      );
      const seasonOccupancy =
        prediction.season_included_occupancy_rate ?? prediction.occupancy_rate;

      return {
        id: index + 1,
        date: dateISO,
        opponent: scheduleInfo.opponent,
        weekday: scheduleInfo.weekday,
        faceoff: scheduleInfo.time,
        predictedTickets: Math.round(prediction.predicted_attendance),
        predictedRevenue: Math.round(prediction.predicted_revenue),
        occupancy: occupancyPercent,
        confidence:
          seasonOccupancy >= 0.65
            ? "high"
            : seasonOccupancy >= 0.5
              ? "medium"
              : "low",
      } as UpcomingGame;
    })
    .filter((game): game is UpcomingGame => Boolean(game));
}

function buildKPIs(games: UpcomingGame[]): KPI[] {
  const totalAttendance = predictionGames.reduce(
    (sum, pred) => sum + pred.predicted_attendance,
    0
  );
  const totalRevenue = predictionGames.reduce(
    (sum, pred) => sum + pred.predicted_revenue,
    0
  );

  const lowestOccupancyGame =
    games.length > 0
      ? games.reduce((lowest, game) =>
          game.occupancy < lowest.occupancy ? game : lowest
        )
      : undefined;

  const avgOccupancy =
    predictionGames.reduce(
      (sum, pred) =>
        sum + (pred.season_included_occupancy_rate ?? pred.occupancy_rate),
      0
    ) / predictionGames.length;

  return [
    {
      title: "Forecasted Seasonal Attendance",
      value: Math.round(totalAttendance).toLocaleString("en-US"),
      subtitle: "Day tickets (season tickets counted separately)",
      icon: Users,
      trend: `${games.length} home games`,
    },
    {
      title: "Forecasted Seasonal Revenue",
      value: `€${(totalRevenue / 1000).toFixed(1)}K`,
      subtitle: "Day tickets revenue",
      icon: DollarSign,
      trend: `€${Math.round(
        totalRevenue / Math.max(1, games.length)
      ).toLocaleString("en-US")} avg/game`,
    },
    {
      title: "Lowest Expected Occupancy",
      value: `${lowestOccupancyGame?.occupancy ?? 0}%`,
      subtitle: lowestOccupancyGame
        ? `${new Date(lowestOccupancyGame.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} vs ${lowestOccupancyGame.opponent}`
        : "No games scheduled",
      icon: AlertTriangle,
      trend:
        (lowestOccupancyGame?.occupancy ?? 0) < 50
          ? "Critical"
          : (lowestOccupancyGame?.occupancy ?? 0) < 65
            ? "Needs attention"
            : "Monitor",
    },
    {
      title: "Avg. Occupancy Rate",
      value: `${Math.round(avgOccupancy * 100)}%`,
      subtitle: "Season average (incl. season tickets)",
      icon: TrendingUp,
      trend:
        avgOccupancy >= 0.6
          ? "Excellent"
          : avgOccupancy >= 0.5
            ? "Good"
            : "Needs improvement",
    },
  ];
}

const seasonalSeriesData = processSeasonalSeries();
const analyticsSnapshot = {
  seasonalSeries: seasonalSeriesData,
  seasonalData: seasonalSeriesData[0]?.points ?? [],
  forecastSeasonalData: processForecastSeasonalData(),
  opponentData: processOpponentData(),
  weatherData: processWeatherData(),
};

const upcomingGames = buildUpcomingGames();
const dashboardSnapshot = {
  upcomingGames,
  kpis: buildKPIs(upcomingGames),
};

export type AnalyticsSnapshot = typeof analyticsSnapshot;
export type DashboardSnapshot = typeof dashboardSnapshot;

export function getStoreSnapshot() {
  return {
    analytics: analyticsSnapshot,
    dashboard: {
      ...dashboardSnapshot,
      kpis: dashboardSnapshot.kpis.map(({ icon, ...rest }) => rest),
    },
    historicalGames,
    predictions: predictionGames,
  };
}

export {
  analyticsSnapshot,
  dashboardSnapshot,
  historicalGames,
  predictionGames,
};
