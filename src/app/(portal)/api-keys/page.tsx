"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Copy,
  Plus,
  Trash2,
  KeyRound,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ApiKeysPage() {
  const { data: apiKeysData, isLoading, error } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();

  const keys = apiKeysData?.items ?? [];
  const [newLabel, setNewLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState<{
    apiKey: string;
    apiSecret: string;
  } | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  const copy = async (text: string, label: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`${label} copied`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    if (!newLabel.trim()) {
      toast.error("Label required");
      return;
    }

    try {
      const res = await createApiKey.mutateAsync({ label: newLabel.trim() });
      setGeneratedKey(res.credentials);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate key",
      );
    }
  };

  const handleRevoke = async () => {
    if (!keyToRevoke) return;
    try {
      await revokeApiKey.mutateAsync(keyToRevoke);
      toast.success("API key revoked");
      setKeyToRevoke(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to revoke key");
    }
  };

  const closeGenerate = (open: boolean) => {
    setIsGenerateOpen(open);
    if (!open) {
      setTimeout(() => {
        setGeneratedKey(null);
        setNewLabel("");
        setShowSecret(false);
      }, 200);
    }
  };

  const fmt = (d: string | null) =>
    d ? format(new Date(d), "MMM d, yyyy") : "Never";

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading API keys...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-rose-600">Failed to load API keys.</div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            API Keys
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Authenticate your application with the LocalPay gateway.
          </p>
        </div>
        <Dialog open={isGenerateOpen} onOpenChange={closeGenerate}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm self-start sm:self-auto">
              <Plus className="mr-2 h-4 w-4" />
              Generate Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {generatedKey ? "Key Generated" : "Generate API Key"}
              </DialogTitle>
              <DialogDescription>
                {generatedKey
                  ? "Copy your secret key now. It is only returned once."
                  : "Give this key a descriptive label."}
              </DialogDescription>
            </DialogHeader>

            {!generatedKey ? (
              <div className="py-4">
                <Label htmlFor="label" className="text-sm font-medium">
                  Label
                </Label>
                <Input
                  id="label"
                  className="mt-1.5 border-slate-200"
                  placeholder="e.g. Production Server, Mobile App"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  autoFocus
                />
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                  <AlertDescription className="text-amber-800 text-sm">
                    <span className="font-semibold">
                      Save the secret key now.
                    </span>{" "}
                    You won&apos;t see it again.
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-500 uppercase tracking-wide">
                      Public Key
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        readOnly
                        value={generatedKey.apiKey}
                        className="font-mono text-xs bg-slate-50 border-slate-200"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-slate-200"
                        onClick={() =>
                          copy(generatedKey.apiKey, "Public key", "pk")
                        }
                      >
                        {copiedId === "pk" ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 uppercase tracking-wide">
                      Secret Key
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <div className="relative flex-1">
                        <Input
                          readOnly
                          value={generatedKey.apiSecret}
                          type={showSecret ? "text" : "password"}
                          className="font-mono text-xs bg-slate-50 border-slate-200 pr-9"
                        />
                        <button
                          type="button"
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-slate-200"
                        onClick={() =>
                          copy(generatedKey.apiSecret, "Secret key", "sk")
                        }
                      >
                        {copiedId === "sk" ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {!generatedKey ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsGenerateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!newLabel.trim() || createApiKey.isPending}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Generate
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsGenerateOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2"
                >
                  <Check className="h-4 w-4" />
                  I&apos;ve saved the secret key
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200 hover:bg-slate-50/80">
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                Label
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">
                Public Key
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 hidden md:table-cell">
                Last Used
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <KeyRound className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-500">
                    No API keys yet
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate your first key to get started
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow
                  key={key.id}
                  className="border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  <TableCell className="px-5 py-4">
                    <div className="font-medium text-slate-900 text-sm">
                      {key.label ?? "Untitled"}
                    </div>
                    <div className="mt-1">
                      <Badge
                        className={`text-[10px] px-1.5 shadow-none ${
                          key.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Created {fmt(key.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {key.apiKeyPreview}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-slate-500 hidden md:table-cell">
                    {fmt(key.lastUsedAt)}
                  </TableCell>
                  <TableCell className="py-4 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {key.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => setKeyToRevoke(key.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Revoke
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Revoked {fmt(key.revokedAt)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!keyToRevoke}
        onOpenChange={(o) => !o && setKeyToRevoke(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-700">
              <Trash2 className="h-5 w-5" />
              Revoke Key
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This action is permanent. Any service using this key will lose
            access immediately.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setKeyToRevoke(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={revokeApiKey.isPending}
            >
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
