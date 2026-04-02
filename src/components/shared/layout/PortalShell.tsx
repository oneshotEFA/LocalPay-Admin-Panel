"use client";

import { type ReactNode, useState } from "react";
import { Sidebar } from "@/components/shared/layout/Sidebar";
import { Topbar } from "@/components/shared/layout/Topbar";
export function PortalShell({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        <Topbar onOpenSidebar={() => setIsNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      {isNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsNavOpen(false)}
            aria-hidden
          />
          <Sidebar
            isMobile
            onClose={() => setIsNavOpen(false)}
            className="absolute left-0 top-0 bottom-0 z-10 border-border shadow-2xl"
          />
        </div>
      )}

    </div>
  );
}
