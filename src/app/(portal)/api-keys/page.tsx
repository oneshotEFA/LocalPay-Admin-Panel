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
import { ListPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ApiKeysPage() {
  const { data: apiKeysData, error, refetch, isPending } = useApiKeys();
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

  if (!apiKeysData && isPending) {
    return <ListPageSkeleton rows={6} />;
  }

  if (!apiKeysData && error) {
    return (
      <QueryError
        title="Couldn’t load API keys"
        message="We couldn’t reach the server. Try again in a moment."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      <PageHeader
        title="API keys"
        description="Issue and rotate credentials for your backend. Keys authenticate every call to the LocalPay gateway."
        action={
          <Dialog open={isGenerateOpen} onOpenChange={closeGenerate}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-xl shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Generate key
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
                  >
                    Generate
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsGenerateOpen(false)}
                  className="w-full gap-2"
                >
                  <Check className="h-4 w-4" />
                  I&apos;ve saved the secret key
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Label
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Public key
              </TableHead>
              <TableHead className="hidden py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                Last used
              </TableHead>
              <TableHead className="py-3.5 pr-5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-44 text-center">
                  <KeyRound className="mx-auto mb-2 h-9 w-9 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-foreground">
                    No keys yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create a key to call the gateway from your servers.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow
                  key={key.id}
                  className="border-border/50 transition-colors hover:bg-muted/35"
                >
                  <TableCell className="px-5 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {key.label ?? "Untitled"}
                    </div>
                    <div className="mt-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium shadow-none ${
                          key.isActive
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Created {fmt(key.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <code className="rounded-lg border border-border/80 bg-muted/50 px-2 py-1 font-mono text-xs text-foreground">
                      {key.apiKeyPreview}
                    </code>
                  </TableCell>
                  <TableCell className="hidden py-4 text-sm text-muted-foreground md:table-cell">
                    {fmt(key.lastUsedAt)}
                  </TableCell>
                  <TableCell className="py-4 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {key.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg text-xs text-destructive hover:bg-destructive/10"
                          onClick={() => setKeyToRevoke(key.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Revoke
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
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
          <p className="text-sm text-muted-foreground">
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
