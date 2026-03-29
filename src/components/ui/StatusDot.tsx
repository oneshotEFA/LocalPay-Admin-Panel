export default function StatusDot({ status }: { status?: "online" | "offline" }) {
  const color = status === "online" ? "bg-emerald-400" : "bg-slate-500";
  return <span className={`inline-flex h-2 w-2 rounded-full ${color}`} aria-hidden />;
}
