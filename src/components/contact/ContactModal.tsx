"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowRight, HiChevronDown, HiEnvelope, HiXMark } from "react-icons/hi2";
import { useLanguage } from "@/lib/LanguageContext";
import { tLabel } from "@/lib/stratifit-i18n";

// ── Module-level event emitter ──────────────────────────────────────────────
let _openCb: (() => void) | null = null;
export function openContactModal() {
  _openCb?.();
}

export function registerOpenHandler(cb: () => void) {
  _openCb = cb;
}

// ── Data ────────────────────────────────────────────────────────────────────
const services = [
  "Brand Design",
  "Logo Design",
  "Visual Identity",
  "Brand Strategy",
  "Brand Guidelines",
  "Website Development",
  "AI Automation",
  "Growth Marketing",
];

const budgetRanges = [
  { label: "$300 – $1,000", value: "300–1000" },
  { label: "$1,000 – $3,000", value: "1000–3000" },
  { label: "$3,000 – $5,000", value: "3000–5000" },
  { label: "$5,000 – $7,000", value: "5000–7000" },
  { label: "$7,000 – $10,000", value: "7000–10000" },
  { label: "$10K – $12K", value: "10000–12000" },
  { label: "$12K – $15K", value: "12000–15000" },
  { label: "$15K – $20K", value: "15000–20000" },
];

// ── Component ───────────────────────────────────────────────────────────────
export function ContactModal() {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  // Register the open handler
  useEffect(() => {
    registerOpenHandler(() => setOpen(true));
    return () => {
      registerOpenHandler(() => {});
    };
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Form state ────────────────────────────────────────────────────────
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node))
        setServicesOpen(false);
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) setBudgetOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const close = useCallback(() => {
    setOpen(false);
    // Reset after close animation completes
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", company: "", message: "" });
      setSelectedServices([]);
      setSelectedBudget("");
      setCustomBudget("");
      setServicesOpen(false);
      setBudgetOpen(false);
    }, 300);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-card-dark rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Shimmer border line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber/60 to-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />

            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6 border border-amber/20">
                    <HiEnvelope className="text-amber text-2xl" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white mb-3">Message Sent!</h3>
                  <p className="text-gray-400 text-sm">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-amber uppercase tracking-[0.3em] mb-2">
                      Get in Touch
                    </p>
                    <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                      Tell us about your <span className="text-amber">project</span>
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                        placeholder={tLabel("form_name", lang)}
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                        placeholder={tLabel("form_email", lang)}
                      />
                    </div>

                    {/* Company */}
                    <input
                      type="text"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                      placeholder={tLabel("form_company", lang)}
                    />

                    {/* Services Dropdown */}
                    <div ref={servicesRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setServicesOpen(!servicesOpen)}
                        className="w-full flex items-center justify-between bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-left transition-colors hover:border-white/20 focus:border-amber/50 focus:outline-none"
                      >
                        <span
                          className={
                            selectedServices.length > 0
                              ? "text-white text-sm"
                              : "text-gray-600 text-sm"
                          }
                        >
                          {selectedServices.length > 0
                            ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} selected`
                            : "Select services you're interested in"}
                        </span>
                        <HiChevronDown
                          className={`text-gray-500 transition-transform duration-200 ${
                            servicesOpen ? "rotate-180 text-amber" : ""
                          }`}
                        />
                      </button>
                      {servicesOpen && (
                        <div className="absolute z-30 mt-2 w-full bg-card-dark border border-white/10 rounded-xl py-2 shadow-2xl max-h-56 overflow-y-auto">
                          {services.map((service) => {
                            const checked = selectedServices.includes(service);
                            return (
                              <label
                                key={service}
                                onClick={() => toggleService(service)}
                                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                    checked ? "bg-amber border-amber" : "border-white/20"
                                  }`}
                                >
                                  {checked && (
                                    <svg
                                      className="w-3 h-3 text-black"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={`text-sm transition-colors ${
                                    checked ? "text-amber font-medium" : "text-gray-400"
                                  }`}
                                >
                                  {service}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Budget */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Project Budget
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div ref={budgetRef} className="relative">
                          <button
                            type="button"
                            onClick={() => setBudgetOpen(!budgetOpen)}
                            className="w-full flex items-center justify-between bg-card-dark border border-white/10 rounded-xl px-3 py-3 text-left transition-colors hover:border-white/20 focus:border-amber/50 focus:outline-none"
                          >
                            <span
                              className={
                                selectedBudget
                                  ? "text-white text-xs truncate"
                                  : "text-gray-600 text-xs"
                              }
                            >
                              {selectedBudget
                                ? budgetRanges.find((r) => r.value === selectedBudget)?.label
                                : "Select range"}
                            </span>
                            <HiChevronDown
                              className={`text-gray-500 text-sm shrink-0 ml-1 transition-transform duration-200 ${
                                budgetOpen ? "rotate-180 text-amber" : ""
                              }`}
                            />
                          </button>
                          {budgetOpen && (
                            <div className="absolute z-30 mt-2 w-full bg-card-dark border border-white/10 rounded-xl py-1 shadow-2xl max-h-52 overflow-y-auto">
                              {budgetRanges.map((range) => (
                                <button
                                  key={range.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedBudget(range.value);
                                    setBudgetOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                    selectedBudget === range.value
                                      ? "text-amber bg-amber/5 font-medium"
                                      : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                                  }`}
                                >
                                  {range.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          className="w-full bg-card-dark border border-white/10 rounded-xl px-3 py-3 text-white text-xs placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                          placeholder="Custom budget"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project *"
                    />

                    {/* Submit */}
                    <button
                      type="submit"
                      className="group w-full px-8 py-4 bg-amber text-black font-heading font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95 text-sm"
                    >
                      Send Message
                      <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
