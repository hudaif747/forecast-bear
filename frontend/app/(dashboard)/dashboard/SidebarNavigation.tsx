"use client";

import {
  BarChart3,
  Calendar,
  Home,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  // { name: "All Games", href: "/dashboard/games", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Assistant", href: "/dashboard/assistant", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function SidebarNavigation() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <NavLink
                  activeClassName="bg-sidebar-accent font-medium text-primary hover:bg-sidebar-accent"
                  className={cn(
                    isCollapsed
                      ? "h-8 w-8 items-center justify-center rounded-lg"
                      : "w-full justify-start pl-2"
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
  );
}
