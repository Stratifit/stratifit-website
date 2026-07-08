"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HiArrowRight, HiMagnifyingGlass,
  HiLightBulb, HiCursorArrowRays, HiMap,
  HiStar, HiCheckCircle, HiChevronUp, HiChevronDown,
  HiSparkles, HiDocumentText, HiUserGroup, HiChatBubbleLeftRight,
  HiChartBar, HiShieldCheck, HiGlobeAlt, HiArrowLeft,
} from "react-icons/hi2";

const phases = [
  { step: "STEP 01", icon: HiMagnifyingGlass, title: "Brand Audit", phase: "Research Phase", desc: "Exhaustive research into brand health and market perception.", items: ["Competitor Audit","Market Trends","Internal Audit","Gap Analysis"] },
  { step: "STEP 02", icon: HiLightBulb, title: "Core Workshops", phase: "Definition Phase", desc: "Collaborative sessions to define mission, vision, and core values.", items: ["Vision Mapping","Persona Dev","Archetypes","Value Props"] },
  { step: "STEP 03", icon: HiCursorArrowRays, title: "Market Positioning", phase: "Authority Phase", desc: "Identifying whitespace to establish absolute authority.", items: ["Blue Ocean","Differentiators","Narrative Arc","Authority Map"] },
  { step: "STEP 04", icon: HiMap, title: "Strategic Roadmap", phase: "Tactical Phase", desc: "A tactical rollout plan guiding your brand to full-scale.", items: ["Execution","KPI Framework","Scaling Logic","Channels"] },
];

const timeline = [{ w:"WEEK 1", t:"Audit & Intake"},{ w:"WEEK 2-3", t:"Core Workshops"},{ w:"WEEK 4", t:"Positioning"},{ w:"WEEK 5-6", t:"Final Roadmap"}];

const deliverables = [
  { icon: HiDocumentText, title:"Strategy PDF", desc:"The 50+ page bible of your brand." },
  { icon: HiUserGroup, title:"Persona Guide", desc:"Deep psychological profiles." },
  { icon: HiChatBubbleLeftRight, title:"Messaging Pillars", desc:"Voice, tone, and key scripts." },
  { icon: HiMap, title:"Tactical Roadmap", desc:"Step-by-step launch plan." },
];

const faqs = [
  { q:"How involved do I need to be?", a:"We need about 2 hours per week for workshops and reviews during the first 3 weeks. After that, we handle the heavy lifting." },
  { q:"Is the roadmap actionable?", a:"Yes. It's not vague theory. You get specific channel strategies, content pillars, and a rollout calendar." },
  { q:"What deliverables do I receive?", a:"A comprehensive strategy PDF (50+ pages), persona guides, messaging pillars, and a tactical execution roadmap." },
  { q:"How long until I see results?", a:"Strategy foundations take 4-6 weeks. Market impact typically begins 2-3 months after implementation." },
];

export function BrandStrategyDetail() {
  const [activeFaq, setActiveFaq] = useState(0);
  const router = useRouter();

  return (
    <section className="pt-2 pb-24 md:pt-4 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center pt-24 pb-8 md:pt-28">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-amber/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-amber/3 rounded-full blur-[100px]" />
          </div>
          <div className="w-full relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Services Deep Dive</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[0.95] mb-6 uppercase">
                Deep Dive<br/><span className="text-amber">Strategy</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
                A rigorous architectural exploration of your market, audience, and goals—designed to build a roadmap for long-term success.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why It Matters */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5 relative overflow-hidden">
          {/* Animated gradient border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <HiSparkles className="text-amber text-xl" />
            <h3 className="text-amber font-bold text-xl uppercase tracking-wider">Why It Matters</h3>
          </div>
          
          <p className="text-white text-sm sm:text-base font-medium leading-relaxed mb-6 relative z-10">
            Strategic branding is the architectural foundation of market authority. Beyond aesthetics, it drives business valuation, secures investor trust, and builds long-term equity by creating an emotionally memorable connection that scales with your vision.
          </p>

          {/* Stat Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10">
            {[
              { icon: HiChartBar, stat: "2×", label: "Faster Growth", sub: "vs. unbranded competitors" },
              { icon: HiShieldCheck, stat: "77%", label: "Consumer Trust", sub: "driven by brand consistency" },
              { icon: HiGlobeAlt, stat: "89%", label: "Revenue Impact", sub: "from strategic positioning" },
            ].map((s) => (
              <div key={s.label} className="bg-[#1E1E1E] rounded-xl p-3 sm:p-4 border border-white/5 hover:border-amber/30 transition-all duration-300 flex flex-col items-center text-center gap-1.5 group/badge">
                <s.icon className="text-amber text-lg sm:text-xl group-hover/badge:scale-110 transition-transform duration-300" />
                <span className="text-white font-heading font-black text-lg sm:text-xl leading-none">{s.stat}</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider leading-tight">{s.label}</span>
                <span className="text-[9px] text-gray-600 leading-tight hidden sm:block">{s.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The 4-Phase Core */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4"><h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight uppercase">The 4-Phase Core</h2><span className="text-xs font-mono text-amber/70 border border-amber/20 px-2 py-1 rounded">SYSTEM v2.0</span></div>
          {phases.map((p,idx) => (
            <motion.div key={p.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-card-dark rounded-xl border border-white/5 p-6 sm:p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#1E1E1E] rounded-bl-xl border-b border-l border-gray-800"><span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.step}</span></div>
              <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-full border border-amber/30 flex items-center justify-center bg-amber/10 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]"><p.icon className="text-amber text-2xl" /></div><div><h3 className="text-xl font-heading font-bold text-white tracking-tight">{p.title}</h3><p className="text-[11px] text-gray-400 uppercase tracking-wider">{p.phase}</p></div></div>
              <p className="text-gray-300 leading-relaxed text-sm mb-6 pl-1 border-l-2 border-amber/20">{p.desc}</p>
              <div className="grid grid-cols-2 gap-3">{p.items.map((item,i)=>(<div key={item} className="bg-[#1E1E1E] rounded-lg p-3 border border-gray-800/50"><span className="text-[10px] text-gray-500 block mb-1">{p.step.split(' ')[1]}.{i+1}</span><span className="text-xs font-bold text-white block">{item}</span></div>))}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div><h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight mb-6">Execution <span className="text-amber">Timeline</span></h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{timeline.map((t)=>(<div key={t.w} className="bg-[#1E1E1E] rounded-xl p-4 border border-gray-800/50 relative"><HiCheckCircle className="text-amber absolute top-4 right-4 text-base" /><span className="block text-amber text-[10px] font-bold uppercase tracking-widest mb-1">{t.w}</span><h4 className="text-white font-bold text-sm">{t.t}</h4></div>))}</div></div>

        {/* Deliverables */}
        <div><div className="flex items-center justify-between mb-6"><h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight">Deliverables</h3><span className="text-xs text-gray-500 font-mono">SCROLL →</span></div><div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">{deliverables.map((d,i)=>(<div key={d.title} className="min-w-[200px] bg-[#1E1E1E] rounded-xl p-6 flex flex-col justify-between h-40 border-t-2 border-amber shadow-lg snap-center relative"><span className="absolute top-4 right-4 text-[10px] font-bold text-gray-600">{i+1}/4</span><d.icon className="text-amber text-3xl" /><div><h4 className="text-base font-bold text-white mb-1">{d.title}</h4><p className="text-[10px] text-gray-400">{d.desc}</p></div></div>))}</div></div>

        {/* Testimonial */}
        <div className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8 shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full blur-2xl"></div><div className="flex items-start gap-4 mb-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-orange-500 text-black font-black flex items-center justify-center text-sm shadow-lg shrink-0">SR</div><div><div className="flex gap-1 mb-1">{[...Array(5)].map((_,j)=>(<HiStar key={j} className="text-amber text-sm" />))}</div><h4 className="text-white font-bold text-sm">Sarah Ross</h4><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Founder, Nexus AI</p></div></div><p className="text-gray-300 text-sm italic font-medium leading-relaxed relative z-10">"The strategic roadmap wasn't just theory—it was the exact blueprint we needed to raise our Series A. Absolutely transformative for our market authority."</p></div>

        {/* FAQ */}
        <div><h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight mb-6">Common <span className="text-amber">Questions</span></h3><div className="bg-card-dark rounded-2xl overflow-hidden border border-white/5"><div className="flex border-b border-white/10"><button className="flex-1 py-4 text-sm font-bold text-black bg-amber">Process &amp; Timeline</button><button className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white bg-[#1E1E1E] transition-colors">Pricing &amp; Payments</button></div><div className="p-6 space-y-4">{faqs.map((faq,i)=>(<div key={i} className="pb-4 border-b border-white/5 last:border-0 last:pb-0"><button onClick={()=>setActiveFaq(activeFaq===i?-1:i)} className="flex items-center justify-between w-full text-left group"><h5 className="text-white font-bold text-sm">{faq.q}</h5>{activeFaq===i?<HiChevronUp className="text-amber text-lg shrink-0" />:<HiChevronDown className="text-amber text-lg shrink-0" />}</button>{activeFaq===i&&<p className="text-gray-400 text-xs leading-relaxed mt-2">{faq.a}</p>}</div>))}</div></div></div>

        {/* CTA */}
        <div className="py-6 border-t border-white/10 text-center"><h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white mb-6 leading-tight">Ready to Architect Your Authority?</h2><a href="#contact" className="inline-flex w-full sm:w-auto px-8 sm:px-12 py-4 bg-amber hover:bg-amber-light text-black text-lg font-bold rounded-full shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] items-center justify-center gap-2 group">Start a Strategy Project<HiArrowRight className="group-hover:translate-x-1 transition-transform" /></a><p className="text-gray-500 text-xs mt-4 font-medium">Limited availability for Q3 2026</p></div>
      </div>

      {/* Sticky Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="fixed top-16 lg:top-20 left-1 z-50 p-2 rounded-full bg-white/5 backdrop-blur-sm transition-colors"
        aria-label="Go back"
      >
        <HiArrowLeft className="text-white hover:text-amber text-xl transition-colors" />
      </motion.button>
    </section>
  );
}
