"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";

const faqs = [
  {
    question: "What is the typical timeline for a branding project?",
    answer:
      "A standard branding project spans 4–6 weeks from discovery to final delivery. Timelines are tailored to scope — brand strategy and identity rollouts may extend to 8 weeks for comprehensive engagements.",
  },
  {
    question: "Do you offer post-launch support?",
    answer:
      "Yes. Every engagement includes 30 days of complimentary post-launch support. For ongoing needs, we offer flexible maintenance retainers with guaranteed response times and priority access to our team.",
  },
  {
    question: "How are payments structured?",
    answer:
      "We operate on a 50% deposit to commence work, with the remaining 50% due upon project completion. For enterprise-scale engagements, we offer milestone-based billing aligned to delivery phases.",
  },
  {
    question: "What technology stack do you use?",
    answer:
      "Our core stack includes Next.js, React, TypeScript, Tailwind CSS, and Node.js. For CMS we recommend Sanity, Contentful, or Strapi. We select the optimal stack per project — never a one-size-fits-all approach.",
  },
  {
    question: "Can you work with our existing systems and tools?",
    answer:
      "Absolutely. We integrate natively with your current infrastructure — HubSpot, Salesforce, Stripe, custom APIs, and legacy systems. Our philosophy is to enhance and extend what's already working, not disrupt it.",
  },
  {
    question: "Do you handle ongoing marketing after launch?",
    answer:
      "Yes. Our Growth Engine service includes performance marketing, analytics tracking, conversion optimization, CRM automation, and funnel management — all managed as a continuous improvement cycle.",
  },
  {
    question: "What's your approach to AI and automation?",
    answer:
      "We build production-grade AI solutions that deliver immediate ROI. From intelligent lead qualification and customer support agents to workflow automation pipelines — every system is measured against real business outcomes.",
  },
  {
    question: "How do you measure success?",
    answer:
      "Every engagement begins with defined KPIs tied directly to your business objectives. We track conversion rates, load performance, engagement metrics, and revenue attribution — shared via live dashboards with full transparency.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber/2 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4 text-center">Support</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3 text-center">
            Frequently Asked{" "}
            <span className="text-amber">Questions</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto text-center mt-3">
            Clear answers to the most common questions we hear from clients.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`bg-card-dark rounded-2xl border transition-all duration-300 ${
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
                    openIndex === i
                      ? "text-amber"
                      : "text-white group-hover:text-amber/80"
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
                    <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-black font-bold rounded-xl hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 text-sm"
          >
            Contact Our Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
