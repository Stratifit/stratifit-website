"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiHome,
  HiUsers,
  HiEnvelope,
  HiSparkles,
  HiBriefcase,
  HiNewspaper,
  HiBuildingStorefront,
  HiChatBubbleLeftRight,
  HiRectangleStack,
  HiQuestionMarkCircle,
  HiChartBar,
  HiUserGroup,
  HiListBullet,
  HiBell,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

/* ------------------------------------------------------------------ */
/*  Admin sidebar nav — grouped (CRM · Content · Site · System)        */
/* ------------------------------------------------------------------ */
const navGroups = [
  {
    label: "CRM & Sales",
    items: [
      { key: "dashboard", href: "/admin", placeholder: "{{nav_dashboard}}", icon: HiHome, label: "Overview" },
      { key: "leads", href: "/admin/leads", placeholder: "{{nav_leads}}", icon: HiUsers, label: "Leads", badge: "12" },
      { key: "subscriptions", href: "/admin/subscriptions", placeholder: "{{nav_subscriptions}}", icon: HiEnvelope, label: "Subscriptions", badge: "248" },
      { key: "services", href: "/admin/services", placeholder: "{{nav_services}}", icon: HiSparkles, label: "Services" },
    ],
  },
  {
    label: "Content",
    items: [
      { key: "portfolio", href: "/admin/portfolio", placeholder: "{{nav_portfolio}}", icon: HiBriefcase, label: "Portfolio", badge: "8" },
      { key: "insights", href: "/admin/insights", placeholder: "{{nav_insights}}", icon: HiNewspaper, label: "Insights", badge: "14" },
      { key: "buy-business", href: "/admin/buy-business", placeholder: "{{nav_buy_business}}", icon: HiBuildingStorefront, label: "Buy a Business", badge: "23" },
      { key: "testimonials", href: "/admin/testimonials", placeholder: "{{nav_testimonials}}", icon: HiChatBubbleLeftRight, label: "Testimonials", badge: "32" },
    ],
  },
  {
    label: "Site Configuration",
    items: [
      { key: "packages", href: "/admin/packages", placeholder: "{{nav_packages}}", icon: HiRectangleStack, label: "Packages" },
      { key: "faq", href: "/admin/faq", placeholder: "{{nav_faq}}", icon: HiQuestionMarkCircle, label: "FAQ", badge: "12" },
    ],
  },
  {
    label: "System",
    items: [
      { key: "analytics", href: "/admin/analytics", placeholder: "{{nav_analytics}}", icon: HiChartBar, label: "Analytics" },
      { key: "team", href: "/admin/team", placeholder: "{{nav_team}}", icon: HiUserGroup, label: "Team", badge: "5" },
      { key: "activity", href: "/admin/activity", placeholder: "{{nav_activity}}", icon: HiListBullet, label: "Activity" },
      { key: "notifications", href: "/admin/notifications", placeholder: "{{nav_notifications}}", icon: HiBell, label: "Notifications", badge: "3" },
      { key: "settings", href: "/admin/settings", placeholder: "{{nav_settings}}", icon: HiCog6Tooth, label: "Settings" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 bg-black min-h-[calc(100vh-4rem)] sticky top-16 self-start">
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

/**
 * Mobile / tablet sidebar — rendered as a top tab strip
 */
export function SidebarMobileTabs() {
  const allItems = navGroups.flatMap((g) => g.items);
  return (
    <nav className="lg:hidden border-b border-white/5 bg-black/95 backdrop-blur-xl sticky top-16 z-30">
      <ul className="flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar">
        {allItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.key} className="shrink-0">
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-transparent whitespace-nowrap"
              >
                <Icon className="text-[13px]" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
