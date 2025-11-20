import { cookies } from "next/headers";
import Script from "next/script";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import {
  SidebarProvider
} from "@/components/ui/sidebar-chat";
import { auth } from "@/app/(auth)/auth";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <div className="flex h-full w-full flex-row">
        <SidebarProvider defaultOpen={!isCollapsed}>
          <DataStreamProvider>
            <AppSidebar user={session?.user} />
            {/* <SidebarInsetChat className="flex flex-1 overflow-auto"> */}
              {children}
            {/* </SidebarInsetChat> */}
          </DataStreamProvider>
        </SidebarProvider>
      </div>
    </>
  );
}
