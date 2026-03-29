"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock network request
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Set mock cookie
    document.cookie = "localbank_session=mock_token_123; path=/";
    
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative p-4">
      {/* Background decoration */}
      <div className="absolute top-0 w-full h-[30vh] bg-gradient-to-b from-slate-200 to-slate-50 flex items-start justify-center pt-12 z-0">
        <div className="flex items-center gap-2 text-slate-400">
          <LayoutDashboard className="h-6 w-6" />
          <span className="font-semibold tracking-tight text-lg">Local Bank Payment Verification</span>
        </div>
      </div>

      <Card className="w-full max-w-sm z-10 shadow-xl border-slate-200/60 transition-all duration-300">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to your client portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@payerone.com"
                required
                className="bg-white"
                defaultValue="admin@payerone.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="bg-white"
                defaultValue="password123"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full font-medium" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-xs text-center text-slate-500">
              For integration support, contact <a href="mailto:support@localbankpv.com" className="text-slate-900 underline underline-offset-2">support</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
