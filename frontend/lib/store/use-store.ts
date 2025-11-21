"use client";

/**
 * General App Store
 *
 * ⚠️ CLIENT-ONLY: This file must have "use client" directive.
 * Only import the hook from "@/lib/store", not this file directly.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type StoreState = {};

export const useStore = create<StoreState>()(
  devtools(
    (set) => ({
      // Add your general app state here
    }),
    {
      name: "app-store", // Name for Redux DevTools
    }
  )
);
