"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiSparkles,
  HiChartBar,
  HiUserGroup,
  HiGlobeAlt,
  HiRocketLaunch,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, type AboutPageContent } from "@/lib/cms-types";

export default function AboutPage() {
  const router = useRouter();
  const { lang } = useLanguage();

  const { data: aboutData } = useCms<AboutPageContent>("about_page_content");

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
            {[
              { icon: HiRocketLaunch, stat: "120+", label: "Projects Delivered" },
              { icon: HiUserGroup, stat: "45+", label: "Team Members" },
              { icon: HiGlobeAlt, stat: "18", label: "Countries Served" },
              { icon: HiChartBar, stat: "98%", label: "Client Retention" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="bg-card-dark rounded-2xl border border-white/5 p-6 flex flex-col items-center text-center gap-2 hover:border-amber/20 transition-all"
              >
                <s.icon className="text-amber text-2xl" />
                <span className="text-white font-heading font-black text-2xl md:text-3xl">
                  {s.stat}
                </span>
                <span className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
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
              {[
                {
                  icon: HiSparkles,
                  title: "Precision",
                  desc: "Every pixel, every line of code, every strategy — executed with meticulous attention to detail.",
                },
                {
                  icon: HiRocketLaunch,
                  title: "Innovation",
                  desc: "We push boundaries with emerging technologies and creative approaches that set you apart.",
                },
                {
                  icon: HiUserGroup,
                  title: "Partnership",
                  desc: "We integrate as an extension of your team, aligned with your vision and committed to your success.",
                },
                {
                  icon: HiChartBar,
                  title: "Results",
                  desc: "We measure everything. Every engagement is tied to real KPIs and tangible business outcomes.",
                },
              ].map((v, i) => (
                <div
                  key={v.title}
                  className="bg-card-dark rounded-2xl border border-white/5 p-6 hover:border-amber/20 transition-all flex gap-4"
                >
                  <v.icon className="text-amber text-2xl shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg mb-2">{v.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
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
