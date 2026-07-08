"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowRight, HiArrowUpRight, HiSparkles,
  HiPresentationChartBar, HiMagnifyingGlass, HiDocumentText, HiUserGroup,
  HiRocketLaunch, HiChevronLeft, HiChevronRight, HiChatBubbleLeftRight,
  HiChevronUp, HiChevronDown, HiBolt, HiStar, HiArrowsRightLeft,
  HiLightBulb, HiScale, HiCursorArrowRays,
  HiPhoto, HiPencilSquare, HiCalendarDays, HiCamera,
  HiWrenchScrewdriver, HiTag,
  HiArrowLeft, HiCodeBracket, HiGlobeAlt,
} from "react-icons/hi2";

const growthDeliverables = [
  { icon: HiPresentationChartBar, title: "Performance Marketing" },
  { icon: HiMagnifyingGlass, title: "SEO & SEM" },
  { icon: HiDocumentText, title: "Content Strategy" },
  { icon: HiUserGroup, title: "Social Media" },
];

const expertiseItems = [
  { icon: HiTag, label: "Meta Ads" },
  { icon: HiGlobeAlt, label: "Google Ads" },
  { icon: HiPresentationChartBar, label: "Analytics" },
  { icon: HiCursorArrowRays, label: "Conversion" },
];

const perfSteps = [
  { icon: HiMagnifyingGlass, label: "Audit" },
  { icon: HiCursorArrowRays, label: "Targeting" },
  { icon: HiPresentationChartBar, label: "Optimize" },
  { icon: HiRocketLaunch, label: "Scale" },
];

const seoSteps = [
  { icon: HiMagnifyingGlass, label: "Research" },
  { icon: HiCodeBracket, label: "Technical" },
  { icon: HiDocumentText, label: "Content" },
  { icon: HiGlobeAlt, label: "Ranking" },
];

const contentSteps = [
  { icon: HiPencilSquare, label: "Strategy" },
  { icon: HiPhoto, label: "Creation" },
  { icon: HiCalendarDays, label: "Calendar" },
  { icon: HiPresentationChartBar, label: "Analytics" },
];

const socialSteps = [
  { icon: HiUserGroup, label: "Strategy" },
  { icon: HiCamera, label: "Content" },
  { icon: HiChatBubbleLeftRight, label: "Engage" },
  { icon: HiPresentationChartBar, label: "Report" },
];

const funnelBuildSteps = [
  { icon: HiCursorArrowRays, label: "Capture" },
  { icon: HiChatBubbleLeftRight, label: "Nurture" },
  { icon: HiScale, label: "Convert" },
  { icon: HiRocketLaunch, label: "Scale" },
];

const crmSteps = [
  { icon: HiWrenchScrewdriver, label: "Setup" },
  { icon: HiCursorArrowRays, label: "Score" },
  { icon: HiChatBubbleLeftRight, label: "Sequence" },
  { icon: HiScale, label: "Automate" },
];

const includedItems = [
  { icon: HiPresentationChartBar, title: "Analytics", desc: "Real-time dashboards & monthly performance reports." },
  { icon: HiDocumentText, title: "Strategy", desc: "Custom marketing roadmap aligned with business goals." },
  { icon: HiPhoto, title: "Creatives", desc: "Ad copy, graphics & video content for all platforms." },
  { icon: HiWrenchScrewdriver, title: "Optimization", desc: "A/B testing & continuous campaign refinement." },
];

const processSteps = [
  { number: "1/5", icon: HiMagnifyingGlass, title: "Audit", desc: "Deep analysis of current marketing performance & gaps." },
  { number: "2/5", icon: HiPencilSquare, title: "Strategy", desc: "Data-driven marketing plan with clear KPIs & targets." },
  { number: "3/5", icon: HiRocketLaunch, title: "Launch", desc: "Campaign deployment across all targeted channels." },
  { number: "4/5", icon: HiScale, title: "Optimize", desc: "A/B testing, budget reallocation & performance tuning." },
  { number: "5/5", icon: HiPresentationChartBar, title: "Scale", desc: "Proven winners get scaled budget for maximum ROI." },
];

const whyUsItems = [
  { icon: HiBolt, title: "Data-Driven", desc: "Every decision backed by real analytics, not gut feelings." },
  { icon: HiLightBulb, title: "Full-Funnel", desc: "From awareness to retention — we cover the entire customer journey." },
  { icon: HiStar, title: "ROI Focused", desc: "We measure success by your revenue growth, not vanity metrics." },
  { icon: HiArrowsRightLeft, title: "Multi-Channel", desc: "Integrated campaigns across search, social, and content." },
];

const portfolioItems = [
  { tag: "ADS", num: "1/3", title: "E-commerce Growth", desc: "Scaled Meta & Google Ads to 5x ROAS within 90 days.", bg: "bg-[#FFF8E1]" },
  { tag: "SEO", num: "2/3", title: "SaaS Organic Growth", desc: "400% increase in organic traffic through technical SEO & content.", bg: "bg-[#E8F5E9]" },
  { tag: "SOCIAL", num: "3/3", title: "Brand Relaunch", desc: "Full rebrand campaign across Instagram, LinkedIn & TikTok.", bg: "bg-[#F3E5F5]" },
];

const testimonials = [
  { initials: "NC", name: "Nina Chen", role: "CMO, E-COMMERCE BRAND", quote: "Our ROAS went from 1.8x to 5.2x in 3 months. Stratifit's paid media team is on another level." },
  { initials: "RT", name: "Raj Thakur", role: "FOUNDER, SAAS PLATFORM", quote: "Organic traffic grew 400% in 6 months. They understand SEO at a technical level most agencies don't." },
  { initials: "MW", name: "Mia Walsh", role: "BRAND DIRECTOR, LIFESTYLE CO", quote: "Our social engagement tripled and we're finally reaching the right audience. Game-changing strategy." },
];

const insights = [
  { tag: "Marketing", title: "The Death of Third-Party Cookies", desc: "How to prepare your marketing strategy for a cookieless future.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ0Zos1PjM_wcaSt8CsYfxcm5X0H0U5lhDFhXS3zWyCMDAFNh2MwgKUpTM0WuSlSEYGWeHK2UmTcJuzABzSDUcYg2BI5dwfzqTL06WezcOQiW4KR9u1LU5b9HNGB6GwWnmuCWgK-D2CzDD-HXxG3DISEC4HZ4Oe_DkLy4rffD1ov9S0AY740-Naw3ReE1VDSXA8USmvnG5amglCYdmQtZktXxLFBC8Clnzm7Izx2IHK_Hr-aZ8coLlXuI0kmIWEiSkXIsONZe1ZOMW" },
  { tag: "SEO", title: "Google SGE & Your Traffic", desc: "What Google's AI-powered search means for your organic strategy.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz5wT0eHWGGFUVT8n6ekpL3P_yVQYsgK70ZCt1KKr_TGGBBj6zLe9-Hezq5RFkNOUCGBREPgat0w60kXSsxSbDTYeFpSQzBgrHEOzS7u5rrdqQKgnIJjZCLbXxc3zM8wG4-mqFAw4VcxWnpFeF-DUGetUB4IB0_ijispv4HMLlo5RKLgjYIVzzAeSc4Esl1rQX8swPaVT3nZ7CJLEwC-ReXjpNi6Q7hGv0lY3yYofe3b208KLEccVgkikj8QyPNe6zy5Ra9sHCmdoG" },
  { tag: "Social", title: "TikTok for B2B in 2024", desc: "Why B2B brands can't ignore TikTok and how to do it right.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvIYMZq_5JJzGqoFSjTPo6BfS_Z-fuT-zjtZ_BmAlbPROJ9AJdtPNC__WcgolJkxEVcmAuoHMgpPDhlMQOOKwGWXPRzKPmyC7FCjvx8P7_pRaF7_KTVpZGKvlFhcJb1NNrG2nOx2qeqUNjfMifGGBo_q1DW26GVOy1UKkGRCn4V-ZLwECrGvGDnQ_g6STdZ0C_k1R_7e2BYLeH9mWxrA6ZuIAe6jEfwbYm5FtsZbLA9GlKpaKmMz_iqu8swGGPO_kvZsti-TbWAcKX" },
];

const funnelSteps = [
  { label: "Traffic", color: "bg-amber/10 border-amber/20 text-amber" },
  { label: "Landing", color: "bg-amber/20 border-amber/30 text-amber" },
  { label: "AI Qualify", color: "bg-amber/30 border-amber/40 text-amber" },
  { label: "CRM", color: "bg-amber/40 border-amber/50 text-black" },
  { label: "Revenue", color: "bg-amber border-amber text-black" },
];

const faqs = [
  { q: "How long until I see results?", a: "Paid ads typically show results within 2-4 weeks. SEO takes 3-6 months for significant organic growth." },
  { q: "What's your minimum ad spend?", a: "We recommend a minimum of $2,000/month for meaningful paid media campaigns." },
  { q: "Do you handle creative production?", a: "Yes, we offer full creative services including copywriting, design, and video production." },
  { q: "Which platforms do you advertise on?", a: "Google, Meta (Facebook/Instagram), LinkedIn, TikTok, and programmatic display networks." },
  { q: "How do you report results?", a: "Monthly dashboards with live data, plus a strategy call to review performance and adjust." },
];


export function GrowthMarketing() {
  const [activeFaq, setActiveFaq] = useState(0);
  const router = useRouter();
  const [activeProcessIndex, setActiveProcessIndex] = useState(0);
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const processRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = (el: HTMLDivElement, setIdx: (i: number) => void, count: number) => {
      const cardWidth = 280;
      const gap = 16;
      const padding = 24;
      const handleScroll = () => {
        const center = el.scrollLeft + el.clientWidth / 2;
        const idx = Math.floor((center - padding) / (cardWidth + gap));
        setIdx(Math.max(0, Math.min(idx, count - 1)));
      };
      el.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => el.removeEventListener("scroll", handleScroll);
    };
    const cleanups: (() => void)[] = [];
    if (processRef.current) cleanups.push(track(processRef.current, setActiveProcessIndex, processSteps.length));
    if (portfolioRef.current) cleanups.push(track(portfolioRef.current, setActivePortfolioIndex, portfolioItems.length));
    if (testimonialRef.current) cleanups.push(track(testimonialRef.current, setActiveTestimonialIndex, testimonials.length));
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section className="pt-2 pb-24 md:pt-4 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 space-y-20 md:space-y-28">
        <section className="relative min-h-[85vh] flex items-center pt-24 pb-8 md:pt-28">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-amber/3 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-amber/4 rounded-full blur-[80px]" />
          </div>
          <div className="w-full relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="space-y-4 md:space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber animate-pulse shrink-0" /><span className="text-[10px] sm:text-xs font-bold text-amber uppercase tracking-[0.2em]">Growth & Marketing Services</span></div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black leading-[1.05] md:leading-[0.95] tracking-tight"><span className="text-amber">Grow</span> your brand with<br /><span className="text-amber">data-driven</span> marketing.</h1>
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">Growth-focused strategies that amplify your brand and drive measurable conversions across every channel.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="#contact" className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-amber text-black font-bold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 text-sm sm:text-base">Start Your Growth Plan<HiArrowRight className="group-hover:translate-x-1 transition-transform" /></a>
                  <a href="#how-it-works" className="px-6 sm:px-8 py-3.5 sm:py-4 border border-white/15 text-white font-semibold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:border-amber/50 hover:text-amber transition-all active:scale-95 text-sm sm:text-base"><HiSparkles className="shrink-0" />How We Work</a>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 pt-4 border-t border-white/5">
                  {[{ target: "5", suffix: "x", label: ["Avg.", "ROAS"] },{ target: "400", suffix: "%", label: ["Traffic", "Growth"] },{ target: "150", suffix: "+", label: ["Campaigns", "Managed"] }].map((s) => (<div key={s.label[0]} className="flex flex-col items-center text-center px-2 sm:px-4"><div data-target={s.target} data-suffix={s.suffix} className="text-2xl sm:text-3xl font-heading font-black text-amber mb-0.5">0</div><div className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">{s.label[0]}<br />{s.label[1]}</div></div>))}
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="hidden lg:flex items-center justify-center relative">
                <div className="relative w-[320px] h-[320px] xl:w-[420px] xl:h-[420px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 xl:w-48 h-28 xl:h-36 bg-amber/10 border-2 border-amber/30 shadow-[0_0_40px_rgba(245,158,11,0.15)]" />
                  <div className="absolute top-0 right-0 w-24 xl:w-36 h-24 xl:h-36 bg-card-dark rotate-[15deg] border border-white/10 shadow-xl" />
                  <div className="absolute bottom-8 left-0 w-20 xl:w-28 h-20 xl:h-28 bg-gray-900 -rotate-[10deg] border-r-2 border-b-2 border-amber/30 shadow-xl" />
                  <div className="absolute top-12 right-16 xl:right-20 w-6 h-6 rounded-full bg-amber shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
                  <div className="absolute bottom-0 right-0 w-48 xl:w-64 h-16 xl:h-20 bg-amber/10 blur-3xl" />
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="mt-8 md:mt-16 border-t border-white/10 pt-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-3 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Our Marketing Expertise</div>
              <div className="overflow-hidden mt-2"><div className="flex animate-ticker-tech">{[...expertiseItems,...expertiseItems].map((item,i)=>(<div key={i} className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-4 shrink-0"><item.icon className="text-amber text-base" />{item.label}</div>))}</div></div>
            </motion.div>
          </div>
        </section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">{growthDeliverables.map((item,idx)=>(<motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-card-dark rounded-2xl p-5 flex flex-col justify-between h-40 relative group cursor-pointer border border-white/5 hover:border-amber/30 transition-all shadow-lg"><div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber mb-auto"><item.icon className="text-xl" /></div><HiArrowUpRight className="text-amber/50 text-xl absolute top-5 right-5 group-hover:text-amber transition-colors" /><h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3></motion.div>))}</div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5"><div className="flex items-center gap-2 mb-4"><HiSparkles className="text-amber text-xl" /><h3 className="text-amber font-bold text-xl uppercase tracking-wider">Why It Matters</h3></div><p className="text-white text-sm sm:text-base font-medium leading-relaxed">In a crowded market, strategic marketing is the difference between being seen and being ignored. Data-driven campaigns turn browsers into buyers and buyers into brand advocates.</p>        </motion.div>

        {/* Revenue Engine Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card-dark rounded-2xl border border-white/5 p-8 md:p-12"
        >
          <h3 className="font-heading font-bold text-2xl text-white mb-2 text-center">
            Your Revenue Engine
          </h3>
          <p className="text-gray-400 text-sm text-center mb-10">
            Traffic &rarr; Landing &rarr; AI &rarr; CRM &rarr; Revenue
          </p>

          <div className="flex flex-col items-center gap-1 max-w-lg mx-auto">
            {funnelSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`${step.color} border rounded-xl px-6 py-3 text-sm font-bold text-center`}
                style={{
                  width: `${100 - i * 15}%`,
                }}
              >
                {step.label}
                {i < funnelSteps.length - 1 && (
                  <HiArrowRight className="inline ml-2 opacity-50" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div><h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight leading-none">Growth & Marketing<span className="block text-amber">Services</span></h2></div>
        {[{ icon: HiPresentationChartBar, title: "Performance Marketing", subtitle: "The Engine", desc: "Paid media campaigns across Google, Meta, LinkedIn & TikTok optimized for maximum ROAS.", steps: perfSteps },{ icon: HiMagnifyingGlass, title: "SEO & SEM", subtitle: "The Foundation", desc: "Technical SEO, keyword strategy, and content optimization to dominate search rankings.", steps: seoSteps },{ icon: HiDocumentText, title: "Content Strategy", subtitle: "The Voice", desc: "Content marketing that educates, engages, and converts your ideal customers at every stage of the funnel.", steps: contentSteps },{ icon: HiUserGroup, title: "Social Media", subtitle: "The Community", desc: "Platform-native content strategies that build engaged communities and drive brand loyalty.", steps: socialSteps },{ icon: HiScale, title: "Conversion Funnels", subtitle: "The Pipeline", desc: "High-converting funnels that turn traffic into leads and leads into paying customers — predictably.", steps: funnelBuildSteps },{ icon: HiWrenchScrewdriver, title: "CRM & Automation", subtitle: "The System", desc: "HubSpot integration, lead scoring, and email sequences that automate your sales pipeline.", steps: crmSteps }].map((s,idx)=>(<motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-card-dark rounded-xl border border-white/5 p-6 sm:p-8 shadow-xl relative overflow-hidden group"><div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-full border border-amber/30 flex items-center justify-center bg-amber/10 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]"><s.icon className="text-amber text-2xl" /></div><h2 className="text-2xl font-heading font-bold text-white tracking-tight">{s.title}</h2></div><p className="text-gray-300 leading-relaxed text-sm mb-8"><span className="text-amber font-bold">{s.subtitle}:</span> {s.desc}</p><h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">How We Do It</h3><div className="grid grid-cols-2 gap-3">{s.steps.map((st)=>(<div key={st.label} className="bg-[#1E1E1E] rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors cursor-default border border-gray-800/50"><st.icon className="text-amber text-lg mb-2" /><span className="text-xs font-semibold text-white">{st.label}</span></div>))}</div><a href="#contact" className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-sm uppercase tracking-wider mt-6 transition-all group/link">Learn More<HiArrowRight className="text-base group-hover/link:translate-x-1 transition-transform" /></a></motion.div>))}
        <div><h3 className="text-white font-heading font-bold text-3xl md:text-4xl tracking-tight mb-6">What&apos;s <span className="text-amber">Included</span></h3><div className="flex overflow-x-auto gap-3 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">{includedItems.map((item)=>(<div key={item.title} className="min-w-[160px] bg-[#1E1E1E] rounded-xl p-5 flex flex-col items-start text-left border-t-2 border-amber shadow-lg snap-center"><item.icon className="text-amber text-3xl mb-4" /><h4 className="text-sm font-bold text-white mb-2">{item.title}</h4><p className="text-[11px] text-gray-400 leading-tight">{item.desc}</p></div>))}</div></div>
        <div id="how-it-works"><div className="flex items-center justify-between mb-6"><h3 className="text-white font-heading font-bold text-3xl md:text-4xl tracking-tight">How It <span className="text-amber">Works</span></h3><div className="flex items-center gap-2"><button onClick={()=>processRef.current?.scrollBy({left:-300,behavior:"smooth"})} className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#252525] border border-gray-700/50 flex items-center justify-center transition-colors"><HiChevronLeft className="text-amber text-xl" /></button><button onClick={()=>processRef.current?.scrollBy({left:300,behavior:"smooth"})} className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#252525] border border-gray-700/50 flex items-center justify-center transition-colors"><HiChevronRight className="text-amber text-xl" /></button></div></div><div ref={processRef} className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">{processSteps.map((step)=>(<div key={step.number} className="min-w-[280px] w-[80vw] max-w-[360px] bg-[#1E1E1E] rounded-xl border border-gray-800/50 p-5 snap-center shrink-0 flex items-center relative group hover:border-amber/30 transition-colors"><div className="absolute top-3 right-4 text-gray-500 text-[10px] font-medium">{step.number}</div><div className="flex items-center gap-4 w-full"><div className="w-14 h-14 rounded-full border border-amber/20 flex items-center justify-center bg-black shrink-0 shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)] transition-shadow"><step.icon className="text-amber text-2xl" /></div><div><h4 className="text-white font-bold text-base mb-1">{step.title}</h4><p className="text-[11px] text-gray-400 font-medium leading-snug">{step.desc}</p></div></div></div>))}</div>{/* Dot Indicators */}<div className="flex items-center justify-center gap-1.5 mt-3">{processSteps.map((_,i)=>(<div key={i} className={`h-1 rounded-full transition-all duration-200 ease-out ${i===activeProcessIndex?"w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"}`} />))}</div></div>
        <div><h3 className="text-white font-heading font-bold text-3xl md:text-4xl tracking-tight mb-6">Why <span className="text-amber">Stratifit</span></h3><div className="grid grid-cols-2 gap-3 sm:gap-4">{whyUsItems.map((item)=>(<motion.div key={item.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="bg-[#1E1E1E] rounded-xl p-5 flex flex-col items-center text-center gap-3 border border-gray-800/50 hover:bg-zinc-800 transition-colors shadow-lg"><div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center shrink-0 border border-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"><item.icon className="text-amber text-2xl" /></div><div><h4 className="text-sm font-bold text-white mb-2">{item.title}</h4><p className="text-[11px] text-gray-400 leading-tight">{item.desc}</p></div></motion.div>))}</div></div>
        <div><h3 className="text-white font-heading font-bold text-3xl md:text-4xl tracking-tight mb-6">Our <span className="text-amber">Work</span></h3><div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 menu-scroll mb-2">{["All","Ads","SEO","Social"].map((f,i)=>(<button key={f} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${i===0?"bg-amber text-black shadow-lg shadow-amber/20":"border border-gray-700 text-gray-300 hover:bg-[#1E1E1E]"}`}>{f}</button>))}</div><div ref={portfolioRef} className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">{portfolioItems.map((item)=>(<div key={item.title} className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden w-[82vw] max-w-[380px] shrink-0 snap-center flex flex-col shadow-2xl"><div className={`h-[280px] relative overflow-hidden flex items-center justify-center ${item.bg}`}><div className="absolute top-4 left-4 z-20 bg-amber px-2.5 py-0.5 rounded shadow-sm"><span className="text-[9px] font-black text-black uppercase tracking-wider">{item.tag}</span></div><div className="absolute top-4 right-4 z-20"><span className="text-xs font-medium text-gray-600">{item.num}</span></div></div><div className="p-5 bg-[#1A1A1A] border-t border-gray-800 flex-1 flex flex-col"><h4 className="text-xl font-bold text-white mb-1.5">{item.title}</h4><p className="text-gray-400 text-xs mb-4 leading-relaxed">{item.desc}</p><a href="#contact" className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-[10px] uppercase tracking-wider mt-auto transition-all group/link">View Case Study<HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" /></a></div></div>))}</div>{/* Dot Indicators */}<div className="flex items-center justify-center gap-1.5 mt-3">{portfolioItems.map((_,i)=>(<div key={i} className={`h-1 rounded-full transition-all duration-200 ease-out ${i===activePortfolioIndex?"w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"}`} />))}</div></div>
        <div><h3 className="text-white font-heading font-bold text-3xl md:text-4xl tracking-tight mb-6">What Our <span className="text-amber">Clients</span> Say</h3><div ref={testimonialRef} className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">{testimonials.map((t,i)=>(<div key={t.name} className="bg-[#1A1A1A] rounded-[24px] p-6 w-[85vw] max-w-[400px] shrink-0 border-0 shadow-lg flex flex-col relative snap-center"><span className="absolute top-4 right-6 text-gray-500 text-[10px] font-medium">{i+1}/3</span><div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-full bg-[#2C2E33] overflow-hidden flex items-center justify-center text-sm font-bold text-white shrink-0">{t.initials}</div><div><div className="text-white text-lg font-bold leading-tight">{t.name}</div><div className="text-slate-500 text-[11px] font-semibold uppercase tracking-wide mt-0.5">{t.role}</div></div></div><div className="flex gap-1.5 mb-5">{[...Array(5)].map((_,j)=>(<HiStar key={j} className="text-amber text-xl" />))}</div><blockquote className="text-white text-[15px] font-medium leading-relaxed">{t.quote}</blockquote></div>))}</div>{/* Dot Indicators */}<div className="flex items-center justify-center gap-1.5 mt-3">{testimonials.map((_,i)=>(<div key={i} className={`h-1 rounded-full transition-all duration-200 ease-out ${i===activeTestimonialIndex?"w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"}`} />))}</div></div>
        <div><h3 className="text-white font-heading font-bold text-3xl md:text-4xl tracking-tight mb-6">Our <span className="text-amber">Insights</span></h3><div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">{insights.map((item,i)=>(<div key={item.title} className="min-w-[280px] w-[80vw] max-w-[360px] bg-[#1E1E1E] rounded-xl border border-gray-800/50 overflow-hidden snap-center shrink-0 flex flex-col group hover:border-amber/30 transition-colors shadow-lg"><div className="h-40 bg-zinc-800 relative overflow-hidden"><img alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" src={item.img} /><div className="absolute top-3 right-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-gray-300 text-[10px] font-medium border border-white/10">{i+1}/3</div></div><div className="p-5 flex flex-col flex-1"><span className="text-[10px] font-bold text-amber uppercase tracking-wider border border-amber/30 px-2 py-0.5 rounded bg-amber/5 mb-3 inline-block w-fit">{item.tag}</span><h4 className="text-white font-bold text-lg mb-2 leading-tight">{item.title}</h4><p className="text-[12px] text-gray-400 font-medium leading-relaxed mb-6">{item.desc}</p><a href="#" className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-[11px] uppercase tracking-wider mt-auto transition-all group/link">Read Article<HiArrowRight className="text-base group-hover/link:translate-x-1 transition-transform" /></a></div></div>))}</div></div>
        <div><h3 className="text-white font-heading font-bold text-3xl md:text-4xl tracking-tight mb-6">Common <span className="text-amber">Questions</span></h3><div className="flex gap-4 mb-6"><button className="flex-1 py-3 px-4 bg-amber text-black font-bold text-sm rounded-full hover:bg-amber-light transition-colors">Process &amp; Timeline</button><button className="flex-1 py-3 px-4 border border-amber text-amber font-bold text-sm rounded-full hover:bg-amber/10 transition-colors">Pricing &amp; Payments</button></div><div className="space-y-4">{faqs.map((faq,i)=>(<div key={i} className="border-b border-amber/20 pb-4"><button onClick={()=>setActiveFaq(activeFaq===i?-1:i)} className="flex items-center justify-between w-full text-left group"><span className="text-white font-bold text-base md:text-lg">{faq.q}</span>{activeFaq===i?<HiChevronUp className="text-amber text-2xl shrink-0" />:<HiChevronDown className="text-amber text-2xl shrink-0 transition-transform duration-300 group-hover:text-amber-light" />}</button>{activeFaq===i&&<p className="text-white/90 text-sm md:text-base leading-relaxed mt-2">{faq.a}</p>}</div>))}</div></div>
        <div className="flex flex-col sm:flex-row items-center gap-3"><span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Still Have Questions?</span><a href="#contact" className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-xs uppercase tracking-wider transition-all group/link">Message Us<HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" /></a></div>
      </div>

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
