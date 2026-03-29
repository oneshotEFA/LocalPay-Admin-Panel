export default function CheckoutDetailsPage({ params }: { params: { checkoutId: string } }) {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-white">Checkout {params.checkoutId}</h1>
        <p className="text-sm text-slate-400">Webhook log and actions for this checkout.</p>
      </header>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        Details for checkout {params.checkoutId} will appear here.
      </div>
    </section>
  );
}
