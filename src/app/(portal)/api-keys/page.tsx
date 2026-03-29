"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Copy, Plus, Trash2, KeyRound } from "lucide-react";
import { mockApiKeys } from "@/lib/mock/data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { toast } from "sonner"; // we installed sonner
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


export default function ApiKeysPage() {
  const [keys, setKeys] = useState(mockApiKeys);
  const [newLabel, setNewLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState<{ apiKey: string; apiSecret: string } | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);

  const maskKey = (key: string) => {
    return `...${key.slice(-6)}`;
  };

  const handleGenerate = () => {
    if (!newLabel) {
      toast.error("Please provide a label for the API key");
      return;
    }

    const newKey = {
      apiKey: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
      apiSecret: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    };

    setGeneratedKey(newKey);
    setKeys([
      {
        id: `key-${Date.now()}`,
        clientId: "client-123",
        apiKey: newKey.apiKey,
        apiSecret: newKey.apiSecret,
        label: newLabel,
        isActive: true,
        lastUsedAt: null,
        createdAt: new Date().toISOString(),
        revokedAt: null,
      },
      ...keys,
    ]);
  };

  const handleCloseGenerate = (open: boolean) => {
    if (!open) {
      setIsGenerateOpen(false);
      // Wait for animation before clearing so UI doesn't visually glitch
      setTimeout(() => {
        setGeneratedKey(null);
        setNewLabel("");
      }, 300);
    }
  };

  const handleRevoke = () => {
    if (!keyToRevoke) return;
    
    setKeys(keys.map(k => {
      if (k.id === keyToRevoke) {
        return { ...k, isActive: false, revokedAt: new Date().toISOString() };
      }
      return k;
    }));
    
    toast.success("API key has been revoked");
    setKeyToRevoke(null);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">API Keys</h1>
          <p className="text-sm text-slate-500 mt-1">Manage API keys to authenticate your application with Local Bank Payment Verification.</p>
        </div>

        <Dialog open={isGenerateOpen} onOpenChange={handleCloseGenerate}>
          <DialogTrigger asChild>
            <Button className="shadow-sm" onClick={() => setIsGenerateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate new API key</DialogTitle>
              <DialogDescription>
                {generatedKey 
                  ? "Your new API key has been generated. Ensure you copy the secret key now."
                  : "Enter a label to help you identify this key later."}
              </DialogDescription>
            </DialogHeader>

            {!generatedKey ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Key Label</Label>
                  <Input
                    id="label"
                    placeholder="e.g. Production Subscriptions"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Please save this secret key</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>You won't be able to see it again after closing this dialog. If you lose it, you'll need to generate a new API key.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Public Key</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={generatedKey.apiKey} className="font-mono text-sm bg-slate-50" />
                    <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(generatedKey.apiKey, "Public key")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={generatedKey.apiSecret} className="font-mono text-sm bg-slate-50" />
                    <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(generatedKey.apiSecret, "Secret key")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {!generatedKey ? (
                <>
                  <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
                  <Button onClick={handleGenerate}>Generate</Button>
                </>
              ) : (
                <Button onClick={() => handleCloseGenerate(false)} className="w-full">
                  I have saved my secret key
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-slate-50">
              <TableHead className="w-[200px] font-medium text-slate-600">Label</TableHead>
              <TableHead className="font-medium text-slate-600">API Key</TableHead>
              <TableHead className="font-medium text-slate-600">Usage</TableHead>
              <TableHead className="text-right font-medium text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <KeyRound className="h-8 w-8 text-slate-300 mb-2" />
                    <p>No API keys found. Generate one to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow key={key.id} className="group border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-900">{key.label || "Unnamed Key"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-900">{key.label || "Unnamed Key"}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={key.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600 border-slate-200"}>
                          {key.isActive ? "Active" : "Revoked"}
                        </Badge>
                        <span className="text-xs text-slate-400">{format(new Date(key.createdAt), "dd MMM yyyy")}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <code className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {maskKey(key.apiKey)}
                      </code>
                      <div className="flex gap-1 text-xs text-slate-500">
                        <span>Created {format(new Date(key.createdAt), "dd MMM yyyy")}</span>
                        <span>•</span>
                        <span>{key.lastUsedAt ? format(new Date(key.lastUsedAt), "dd MMM yyyy") : "Never used"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-medium"
                        onClick={() => copyToClipboard(key.apiKey, "Public key")}
                      >
                        Copy API key
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-medium"
                        onClick={() => copyToClipboard(key.apiSecret, "Secret key")}
                      >
                        Copy secret
                      </Button>
                      {key.isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setKeyToRevoke(key.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={!!keyToRevoke} onOpenChange={(open) => !open && setKeyToRevoke(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Revoke API Key</DialogTitle>
            <DialogDescription className="text-slate-600 pt-2 text-base">
              Are you sure you want to revoke this API key? This action cannot be undone. Any integrations using this key will immediately fail to authenticate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setKeyToRevoke(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevoke}>Yes, Revoke Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
