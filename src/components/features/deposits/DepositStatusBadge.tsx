export default function DepositStatusBadge({ status }: { status: string }) {
  return <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{status}</span>;
}
