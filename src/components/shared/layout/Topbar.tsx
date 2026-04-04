"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import Tooltip from "@/components/ui/Tooltip";
import { User } from "@supabase/supabase-js";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/api-keys": "API Keys",
  "/accounts": "Receiving accounts",
  "/checkouts": "Checkouts",
  "/deposits": "Deposits",
  "/transactions": "Transactions",
  "/settings": "Settings",
};

export function Topbar({
  onOpenSidebar,
  user,
}: {
  onOpenSidebar: () => void;
  user: User | null;
}) {
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([k]) =>
      k === "/" ? pathname === "/" : pathname.startsWith(k),
    )?.[1] ?? "Portal";

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-background/75 px-4 backdrop-blur-xl supports-backdrop-filter:bg-background/65 sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 border-l border-border/60 pl-3 md:border-0 md:pl-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <Tooltip text="Notifications coming soon">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
            type="button"
            disabled
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </Tooltip>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-[11px] font-bold text-primary-foreground ring-2 ring-background">
          {user?.email?.split("@")[0]?.charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
