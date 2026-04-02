"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/api-keys": "API Keys",
  "/accounts": "Receiving Accounts",
  "/checkouts": "Checkouts",
  "/deposits": "Deposits",
  "/transactions": "Transactions",
  "/settings": "Settings",
};

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const pathname = usePathname();

  const title = Object.entries(pageTitles).find(([k]) =>
    k === "/" ? pathname === "/" : pathname.startsWith(k)
  )?.[1] ?? "Portal";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-slate-500 hover:text-slate-700 transition-colors"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          A
        </div>
      </div>
    </header>
  );
}
