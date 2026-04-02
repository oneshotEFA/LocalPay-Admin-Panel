"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  LayoutDashboard,
  KeyRound,
  Building2,
  Receipt,
  Download,
  ArrowRightLeft,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/lib/api";
import { WarningDialog } from "@/components/shared/WarningDialog";
import { BrandLogo } from "@/components/shared/BrandLogo";

const mainNav = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "API Keys", href: "/api-keys", icon: KeyRound },
  { name: "Accounts", href: "/accounts", icon: Building2 },
  { name: "Checkouts", href: "/checkouts", icon: Receipt },
  { name: "Deposits", href: "/deposits", icon: Download },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
];

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: (typeof mainNav)[number];
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={() => onNavigate?.()}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-primary/12 text-sidebar-foreground shadow-sm dark:bg-sidebar-primary/20"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full transition-opacity",
          active
            ? "bg-sidebar-primary opacity-100"
            : "opacity-0 group-hover:opacity-40",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
          active
            ? "border-sidebar-primary/25 bg-sidebar-primary/15 text-sidebar-primary dark:bg-sidebar-primary/25 dark:text-sidebar-primary-foreground"
            : "border-transparent bg-sidebar-accent/50 text-muted-foreground group-hover:border-border/60 group-hover:text-foreground",
        )}
      >
        <item.icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="truncate">{item.name}</span>
    </Link>
  );
}

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
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const logout = useLogout();
  const handleLogout = async () => {
    await logout.mutateAsync();
    setIsSignOutOpen(false);
    router.push("/login");
    router.refresh();
  };

  const closeIfMobile = () => {
    if (isMobile) onClose?.();
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground",
        "border-r border-sidebar-border bg-sidebar",
        isMobile ? "relative w-[min(20rem,100vw)]" : "fixed inset-y-0 left-0 z-20 w-72",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between gap-3 border-b border-sidebar-border/80 px-5 shrink-0">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo className="h-10 w-10 shrink-0 border-sidebar-border/80" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight">
              LocalPay
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 rounded-md bg-sidebar-accent px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-2.5 w-2.5" />
                Portal
              </span>
            </div>
          </div>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/90">
          Workspace
        </p>
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={closeIfMobile}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-sidebar-border/80 px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/90">
          Account
        </p>
        <div className="space-y-0.5">
          <Link
            href="/settings"
            onClick={closeIfMobile}
            className={cn(
              "relative group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/settings")
                ? "bg-sidebar-primary/12 text-sidebar-foreground shadow-sm dark:bg-sidebar-primary/20"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full transition-opacity",
                pathname.startsWith("/settings")
                  ? "bg-sidebar-primary opacity-100"
                  : "opacity-0 group-hover:opacity-40",
              )}
            />
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                pathname.startsWith("/settings")
                  ? "border-sidebar-primary/25 bg-sidebar-primary/15 text-sidebar-primary"
                  : "border-transparent bg-sidebar-accent/50 text-muted-foreground group-hover:text-foreground",
              )}
            >
              <Settings className="h-4 w-4" strokeWidth={2} />
            </span>
            Settings
          </Link>
          <button
            type="button"
            onClick={() => setIsSignOutOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive/90 transition-colors hover:bg-destructive/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-destructive/5">
              <LogOut className="h-4 w-4 opacity-90" strokeWidth={2} />
            </span>
            Sign out
          </button>
        </div>
      </div>

      <WarningDialog
        open={isSignOutOpen}
        onOpenChange={setIsSignOutOpen}
        title="Sign out"
        description="You will need to sign in again to continue using the portal."
        confirmLabel="Sign out"
        onConfirm={handleLogout}
        isPending={logout.isPending}
        icon={<LogOut className="h-5 w-5" />}
      />
    </aside>
  );
}
