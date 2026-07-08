"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  HiBolt,
  HiShieldCheck,
  HiChartBar,
  HiCpuChip,
} from "react-icons/hi2";

const benefits = [
  {
    icon: HiShieldCheck,
    title: "Premium Quality & Precision",
    description:
      "Every deliverable is engineered with meticulous attention to detail, ensuring your brand commands authority from day one.",
    stat: "100%",
    statLabel: "Client Retention",
  },
  {
    icon: HiBolt,
    title: "Fast, Reliable Delivery",
    description:
      "Our agile processes mean you get high-quality output on aggressive timelines without sacrificing excellence.",
    stat: "48h",
    statLabel: "Avg. Turnaround",
  },
  {
    icon: HiChartBar,
    title: "Data-Driven Results",
    description:
      "We measure everything that matters. Every decision is backed by analytics to maximize your return on investment.",
    stat: "5x",
    statLabel: "Avg. ROAS",
  },
  {
    icon: HiCpuChip,
    title: "Modern Technology Stack",
    description:
      "Built on cutting-edge tools — Next.js, AI, automation — so your infrastructure scales with your ambition.",
    stat: "15+",
    statLabel: "Tech Partners",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function WhyChooseUs() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = 300;
      const gap = 16;
      const padding = 24;
      const center = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.floor((center - padding) / (cardWidth + gap));
      setActiveCardIndex(Math.max(0, Math.min(idx, benefits.length - 1)));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about" className="pt-0 pb-20 md:pt-0 md:pb-28 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-amber/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-amber/4 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-16"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse shrink-0" />
            <span className="text-xs font-bold text-amber uppercase tracking-[0.2em]">
              Why Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            Not Just Another{" "}
            <span className="text-amber">Agency</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            We build digital assets that drive valuation and market authority
            — not just websites.
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-2 -mx-6 px-6 snap-x snap-mandatory menu-scroll"
          >
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className="snap-center shrink-0 w-[300px] bg-card-dark rounded-[32px] p-6 border border-white/5 relative overflow-hidden shadow-xl shadow-black/50 flex flex-col"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <benefit.icon className="text-amber text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-white mb-1.5 tracking-tight">{benefit.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{benefit.description}</p>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <div className="text-xl font-heading font-black text-amber">{benefit.stat}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{benefit.statLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Scroll dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {benefits.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ease-out ${
                  i === activeCardIndex ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="hidden lg:grid lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              className="group bg-card-dark rounded-[32px] p-7 border border-white/5 relative overflow-hidden hover:border-amber/20 transition-all duration-500 shadow-xl shadow-black/50 flex flex-col"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all duration-500 pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-5 flex-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-shadow">
                  <benefit.icon className="text-amber text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-xl text-white mb-2 tracking-tight">{benefit.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">{benefit.description}</p>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <div className="text-2xl font-heading font-black text-amber">{benefit.stat}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{benefit.statLabel}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>


      </div>
    </section>
  );
}
