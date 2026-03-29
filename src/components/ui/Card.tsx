import type { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-black/20">
      {children}
    </article>
  );
}
