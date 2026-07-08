"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import Link from "next/link";
import { insights } from "@/data/insights";

const featuredInsights = insights.slice(0, 4);

export function Insights() {
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);
  const insightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = insightRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = 280;
      const gap = 16;
      const padding = 24;
      const center = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.floor((center - padding) / (cardWidth + gap));
      setActiveInsightIndex(Math.max(0, Math.min(idx, featuredInsights.length - 1)));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="insights" className="py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
            Knowledge
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            Insights &amp;{" "}
            <span className="text-amber">Expertise</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            Thought leadership and industry perspectives from our team of
            strategists and engineers.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredInsights.map((insight, i) => (
            <motion.article
              key={insight.slug}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <img
                  src={insight.image}
                  alt={insight.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 text-amber text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {insight.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-heading font-bold text-lg text-white leading-snug">
                  {insight.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {insight.excerpt}
                </p>
                <Link
                  href={`/insights/${insight.slug}`}
                  className="inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider hover:text-amber-light transition-colors group/link"
                >
                  Read Insight
                  <HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Desktop View All */}
        <div className="hidden md:flex justify-end mt-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-amber text-sm font-bold uppercase tracking-wider hover:text-amber-light transition-colors group"
          >
            View All Insights
            <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div ref={insightRef} className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory menu-scroll">
            {featuredInsights.map((insight, i) => (
              <motion.article
                key={insight.slug}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="min-w-[280px] w-[80vw] max-w-[340px] bg-card-dark rounded-2xl overflow-hidden border border-white/5 snap-center shrink-0 flex flex-col"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={insight.image}
                    alt={insight.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 text-amber text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                    {insight.category}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-base text-white leading-snug">
                    {insight.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {insight.excerpt}
                  </p>
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider hover:text-amber-light transition-colors group/link mt-auto"
                  >
                    Read Insight
                    <HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Dot Indicators + View All */}
          <div className="flex items-center justify-center gap-1.5 mt-3 relative">
            {featuredInsights.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ease-out ${
                  i === activeInsightIndex ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
            <Link
              href="/insights"
              className="absolute right-0 inline-flex items-center gap-1 text-amber text-[10px] font-bold uppercase tracking-wider hover:text-amber-light transition-colors"
            >
              View All
              <HiArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
