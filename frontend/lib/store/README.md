# Zustand Store Usage Guide

## Overview

This directory contains Zustand stores for client-side state management. All stores are client-only and should not be used in server components.

## File Structure

- `index.ts` - Exports hooks only (client-side)
- `types.ts` - Exports types only (safe for server components)
- `use-store.ts` - General app store
- `use-analytics-store.ts` - Analytics data store
- `use-dashboard-store.ts` - Dashboard data store

## Usage Guidelines

### ✅ In Client Components

```typescript
"use client";

import { useAnalyticsStore } from "@/lib/store";

export function MyComponent() {
  const { seasonalData } = useAnalyticsStore();
  // ...
}
```

### ✅ In Server Components (Types Only)

```typescript
// No "use client" needed
import type { AnalyticsStoreState } from "@/lib/store/types";

export async function ServerComponent() {
  // Use types for props, return types, etc.
  const data: AnalyticsStoreState = await fetchData();
  // ...
}
```

### ❌ Common Mistakes to Avoid

1. **Don't import hooks in server components:**
   ```typescript
   // ❌ WRONG - Will cause runtime error
   import { useAnalyticsStore } from "@/lib/store";
   ```

2. **Don't import from individual store files in server components:**
   ```typescript
   // ❌ WRONG
   import type { AnalyticsStoreState } from "@/lib/store/use-analytics-store";
   // ✅ CORRECT - Use types.ts instead
   import type { AnalyticsStoreState } from "@/lib/store/types";
   ```

3. **Don't forget "use client" when using hooks:**
   ```typescript
   // ❌ WRONG - Missing "use client"
   import { useAnalyticsStore } from "@/lib/store";
   
   export function Component() { // ... }
   ```

## Best Practices

1. **Always use `types.ts` for type imports in server components**
2. **Always use `index.ts` for hook imports in client components**
3. **Add `"use client"` directive to any component using hooks**
4. **Keep store logic client-side only**
5. **Use server actions or API routes to fetch initial data, then hydrate stores**

## Mock Data Mode

For demos and LinkedIn videos, you can use mock data instead of real data. Mock data uses anonymized team names (Team Alpha, Team Beta, etc.) and randomized but realistic numbers.

### Enabling Mock Data

**Option 1: Environment Variable (Recommended for Production)**
```bash
# In your .env.local or .env file
NEXT_PUBLIC_USE_MOCK_DATA=true
# OR
USE_MOCK_DATA=true
```

**Option 2: Browser LocalStorage (For Quick Testing)**
```javascript
// In browser console
localStorage.setItem("USE_MOCK_DATA", "true");
// Then refresh the page
```

**Option 3: Server-Side Only**
```bash
# For server-side rendering only
USE_MOCK_DATA=true
```

### Disabling Mock Data

```bash
# Remove or set to false
NEXT_PUBLIC_USE_MOCK_DATA=false
# OR remove from localStorage
localStorage.removeItem("USE_MOCK_DATA");
```

### Mock Data Files

- `mock-historical-data.json` - Historical game data with generic team names
- `mock-2025-26_predictions.json` - Prediction data with randomized values

The mock data maintains the same structure as real data but uses:
- Generic team names (Team Alpha, Team Beta, etc.)
- Randomized but realistic attendance and revenue numbers
- Same date structure and season format

## Adding New Stores

1. Create `use-[name]-store.ts` with `"use client"` directive
2. Export types from `types.ts`
3. Export hook from `index.ts`
4. Update this README with usage examples

