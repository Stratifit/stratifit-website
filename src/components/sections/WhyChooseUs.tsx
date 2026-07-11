"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HiBolt, HiShieldCheck, HiChartBar, HiCpuChip } from "react-icons/hi2";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, type WhyChooseUsBenefit } from "@/lib/cms-types";
import { tLabel } from "@/lib/stratifit-i18n";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HiShieldCheck,
  HiBolt,
  HiChartBar,
  HiCpuChip,
};

interface BenefitData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

// Fallback benefit data uses key references (resolved via tLabel at render time).
// The BenefitData interface (used by the CMS branch) expects resolved strings,
// so we deliberately leave this untyped to allow the alternate shape.
const FALLBACK_BENEFITS = [
  {
    icon: HiShieldCheck,
    titleKey: "benefit_1_title",
    descKey: "benefit_1_desc",
    stat: "100%",
    statLabelKey: "benefit_1_stat_label",
  },
  {
    icon: HiBolt,
    titleKey: "benefit_2_title",
    descKey: "benefit_2_desc",
    stat: "48h",
    statLabelKey: "benefit_2_stat_label",
  },
  {
    icon: HiChartBar,
    titleKey: "benefit_3_title",
    descKey: "benefit_3_desc",
    stat: "5x",
    statLabelKey: "benefit_3_stat_label",
  },
  {
    icon: HiCpuChip,
    titleKey: "benefit_4_title",
    descKey: "benefit_4_desc",
    stat: "15+",
    statLabelKey: "benefit_4_stat_label",
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
  const { lang } = useLanguage();
  const { data: cmsBenefits } = useCms<WhyChooseUsBenefit[]>("why_choose_us_benefits", { fallback: [] });

  const benefits: BenefitData[] =
    cmsBenefits && cmsBenefits.length > 0
      ? [...cmsBenefits]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((b) => ({
            icon: ICON_MAP[b.icon] || HiShieldCheck,
            title: t(b.title, lang),
            description: t(b.description, lang),
            stat: t(b.stat, lang),
            statLabel: t(b.stat_label, lang),
          }))
      : FALLBACK_BENEFITS.map((b) => ({
          icon: b.icon,
          title: tLabel(b.titleKey, lang),
          description: tLabel(b.descKey, lang),
          stat: b.stat,
          statLabel: tLabel(b.statLabelKey, lang),
        }));
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
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
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
            <span className="text-xs font-bold text-amber uppercase tracking-[0.2em]">{tLabel("why_us_label", lang)}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            {tLabel("why_us_title_prefix", lang)} <span className="text-amber">{tLabel("why_us_title_highlight", lang)}</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            {tLabel("why_us_subtitle", lang)}
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
                    <h3 className="font-heading font-bold text-lg text-white mb-1.5 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                      {benefit.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <div className="text-xl font-heading font-black text-amber">{benefit.stat}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {benefit.statLabel}
                    </div>
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
              className="group bg-card-dark rounded-[32px] p-6 md:p-8 border border-white/5 relative overflow-hidden hover:border-amber/20 transition-all duration-500 shadow-xl shadow-black/50 flex flex-col"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all duration-500 pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-5 flex-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-shadow">
                  <benefit.icon className="text-amber text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-xl text-white mb-2 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <div className="text-2xl font-heading font-black text-amber">{benefit.stat}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {benefit.statLabel}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
