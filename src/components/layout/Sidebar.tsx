import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 space-y-4 border-r border-white/10 bg-slate-900/60 p-6 text-sm text-slate-200">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Menu</p>
      <nav className="flex flex-col gap-2">
        {[
          { label: "Overview", href: "/" },
          { label: "API Keys", href: "/api-keys" },
          { label: "Accounts", href: "/accounts" },
        ].map((item) => (
          <Link key={item.href} className="rounded-lg px-3 py-2 hover:bg-white/10" href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
