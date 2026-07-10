"use client";

import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiSparkles,
  HiClock,
  HiCurrencyDollar,
  HiChatBubbleLeftRight,
  HiLightBulb,
  HiShieldCheck,
} from "react-icons/hi2";
import { openContactModal } from "@/components/contact/ContactModal";
import ContactChatbot from "@/components/chat/ContactChatbot";

const scrollLabels = [
  {
    icon: HiCurrencyDollar,
    label: "Transparent Pricing",
    desc: "No hidden fees. Budget ranges from $300 to $20K.",
  },
  { icon: HiClock, label: "Fast Turnaround", desc: "Most projects kick off within 48 hours." },
  {
    icon: HiLightBulb,
    label: "Free Consultation",
    desc: "30-min strategy call to scope your project.",
  },
  { icon: HiShieldCheck, label: "Secure Process", desc: "Your data stays private. No spam, ever." },
  {
    icon: HiChatBubbleLeftRight,
    label: "AI-Powered Answers",
    desc: "Chat with our AI bot 24/7 for quick responses.",
  },
  {
    icon: HiSparkles,
    label: "Custom Solutions",
    desc: "Tailored to your business, not a template.",
  },
];

export default function ContactPage() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[10px] font-bold text-amber uppercase tracking-[0.3em] mb-4">
            Get in Touch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[0.95] tracking-tight mb-4">
            Let&apos;s <span className="text-amber">Talk</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Have a project in mind? Tell us about it and we&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Scroll Labels */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 snap-x">
            {scrollLabels.map((item, i) => (
              <motion.div
                key={item.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="snap-start shrink-0 w-[200px] sm:w-[220px] bg-card-dark rounded-xl p-4 border border-white/5 flex flex-col items-center text-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center border border-amber/20">
                  <item.icon className="text-amber text-lg" />
                </div>
                <span className="text-white text-xs font-bold">{item.label}</span>
                <span className="text-gray-500 text-[10px] leading-tight">{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Card */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-card-dark rounded-2xl border border-white/10 max-w-lg mx-auto text-center"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HiSparkles className="text-amber text-sm" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-amber uppercase">
                Start Your Project
              </p>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white mb-3">
              Ready to get <span className="text-amber">started</span>?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Tell us about your project and we&apos;ll match you with the right team.
            </p>
            <button
              onClick={openContactModal}
              className="group inline-flex px-8 py-3.5 bg-amber text-black font-bold rounded-xl items-center justify-center gap-2 hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 text-sm"
            >
              Contact Our Team
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-gray-500 mt-5">🔒 No spam. Your data stays private.</p>
          </div>
        </motion.div>

        {/* AI Chatbot */}
        <ContactChatbot />
      </div>
    </section>
  );
}
