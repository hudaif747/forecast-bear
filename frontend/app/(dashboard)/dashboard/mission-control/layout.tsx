"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function MissionControlLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background">
      {/* Exit button */}
      <div className="absolute right-4 top-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
          aria-label="Exit Mission Control"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </div>
  );
}

