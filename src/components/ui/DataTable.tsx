import type { ReactNode } from "react";

export default function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {children}
    </div>
  );
}
