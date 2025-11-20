"use client";

import { type ReactNode } from "react";

interface ZustandProviderProps {
  children: ReactNode;
}

/**
 * Zustand Provider Component
 * 
 * While Zustand doesn't strictly require a provider (stores are global),
 * this provider can be used for:
 * - Initializing stores with server-side data
 * - Providing store instances via context if needed
 * - Setting up middleware or persistence
 * - Future extensibility
 */
export function ZustandProvider({ children }: ZustandProviderProps) {
  // Initialize stores here if needed
  // For example, you could hydrate stores with server data:
  // useEffect(() => {
  //   useStore.setState(initialState);
  // }, []);

  return <>{children}</>;
}

