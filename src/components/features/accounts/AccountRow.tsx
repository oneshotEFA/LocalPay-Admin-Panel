export default function AccountRow({ label, balance }: { label: string; balance: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">{balance}</span>
    </div>
  );
}
