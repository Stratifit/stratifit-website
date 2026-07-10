"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { openContactModal } from "@/components/contact/ContactModal";

const CoreServices = dynamic(
  () =>
    import("@/components/sections/CoreServices").then((m) => ({
      default: m.CoreServices,
    })),
  { ssr: true },
);
const Process = dynamic(
  () =>
    import("@/components/sections/Process").then((m) => ({
      default: m.Process,
    })),
  { ssr: true },
);

export default function ServicesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black">
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-glow rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Services</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">
              Our <span className="text-amber">Services</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Strategic solutions engineered to scale your digital presence with precision and
              luxury. From strategy to launch, we handle every detail.
            </p>
          </motion.div>
        </div>
      </section>

      <CoreServices />

      <Process />

      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center py-12 bg-card-dark rounded-2xl border border-white/5"
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Let&apos;s discuss your goals and build a tailored plan that fits your business.
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
