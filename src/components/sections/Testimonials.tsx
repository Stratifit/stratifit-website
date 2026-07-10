"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiStar, HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import Link from "next/link";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth >= 768 ? 400 : window.innerWidth >= 640 ? 360 : 300;
    const gap = 24;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = 320;
      const gap = 24;
      const padding = 24;
      const center = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.floor((center - padding) / (cardWidth + gap));
      setActiveTestimonialIndex(Math.max(0, Math.min(idx, testimonials.length - 1)));
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-black relative overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            What Our Clients <span className="text-amber">Say</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            Don&apos;t take our word for it — hear from the brands we&apos;ve helped scale.
          </p>
        </motion.div>

        {/* Single horizontal scroll line */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={false}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="min-w-[300px] w-[300px] sm:w-[360px] md:w-[400px] bg-card-dark p-6 md:p-8 rounded-2xl border border-white/5 hover:border-amber/20 transition-all shrink-0 snap-center"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                      {t.role}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <HiStar key={j} className="text-amber" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed text-sm">&ldquo;{t.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Left/Right Scroll Arrows */}
          <button
            type="button"
            onClick={() => scrollBy("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll testimonials left"
            className="hidden md:flex absolute -left-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-amber hover:text-black text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/70 disabled:hover:text-white z-10"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            disabled={!canScrollRight}
            aria-label="Scroll testimonials right"
            className="hidden md:flex absolute -right-20 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/70 hover:bg-amber hover:text-black text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/70 disabled:hover:text-white z-10"
          >
            <HiArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-3 relative">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-200 ease-out ${
                i === activeTestimonialIndex ? "w-1.5 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"
              }`}
            />
          ))}
          <Link
            href="/testimonials"
            className="md:hidden absolute right-0 inline-flex items-center gap-1 text-amber text-[10px] font-bold uppercase tracking-wider hover:text-amber-light transition-colors"
          >
            View All
            <HiArrowRight className="text-[10px]" />
          </Link>
        </div>

        {/* Desktop View All */}
        <div className="hidden md:flex justify-end mt-8">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-amber text-sm font-bold uppercase tracking-wider hover:text-amber-light transition-colors group"
          >
            View All Testimonials
            <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
