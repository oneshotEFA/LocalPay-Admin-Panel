import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Admin Portal",
  description: "Banking operations workspace",
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = true; // replace with real auth gate

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-72 border-r border-white/10 bg-slate-900/60 p-6">
        <div className="mb-6 text-sm uppercase tracking-[0.2em] text-slate-400">
          Admin Panel
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          {["Overview", "API Keys", "Accounts", "Checkouts", "Deposits", "Transactions", "Settings"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/10"
            >
              {item}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="border-b border-white/10 p-6 text-lg font-medium">
          Portal Shell
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
