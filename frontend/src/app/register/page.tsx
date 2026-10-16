"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-md mx-auto px-4 py-16 sm:py-24 w-full flex flex-col justify-center">
        <div className="tile rounded-[28px] p-8 sm:p-10 bg-card border border-line space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-ink-soft">
              Join the Kartly slow home community for saved pieces and expedited checkout
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-ink-soft">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Freja Lindqvist"
                className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-ink-soft">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-ink-soft">Password (min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-ink text-canvas hover:bg-ink/90 disabled:opacity-50 font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-ink-soft">
            Already have an account?{" "}
            <Link href="/login" className="text-ink font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
