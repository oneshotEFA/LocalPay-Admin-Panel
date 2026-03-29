import type { ReactNode } from "react";

export default function Dropdown({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="inline-flex flex-col gap-2 text-sm">
      <span className="text-slate-400">{label}</span>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">{children}</div>
    </div>
  );
}
