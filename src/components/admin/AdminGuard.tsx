"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Admin auth guard wrapper.
 *
 *   {{admin_auth_guard}}
 *
 * On mount, calls GET /api/admin/session which reads the signed
 * httpOnly cookie server-side. If the cookie is present and valid, the
 * dashboard is shown; otherwise the user is hard-redirected to /login
 * (the "Welcome back" page) so the unauthed state is rendered on first
 * paint — no in-page gate card.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "authed">("loading");

  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      let ok = false;
      try {
        const res = await fetch("/api/admin/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
      if (cancelled) return;
      if (ok) {
        setState("authed");
      } else {
        // Hard navigation so /login renders on first paint with no
        // marketing chrome (header / footer are hidden on /login).
        window.location.replace("/login");
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

  return <>{children}</>;
}
