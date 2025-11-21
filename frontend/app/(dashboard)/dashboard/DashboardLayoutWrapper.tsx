"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardLayoutWrapperProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function DashboardLayoutWrapper({ sidebar, header, children }: DashboardLayoutWrapperProps) {
  const pathname = usePathname();
  const isMissionControl = pathname === "/dashboard/mission-control";

  // Fullscreen layout for mission control - bypass sidebar and header
  if (isMissionControl) {
    return <>{children}</>;
  }

  // Normal layout with sidebar and header
  return (
    <div className="flex min-h-screen w-full bg-background">
      {sidebar}
      <div className="flex flex-1 flex-col">
        {header}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

