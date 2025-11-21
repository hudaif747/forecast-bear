import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { auth } from "@/app/(auth)/auth";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import {
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebarClient } from "./AppSidebarClient";
import { DashboardHeader } from "./DashboardHeader";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavigation } from "./SidebarNavigation";

async function AppSidebar() {
  const session = await auth();

  return (
    <AppSidebarClient>
      <SidebarContent>
        <SidebarLogo />
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        {session && <SidebarUserNav user={session.user} />}
      </SidebarFooter>
    </AppSidebarClient>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
