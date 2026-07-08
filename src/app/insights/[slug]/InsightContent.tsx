"use client";

import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import type { Insight } from "@/data/insights";

export function InsightContent({ insight }: { insight: Insight }) {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-black">
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={insight.image} alt={insight.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-amber/90 text-black text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider mb-3">{insight.category}</span>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-tight md:leading-none tracking-tight mb-8">{insight.title}</h1>
            <div className="prose prose-invert prose-lg max-w-none">
              {insight.content.map((paragraph, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
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
