import type { ComponentType } from "react";
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
} from "react-icons/hi2";

export type NavItem = {
  key: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/* ------------------------------------------------------------------ */
/*  Shared admin nav config — consumed by Sidebar.tsx + AdminTopBar.tsx */
/* ------------------------------------------------------------------ */

export const navGroups: NavGroup[] = [
  {
    label: "CRM & Sales",
    items: [
      { key: "dashboard", href: "/admin", icon: HiHome, label: "Overview" },
      { key: "leads", href: "/admin/leads", icon: HiUsers, label: "Leads", badge: "12" },
      { key: "subscriptions", href: "/admin/subscriptions", icon: HiEnvelope, label: "Subscriptions", badge: "248" },
      { key: "services", href: "/admin/services", icon: HiSparkles, label: "Services" },
    ],
  },
  {
    label: "Content",
    items: [
      { key: "portfolio", href: "/admin/portfolio", icon: HiBriefcase, label: "Portfolio", badge: "8" },
      { key: "insights", href: "/admin/insights", icon: HiNewspaper, label: "Insights", badge: "14" },
      { key: "buy-business", href: "/admin/buy-business", icon: HiBuildingStorefront, label: "Buy a Business", badge: "23" },
      { key: "testimonials", href: "/admin/testimonials", icon: HiChatBubbleLeftRight, label: "Testimonials", badge: "32" },
    ],
  },
  {
    label: "Site Configuration",
    items: [
      { key: "packages", href: "/admin/packages", icon: HiRectangleStack, label: "Packages" },
      { key: "faq", href: "/admin/faq", icon: HiQuestionMarkCircle, label: "FAQ" },
    ],
  },
  {
    label: "AI Bot",
    items: [
      { key: "bots-faq", href: "/admin/bots/faq", icon: HiQuestionMarkCircle, label: "FAQ Bot", badge: "12" },
      { key: "bots-coming-soon", href: "/admin/bots/coming-soon", icon: HiChatBubbleLeftRight, label: "Pre-launch Bot", badge: "8" },
    ],
  },
  {
    label: "System",
    items: [
      { key: "analytics", href: "/admin/analytics", icon: HiChartBar, label: "Analytics" },
      { key: "team", href: "/admin/team", icon: HiUserGroup, label: "Team", badge: "5" },
      { key: "activity", href: "/admin/activity", icon: HiListBullet, label: "Activity" },
      { key: "notifications", href: "/admin/notifications", icon: HiBell, label: "Notifications", badge: "3" },
      { key: "settings", href: "/admin/settings", icon: HiCog6Tooth, label: "Settings" },
    ],
  },
];
