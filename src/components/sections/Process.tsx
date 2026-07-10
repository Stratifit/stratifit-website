"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiLightBulb,
  HiWrenchScrewdriver,
  HiRocketLaunch,
} from "react-icons/hi2";

const steps = [
  {
    number: "01",
    icon: HiMagnifyingGlass,
    title: "Discovery",
    description:
      "We dive deep into your business goals, audience, and challenges to build a rock-solid foundation for every decision.",
  },
  {
    number: "02",
    icon: HiLightBulb,
    title: "Strategy",
    description:
      "We design a comprehensive plan covering brand, web, AI, and growth — aligned with your revenue targets.",
  },
  {
    number: "03",
    icon: HiWrenchScrewdriver,
    title: "Build",
    description:
      "Our team implements systems, websites, automations, and campaigns with precision engineering.",
  },
  {
    number: "04",
    icon: HiRocketLaunch,
    title: "Launch & Grow",
    description:
      "We optimize, scale, and measure everything. Continuous improvement is built into our DNA.",
  },
];

export function Process() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = processRef.current;
    if (!el) return;
    const handleScroll = () => {
      // Calculate active step for dot indicator
      const cardWidth = 280;
      const gap = 16;
      const padding = 24;
      const center = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.floor((center - padding) / (cardWidth + gap));
      setActiveStepIndex(Math.max(0, Math.min(idx, steps.length - 1)));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Process</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            How We <span className="text-amber">Work</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            A proven framework that takes you from idea to scale — predictably and efficiently.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="bg-card-dark rounded-2xl p-8 border border-white/5 hover:border-amber/20 transition-all duration-300 h-full relative overflow-hidden">
                {/* STEP Badge */}
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber rounded-bl-xl">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest">
                    STEP {step.number}
                  </span>
                </div>

                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <step.icon className="text-amber text-3xl" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Connector arrow (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-amber/30">
                  &rarr;
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div
            ref={processRef}
            className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="min-w-[280px] w-[80vw] max-w-[320px] bg-card-dark rounded-2xl p-6 border border-white/5 snap-center shrink-0 flex flex-col relative overflow-hidden"
              >
                {/* STEP Badge */}
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber rounded-bl-xl">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest">
                    STEP {step.number}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <step.icon className="text-amber text-2xl" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Dot Indicators (matching Not Just Another Agency) */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ease-out ${
                  i === activeStepIndex ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
