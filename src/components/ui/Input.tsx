import type { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-500 ${props.className ?? ""}`}
    />
  );
}
