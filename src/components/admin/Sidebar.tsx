"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { HiBell, HiArrowRightOnRectangle } from "react-icons/hi2";
import { navGroups } from "./nav-config";

/* ------------------------------------------------------------------ */
/*  Admin sidebar — uses shared nav-config for section grouping.       */
/*  Mobile <lg navigation now lives in AdminTopBar's slide-in drawer.  */
/* ------------------------------------------------------------------ */

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 bg-black min-h-[calc(100vh-3.5rem)] sticky top-14 self-start">
      {/* Admin badge */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
          Admin Console
        </div>
        <h2 className="font-heading font-black text-xl text-white tracking-tight">
          Dashboard
        </h2>
        <p className="text-[10px] text-gray-600 mt-1 font-mono tracking-tight">
          {"{{admin_auth_guard}}"}
        </p>
      </div>

      {/* Nav — grouped */}
      <nav className="px-3 flex-1 overflow-y-auto pb-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-4 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.key} className="relative">
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                        active
                          ? "bg-amber/10 text-amber border border-amber/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"
                          : "text-gray-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="admin-nav-pill"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-amber"
                        />
                      )}
                      <Icon className="text-[15px] shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            active
                              ? "bg-amber/20 text-amber"
                              : "bg-white/5 text-gray-500 group-hover:bg-white/10"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer block */}
      <div className="px-4 pb-6 pt-4 border-t border-white/5 space-y-3">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/[0.04] hover:text-white transition-all">
          <HiBell className="text-base" />
          <span>Notifications</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-amber animate-pulse" />
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/[0.04] hover:text-white transition-all">
          <HiArrowRightOnRectangle className="text-base" />
          <span>Sign out</span>
        </button>
        <div className="px-4 pt-4 border-t border-white/5">
          <p className="text-[10px] font-mono text-gray-600">
            Signed in as
          </p>
          <p className="text-xs text-gray-300 font-medium mt-0.5">admin@stratifit.com</p>
        </div>
      </div>
    </aside>
  );
}
