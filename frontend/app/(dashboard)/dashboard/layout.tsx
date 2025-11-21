"use client";

import {
  BarChart3,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  Rocket,
  Maximize2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "All Games", href: "/dashboard/games", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Assistant", href: "/dashboard/assistant", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

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

function AppSidebar() {
  const { state } = useSidebar();
  const router = useRouter();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="border-sidebar-border border-b p-6">
          {!isCollapsed && (
            <>
              <h2 className="font-bold text-primary text-xl">Grizzlys</h2>
              <p className="text-muted-foreground text-sm">Forecast System</p>
            </>
          )}
          {isCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground text-sm">
                G
              </span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      className={cn(
                        isCollapsed
                          ? "h-8 w-8 items-center justify-center rounded-lg"
                          : "w-full justify-start pl-2"
                      )}
                      activeClassName="bg-sidebar-accent font-medium text-primary hover:bg-sidebar-accent"
                      href={item.href}
                    >
                      <item.icon className="h-5 w-5" />
                      {isCollapsed ? null : <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
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
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname ?? "");
  const isMissionControl = pathname === "/dashboard/mission-control";

  // Fullscreen layout for mission control
  if (isMissionControl) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center border-border border-b bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <Separator orientation="vertical" className="h-6" />
            <h1 className="ml-4 font-bold text-2xl text-foreground">
              {pageTitle}
            </h1>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
