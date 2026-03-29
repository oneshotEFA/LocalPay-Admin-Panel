import type { ReactNode } from "react";

export default function Tooltip({ children, text }: { children: ReactNode; text: string }) {
  return (
    <div className="group relative inline-flex items-center">
      {children}
      <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-lg bg-black/80 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </div>
  );
}
