import { mockClientProfile } from "@/lib/mock/client";
import { mockCheckouts, mockDeposits } from "@/lib/mock/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default function OverviewPage() {
  const { stats, name } = mockClientProfile;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(amount);
  };

  // Status badge coloring
  const getCheckoutBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 shadow-none">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 shadow-none">Pending</Badge>;
      case "FAILED":
      case "EXPIRED":
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200 shadow-none">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDepositBadge = (status: string) => {
    if (status === "FUNDED" || status === "VERIFIED") {
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 shadow-none">{status.replace("_", " ")}</Badge>;
    }
    if (status.includes("REJECTED")) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200 shadow-none">Rejected</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 shadow-none">{status.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome, {name}</h1>
        <p className="text-slate-500 mt-1">Here is a snapshot of your payment operations this month.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Checkouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalCheckoutsMonth.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1 tracking-wide">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalDepositsMonth.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1 tracking-wide">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Funded (ETB)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalFundedMonth)}</div>
            <p className="text-xs text-slate-500 mt-1 tracking-wide">+18.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-rose-200 bg-rose-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">{stats.pendingAttention}</div>
            <p className="text-xs text-rose-600 mt-1 tracking-wide">Failed verifications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Checkouts */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800">Recent Checkouts</CardTitle>
            <Link href="/checkouts" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100">
                  <TableHead className="font-medium">ID / Ref</TableHead>
                  <TableHead className="font-medium">Amount</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="text-right font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCheckouts.slice(0, 5).map((chk) => (
                  <TableRow key={chk.id} className="border-slate-100 hover:bg-slate-50">
                    <TableCell className="py-3">
                      <Link href={`/checkouts/${chk.id}`} className="font-medium text-slate-900 hover:underline">
                        {chk.id.slice(0, 10)}...
                      </Link>
                      <div className="text-xs text-slate-500">{chk.invoiceId}</div>
                    </TableCell>
                    <TableCell className="py-3 font-medium">{formatCurrency(chk.amount)}</TableCell>
                    <TableCell className="py-3">{getCheckoutBadge(chk.status)}</TableCell>
                    <TableCell className="py-3 text-right text-xs text-slate-500">
                      {format(new Date(chk.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Deposits */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800">Recent Deposits</CardTitle>
            <Link href="/deposits" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100">
                  <TableHead className="font-medium">ID / Method</TableHead>
                  <TableHead className="font-medium">Amount</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="text-right font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeposits.slice(0, 5).map((dep) => (
                  <TableRow key={dep.id} className="border-slate-100 hover:bg-slate-50 hover:cursor-pointer pb-2">
                    <TableCell className="py-3">
                      <Link href={`/deposits/${dep.id}`} className="font-medium text-slate-900 hover:underline">
                        {dep.id.slice(0, 10)}...
                      </Link>
                      <div className="text-xs text-slate-500 flex items-center mt-1">
                        <span className="font-medium text-slate-700">{dep.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-medium">{formatCurrency(dep.amount)}</TableCell>
                    <TableCell className="py-3">{getDepositBadge(dep.status)}</TableCell>
                    <TableCell className="py-3 text-right text-xs text-slate-500">
                      {format(new Date(dep.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
