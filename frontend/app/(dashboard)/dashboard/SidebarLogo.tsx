"use client";

import { useSidebar } from "@/components/ui/sidebar";

export function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="border-sidebar-border border-b p-6">
      {!isCollapsed && (
        <>
          <h2 className="font-bold text-primary text-xl">Grizzlys</h2>
          <p className="text-muted-foreground text-sm">Forecast System</p>
        </>
      )}
      {isCollapsed && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="font-bold text-primary-foreground text-sm">G</span>
        </div>
      )}
    </div>
  );
}

