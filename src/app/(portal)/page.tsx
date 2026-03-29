export default function PortalHome() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Overview</p>
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {["Daily Volume", "Pending Deposits", "API usage"].map((stat) => (
          <div key={stat} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{stat}</p>
            <p className="text-3xl font-bold text-white">Coming soon</p>
          </div>
        ))}
      </div>
    </section>
  );
}
