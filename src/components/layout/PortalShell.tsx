"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toaster } from "@/components/ui/sonner";

export function PortalShell({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Topbar onOpenSidebar={() => setIsNavOpen(true)} />
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsNavOpen(false)}
          />
          <Sidebar
            isMobile
            onClose={() => setIsNavOpen(false)}
            className="absolute left-0 top-0 bottom-0 shadow-2xl"
          />
        </div>
      )}

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
