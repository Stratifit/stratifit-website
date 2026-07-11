"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiSparkles,
  HiCodeBracket,
  HiShoppingCart,
  HiGlobeAlt,
  HiCog,
  HiMagnifyingGlass,
  HiUserGroup,
  HiPencilSquare,
  HiRocketLaunch,
  HiChatBubbleLeftRight,
  HiTag,
  HiWrenchScrewdriver,
  HiServer,
  HiDevicePhoneMobile,
  HiCube,
  HiScale,
  HiFolderOpen,
  HiShoppingBag,
  HiBookOpen,
  HiCursorArrowRays,
  HiMap,
  HiDocumentText,
  HiViewColumns,
  HiFingerPrint,
  HiPencil,
  HiCheckBadge,
  HiPhoto,
  HiLanguage,
  HiFolder,
  HiSquares2X2,
  HiArrowLeft,
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";
import { projects } from "@/data/projects";

const expertiseItems = [
  {
    icon: HiTag,
    label: "React / Next.js",
    desc: "Modern frontend framework for blazing-fast sites & apps.",
  },
  {
    icon: HiCodeBracket,
    label: "TypeScript",
    desc: "Strictly typed code that scales with your team.",
  },
  {
    icon: HiServer,
    label: "Node.js APIs",
    desc: "Serverless backend services and custom REST endpoints.",
  },
  {
    icon: HiWrenchScrewdriver,
    label: "Performance Tuning",
    desc: "Lighthouse 90+ scores & Core Web Vitals optimization.",
  },
];

const customSteps = [
  { icon: HiMagnifyingGlass, label: "Discovery" },
  { icon: HiPencilSquare, label: "Wireframes" },
  { icon: HiCodeBracket, label: "Development" },
  { icon: HiRocketLaunch, label: "Launch" },
];

const ecomSteps = [
  { icon: HiShoppingCart, label: "Platform" },
  { icon: HiCube, label: "Architecture" },
  { icon: HiCheckBadge, label: "Checkout" },
  { icon: HiScale, label: "Optimization" },
];

const webappSteps = [
  { icon: HiUserGroup, label: "UX Research" },
  { icon: HiPencilSquare, label: "Prototyping" },
  { icon: HiCodeBracket, label: "Engineering" },
  { icon: HiRocketLaunch, label: "Deployment" },
];

const cmsSteps = [
  { icon: HiFolderOpen, label: "Content Model" },
  { icon: HiDocumentText, label: "Setup" },
  { icon: HiCog, label: "Customization" },
  { icon: HiCheckBadge, label: "Training" },
];

const includedItems = [
  {
    icon: HiCodeBracket,
    title: "Source Code",
    desc: "Clean, documented, production-ready codebase.",
  },
  { icon: HiServer, title: "Hosting", desc: "Deployed on Vercel, AWS, or your preferred cloud." },
  {
    icon: HiWrenchScrewdriver,
    title: "Performance",
    desc: "Lighthouse 90+ scores, optimized for speed.",
  },
  { icon: HiBookOpen, title: "Docs", desc: "Technical documentation & handover guide." },
];

const processSteps = [
  {
    icon: HiMagnifyingGlass,
    title: "Discovery",
    desc: "Requirements gathering & technical scoping.",
  },
  { icon: HiPencilSquare, title: "Design", desc: "UI/UX design & interactive prototypes." },
  { icon: HiCodeBracket, title: "Development", desc: "Frontend & backend engineering." },
  { icon: HiRocketLaunch, title: "Launch", desc: "QA testing, deployment & go-live." },
];

const toolsRow1 = [
  { icon: HiCodeBracket, label: "React" },
  { icon: HiCube, label: "Next.js" },
  { icon: HiDocumentText, label: "TypeScript" },
  { icon: HiSparkles, label: "Tailwind CSS" },
  { icon: HiPencil, label: "Figma" },
];

const toolsRow2 = [
  { icon: HiServer, label: "Node.js" },
  { icon: HiFolderOpen, label: "AWS" },
  { icon: HiMap, label: "PostgreSQL" },
  { icon: HiDevicePhoneMobile, label: "Vercel" },
  { icon: HiBookOpen, label: "GitHub" },
];

export function WebsiteDevelopment() {
  const router = useRouter();

  const caseStudies = projects.filter((p) => p.category === "Website Development");
  const useCarousel = caseStudies.length >= 3;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollCarousel = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -350 : 350, behavior: "smooth" });
  };

  useEffect(() => {
    if (useCarousel && carouselRef.current) {
      const el = carouselRef.current;
      setCanScrollRight(el.scrollWidth > el.clientWidth);
    }
  }, [useCarousel]);

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-32">
        <section className="relative min-h-[60vh] flex items-center pt-24 pb-0 md:pt-20 md:pb-0">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-amber/3 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-amber/4 rounded-full blur-[80px]" />
          </div>
          <div className="w-full relative z-10">
            <div className="grid gap-8 md:gap-16 items-center">
              <div className="space-y-4 md:space-y-8 lg:text-center lg:max-w-4xl lg:mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold text-amber uppercase tracking-[0.2em]">
                      Website Development Services
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black leading-[1.05] md:leading-[0.95] tracking-tight text-center">
                    Build websites that
                    <br />
                    <span className="text-amber">convert</span> and scale.
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto text-center">
                    Scalable, performance-driven digital products engineered with modern technology
                    and UX-first design.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-center"
                >
                  <button
                    onClick={openContactModal}
                    className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-amber text-black font-bold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 text-sm sm:text-base"
                  >
                    Start Your Web Project
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="#how-it-works"
                    className="px-6 sm:px-8 py-3.5 sm:py-4 border border-white/15 text-white font-semibold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:border-amber/50 hover:text-amber transition-all active:scale-95 text-sm sm:text-base"
                  >
                    <HiSparkles className="shrink-0" />
                    How We Work
                  </a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-6 lg:gap-6 pt-3 pb-3 md:pt-3 md:pb-0 border-t border-white/5 lg:border-t-0 place-items-center text-center"
                >
                  {[
                    { target: "85", suffix: "+", label: ["Projects", "Launched"] },
                    { target: "99", suffix: "%", label: ["Uptime", "SLA"] },
                    { target: "97", suffix: "%", label: ["Client", "Satisfaction"] },
                  ].map((s) => (
                    <div
                      key={s.label[0]}
                      className="flex flex-col lg:flex-row items-center lg:justify-center text-center px-2 sm:px-4 lg:px-0.5 lg:whitespace-nowrap pb-0 gap-1"
                    >
                      <div
                        data-target={s.target}
                        data-suffix={s.suffix}
                        className="text-2xl sm:text-3xl font-heading font-black text-amber mb-0.5 lg:mb-0 leading-none"
                      >
                        0
                      </div>
                      <div className="text-[9px] sm:text-[10px] lg:text-sm font-bold text-gray-500 uppercase tracking-wider leading-tight">
                        {s.label[0]}
                        <br className="lg:hidden" />
                        <span className="hidden lg:inline"> </span>
                        {s.label[1]}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5 relative overflow-hidden"
        >
          {/* Animated gradient border line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <HiSparkles className="text-amber text-xl" />
            <h3 className="text-amber font-bold text-xl uppercase tracking-wider">
              Why It Matters
            </h3>
          </div>
          <p className="text-white text-sm sm:text-base font-medium leading-relaxed mb-6 relative z-10">
            In today’s digital landscape, your website is your most important salesperson. A
            strategically engineered web presence drives conversions, builds trust, and scales
            effortlessly with your business growth.
          </p>
          {/* Stat Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10">
            {[
              {
                icon: HiRocketLaunch,
                stat: "0.9s",
                label: "Load Time",
                sub: "median first contentful paint",
              },
              {
                icon: HiCursorArrowRays,
                stat: "3.2x",
                label: "Conversion Lift",
                sub: "median outcome vs. previous site",
              },
              { icon: HiCheckBadge, stat: "99.9%", label: "Uptime", sub: "managed deployment SLA" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#1E1E1E] rounded-xl p-3 sm:p-4 border border-white/5 hover:border-amber/30 transition-all duration-300 flex flex-col items-center text-center gap-1.5 group/badge"
              >
                <s.icon className="text-amber text-lg sm:text-xl group-hover/badge:scale-110 transition-transform duration-300" />
                <span className="text-white font-heading font-black text-lg sm:text-xl leading-none">
                  {s.stat}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider leading-tight">
                  {s.label}
                </span>
                <span className="text-[9px] text-gray-600 leading-tight hidden sm:block">
                  {s.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        <div>
          <span className="text-xs font-bold tracking-[0.3em] text-white uppercase">
            Our Capabilities
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[0.95] mt-3">
            Website<span className="text-amber"> Services</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              icon: HiGlobeAlt,
              title: "Custom Websites",
              subtitle: "The Storefront",
              desc: "Bespoke, conversion-optimized websites built with modern frameworks for blazing-fast performance.",
              steps: customSteps,
            },
            {
              icon: HiShoppingCart,
              title: "E-commerce",
              subtitle: "The Engine",
              desc: "Headless commerce solutions with seamless checkout flows, inventory management, and payment integrations.",
              steps: ecomSteps,
            },
            {
              icon: HiCodeBracket,
              title: "Web Applications",
              subtitle: "The Product",
              desc: "Complex SaaS platforms, dashboards, and interactive tools engineered for scale and reliability.",
              steps: webappSteps,
            },
            {
              icon: HiCog,
              title: "CMS Integration",
              subtitle: "The Control",
              desc: "Custom content management systems that give your team full control without sacrificing performance.",
              steps: cmsSteps,
            },
          ].map((s, idx) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card-dark rounded-xl border border-white/5 p-6 sm:p-8 shadow-xl relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border border-amber/30 flex items-center justify-center bg-amber/10 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <s.icon className="text-amber text-2xl" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-white tracking-tight">
                  {s.title}
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm mb-8">
                <span className="text-amber font-bold">{s.subtitle}:</span> {s.desc}
              </p>
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
                How We Do It
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {s.steps.map((st) => (
                  <div
                    key={st.label}
                    className="bg-[#1E1E1E] rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors cursor-default border border-gray-800/50"
                  >
                    <st.icon className="text-amber text-lg mb-2" />
                    <span className="text-xs font-semibold text-white">{st.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div>
          <span className="text-xs font-bold tracking-[0.3em] text-white uppercase">
            Deliverables
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mt-4 mb-8">
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
                className="bg-[#1E1E1E] rounded-xl p-6 sm:p-8 flex flex-col items-center text-center gap-3 border border-white/5 hover:border-amber/30 transition-all duration-300 shadow-lg group/card"
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
        <div id="how-it-works">
          <span className="text-xs font-bold tracking-[0.3em] text-white uppercase">
            Our Process
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mt-4 mb-8">
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
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-amber/30 text-lg">
                    <HiArrowRight />
                  </div>
                )}
                <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 sm:p-8 hover:border-amber/30 transition-all duration-300 shadow-lg group/card h-full">
                  <div className="flex items-start gap-4">
                    <div className="text-amber font-heading font-black text-2xl sm:text-3xl leading-none opacity-30 shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <step.icon className="text-amber text-lg shrink-0" />
                        <h4 className="text-white font-bold text-sm sm:text-base">{step.title}</h4>
                      </div>
                      <p className="text-[12px] sm:text-[13px] text-gray-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold tracking-[0.3em] text-white uppercase">Toolkit</span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight leading-[0.95] mt-4 mb-8">
            Tools &amp; <span className="text-amber">Technologies</span>
          </h3>
          <div className="divide-y divide-white/10">
            <div className="overflow-hidden py-4 md:py-6">
              <div className="flex animate-ticker">
                {[...toolsRow1, ...toolsRow1].map((item, i) => (
                  <div
                    key={`r1-${i}`}
                    className="flex items-center gap-1.5 sm:gap-2 shrink-0 px-3 sm:px-8 text-sm sm:text-lg whitespace-nowrap"
                  >
                    <item.icon className="text-xl sm:text-2xl shrink-0 text-gray-500" />
                    <span className="font-medium text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden py-4 md:py-6">
              <div className="flex animate-ticker-reverse">
                {[...toolsRow2, ...toolsRow2].map((item, i) => (
                  <div
                    key={`r2-${i}`}
                    className="flex items-center gap-1.5 sm:gap-2 shrink-0 px-3 sm:px-8 text-sm sm:text-lg whitespace-nowrap"
                  >
                    <item.icon className="text-xl sm:text-2xl shrink-0 text-gray-500" />
                    <span className="font-medium text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <div className="mb-10 md:mb-16">
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
              Case Studies
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
              Selected <span className="text-amber">Work</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Real outcomes from real projects — measured by the metrics that matter to your
              business.
            </p>
          </div>
          <div className="relative">
            {useCarousel && (
              <>
                <button
                  type="button"
                  aria-label="Scroll portfolio left"
                  disabled={!canScrollLeft}
                  onClick={() => scrollCarousel("left")}
                  className="hidden md:flex absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-amber hover:text-black text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/70 disabled:hover:text-white z-10"
                >
                  <HiArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll portfolio right"
                  disabled={!canScrollRight}
                  onClick={() => scrollCarousel("right")}
                  className="hidden md:flex absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-amber hover:text-black text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/70 disabled:hover:text-white z-10"
                >
                  <HiArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className={
                useCarousel
                  ? "flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory"
                  : "grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14 max-w-4xl mx-auto pb-20"
              }
            >
              {caseStudies.map((project) => (
                <a
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className={
                    useCarousel
                      ? "group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all shrink-0 w-[300px] sm:w-[340px] md:w-[380px] snap-center block"
                      : "group bg-[#151515] rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/15 transition-colors block"
                  }
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      alt={project.title}
                      className={
                        useCarousel
                          ? "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          : "w-full h-full object-cover"
                      }
                      loading="lazy"
                      src={project.image}
                    />
                    <span
                      className={
                        useCarousel
                          ? "absolute top-4 left-4 bg-amber/90 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider"
                          : "absolute top-4 left-4 text-[10px] font-bold tracking-[0.25em] uppercase text-amber/80"
                      }
                    >
                      {project.category}
                    </span>
                  </div>
                  <div className={useCarousel ? "p-6 space-y-3" : "p-8 sm:p-10 space-y-5"}>
                    <div className="flex items-baseline gap-2 sm:gap-3 mb-1.5">
                      <span
                        className={
                          useCarousel
                            ? "text-amber text-2xl sm:text-3xl font-heading font-black tabular-nums tracking-tight shrink-0"
                            : "text-amber text-xl sm:text-2xl font-heading font-semibold tabular-nums tracking-tight shrink-0"
                        }
                      >
                        {project.shortMetric}
                      </span>
                      <span
                        className={
                          useCarousel
                            ? "min-w-0 flex-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-500 font-bold truncate"
                            : "min-w-0 flex-1 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium truncate"
                        }
                      >
                        {project.shortLabel}
                      </span>
                    </div>
                    <h3
                      className={
                        useCarousel
                          ? "font-heading font-bold text-xl text-white"
                          : "font-heading font-semibold text-xl sm:text-2xl tracking-tight text-white"
                      }
                    >
                      {project.title}
                    </h3>
                    <p
                      className={
                        useCarousel
                          ? "text-gray-400 text-sm leading-relaxed"
                          : "text-gray-500 text-[13px] leading-relaxed line-clamp-3"
                      }
                    >
                      {project.description}
                    </p>
                    <span
                      className={
                        useCarousel
                          ? "inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider group/link"
                          : "inline-flex items-center gap-2 pt-5 border-t border-white/[0.06] text-amber text-xs font-bold uppercase tracking-wider group/link"
                      }
                    >
                      View Case Study
                      <HiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:flex justify-end mt-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-amber text-sm font-bold uppercase tracking-wider hover:text-amber-light transition-colors group"
            >
              View All Projects
              <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-black rounded-2xl border border-white/5 p-6 sm:p-8 lg:p-10 text-center"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-amber/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 left-1/3 w-[320px] h-[160px] bg-amber/5 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] bg-amber/4 rounded-full blur-[100px]" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4 relative z-10">
            <HiSparkles className="text-amber text-sm" />
            <p className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
              Ready When You Are
            </p>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-black leading-[0.95] mb-3 text-white max-w-xl mx-auto relative z-10">
            Let’s build a website that <span className="text-amber">converts</span>.
          </h3>

          <button
            onClick={openContactModal}
            className="group relative z-10 inline-flex px-6 sm:px-8 py-3.5 sm:py-4 bg-amber text-black font-bold rounded-xl items-center justify-center gap-2 sm:gap-3 hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 text-sm sm:text-base"
          >
            Start Your Web Project
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-gray-500 mt-5 relative z-10">
            🔒 No spam. Your data stays private.
          </p>
        </motion.div>
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
