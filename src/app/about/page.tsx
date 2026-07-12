"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import {
  HiArrowLeft,
  HiSparkles,
  HiChartBar,
  HiUserGroup,
  HiGlobeAlt,
  HiRocketLaunch,
  HiCheckBadge,
  HiLightBulb,
  HiHeart,
  HiArrowTrendingUp,
  HiStar,
  HiBolt,
  HiShieldCheck,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, type AboutPageContent, type AboutStat, type AboutValue } from "@/lib/cms-types";

/* ------------------------------------------------------------------ */
/*  Icon key → Hi component map                                       */
/* ------------------------------------------------------------------ */
/* CMS stores `icon` as TEXT (e.g. "rocket", "users", "trending-up").
   The page renders a real icon component. Unknown keys fall back to
   HiSparkles so the layout never breaks. */
const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  rocket: HiRocketLaunch,
  users: HiUserGroup,
  globe: HiGlobeAlt,
  chart: HiChartBar,
  sparkle: HiSparkles,
  badge: HiCheckBadge,
  bulb: HiLightBulb,
  heart: HiHeart,
  trending: HiArrowTrendingUp,
  star: HiStar,
  bolt: HiBolt,
  shield: HiShieldCheck,
};

function iconFor(key: string | undefined | null) {
  return (key && ICON_MAP[key]) || HiSparkles;
}

/* ------------------------------------------------------------------ */
/*  Hardcoded fallbacks (used when Supabase is unconfigured or empty) */
/* ------------------------------------------------------------------ */
const FALLBACK_STATS: AboutStat[] = [
  { id: "fallback-stat-1", sort_order: 1, icon: "rocket", stat: "120+", label: { en: "Projects Delivered", de: "Projekte geliefert", fr: "Projets livrés", es: "Proyectos entregados" } },
  { id: "fallback-stat-2", sort_order: 2, icon: "users", stat: "45+", label: { en: "Team Members", de: "Teammitglieder", fr: "Membres de l'équipe", es: "Miembros del equipo" } },
  { id: "fallback-stat-3", sort_order: 3, icon: "globe", stat: "18", label: { en: "Countries Served", de: "Bediente Länder", fr: "Pays desservis", es: "Países atendidos" } },
  { id: "fallback-stat-4", sort_order: 4, icon: "chart", stat: "98%", label: { en: "Client Retention", de: "Kundenbindung", fr: "Fidélisation client", es: "Retención de clientes" } },
];

const FALLBACK_VALUES: AboutValue[] = [
  { id: "fallback-value-1", sort_order: 1, icon: "badge", title: { en: "Precision", de: "Präzision", fr: "Précision", es: "Precisión" }, description: { en: "Every pixel, every line of code, every strategy — executed with meticulous attention to detail.", de: "Jedes Pixel, jede Codezeile, jede Strategie — mit akribischer Liebe zum Detail umgesetzt.", fr: "Chaque pixel, chaque ligne de code, chaque stratégie — exécutés avec une attention méticuleuse aux détails.", es: "Cada píxel, cada línea de código, cada estrategia — ejecutado con meticulosa atención al detalle." } },
  { id: "fallback-value-2", sort_order: 2, icon: "rocket", title: { en: "Innovation", de: "Innovation", fr: "Innovation", es: "Innovación" }, description: { en: "We push boundaries with emerging technologies and creative approaches that set you apart.", de: "Wir verschieben Grenzen mit neuen Technologien und kreativen Ansätzen, die Sie auszeichnen.", fr: "Nous repoussons les limites avec des technologies émergentes et des approches créatives qui vous distinguent.", es: "Superamos límites con tecnologías emergentes y enfoques creativos que te diferencian." } },
  { id: "fallback-value-3", sort_order: 3, icon: "users", title: { en: "Partnership", de: "Partnerschaft", fr: "Partenariat", es: "Asociación" }, description: { en: "We integrate as an extension of your team, aligned with your vision and committed to your success.", de: "Wir integrieren uns als Erweiterung Ihres Teams, abgestimmt auf Ihre Vision und engagiert für Ihren Erfolg.", fr: "Nous nous intégrons comme une extension de votre équipe, alignés sur votre vision et engagés pour votre succès.", es: "Nos integramos como una extensión de tu equipo, alineados con tu visión y comprometidos con tu éxito." } },
  { id: "fallback-value-4", sort_order: 4, icon: "chart", title: { en: "Results", de: "Ergebnisse", fr: "Résultats", es: "Resultados" }, description: { en: "We measure everything. Every engagement is tied to real KPIs and tangible business outcomes.", de: "Wir messen alles. Jedes Engagement ist an reale KPIs und greifbare Geschäftsergebnisse gekoppelt.", fr: "Nous mesurons tout. Chaque engagement est lié à des KPI réels et à des résultats commerciaux tangibles.", es: "Medimos todo. Cada compromiso está vinculado a KPI reales y resultados empresariales tangibles." } },
];

export default function AboutPage() {
  const router = useRouter();
  const { lang } = useLanguage();

  const { data: aboutData } = useCms<AboutPageContent>("about_page_content");
  const { data: cmsStats } = useCms<AboutStat[]>("about-stats", { fallback: FALLBACK_STATS });
  const { data: cmsValues } = useCms<AboutValue[]>("about-values", { fallback: FALLBACK_VALUES });

  const stats = (cmsStats ?? FALLBACK_STATS).slice().sort((a, b) => a.sort_order - b.sort_order);
  const values = (cmsValues ?? FALLBACK_VALUES).slice().sort((a, b) => a.sort_order - b.sort_order);

  const heroTitlePrefix = t(aboutData?.hero_title_prefix, lang) || "About ";
  const heroTitleHighlight = t(aboutData?.hero_title_highlight, lang) || "Stratifit";
  const heroSub = t(aboutData?.hero_subtitle, lang) || "We are a premium digital agency that builds brands, scales businesses, and engineers growth through strategy, design, and technology.";
  const missionText = t(aboutData?.mission_text, lang) || "To empower ambitious brands with the strategy, design, and technology they need to dominate their markets.";
  const storyText = t(aboutData?.story_text, lang) || "";
  const teamText = t(aboutData?.team_text, lang) || "";
  const ctaPrefix = t(aboutData?.cta_title_prefix, lang) || "Ready to Work ";
  const ctaHighlight = t(aboutData?.cta_title_highlight, lang) || "Together?";
  const ctaSub = t(aboutData?.cta_subtitle, lang) || "Let's build something exceptional.";
  const ctaBtn = t(aboutData?.cta_button_text, lang) || "Start Your Project";

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
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">About</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">
              {heroTitlePrefix}<span className="text-amber">{heroTitleHighlight}</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              {heroSub}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((s) => {
              const Icon = iconFor(s.icon);
              return (
                <div
                  key={s.id}
                  className="bg-card-dark rounded-2xl border border-white/5 p-6 flex flex-col items-center text-center gap-2 hover:border-amber/20 transition-all"
                >
                  <Icon className="text-amber text-2xl" />
                  <span className="text-white font-heading font-black text-2xl md:text-3xl">
                    {s.stat}
                  </span>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    {t(s.label, lang) || s.label?.en || ""}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Mission + Story */}
      <section className="pb-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
              Our Mission
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
              {missionText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
              Our Story
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
              {storyText || (
                <>Founded with a vision to bridge the gap between premium branding and technical
              execution, Stratifit has grown from a boutique design studio into a full-scale digital
              agency. Today, we partner with startups and enterprises alike — delivering brand
              identities, web platforms, AI automation systems, and growth engines that transform
              how businesses operate and scale.</>
              )}
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-6">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => {
                const Icon = iconFor(v.icon);
                return (
                  <div
                    key={v.id}
                    className="bg-card-dark rounded-2xl border border-white/5 p-6 hover:border-amber/20 transition-all flex gap-4"
                  >
                    <Icon className="text-amber text-2xl shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-bold text-white text-lg mb-2">
                        {t(v.title, lang) || v.title?.en || ""}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {t(v.description, lang) || v.description?.en || ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
              Our Team
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-2 border-amber/30 pl-4 sm:pl-6">
              {teamText || (
                <>We are strategists, designers, engineers, and marketers who share a common obsession:
              building exceptional digital experiences. Our team brings together decades of combined
              expertise from top agencies, startups, and Fortune 500 companies — united by a passion
              for craftsmanship and a commitment to client success.</>
              )}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center py-8 border-t border-white/10"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-4">
              {ctaPrefix}<span className="text-amber">{ctaHighlight}</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">{ctaSub}</p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 text-sm"
            >
              {ctaBtn}
            </Link>
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
