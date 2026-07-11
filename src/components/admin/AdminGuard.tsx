"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiShieldCheck, HiArrowRight } from "react-icons/hi2";

/**
 * Admin auth guard wrapper.
 *
 *   {{admin_auth_guard}}
 *
 * On mount, calls GET /api/admin/session which reads the signed
 * httpOnly cookie server-side. If the cookie is present and valid, the
 * dashboard is shown; otherwise the "Admin Access Required" prompt is
 * shown with a button to /login. (We deliberately do not auto-redirect
 * so the user can see why they are blocked.)
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "authed" | "unauthed">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (cancelled) return;
        setState(res.ok ? "authed" : "unauthed");
      } catch {
        if (!cancelled) setState("unauthed");
      }
    }
    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full border-2 border-amber/30 border-t-amber animate-spin" />
          <p className="text-xs font-mono text-gray-500">
            {"{{admin_auth_guard}} verifying session"}
          </p>
        </motion.div>
      </div>
    );
  }

  if (state === "unauthed") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-card-dark border border-white/10 rounded-2xl p-8 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <HiShieldCheck className="text-amber text-2xl" />
          </div>
          <h2 className="font-heading font-black text-2xl text-white tracking-tight mb-2">
            Admin Access Required
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            You need to be signed in as an admin to view this section.
          </p>
          <button
            onClick={() => router.replace("/login")}
            className="group inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95 text-sm"
          >
            Sign in to continue
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
