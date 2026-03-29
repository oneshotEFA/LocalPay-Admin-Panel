import type { SelectHTMLAttributes } from "react";

export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm text-white ${props.className ?? ""}`}
    />
  );
}
