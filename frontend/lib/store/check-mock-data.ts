/**
 * Debug helper to check mock data configuration
 * Run this in browser console: import('./lib/store/check-mock-data')
 */

export function checkMockDataConfig() {
  const checks = {
    "Environment Variable (NEXT_PUBLIC_USE_MOCK_DATA)": process.env.NEXT_PUBLIC_USE_MOCK_DATA,
    "Environment Variable (USE_MOCK_DATA)": process.env.USE_MOCK_DATA,
    "LocalStorage Value": typeof window !== "undefined" ? localStorage.getItem("USE_MOCK_DATA") : "N/A (server)",
    "Current Mock Data Status": typeof window !== "undefined" 
      ? (localStorage.getItem("USE_MOCK_DATA") === "true" || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true")
      : (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || process.env.USE_MOCK_DATA === "true"),
  };

  console.table(checks);
  
  if (checks["Current Mock Data Status"]) {
    console.log("✅ Mock data is ENABLED");
  } else {
    console.log("❌ Mock data is DISABLED");
    console.log("\nTo enable mock data:");
    console.log("1. Add NEXT_PUBLIC_USE_MOCK_DATA=true to .env.local");
    console.log("2. Restart your dev server");
    console.log("3. Or run: localStorage.setItem('USE_MOCK_DATA', 'true')");
  }
  
  return checks;
}

// Auto-run in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  checkMockDataConfig();
}

