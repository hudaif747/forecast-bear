"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function MissionControlLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background">
      {/* Exit button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          aria-label="Exit Mission Control"
          className="h-10 w-10 rounded-full border-border/50 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => router.push("/dashboard")}
          size="icon"
          variant="outline"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </div>
  );
}
