export default function TransactionRow({ id, amount }: { id: string; amount: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300">
      <span>{id}</span>
      <span className="font-semibold text-white">{amount}</span>
    </div>
  );
}
