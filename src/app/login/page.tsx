"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowRight, HiShieldCheck, HiSparkles } from "react-icons/hi2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // STUB: replace with Supabase auth.signInWithPassword call
    setTimeout(() => {
      window.location.href = "/admin";
    }, 600);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-amber/3 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-amber items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <HiSparkles className="text-black text-2xl" />
          </div>
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.3em] mb-3">
            Admin Login
          </p>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400">
            Sign in to manage the Stratifit dashboard.
            <br />
            {/* {{admin_auth_guard}} */}
            <span className="font-mono text-[9px] text-gray-600">
              {"{{admin_auth_guard}}"}
            </span>
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-card-dark rounded-2xl border border-white/10 p-7 shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stratifit.com"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] active:scale-95 text-sm disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <HiArrowRight className="text-sm" />}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <HiShieldCheck className="text-amber text-sm" />
            Protected by Supabase Auth · stub
          </div>
        </form>

        <p className="mt-6 text-center text-[10px] text-gray-500">
          <Link href="/" className="hover:text-amber transition-colors">
            ← Back to site
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
