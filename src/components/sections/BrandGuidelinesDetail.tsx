"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiScale, HiFolder, HiDocumentText, HiSquares2X2,
  HiStar, HiCheckCircle, HiChevronUp, HiChevronDown,
  HiBolt, HiBookOpen, HiGif, HiShieldCheck, HiArrowLeft,
} from "react-icons/hi2";

const phases = [
  { step: "STEP 01", icon: HiShieldCheck, title: "Usage Rules & Governance", phase: "Foundation Phase", desc: "Defining the rules that protect your brand from misuse and ensure absolute consistency.", items: ["Clear Space Rules","Minimum Sizes","Dos & Don'ts","Color Restrictions"] },
  { step: "STEP 02", icon: HiFolder, title: "Asset Organization", phase: "Structure Phase", desc: "Organizing every brand asset into a logical, accessible, and version-controlled library.", items: ["File Naming","Folder Hierarchy","Version Control","Cloud Setup"] },
  { step: "STEP 03", icon: HiDocumentText, title: "Typography & Layouts", phase: "Specification Phase", desc: "Documenting exact type scales, grid systems, and layout templates for all media.", items: ["Type Scales","Grid Templates","Spacing Rules","Responsive Specs"] },
  { step: "STEP 04", icon: HiSquares2X2, title: "Application Examples", phase: "Production Phase", desc: "Real-world examples showing correct brand application across every channel and medium.", items: ["Digital Examples","Print Examples","Social Templates","Merch & Signage"] },
];

const timeline = [{ w:"WEEK 1", t:"Rules & Governance"},{ w:"WEEK 2", t:"Asset Organization"},{ w:"WEEK 3", t:"Type & Layouts"},{ w:"WEEK 4", t:"Final Delivery"}];

const deliverables = [
  { icon: HiBookOpen, title:"Brand Book", desc:"The complete 80+ page guidelines document." },
  { icon: HiFolder, title:"Asset Drive", desc:"Organized cloud drive with all source files." },
  { icon: HiGif, title:"Video Guide", desc:"Walkthrough video explaining key rules." },
  { icon: HiShieldCheck, title:"Governance Doc", desc:"Legal usage terms & approval workflows." },
];

const faqs = [
  { q:"Who needs brand guidelines?", a:"Anyone using your brand—internal teams, agencies, partners, and printers. Guidelines ensure everyone represents your brand correctly." },
  { q:"Is this just a PDF?", a:"No. You receive a PDF brand book, an organized cloud drive with all assets, and a video walkthrough for quick onboarding." },
  { q:"How often should guidelines be updated?", a:"We recommend reviewing annually or whenever you add new products, sub-brands, or enter new markets." },
  { q:"Can you train our team?", a:"Yes. We offer a 2-hour workshop to walk your team through the guidelines and answer questions." },
];

export function BrandGuidelinesDetail() {
  const [activeFaq, setActiveFaq] = useState(0);
  const router = useRouter();

  return (
    <section className="pt-2 pb-24 md:pt-4 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
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
                Deep Dive<br/><span className="text-amber">Guidelines</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
                A comprehensive manual ensuring your team and partners use your brand assets correctly and consistently forever.
              </p>
            </motion.div>
          </div>
        </section>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10"><HiBolt className="text-amber text-3xl" /><h3 className="text-white font-bold text-xl uppercase tracking-wider">Why It Matters</h3></div>
          <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed relative z-10">Brand guidelines are the rulebook that protects your investment. Without them, your brand fragments across teams and channels. With them, every communication—from social posts to investor decks—projects unified authority.</p>
        </motion.div>

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

        <div><h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight mb-6">Execution <span className="text-amber">Timeline</span></h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{timeline.map((t)=>(<div key={t.w} className="bg-[#1E1E1E] rounded-xl p-4 border border-gray-800/50 relative"><HiCheckCircle className="text-amber absolute top-4 right-4 text-base" /><span className="block text-amber text-[10px] font-bold uppercase tracking-widest mb-1">{t.w}</span><h4 className="text-white font-bold text-sm">{t.t}</h4></div>))}</div></div>

        <div><div className="flex items-center justify-between mb-6"><h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight">Deliverables</h3><span className="text-xs text-gray-500 font-mono">SCROLL →</span></div><div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">{deliverables.map((d,i)=>(<div key={d.title} className="min-w-[200px] bg-[#1E1E1E] rounded-xl p-6 flex flex-col justify-between h-40 border-t-2 border-amber shadow-lg snap-center relative"><span className="absolute top-4 right-4 text-[10px] font-bold text-gray-600">{i+1}/4</span><d.icon className="text-amber text-3xl" /><div><h4 className="text-base font-bold text-white mb-1">{d.title}</h4><p className="text-[10px] text-gray-400">{d.desc}</p></div></div>))}</div></div>

        <div className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8 shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full blur-2xl"></div><div className="flex items-start gap-4 mb-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-orange-500 text-black font-black flex items-center justify-center text-sm shadow-lg shrink-0">DT</div><div><div className="flex gap-1 mb-1">{[...Array(5)].map((_,j)=>(<HiStar key={j} className="text-amber text-sm" />))}</div><h4 className="text-white font-bold text-sm">David Torres</h4><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">VP Marketing, OmniCorp</p></div></div><p className="text-gray-300 text-sm italic font-medium leading-relaxed relative z-10">"The brand guidelines Stratifit delivered became our single source of truth. Our global teams across 12 markets now maintain perfect brand consistency. It literally pays for itself in saved time and prevented mistakes."</p></div>

        <div><h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight mb-6">Common <span className="text-amber">Questions</span></h3><div className="bg-card-dark rounded-2xl overflow-hidden border border-white/5"><div className="flex border-b border-white/10"><button className="flex-1 py-4 text-sm font-bold text-black bg-amber">Process &amp; Timeline</button><button className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white bg-[#1E1E1E] transition-colors">Pricing &amp; Payments</button></div><div className="p-6 space-y-4">{faqs.map((faq,i)=>(<div key={i} className="pb-4 border-b border-white/5 last:border-0 last:pb-0"><button onClick={()=>setActiveFaq(activeFaq===i?-1:i)} className="flex items-center justify-between w-full text-left group"><h5 className="text-white font-bold text-sm">{faq.q}</h5>{activeFaq===i?<HiChevronUp className="text-amber text-lg shrink-0" />:<HiChevronDown className="text-amber text-lg shrink-0" />}</button>{activeFaq===i&&<p className="text-gray-400 text-xs leading-relaxed mt-2">{faq.a}</p>}</div>))}</div></div></div>

        <div className="py-6 border-t border-white/10 text-center"><h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white mb-6 leading-tight">Ready to Lock In Your Brand&apos;s Future?</h2><a href="#contact" className="inline-flex w-full sm:w-auto px-8 sm:px-12 py-4 bg-amber hover:bg-amber-light text-black text-lg font-bold rounded-full shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] items-center justify-center gap-2 group">Start a Guidelines Project<HiArrowRight className="group-hover:translate-x-1 transition-transform" /></a><p className="text-gray-500 text-xs mt-4 font-medium">Limited availability for Q3 2026</p></div>
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
