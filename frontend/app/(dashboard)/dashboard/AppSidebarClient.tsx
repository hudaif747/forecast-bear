"use client";

import type { ReactNode } from "react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";

interface AppSidebarClientProps {
  children: ReactNode;
}

export function AppSidebarClient({ children }: AppSidebarClientProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      {children}
    </Sidebar>
  );
}

