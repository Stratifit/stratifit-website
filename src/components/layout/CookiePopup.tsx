"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiShieldCheck, HiCog6Tooth, HiCheck } from "react-icons/hi2";

type ConsentChoice = "all" | "essential";

const STORAGE_KEY = "stratifit-cookie-consent";

function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "all" || stored === "essential") return stored;
  return null;
}

export function CookiePopup() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleChoice = useCallback((choice: ConsentChoice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
    setShowSettings(false);
  }, []);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === null) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[81] w-[calc(100%-2rem)] max-w-lg"
          >
            <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {" "}
              {!showSettings ? (
                /* Simple View */
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                      <HiShieldCheck className="text-amber text-xl" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-base mb-1">
                        Cookie Preferences
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        We use cookies to enhance your browsing experience, analyze site traffic,
                        and deliver personalized content. By clicking &ldquo;Accept All&rdquo;, you
                        consent to our use of cookies. You can learn more in our{" "}
                        <a
                          href="/cookie-policy"
                          className="text-amber hover:text-amber-light underline transition-colors"
                        >
                          Cookie Policy
                        </a>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleChoice("all")}
                      className="flex-1 px-5 py-2.5 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={() => handleChoice("essential")}
                      className="flex-1 px-5 py-2.5 bg-white/5 text-gray-300 font-semibold text-sm rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-all active:scale-95"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white/5 text-gray-400 font-semibold text-sm rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-all active:scale-95"
                    >
                      <HiCog6Tooth className="text-base" />
                      <span className="hidden sm:inline">Settings</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Settings View */
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center">
                        <HiCog6Tooth className="text-amber text-lg" />
                      </div>
                      <h3 className="font-heading font-bold text-white text-base">
                        Cookie Settings
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Close settings"
                    >
                      <HiXMark className="text-lg" />
                    </button>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed mb-4">
                    Select your cookie preferences below. Essential cookies are always enabled as
                    they are required for the website to function properly.
                  </p>

                  <div className="space-y-3 mb-5">
                    <CookieInfo
                      label="Essential Cookies"
                      description="Required for core website functionality such as security, network management, and accessibility. These cannot be disabled."
                    />
                    <CookieInfo
                      label="Analytics Cookies"
                      description="Help us understand how visitors interact with our website by collecting and reporting information anonymously."
                    />
                    <CookieInfo
                      label="Marketing Cookies"
                      description="Used to deliver relevant advertisements and measure the effectiveness of advertising campaigns."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChoice("all")}
                      className="flex-1 px-5 py-2.5 bg-amber text-black font-bold text-sm rounded-xl hover:bg-amber-light transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={() => handleChoice("essential")}
                      className="flex-1 px-5 py-2.5 bg-white/5 text-gray-300 font-semibold text-sm rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-all active:scale-95"
                    >
                      Essential Only
                    </button>
                  </div>
                </div>
              )}
              {/* Footer link */}
              <div className="border-t border-white/5 px-6 py-3 flex items-center justify-between">
                <a
                  href="/privacy-policy"
                  className="text-[11px] text-gray-500 hover:text-amber transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/cookie-policy"
                  className="text-[11px] text-gray-500 hover:text-amber transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CookieInfo({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/5">
      <HiCheck className="text-amber text-sm mt-0.5 shrink-0" />
      <div className="min-w-0">
        <h4 className="text-white text-xs font-semibold mb-0.5">{label}</h4>
        <p className="text-gray-500 text-[11px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
