"use client";

import { useState } from "react";
import { Plus, Edit2, Save, X, Building2, Smartphone } from "lucide-react";
import { mockAccounts } from "@/lib/mock/data";
import { PaymentMethod, ClientReceivingAccount } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<ClientReceivingAccount[]>(mockAccounts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ accountName: string; accountNumber: string }>({ accountName: "", accountNumber: "" });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ paymentMethod: PaymentMethod.CBE, accountName: "", accountNumber: "" });

  // Available banks not yet configured
  const configuredMethods = accounts.map(a => a.paymentMethod);
  const availableMethods = Object.values(PaymentMethod).filter(m => !configuredMethods.includes(m));

  const startEdit = (acc: ClientReceivingAccount) => {
    setEditingId(acc.id);
    setEditForm({ accountName: acc.accountName, accountNumber: acc.accountNumber });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (!editForm.accountName || !editForm.accountNumber) {
      toast.error("Account name and number are required");
      return;
    }
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, ...editForm, updatedAt: new Date().toISOString() } : acc));
    setEditingId(null);
    toast.success("Account updated successfully");
  };

  const toggleActive = (id: string, current: boolean) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, isActive: !current } : acc));
    toast.success(`Account marked as ${!current ? 'active' : 'inactive'}`);
  };

  const handleAddAccount = () => {
    if (!newAccount.accountName || !newAccount.accountNumber) {
      toast.error("Please fill all fields");
      return;
    }

    setAccounts([
      ...accounts,
      {
        id: `acc-${Date.now()}`,
        clientId: "client-123",
        paymentMethod: newAccount.paymentMethod,
        accountName: newAccount.accountName,
        accountNumber: newAccount.accountNumber,
        isActive: true,
        updatedAt: new Date().toISOString(),
      }
    ]);

    toast.success("Receiving account added");
    setIsAddOpen(false);
    setNewAccount({ paymentMethod: availableMethods[0] || PaymentMethod.CBE, accountName: "", accountNumber: "" });
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CBE:
      case PaymentMethod.ABYSSINIA:
      case PaymentMethod.NIB:
        return <Building2 className="h-6 w-6 text-indigo-600" />;
      case PaymentMethod.TELEBIRR:
      case PaymentMethod.EBIRR:
        return <Smartphone className="h-6 w-6 text-emerald-600" />;
      default:
        return <Building2 className="h-6 w-6 text-slate-600" />;
    }
  };

  const formatMethodName = (method: PaymentMethod) => {
    if (method === PaymentMethod.CBE) return "Commercial Bank of Ethiopia";
    if (method === PaymentMethod.TELEBIRR) return "Telebirr";
    if (method === PaymentMethod.EBIRR) return "eBirr";
    if (method === PaymentMethod.ABYSSINIA) return "Bank of Abyssinia";
    if (method === PaymentMethod.NIB) return "Nib International Bank";
    return method;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Receiving Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">Configure the bank accounts your users will deposit money into.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm" disabled={availableMethods.length === 0}>
              <Plus className="mr-2 h-4 w-4" /> Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Receiving Account</DialogTitle>
              <DialogDescription>
                Configure a new payment method for user deposits.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                {/* Note: In a real app we'd use Shadcn Select. Using native/simple select for now due to dependency simplicity */}
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                  value={newAccount.paymentMethod}
                  onChange={(e) => setNewAccount({ ...newAccount, paymentMethod: e.target.value as PaymentMethod })}
                >
                  {availableMethods.map(m => (
                    <option key={m} value={m}>{formatMethodName(m)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-name">Account Name (Beneficiary)</Label>
                <Input 
                  id="add-name" 
                  placeholder="e.g. My Company PLC" 
                  value={newAccount.accountName}
                  onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-number">Account Number</Label>
                <Input 
                  id="add-number" 
                  placeholder="e.g. 1000123456789" 
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAccount}>Save Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-sm transition-all hover:border-slate-300">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
              {getMethodIcon(acc.paymentMethod)}
            </div>
            
            <div className="flex-1 space-y-1 w-full">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{formatMethodName(acc.paymentMethod)}</h3>
                {!acc.isActive && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Inactive</span>}
              </div>
              
              {editingId === acc.id ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Account Name</Label>
                    <Input 
                      value={editForm.accountName} 
                      onChange={(e) => setEditForm({...editForm, accountName: e.target.value})}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Account Number</Label>
                    <Input 
                      value={editForm.accountNumber} 
                      onChange={(e) => setEditForm({...editForm, accountNumber: e.target.value})}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:gap-8 mt-1">
                  <p className="text-sm text-slate-600"><span className="text-slate-400">Name:</span> {acc.accountName}</p>
                  <p className="text-sm font-mono text-slate-700 bg-slate-50 px-2 rounded"><span className="text-slate-400 font-sans text-xs">No:</span> {acc.accountNumber}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
              <div className="flex items-center space-x-2 mr-4 disabled:opacity-50">
                <Label htmlFor={`active-${acc.id}`} className="text-xs text-slate-500 cursor-pointer">
                  {acc.isActive ? 'Active' : 'Disabled'}
                </Label>
                <Switch 
                  id={`active-${acc.id}`} 
                  checked={acc.isActive}
                  onCheckedChange={() => toggleActive(acc.id, acc.isActive)}
                  disabled={editingId === acc.id}
                />
              </div>

              {editingId === acc.id ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-8 px-2 text-slate-500 hover:text-slate-700">
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={() => saveEdit(acc.id)} className="h-8 px-3">
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => startEdit(acc)} className="h-8 bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
              )}
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="text-center py-12 border border-slate-200 border-dashed rounded-xl">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No configured accounts</h3>
            <p className="mt-1 text-sm text-slate-500">Configure receiving accounts to start accepting deposits.</p>
          </div>
        )}
      </div>
    </div>
  );
}
