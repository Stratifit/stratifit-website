"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { openContactModal } from "@/components/contact/ContactModal";
import {
  HiArrowRight,
  HiSparkles,
  HiSun,
  HiCubeTransparent,
  HiHeart,
  HiArrowPath,
  HiBolt,
  HiCommandLine,
  HiPaintBrush,
  HiBolt as HiBoltIcon,
  HiServer,
  HiCpuChip,
  HiCircleStack,
  HiChatBubbleLeftRight,
  HiChartBar,
  HiGlobeAlt,
  HiShieldCheck,
} from "react-icons/hi2";

const stats = [
  { target: "59", suffix: "+", label: ["Projects", "Delivered"] },
  { target: "7", suffix: "+", label: ["Years", "Experience"] },
  { target: "98", suffix: "%", label: ["Client", "Satisfaction"] },
];

const techStack = [
  { name: "Next.js", icon: HiCommandLine, color: "text-white" },
  { name: "Tailwind CSS", icon: HiPaintBrush, color: "text-cyan-400" },
  { name: "Framer Motion", icon: HiBoltIcon, color: "text-pink-400" },
  { name: "GSAP", icon: HiBoltIcon, color: "text-green-400" },
  { name: "React", icon: HiCommandLine, color: "text-blue-400" },
  { name: "TypeScript", icon: HiCommandLine, color: "text-blue-500" },
  { name: "Vercel", icon: HiServer, color: "text-white" },
  { name: "OpenAI", icon: HiCpuChip, color: "text-green-300" },
  { name: "Make.com", icon: HiCircleStack, color: "text-purple-400" },
  { name: "Vapi", icon: HiChatBubbleLeftRight, color: "text-indigo-400" },
  { name: "Tidio AI", icon: HiChatBubbleLeftRight, color: "text-blue-300" },
  { name: "Resend", icon: HiCommandLine, color: "text-white" },
  { name: "Meta Ads", icon: HiChartBar, color: "text-blue-400" },
  { name: "Google Ads", icon: HiGlobeAlt, color: "text-yellow-400" },
  { name: "GA4", icon: HiChartBar, color: "text-orange-400" },
  { name: "Hotjar", icon: HiShieldCheck, color: "text-red-400" },
  { name: "HubSpot", icon: HiCircleStack, color: "text-orange-500" },
  { name: "TikTok Ads", icon: HiChartBar, color: "text-white" },
];

const trustedBy = [
  { name: "LUMEN", icon: HiSun },
  { name: "NOVUS", icon: HiCubeTransparent },
  { name: "PULSE", icon: HiHeart },
  { name: "VERTEX", icon: HiArrowPath },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-24 pb-4 md:pt-20 md:pb-8"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-amber/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        {" "}
        <div className="grid lg:grid-cols-1 gap-8 md:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-3 md:space-y-8 lg:max-w-4xl lg:mx-auto">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3.5 md:space-y-6 lg:text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-amber uppercase tracking-[0.2em]">
                  Premium Digital Agency
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-5xl text-center lg:whitespace-nowrap font-heading font-black leading-[1.05] md:leading-[0.95] tracking-tight">
                We Build Websites,
                <span className="hidden lg:inline"> </span>
                <br className="lg:hidden" />
                Brands &amp; Systems
                <br />
                <span className="text-amber lg:inline-block lg:w-full lg:text-center">
                  That Grow Businesses.
                </span>
              </h1>

              <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto text-center">
                We help startups and businesses build brands, websites, and systems that turn
                visitors into paying customers.
              </p>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-center"
            >
              <button
                onClick={openContactModal}
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-amber text-black font-bold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:bg-amber-light transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 text-sm sm:text-base"
              >
                Start Your Project
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={openContactModal}
                className="px-6 sm:px-8 py-3.5 sm:py-4 border border-white/15 text-white font-semibold rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:border-amber/50 hover:text-amber transition-all active:scale-95 text-sm sm:text-base"
              >
                <HiSparkles className="shrink-0" />
                Book a Strategy Call
              </button>
            </motion.div>

            {/* Stats with Counters (data-target animation) */}
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-6 lg:gap-6 pt-3 pb-3 md:pt-3 md:pb-0 border-t border-white/5 lg:border-t-0 place-items-center text-center"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label[0]}
                  className="flex flex-col lg:flex-row items-center lg:justify-center text-center px-2 sm:px-4 lg:px-0.5 lg:whitespace-nowrap pb-0 gap-1"
                >
                  <div
                    data-target={stat.target}
                    data-suffix={stat.suffix}
                    className="text-2xl sm:text-3xl font-heading font-black text-amber mb-0.5 lg:mb-0 leading-none"
                  >
                    0
                  </div>
                  <div className="text-[9px] sm:text-[10px] lg:text-sm font-bold text-gray-500 uppercase tracking-wider leading-tight">
                    {stat.label[0]}
                    <br className="lg:hidden" />
                    <span className="hidden lg:inline"> </span>
                    {stat.label[1]}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual - Hidden on mobile */}
        </div>
        {/* Trust Row */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-2 md:mt-8 space-y-2 pt-0 pb-3 lg:max-w-3xl lg:mx-auto"
        >
          {/* Mobile: centered label with horizontal lines */}
          <div className="sm:hidden flex items-center gap-3 opacity-70">
            <span className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shrink-0 text-white">
              Trusted by <span style={{ color: "#F59E0B" }}>Growing</span> Companies
            </span>
            <span className="flex-1 h-px bg-white/10" />
          </div>
          {/* Items row */}
          <div className="flex items-center justify-between lg:justify-start gap-2 sm:gap-6 md:gap-8 opacity-70 px-4 sm:px-0 whitespace-nowrap shrink-0">
            <span className="hidden sm:inline text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-white shrink-0">
              Trusted by <span style={{ color: "#F59E0B" }}>Growing</span> Companies
            </span>
            {trustedBy.map(({ name, icon: Icon }) => (
              <span
                key={name}
                className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-heading font-black tracking-[0.15em] sm:tracking-[0.3em] whitespace-nowrap shrink-0"
              >
                <Icon className="text-gray-300 text-sm sm:text-lg shrink-0" />
                <span className="text-gray-100">{name}</span>
              </span>
            ))}
          </div>
        </motion.div>
        {/* Tech Stack */}
        <div className="mt-3 md:mt-4">
          <div className="mb-4 lg:text-center">
            <h3 className="text-base sm:text-lg font-heading font-black tracking-tight mb-1 flex items-center justify-center gap-4 max-w-2xl mx-auto">
              <span className="inline-block flex-1 h-px bg-white/10" />
              <span>
                <span className="text-white/70">Our </span>
                <span style={{ color: "#F59E0B" }}>Tech</span>
                <span className="text-white/70"> Stack</span>
              </span>
              <span className="inline-block flex-1 h-px bg-white/10" />
            </h3>
            <p
              className="text-sm sm:text-base leading-relaxed text-center"
              style={{ color: "#E5E7EB" }}
            >
              We use the best tools in the industry to build, automate, and scale your digital
              presence.
            </p>
          </div>
          <div className="overflow-hidden py-4 md:py-6">
            <div className="flex animate-ticker-tech">
              {[...techStack, ...techStack].map((tech, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 sm:gap-2 shrink-0 px-3 sm:px-8 text-sm sm:text-lg whitespace-nowrap"
                >
                  <tech.icon
                    className="text-xl sm:text-2xl shrink-0"
                    style={{ color: "#6B7280" }}
                  />
                  <span className="font-medium" style={{ color: "#9CA3AF" }}>
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
