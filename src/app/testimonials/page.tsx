"use client";

import { motion } from "framer-motion";
import { HiStar, HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsPage() {
  const router = useRouter();

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
              Testimonials
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">
              What Our Clients <span className="text-amber">Say</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Don&apos;t take our word for it — hear from the brands we&apos;ve helped scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-card-dark p-6 md:p-8 rounded-2xl border border-white/5 hover:border-amber/20 transition-all"
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
