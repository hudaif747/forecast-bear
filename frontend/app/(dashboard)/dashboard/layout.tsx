"use client";

import { SessionProvider } from "next-auth/react";
import {
  BarChart3,
  Calendar,
  Home,
  MessageSquare,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
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
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "All Games", href: "/dashboard/games", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Assistant", href: "/dashboard/assistant", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function AppSidebar() {
  const { state } = useSidebar();
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
                        "bg-sidebar-accent font-medium text-primary hover:bg-sidebar-accent",
                        isCollapsed
                          ? "h-8 w-8 items-center justify-center rounded-lg"
                          : "w-full justify-start pl-8"
                      )}
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
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <header className="flex h-16 items-center border-border border-b bg-card px-6">
              <SidebarTrigger className="mr-4" />
              <h1 className="font-bold text-2xl text-foreground">
                Ticket Sales Forecast Dashboard
              </h1>
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
