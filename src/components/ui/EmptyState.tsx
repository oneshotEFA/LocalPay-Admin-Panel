import type { ReactNode } from "react";

export default function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-slate-300">
      <p className="text-base font-semibold text-white">{title}</p>
      {children}
    </div>
  );
}
