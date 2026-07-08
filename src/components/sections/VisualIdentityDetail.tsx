"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiLanguage, HiTag, HiPhoto, HiViewColumns,
  HiStar, HiCheckCircle, HiChevronUp, HiChevronDown,
  HiBolt, HiDocumentText, HiFingerPrint, HiSwatch, HiArrowLeft,
} from "react-icons/hi2";

const phases = [
  { step: "STEP 01", icon: HiFingerPrint, title: "Brand DNA Extraction", phase: "Foundation Phase", desc: "Mining the core strategy for visual DNA—your brand's unique visual fingerprint.", items: ["Strategy Review","Attribute Mapping","Mood & Tone","Visual Keywords"] },
  { step: "STEP 02", icon: HiTag, title: "Color & Typography", phase: "System Phase", desc: "Building the foundational color palettes and type systems that define your visual language.", items: ["Primary Palette","Secondary Colors","Type Pairing","Hierarchy Rules"] },
  { step: "STEP 03", icon: HiPhoto, title: "Imagery & Graphics", phase: "Asset Phase", desc: "Creating a cohesive visual world through photography, illustration, and graphic elements.", items: ["Photo Direction","Iconography","Illustration Style","Pattern Library"] },
  { step: "STEP 04", icon: HiViewColumns, title: "System Assembly", phase: "Integration Phase", desc: "Assembling all elements into a unified, flexible identity system ready for deployment.", items: ["Grid Systems","Layout Templates","Component Library","Digital & Print"] },
];

const timeline = [{ w:"WEEK 1", t:"DNA Extraction"},{ w:"WEEK 2-3", t:"Color & Type"},{ w:"WEEK 4", t:"Imagery"},{ w:"WEEK 5-6", t:"System Assembly"}];

const deliverables = [
  { icon: HiSwatch, title:"Color System", desc:"Full palette with hex, RGB, CMYK & Pantone values." },
  { icon: HiLanguage, title:"Type System", desc:"Primary & secondary fonts with hierarchy rules." },
  { icon: HiPhoto, title:"Asset Library", desc:"Icons, patterns, illustrations & photo guidelines." },
  { icon: HiDocumentText, title:"Identity Manual", desc:"Comprehensive visual identity rulebook." },
];

const faqs = [
  { q:"How is visual identity different from a logo?", a:"A logo is one element. Visual identity is the complete system—colors, typography, imagery, and design rules that create a consistent brand experience." },
  { q:"Will this work across all platforms?", a:"Yes. We design responsive identity systems that work flawlessly across digital, print, packaging, and environmental applications." },
  { q:"Do you provide templates?", a:"Yes. You receive presentation decks, social media templates, and stationery designs as part of the identity system." },
  { q:"How long does a full identity take?", a:"Typically 4-6 weeks, depending on the scope and complexity of the brand." },
];

export function VisualIdentityDetail() {
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
                Deep Dive<br/><span className="text-amber">Visual Identity</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
                Full color palettes, typography, and asset libraries designed for absolute cohesion across every touchpoint.
              </p>
            </motion.div>
          </div>
        </section>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10"><HiBolt className="text-amber text-3xl" /><h3 className="text-white font-bold text-xl uppercase tracking-wider">Why It Matters</h3></div>
          <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed relative z-10">A cohesive visual identity is what transforms a logo into a brand. It ensures every customer touchpoint—from your website to your packaging—feels unmistakably, memorably you. Consistency builds trust, and trust drives revenue.</p>
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

        <div className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8 shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full blur-2xl"></div><div className="flex items-start gap-4 mb-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-orange-500 text-black font-black flex items-center justify-center text-sm shadow-lg shrink-0">JL</div><div><div className="flex gap-1 mb-1">{[...Array(5)].map((_,j)=>(<HiStar key={j} className="text-amber text-sm" />))}</div><h4 className="text-white font-bold text-sm">Jennifer Lee</h4><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Head of Brand, ScaleAI</p></div></div><p className="text-gray-300 text-sm italic font-medium leading-relaxed relative z-10">"The visual identity system Stratifit built gave us a playbook we use every single day. From social media to investor decks, everything finally feels like one cohesive brand. Our brand recognition scores increased 40% in 3 months."</p></div>

        <div><h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight mb-6">Common <span className="text-amber">Questions</span></h3><div className="bg-card-dark rounded-2xl overflow-hidden border border-white/5"><div className="flex border-b border-white/10"><button className="flex-1 py-4 text-sm font-bold text-black bg-amber">Process &amp; Timeline</button><button className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white bg-[#1E1E1E] transition-colors">Pricing &amp; Payments</button></div><div className="p-6 space-y-4">{faqs.map((faq,i)=>(<div key={i} className="pb-4 border-b border-white/5 last:border-0 last:pb-0"><button onClick={()=>setActiveFaq(activeFaq===i?-1:i)} className="flex items-center justify-between w-full text-left group"><h5 className="text-white font-bold text-sm">{faq.q}</h5>{activeFaq===i?<HiChevronUp className="text-amber text-lg shrink-0" />:<HiChevronDown className="text-amber text-lg shrink-0" />}</button>{activeFaq===i&&<p className="text-gray-400 text-xs leading-relaxed mt-2">{faq.a}</p>}</div>))}</div></div></div>

        <div className="py-6 border-t border-white/10 text-center"><h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white mb-6 leading-tight">Ready for a Cohesive Brand System?</h2><a href="#contact" className="inline-flex w-full sm:w-auto px-8 sm:px-12 py-4 bg-amber hover:bg-amber-light text-black text-lg font-bold rounded-full shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] items-center justify-center gap-2 group">Start an Identity Project<HiArrowRight className="group-hover:translate-x-1 transition-transform" /></a><p className="text-gray-500 text-xs mt-4 font-medium">Limited availability for Q3 2026</p></div>
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
