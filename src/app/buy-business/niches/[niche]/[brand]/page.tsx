"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { HiArrowRight, HiArrowLeft, HiCheck, HiSparkles, HiGlobeAlt, HiShieldCheck, HiLightBulb, HiCog, HiTruck } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNicheBySlug, getBrandBySlug, niches } from "@/data/buy-business";
import { slugify } from "@/lib/slugify";

export default function BrandDetailPage({ params }: { params: Promise<{ niche: string; brand: string }> }) {
  const { niche: nicheSlug, brand: brandSlug } = use(params);
  const niche = getNicheBySlug(nicheSlug);
  const brand = getBrandBySlug(brandSlug);
  const router = useRouter();

  if (!niche || !brand) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-6">🔍</p>
          <h1 className="text-3xl font-heading font-black text-white mb-4">Business Not Found</h1>
          <p className="text-gray-400 mb-8">The business you are looking for does not exist.</p>
          <Link href="/buy-business" className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all">
            <HiArrowLeft /> Back to Businesses
          </Link>
        </div>
      </main>
    );
  }

  const accent = brand.accentColor || "#F59E0B";

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center pt-24 pb-8 md:pt-32">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${brand.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: accent + "20", borderColor: accent + "40", border: "1px solid" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: accent }}>Business Acquisition</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${accent}30, ${accent}10)`, borderColor: accent + "40", border: "1px solid" }}>
                {brand.logo}
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[0.95]">
                  {brand.name}
                </h1>
                <p className="text-gray-400 text-sm mt-1">{brand.niche} Business</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
              {brand.description}
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="font-heading font-black text-2xl sm:text-3xl" style={{ color: accent }}>{brand.price}</span>
              <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors" style={{ background: accent + "20", color: accent }}>
                <HiGlobeAlt />
                Visit Live Site
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24 pb-24 md:pb-32">
        {/* Trust Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {brand.trustBadges.slice(0, 4).map((badge) => (
            <div key={badge} className="bg-card-dark rounded-xl p-4 border border-white/5 flex flex-col items-center text-center gap-1.5">
              <HiShieldCheck className="text-xl" style={{ color: accent }} />
              <span className="text-white text-xs font-bold">{badge}</span>
            </div>
          ))}
        </motion.div>

        {/* How It's Built */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Infrastructure</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-tight tracking-tight mb-3">How It&apos;s <span className="text-amber">Built</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">The technical foundation and operational setup behind {brand.name}.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: HiCog, title: "Tech Stack", desc: `Built on modern, scalable infrastructure with documented architecture and deployment pipelines. Ready for handoff with full source code access.` },
              { icon: HiLightBulb, title: "Business Model", desc: `Proven revenue model with ${brand.highlights[0] || "established metrics"}. All customer relationships and contracts transfer with the sale.` },
              { icon: HiTruck, title: "Operations", desc: `Standard operating procedures documented. Team structure and vendor relationships in place for seamless transition to new ownership.` },
            ].map((item) => (
              <div key={item.title} className="bg-card-dark rounded-xl p-5 border border-white/5 hover:border-amber/20 transition-all flex flex-col items-center text-center gap-3">
                <item.icon className="text-2xl text-amber" />
                <h3 className="text-white font-heading font-bold text-lg">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Package</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-tight tracking-tight mb-3">What&apos;s <span className="text-amber">Included</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">Everything that transfers with the acquisition of {brand.name}.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {niche.whatIsIncluded.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.3 }} className="flex items-start gap-3 bg-card-dark rounded-xl p-4 border border-white/5 hover:border-amber/20 transition-all">
                <HiCheck className="text-amber shrink-0 mt-0.5" />
                <span className="text-white text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Performance</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-tight tracking-tight mb-3">Key <span className="text-amber">Highlights</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {brand.highlights.map((h, i) => (
              <div key={h} className="bg-card-dark rounded-xl p-5 border border-white/5 hover:border-amber/20 transition-all flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center text-amber text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <span className="text-white text-sm font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Process */}
        <div className="bg-card-dark rounded-2xl p-6 sm:p-8 shadow-lg border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <HiSparkles className="text-amber text-xl" />
            <h3 className="text-amber font-bold text-xl uppercase tracking-wider">Transfer Process</h3>
          </div>
          <p className="text-white text-sm sm:text-base font-medium leading-relaxed mb-6 relative z-10">
            We handle the entire acquisition process from due diligence to final handover. Here&apos;s how it works:
          </p>
          <div className="space-y-3 relative z-10">
            {[
              { step: "1", title: "Due Diligence", desc: "Full access to financial records, codebase audits, and operational metrics." },
              { step: "2", title: "Escrow & Payment", desc: "Funds held securely in escrow until all transfer conditions are met." },
              { step: "3", title: "Asset Transfer", desc: "All accounts, domains, code, and intellectual property transferred to you." },
              { step: "4", title: "Transition Support", desc: "Ongoing support to ensure smooth operations under new ownership." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 bg-[#1E1E1E] rounded-xl p-4 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-amber text-black font-bold text-sm flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <h4 className="text-white font-heading font-bold text-sm">{s.title}</h4>
                  <p className="text-gray-400 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="py-6 border-t border-white/10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white mb-6 leading-tight">Ready to Acquire {brand.name}?</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-heading font-black text-amber text-2xl">{brand.price}</span>
            <span className="text-gray-400 text-sm">asking price</span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8">Our acquisition specialists will guide you through due diligence, valuation, and a smooth transition.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact" className="group inline-flex sm:w-auto px-8 py-4 bg-amber hover:bg-amber-light text-black text-base font-bold rounded-full shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] items-center justify-center gap-2">
              Start Acquisition
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex sm:w-auto px-8 py-4 border border-white/10 text-white text-base font-bold rounded-full hover:border-amber/30 transition-all items-center justify-center gap-2">
              <HiGlobeAlt />
              Visit Site
            </a>
          </div>
        </div>

        {/* Explore Other Businesses */}
        <div className="border-t border-white/10 pt-12">
          <h3 className="text-white font-heading font-bold text-2xl mb-6 text-center">More <span className="text-amber">{niche.title}</span> Businesses</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {niche.brands.filter(b => b.slug !== brand.slug).slice(0, 4).map((b) => (
              <Link key={b.slug} href={`/buy-business/niches/${nicheSlug}/${b.slug}`} className="bg-card-dark rounded-xl p-4 border border-white/5 hover:border-amber/20 transition-all text-center group/card">
                <span className="text-2xl block mb-2">{b.logo}</span>
                <span className="text-white text-xs font-bold group-hover/card:text-amber transition-colors">{b.name}</span>
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
        onClick={() => { if (window.history.length > 1) { router.back(); } else { router.push(`/buy-business/niches/${nicheSlug}`); } }}
        className="fixed top-16 lg:top-20 left-1 z-50 p-2 rounded-full bg-white/5 backdrop-blur-sm transition-colors"
        aria-label="Go back"
      >
        <HiArrowLeft className="text-white hover:text-amber text-xl transition-colors" />
      </motion.button>
    </main>
  );
}
