"use client";

import { usePathname } from "next/navigation";
import { mockClientProfile } from "@/lib/mock/client";
import { Bell, Menu } from "lucide-react";
import Image from "next/image";

export function Topbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const pathname = usePathname();

  // Simple title generator from pathname
  const getPageTitle = () => {
    if (pathname === "/") return "Overview";
    if (pathname.startsWith("/api-keys")) return "API Keys";
    if (pathname.startsWith("/accounts")) return "Receiving Accounts";
    if (pathname.startsWith("/checkouts")) return "Checkouts";
    if (pathname.startsWith("/deposits")) return "Deposits";
    if (pathname.startsWith("/transactions")) return "Transactions";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-10 w-full h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="md:hidden text-slate-500 hover:text-slate-700"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell className="h-5 w-5" />
          {mockClientProfile.stats.pendingAttention > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700 leading-none">
              {mockClientProfile.name}
            </p>
            <p className="text-xs text-slate-500 mt-1">Client Admin</p>
          </div>
          <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
            {mockClientProfile.logoUrl ? (
              <img
                src={mockClientProfile.logoUrl}
                alt="Client Logo"
         
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-sm">
                {mockClientProfile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
