"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiCheckBadge,
  HiPencil,
  HiFingerPrint,
  HiBookOpen,
  HiSparkles,
  HiLightBulb,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiCube,
  HiDocumentText,
  HiUserGroup,
  HiCursorArrowRays,
  HiMap,
  HiLanguage,
  HiPhoto,
  HiViewColumns,
  HiScale,
  HiFolder,
  HiFolderOpen,
  HiShoppingBag,
  HiBolt,
  HiStar,
  HiRocketLaunch,
  HiChevronUp,
  HiChevronDown,
  HiArrowsRightLeft,
  HiTag,
  HiSquares2X2,
  HiChartBar,
  HiShieldCheck,
  HiGlobeAlt, HiArrowLeft,
} from "react-icons/hi2";

const expertiseItems = [
  { icon: HiTag, label: "Color Theory" },
  { icon: HiCheckBadge, label: "Strategy" },
  { icon: HiLanguage, label: "Typography" },
  { icon: HiSquares2X2, label: "Systems" },
];

const strategySteps = [
  { icon: HiDocumentText, label: "Audit" },
  { icon: HiUserGroup, label: "Workshop" },
  { icon: HiCursorArrowRays, label: "Positioning" },
  { icon: HiMap, label: "Roadmap" },
];

const logoSteps = [
  { icon: HiMagnifyingGlass, label: "Discovery" },
  { icon: HiPencilSquare, label: "Sketching" },
  { icon: HiCube, label: "Refinement" },
  { icon: HiCheckBadge, label: "Finalization" },
];

const identitySteps = [
  { icon: HiLanguage, label: "Typography" },
  { icon: HiTag, label: "Color Theory" },
  { icon: HiPhoto, label: "Imagery" },
  { icon: HiViewColumns, label: "Patterns" },
];

const guidelinesSteps = [
  { icon: HiScale, label: "Usage Rules" },
  { icon: HiFolder, label: "Assets" },
  { icon: HiDocumentText, label: "Typefaces" },
  { icon: HiSquares2X2, label: "Layouts" },
];

const includedItems = [
  { icon: HiFolderOpen, title: "Master Files", desc: "Vector Suite & Raster Files for all applications." },
  { icon: HiTag, title: "System", desc: "Comprehensive Color Palettes & Type hierarchy." },
  { icon: HiShoppingBag, title: "Kits", desc: "Ready-to-use Social Kit & Presentation Templates." },
  { icon: HiBookOpen, title: "Docs", desc: "Full Brand Book & Rules of usage manual." },
];

const processSteps = [
  { icon: HiMagnifyingGlass, title: "Discovery", desc: "Researching brand DNA & market positioning." },
  { icon: HiCursorArrowRays, title: "Strategy", desc: "Defining core values & target audience." },
  { icon: HiPencil, title: "Design", desc: "Crafting visual identity & logo systems." },
  { icon: HiRocketLaunch, title: "Delivery", desc: "Launching assets & ongoing brand support." },
];

const whyUsItems = [
  { icon: HiBolt, title: "Startup DNA", desc: "Focused on rapid scaling and venture-backed growth mechanics." },
  { icon: HiLightBulb, title: "AI-Enhanced", desc: "Leveraging cutting-edge tech for precision and speed." },
  { icon: HiStar, title: "Authority First", desc: "Positioning brands as undeniable industry leaders." },
  { icon: HiArrowsRightLeft, title: "Scalable Systems", desc: "Building foundations that grow effortlessly." },
];

const portfolioItems = [
  { tag: "Strategy", num: "1/4", title: "FinTech Positioning", desc: "Defining a new category for an enterprise financial data platform.", bg: "bg-[#F4F6F8]" },
  { tag: "Logo", num: "2/4", title: "EcoFlow Identity", desc: "A minimalist geometric mark for sustainable energy solutions.", bg: "bg-[#E8E8E6]" },
  { tag: "Identity", num: "3/4", title: "Luxe Retail App", desc: "A seamless mobile shopping experience for modern luxury consumers.", bg: "bg-[#F5E6D8]" },
  { tag: "Guidelines", num: "4/4", title: "Global Brand Book", desc: "Comprehensive typography and color specifications manual.", bg: "bg-[#E0E7FF]" },
];

const testimonials = [
  { initials: "JD", name: "James Dalton", role: "CEO, LUXE RETAIL", quote: "Stratifit transformed our digital presence. Their strategic approach and luxury design language elevated our brand to a completely new level." },
  { initials: "AK", name: "Anna Klein", role: "CMO, FINDATA CORP", quote: "The strategic depth they brought to our fintech positioning was incredible. We finally have a brand system that scales with our tech." },
  { initials: "MR", name: "Marcus Reed", role: "FOUNDER, ECOFLOW", quote: "From guidelines to assets, everything was delivered with precision. A true partner in elevating our global presence." },
];

const insights = [
  { tag: "Strategy", title: "Brand Positioning in 2024", desc: "Why generic brands fail and how finding your niche is more crucial than ever.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvIYMZq_5JJzGqoFSjTPo6BfS_Z-fuT-zjtZ_BmAlbPROJ9AJdtPNC__WcgolJkxEVcmAuoHMgpPDhlMQOOKwGWXPRzKPmyC7FCjvx8P7_pRaF7_KTVpZGKvlFhcJb1NNrG2nOx2qeqUNjfMifGGBo_q1DW26GVOy1UKkGRCn4V-ZLwECrGvGDnQ_g6STdZ0C_k1R_7e2BYLeH9mWxrA6ZuIAe6jEfwbYm5FtsZbLA9GlKpaKmMz_iqu8swGGPO_kvZsti-TbWAcKX" },
  { tag: "Design", title: "Minimalism vs. Maximalism", desc: "Navigating current aesthetic trends without losing your core identity.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz5wT0eHWGGFUVT8n6ekpL3P_yVQYsgK70ZCt1KKr_TGGBBj6zLe9-Hezq5RFkNOUCGBREPgat0w60kXSsxSbDTYeFpSQzBgrHEOzS7u5rrdqQKgnIJjZCLbXxc3zM8wG4-mqFAw4VcxWnpFeF-DUGetUB4IB0_ijispv4HMLlo5RKLgjYIVzzAeSc4Esl1rQX8swPaVT3nZ7CJLEwC-ReXjpNi6Q7hGv0lY3yYofe3b208KLEccVgkikj8QyPNe6zy5Ra9sHCmdoG" },
  { tag: "Tech", title: "AI in Brand Development", desc: "How AI is accelerating the creative process for agencies.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ0Zos1PjM_wcaSt8CsYfxcm5X0H0U5lhDFhXS3zWyCMDAFNh2MwgKUpTM0WuSlSEYGWeHK2UmTcJuzABzSDUcYg2BI5dwfzqTL06WezcOQiW4KR9u1LU5b9HNGB6GwWnmuCWgK-D2CzDD-HXxG3DISEC4HZ4Oe_DkLy4rffD1ov9S0AY740-Naw3ReE1VDSXA8USmvnG5amglCYdmQtZktXxLFBC8Clnzm7Izx2IHK_Hr-aZ8coLlXuI0kmIWEiSkXIsONZe1ZOMW" },
];

const faqs = [
  { q: "What is the typical timeline for a branding project?", a: "A standard branding project typically takes 4-6 weeks from discovery to final delivery." },
  { q: "Do you offer post-launch support?", a: "Yes, we provide 30 days of complimentary support after launch." },
  { q: "How are payments structured?", a: "We require a 50% deposit, with the balance due upon project completion." },
  { q: "What tech stack do you use?", a: "We specialize in React, Next.js, Node.js, and high-performance CMS solutions." },
  { q: "Can you update existing apps?", a: "Absolutely. We offer audit and modernization services for existing digital products." },
];

export function BrandDesign() {
  const [activeFaq, setActiveFaq] = useState(0);
  const router = useRouter();
  const [workFilter, setWorkFilter] = useState("All");
  const [workScroll, setWorkScroll] = useState(0);
  const workRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = workRef.current;
    if (!el) return;
    const handleScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setWorkScroll(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-2 pb-24 md:pt-4 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 space-y-20 md:space-y-28">

        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center pt-13 pb-8 md:pt-17">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-amber/3 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-amber/4 rounded-full blur-[80px]" />
          </div>

          <div className="w-full relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-4 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold text-amber uppercase tracking-[0.2em]">
                      Brand Design Services
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black leading-[1.05] md:leading-[0.95] tracking-tight">
                    Build a{" "}
                    <span className="text-amber">brand</span> that
                    <br />
                    feels{" "}
                    <span className="text-amber">inevitable.</span>
                  </h1>

                  <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
                    We craft strategic visual identities designed to drive valuation
                    and establish market authority from day one.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  <a
                    href="#contact"
                    className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-amber text-black font-bold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 text-sm sm:text-base"
                  >
                    Start Your Brand Project
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="#how-it-works"
                    className="px-6 sm:px-8 py-3.5 sm:py-4 border border-white/15 text-white font-semibold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:border-amber/50 hover:text-amber transition-all active:scale-95 text-sm sm:text-base"
                  >
                    <HiSparkles className="shrink-0" />
                    How We Work
                  </a>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 pt-4 border-t border-white/5"
                >
                  {[
                    { target: "120", suffix: "+", label: ["Brands", "Launched"] },
                    { target: "4", suffix: ".8", label: ["Avg. Rating", "on Clutch"] },
                    { target: "96", suffix: "%", label: ["Client", "Satisfaction"] },
                  ].map((stat) => (
                    <div key={stat.label[0]} className="flex flex-col items-center text-center px-2 sm:px-4">
                      <div
                        data-target={stat.target}
                        data-suffix={stat.suffix}
                        className="text-2xl sm:text-3xl font-heading font-black text-amber mb-0.5"
                      >
                        0
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">
                        {stat.label[0]}
                        <br />
                        {stat.label[1]}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="hidden lg:flex items-center justify-center relative"
              >
                <div className="relative w-[320px] h-[320px] xl:w-[420px] xl:h-[420px]">
                  {/* Central diamond shape */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 xl:w-44 h-32 xl:h-44 bg-amber/10 rotate-45 border-2 border-amber/30 shadow-[0_0_40px_rgba(245,158,11,0.15)]" />
                  {/* Secondary square */}
                  <div className="absolute top-0 right-0 w-24 xl:w-36 h-24 xl:h-36 bg-card-dark rotate-[15deg] border border-white/10 shadow-xl" />
                  {/* Third element */}
                  <div className="absolute bottom-8 left-0 w-20 xl:w-28 h-20 xl:h-28 bg-gray-900 -rotate-[10deg] border-r-2 border-b-2 border-amber/30 shadow-xl" />
                  {/* Small accent */}
                  <div className="absolute top-12 right-16 xl:right-20 w-6 h-6 rounded-full bg-amber shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
                  {/* Glow orb */}
                  <div className="absolute bottom-0 right-0 w-48 xl:w-64 h-16 xl:h-20 bg-amber/10 blur-3xl" />
                </div>
              </motion.div>
            </div>

            {/* Expertise Ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 md:mt-16 border-t border-white/10 pt-4 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-3 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                Our Brand Expertise
              </div>
              <div className="overflow-hidden mt-2">
                <div className="flex animate-ticker-tech">
                  {[...expertiseItems, ...expertiseItems].map((item, i) => (
                    <div key={i} className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-4 shrink-0">
                      <item.icon className="text-amber text-base" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5 relative overflow-hidden">
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

        {/* Branding Services heading */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">Our Capabilities</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[0.95]">
            Branding
            <span className="text-amber"> Services</span>
          </h2>
        </div>

        {/* Detail Service Cards */}
        <div className="space-y-6 md:space-y-8">
        {[
          { icon: HiLightBulb, title: "Brand Strategy", subtitle: "The Foundation", desc: "A deep dive into your market, audience, and goals to build a roadmap for long-term success and distinct positioning.", steps: strategySteps, href: "/brand-strategy" },
          { icon: HiPencil, title: "Logo Design", subtitle: "The Face", desc: "Crafting a memorable, scalable, and timeless mark that serves as the cornerstone of your brand's visual presence.", steps: logoSteps, href: "/logo-design" },
          { icon: HiFingerPrint, title: "Visual Identity", subtitle: "The System", desc: "Full color palettes, typography, and asset libraries designed for absolute cohesion across every touchpoint.", steps: identitySteps, href: "/visual-identity" },
          { icon: HiBookOpen, title: "Brand Guidelines", subtitle: "The Rulebook", desc: "A comprehensive manual ensuring your team and partners use your brand assets correctly and consistently forever.", steps: guidelinesSteps, href: "/brand-guidelines" },
        ].map((service, idx) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card-dark rounded-xl border border-white/5 p-6 sm:p-8 shadow-xl relative overflow-hidden group"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-amber/30 flex items-center justify-center bg-amber/10 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <service.icon className="text-amber text-2xl" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white tracking-tight">{service.title}</h2>
            </div>

            <p className="text-gray-300 leading-relaxed text-sm mb-8">
              <span className="text-amber font-bold">{service.subtitle}:</span>{" "}
              {service.desc}
            </p>

            <h3 className="text-amber font-bold text-xs uppercase tracking-widest mb-4">How We Do It</h3>
            <div className="grid grid-cols-2 gap-3">
              {service.steps.map((step) => (
                <div
                  key={step.label}
                  className="bg-[#1E1E1E] rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors cursor-default border border-gray-800/50"
                >
                  <step.icon className="text-amber text-lg mb-2" />
                  <span className="text-xs font-semibold text-white">{step.label}</span>
                </div>
              ))}
            </div>

            <a
              href={service.href}
              className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-sm uppercase tracking-wider mt-6 transition-all group/link"
            >
              Learn More
              <HiArrowRight className="text-base group-hover/link:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        ))}
        </div>

        {/* What's Included */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">Deliverables</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mb-8">
            What&apos;s <span className="text-amber">Included</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {includedItems.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#1E1E1E] rounded-xl p-5 sm:p-6 flex flex-col items-center text-center gap-3 border border-white/5 hover:border-amber/30 transition-all duration-300 shadow-lg group/card"
              >
                <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center shrink-0 border border-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover/card:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-shadow">
                  <item.icon className="text-amber text-2xl group-hover/card:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-tight">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">Our Process</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mb-8">
            How It <span className="text-amber">Works</span>
          </h3>

          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Connector arrow (desktop only, between cards) */}
                {idx < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-amber/30 text-lg">
                    <HiArrowRight />
                  </div>
                )}
                <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-5 sm:p-6 hover:border-amber/30 transition-all duration-300 shadow-lg group/card h-full">
                  <div className="flex items-start gap-4">
                    <div className="text-amber font-heading font-black text-2xl sm:text-3xl leading-none opacity-30 shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <step.icon className="text-amber text-lg shrink-0" />
                        <h4 className="text-white font-bold text-sm sm:text-base">{step.title}</h4>
                      </div>
                      <p className="text-[12px] sm:text-[13px] text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Stratifit */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">The Difference</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mb-8">
            Why <span className="text-amber">Stratifit</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {whyUsItems.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#1E1E1E] rounded-xl p-5 flex flex-col items-center text-center gap-3 border border-gray-800/50 hover:bg-zinc-800 transition-colors shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center shrink-0 border border-amber/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <item.icon className="text-amber text-2xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-tight">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Work */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">Portfolio</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mb-6">
            Our <span className="text-amber">Work</span>
          </h3>

          {/* Filter tags */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-6 px-6 menu-scroll mb-4">
            {["All", "Strategy", "Logo", "Identity", "Guidelines"].map((f) => (
              <button
                key={f}
                onClick={() => { setWorkFilter(f); setWorkScroll(0); }}
                className={`px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all ${
                  workFilter === f
                    ? "bg-amber text-black shadow-lg shadow-amber/20"
                    : "border border-white/10 text-gray-400 hover:border-amber/40 hover:text-amber"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Scrollable cards */}
          <div
            ref={workRef}
            className="flex overflow-x-auto gap-4 pb-6 -mx-6 px-6 snap-x snap-mandatory menu-scroll"
          >
            {portfolioItems.filter(item => workFilter === "All" || item.tag === workFilter).map((item, idx) => (
              <div
                key={item.title}
                className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden w-[80vw] sm:w-[340px] shrink-0 snap-center flex flex-col shadow-2xl hover:border-amber/20 transition-colors duration-300 group/work"
              >
                {/* Image area */}
                <div className={`h-[220px] sm:h-[260px] relative overflow-hidden ${item.bg}`}>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/work:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-amber/90 backdrop-blur-sm px-2.5 py-1 rounded text-[9px] font-black text-black uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <span className="text-[10px] font-bold text-white/80">{item.num}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover/work:text-amber transition-colors">{item.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-5 flex-1">{item.desc}</p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-[11px] uppercase tracking-wider transition-all group/link"
                  >
                    View Case Study
                    <HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {portfolioItems.filter(item => workFilter === "All" || item.tag === workFilter).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ease-out ${
                  Math.round(workScroll * (portfolioItems.filter(item => workFilter === "All" || item.tag === workFilter).length - 1)) === i ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">Testimonials</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mb-6">
            What Our <span className="text-amber">Clients</span> Say
          </h3>

          <div className="flex overflow-x-auto gap-4 pb-6 -mx-6 px-6 snap-x snap-mandatory menu-scroll">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-7 w-[85vw] sm:w-[380px] shrink-0 snap-center flex flex-col shadow-xl hover:border-amber/20 transition-colors duration-300"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber to-orange-500 text-black font-heading font-black flex items-center justify-center text-sm shadow-lg shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{t.role}</div>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-gray-600">{i + 1}/3</span>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <HiStar key={j} className="text-amber text-lg" />
                  ))}
                </div>
                <blockquote className="text-gray-300 text-sm italic leading-relaxed flex-1">{t.quote}</blockquote>
              </div>
            ))}
          </div>

          {/* Scroll dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {testimonials.map((_, i) => (
              <div key={i} className={`h-1 rounded-full ${i === 0 ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"}`} />
            ))}
          </div>
        </div>

        {/* Insights */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">Knowledge</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mb-6">
            Our <span className="text-amber">Insights</span>
          </h3>

          <div className="flex overflow-x-auto gap-4 pb-6 -mx-6 px-6 snap-x snap-mandatory menu-scroll">
            {insights.map((item, i) => (
              <div
                key={item.title}
                className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden w-[80vw] sm:w-[340px] shrink-0 snap-center flex flex-col shadow-xl hover:border-amber/20 transition-colors duration-300 group/insight"
              >
                <div className="h-44 sm:h-48 relative overflow-hidden">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/insight:scale-105 transition-transform duration-500"
                    src={item.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] to-transparent" />
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-amber/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-black text-black uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-4 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <span className="text-[10px] font-bold text-white/80">{i + 1}/3</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-white font-bold text-base sm:text-lg mb-2 group-hover/insight:text-amber transition-colors">{item.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-5 flex-1">{item.desc}</p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-[11px] uppercase tracking-wider transition-all group/link"
                  >
                    Read Article
                    <HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {insights.map((_, i) => (
              <div key={i} className={`h-1 rounded-full ${i === 0 ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"}`} />
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-amber/40 to-transparent" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">Support</span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber/40 to-transparent" />
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mb-6">
            Common <span className="text-amber">Questions</span>
          </h3>



          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#1E1E1E] rounded-xl border border-white/5 overflow-hidden hover:border-amber/20 transition-colors duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                  className="flex items-center justify-between w-full text-left p-5"
                >
                  <span className="text-white font-bold text-sm sm:text-base pr-4">{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${activeFaq === i ? "border-amber bg-amber/10" : "border-white/10"}`}>
                    {activeFaq === i ? (
                      <HiChevronUp className="text-amber text-sm" />
                    ) : (
                      <HiChevronDown className="text-gray-400 text-sm" />
                    )}
                  </div>
                </button>
                {activeFaq === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5"
                  >
                    <div className="h-px bg-white/5 mb-4" />
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Still Have Questions?</span>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-bold text-xs uppercase tracking-wider transition-all group/link"
          >
            Message Us
            <HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
          </a>
        </div>
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
