"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowRight, HiChevronDown, HiEnvelope } from "react-icons/hi2";

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
  { label: "$300 – $1,000", value: "300-1000" },
  { label: "$1,000 – $3,000", value: "1000-3000" },
  { label: "$3,000 – $5,000", value: "3000-5000" },
  { label: "$5,000 – $7,000", value: "5000-7000" },
  { label: "$7,000 – $10,000", value: "7000-10000" },
  { label: "$10K – $12K", value: "10000-12000" },
  { label: "$12K – $15K", value: "12000-15000" },
  { label: "$15K – $20K", value: "15000-20000" },
];

export function Contact() {
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
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setBudgetOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs font-bold text-amber uppercase tracking-[0.2em] mb-4">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-tight md:leading-none tracking-tight mb-3">
            Let&apos;s{" "}
            <span className="text-amber">Talk</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-amber/50 pl-4 sm:pl-6 mt-3">
            Ready to start your project? Fill out the form and we&apos;ll get
            back to you within 24 hours.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-5"
          >
            {submitted ? (
              <motion.div
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card-dark rounded-2xl p-12 border border-amber/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6 border border-amber/20">
                  <HiEnvelope className="text-amber text-2xl" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-3">
                  Message Sent!
                </h3>
                <p className="text-gray-400">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                      placeholder="Your name *"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                      placeholder="you@company.com *"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                    placeholder="Company name"
                  />
                </div>

                {/* Services Dropdown */}
                <div ref={servicesRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex items-center justify-between bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-left transition-colors hover:border-white/20 focus:border-amber/50 focus:outline-none"
                  >
                    <span className={selectedServices.length > 0 ? "text-white text-sm" : "text-gray-600 text-sm"}>
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
                    <div className="absolute z-20 mt-2 w-full bg-card-dark border border-white/10 rounded-xl py-2 shadow-2xl max-h-64 overflow-y-auto">
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
                                checked
                                  ? "bg-amber border-amber"
                                  : "border-white/20"
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

                {/* Project Budget — Split: Dropdown + Custom */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Project Budget
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Budget Range Dropdown (left half) */}
                    <div ref={budgetRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setBudgetOpen(!budgetOpen)}
                        className="w-full flex items-center justify-between bg-card-dark border border-white/10 rounded-xl px-3 py-3 text-left transition-colors hover:border-white/20 focus:border-amber/50 focus:outline-none"
                      >
                        <span className={selectedBudget ? "text-white text-xs truncate" : "text-gray-600 text-xs"}>
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
                        <div className="absolute z-20 mt-2 w-full bg-card-dark border border-white/10 rounded-xl py-1 shadow-2xl max-h-52 overflow-y-auto">
                          {budgetRanges.map((range) => {
                            const active = selectedBudget === range.value;
                            return (
                              <button
                                key={range.value}
                                type="button"
                                onClick={() => {
                                  setSelectedBudget(range.value);
                                  setBudgetOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                  active
                                    ? "text-amber bg-amber/5 font-medium"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                                }`}
                              >
                                {range.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Custom Budget Input (right half) */}
                    <div className="relative">
                      <input
                        type="text"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        className="w-full bg-card-dark border border-white/10 rounded-xl px-3 py-3 text-white text-xs placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors"
                        placeholder="Custom budget"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full bg-card-dark border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amber/50 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project *"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full px-8 py-4 bg-amber text-black font-heading font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-amber-light transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95"
                >
                  Send Message
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
