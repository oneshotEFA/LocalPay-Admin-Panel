import type { ReactNode } from "react";

export default function Dialog({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 text-sm text-slate-300">{children}</div>
    </div>
  );
}
