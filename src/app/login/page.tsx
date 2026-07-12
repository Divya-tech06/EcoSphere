"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full max-w-md bg-[#141414] rounded-xl border border-white/10 p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <Leaf className="w-6 h-6 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome to EcoSphere</h1>
          <p className="text-sm text-gray-400">Sign in to manage ESG metrics & challenges</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. employee@ecosphere.local"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Quick Testing Login Grid */}
        <div className="border-t border-white/5 pt-6 space-y-3">
          <p className="text-center text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
            Quick demo account sign in
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillCredentials("admin@ecosphere.local")}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-medium py-1.5 px-2 rounded transition-colors text-center"
            >
              Admin
            </button>
            <button
              onClick={() => fillCredentials("marcus.v@ecosphere.local")}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-medium py-1.5 px-2 rounded transition-colors text-center"
            >
              Approver
            </button>
            <button
              onClick={() => fillCredentials("john.d@ecosphere.local")}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-medium py-1.5 px-2 rounded transition-colors text-center"
            >
              Employee
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
