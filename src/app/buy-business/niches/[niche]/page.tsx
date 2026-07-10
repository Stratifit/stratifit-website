"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiArrowLeft,
  HiCheck,
  HiSparkles,
  HiGlobeAlt,
  HiShieldCheck,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getNicheBySlug,
  niches,
  productEmojis,
  nicheCtaLabel,
  getBrandAccent,
  getBrandBadge,
} from "@/data/buy-business";
import { openContactModal } from "@/components/contact/ContactModal";

export default function NichePage({ params }: { params: Promise<{ niche: string }> }) {
  const { niche: nicheSlug } = use(params);
  const niche = getNicheBySlug(nicheSlug);
  const router = useRouter();

  if (!niche) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-6">🔍</p>
          <h1 className="text-3xl font-heading font-black text-white mb-4">Niche Not Found</h1>
          <p className="text-gray-400 mb-8">The niche you are looking for does not exist.</p>
          <Link
            href="/buy-business"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all"
          >
            <HiArrowLeft /> Back to Businesses
          </Link>
        </div>
      </main>
    );
  }

  const emojis = productEmojis[niche.title] || ["📦", "⭐", "🔧"];
  const ctaLabel = nicheCtaLabel[niche.title] || "Learn More →";

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-24 pb-8 md:pt-28">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-amber/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-amber/3 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                Business Acquisition
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{niche.icon}</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[0.95]">
                {niche.title} <span className="text-amber">Businesses</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
              {niche.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24 pb-24 md:pb-32">
        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <HiSparkles className="text-amber text-xl" />
            <h3 className="text-amber font-bold text-xl uppercase tracking-wider">
              Why {niche.title}?
            </h3>
          </div>
          <p className="text-white text-sm sm:text-base font-medium leading-relaxed mb-6 relative z-10">
            {niche.title} businesses represent one of the most attractive acquisition opportunities
            in today&apos;s market. With proven business models, established revenue streams, and
            significant growth potential, these assets offer a faster path to ownership than
            building from scratch.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10">
            {niche.stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#1E1E1E] rounded-xl p-3 sm:p-4 border border-white/5 hover:border-amber/30 transition-all duration-300 flex flex-col items-center text-center gap-1.5 group/badge"
              >
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

        {/* What's Included */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Package</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-tight tracking-tight mb-3">
              What&apos;s <span className="text-amber">Included</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Every acquisition includes everything you need to hit the ground running from day one.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {niche.whatIsIncluded.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex items-start gap-3 bg-card-dark rounded-xl p-4 border border-white/5 hover:border-amber/20 transition-all"
              >
                <HiCheck className="text-amber shrink-0 mt-0.5" />
                <span className="text-white text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Available Brands — Premium Mini-Website Cards */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Listings</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-tight tracking-tight mb-3">
              Available <span className="text-amber">{niche.title}</span> Brands
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              {niche.brands.length} turnkey {niche.title.toLowerCase()} businesses currently
              available for acquisition.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {niche.brands.map((brand, i) => {
              const accent = getBrandAccent(brand, i);
              const badge = getBrandBadge(brand, i);
              const badgeClasses: Record<string, string> = {
                pill: "rounded-full",
                square: "rounded-md",
                glass: "rounded-full backdrop-blur-sm",
                dot: "rounded-full",
              };
              return (
                <motion.div
                  key={brand.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all duration-300 flex flex-col"
                >
                  {/* ── Browser Chrome ── */}
                  <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center gap-2 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 mx-3 bg-[#0d0d0d] rounded-md px-3 py-1.5 flex items-center gap-2 border border-white/5">
                      <HiGlobeAlt className="text-gray-500 text-xs shrink-0" />
                      <span className="text-[10px] text-gray-500 truncate">
                        {brand.websiteUrl.replace("https://", "")}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 shrink-0 uppercase tracking-wider"
                      style={{
                        color: accent,
                        background: accent + "18",
                        borderColor: accent + "30",
                        border: "1px solid",
                        borderRadius: badge === "square" ? "6px" : "9999px",
                      }}
                    >
                      {brand.niche}
                    </span>
                  </div>

                  {/* ── Mini Website Navigation ── */}
                  <div className="bg-[#141414] px-5 py-2 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{brand.logo}</span>
                      <span className="text-[10px] font-bold text-gray-300 ml-0.5">
                        {brand.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span
                        className="text-[8px] sm:text-[9px] text-gray-600 font-medium uppercase tracking-wider"
                        aria-hidden="true"
                      >
                        Home
                      </span>
                      <span
                        className="text-[8px] sm:text-[9px] text-gray-600 font-medium uppercase tracking-wider"
                        aria-hidden="true"
                      >
                        About
                      </span>
                      <span
                        className="text-[8px] sm:text-[9px] text-gray-600 font-medium uppercase tracking-wider"
                        aria-hidden="true"
                      >
                        Products
                      </span>
                      <span
                        className="text-[8px] sm:text-[9px] text-amber/60 font-medium uppercase tracking-wider"
                        aria-hidden="true"
                      >
                        Contact
                      </span>
                    </div>
                  </div>

                  {/* ── Hero Banner (image placeholder) ── */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                      style={{ backgroundImage: `url(${brand.image})` }}
                    />
                    {/* Gradient overlay — unique per-brand color */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${accent}40, transparent 60%)`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-sm border flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${badgeClasses[badge] || "rounded-2xl"}`}
                        style={{
                          borderColor: accent + "40",
                          boxShadow: `0 0 30px ${accent}10`,
                          borderRadius:
                            badge === "glass" ? "20px" : badge === "square" ? "12px" : "20px",
                        }}
                      >
                        <span className="text-3xl md:text-4xl">{brand.logo}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Website Body Content ── */}
                  <div
                    className="relative overflow-hidden flex flex-col items-center text-center px-6 pt-6 pb-5 flex-1"
                    style={{
                      background: "linear-gradient(180deg, #0d0d0d 0%, #111 40%, #0d0d0d 100%)",
                    }}
                  >
                    {/* Brand Name */}
                    <h3
                      className="relative z-10 font-heading font-black text-2xl md:text-3xl text-white tracking-tight group-hover:text-white transition-colors duration-300"
                      style={{ color: "inherit" }}
                    >
                      {brand.name}
                    </h3>
                    {/* Description */}
                    <p className="relative z-10 text-gray-400 leading-relaxed text-xs sm:text-sm max-w-md mt-2 opacity-75">
                      {brand.description}
                    </p>

                    {/* Tags */}
                    <div className="relative z-10 flex flex-wrap justify-center gap-1.5 mt-4 mb-5">
                      {brand.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] sm:text-[10px] font-medium text-gray-500 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Product / Feature Placeholder Cards */}
                    <div className="relative z-10 w-full max-w-[320px] mb-5">
                      <div className="grid grid-cols-3 gap-2">
                        {emojis.map((emoji, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-amber/10 transition-colors duration-300"
                          >
                            <span className="text-2xl opacity-35 group-hover:opacity-55 transition-opacity">
                              {emoji}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* In-page CTA */}
                    <div className="relative z-10 w-full max-w-[280px] mb-4">
                      <span className="block w-full py-2 rounded-xl bg-amber/10 border border-amber/15 text-amber text-[10px] sm:text-xs font-bold text-center group-hover:bg-amber/15 transition-colors">
                        {ctaLabel}
                      </span>
                    </div>

                    {/* Trust Badges */}
                    <div className="relative z-10 flex items-center justify-center gap-3 flex-wrap w-full max-w-[320px]">
                      {brand.trustBadges.slice(0, 4).map((badge) => (
                        <span
                          key={badge}
                          className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-500 font-medium"
                        >
                          <HiShieldCheck className="text-[10px] sm:text-xs text-amber/30" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Action Section ── */}
                  <div className="border-t border-white/5">
                    {/* Price + View Full Detail (same line) */}
                    <div className="px-5 md:px-6 pt-4 pb-3 flex items-center justify-between">
                      <span className="font-heading font-black text-amber text-lg sm:text-xl tracking-tight">
                        {brand.price}
                      </span>
                      <Link
                        href={`/buy-business/niches/${niche.slug}/${brand.slug}`}
                        className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-bold hover:text-amber transition-colors group/link"
                      >
                        View Full Detail
                        <HiArrowRight className="text-xs sm:text-sm group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="px-5 md:px-6 pb-4 flex items-center gap-3">
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber text-black font-bold text-sm sm:text-base rounded-xl hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)] active:scale-95"
                      >
                        <HiGlobeAlt className="text-lg sm:text-xl" />
                        Visit Site
                      </a>
                      <button
                        onClick={openContactModal}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-amber/30 text-amber font-bold text-sm sm:text-base rounded-xl hover:bg-amber/10 transition-all active:scale-95"
                      >
                        Buy Business
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="py-6 border-t border-white/10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white mb-6 leading-tight">
            Ready to Acquire a {niche.title} Business?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Our acquisition specialists will guide you through due diligence, valuation, and a
            smooth transition.
          </p>
          <button
            onClick={openContactModal}
            className="group inline-flex w-full sm:w-auto px-8 sm:px-12 py-4 bg-amber hover:bg-amber-light text-black text-lg font-bold rounded-full shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] items-center justify-center gap-2"
          >
            Start the Acquisition Process
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-500 text-xs mt-4 font-medium">
            Limited availability — new listings added weekly
          </p>
        </div>

        {/* Explore Other Niches */}
        <div className="border-t border-white/10 pt-12">
          <h3 className="text-white font-heading font-bold text-2xl mb-6 text-center">
            Explore Other <span className="text-amber">Niches</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {niches
              .filter((n) => n.slug !== nicheSlug)
              .map((n) => (
                <Link
                  key={n.slug}
                  href={`/buy-business/niches/${n.slug}`}
                  className="bg-card-dark rounded-xl p-4 border border-white/5 hover:border-amber/20 transition-all text-center group/card"
                >
                  <span className="text-2xl block mb-2">{n.icon}</span>
                  <span className="text-white text-xs font-bold group-hover/card:text-amber transition-colors">
                    {n.title}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Sticky Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/buy-business");
          }
        }}
        className="fixed top-16 lg:top-20 left-1 z-50 p-2 rounded-full bg-white/5 backdrop-blur-sm transition-colors"
        aria-label="Go back"
      >
        <HiArrowLeft className="text-white hover:text-amber text-xl transition-colors" />
      </motion.button>
    </main>
  );
}
