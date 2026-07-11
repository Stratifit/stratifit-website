"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiLightBulb,
  HiWrenchScrewdriver,
  HiRocketLaunch,
} from "react-icons/hi2";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, type ProcessStep } from "@/lib/cms-types";
import { tLabel } from "@/lib/stratifit-i18n";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HiMagnifyingGlass,
  HiLightBulb,
  HiWrenchScrewdriver,
  HiRocketLaunch,
};

interface StepData {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// Fallback step data uses key references (resolved via tLabel at render time).
// The StepData interface (used by the CMS branch) expects resolved strings,
// so we deliberately leave this untyped to allow the alternate shape.
const FALLBACK_STEPS = [
  {
    number: "01",
    icon: HiMagnifyingGlass,
    titleKey: "step_1_title",
    descKey: "step_1_desc",
  },
  {
    number: "02",
    icon: HiLightBulb,
    titleKey: "step_2_title",
    descKey: "step_2_desc",
  },
  {
    number: "03",
    icon: HiWrenchScrewdriver,
    titleKey: "step_3_title",
    descKey: "step_3_desc",
  },
  {
    number: "04",
    icon: HiRocketLaunch,
    titleKey: "step_4_title",
    descKey: "step_4_desc",
  },
];

export function Process() {
  const { lang } = useLanguage();
  const { data: cmsSteps } = useCms<ProcessStep[]>("process_steps", { fallback: [] });

  const steps: StepData[] =
    cmsSteps && cmsSteps.length > 0
      ? [...cmsSteps]
          .sort((a, b) => a.step_number - b.step_number)
          .map((s) => ({
            number: String(s.step_number).padStart(2, "0"),
            icon: ICON_MAP[s.icon] || HiMagnifyingGlass,
            title: t(s.title, lang),
            description: t(s.description, lang),
          }))
      : FALLBACK_STEPS.map((s) => ({
          number: s.number,
          icon: s.icon,
          title: tLabel(s.titleKey, lang),
          description: tLabel(s.descKey, lang),
        }));

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = processRef.current;
    if (!el) return;
    const handleScroll = () => {
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
  }, [steps.length]);

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
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">{tLabel("process_label", lang)}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            {tLabel("process_title_prefix", lang)} <span className="text-amber">{tLabel("process_title_highlight", lang)}</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            {tLabel("process_subtitle", lang)}
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
              <div className="bg-card-dark rounded-2xl p-6 md:p-8 border border-white/5 hover:border-amber/20 transition-all duration-300 h-full relative overflow-hidden">
                {/* STEP Badge */}
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber rounded-bl-xl">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest">
                    {tLabel("step_badge", lang)} {step.number}
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
                    {tLabel("step_badge", lang)} {step.number}
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
