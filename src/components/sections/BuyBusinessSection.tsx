"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowRight, HiGlobeAlt, HiShieldCheck } from "react-icons/hi2";
import Link from "next/link";
import { allBrands, niches, productEmojis, nicheCtaLabel, getBrandAccent, getBrandBadge } from "@/data/buy-business";
import { slugify } from "@/lib/slugify";

const nicheFilters = ["All", ...niches.map((n) => n.title)];

const badgeClasses: Record<string, string> = {
  pill: "rounded-full", square: "rounded-md", glass: "rounded-full backdrop-blur-sm", dot: "rounded-full",
};

export function BuyBusinessSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredBrands =
    activeFilter === "All"
      ? allBrands
      : allBrands.filter((b) => b.niche === activeFilter);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = 340;
      const gap = 24;
      const padding = 24;
      const center = el.scrollLeft + el.clientWidth / 2;
      const idx = Math.floor((center - padding) / (cardWidth + gap));
      setActiveIndex(Math.max(0, Math.min(idx, filteredBrands.length - 1)));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [filteredBrands.length, activeFilter]);

  const BrandCard = ({ brand, i, isMobile }: { brand: typeof allBrands[0]; i: number; isMobile: boolean }) => {
    const nicheSlug = slugify(brand.niche);
    const emojis = productEmojis[brand.niche] || ["📦", "⭐", "🔧"];
    const accent = getBrandAccent(brand, i);
    const badge = getBrandBadge(brand, i);

    return (
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.4 }}
        className={`group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all duration-300 flex flex-col ${
          isMobile ? "shrink-0 w-[320px] sm:w-[360px] snap-center" : ""
        }`}
      >
        {/* ── Browser Chrome ── */}
        <div className="bg-[#1a1a1a] px-3 py-2 flex items-center gap-1.5 border-b border-white/5">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <span className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 mx-2 bg-[#0d0d0d] rounded px-2 py-1 flex items-center gap-1 border border-white/5 min-w-0">
            <HiGlobeAlt className="text-gray-600 text-[8px] shrink-0" />
            <span className="text-[8px] text-gray-500 truncate">{brand.websiteUrl.replace("https://", "")}</span>
          </div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 shrink-0 uppercase tracking-wider" style={{ color: "#fff", background: accent + "30", borderColor: accent + "50", border: "1px solid", borderRadius: badge === "square" ? "4px" : "9999px" }}>
            {brand.niche}
          </span>
        </div>

        {/* ── Mini Website Navigation ── */}
        <div className="bg-[#141414] px-4 py-1.5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-1">
            <span className="text-base">{brand.logo}</span>
            <span className="text-[9px] font-bold text-gray-300 ml-0.5">{brand.name}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[7px] sm:text-[8px] text-gray-600 font-medium uppercase tracking-wider" aria-hidden="true">Home</span>
            <span className="text-[7px] sm:text-[8px] text-gray-600 font-medium uppercase tracking-wider" aria-hidden="true">About</span>
            <span className="text-[7px] sm:text-[8px] text-gray-600 font-medium uppercase tracking-wider" aria-hidden="true">Products</span>
            <span className="text-[7px] sm:text-[8px] text-amber/60 font-medium uppercase tracking-wider" aria-hidden="true">Contact</span>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div className="relative h-28 sm:h-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-500"
            style={{ backgroundImage: `url(${brand.image})` }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accent}40, transparent 60%)` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-black/60 backdrop-blur-sm border flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${badgeClasses[badge] || "rounded-xl"}`} style={{ borderColor: accent + "50", boxShadow: `0 0 25px ${accent}15` }}>
              <span className="text-2xl sm:text-3xl">{brand.logo}</span>
            </div>
          </div>
        </div>

        {/* ── Website Body Content ── */}
        <div
          className="relative overflow-hidden flex flex-col items-center text-center px-4 sm:px-5 pt-5 pb-4 flex-1"
          style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #111 40%, #0d0d0d 100%)" }}
        >
          <h3 className="relative z-10 font-heading font-black text-white tracking-tight text-lg sm:text-xl mb-2 group-hover:text-white transition-colors duration-300">
            {brand.name}
          </h3>
          <p className="relative z-10 text-gray-400 leading-relaxed text-[10px] sm:text-[11px] max-w-[260px] line-clamp-2 mt-1 opacity-70">
            {brand.description}
          </p>

          <div className="relative z-10 flex flex-wrap justify-center gap-1 mt-3 mb-4">
            {brand.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[7px] sm:text-[8px] font-medium text-gray-500 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>

          <div className="relative z-10 w-full max-w-[250px] mb-4">
            <div className="grid grid-cols-3 gap-1.5">
              {emojis.map((emoji, idx) => (
                <div key={idx} className="aspect-square rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-amber/10 transition-colors duration-300">
                  <span className="text-sm sm:text-base opacity-40 group-hover:opacity-60 transition-opacity">{emoji}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[220px] mb-3">
            <span className="block w-full py-1.5 rounded-lg bg-amber/10 border border-amber/20 text-amber text-[8px] sm:text-[9px] font-bold text-center group-hover:bg-amber/15 transition-colors">
              {nicheCtaLabel[brand.niche] || "Learn More →"}
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap w-full max-w-[250px]">
            {brand.trustBadges.slice(0, 3).map((b) => (
              <span key={b} className="flex items-center gap-0.5 text-[7px] sm:text-[8px] text-gray-500 font-medium">
                <HiShieldCheck className="text-[8px] sm:text-[9px] text-amber/30" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── Action Section ── */}
        <div className="border-t border-white/5">
          <div className="px-4 sm:px-5 pt-3 pb-2 flex items-center justify-between">
            <span className="font-heading font-black text-amber text-sm sm:text-base tracking-tight">
              {brand.price}
            </span>
            <Link href={`/buy-business/niches/${nicheSlug}/${brand.slug}`} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 font-bold hover:text-amber transition-colors group/link">
              View Full Detail
              <HiArrowRight className="text-[10px] sm:text-xs group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="px-4 sm:px-5 pb-3 flex items-center gap-2">
            <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber text-black font-bold rounded-lg hover:bg-amber-light transition-all shadow-[0_0_12px_rgba(245,158,11,0.12)] active:scale-95 text-xs sm:text-sm">
              <HiGlobeAlt className="text-sm sm:text-base" />
              Visit Site
            </a>
            <a href="#contact" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-amber/30 text-amber font-bold rounded-lg hover:bg-amber/10 transition-all active:scale-95 text-xs sm:text-sm">
              Buy Business
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber/2 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Acquisition</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            Buy a <span className="text-amber">Business</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            Skip the startup grind. Browse turnkey businesses with real revenue, existing customers, and systems already in place.
          </p>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 mb-10">
          {nicheFilters.map((filter) => (
            <button key={filter} onClick={() => { setActiveFilter(filter); setActiveIndex(0); if (scrollRef.current) scrollRef.current.scrollLeft = 0; }}
              className={`px-5 py-2.5 rounded-full font-bold text-sm shrink-0 transition-all ${activeFilter === filter ? "bg-amber text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]" : "bg-white/5 border border-white/10 text-white hover:border-amber/30"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 bg-card-dark border border-white/5 rounded-2xl px-8 py-6">
              <p className="text-gray-400 text-sm font-medium">No businesses found in <span className="text-amber font-bold">{activeFilter}</span></p>
            </div>
          </div>
        )}

        {filteredBrands.length > 0 && (
          <>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBrands.slice(0, 8).map((brand, i) => (
                <BrandCard key={brand.slug} brand={brand} i={i} isMobile={false} />
              ))}
            </div>
            <div className="hidden md:flex justify-end mt-8">
              <Link href="/buy-business" className="inline-flex items-center gap-2 text-amber text-sm font-bold uppercase tracking-wider hover:text-amber-light transition-colors group">
                View All Businesses <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="md:hidden">
              <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory menu-scroll">
                {filteredBrands.map((brand, i) => (
                  <BrandCard key={brand.slug} brand={brand} i={i} isMobile={true} />
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {filteredBrands.map((_, idx) => (
                  <div key={idx} className={`rounded-full transition-all duration-200 ease-out ${idx === activeIndex ? "w-3 h-1.5 bg-amber" : "w-1.5 h-1.5 bg-white/20"}`} />
                ))}
              </div>
            </div>
            <div className="md:hidden flex justify-center mt-2">
              <Link href="/buy-business" className="inline-flex items-center gap-1.5 text-amber text-xs font-bold uppercase tracking-wider hover:text-amber-light transition-colors">
                View All <HiArrowRight className="text-xs" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
