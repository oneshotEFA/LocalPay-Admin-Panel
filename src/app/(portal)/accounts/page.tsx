"use client";

import { useState } from "react";
import { Plus, Edit2, Save, X, Building2, Smartphone, CheckCircle2 } from "lucide-react";
import { mockAccounts } from "@/lib/mock/data";
import { PaymentMethod, ClientReceivingAccount } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { useAccounts, useCreateAccount, useUpdateAccount, useToggleAccount } from "@/lib/api"; // ← connect when ready

const BANK_NAMES: Record<PaymentMethod, string> = {
  [PaymentMethod.CBE]: "Commercial Bank of Ethiopia",
  [PaymentMethod.TELEBIRR]: "Telebirr",
  [PaymentMethod.EBIRR]: "eBirr",
  [PaymentMethod.ABYSSINIA]: "Bank of Abyssinia",
  [PaymentMethod.NIB]: "Nib International Bank",
};

const BANK_COLORS: Record<PaymentMethod, string> = {
  [PaymentMethod.CBE]: "bg-blue-100 text-blue-700",
  [PaymentMethod.TELEBIRR]: "bg-emerald-100 text-emerald-700",
  [PaymentMethod.EBIRR]: "bg-teal-100 text-teal-700",
  [PaymentMethod.ABYSSINIA]: "bg-violet-100 text-violet-700",
  [PaymentMethod.NIB]: "bg-orange-100 text-orange-700",
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<ClientReceivingAccount[]>(mockAccounts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ accountName: "", accountNumber: "" });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ paymentMethod: PaymentMethod.CBE, accountName: "", accountNumber: "" });

  const configuredMethods = accounts.map((a) => a.paymentMethod);
  const availableMethods = Object.values(PaymentMethod).filter((m) => !configuredMethods.includes(m));

  const startEdit = (acc: ClientReceivingAccount) => {
    setEditingId(acc.id);
    setEditForm({ accountName: acc.accountName, accountNumber: acc.accountNumber });
  };

  const saveEdit = (id: string) => {
    if (!editForm.accountName || !editForm.accountNumber) { toast.error("Both fields required"); return; }
    setAccounts(accounts.map((a) => a.id === id ? { ...a, ...editForm, updatedAt: new Date().toISOString() } : a));
    setEditingId(null);
    toast.success("Account updated");
  };

  const toggleActive = (id: string, current: boolean) => {
    setAccounts(accounts.map((a) => a.id === id ? { ...a, isActive: !current } : a));
    toast.success(`Account ${!current ? "enabled" : "disabled"}`);
  };

  const handleAdd = () => {
    if (!newAccount.accountName || !newAccount.accountNumber) { toast.error("Fill all fields"); return; }
    setAccounts([...accounts, {
      id: `acc-${Date.now()}`, clientId: "client-123",
      paymentMethod: newAccount.paymentMethod,
      accountName: newAccount.accountName, accountNumber: newAccount.accountNumber,
      isActive: true, updatedAt: new Date().toISOString(),
    }]);
    toast.success("Account added");
    setIsAddOpen(false);
    setNewAccount({ paymentMethod: availableMethods[0] ?? PaymentMethod.CBE, accountName: "", accountNumber: "" });
  };

  const isMobile = (m: PaymentMethod) => m === PaymentMethod.TELEBIRR || m === PaymentMethod.EBIRR;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Receiving Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Bank accounts your users deposit money into for verification.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm self-start sm:self-auto" disabled={availableMethods.length === 0}>
              <Plus className="mr-2 h-4 w-4" />Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Receiving Account</DialogTitle>
              <DialogDescription>Configure a new payment method for user deposits.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Payment Method</Label>
                <select
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
                  value={newAccount.paymentMethod}
                  onChange={(e) => setNewAccount({ ...newAccount, paymentMethod: e.target.value as PaymentMethod })}
                >
                  {availableMethods.map((m) => <option key={m} value={m}>{BANK_NAMES[m]}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-name" className="text-sm font-medium">Beneficiary Name</Label>
                <Input id="add-name" placeholder="e.g. My Company PLC" value={newAccount.accountName}
                  onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                  className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-number" className="text-sm font-medium">Account Number</Label>
                <Input id="add-number" placeholder="e.g. 1000123456789" value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  className="border-slate-200 font-mono" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} className="bg-slate-900 hover:bg-slate-800 text-white">Save Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Icon badge */}
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${BANK_COLORS[acc.paymentMethod]}`}>
                {isMobile(acc.paymentMethod)
                  ? <Smartphone className="h-5 w-5" />
                  : <Building2 className="h-5 w-5" />}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900 text-sm">{BANK_NAMES[acc.paymentMethod]}</h3>
                  <Badge className={`text-[10px] px-1.5 shadow-none ${acc.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {acc.isActive ? <><CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />Active</> : "Inactive"}
                  </Badge>
                </div>

                {editingId === acc.id ? (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Beneficiary Name</Label>
                      <Input value={editForm.accountName} onChange={(e) => setEditForm({ ...editForm, accountName: e.target.value })}
                        className="h-8 text-sm border-slate-200" />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Account Number</Label>
                      <Input value={editForm.accountNumber} onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })}
                        className="h-8 text-sm font-mono border-slate-200" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 mt-1.5">
                    <span className="text-sm text-slate-600"><span className="text-slate-400 text-xs">Name </span>{acc.accountName}</span>
                    <span className="text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-xs">{acc.accountNumber}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{acc.isActive ? "Active" : "Off"}</span>
                  <Switch checked={acc.isActive} onCheckedChange={() => toggleActive(acc.id, acc.isActive)} disabled={editingId === acc.id} />
                </div>

                {editingId === acc.id ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-8 text-slate-500 hover:text-slate-700">
                      <X className="h-4 w-4 mr-1" />Cancel
                    </Button>
                    <Button size="sm" onClick={() => saveEdit(acc.id)} className="h-8 bg-slate-900 hover:bg-slate-800 text-white">
                      <Save className="h-4 w-4 mr-1" />Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => startEdit(acc)} className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
            <Building2 className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="font-medium text-slate-700 text-sm">No receiving accounts configured</p>
            <p className="text-xs text-slate-400 mt-1">Add bank accounts to start accepting deposits.</p>
          </div>
        )}
      </div>
    </div>
  );
}
