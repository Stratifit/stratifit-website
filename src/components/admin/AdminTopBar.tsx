"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiArrowRightOnRectangle,
  HiArrowTopRightOnSquare,
  HiUser,
  HiBars3,
  HiXMark,
  HiChevronRight,
} from "react-icons/hi2";
import { navGroups } from "./nav-config";

/**
 * Admin top bar — replaces the public-site header on /admin/* pages.
 *
 * Mobile (<lg):
 *   LEFT: hamburger button        CENTER: SF + Stratifit wordmark
 *   RIGHT: profile chip — opens popover with email / View Live Site / Sign out
 *   The hamburger opens a slide-in drawer that lists every nav section,
 *   matching the desktop sidebar's grouping.
 *
 * Desktop (lg+):
 *   LEFT: SF + Stratifit + Admin badge
 *   RIGHT: View Live Site link · email · inline Sign out button
 *
 * h-14 (56px). The admin layout pads pt-14 and the Sidebar sticks at top-14
 * to clear this bar.
 */
export function AdminTopBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  /* Close menu/popover on navigation — handled by `onClick` handlers on the
   * nav links themselves, so no separate pathname effect is needed. */

  /* Body scroll lock while the mobile drawer is open */
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  /* Outside click closes the profile popover */
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  /* Sign out — calls the logout endpoint to clear the session cookie,
     then hard-navigates to /login so server-side guards see the new
     unauthed state on first paint. */
  const handleSignOut = async (closeProfile: boolean) => {
    if (closeProfile) setProfileOpen(false);
    try {
      await fetch("/api/admin/login", { method: "DELETE", credentials: "same-origin" });
    } catch {
      /* ignore — still redirect so the user is logged out client-side */
    }
    window.location.href = "/login";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 h-14">
        <div className="h-full px-4 sm:px-6 flex items-center gap-3 sm:gap-4 relative">
          {/* Mobile: hamburger LEFT (others hidden on mobile) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-white hover:text-amber transition-colors active:scale-95"
            aria-label="Open admin menu"
          >
            <HiBars3 className="text-xl" />
          </button>

          {/* Desktop: Logo + Admin badge on the left */}
          <Link
            href="/admin"
            className="hidden lg:flex items-center gap-3 group shrink-0"
            aria-label="Stratifit Admin · Dashboard"
          >
            <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <span className="text-black font-black text-xs tracking-tighter">SF</span>
            </div>
            <div className="flex items-center gap-2 -mt-0.5">
              <span className="font-heading font-black text-base tracking-tight uppercase text-white">
                Stratifit
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/10 border border-amber/30 text-[9px] font-bold text-amber uppercase tracking-[0.18em]">
                <span className="w-1 h-1 rounded-full bg-amber animate-pulse" />
                Admin
              </span>
            </div>
          </Link>

          {/* Mobile: Logo CENTER (absolutely positioned over the row) */}
          <Link
            href="/admin"
            className="lg:hidden flex items-center gap-2 absolute left-1/2 -translate-x-1/2 pointer-events-auto"
            aria-label="Stratifit Admin · Dashboard"
          >
            <div className="w-7 h-7 bg-amber rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.25)]">
              <span className="text-black font-black text-[10px] tracking-tighter">SF</span>
            </div>
            <span className="font-heading font-black text-sm tracking-tight uppercase text-white whitespace-nowrap">
              Stratifit
            </span>
          </Link>

          {/* Right cluster: pushed to the far right via ml-auto */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Desktop-only: View Live Site inline link */}
            <Link
              href="/"
              target="_blank"
              className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-amber transition-colors px-2 py-1 rounded-lg"
            >
              <HiArrowTopRightOnSquare className="text-xs" />
              View Live Site
            </Link>
            <span className="hidden lg:block h-5 w-px bg-white/10" />

            {/* Profile chip — shared between mobile popover and desktop inline */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                <div className="w-8 h-8 rounded-full bg-amber/15 border border-amber/30 flex items-center justify-center shadow-[inset_0_0_8px_rgba(245,158,11,0.15)]">
                  <HiUser className="text-amber text-xs" />
                </div>
                <span className="hidden md:inline text-[11px] text-gray-300 font-medium">
                  admin@stratifit.com
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-64 bg-card-dark rounded-xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] z-[60] overflow-hidden"
                    role="menu"
                  >
                    <div className="p-3.5 border-b border-white/5">
                      <p className="text-[10px] font-mono text-gray-500 mb-0.5">Signed in as</p>
                      <p className="text-sm text-white font-medium truncate">admin@stratifit.com</p>
                    </div>
                    <nav className="p-1.5 flex flex-col gap-0.5">
                      <Link
                        href="/"
                        target="_blank"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        role="menuitem"
                      >
                        <HiArrowTopRightOnSquare className="text-base text-amber" />
                        View Live Site
                      </Link>
                      <div className="h-px bg-white/5 my-0.5" />
                      <button
                        type="button"
                        onClick={() => void handleSignOut(true)}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-bold text-gray-300 hover:bg-amber/10 hover:text-amber transition-colors text-left"
                        role="menuitem"
                      >
                        <HiArrowRightOnRectangle className="text-base" />
                        Sign out
                      </button>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop-only: inline Sign out button (mobile users go via profile popover) */}
            <button
              type="button"
              onClick={() => void handleSignOut(false)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-gray-300 hover:text-white hover:border-white/20 transition-all active:scale-95"
            >
              <HiArrowRightOnRectangle className="text-xs" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* Mobile drawer — slides in from the left with all nav sections  */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[min(85vw,20rem)] bg-black border-r border-white/10 lg:hidden flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
              role="dialog"
              aria-label="Admin navigation"
            >
              {/* Drawer header — brand + close */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-white/10 shrink-0">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                    <span className="text-black font-black text-xs tracking-tighter">SF</span>
                  </div>
                  <div className="flex items-center gap-2 -mt-0.5">
                    <span className="font-heading font-black text-base tracking-tight uppercase text-white">
                      Stratifit
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber/10 border border-amber/30 text-[8px] font-bold text-amber uppercase tracking-[0.18em]">
                      Admin
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                >
                  <HiXMark className="text-xl" />
                </button>
              </div>

              {/* Nav groups */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {navGroups.map((group) => (
                  <div key={group.label} className="mb-5 last:mb-2">
                    <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      {group.label}
                    </p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active =
                          pathname === item.href ||
                          (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                          <li key={item.key} className="relative">
                            <Link
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                                active
                                  ? "bg-amber/10 text-amber border border-amber/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"
                                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                              }`}
                              aria-current={active ? "page" : undefined}
                            >
                              {active && (
                                <motion.span
                                  layoutId="mobile-nav-pill"
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
                              <HiChevronRight
                                className={`text-base shrink-0 ml-1 transition-opacity ${
                                  active ? "opacity-60 text-amber" : "opacity-30 group-hover:opacity-60"
                                }`}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Footer signed-in chip */}
              <div className="px-4 py-4 border-t border-white/10 shrink-0">
                <p className="text-[10px] font-mono text-gray-600">Signed in as</p>
                <p className="text-xs text-gray-300 font-medium mt-0.5 truncate">
                  admin@stratifit.com
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
