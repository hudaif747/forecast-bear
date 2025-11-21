"use client";

import { Rocket, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarMissionControl() {
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      onClick={() => router.push("/dashboard/mission-control")}
      className={cn(
        "w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground",
        isCollapsed && "h-10 w-10 p-0"
      )}
      size={isCollapsed ? "icon" : "default"}
      aria-label={isCollapsed ? "Launch Mission Control" : undefined}
    >
      <Rocket className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="font-semibold">Mission Control</span>
          <Maximize2 className="h-3.5 w-3.5 shrink-0 ml-auto" />
        </>
      )}
    </Button>
  );
}

