"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Copy, Plus, Trash2, KeyRound, Check, AlertCircle } from "lucide-react";
import { mockApiKeys } from "@/lib/mock/data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GatewayApiKey } from "@/lib/types";

interface GeneratedKey {
  apiKey: string;
  apiSecret: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<GatewayApiKey[]>(mockApiKeys);
  const [newLabel, setNewLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState<GeneratedKey | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper functions
  const maskKey = (key: string): string => `••••••${key.slice(-6)}`;
  
  const generateRandomString = (length: number): string => 
    Math.random().toString(36).substring(2, 2 + length);

  const generateApiKeys = (): GeneratedKey => ({
    apiKey: `pk_live_${generateRandomString(13)}`,
    apiSecret: `sk_live_${generateRandomString(13)}${generateRandomString(13)}`,
  });

  const copyToClipboard = async (text: string, type: string, keyId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId || type);
      toast.success(`${type} copied to clipboard`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleGenerate = () => {
    if (!newLabel.trim()) {
      toast.error("Please provide a label for the API key");
      return;
    }

    const newKeys = generateApiKeys();
    setGeneratedKey(newKeys);
    
    const newApiKey: GatewayApiKey = {
      id: `key-${Date.now()}`,
      clientId: "client-123",
      apiKey: newKeys.apiKey,
      apiSecret: newKeys.apiSecret,
      label: newLabel.trim(),
      isActive: true,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      revokedAt: null,
    };
    
    setKeys([newApiKey, ...keys]);
  };

  const handleRevoke = () => {
    if (!keyToRevoke) return;
    
    setKeys(keys.map(key => 
      key.id === keyToRevoke 
        ? { ...key, isActive: false, revokedAt: new Date().toISOString() }
        : key
    ));
    
    toast.success("API key has been revoked");
    setKeyToRevoke(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsGenerateOpen(open);
    if (!open) {
      setTimeout(() => {
        setGeneratedKey(null);
        setNewLabel("");
      }, 200);
    }
  };

  const formatDate = (date: string | null): string => {
    if (!date) return "Never";
    return format(new Date(date), "MMM dd, yyyy");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            API Keys
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage API keys to authenticate your application with Local Bank Payment Verification.
          </p>
        </div>

        <Dialog open={isGenerateOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="shadow-sm gap-2">
              <Plus className="h-4 w-4" />
              Generate New Key
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {generatedKey ? "API Key Generated" : "Generate New API Key"}
              </DialogTitle>
              <DialogDescription>
                {generatedKey 
                  ? "Copy your secret key now. You won&apos;t be able to see it again."
                  : "Enter a label to help identify this API key."}
              </DialogDescription>
            </DialogHeader>

            {!generatedKey ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Key Label</Label>
                  <Input
                    id="label"
                    placeholder="e.g., Production Server, Mobile App"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <Alert variant="default" className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-800" />
                  <AlertDescription className="text-amber-800">
                    <p className="font-medium">Save this secret key</p>
                    <p className="text-sm mt-1">
                      This is the only time you&apos;ll see it. If you lose it, you&apos;ll need to generate a new key pair.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-slate-600">Public Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        readOnly 
                        value={generatedKey.apiKey} 
                        className="font-mono text-sm bg-slate-50"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedKey.apiKey, "Public key")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-slate-600">Secret Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        readOnly 
                        value={generatedKey.apiSecret} 
                        className="font-mono text-sm bg-slate-50"
                        type="password"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedKey.apiSecret, "Secret key")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {!generatedKey ? (
                <>
                  <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerate} disabled={!newLabel.trim()}>
                    Generate Key
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsGenerateOpen(false)} className="w-full gap-2">
                  <Check className="h-4 w-4" />
                  I&apos;ve Saved the Secret Key
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="w-[200px]">Label</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Usage Info</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <KeyRound className="h-12 w-12 text-slate-300 mb-3" />
                    <p className="font-medium">No API keys found</p>
                    <p className="text-sm">Generate your first API key to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow key={key.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium align-top">
                    <div className="space-y-2">
                      <span className="text-slate-900">{key.label}</span>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={key.isActive ? "default" : "secondary"}>
                          {key.isActive ? "Active" : "Revoked"}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          Created {formatDate(key.createdAt)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="align-top">
                    <code className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded select-all">
                      {maskKey(key.apiKey)}
                    </code>
                  </TableCell>
                  
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">
                        Last used: <span className="font-mono text-xs">
                          {formatDate(key.lastUsedAt)}
                        </span>
                      </p>
                      {key.revokedAt && (
                        <p className="text-xs text-red-600">
                          Revoked: {formatDate(key.revokedAt)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right align-top">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(key.apiKey, "API key", key.id)}
                        className="gap-1"
                      >
                        {copiedKey === key.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span className="text-xs">API Key</span>
                      </Button>
                      
                      {key.isActive && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.apiSecret, "Secret key", `secret-${key.id}`)}
                            className="gap-1"
                          >
                            {copiedKey === `secret-${key.id}` ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span className="text-xs">Secret</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                            onClick={() => setKeyToRevoke(key.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="text-xs">Revoke</span>
                          </Button>
                        </>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Revoke API Key
            </DialogTitle>
            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
              <p className="text-slate-700">
                Are you sure you want to revoke this API key? This action <span className="font-semibold">cannot be undone</span>.
              </p>
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                ⚠️ Any applications using this key will immediately lose access.
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setKeyToRevoke(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke}>
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}