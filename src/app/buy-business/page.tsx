"use client";

import { motion } from "framer-motion";
import { HiArrowRight, HiArrowLeft, HiGlobeAlt } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { nicheList as fallbackNicheList } from "@/data/buy-business";
import { openContactModal } from "@/components/contact/ContactModal";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import {
  type BuyBusinessBrand,
  type BuyBusinessNiche,
  type Language,
} from "@/lib/cms-types";
import { resolveLocalized } from "@/lib/buy-business-ui";

/* Display shape consumed by the JSX — derived from either CMS rows or
   the static fallback. */
type DisplayNiche = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  brandCount: number;
  avgRevenue: string;
  avgMargin: string;
};

export default function BuyBusinessPage() {
  const router = useRouter();
  const { lang } = useLanguage();

  const { data: cmsNiches } = useCms<BuyBusinessNiche[]>("buy-business-niches", {
    fallback: [],
  });
  const { data: cmsBrands } = useCms<BuyBusinessBrand[]>("buy-business-brands", {
    fallback: [],
  });

  const hasCms = (cmsNiches ?? []).length > 0 && (cmsBrands ?? []).length > 0;

  /* ── Build the per-niche summary from whichever data source is live. ── */
  const displayNiches: DisplayNiche[] = hasCms
    ? (cmsNiches ?? []).map((n) => {
        const brandsInNiche = (cmsBrands ?? []).filter(
          (b) => b.is_active && b.niche_id === n.id,
        );
        return {
          slug: n.slug,
          title: resolveLocalized(n.title, lang) || n.slug,
          description: resolveLocalized(n.description, lang) || "",
          icon: n.icon,
          image: n.image,
          brandCount: brandsInNiche.length,
          // "Avg revenue" / "avg margin" — pick the first 2 brand revenue
          // strings we have. Cheap heuristic; admins can populate these as
          // dedicated per-niche summary fields later (niche_stats covers the
          // detail page already).
          avgRevenue: brandsInNiche[0]?.revenue || "—",
          avgMargin: brandsInNiche[0]?.profit || "—",
        };
      })
    : (fallbackNicheList as DisplayNiche[]);

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-glow rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
              Acquisition
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">
              Buy a <span className="text-amber">Business</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Skip the startup grind. Browse our curated marketplace of profitable, turnkey
              businesses across seven high-demand niches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Niches Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">
              Explore by <span className="text-amber">Niche</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Select a niche to see available businesses for acquisition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNiches.map((niche, i) => (
              <motion.div
                key={niche.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                className="group bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all flex flex-col"
              >
                {/* Browser Chrome */}
                <div className="bg-[#1a1a1a] px-3 py-2 flex items-center gap-1.5 border-b border-white/5">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <span className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-2 bg-[#0d0d0d] rounded px-2 py-1 flex items-center gap-1 border border-white/5">
                    <HiGlobeAlt className="text-gray-600 text-[8px] shrink-0" />
                    <span className="text-[8px] text-gray-600 truncate">
                      stratifit.com/buy/{niche.slug}
                    </span>
                  </div>
                </div>

                {/* Website Preview */}
                <div
                  className="relative overflow-hidden flex-1 flex flex-col py-10 md:py-14 px-6 items-center text-center"
                  style={{
                    background: "linear-gradient(135deg, #111 0%, #1a1a1a 50%, #0d0d0d 100%)",
                  }}
                >
                  {/* Icon/Logo */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber/20 to-amber/5 border border-amber/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all duration-500">
                    <span className="text-3xl">{niche.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-black text-2xl md:text-3xl text-white mb-2 tracking-tight">
                    {niche.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-5 flex-1">
                    {niche.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber/50" />
                      {niche.brandCount} businesses
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber/50" />
                      {niche.avgRevenue} avg.
                    </span>
                  </div>

                  {/* Preview CTA */}
                  <span className="px-5 py-2 bg-amber/10 border border-amber/20 text-amber text-xs font-bold rounded-lg group-hover:bg-amber/20 transition-all">
                    View Listings →
                  </span>

                  {/* Background glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber/5 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Bottom Link */}
                <div className="p-4 border-t border-white/5">
                  <Link
                    href={`/buy-business/niches/${niche.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-amber/10 border border-amber/20 text-amber text-xs font-bold rounded-lg hover:bg-amber/20 transition-all group/link"
                  >
                    View {niche.title} Businesses
                    <HiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16 text-center py-12 bg-card-dark rounded-2xl border border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
              Ready to Own a Business?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Our team will guide you through every step of the acquisition process — from due
              diligence to transition.
            </p>
            <button
              onClick={openContactModal}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 text-sm"
            >
              Schedule a Consultation
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sticky Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
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
