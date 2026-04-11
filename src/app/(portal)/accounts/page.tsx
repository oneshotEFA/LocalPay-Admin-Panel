"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Save,
  X,
  Building2,
  Smartphone,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { PaymentMethod } from "@/lib/types";
import {
  useBanks,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
  type BankListItem,
  type BankReceivingAccountSummary,
} from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { AccountsPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { PageHeader } from "@/components/shared/PageHeader";
import { WarningDialog } from "@/components/shared/WarningDialog";

const BANK_COLORS: Record<PaymentMethod, string> = {
  [PaymentMethod.CBE]:
    "bg-blue-500/12 text-blue-700 dark:text-blue-400 border-blue-500/20",
  [PaymentMethod.TELEBIRR]:
    "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  [PaymentMethod.EBIRR]:
    "bg-teal-500/12 text-teal-800 dark:text-teal-400 border-teal-500/20",
  [PaymentMethod.ABYSSINIA]:
    "bg-violet-500/12 text-violet-800 dark:text-violet-400 border-violet-500/20",
  [PaymentMethod.NIB]:
    "bg-orange-500/12 text-orange-800 dark:text-orange-400 border-orange-500/20",
};

const PAYMENT_METHODS = Object.values(PaymentMethod);

function isPaymentMethod(value: string): value is PaymentMethod {
  return PAYMENT_METHODS.includes(value as PaymentMethod);
}

function paymentMethodFromParserKey(parserKey: string): PaymentMethod | null {
  const normalized = parserKey.trim().toUpperCase();
  return isPaymentMethod(normalized) ? normalized : null;
}

function bankReceivingAccountId(bank: BankListItem) {
  return bank.receivingAccount?.id ?? null;
}

export default function AccountsPage() {
  const { data, error, refetch, isPending } = useBanks();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const banks = data?.items ?? [];
  const [editingId, setEditingId] = useState<string | null>(null); // receivingAccount.id
  const [editForm, setEditForm] = useState({
    accountName: "",
    accountNumber: "",
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({
    bankId: "",
    accountName: "",
    accountNumber: "",
  });

  const addableBanks = banks.filter((bank) => {
    if (bank.receivingAccount) return false;
    return paymentMethodFromParserKey(bank.parserKey) != null;
  });

  const selectedBankId =
    addForm.bankId && addableBanks.some((b) => b.id === addForm.bankId)
      ? addForm.bankId
      : (addableBanks[0]?.id ?? "");

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? null;

  const startEdit = (acc: BankReceivingAccountSummary) => {
    setEditingId(acc.id);
    setEditForm({
      accountName: acc.accountName,
      accountNumber: acc.accountNumber,
    });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.accountName || !editForm.accountNumber) {
      toast.error("Both fields required");
      return;
    }

    try {
      await updateAccount.mutateAsync({ id, ...editForm });
      setEditingId(null);
      toast.success("Account updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update account",
      );
    }
  };

  const toggleActive = async (acc: BankReceivingAccountSummary) => {
    try {
      await updateAccount.mutateAsync({ id: acc.id, isActive: !acc.isActive });
      toast.success(`Account ${!acc.isActive ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update account",
      );
    }
  };

  const handleAdd = async () => {
    if (!addForm.accountName || !addForm.accountNumber) {
      toast.error("Fill all fields");
      return;
    }

    if (!selectedBank) {
      toast.error("Select a bank");
      return;
    }

    if (selectedBank.receivingAccount) {
      toast.error("This bank already has an account configured");
      return;
    }

    const paymentMethod = paymentMethodFromParserKey(selectedBank.parserKey);
    if (!paymentMethod) {
      toast.error("This bank’s parser key isn’t supported by this portal yet");
      return;
    }

    const payload = {
      paymentMethod,
      accountName: addForm.accountName.trim(),
      accountNumber: addForm.accountNumber.trim(),
      isActive: true,
    };

    try {
      await createAccount.mutateAsync(payload);
      toast.success("Account added");
      setIsAddOpen(false);
      setAddForm({
        bankId: "",
        accountName: "",
        accountNumber: "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add account");
    }
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;
    const id = accountToDelete;
    try {
      await deleteAccount.mutateAsync(id);
      toast.success("Account deleted");
      setAccountToDelete(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete account",
      );
    }
  };

  const isMobile = (m: PaymentMethod) =>
    m === PaymentMethod.TELEBIRR || m === PaymentMethod.EBIRR;

  const handleAddDialogChange = (open: boolean) => {
    setIsAddOpen(open);

    if (open) {
      setAddForm((current) => ({
        ...current,
        bankId:
          (current.bankId &&
          addableBanks.some((bank) => bank.id === current.bankId)
            ? current.bankId
            : addableBanks[0]?.id ?? ""),
      }));
      return;
    }

    setAddForm({
      bankId: "",
      accountName: "",
      accountNumber: "",
    });
  };

  const openAddForBank = (bankId: string) => {
    setAddForm((current) => ({
      ...current,
      bankId,
      accountName: "",
      accountNumber: "",
    }));
    setIsAddOpen(true);
  };

  if (!data && isPending) {
    return <AccountsPageSkeleton />;
  }

  if (!data && error) {
    return (
      <QueryError
        title="Couldn’t load banks"
        message="We couldn’t reach the server. Try again in a moment."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      <PageHeader
        title="Receiving accounts"
        description="Bank and wallet destinations that appear on checkout instructions. One active account per payment rail."
        action={
          <Dialog open={isAddOpen} onOpenChange={handleAddDialogChange}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="rounded-xl shadow-sm"
                disabled={addableBanks.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add account
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Receiving Account</DialogTitle>
              <DialogDescription>
                Configure a new payment method for user deposits.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Bank</Label>
                <select
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
                  value={selectedBankId}
                  onChange={(e) =>
                    setAddForm((current) => ({
                      ...current,
                      bankId: e.target.value,
                    }))
                  }
                >
                  {addableBanks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-name" className="text-sm font-medium">
                  Beneficiary Name
                </Label>
                <Input
                  id="add-name"
                  placeholder="e.g. My Company PLC"
                  value={addForm.accountName}
                  onChange={(e) =>
                    setAddForm((current) => ({
                      ...current,
                      accountName: e.target.value,
                    }))
                  }
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-number" className="text-sm font-medium">
                  Account Number
                </Label>
                <Input
                  id="add-number"
                  placeholder="e.g. 1000123456789"
                  value={addForm.accountNumber}
                  onChange={(e) =>
                    setAddForm((current) => ({
                      ...current,
                      accountNumber: e.target.value,
                    }))
                  }
                  className="border-slate-200 font-mono"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={createAccount.isPending}>
                Save account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        }
      />

      <div className="space-y-4">
        {banks.map((bank) => {
          const acc = bank.receivingAccount;
          const paymentMethod = paymentMethodFromParserKey(bank.parserKey);
          const accountId = bankReceivingAccountId(bank);
          const isEditing = !!accountId && editingId === accountId;
          const canConfigure = !acc && paymentMethod != null;
          return (
          <div
            key={bank.id}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-colors hover:border-primary/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                  paymentMethod ? BANK_COLORS[paymentMethod] : "bg-muted/40 text-muted-foreground border-border/70"
                }`}
              >
                {paymentMethod && isMobile(paymentMethod) ? (
                  <Smartphone className="h-5 w-5" />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-foreground">
                    {bank.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`px-1.5 text-[10px] font-medium shadow-none ${
                      acc?.isActive
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {acc?.isActive ? (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />
                        Active
                      </>
                    ) : acc ? (
                      "Inactive"
                    ) : (
                      "Not configured"
                    )}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-1.5 text-[10px] font-medium shadow-none text-muted-foreground"
                  >
                    {bank.parserKey}
                  </Badge>
                </div>

                {acc && isEditing ? (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">
                        Beneficiary Name
                      </Label>
                      <Input
                        value={editForm.accountName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            accountName: e.target.value,
                          })
                        }
                        className="h-8 text-sm border-slate-200"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">
                        Account Number
                      </Label>
                      <Input
                        value={editForm.accountNumber}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            accountNumber: e.target.value,
                          })
                        }
                        className="h-8 text-sm font-mono border-slate-200"
                      />
                    </div>
                  </div>
                ) : acc ? (
                  <div className="flex flex-wrap gap-4 mt-1.5">
                    <span className="text-sm text-muted-foreground">
                      <span className="text-xs">Name </span>
                      <span className="font-medium text-foreground">
                        {acc.accountName}
                      </span>
                    </span>
                    <span className="rounded-lg border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-sm text-foreground">
                      {acc.accountNumber}
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No receiving account configured for this bank.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {acc ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {acc.isActive ? "Active" : "Off"}
                      </span>
                      <Switch
                        checked={acc.isActive}
                        onCheckedChange={() => toggleActive(acc)}
                        disabled={isEditing || updateAccount.isPending}
                      />
                    </div>

                    {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(null)}
                      className="h-8 text-slate-500 hover:text-slate-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveEdit(acc.id)}
                      disabled={updateAccount.isPending}
                      className="h-8"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                    ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(acc)}
                      className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAccountToDelete(acc.id)}
                      disabled={deleteAccount.isPending}
                      className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                    )}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddForBank(bank.id)}
                    disabled={!canConfigure}
                    className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Configure
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
        })}

        {banks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/15 py-16 text-center">
            <Building2 className="mx-auto mb-3 h-11 w-11 text-muted-foreground/35" />
            <p className="font-medium text-foreground text-sm">
              No banks returned
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto px-4">
              The server didn’t return any bank parser configs for this client.
            </p>
          </div>
        )}
      </div>

      <WarningDialog
        open={!!accountToDelete}
        onOpenChange={(open) => !open && setAccountToDelete(null)}
        title="Delete account"
        description={
          <>
            This removes the receiving account from your portal. Existing
            deposits are unchanged.
          </>
        }
        confirmLabel="Delete account"
        onConfirm={confirmDelete}
        isPending={deleteAccount.isPending}
        tone="destructive"
        icon={<Trash2 className="h-5 w-5" />}
      />
    </div>
  );
}
