"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChatBubbleLeftRight,
  HiArrowRight,
  HiGlobeAlt,
  HiShieldCheck,
  HiXMark,
  HiPaperAirplane,
  HiCheckCircle,
  HiEnvelope,
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";
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

const services = [
  {
    title: "Brand Design",
    description:
      "Crafting unique identities that resonate and leave a lasting impression on your market.",
    icon: MdDiamond,
    deliverables: ["Brand Strategy", "Logo Design", "Visual Identity", "Brand Guidelines"],
  },
  {
    title: "Website Development",
    description:
      "High-performance websites and web apps engineered for speed, scale, and conversion.",
    icon: MdDesignServices,
    deliverables: ["Custom Websites", "E‑commerce", "Web Applications", "CMS Integration"],
  },
  {
    title: "AI & Automation",
    description:
      "Intelligent automation that streamlines operations, qualifies leads, and scales support 24/7.",
    icon: MdCode,
    deliverables: ["AI Lead Qualification", "AI Chatbots", "Workflow Automation", "Custom APIs"],
  },
  {
    title: "Growth & Marketing",
    description:
      "Data-driven campaigns that amplify your brand and drive measurable revenue growth.",
    icon: MdRocketLaunch,
    deliverables: ["Performance Marketing", "SEO & SEM", "Content Strategy", "Social Media"],
  },
  {
    title: "Buy a Business",
    description:
      "Acquire vetted, revenue-generating online businesses and skip the startup phase entirely.",
    icon: HiGlobeAlt,
    deliverables: ["Niche Research", "Due Diligence", "Brand Acquisition", "Transition Support"],
  },
  {
    title: "Funnel Strategy",
    description:
      "Conversion-optimized funnels and CRM workflows that turn visitors into loyal customers.",
    icon: HiShieldCheck,
    deliverables: ["Funnel Design", "Conversion Optimization", "CRM Setup", "Analytics & Reporting"],
  },
];

const TARGET_DATE = new Date("2026-08-10T00:00:00");

function ComingSoonGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "👋 Hi! I'm the Stratifit AI assistant. Ask me anything about our upcoming launch, services, or how we can help you get started early." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "bot", text: "Thanks for your message! Our team will get back to you within 24 hours. Feel free to ask anything else in the meantime." }]);
    }, 800);
  };

  const GATE_PASSWORD = "7652";

  const handlePasswordSubmit = () => {
    if (password.trim() === GATE_PASSWORD) {
      setPasswordError(null);
      onUnlock();
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16 md:py-24 lg:py-32 flex flex-col justify-center min-h-screen lg:min-h-0">
        {/* Hero */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[0.95] tracking-tight mb-6 whitespace-nowrap">
              Stratifit is <span className="text-amber">Coming Soon</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 whitespace-nowrap">
              A new digital agency experience is launching shortly.
            </p>
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-4 sm:gap-6 bg-card-dark rounded-2xl px-6 py-4 border border-white/5">
              {[
                { value: timeLeft?.days, label: "Days" },
                { value: timeLeft?.hours, label: "Hours" },
                { value: timeLeft?.minutes, label: "Minutes" },
                { value: timeLeft?.seconds, label: "Seconds" },
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
            <p className="text-gray-400 text-sm mb-4">Enter password to preview the website</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handlePasswordSubmit(); }}
                placeholder="Enter password"
                className={`flex-1 bg-card-dark border rounded-xl px-5 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none transition-colors ${
                  passwordError ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-amber/50"
                }`}
              />
              <button onClick={handlePasswordSubmit} className="px-8 py-3.5 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all active:scale-95 shrink-0">
                View Website
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
        <section className="mt-12 md:mt-16 mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center lg:text-left mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight tracking-tight mb-3">Our Core <span className="text-amber">Services</span></h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Strategic solutions engineered to scale your digital presence with precision and luxury.
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
                    key={svc.title}
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
                        <h3 className="font-heading font-bold text-2xl text-white mb-2 tracking-tight">{svc.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">{svc.description}</p>
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-amber font-bold mb-4 opacity-90">Key Deliverables</p>
                        <ul className="space-y-3">
                          {svc.deliverables.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <HiCheckCircle className="text-amber text-lg shrink-0 mt-[-1px]" />
                              <span className="text-sm text-gray-300 font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-1" />
                      <button
                        onClick={() => setChatOpen(true)}
                        className="mt-2 w-full py-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-amber hover:bg-amber/5 hover:border-amber/30 transition-all group/link"
                      >
                        Learn More
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
        <section className="mt-2 md:mt-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-gray-400 text-sm mb-4">Get notified when we launch</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 bg-card-dark border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm placeholder-gray-500 focus:border-amber/50 focus:outline-none transition-colors" />
              <button className="px-8 py-3.5 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all active:scale-95 shrink-0">Notify When It&apos;s Live</button>
            </div>
          </motion.div>
        </section>

        {/* Contact Box */}
        <section className="mt-6 md:mt-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-gray-400 text-sm mb-4">Or get in touch directly</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 bg-card-dark border border-white/10 rounded-xl px-5 py-3.5 text-gray-500 text-sm">
                <HiEnvelope className="text-base text-amber/70 shrink-0" />
                <span>Tell us about your upcoming project</span>
              </div>
              <button
                onClick={openContactModal}
                className="px-8 py-3.5 bg-card-dark border border-amber/40 text-amber font-bold text-sm rounded-xl hover:bg-amber/10 hover:border-amber transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2"
              >
                Send Message
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

        {/* Chat Panel */}
        <AnimatePresence>
          {chatOpen && (
            <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setChatOpen(false)} />
              <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 220 }} className="relative z-10 w-full sm:max-w-lg sm:rounded-2xl bg-black border-t sm:border border-white/10 rounded-t-2xl max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center"><HiChatBubbleLeftRight className="text-black text-sm" /></div>
                    <span className="font-heading font-black text-white text-sm">Stratifit AI</span>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white"><HiXMark size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-amber text-black" : "bg-card-dark border border-white/5 text-gray-300"}`}>{msg.text}</div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="border-t border-white/10 px-4 py-3 flex items-center gap-2 shrink-0">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }} placeholder="Type your message..." className="flex-1 bg-card-dark border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:border-amber/50 focus:outline-none" />
                  <button onClick={handleChatSend} disabled={!chatInput.trim()} className="w-10 h-10 rounded-xl bg-amber text-black flex items-center justify-center hover:bg-amber-light disabled:opacity-30 disabled:cursor-not-allowed shrink-0"><HiPaperAirplane className="text-base" /></button>
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
