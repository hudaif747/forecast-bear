"use client";

import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="border-sidebar-border border-b p-6">
      {!isCollapsed && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/assets/bearcast-logo.svg"
                alt="Bearcast Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h2 className="font-black text-primary text-2xl tracking-tight leading-none">
                BEARCAST
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed pl-0.5">
            Homeground Forecast for the Wolfsburg Grizzlys
          </p>
        </div>
      )}
      {isCollapsed && (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-primary/10 p-1.5">
          <Image
            src="/assets/bearcast-logo.svg"
            alt="Bearcast Logo"
            width={32}
            height={32}
            className="object-contain"
            priority
          />
        </div>
      )}
    </div>
  );
}
