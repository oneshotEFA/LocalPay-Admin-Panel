export default function CheckoutRow({ id, status }: { id: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300">
      <span>{id}</span>
      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{status}</span>
    </div>
  );
}
