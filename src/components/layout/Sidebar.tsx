"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, ShieldCheck } from "lucide-react";
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
import { supabase } from "@/lib/supabase/client";
import { use } from "react";
import { useLogout } from "@/lib/api/queries";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "API Keys", href: "/api-keys", icon: KeyRound },
  { name: "Accounts", href: "/accounts", icon: Building2 },
  { name: "Checkouts", href: "/checkouts", icon: Receipt },
  { name: "Deposits", href: "/deposits", icon: Download },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
];

export function Sidebar({
  className,
  isMobile,
  onClose,
}: {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const logout = useLogout();
  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push("/login");
    router.refresh();
  };
  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-slate-200",
        isMobile ? "relative w-64" : "fixed inset-y-0 left-0 w-64 z-10",
        className,
      )}
    >
      {/* Logo */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-none">
              LocalPay
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
              Client Portal
            </p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
              isActive(item.href)
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive(item.href)
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-600",
              )}
            />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
            pathname.startsWith("/settings")
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
          )}
        >
          <Settings className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
          Settings
        </Link>
        <button
          onClick={() => handleLogout()}
          className="group flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0 text-red-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
