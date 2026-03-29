"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  KeyRound,
  Building2,
  Receipt,
  Download,
  ArrowRightLeft,
  Settings,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "API Keys", href: "/api-keys", icon: KeyRound },
    { name: "Accounts", href: "/accounts", icon: Building2 },
    { name: "Checkouts", href: "/checkouts", icon: Receipt },
    { name: "Deposits", href: "/deposits", icon: Download },
    { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r border-slate-200 bg-white flex flex-col pt-6">
      <div className="px-6 mb-8 mt-2">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Local Bank Payment Verification</h1>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Client Portal</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-4 w-4",
                  isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-500"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            pathname.startsWith("/settings")
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Settings className="mr-3 flex-shrink-0 h-4 w-4 text-slate-400 group-hover:text-slate-500" />
          Settings
        </Link>
        <Link
          href="/login"
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors mt-1"
        >
          <LogOut className="mr-3 flex-shrink-0 h-4 w-4 text-red-500" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
