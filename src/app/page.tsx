"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChatBubbleLeftRight,
  HiArrowRight,
  HiGlobeAlt,
  HiShieldCheck,
  HiCheckCircle,
  HiEnvelope,
  HiXMark,
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";
import { ComingSoonAIChat } from "@/components/chat/ComingSoonAIChat";
import { LanguageDropdown } from "@/components/layout/LanguageDropdown";
import { useCms } from "@/lib/use-cms";
import { tLabel } from "@/lib/stratifit-i18n";
import { useLanguage } from "@/lib/LanguageContext";
import { t, type SiteSettings } from "@/lib/cms-types";
import {
  MdDiamond,
  MdDesignServices,
  MdCode,
  MdRocketLaunch,
} from "react-icons/md";
/* ------------------------------------------------------------------ */
/*  Lazy-loaded real homepage sections                                */
/* ------------------------------------------------------------------ */

const Hero = dynamic(() => import("@/components/sections/Hero").then((m) => ({ default: m.Hero })), { ssr: true });
const CoreServices = dynamic(() => import("@/components/sections/CoreServices").then((m) => ({ default: m.CoreServices })), { ssr: true });
const Process = dynamic(() => import("@/components/sections/Process").then((m) => ({ default: m.Process })), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs").then((m) => ({ default: m.WhyChooseUs })), { ssr: true });
const Insights = dynamic(() => import("@/components/sections/Insights").then((m) => ({ default: m.Insights })), { ssr: true });
const Portfolio = dynamic(() => import("@/components/sections/Portfolio").then((m) => ({ default: m.Portfolio })), { ssr: true });
const BuyBusinessSection = dynamic(() => import("@/components/sections/BuyBusinessSection").then((m) => ({ default: m.BuyBusinessSection })), { ssr: true });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then((m) => ({ default: m.Testimonials })), { ssr: true });
const Packages = dynamic(() => import("@/components/sections/Packages").then((m) => ({ default: m.Packages })), { ssr: true });
const FAQ = dynamic(() => import("@/components/sections/FAQ").then((m) => ({ default: m.FAQ })), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => ({ default: m.Contact })), { ssr: true });

/* ------------------------------------------------------------------ */
/*  Coming‑Soon Gate                                                  */
/* ------------------------------------------------------------------ */

type ServiceTile = {
  titleKey: string;
  descKey: string;
  deliverableKeys: string[];
  icon: React.ElementType;
};

/* Order & shape are fixed across languages — only the strings swap.
   The keys reference translations added in src/lib/stratifit-i18n.ts. */
const services: ServiceTile[] = [
  {
    titleKey: "service_brand_title",
    descKey: "service_brand_desc",
    deliverableKeys: ["service_brand_d1", "service_brand_d2", "service_brand_d3", "service_brand_d4"],
    icon: MdDiamond,
  },
  {
    titleKey: "service_website_title",
    descKey: "service_website_desc",
    deliverableKeys: ["service_website_d1", "service_website_d2", "service_website_d3", "service_website_d4"],
    icon: MdDesignServices,
  },
  {
    titleKey: "service_ai_title",
    descKey: "service_ai_desc",
    deliverableKeys: ["service_ai_d1", "service_ai_d2", "service_ai_d3", "service_ai_d4"],
    icon: MdCode,
  },
  {
    titleKey: "service_growth_title",
    descKey: "service_growth_desc",
    deliverableKeys: ["service_growth_d1", "service_growth_d2", "service_growth_d3", "service_growth_d4"],
    icon: MdRocketLaunch,
  },
  {
    titleKey: "service_buy_biz_title",
    descKey: "service_buy_biz_desc",
    deliverableKeys: ["service_buy_biz_d1", "service_buy_biz_d2", "service_buy_biz_d3", "service_buy_biz_d4"],
    icon: HiGlobeAlt,
  },
  {
    titleKey: "service_funnel_title",
    descKey: "service_funnel_desc",
    deliverableKeys: ["service_funnel_d1", "service_funnel_d2", "service_funnel_d3", "service_funnel_d4"],
    icon: HiShieldCheck,
  },
];

const TARGET_DATE = new Date("2026-08-10T00:00:00");

/* ------------------------------------------------------------------ */
/*  Coming Soon header — logo icon (no label) + language dropdown    */
/* ------------------------------------------------------------------ */

function ComingSoonHeader() {
  // Pull logo text from CMS (same source as main Header); fallback to "SF"
  const { data: cmsSettings } = useCms<SiteSettings>("site_settings", { fallback: undefined });
  const logoText = cmsSettings?.logo_text || "SF";
  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-black border-b border-white/5 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between">
        {/* Left: logo icon (no label) */}
        <a
          href="/"
          aria-label="Stratifit home"
          className="pointer-events-auto flex items-center group shrink-0"
        >
          <div className="w-9 h-9 bg-amber rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <span className="text-black font-black text-xs tracking-tighter">{logoText}</span>
          </div>
        </a>
        {/* Right: language dropdown (compact, matches mobile header style) */}
        <div className="pointer-events-auto">
          <LanguageDropdown size="sm" />
        </div>
      </div>
    </div>
  );
}

function ComingSoonGate({ onUnlock }: { onUnlock: () => void }) {
  const { lang } = useLanguage();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  // Refs used by ComingSoonAIChat to scroll the gate into the right region after a CTA
  const notifySectionRef = useRef<HTMLElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);

  // Services carousel (mobile)
  const servicesScrollRef = useRef<HTMLDivElement>(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const handleServicesScroll = () => {
    const el = servicesScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActiveServiceIndex(0);
      return;
    }
    const idx = Math.round((el.scrollLeft / maxScroll) * (services.length - 1));
    setActiveServiceIndex(Math.max(0, Math.min(idx, services.length - 1)));
  };

  useEffect(() => {
    // Initialize active-index state after mount (covers resize too)
    const id = window.setTimeout(handleServicesScroll, 0);
    window.addEventListener("resize", handleServicesScroll);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", handleServicesScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide layout-footer while gate is active (body class avoids flash)
  useEffect(() => {
    document.body.classList.add("gate-active");
    return () => {
      document.body.classList.remove("gate-active");
    };
  }, []);

  // Live 1-month countdown
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = TARGET_DATE.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const GATE_PASSWORD = "7652";

  const handlePasswordSubmit = () => {
    if (password.trim() === GATE_PASSWORD) {
      setPasswordError(null);
      onUnlock();
    } else {
      setPasswordError(tLabel("password_error", lang));
    }
  };

  const handleNotifySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || notifySubmitting) return;
    setNotifySubmitting(true);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lang: typeof window !== "undefined"
            ? (document.documentElement.lang || "en")
            : "en",
          source: "coming_soon_page",
        }),
      });
      // Always show the thank-you modal so the user-facing flow
      // works regardless of DB / Supabase config status. The API
      // route already handles 503s gracefully; we just don't surface
      // them to the user.
      if (!res.ok) {
        console.warn("notify submit non-ok status", res.status);
      }
    } catch (err) {
      // Network error — still show the thank-you modal so the UX
      // doesn't break. The submission can be retried later.
      console.warn("notify submit failed", err);
    } finally {
      setNotifySubmitting(false);
      setNotifyModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Coming Soon header — logo icon (no label) + language dropdown */}
      <ComingSoonHeader />

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Blueprint / dot grid texture — sits deep behind everything */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Vertical light sweep */}
        <div className="absolute top-[-40%] left-[44%] sm:left-[42%] w-[2px] h-[80vh] bg-gradient-to-b from-transparent via-amber/30 to-transparent aurora-sweep-v" />

        {/* Subtle horizontal light sweep */}
        <div className="absolute inset-x-[-30%] top-[58%] h-[3px] bg-gradient-to-r from-transparent via-amber/40 to-transparent aurora-sweep" />

        {/* Original amber glow orbs — the bg sits in front of the deep animations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-amber/3 rounded-full blur-[120px]" />

        {/* Top + bottom edge fade for depth */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 md:py-24 lg:py-32 flex flex-col justify-center min-h-screen lg:min-h-0">
        {/* Hero */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[0.95] tracking-tight mb-6 whitespace-nowrap">
              {tLabel("coming_soon_prefix", lang)} <span className="text-amber">{tLabel("coming_soon_highlight", lang)}</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 whitespace-nowrap">
              {tLabel("coming_soon_subheading", lang)}
            </p>
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-4 sm:gap-6 bg-card-dark rounded-2xl px-6 py-4 border border-white/5">
              {[
                { value: timeLeft?.days, label: tLabel("countdown_days", lang) },
                { value: timeLeft?.hours, label: tLabel("countdown_hours", lang) },
                { value: timeLeft?.minutes, label: tLabel("countdown_minutes", lang) },
                { value: timeLeft?.seconds, label: tLabel("countdown_seconds", lang) },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center min-w-[44px] sm:min-w-[60px]">
                    <motion.span
                      animate={{ scale: [1, 1], opacity: 1 }}
                      className="block font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tabular-nums"
                    >
                      {timeLeft ? String(item.value!).padStart(2, "0") : "--"}
                    </motion.span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <span className="text-amber font-bold text-xl sm:text-2xl">:</span>
                  )}
                </div>
              ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Password Access */}
        <section className="">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-gray-400 text-sm mb-4">{tLabel("password_prompt", lang)}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handlePasswordSubmit(); }}
                placeholder={tLabel("password_placeholder", lang)}
                className={`flex-1 bg-card-dark border rounded-xl px-5 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-colors ${
                  passwordError ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-amber/50"
                }`}
              />
              <button onClick={handlePasswordSubmit} className="px-8 py-3.5 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all active:scale-95 shrink-0">
                {tLabel("password_view_btn", lang)}
              </button>
            </div>
            {passwordError && (
              <p className="mt-3 text-xs text-red-400 font-medium flex items-center gap-2 lg:justify-start justify-center">
                <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                {passwordError}
              </p>
            )}
          </motion.div>
        </section>

        {/* Services — same card design as CoreServices, scrollable carousel on mobile */}
        <section ref={servicesSectionRef} className="mt-12 md:mt-16 mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center lg:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight tracking-tight mb-3">{tLabel("services_title_prefix", lang)} <span className="text-amber">{tLabel("services_title_highlight", lang)}</span></h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              {tLabel("services_subtitle", lang)}
            </p>
          </motion.div>

          <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
            <div
              ref={servicesScrollRef}
              onScroll={handleServicesScroll}
              className="overflow-x-auto no-scrollbar md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 md:pb-0"
            >
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((svc, i) => (
                  <motion.div
                    key={svc.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="group bg-card-dark rounded-[32px] p-7 border border-white/5 hover:border-amber/20 transition-all duration-500 shadow-xl shadow-black/50 relative overflow-hidden flex flex-col shrink-0 w-[calc(100vw-3rem)] sm:w-[calc(100vw-3rem)] md:w-auto snap-center"
                  >
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all duration-500 pointer-events-none" />
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <svc.icon className="text-amber text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-2xl text-white mb-2 tracking-tight">{tLabel(svc.titleKey, lang)}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">{tLabel(svc.descKey, lang)}</p>
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-amber font-bold mb-4 opacity-90">{tLabel("key_deliverables", lang)}</p>
                        <ul className="space-y-3">
                          {svc.deliverableKeys.map((key) => (
                            <li key={key} className="flex items-start gap-3">
                              <HiCheckCircle className="text-amber text-lg shrink-0 mt-[-1px]" />
                              <span className="text-sm text-gray-300 font-medium">{tLabel(key, lang)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-1" />
                      <button
                        onClick={() => setChatOpen(true)}
                        className="mt-2 w-full py-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-amber hover:bg-amber/5 hover:border-amber/30 transition-all group/link"
                      >
                        {tLabel("btn_learn_more", lang)}
                        <HiArrowRight className="text-lg group-hover/link:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: Dot Pagination */}
            <div className="md:hidden flex items-center justify-center gap-1.5 mt-3" aria-hidden="true">
              {services.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ease-out ${
                    i === activeServiceIndex ? "bg-amber" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Notify Me */}
        <section ref={notifySectionRef} className="mt-2 md:mt-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-gray-400 text-sm mb-4">{tLabel("notify_prompt", lang)}</p>
            <form
              onSubmit={handleNotifySubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tLabel("notify_placeholder", lang)}
                disabled={notifySubmitting}
                className="flex-1 bg-card-dark border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={notifySubmitting || !email}
                className="px-8 py-3.5 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {notifySubmitting ? tLabel("notify_submitting", lang) : tLabel("notify_btn", lang)}
              </button>
            </form>
          </motion.div>
        </section>

        {/* Contact Box */}
        <section className="mt-6 md:mt-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-gray-400 text-sm mb-4">{tLabel("contact_direct_prompt", lang)}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 bg-card-dark border border-white/10 rounded-xl px-5 py-3.5 text-gray-500 text-sm">
                <HiEnvelope className="text-base text-amber/70 shrink-0" />
                <span>{tLabel("contact_placeholder_text", lang)}</span>
              </div>
              <button
                onClick={openContactModal}
                className="px-8 py-3.5 bg-card-dark border border-amber/40 text-amber font-bold text-sm rounded-xl hover:bg-amber/10 hover:border-amber transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2"
              >
                {tLabel("contact_send_btn", lang)}
                <HiArrowRight className="text-sm" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Floating Chat Bubble — bottom-right */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-amber text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-110 active:scale-95 transition-all"
          aria-label="Open chat"
        >
          <HiChatBubbleLeftRight className="text-xl" />
        </button>

        {/* Coming Soon AI panel — replaces the inline chat panel with the dedicated pre-launch concierge */}
        <AnimatePresence>
          {chatOpen && (
            <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setChatOpen(false)}
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
                className="relative z-10 w-full sm:max-w-lg flex flex-col h-[80vh] max-h-[90vh]"
              >
                <ComingSoonAIChat
                  onClose={() => setChatOpen(false)}
                  scrollToSubscribe={() => notifySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  scrollToServices={() => servicesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Notify thank-you modal — shown after the user submits their email.
            Always shown regardless of API outcome so the user-facing flow
            works even when Supabase is not yet configured. */}
        <AnimatePresence>
          {notifyModalOpen && (
            <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={() => setNotifyModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 24, stiffness: 240 }}
                className="relative z-10 w-full sm:max-w-md bg-card-dark rounded-2xl border border-amber/20 overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
                <button
                  onClick={() => setNotifyModalOpen(false)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close"
                >
                  <HiXMark className="text-lg" />
                </button>

                <div className="px-6 sm:px-8 py-8 sm:py-10 text-center">
                  {/* Animated checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", damping: 12, stiffness: 200 }}
                    className="mx-auto w-16 h-16 rounded-full bg-amber/15 border border-amber/30 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-5"
                  >
                    <HiCheckCircle className="text-amber text-3xl" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight"
                  >
                    {tLabel("notify_modal_heading", lang)}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    className="text-gray-300 text-sm sm:text-base leading-relaxed mt-3 max-w-sm mx-auto"
                  >
                    {tLabel("notify_modal_body", lang)}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[11px] text-amber/80 uppercase tracking-[0.18em] font-bold mt-5"
                  >
                    {tLabel("notify_modal_cant_wait", lang)}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-col sm:flex-row gap-2 mt-3"
                  >
                    <button
                      onClick={() => {
                        setNotifyModalOpen(false);
                        openContactModal();
                      }}
                      className="flex-1 px-5 py-3 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <HiChatBubbleLeftRight className="text-base" />
                      {tLabel("notify_modal_contact_btn", lang)}
                    </button>
                    <button
                      onClick={() => setNotifyModalOpen(false)}
                      className="px-5 py-3 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-all active:scale-95"
                    >
                      {tLabel("notify_modal_close_btn", lang)}
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Root Page — gate or real site                                     */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <ComingSoonGate onUnlock={() => setUnlocked(true)} />;

  return (
    <>
      <Hero />
      <CoreServices />
      <Process />
      <WhyChooseUs />
      <Insights />
      <Portfolio />
      <BuyBusinessSection />
      <Testimonials />
      <Packages />
      <FAQ />
      <Contact />
    </>
  );
}
