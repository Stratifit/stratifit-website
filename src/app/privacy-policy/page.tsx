"use client";

import { motion } from "framer-motion";
import { HiArrowLeft, HiShieldCheck, HiLockClosed, HiEye, HiDocumentText } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useCms } from "@/lib/use-cms";
import { useLanguage } from "@/lib/LanguageContext";
import { t, type LegalPage } from "@/lib/cms-types";

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { data: legalPages } = useCms<LegalPage[]>("legal_pages", { fallback: [] });
  const cmsLegal = legalPages?.find((p) => p.slug === "privacy-policy");
  const title = cmsLegal ? t(cmsLegal.title, lang) : "Privacy Policy";
  const heroContent = cmsLegal ? t(cmsLegal.content, lang) : null;

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
              {title}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Your privacy matters to us. This policy explains how Stratifit collects, uses, and
              protects your personal information.
            </p>
            <p className="text-gray-500 text-xs mt-4 ml-4 sm:ml-6">Last updated: July 9, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          {heroContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: heroContent }}
            />
          ) : (
            <>
              {/* 1. Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiDocumentText className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                1. Introduction
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Stratifit (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website{" "}
              <span className="text-amber">stratifit.com</span> or use any of our digital services.
              Please read this policy carefully. By accessing or using our services, you acknowledge
              that you have read, understood, and agree to the terms of this Privacy Policy.
            </p>
          </motion.div>

          {/* 2. Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiEye className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                2. Information We Collect
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  When you contact us through our website forms, we may collect your name, email
                  address, phone number, company name, and any other information you voluntarily
                  provide in your message.
                </p>
              </div>
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Automatically Collected Information
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  When you visit our website, we automatically collect certain information including
                  your IP address, browser type, operating system, referring URLs, device
                  information, and browsing behavior. This is collected through cookies and similar
                  tracking technologies.
                </p>
              </div>
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Analytics Data
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  We use analytics tools to understand how visitors interact with our website. This
                  includes page views, time spent on pages, click patterns, and navigation paths.
                  This data is anonymized and aggregated.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. How We Use Your Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShieldCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                3. How We Use Your Information
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="space-y-3">
              {[
                "To respond to your inquiries and provide services you request",
                "To improve our website, services, and user experience",
                "To send relevant marketing communications (with your consent)",
                "To analyze website traffic and usage patterns",
                "To protect against fraudulent or unauthorized activity",
                "To comply with legal obligations and enforce our terms",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-amber mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 4. Data Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiLockClosed className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                4. Data Protection & Security
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              We implement appropriate technical and organizational security measures to protect
              your personal information against unauthorized access, alteration, disclosure, or
              destruction. These measures include encryption, firewalls, secure server
              infrastructure, and regular security assessments. However, no method of transmission
              over the Internet or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </motion.div>

          {/* 5. Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShieldCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                5. Cookies & Tracking Technologies
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Our website uses cookies and similar tracking technologies to enhance your browsing
              experience, analyze site traffic, and deliver personalized content. For detailed
              information about the cookies we use and how you can manage your preferences, please
              see our{" "}
              <a
                href="/cookie-policy"
                className="text-amber hover:text-amber-light underline transition-colors"
              >
                Cookie Policy
              </a>
              .
            </p>
          </motion.div>

          {/* 6. Third-Party Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShieldCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                6. Third-Party Sharing
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may
              share information with trusted service providers who assist us in operating our
              website and conducting our business, provided they agree to keep this information
              confidential. We may also disclose information when required by law or to protect our
              rights.
            </p>
          </motion.div>

          {/* 7. Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShieldCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                7. Your Rights
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal
              data:
            </p>
            <ul className="space-y-3">
              {[
                "The right to access your personal data",
                "The right to rectify inaccurate or incomplete data",
                "The right to request deletion of your data",
                "The right to restrict or object to processing",
                "The right to data portability",
                "The right to withdraw consent at any time",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-amber mt-1.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:privacy@stratifit.com"
                className="text-amber hover:text-amber-light underline transition-colors"
              >
                privacy@stratifit.com
              </a>
              .
            </p>
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
                8. Changes to This Policy
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date. We encourage you to review this policy
              periodically. Continued use of our services after changes constitutes acceptance of
              the updated policy.
            </p>
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                Contact Us
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a
                  href="mailto:privacy@stratifit.com"
                  className="text-amber hover:text-amber-light underline transition-colors"
                >
                  privacy@stratifit.com
                </a>
                .
              </p>
            </div>
          </motion.div>
            </>
          )}
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
