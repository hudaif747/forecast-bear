/**
 * Store Helper Utilities
 *
 * Type-safe helpers for working with Zustand stores
 */

/**
 * Type guard to check if code is running on the client
 * Useful for conditional store access
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Assertion helper - throws error if called on server
 * Use this in store initialization if needed
 */
export function assertClient(): asserts this is Window {
  if (typeof window === "undefined") {
    throw new Error(
      "Store hooks can only be used in client components. " +
        "Add 'use client' directive to your component file."
    );
  }
}
