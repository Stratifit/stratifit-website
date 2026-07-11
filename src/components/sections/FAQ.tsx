"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChevronDown,
  HiArrowRight,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";
import { FaqAIChat } from "@/components/chat/FaqAIChat";
import { staticFaq as faqs } from "@/data/static-faq";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqOpen, setFaqOpen] = useState(false);

  /* Body scroll lock + Escape-to-close while the FAQ AI modal is open */
  useEffect(() => {
    if (!faqOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFaqOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [faqOpen]);

  return (
    <section id="faq" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber/2 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4 text-center">
            Support
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3 text-center">
            Frequently Asked <span className="text-amber">Questions</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto text-center mt-3">
            Clear answers to the most common questions we hear from clients.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`bg-card-dark rounded-2xl border transition-all duration-300 h-full ${
                openIndex === i
                  ? "border-amber/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
              >
                <span
                  className={`font-heading font-bold text-sm sm:text-base text-left transition-colors duration-300 ${
                    openIndex === i ? "text-amber" : "text-white group-hover:text-amber/80"
                  }`}
                >
                  {faq.question}
                </span>

                <HiChevronDown
                  className={`text-xl shrink-0 transition-all duration-300 ${
                    openIndex === i
                      ? "text-amber rotate-180"
                      : "text-gray-500 group-hover:text-amber/70"
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Still have more questions? — vertical banner: line 1 = icon + title +
          1-line subtitle, line 2 = full-width CTA button that opens the FAQ AI modal. */}
      <div className="max-w-6xl mx-auto px-6 mt-16 md:mt-20 relative z-10">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-card-dark border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 hover:border-amber/30 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] transition-all group"
        >
          <button
            type="button"
            className="flex items-start gap-3 w-full text-left"
            onClick={() => setFaqOpen(true)}
            aria-label="Open FAQ AI chat"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0 group-hover:bg-amber/25 transition-colors">
              <HiChatBubbleLeftRight className="text-amber text-base sm:text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg md:text-xl font-heading font-black tracking-tight text-white">
                Still have more <span className="text-amber">questions?</span>
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                Chat with our FAQ AI bot — instant answers, 24/7.
              </p>
            </div>
          </button>
          <button
            onClick={() => setFaqOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-amber text-black font-bold rounded-full hover:bg-amber-light transition-all text-xs sm:text-sm active:scale-95 shadow-[0_0_18px_rgba(245,158,11,0.25)] group-hover:gap-3"
          >
            Contact our team
            <HiArrowRight className="text-xs sm:text-sm group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* FAQ AI modal — opens on banner tap, fills viewport on mobile */}
      <AnimatePresence>
        {faqOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
              onClick={() => setFaqOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 z-[91] flex items-center justify-center p-0 sm:p-4 pointer-events-none"
              role="dialog"
              aria-modal="true"
              aria-label="FAQ AI chat"
            >
              <div className="pointer-events-auto relative bg-card-dark rounded-none sm:rounded-2xl border border-white/10 w-full sm:max-w-3xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
                <FaqAIChat onClose={() => setFaqOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
