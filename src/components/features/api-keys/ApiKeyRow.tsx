export default function ApiKeyRow({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 p-4 text-sm text-slate-300">
      <span>{name}</span>
      <span className="text-xs text-slate-500">active</span>
    </div>
  );
}
