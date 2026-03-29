"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toaster } from "@/components/ui/sonner";

export function PortalShell({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col md:pl-64">
        <Topbar onOpenSidebar={() => setIsNavOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      {isNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsNavOpen(false)} />
          <Sidebar
            isMobile
            onClose={() => setIsNavOpen(false)}
            className="absolute left-0 top-0 bottom-0"
          />
        </div>
      )}
      <Toaster position="top-right" richColors />
    </div>
  );
}
