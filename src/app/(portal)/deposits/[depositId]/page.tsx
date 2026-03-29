export default function DepositDetailsPage({ params }: { params: { depositId: string } }) {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-white">Deposit {params.depositId}</h1>
        <p className="text-sm text-slate-400">Verification checks and receipts.</p>
      </header>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        Details for deposit {params.depositId} will appear here.
      </div>
    </section>
  );
}
