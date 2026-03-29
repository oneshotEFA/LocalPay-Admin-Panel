export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </header>
  );
}
