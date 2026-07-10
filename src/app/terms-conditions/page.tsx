"use client";

import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiScale,
  HiDocumentCheck,
  HiCreditCard,
  HiExclamationTriangle,
  HiShieldCheck,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function TermsConditionsPage() {
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
            <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">Legal</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">
              Terms & <span className="text-amber">Conditions</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              The terms governing your use of Stratifit&apos;s website and digital services. Please
              read these carefully before engaging with our platform.
            </p>
            <p className="text-gray-500 text-xs mt-4 ml-4 sm:ml-6">Last updated: July 9, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          {/* 1. Acceptance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiDocumentCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              By accessing or using the Stratifit website (
              <span className="text-amber">stratifit.com</span>) and any associated services, you
              agree to be bound by these Terms & Conditions. If you do not agree with any part of
              these terms, you must discontinue use of our website and services immediately. These
              terms apply to all visitors, users, clients, and others who access or use our
              services.
            </p>
          </motion.div>

          {/* 2. Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiScale className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                2. Description of Services
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              Stratifit provides premium digital agency services including but not limited to:
            </p>
            <ul className="space-y-3">
              {[
                "Brand strategy, identity, and design services",
                "Website development and digital platform engineering",
                "AI automation and workflow optimization",
                "Growth marketing and performance advertising",
                "Visual identity and brand guidelines creation",
                "Logo design and creative asset production",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-amber mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
              Specific deliverables, timelines, and pricing for any project will be outlined in a
              separate service agreement or statement of work signed by both parties.
            </p>
          </motion.div>

          {/* 3. Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShieldCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                3. Intellectual Property
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Our Content
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  All content on this website — including text, graphics, logos, icons, images,
                  audio clips, digital downloads, data compilations, and software — is the property
                  of Stratifit and is protected by international copyright laws.
                </p>
              </div>
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Client Deliverables
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Upon full payment for services, Stratifit transfers ownership of final
                  deliverables to the client as specified in the service agreement. Stratifit
                  retains the right to display completed work in our portfolio, case studies, and
                  marketing materials unless otherwise agreed in writing.
                </p>
              </div>
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Third-Party Materials
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Fonts, stock photography, licensed software, and other third-party assets used in
                  deliverables remain subject to their respective licenses. Clients are responsible
                  for acquiring proper licenses for any third-party materials they wish to use
                  beyond the scope of our services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. Payment Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiCreditCard className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                4. Payment Terms
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                "All fees are quoted in the currency specified in the service agreement",
                "Payment schedules, milestones, and methods are defined per project",
                "Late payments may incur interest charges at the rate specified in the agreement",
                "We reserve the right to suspend work or services if payments are overdue",
                "All quoted prices exclude applicable taxes unless stated otherwise",
                "Project deposits are non-refundable unless otherwise specified",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-amber mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 5. Limitation of Liability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiExclamationTriangle className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                5. Limitation of Liability
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              To the fullest extent permitted by applicable law, Stratifit shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, including but
              not limited to loss of profits, data, use, goodwill, or other intangible losses
              resulting from:
            </p>
            <ul className="space-y-3">
              {[
                "Your use or inability to use our website or services",
                "Unauthorized access to or alteration of your data",
                "Statements or conduct of any third party on our services",
                "Any other matter relating to our website or services",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-amber mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 6. Client Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiScale className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                6. Client Responsibilities
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                "Provide accurate, complete, and timely information required for project execution",
                "Review and approve deliverables within agreed-upon timeframes",
                "Ensure content provided does not infringe on third-party intellectual property rights",
                "Maintain the confidentiality of any shared credentials and account information",
                "Comply with all applicable laws and regulations in connection with the use of deliverables",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-amber mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 7. Termination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiScale className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                7. Termination
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              Either party may terminate a services agreement in accordance with the termination
              provisions outlined in the specific project agreement. Upon termination:
            </p>
            <ul className="space-y-3">
              {[
                "Client shall pay for all work completed up to the date of termination",
                "Stratifit shall deliver all completed work for which payment has been received",
                "Any licenses or access granted to the client through third-party services may be revoked",
                "Confidentiality and intellectual property provisions shall survive termination",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-amber mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 8. Changes & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShieldCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                8. Changes to These Terms
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              We reserve the right to modify or replace these Terms & Conditions at any time.
              Changes will be effective immediately upon posting to this page. It is your
              responsibility to review these terms periodically. Continued use of our website and
              services after any changes constitutes acceptance of the new terms.
            </p>
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                Contact Us
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at{" "}
                <a
                  href="mailto:legal@stratifit.com"
                  className="text-amber hover:text-amber-light underline transition-colors"
                >
                  legal@stratifit.com
                </a>
                .
              </p>
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
