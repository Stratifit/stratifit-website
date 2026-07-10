"use client";

import { motion } from "framer-motion";
import {
  HiUser,
  HiShieldCheck,
  HiBell,
  HiSparkles,
  HiPuzzlePiece,
  HiCurrencyDollar,
  HiCheck,
} from "react-icons/hi2";

const sections = [
  {
    id: "profile",
    title: "Profile",
    description: "Your personal info and avatar.",
    icon: HiUser,
    fields: [
      { label: "Name", placeholder: "Admin" },
      { label: "Email", placeholder: "admin@stratifit.com" },
      { label: "Phone", placeholder: "+1 555 010 0101" },
      { label: "Role", placeholder: "Owner" },
    ],
  },
  {
    id: "security",
    title: "Security",
    description: "Auth and access controls.",
    icon: HiShieldCheck,
    fields: [
      { label: "Two-factor Authentication", placeholder: "Active" },
      { label: "Active Sessions", placeholder: "1 device" },
      { label: "Backup codes", placeholder: "Regenerate" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "When should we ping you?",
    icon: HiBell,
    fields: [
      { label: "Email digest", placeholder: "Daily" },
      { label: "Slack alerts", placeholder: "Off" },
      { label: "SMS critical", placeholder: "On" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect Supabase, Stripe, Resend, Postmark.",
    icon: HiPuzzlePiece,
    fields: [
      { label: "Supabase", placeholder: "Connected" },
      { label: "Stripe", placeholder: "Awaiting key" },
      { label: "Resend (email)", placeholder: "Awaiting key" },
      { label: "Postmark", placeholder: "Off" },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    description: "Subscription and plan settings.",
    icon: HiCurrencyDollar,
    fields: [
      { label: "Plan", placeholder: "Scale · $9,200/mo" },
      { label: "Next invoice", placeholder: "2026-08-01" },
      { label: "Card on file", placeholder: "•••• •••• •••• 4242" },
    ],
  },
  {
    id: "branding",
    title: "Branding",
    description: "Site-wide default tokens.",
    icon: HiSparkles,
    fields: [
      { label: "Primary accent", placeholder: "#F59E0B" },
      { label: "Heading font", placeholder: "Satoshi" },
      { label: "Body font", placeholder: "Inter" },
      { label: "Logo wordmark", placeholder: "/stratifit.svg" },
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] font-bold text-amber uppercase tracking-[0.25em] mb-2">
          Account
        </p>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Profile, security, notifications, integrations, billing, and branding.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-5">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card-dark rounded-2xl border border-white/5 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center">
                  <Icon className="text-amber text-base" />
                </div>
                <div>
                  <p className="text-[9px] font-mono text-gray-600">
                    {`{{setting.${section.id}}}`}
                  </p>
                  <h2 className="font-heading font-bold text-lg text-white">{section.title}</h2>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-5">{section.description}</p>
              <div className="space-y-3">
                {section.fields.map((f) => (
                  <div key={f.label}>
                    <p className="text-[9px] font-mono text-gray-600 mb-1 pl-1">
                      {`{{setting.${section.id}.${f.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}}}`}
                    </p>
                    <input
                      placeholder={f.placeholder}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-amber/50 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-card-light text-black font-bold rounded-xl hover:bg-amber-light transition-all text-xs active:scale-95">
                <HiCheck /> Save changes
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
