"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiCheck } from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, ta, type ServicePackage } from "@/lib/cms-types";
import { tLabel } from "@/lib/stratifit-i18n";

interface PackageData {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

// Fallback package data uses key references (resolved via tLabel at render time).
// The PackageData interface (used by the CMS branch) expects resolved strings,
// so we deliberately leave this untyped to allow the alternate shape.
const FALLBACK_PACKAGES = [
  {
    nameKey: "package_launch_name", price: "$5,000", period: "/ project",
    descKey: "package_launch_desc",
    featuresKeys: ["package_launch_f1", "package_launch_f2", "package_launch_f3", "package_launch_f4"],
    popular: false, ctaKey: "package_launch_cta",
  },
  {
    nameKey: "package_grow_name", price: "$12,000", period: "/ project",
    descKey: "package_grow_desc",
    featuresKeys: ["package_grow_f1", "package_grow_f2", "package_grow_f3", "package_grow_f4", "package_grow_f5"],
    popular: true, ctaKey: "package_grow_cta",
  },
  {
    nameKey: "package_scale_name", price: "$25,000", period: "/ project",
    descKey: "package_scale_desc",
    featuresKeys: ["package_scale_f1", "package_scale_f2", "package_scale_f3", "package_scale_f4", "package_scale_f5"],
    popular: false, ctaKey: "package_scale_cta",
  },
  {
    nameKey: "package_custom_name", price: "Let's Talk", period: "",
    descKey: "package_custom_desc",
    featuresKeys: ["package_custom_f1", "package_custom_f2", "package_custom_f3", "package_custom_f4", "package_custom_f5"],
    popular: false, ctaKey: "package_custom_cta",
  },
];

export function Packages() {
  const { lang } = useLanguage();
  const { data: cmsPackages } = useCms<ServicePackage[]>("service_packages", { fallback: [] });

  const packages: PackageData[] =
    cmsPackages && cmsPackages.length > 0
      ? [...cmsPackages]
          .filter((p) => p.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => ({
            name: t(p.name, lang),
            price: t(p.price, lang),
            period: t(p.period, lang),
            description: t(p.description, lang),
            features: ta(p.features, lang),
            popular: p.is_popular,
            cta: t(p.cta_text, lang),
          }))
      : FALLBACK_PACKAGES.map((p) => ({
          name: tLabel(p.nameKey, lang),
          price: p.price,
          period: p.period,
          description: tLabel(p.descKey, lang),
          features: p.featuresKeys.map((k) => tLabel(k, lang)),
          popular: p.popular,
          cta: tLabel(p.ctaKey, lang),
        }));
  const [activePackageIndex, setActivePackageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll to "Most Popular" (Grow) on mount
    const mostPopularIndex = 1; // Grow is the second package
    const cardWidth = 280;
    const gap = 16;
    const padding = 24;
    el.scrollTo({
      left: padding + mostPopularIndex * (cardWidth + gap) - el.clientWidth / 2 + cardWidth / 2,
      behavior: "instant",
    });

    const handleScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.floor((center - padding) / (cardWidth + gap));
      setActivePackageIndex(Math.max(0, Math.min(idx, packages.length - 1)));
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
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">{tLabel("pricing_label", lang)}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            {tLabel("pricing_title_prefix", lang)} <span className="text-amber">{tLabel("pricing_title_highlight", lang)}</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            {tLabel("pricing_subtitle", lang)}
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative bg-card-dark rounded-2xl p-6 md:p-8 border flex flex-col ${
                pkg.popular
                  ? "border-amber shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  : "border-white/5 hover:border-amber/20"
              } transition-all`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  {tLabel("most_popular", lang)}
                </div>
              )}

              <h3 className="font-heading font-bold text-2xl text-white mb-2">{pkg.name}</h3>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-heading font-black text-amber">{pkg.price}</span>
                {pkg.period && (
                  <span className="text-xs font-bold text-gray-500 uppercase">{pkg.period}</span>
                )}
              </div>

              <p className="text-sm text-gray-400 mb-8">{pkg.description}</p>

              <div className="h-px bg-white/5 w-full mb-6" />

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <HiCheck className="text-amber shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={openContactModal}
                className={`block w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all uppercase tracking-wide ${
                  pkg.popular
                    ? "bg-amber text-black hover:bg-amber-light shadow-lg shadow-amber/20"
                    : "border border-amber text-amber hover:bg-amber/10"
                }`}
              >
                {pkg.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pt-5 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll"
          >
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative bg-card-dark rounded-2xl p-6 border flex flex-col min-w-[280px] w-[80vw] max-w-[320px] snap-center shrink-0 h-[500px] ${
                  pkg.popular
                    ? "border-amber shadow-[0_0_30px_rgba(245,158,11,0.15)] pt-5"
                    : "border-white/5"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    {tLabel("most_popular", lang)}
                  </div>
                )}

                <h3 className="font-heading font-bold text-xl text-white mb-2">{pkg.name}</h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-heading font-black text-amber">{pkg.price}</span>
                  {pkg.period && (
                    <span className="text-xs font-bold text-gray-500 uppercase">{pkg.period}</span>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-6">{pkg.description}</p>

                <div className="h-px bg-white/5 w-full mb-5" />

                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <HiCheck className="text-amber shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={openContactModal}
                  className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition-all uppercase tracking-wide ${
                    pkg.popular
                      ? "bg-amber text-black hover:bg-amber-light shadow-lg shadow-amber/20"
                      : "border border-amber text-amber hover:bg-amber/10"
                  }`}
                >
                  {pkg.cta}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {packages.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ease-out ${
                  i === activePackageIndex ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
