"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function getPageTitle(pathname: string): string {
  const routeMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/games": "All Games",
    "/dashboard/analytics": "Analytics",
    "/dashboard/assistant": "Assistant",
    "/dashboard/settings": "Settings",
  };

  // Check for exact match first
  if (routeMap[pathname]) {
    return routeMap[pathname];
  }

  // Check for nested routes (e.g., /dashboard/assistant/chat)
  for (const [route, title] of Object.entries(routeMap)) {
    if (pathname.startsWith(route) && route !== "/dashboard") {
      return title;
    }
  }

  // Default fallback
  return "Ticket Sales Forecast Dashboard";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname ?? "");

  return (
    <header className="flex h-16 items-center border-border border-b bg-card px-6">
      <SidebarTrigger className="mr-4" />
      <Separator className="h-6" orientation="vertical" />
      <h1 className="ml-4 font-bold text-2xl text-foreground">{pageTitle}</h1>
    </header>
  );
}

