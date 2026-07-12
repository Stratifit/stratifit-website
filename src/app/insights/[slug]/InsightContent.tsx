"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowLeft, HiSparkles } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { type InsightItem } from "@/lib/cms-types";
import { type Insight, insights as fallbackInsights } from "@/data/insights";
import { adaptInsight } from "@/lib/cms-adapters";
import { type LangCode } from "@/lib/buy-business-ui";

export function InsightContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const langCode = (lang as LangCode) ?? "en";

  /* Live CMS data. `useCms` already subscribes to Supabase Realtime
     postgres_changes on the `insights` table, so an admin publish
     lands on this page without a refresh. */
  const { data: cmsInsights, loading: cmsLoading } = useCms<InsightItem[]>(
    "insights",
    { fallback: [] },
  );

  /* ── Resolution priority ────────────────────────────────────────
     1. CMS row with matching slug AND is_published (the live path)
     2. Static row with matching slug (graceful fallback for local
        dev or before admin seeds Supabase)
     3. Inline 404 UI  */
  const cmsRow = (cmsInsights ?? []).find(
    (i) => i.slug === slug && i.is_published,
  );
  const staticRow = cmsRow
    ? null
    : fallbackInsights.find((i) => i.slug === slug);

  /* Once we have a definitive answer (CMS or static miss) and we're
     no longer loading, navigate CMS-only misses to /not-found. We
     deliberately wait for the CMS fetch to settle so we don't 404
     a freshly-seeded insight during the initial network roundtrip. */
  useEffect(() => {
    if (cmsLoading) return;
    if (cmsRow || staticRow) return;
    router.replace("/not-found");
  }, [cmsLoading, cmsRow, staticRow, router]);

  if (!cmsRow && !staticRow) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <HiSparkles className="text-amber text-4xl mx-auto mb-4" />
          <h1 className="text-3xl font-heading font-black text-white mb-3">
            Insight not found
          </h1>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            We couldn&apos;t find an insight at <code className="text-amber">/insights/{slug}</code>.
          </p>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all text-sm"
          >
            <HiArrowLeft /> Back to all insights
          </Link>
        </div>
      </main>
    );
  }

  /* The detail-page JSX was originally written against the static
     `Insight` shape. `adaptInsight` normalizes a CMS row into the
     same shape so the JSX below is source-agnostic. */
  const insight: Insight = cmsRow
    ? adaptInsight(cmsRow, langCode)
    : (staticRow as Insight);

  return (
    <main className="min-h-screen bg-black">
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={insight.image} alt={insight.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-amber/90 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider mb-3">
              {insight.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
              <span>{insight.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span>{insight.readTime}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-4 -mt-3 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-tight md:leading-none tracking-tight mb-8">
              {insight.title}
            </h1>
            <div className="prose prose-invert prose-lg max-w-none">
              {insight.content.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
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
            router.push("/insights");
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
