type FeatureInfo = {
  label: string;
  description: string;
};

// Keep descriptions short and exec-friendly. (These are global drivers, not per-game attributions.)
const FEATURE_INFO: Record<string, FeatureInfo> = {
  is_dec_holiday: {
    label: "December holiday period",
    description: "Games near Christmas/New Year tend to draw significantly more fans.",
  },
  holiday_score: {
    label: "Holiday / school-break proximity",
    description: "Demand rises around holidays and school breaks due to higher availability.",
  },
  opponent_attendance: {
    label: "Opponent popularity",
    description: "High-profile opponents reliably increase attendance.",
  },
  is_top_opponent: {
    label: "Marquee opponent",
    description: "Traditional rivals and top-table teams create extra demand.",
  },
  month_sin: {
    label: "Seasonality (time of year)",
    description: "Attendance varies by month; winter and late-season periods usually perform best.",
  },
  game_progress: {
    label: "Season progress / stakes",
    description: "Later-season games often have higher stakes and higher attendance.",
  },
  weekday_cos: {
    label: "Day-of-week pattern",
    description: "Weekends typically outperform weekdays.",
  },
  weekday_sin: {
    label: "Day-of-week pattern (cyclical)",
    description: "Captures the repeating weekday/weekend rhythm in demand.",
  },
  hour: {
    label: "Kickoff time",
    description: "Afternoon vs evening start times meaningfully change attendance.",
  },
  sunday_boost: {
    label: "Sunday uplift",
    description: "Sunday games tend to draw better due to weekend availability.",
  },
  sunday_opp_adj: {
    label: "Sunday × opponent effect",
    description: "Some opponents draw especially well in Sunday slots.",
  },
  sunday_top: {
    label: "Sunday marquee matchup",
    description: "Top opponents on Sundays can create peak-demand games.",
  },
  distance_log: {
    label: "Travel distance (away fan factor)",
    description: "Longer travel can reduce away-fan presence and overall draw.",
  },
  spieltag: {
    label: "Matchday number",
    description: "Attendance patterns shift across the league schedule (early vs late rounds).",
  },
};

export function getFeatureInfo(featureKey: string): FeatureInfo {
  return (
    FEATURE_INFO[featureKey] ?? {
      label: humanizeFallback(featureKey),
      description: "Model driver (global importance).",
    }
  );
}

function humanizeFallback(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatImportancePercent(value: unknown): number | null {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.round(num * 100);
}


