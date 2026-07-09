"use client";

import { motion } from "framer-motion";
import { HiArrowLeft, HiShieldCheck, HiCog6Tooth, HiGlobeAlt, HiDevicePhoneMobile } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function CookiePolicyPage() {
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
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight md:leading-none tracking-tight mb-4">
              Cookie{" "}
              <span className="text-amber">Policy</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
              Learn how Stratifit uses cookies and similar technologies to enhance your browsing experience and how you can control your preferences.
            </p>
            <p className="text-gray-500 text-xs mt-4 ml-4 sm:ml-6">
              Last updated: July 9, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          {/* 1. What Are Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiGlobeAlt className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                1. What Are Cookies?
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, enhance user experience, and provide information to website owners. Cookies may be &ldquo;session cookies&rdquo; (deleted when you close your browser) or &ldquo;persistent cookies&rdquo; (remain on your device for a set period).
            </p>
          </motion.div>

          {/* 2. How We Use Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiCog6Tooth className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                2. How We Use Cookies
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              Stratifit uses cookies for the following purposes:
            </p>
            <div className="space-y-6">
              <div className="border border-white/5 rounded-xl p-5">
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  Always active
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable core functionality such as page navigation, security, and access to secure areas. The website cannot function properly without these cookies.
                </p>
              </div>
              <div className="border border-white/5 rounded-xl p-5">
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  Optional
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve our website structure, content, and user experience.
                </p>
              </div>
              <div className="border border-white/5 rounded-xl p-5">
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Performance & Functionality Cookies
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  Optional
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These cookies allow the website to remember the choices you make (such as your language preference or region) and provide enhanced, more personalized features. They may also be used to provide services you have requested, such as viewing a video.
                </p>
              </div>
              <div className="border border-white/5 rounded-xl p-5">
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  Optional
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. Third-Party Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiGlobeAlt className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                3. Third-Party Cookies
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              In some cases, we use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter on this site:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-1">
                  Google Analytics
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We use Google Analytics to understand how users interact with our website. These cookies track things like how long you spend on the site and which pages you visit. For more information, visit Google&apos;s privacy page.
                </p>
              </div>
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-1">
                  Social Media Platforms
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We may embed content from social media platforms like LinkedIn, Instagram, and Twitter. These platforms may set their own cookies through our website. We recommend reviewing their respective privacy policies.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. Managing Your Cookie Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiDevicePhoneMobile className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                4. Managing Your Cookie Preferences
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
              You have several options for managing cookies:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-1">
                  Browser Settings
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Most web browsers allow you to control cookies through their settings preferences. You can configure your browser to refuse all cookies, delete existing cookies, or alert you when a website attempts to place a cookie on your device. Note that disabling cookies may affect website functionality.
                </p>
              </div>
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-1">
                  Our Cookie Preferences
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  When you first visit our website, you will be presented with a cookie consent banner that allows you to accept or decline non-essential cookies. You can change your preferences at any time by clearing your browser cookies and revisiting our website, which will re-display the cookie consent banner.
                </p>
              </div>
              <div>
                <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-1">
                  Opt-Out Tools
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You can opt out of certain third-party cookies using industry tools such as the{" "}
                  <a
                    href="https://optout.networkadvertising.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:text-amber-light underline transition-colors"
                  >
                    Network Advertising Initiative opt-out page
                  </a>{" "}
                  or the{" "}
                  <a
                    href="https://optout.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:text-amber-light underline transition-colors"
                  >
                    Digital Advertising Alliance opt-out portal
                  </a>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 5. Changes & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card-dark rounded-2xl border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiShieldCheck className="text-amber text-2xl" />
              <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                5. Changes to This Cookie Policy
              </h2>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies and related technologies.
            </p>
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-amber font-heading font-bold text-sm uppercase tracking-wider mb-2">
                Contact Us
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                If you have any questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@stratifit.com" className="text-amber hover:text-amber-light underline transition-colors">
                  privacy@stratifit.com
                </a>.
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
